import { FieldType, NumberDataType, defineObject } from 'twenty-sdk/define';

import { OBJECT } from 'src/constants/universal-identifiers';
import { fieldId, manyToOne, select } from 'src/objects/_helpers';

export default defineObject({
  universalIdentifier: OBJECT.invoice,
  nameSingular: 'invoice',
  namePlural: 'invoices',
  labelSingular: 'Invoice',
  labelPlural: 'Invoices',
  description: 'Receivable or payable invoice tied to campaign or creator deal finance.',
  icon: 'IconReceipt2',
  isSearchable: true,
  labelIdentifierFieldMetadataUniversalIdentifier: fieldId(OBJECT.invoice, 'invoiceNumber'),
  fields: [
    { universalIdentifier: fieldId(OBJECT.invoice, 'invoiceNumber'), type: FieldType.TEXT, name: 'invoiceNumber', label: 'Invoice Number', isNullable: false },
    { universalIdentifier: fieldId(OBJECT.invoice, 'title'), type: FieldType.TEXT, name: 'title', label: 'Title', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.invoice, 'invoiceType'), type: FieldType.SELECT, name: 'invoiceType', label: 'Type', isNullable: false, defaultValue: "'INBOUND'", options: select(['Inbound', 'Outbound']) },
    { universalIdentifier: fieldId(OBJECT.invoice, 'status'), type: FieldType.SELECT, name: 'status', label: 'Status', isNullable: false, defaultValue: "'DRAFT'", options: select(['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled']) },
    { universalIdentifier: fieldId(OBJECT.invoice, 'amount'), type: FieldType.NUMBER, name: 'amount', label: 'Amount', isNullable: false, universalSettings: { dataType: NumberDataType.FLOAT, decimals: 2 } },
    { universalIdentifier: fieldId(OBJECT.invoice, 'currencyCode'), type: FieldType.TEXT, name: 'currencyCode', label: 'Currency', isNullable: true, defaultValue: "'EUR'" },
    { universalIdentifier: fieldId(OBJECT.invoice, 'issuedAt'), type: FieldType.DATE, name: 'issuedAt', label: 'Issued At', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.invoice, 'dueDate'), type: FieldType.DATE, name: 'dueDate', label: 'Due Date', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.invoice, 'paidAt'), type: FieldType.DATE, name: 'paidAt', label: 'Paid At', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.invoice, 'paymentTerms'), type: FieldType.SELECT, name: 'paymentTerms', label: 'Payment Terms', isNullable: true, options: select(['Net 15', 'Net 30']) },
    { universalIdentifier: fieldId(OBJECT.invoice, 'paymentMethod'), type: FieldType.TEXT, name: 'paymentMethod', label: 'Payment Method', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.invoice, 'documentUrl'), type: FieldType.LINKS, name: 'documentUrl', label: 'Document URL', isNullable: true },
    { universalIdentifier: fieldId(OBJECT.invoice, 'notes'), type: FieldType.RICH_TEXT, name: 'notes', label: 'Notes', isNullable: true },
    manyToOne({ universalIdentifier: fieldId(OBJECT.invoice, 'campaign'), name: 'campaign', label: 'Campaign', targetObject: OBJECT.campaign, targetField: fieldId(OBJECT.campaign, 'invoices') }),
    manyToOne({ universalIdentifier: fieldId(OBJECT.invoice, 'deal'), name: 'deal', label: 'Deal', targetObject: OBJECT.deal, targetField: fieldId(OBJECT.deal, 'invoices') }),
  ],
});
