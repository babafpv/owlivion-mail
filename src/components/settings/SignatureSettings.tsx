// ============================================================================
// Owlivion Mail - Signature Settings
// ============================================================================

import { useState } from 'react';
import type { Account } from '../../types';

interface SignatureSettingsProps {
  accounts: Account[];
  onAccountsChange: (accounts: Account[]) => void;
}

// Berkan Çetinel Adaptive Signature HTML (embedded)
const BERKAN_ADAPTIVE_SIGNATURE = `<style>
.sig-card{background:linear-gradient(135deg,#fff 0%,#f8f9fc 100%)!important;border:1px solid #e5e7eb!important}
.sig-name{color:#1f2937!important}.sig-desc{color:#6b7280!important}
.sig-link-green{color:#059669!important}.sig-link-purple{color:#6d28d9!important}
.sig-border{border-left-color:#7c3aed!important}
.sig-badge-green{background:#10b981!important;color:#fff!important}
.sig-badge-purple{background:#7c3aed!important;color:#fff!important}
.sig-dot-green{color:#10b981!important}.sig-dot-purple{color:#7c3aed!important}
.sig-slogan{color:#9ca3af!important}.sig-gh{background:#24292e!important}
.sig-x{background:#14171a!important}
.owlivion-logo-light{display:block!important}.owlivion-logo-dark{display:none!important}
@media(prefers-color-scheme:dark){
.sig-card{background:linear-gradient(135deg,#0f0f0f 0%,#1a1a2e 100%)!important;border:1px solid #333!important}
.sig-name{color:#fff!important}.sig-desc{color:#a0a0a0!important}
.sig-link-green{color:#00ff88!important}.sig-link-purple{color:#8B5CF6!important}
.sig-border{border-left-color:#8B5CF6!important}
.sig-badge-green{background:#00ff88!important;color:#000!important}
.sig-badge-purple{background:#8B5CF6!important;color:#fff!important}
.sig-dot-green{color:#00ff88!important}.sig-dot-purple{color:#8B5CF6!important}
.sig-slogan{color:#888!important}.sig-gh{background:#333!important}
.sig-x{background:#000!important;border:1px solid #333!important}
.owlivion-logo-light{display:none!important}.owlivion-logo-dark{display:block!important}
}
</style>
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Segoe UI',-apple-system,Arial,sans-serif;max-width:550px">
<tr><td style="padding:0">
<table class="sig-card" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-radius:12px;overflow:hidden">
<tr><td style="padding:24px">
<table cellpadding="0" cellspacing="0" border="0" style="width:100%">
<tr>
<td style="vertical-align:top;width:140px;padding-right:20px">
<table cellpadding="0" cellspacing="0" border="0">
<tr><td style="text-align:center;padding-bottom:8px">
<a href="https://babafpv.com" style="text-decoration:none"><img src="https://babafpv.com/logo.webp" alt="BabaFPV" width="100" style="display:block;border-radius:8px"></a>
</td></tr>
<tr><td style="padding:6px 0"><div style="width:60px;height:1px;margin:0 auto;background:linear-gradient(90deg,transparent,#10b981,transparent)"></div></td></tr>
<tr><td style="text-align:center">
<a href="https://owlivion.com" style="text-decoration:none">
<img class="owlivion-logo-light" src="https://owlivion.com/mail/owlivion-text.png" alt="Owlivion" width="100" style="margin:0 auto">
<img class="owlivion-logo-dark" src="https://owlivion.com/mail/owlivion-text-dark.png" alt="Owlivion" width="100" style="margin:0 auto">
</a>
</td></tr>
</table>
</td>
<td class="sig-border" style="vertical-align:top;border-left:2px solid;padding-left:20px">
<table cellpadding="0" cellspacing="0" border="0" style="width:100%">
<tr><td class="sig-name" style="font-size:22px;font-weight:700;letter-spacing:-0.5px;padding-bottom:6px">Berkan Çetinel</td></tr>
<tr><td style="padding-bottom:12px">
<span class="sig-badge-green" style="display:inline-block;font-size:9px;font-weight:700;padding:4px 8px;border-radius:4px;text-transform:uppercase;margin-right:4px">BabaFPV Founder</span>
<span class="sig-badge-purple" style="display:inline-block;font-size:9px;font-weight:700;padding:4px 8px;border-radius:4px;text-transform:uppercase">Owlivion Founder</span>
</td></tr>
<tr><td class="sig-desc" style="font-size:11px;padding-bottom:12px;line-height:1.5">
<span class="sig-dot-green">●</span> FPV Drone Pilot & Cinematographer<br>
<span class="sig-dot-purple">●</span> Tech & Software Solutions for Enterprise
</td></tr>
<tr><td style="padding-bottom:12px">
<a class="sig-link-green" href="https://babafpv.com" style="text-decoration:none;font-size:12px;font-weight:600;margin-right:16px">babafpv.com</a>
<a class="sig-link-purple" href="https://owlivion.com" style="text-decoration:none;font-size:12px;font-weight:600">owlivion.com</a>
</td></tr>
<tr><td>
<a href="https://youtube.com/@babafpv" style="display:inline-block;width:30px;height:30px;background:#FF0000;border-radius:6px;text-align:center;margin-right:6px"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIzLjQ5OCA2LjE4NmEzLjAxNiAzLjAxNiAwIDAgMC0yLjEyMi0yLjEzNkMxOS41MDUgMy41NDUgMTIgMy41NDUgMTIgMy41NDVzLTcuNTA1IDAtOS4zNzcuNTA1QTMuMDE3IDMuMDE3IDAgMCAwIC41MDIgNi4xODZDMCA4LjA3IDAgMTIgMCAxMnMwIDMuOTMuNTAyIDUuODE0YTMuMDE2IDMuMDE2IDAgMCAwIDIuMTIyIDIuMTM2YzEuODcxLjUwNSA5LjM3Ni41MDUgOS4zNzYuNTA1czcuNTA1IDAgOS4zNzctLjUwNWEzLjAxNSAzLjAxNSAwIDAgMCAyLjEyMi0yLjEzNkMyNCA1LjkzIDI0IDEyIDI0IDEycy0uMDAxIDMuOTMtLjUwMiA1LjgxNHpNOS41NDUgMTUuNTY4VjguNDMybDYuMjczIDMuNTY4LTYuMjczIDMuNTY4eiIvPjwvc3ZnPg==" width="16" height="16" style="margin-top:7px"></a>
<a href="https://instagram.com/babafpv" style="display:inline-block;width:30px;height:30px;background:linear-gradient(45deg,#f09433,#dc2743,#bc1888);border-radius:6px;text-align:center;margin-right:6px"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDIuMTYzYzMuMjA0IDAgMy41ODQuMDEyIDQuODUuMDcgMy4yNTIuMTQ4IDQuNzcxIDEuNjkxIDQuOTE5IDQuOTE5LjA1OCAxLjI2NS4wNjkgMS42NDUuMDY5IDQuODQ5cy0uMDEyIDMuNTg0LS4wNjkgNC44NDljLS4xNDkgMy4yMjUtMS42NjQgNC43NzEtNC45MTkgNC45MTktMS4yNjYuMDU4LTEuNjQ0LjA3LTQuODUuMDctMy4yMDQgMC0zLjU4NC0uMDEyLTQuODQ5LS4wNy0zLjI2LS4xNDktNC43NzEtMS42OTktNC45MTktNC45Mi0uMDU4LTEuMjY1LS4wNy0xLjY0NC0uMDctNC44NDlzLjAxMy0zLjU4My4wNy00Ljg0OWMuMTQ5LTMuMjI3IDEuNjY0LTQuNzcxIDQuOTE5LTQuOTE5IDEuMjY2LS4wNTcgMS42NDUtLjA2OSA0Ljg0OS0uMDY5em0wLTIuMTYzYy0zLjI1OSAwLTMuNjY3LjAxNC00LjkxNy4wNzItNC4zNTguMi02Ljc4IDIuNjE4LTYuOTggNi45OC0uMDU5IDEuMjgxLS4wNzMgMS42ODktLjA3MyA0Ljk0OCAwIDMuMjU5LjAxNCAzLjY2OC4wNzIgNC45NDguMiA0LjM1OCAyLjYxOCA2Ljc4IDYuOTggNi45OCAxLjI4MS4wNTggMS42ODkuMDcyIDQuOTQ4LjA3MiAzLjI1OSAwIDMuNjY4LS4wMTQgNC45NDgtLjA3MiA0LjM1NC0uMiA2Ljc4Mi0yLjYxOCA2Ljk3OS02Ljk4LjA1OS0xLjI4LjA3My0xLjY4OS4wNzMtNC45NDggMC0zLjI1OS0uMDE0LTMuNjY3LS4wNzItNC45MTctLjE5Ni00LjM1NC0yLjYxNy02Ljc4LTYuOTc5LTYuOTgtMS4yODEtLjA1OS0xLjY5LS4wNzMtNC45NDktLjA3M3ptMCA1LjgzOGMtMy40MDMgMC02LjE2MiAyLjc1OS02LjE2MiA2LjE2MnMyLjc1OSA2LjE2MyA2LjE2MiA2LjE2MyA2LjE2Mi0yLjc1OSA2LjE2Mi02LjE2M2MwLTMuNDAzLTIuNzU5LTYuMTYyLTYuMTYyLTYuMTYyem0wIDEwLjE2MmMtMi4yMDkgMC00LTEuNzktNC00IDAtMi4yMDkgMS43OTEtNCA0LTRzNCAxLjc5MSA0IDRjMCAyLjIxLTEuNzkxIDQtNCA0em02LjQwNi0xMS44NDVjLS43OTYgMC0xLjQ0MS42NDUtMS40NDEgMS40NHMuNjQ1IDEuNDQgMS40NDEgMS40NGMuNzk1IDAgMS40MzktLjY0NSAxLjQzOS0xLjQ0cy0uNjQ0LTEuNDQtMS40MzktMS40NHoiLz48L3N2Zz4=" width="16" height="16" style="margin-top:7px"></a>
<a href="https://github.com/babafpv" class="sig-gh" style="display:inline-block;width:30px;height:30px;border-radius:6px;text-align:center;margin-right:6px"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDBjLTYuNjI2IDAtMTIgNS4zNzMtMTIgMTIgMCA1LjMwMiAzLjQzOCA5LjggOC4yMDcgMTEuMzg3LjU5OS4xMTEuNzkzLS4yNjEuNzkzLS41Nzd2LTIuMjM0Yy0zLjMzOC43MjYtNC4wMzMtMS40MTYtNC4wMzMtMS40MTYtLjU0Ni0xLjM4Ny0xLjMzMy0xLjc1Ni0xLjMzMy0xLjc1Ni0xLjA4OS0uNzQ1LjA4My0uNzI5LjA4My0uNzI5IDEuMjA1LjA4NCAxLjgzOSAxLjIzNyAxLjgzOSAxLjIzNyAxLjA3IDEuODM0IDIuODA3IDEuMzA0IDMuNDkyLjk5Ny4xMDctLjc3NS40MTgtMS4zMDUuNzYyLTEuNjA0LTIuNjY1LS4zMDUtNS40NjctMS4zMzQtNS40NjctNS45MzEgMC0xLjMxMS40NjktMi4zODEgMS4yMzYtMy4yMjEtLjEyNC0uMzAzLS41MzUtMS41MjQuMTE3LTMuMTc2IDAgMCAxLjAwOC0uMzIyIDMuMzAxIDEuMjMuOTU3LS4yNjYgMS45ODMtLjM5OSAzLjAwMy0uNDA0IDEuMDIuMDA1IDIuMDQ3LjEzOCAzLjAwNi40MDQgMi4yOTEtMS41NTIgMy4yOTctMS4yMyAzLjI5Ny0xLjIzLjY1MyAxLjY1My4yNDIgMi44NzQuMTE4IDMuMTc2Ljc3Ljg0IDEuMjM1IDEuOTExIDEuMjM1IDMuMjIxIDAgNC42MDktMi44MDcgNS42MjQtNS40NzkgNS45MjEuNDMuMzcyLjgyMyAxLjEwMi44MjMgMi4yMjJ2My4yOTNjMCAuMzE5LjE5Mi42OTQuODAxLjU3NiA0Ljc2NS0xLjU4OSA4LjE5OS02LjA4NiA4LjE5OS0xMS4zODYgMC02LjYyNy01LjM3My0xMi0xMi0xMnoiLz48L3N2Zz4=" width="16" height="16" style="margin-top:7px"></a>
<a href="https://x.com/babafpv" class="sig-x" style="display:inline-block;width:30px;height:30px;border-radius:6px;text-align:center;margin-right:6px"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE4LjI0NCAyLjI1aDMuMzA4bC03LjIyNyA4LjI2IDguNTAyIDExLjI0SDE2LjE3bC01LjIxNC02LjgxN0w0Ljk5IDIxLjc1SDEuNjhsNy43My04LjgzNUwxLjI1NCAyLjI1SDguMDhsNC43MTMgNi4yMzF6bS0xLjE2MSAxNy41MmgxLjgzM0w3LjA4NCA0LjEyNkg1LjExN3oiLz48L3N2Zz4=" width="14" height="14" style="margin-top:8px"></a>
<a href="https://linkedin.com/in/babafpv" style="display:inline-block;width:30px;height:30px;background:#0A66C2;border-radius:6px;text-align:center"><img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwLjQ0NyAyMC40NTJoLTMuNTU0di01LjU2OWMwLTEuMzI4LS4wMjctMy4wMzctMS44NTItMy4wMzctMS44NTMgMC0yLjEzNiAxLjQ0NS0yLjEzNiAyLjkzOXY1LjY2N0g5LjM1MVY5aDMuNDE0djEuNTYxaC4wNDZjLjQ3Ny0uOSAxLjYzNy0xLjg1IDMuMzctMS44NSAzLjYwMSAwIDQuMjY3IDIuMzcgNC4yNjcgNS40NTV2Ni4yODZ6TTUuMzM3IDcuNDMzYy0xLjE0NCAwLTIuMDYzLS45MjYtMi4wNjMtMi4wNjUgMC0xLjEzOC45Mi0yLjA2MyAyLjA2My0yLjA2MyAxLjE0IDAgMi4wNjQuOTI1IDIuMDY0IDIuMDYzIDAgMS4xMzktLjkyNSAyLjA2NS0yLjA2NCAyLjA2NXptMS43ODIgMTMuMDE5SDMuNTU1VjloMy41NjR2MTEuNDUyek0yMi4yMjUgMEgxLjc3MUMuNzkyIDAgMCAuNzc0IDAgMS43Mjl2MjAuNTQyQzAgMjMuMjI3Ljc5MiAyNCAxLjc3MSAyNGgyMC40NTFDMjMuMiAyNCAyNCAyMy4yMjcgMjQgMjIuMjcxVjEuNzI5QzI0IC43NzQgMjMuMiAwIDIyLjIyMiAweiIvPjwvc3ZnPg==" width="16" height="16" style="margin-top:7px"></a>
</td></tr>
</table>
</td>
</tr>
</table>
</td></tr>
<tr><td style="height:3px;background:linear-gradient(90deg,#10b981 0%,#7c3aed 50%,#10b981 100%)"></td></tr>
</table>
<table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin-top:10px">
<tr><td class="sig-slogan" style="font-size:10px;font-style:italic;text-align:center;letter-spacing:0.5px">"Innovation from above, solutions from within" 🚀</td></tr>
</table>
</td></tr>
</table>`;

