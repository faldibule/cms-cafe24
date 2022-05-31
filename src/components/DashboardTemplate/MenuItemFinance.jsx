import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const MenuItemFinance = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      Icon: DashboardIcon
    },

    // Order
    {
        name: 'Order',
        Icon: ReceiptLongIcon,
        items: [ 
            {
                name: 'List Order',
                link: '/order'
            },
            
        ]
    },

    // Administrasi
    {
        name: 'Administrasi',
        Icon: AdminPanelSettingsIcon,
        items: [ 
            {
                name: 'Laporan Penjualan',
                link: '/administrasi/report'
            },
        ]
    },
  ]

  export { MenuItemFinance }