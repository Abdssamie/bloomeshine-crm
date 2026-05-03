import { ViewOpenRecordIn, ViewType, ViewVisibility, defineView, generateDefaultFieldUniversalIdentifier } from 'twenty-sdk/define';
import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

export default defineView({ universalIdentifier: VIEW.documents, name: 'Documents', objectUniversalIdentifier: OBJECT.document, type: ViewType.TABLE, position: 80, visibility: ViewVisibility.WORKSPACE, openRecordIn: ViewOpenRecordIn.SIDE_PANEL, fields: [{ universalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: VIEW.documents, fieldName: 'primary' }), fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: OBJECT.document, fieldName: 'fileName' }), position: 0, isVisible: true }] });