// Pre-built signature templates
const SIGNATURE_TEMPLATES = [
  {
    id: 'none',
    name: 'İmza Yok',
    description: 'İmza kullanma',
    preview: null,
    html: '',
  },
  {
    id: 'berkan-adaptive',
    name: 'Berkan Çetinel - Adaptive',
    description: 'BabaFPV & Owlivion Founder - Otomatik Light/Dark mode',
    preview: null,
    html: BERKAN_ADAPTIVE_SIGNATURE,
  },
  {
    id: 'simple',
    name: 'Basit İmza',
    description: 'Sadece isim ve e-posta',
    preview: null,
    html: `<div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
<p style="margin: 0;"><strong>{{name}}</strong></p>
<p style="margin: 0; color: #666;">{{email}}</p>
</div>`,
  },
  {
    id: 'professional',
    name: 'Profesyonel',
    description: 'İsim, ünvan ve iletişim bilgileri',
    preview: null,
    html: `<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif;">
<tr>
<td style="padding-right: 15px; border-right: 2px solid #7c3aed;">
<p style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">{{name}}</p>
<p style="margin: 4px 0 0 0; font-size: 12px; color: #6b7280;">{{title}}</p>
</td>
<td style="padding-left: 15px;">
<p style="margin: 0; font-size: 12px; color: #6b7280;">{{email}}</p>
<p style="margin: 2px 0 0 0; font-size: 12px; color: #6b7280;">{{phone}}</p>
<p style="margin: 2px 0 0 0; font-size: 12px; color: #7c3aed;">{{website}}</p>
</td>
</tr>
</table>`,
  },
];

