import { MailTemplates } from 'src/common/mail-templates';

export class SendMailRequestDTO<T> {
  to: string;
  subject: string;
  template: MailTemplates;
  context: T;
}
