export enum MailTemplates {
  VerifyUser = 'verify-user',
}

export class MailTemplatesContexts {
  [MailTemplates.VerifyUser]: {
    name: string;
    code: string;
  };
}