export function SignatureSettings({ accounts, onAccountsChange }: SignatureSettingsProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>(accounts[0]?.id?.toString() || '');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none');
  const [customHtml, setCustomHtml] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const currentAccount = accounts.find(a => a.id.toString() === selectedAccount);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = SIGNATURE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      // Replace placeholders with account data
      let html = template.html;
      if (currentAccount && templateId !== 'berkan-adaptive') {
        html = html
          .replace(/\{\{name\}\}/g, currentAccount.displayName || '')
          .replace(/\{\{email\}\}/g, currentAccount.email || '')
          .replace(/\{\{title\}\}/g, '')
          .replace(/\{\{phone\}\}/g, '')
          .replace(/\{\{website\}\}/g, '');
      }
      setCustomHtml(html);
    }
  };

  const handleSaveSignature = () => {
    if (!currentAccount) return;

    const signatureHtml = customHtml;

    const updatedAccounts = accounts.map(acc =>
      acc.id.toString() === selectedAccount
        ? { ...acc, signature: signatureHtml }
        : acc
    );
    onAccountsChange(updatedAccounts);

    // TODO: Save to database via Tauri command
    alert('İmza kaydedildi!');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-owl-text">E-posta İmzaları</h2>
        <p className="mt-1 text-owl-text-secondary">
          Hesaplarınız için e-posta imzası seçin veya özelleştirin
        </p>
      </div>

      {/* Account Selector */}
      {accounts.length > 1 && (
        <div className="bg-owl-surface border border-owl-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-owl-text mb-4">Hesap Seçin</h3>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-4 py-3 bg-owl-bg border border-owl-border rounded-lg text-owl-text focus:outline-none focus:ring-2 focus:ring-owl-accent"
          >
            {accounts.map(account => (
              <option key={account.id} value={account.id.toString()}>
                {account.displayName} ({account.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Template Selection */}
      <div className="bg-owl-surface border border-owl-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-owl-text mb-4">İmza Şablonu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIGNATURE_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedTemplate === template.id
                  ? 'border-owl-accent bg-owl-accent/10'
                  : 'border-owl-border hover:border-owl-text-secondary bg-owl-surface-2'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-owl-text">{template.name}</h4>
                  <p className="text-sm text-owl-text-secondary mt-1">{template.description}</p>
                </div>
                {selectedTemplate === template.id && (
                  <svg className="w-5 h-5 text-owl-accent flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              {template.preview && (
                <a
                  href={template.preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 mt-2 text-xs text-owl-accent hover:underline"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Önizleme
                </a>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom HTML Editor */}
      {selectedTemplate !== 'none' && (
        <div className="bg-owl-surface border border-owl-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-owl-text">İmza Düzenleyici</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1.5 text-sm bg-owl-surface-2 hover:bg-owl-border text-owl-text rounded-lg transition-colors"
            >
              {showPreview ? 'HTML Düzenle' : 'Önizleme'}
            </button>
          </div>

          {showPreview ? (
            <div className="p-4 bg-white rounded-lg border border-owl-border min-h-[200px]">
              <div dangerouslySetInnerHTML={{ __html: customHtml }} />
            </div>
          ) : (
            <textarea
              value={customHtml}
              onChange={(e) => setCustomHtml(e.target.value)}
              className="w-full h-64 px-4 py-3 bg-owl-bg border border-owl-border rounded-lg text-owl-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-owl-accent resize-none"
              placeholder="HTML imza kodunuzu buraya yapıştırın..."
            />
          )}

          <p className="mt-2 text-xs text-owl-text-secondary">
            Değişkenler: {'{{name}}'}, {'{{email}}'}, {'{{title}}'}, {'{{phone}}'}, {'{{website}}'}
          </p>
        </div>
      )}

      {/* Adaptive Info (for berkan-adaptive template) */}
      {selectedTemplate === 'berkan-adaptive' && (
        <div className="p-3 bg-owl-accent/10 border border-owl-accent/20 rounded-lg">
          <p className="text-sm text-owl-accent">
            <strong>Adaptive İmza:</strong> Bu imza alıcının e-posta istemcisinin temasına göre otomatik olarak light veya dark mod'a geçer.
          </p>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSignature}
          className="px-6 py-3 bg-owl-accent hover:bg-owl-accent-hover text-white font-medium rounded-lg transition-colors"
        >
          İmzayı Kaydet
        </button>
      </div>
    </div>
  );
}

export default SignatureSettings;
