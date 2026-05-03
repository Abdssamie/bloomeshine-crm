import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.campaigns, type: NavigationMenuItemType.VIEW, name: 'Campaigns', viewUniversalIdentifier: VIEW.campaigns, position: 80 });
