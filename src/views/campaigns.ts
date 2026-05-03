import { ViewOpenRecordIn, ViewType, ViewVisibility, defineView, generateDefaultFieldUniversalIdentifier } from 'twenty-sdk/define';
import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

export default defineView({ universalIdentifier: VIEW.campaigns, name: 'Campaigns', objectUniversalIdentifier: OBJECT.campaign, type: ViewType.TABLE, position: 30, visibility: ViewVisibility.WORKSPACE, openRecordIn: ViewOpenRecordIn.SIDE_PANEL, fields: [{ universalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: VIEW.campaigns, fieldName: 'primary' }), fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: OBJECT.campaign, fieldName: 'title' }), position: 0, isVisible: true }] });
