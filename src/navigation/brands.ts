import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.brands, type: NavigationMenuItemType.LINK, name: 'Brands', icon: 'IconBuildingStore', link: '/objects/brands', position: 60 });
