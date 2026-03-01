// ---------------------------------------------------------------------------
// Email Service — Production-ready email infrastructure (Resend-ready)
// ---------------------------------------------------------------------------

import { logger } from '../lib/logger.js';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface EmailResult {
  id: string;
  status: 'sent' | 'queued' | 'failed';
}

// Template types for type-safe email sending
export type EmailTemplate =
  | { type: 'WELCOME'; data: { name: string; loginUrl: string } }
  | { type: 'PASSWORD_RESET'; data: { name: string; resetUrl: string; expiresIn: string } }
  | { type: 'SESSION_CONFIRMATION'; data: { name: string; therapistName: string; date: string; time: string; sessionId: string } }
  | { type: 'SESSION_REMINDER'; data: { name: string; therapistName: string; date: string; time: string; joinUrl: string } }
  | { type: 'SESSION_SUMMARY'; data: { name: string; therapistName: string; date: string; duration: string; tasks: string[] } }
  | { type: 'PAYMENT_RECEIPT'; data: { name: string; amount: string; currency: string; description: string; transactionId: string } }
  | { type: 'CRISIS_ALERT'; data: { userName: string; userId: string; sessionId?: string; detectedKeywords: string[]; timestamp: string } };

const DEFAULT_FROM = process.env.EMAIL_FROM || 'Soul Yatri <noreply@soulyatri.com>';

/**
 * Email Service
 *
 * Currently uses console logging as transport.
 * Replace _sendViaProvider() with Resend/SendGrid/SES when ready:
 *   npm install resend
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 */
export const emailService = {

  /**
   * Send a raw email
   */
  send: async (options: EmailOptions): Promise<EmailResult> => {
    const to = Array.isArray(options.to) ? options.to : [options.to];
    const from = options.from || DEFAULT_FROM;

    try {
      const result = await _sendViaProvider({ ...options, to, from });

      logger.info('email_sent', {
        to,
        subject: options.subject,
        messageId: result.id,
        tags: options.tags,
      });

      return result;
    } catch (error) {
      logger.error('email_failed', {
        to,
        subject: options.subject,
        error: error instanceof Error ? error.message : String(error),
      });

      return { id: '', status: 'failed' };
    }
  },

  /**
   * Send a templated email
   */
  sendTemplate: async (to: string, template: EmailTemplate): Promise<EmailResult> => {
    const { subject, html, text } = _renderTemplate(template);

    return emailService.send({
      to,
      subject,
      html,
      text,
      tags: [{ name: 'template', value: template.type }],
    });
  },
};

// ---------------------------------------------------------------------------
// Provider Implementation (swap this for Resend/SES/SendGrid)
// ---------------------------------------------------------------------------

async function _sendViaProvider(options: EmailOptions & { from: string }): Promise<EmailResult> {
  // TODO: Replace with actual email provider
  // Example with Resend:
  //   const { data, error } = await resend.emails.send({
  //     from: options.from,
  //     to: options.to as string[],
  //     subject: options.subject,
  //     html: options.html,
  //   });
  //   if (error) throw new Error(error.message);
  //   return { id: data!.id, status: 'sent' };

  // Development fallback: log to console
  const id = `dev-email-${Date.now()}`;

  if (process.env.NODE_ENV !== 'production') {
    logger.debug('email_dev_preview', {
      id,
      from: options.from,
      to: options.to,
      subject: options.subject,
    });
  }

  return { id, status: 'sent' };
}

// ---------------------------------------------------------------------------
// Template Renderer
// ---------------------------------------------------------------------------

function _renderTemplate(template: EmailTemplate): { subject: string; html: string; text: string } {
  switch (template.type) {
    case 'WELCOME':
      return {
        subject: `Welcome to Soul Yatri, ${template.data.name}!`,
        html: `<h1>Welcome, ${template.data.name}!</h1><p>Your healing journey begins now.</p><a href="${template.data.loginUrl}">Login to your account</a>`,
        text: `Welcome, ${template.data.name}! Your healing journey begins now. Login: ${template.data.loginUrl}`,
      };
    case 'PASSWORD_RESET':
      return {
        subject: 'Reset your Soul Yatri password',
        html: `<h1>Password Reset</h1><p>Hi ${template.data.name}, click below to reset your password. This link expires in ${template.data.expiresIn}.</p><a href="${template.data.resetUrl}">Reset Password</a>`,
        text: `Hi ${template.data.name}, reset your password: ${template.data.resetUrl} (expires in ${template.data.expiresIn})`,
      };
    case 'SESSION_CONFIRMATION':
      return {
        subject: `Session Confirmed with ${template.data.therapistName}`,
        html: `<h1>Session Confirmed</h1><p>Hi ${template.data.name}, your session with ${template.data.therapistName} is confirmed for ${template.data.date} at ${template.data.time}.</p>`,
        text: `Session confirmed with ${template.data.therapistName} on ${template.data.date} at ${template.data.time}.`,
      };
    case 'SESSION_REMINDER':
      return {
        subject: `Reminder: Session with ${template.data.therapistName} in 1 hour`,
        html: `<h1>Session Reminder</h1><p>Hi ${template.data.name}, your session with ${template.data.therapistName} starts at ${template.data.time}.</p><a href="${template.data.joinUrl}">Join Session</a>`,
        text: `Reminder: Session with ${template.data.therapistName} at ${template.data.time}. Join: ${template.data.joinUrl}`,
      };
    case 'SESSION_SUMMARY':
      return {
        subject: `Session Summary — ${template.data.date}`,
        html: `<h1>Session Summary</h1><p>Hi ${template.data.name}, here's your summary from your session with ${template.data.therapistName} (${template.data.duration}).</p><ul>${template.data.tasks.map(t => `<li>${t}</li>`).join('')}</ul>`,
        text: `Session summary with ${template.data.therapistName}: ${template.data.tasks.join(', ')}`,
      };
    case 'PAYMENT_RECEIPT':
      return {
        subject: `Payment Receipt — ${template.data.amount} ${template.data.currency}`,
        html: `<h1>Payment Receipt</h1><p>Hi ${template.data.name}, your payment of ${template.data.amount} ${template.data.currency} for ${template.data.description} was successful. Transaction ID: ${template.data.transactionId}</p>`,
        text: `Payment of ${template.data.amount} ${template.data.currency} received. Transaction: ${template.data.transactionId}`,
      };
    case 'CRISIS_ALERT':
      return {
        subject: `[URGENT] Crisis Alert — User ${template.data.userName}`,
        html: `<h1 style="color:red">CRISIS ALERT</h1><p>User: ${template.data.userName} (${template.data.userId})</p><p>Keywords detected: ${template.data.detectedKeywords.join(', ')}</p><p>Time: ${template.data.timestamp}</p>${template.data.sessionId ? `<p>Session: ${template.data.sessionId}</p>` : ''}`,
        text: `CRISIS ALERT: User ${template.data.userName} (${template.data.userId}). Keywords: ${template.data.detectedKeywords.join(', ')}. Time: ${template.data.timestamp}`,
      };
  }
}
