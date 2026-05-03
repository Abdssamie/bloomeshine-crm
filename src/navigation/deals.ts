import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.deals, type: NavigationMenuItemType.LINK, name: 'Deals', icon: 'IconHandshake', link: '/objects/deals', position: 90 });
