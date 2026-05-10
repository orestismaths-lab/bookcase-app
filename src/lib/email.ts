import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/verify-email?token=${token}`

  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV] Email verification URL for ${email}: ${url}`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Verify your Bookcase email',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;background:#f1ddbd;border:2px solid #7b4d2e;">
        <div style="background:#5a351f;padding:16px 24px;margin:-24px -24px 24px;text-align:center;">
          <h1 style="color:#f8e8ca;font-size:22px;margin:0;letter-spacing:0.05em;">Bookcase</h1>
          <p style="color:#d9bd8e;font-size:10px;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.2em;">private reading ledger</p>
        </div>
        <h2 style="color:#321d12;font-size:18px;">Verify your email</h2>
        <p style="color:#76563d;">Click the button below to verify your email address and start reading.</p>
        <a href="${url}" style="display:inline-block;background:#5c3523;color:#f8e8ca;padding:12px 28px;text-decoration:none;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin:16px 0;border:2px solid #3b2317;">
          Verify Email
        </a>
        <p style="color:#9b7656;font-size:11px;">Link expires in 24 hours. If you didn't register, ignore this email.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/reset-password?token=${token}`

  if (!process.env.RESEND_API_KEY) {
    console.log(`[DEV] Password reset URL for ${email}: ${url}`)
    return
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: 'Reset your Bookcase password',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:24px;background:#f1ddbd;border:2px solid #7b4d2e;">
        <div style="background:#5a351f;padding:16px 24px;margin:-24px -24px 24px;text-align:center;">
          <h1 style="color:#f8e8ca;font-size:22px;margin:0;letter-spacing:0.05em;">Bookcase</h1>
          <p style="color:#d9bd8e;font-size:10px;margin:4px 0 0;text-transform:uppercase;letter-spacing:0.2em;">private reading ledger</p>
        </div>
        <h2 style="color:#321d12;font-size:18px;">Reset your password</h2>
        <p style="color:#76563d;">Click the button below to set a new password.</p>
        <a href="${url}" style="display:inline-block;background:#5c3523;color:#f8e8ca;padding:12px 28px;text-decoration:none;font-weight:bold;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;margin:16px 0;border:2px solid #3b2317;">
          Reset Password
        </a>
        <p style="color:#9b7656;font-size:11px;">Link expires in 1 hour. If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
