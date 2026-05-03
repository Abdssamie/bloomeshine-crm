import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.deliverables, type: NavigationMenuItemType.LINK, name: 'Deliverables', icon: 'IconChecklist', link: '/objects/deliverables', position: 100 });
