import { ViewOpenRecordIn, ViewType, ViewVisibility, defineView, generateDefaultFieldUniversalIdentifier } from 'twenty-sdk/define';
import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

export default defineView({ universalIdentifier: VIEW.creators, name: 'Creators', objectUniversalIdentifier: OBJECT.creator, type: ViewType.TABLE, position: 20, visibility: ViewVisibility.WORKSPACE, openRecordIn: ViewOpenRecordIn.SIDE_PANEL, fields: [{ universalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: VIEW.creators, fieldName: 'primary' }), fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: OBJECT.creator, fieldName: 'displayName' }), position: 0, isVisible: true }] });
