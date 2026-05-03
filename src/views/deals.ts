import { ViewOpenRecordIn, ViewType, ViewVisibility, defineView, generateDefaultFieldUniversalIdentifier } from 'twenty-sdk/define';
import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

export default defineView({ universalIdentifier: VIEW.deals, name: 'Deals', objectUniversalIdentifier: OBJECT.deal, type: ViewType.TABLE, position: 40, visibility: ViewVisibility.WORKSPACE, openRecordIn: ViewOpenRecordIn.SIDE_PANEL, fields: [{ universalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: VIEW.deals, fieldName: 'primary' }), fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: OBJECT.deal, fieldName: 'name' }), position: 0, isVisible: true }] });
