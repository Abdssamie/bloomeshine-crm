import { ViewOpenRecordIn, ViewType, ViewVisibility, defineView, generateDefaultFieldUniversalIdentifier } from 'twenty-sdk/define';
import { OBJECT, VIEW } from 'src/constants/universal-identifiers';

export default defineView({
  universalIdentifier: VIEW.brands,
  name: 'Brands',
  objectUniversalIdentifier: OBJECT.brand,
  type: ViewType.TABLE,
  position: 10,
  visibility: ViewVisibility.WORKSPACE,
  openRecordIn: ViewOpenRecordIn.SIDE_PANEL,
  fields: [{ universalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: VIEW.brands, fieldName: 'primary' }), fieldMetadataUniversalIdentifier: generateDefaultFieldUniversalIdentifier({ objectUniversalIdentifier: OBJECT.brand, fieldName: 'name' }), position: 0, isVisible: true }],
});
