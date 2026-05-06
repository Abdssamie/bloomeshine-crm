export type DocumensoDocumentEvent =
  | 'DOCUMENT_SENT'
  | 'DOCUMENT_COMPLETED'
  | 'DOCUMENT_REJECTED'
  | 'DOCUMENT_CANCELLED';

export type DocumensoWebhookBody = {
  event?: DocumensoDocumentEvent | string;
  payload?: {
    id?: number | string;
    status?: string;
    completedAt?: string | null;
    updatedAt?: string | null;
    recipients?: Array<{
      name?: string;
      email?: string;
      signingStatus?: string;
      rejectionReason?: string | null;
    }>;
    Recipient?: Array<{
      name?: string;
      email?: string;
      signingStatus?: string;
      rejectionReason?: string | null;
    }>;
  };
  createdAt?: string;
  webhookEndpoint?: string;
};
