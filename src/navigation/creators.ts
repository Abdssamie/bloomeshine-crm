import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.creators, type: NavigationMenuItemType.LINK, name: 'Creators', icon: 'IconUserStar', link: '/objects/creators', position: 70 });
