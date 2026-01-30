//! Crypto module for password encryption/decryption
//!
//! Uses AES-256-GCM for secure password storage.

use base64::Engine;
use ring::aead::{Aad, LessSafeKey, Nonce, UnboundKey, AES_256_GCM};
use ring::rand::{SecureRandom, SystemRandom};
use std::env;

const NONCE_LEN: usize = 12;

/// Get encryption key derived from machine-specific data
/// Uses a combination of machine ID and application secret
fn get_encryption_key() -> [u8; 32] {
    // Base secret (should be unique per installation)
    let machine_id = get_machine_id();
    let app_secret = "owlivion-mail-v1";

    // Derive key using simple hashing (in production, use proper KDF like HKDF)
    let combined = format!("{}:{}", machine_id, app_secret);
    let mut key = [0u8; 32];

    // Simple key derivation by hashing combined string
    // Using ring's digest for proper hashing
    let digest = ring::digest::digest(&ring::digest::SHA256, combined.as_bytes());
    key.copy_from_slice(digest.as_ref());

    key
}

/// Get a unique machine identifier
fn get_machine_id() -> String {
    // Try to get machine ID from various sources
    // 1. Environment variable (for testing/override)
    if let Ok(id) = env::var("OWLIVION_MACHINE_ID") {
        return id;
    }

    // 2. Try to read machine-id (Linux)
    #[cfg(target_os = "linux")]
    if let Ok(id) = std::fs::read_to_string("/etc/machine-id") {
        return id.trim().to_string();
    }

    // 3. Try to get hostname as fallback
    if let Ok(hostname) = hostname::get() {
        if let Some(h) = hostname.to_str() {
            return h.to_string();
        }
    }

    // 4. Fallback to a fixed string (least secure but functional)
    "owlivion-default-key".to_string()
}

/// Encrypt a password
/// Returns base64-encoded ciphertext with prepended nonce
pub fn encrypt_password(password: &str) -> Result<String, String> {
    let key_bytes = get_encryption_key();
    let unbound_key =
        UnboundKey::new(&AES_256_GCM, &key_bytes).map_err(|e| format!("Key error: {:?}", e))?;
    let key = LessSafeKey::new(unbound_key);

    // Generate random nonce
    let rng = SystemRandom::new();
    let mut nonce_bytes = [0u8; NONCE_LEN];
    rng.fill(&mut nonce_bytes)
        .map_err(|e| format!("RNG error: {:?}", e))?;

    // Prepare plaintext with space for tag
    let mut in_out = password.as_bytes().to_vec();

    // Encrypt in place
    let nonce = Nonce::assume_unique_for_key(nonce_bytes);
    key.seal_in_place_append_tag(nonce, Aad::empty(), &mut in_out)
        .map_err(|e| format!("Encryption error: {:?}", e))?;

    // Prepend nonce to ciphertext
    let mut result = Vec::with_capacity(NONCE_LEN + in_out.len());
    result.extend_from_slice(&nonce_bytes);
    result.extend_from_slice(&in_out);

    // Base64 encode
    Ok(base64::engine::general_purpose::STANDARD.encode(&result))
}

/// Decrypt a password
/// Takes base64-encoded ciphertext with prepended nonce
pub fn decrypt_password(encrypted: &str) -> Result<String, String> {
    // Base64 decode
    let data = base64::engine::general_purpose::STANDARD
        .decode(encrypted)
        .map_err(|e| format!("Base64 decode error: {}", e))?;

    if data.len() < NONCE_LEN + 16 {
        // Minimum: nonce + tag
        return Err("Encrypted data too short".to_string());
    }

    let key_bytes = get_encryption_key();
    let unbound_key =
        UnboundKey::new(&AES_256_GCM, &key_bytes).map_err(|e| format!("Key error: {:?}", e))?;
    let key = LessSafeKey::new(unbound_key);

    // Extract nonce and ciphertext
    let (nonce_bytes, ciphertext) = data.split_at(NONCE_LEN);
    let nonce = Nonce::try_assume_unique_for_key(nonce_bytes)
        .map_err(|_| "Invalid nonce".to_string())?;

    // Decrypt in place
    let mut in_out = ciphertext.to_vec();
    let plaintext = key
        .open_in_place(nonce, Aad::empty(), &mut in_out)
        .map_err(|_| "Decryption failed - invalid key or corrupted data".to_string())?;

    String::from_utf8(plaintext.to_vec()).map_err(|e| format!("UTF-8 decode error: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encrypt_decrypt() {
        let password = "my_secret_password123!";
        let encrypted = encrypt_password(password).expect("Encryption failed");

        // Encrypted should be base64 and different from original
        assert_ne!(encrypted, password);
        assert!(encrypted.len() > password.len());

        // Decrypt should return original
        let decrypted = decrypt_password(&encrypted).expect("Decryption failed");
        assert_eq!(decrypted, password);
    }

    #[test]
    fn test_different_encryptions() {
        let password = "test_password";
        let encrypted1 = encrypt_password(password).expect("Encryption 1 failed");
        let encrypted2 = encrypt_password(password).expect("Encryption 2 failed");

        // Due to random nonce, encryptions should be different
        assert_ne!(encrypted1, encrypted2);

        // Both should decrypt to same value
        let decrypted1 = decrypt_password(&encrypted1).expect("Decryption 1 failed");
        let decrypted2 = decrypt_password(&encrypted2).expect("Decryption 2 failed");
        assert_eq!(decrypted1, password);
        assert_eq!(decrypted2, password);
    }

    #[test]
    fn test_empty_password() {
        let password = "";
        let encrypted = encrypt_password(password).expect("Encryption failed");
        let decrypted = decrypt_password(&encrypted).expect("Decryption failed");
        assert_eq!(decrypted, password);
    }

    #[test]
    fn test_unicode_password() {
        let password = "şifre123!@#$%ğüışöç";
        let encrypted = encrypt_password(password).expect("Encryption failed");
        let decrypted = decrypt_password(&encrypted).expect("Decryption failed");
        assert_eq!(decrypted, password);
    }
}
