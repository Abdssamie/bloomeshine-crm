export const APP_DISPLAY_NAME = 'IMA CRM';
export const APP_DESCRIPTION =
  'Influencer marketing agency CRM for brands, creators, campaigns, deals, and contracts.';
export const APPLICATION_UNIVERSAL_IDENTIFIER = 'e572620c-c84b-4c5f-95e2-a62ad8b50790';
export const DEFAULT_ROLE_UNIVERSAL_IDENTIFIER = '61a16537-e717-492c-a067-5cac684d8117';

export const OBJECT = {
  brand: '21af0960-0215-400d-89fe-4260404f825b',
  creator: '147481c1-48df-4cff-9795-c9c79493fe05',
  campaign: '0e8be7e4-cc51-414e-9fa4-b30a1d98ae96',
  deal: 'f2ec60cd-1e06-4a06-b31c-d7432c2adb67',
  crmTask: '99dc098d-ff05-4244-a5b3-e2f848daed4b',
  contract: '10e06bad-681e-4304-bd40-561c1175447c',
  pdfTemplate: '744f02b9-b704-439d-89aa-52e7f21aebda',
} as const;

export const FIELD = {
  crmTaskAssignee: '3ec79494-2df1-43f3-9fd8-01dd1b94d555',
  workspaceMemberAssignedCrmTasks: '1625908e-99a7-4f8d-8e44-425cb55cb1ae',
} as const;

export const VIEW = {
  brands: '971dc43c-b9a8-48bf-93ab-5d835d0ff200',
  creators: 'ad2b7f64-aab0-4b23-ad14-c590c8c66cc8',
  campaigns: '83920b6c-59cb-464a-bd6e-0e830e87e34a',
  deals: '0f5c0cb6-e0c4-4a8c-b5de-1b34f980ea2e',
  tasksKanban: '70821d02-e21b-4368-9715-92386bafbb75',
  contracts: 'afc2394c-648e-4937-99d5-c15a3f56f311',
  pdfTemplates: '943cce61-7132-4613-afaa-6384e5e954f2',
} as const;

export const PAGE_LAYOUT = {
  mainDashboard: '7c8ad829-008c-43f2-bec6-b35dc69823e8',
} as const;

export const NAV = {
  mainDashboard: 'cebc668b-19aa-4522-ab11-37899e599776',
  brands: '6f39cff2-7fe4-4bc2-9056-4016675a837b',
  creators: '571166ae-2080-43f4-99d5-659b0ea5cc05',
  campaigns: '0ad00740-2fdd-41c5-b18b-212c647f10ff',
  deals: '3ed149e0-7e61-468e-a830-d934d383f310',
  tasksKanban: '4abec859-603d-437f-a548-93393fba6db6',
  contracts: 'f12d06c0-98a0-4f68-8b04-de2d9361087c',
  pdfTemplates: 'fac0c9c7-9074-4866-bad7-a4b4de324d94',
} as const;

export const LOGIC_FUNCTION = {
  generateInvoicePdf: '4ab076b5-d3ad-4f19-a945-5336f57b1630',
  generateAndSendContract: 'b39d0835-20ea-4707-8be0-b6d3671de1f4',
  documensoWebhook: '1d0504f8-28af-46ee-b958-86b80d98ce8f',
  dailyRevenueOpsAudit: '4f2604a5-2848-40e4-9f49-7dd1559c7ae2',
  previewPdfTemplate: '0d920ed7-7f9a-4f2d-805e-c17b4341ff66',
  previewPdfTemplateRoute: 'b93d17fd-d3b4-452b-938e-e0bd5a152db8',
  seedPdfTemplates: 'a71e2efd-4463-46de-9eda-3a4421abf56f',
} as const;
