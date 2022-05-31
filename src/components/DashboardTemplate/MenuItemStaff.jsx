import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
const MenuItemStaff = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      Icon: DashboardIcon
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
            {
                name: 'Staff',
                link: '/administrasi/staff'
            },
        ]
    },
  ]

  export { MenuItemStaff }