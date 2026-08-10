// ============================================================
// EMAIL ALERTS — Resend (fire-and-forget, never blocks requests)
// Sends owner notifications for new contact messages and new
// chat sessions. Free tier: from onboarding@resend.dev, delivery
// only to the Resend account owner's email (OWNER_EMAIL in .env).
// ============================================================

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Portfolio Alerts <onboarding@resend.dev>";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function notifyOwner({ type, data, idempotencyKey }) {
  if (!process.env.RESEND_API_KEY || !process.env.OWNER_EMAIL) {
    console.warn("Email alerts skipped: RESEND_API_KEY or OWNER_EMAIL missing");
    return Promise.resolve(null);
  }

  const subject =
    type === "contact"
      ? `📬 New portfolio message from ${data.name || "Anonymous"}`
      : `🤖 New AI twin chat session started`;

  const rows = Object.entries(data)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;font-weight:600;color:#6d28d9;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 12px;color:#1f2937">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  return resend.emails
    .send(
      {
        from: FROM,
        to: [process.env.OWNER_EMAIL],
        subject,
        text: Object.entries(data)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n"),
        html: `<div style="font-family:sans-serif"><h2 style="color:#111827">${escapeHtml(subject)}</h2><table style="border-collapse:collapse;background:#f9fafb;border-radius:8px">${rows}</table><p style="color:#6b7280;font-size:12px;margin-top:16px">Sent by your portfolio · view details in your <a href="#">/admin dashboard</a></p></div>`,
      },
      idempotencyKey ? { idempotencyKey } : undefined
    )
    .then(({ data: result, error }) => {
      if (error) {
        console.error("Resend rejected notification:", error, { type });
        return null;
      }
      console.info("Owner alert sent:", result?.id, type);
      return result;
    })
    .catch((error) => {
      console.error("Resend notification failed:", error, { type });
      return null;
    });
}
