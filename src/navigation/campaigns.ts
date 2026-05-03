import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.campaigns, type: NavigationMenuItemType.LINK, name: 'Campaigns', icon: 'IconTargetArrow', link: '/objects/campaigns', position: 80 });
