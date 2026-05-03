import { NavigationMenuItemType, defineNavigationMenuItem } from 'twenty-sdk/define';
import { NAV, VIEW } from 'src/constants/universal-identifiers';

export default defineNavigationMenuItem({ universalIdentifier: NAV.invoices, type: NavigationMenuItemType.VIEW, name: 'Invoices', viewUniversalIdentifier: VIEW.invoices, position: 120 });
