// ============================================================================
// Owlivion Mail - Notification Service
// ============================================================================

import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

// Audio context for notification sound
let audioContext: AudioContext | null = null;

/**
 * Initialize the audio context (must be called after user interaction)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a notification sound using Web Audio API
 */
export async function playNotificationSound(): Promise<void> {
  try {
    const ctx = getAudioContext();

    // Resume audio context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    // Create a pleasant notification sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pleasant two-tone notification
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.setValueAtTime(1108.73, ctx.currentTime + 0.1); // C#6

    // Envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.12);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

    oscillator.type = 'sine';
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (err) {
    console.warn('Failed to play notification sound:', err);
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    let permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }

    return permissionGranted;
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return false;
  }
}

/**
 * Check if notification permission is granted
 */
export async function checkNotificationPermission(): Promise<boolean> {
  try {
    return await isPermissionGranted();
  } catch (err) {
    console.error('Failed to check notification permission:', err);
    return false;
  }
}

/**
 * Show a desktop notification for new email
 */
export async function showNewEmailNotification(
  senderName: string,
  subject: string,
  preview?: string
): Promise<void> {
  try {
    const permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return;
    }

    // Send notification via Tauri
    await sendNotification({
      title: `Yeni E-posta: ${senderName}`,
      body: subject + (preview ? `\n${preview.substring(0, 100)}...` : ''),
      icon: 'icons/icon.png',
    });

    // Also play sound
    await playNotificationSound();
  } catch (err) {
    console.error('Failed to show notification:', err);
  }
}

/**
 * Show a generic notification
 */
export async function showNotification(title: string, body: string): Promise<void> {
  try {
    const permissionGranted = await isPermissionGranted();

    if (!permissionGranted) {
      console.log('Notification permission not granted');
      return;
    }

    await sendNotification({
      title,
      body,
      icon: 'icons/icon.png',
    });
  } catch (err) {
    console.error('Failed to show notification:', err);
  }
}
