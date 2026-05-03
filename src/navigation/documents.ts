import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.documents, type: NavigationMenuItemType.LINK, name: 'Documents', icon: 'IconFiles', link: '/objects/documents', position: 130 });
