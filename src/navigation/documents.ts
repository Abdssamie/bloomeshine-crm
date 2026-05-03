import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.documents, type: NavigationMenuItemType.VIEW, name: 'Documents', viewUniversalIdentifier: VIEW.documents, position: 130 });
