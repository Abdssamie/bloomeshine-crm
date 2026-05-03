import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.invoices, type: NavigationMenuItemType.LINK, name: 'Invoices', icon: 'IconReceipt2', link: '/objects/invoices', position: 120 });
