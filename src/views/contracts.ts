import { ViewOpenRecordIn, ViewType, ViewVisibility, defineView, generateDefaultFieldUniversalIdentifier } from 'twenty-sdk/define';
import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

export default defineView({ universalIdentifier: VIEW.contracts, name: 'Contracts', objectUniversalIdentifier: OBJECT.contract, type: ViewType.TABLE, position: 60, visibility: ViewVisibility.WORKSPACE, openRecordIn: ViewOpenRecordIn.SIDE_PANEL, fields: [{ universalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: VIEW.contracts, fieldName: 'primary' }), fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: OBJECT.contract, fieldName: 'title' }), position: 0, isVisible: true }] });
