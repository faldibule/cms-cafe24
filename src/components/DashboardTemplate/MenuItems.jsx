import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleIcon from '@mui/icons-material/Article';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const appMenuItems = [
    {
      name: 'Dashboard',
      link: '/dashboard',
      Icon: DashboardIcon
    },
    
    // Master data
    {
      name: 'Master Data',
      Icon: CollectionsBookmarkIcon, 
      items: [
        {
          name: 'Kategori',
          link: '/master-data/kategori',
        },
        {
          name: 'Attribute & Value',
          link: '/master-data/attr',
        },
        {
          name: 'Size Pack',
          link: '/master-data/size',
        },
      ]
    },

    // Pelanggan
    {
        name: 'Pelanggan',
        Icon: GroupIcon,
        items: [ 
            {
                name: 'List Pelanggan',
                link: '/pelanggan'
            },
            {
                name: 'Diskon Group',
                link: '/diskon'
            },
        ]
    },

    // Product
    {
        name: 'Product',
        Icon: ShoppingCartIcon,
        items: [ 
            {
                name: 'List Produk',
                link: '/product'
            },
            {
                name: 'Tambah Produk',
                link: '/product/add'
            },
            {
                name: 'Highlight Produk',
                link: '/promo'
            },
        ]
    },

    // Shipping
    {
        name: 'Ekspedisi',
        Icon: LocalShippingIcon,
        items: [ 
            {
                name: 'Courier Setting',
                link: '/kurir'
            },
            {
                name: 'Diskon Ongkir',
                link: '/diskon_ongkir'
            },
        ]
    },

    // Article
    {
        name: 'Article',
        Icon: ArticleIcon,
        items: [ 
            {
                name: 'List Artikel',
                link: '/artikel'
            },
            {
                name: 'Tambah Artikel',
                link: '/artikel/add'
            },
        ]
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
            {
                name: 'Transaksi',
                link: '/transaksi'
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
            {
                name: 'Staff',
                link: '/administrasi/staff'
            },
        ]
    },

    // Setting
    {
        name: 'Setting',
        Icon: SettingsIcon,
        items: [
            {
                name: 'Site Setting',
                link: '/site_setting',
            }, 
            {
                name: 'Banner Utama',
                link: '/banner/utama',
            },
            {
                name: 'Second Banner',
                link: '/banner/second',
            },
            {
                name: 'Banner Footer',
                link: '/banner/footer',
            },
        ]
    },
  ]

  export { appMenuItems }