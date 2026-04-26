import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly from: string;
  private readonly apiKey: string;

  constructor(config: ConfigService) {
    this.from = config.get<string>('MAIL_FROM', 'noreply@cleanly.pa');
    this.apiKey = config.get<string>('RESEND_API_KEY', '');
  }

  async send(options: MailOptions): Promise<void> {
    if (!this.apiKey) {
      this.logger.warn(`[MAIL STUB] To: ${options.to} | Subject: ${options.subject}`);
      return;
    }
    // TODO: replace with actual Resend/Mailgun SDK call
    this.logger.log(`Email sent to ${options.to}`);
  }

  bookingConfirmed(to: string, bookingId: string): Promise<void> {
    return this.send({
      to,
      subject: 'Reserva confirmada — Cleanly',
      html: `<p>Tu reserva <strong>${bookingId}</strong> ha sido confirmada.</p>`,
    });
  }

  paymentReceived(to: string, amount: number): Promise<void> {
    return this.send({
      to,
      subject: 'Pago recibido — Cleanly',
      html: `<p>Recibiste un pago de <strong>$${amount}</strong>.</p>`,
    });
  }
}
