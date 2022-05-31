import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AppMenuItem from './AppMenuItem';
import { appMenuItems } from './MenuItems';
import { Avatar, Badge, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { authentication } from '../../Recoil/Authentication';
import { API } from '../../Variable/API'
import { MenuItemStaff } from './MenuItemStaff';
import { MenuItemFinance } from './MenuItemFinance';


const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function DashboardTemplate(props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(true)
  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleDrawerOpen = () => {
    setOpen(!open);
  };
  const [auth, setAuth] = useRecoilState(authentication)

  useEffect(() => {
    if(auth.user === null){
      navigate(`/`)
    }
  }, [])

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setLoading(true)
    try{
      const { data } = await axios.delete(`${API}auth/logout`, {
          headers: {
              Authorization: 'Bearer ' + localStorage.getItem('authToken')
          }
      })
      localStorage.removeItem('authToken')
      setAuth({
        auth: false,
        user: null
      })
      setLoading(false)
      navigate('/')
    } catch (err) {
      // console.log(err.response)
      setLoading(false)
    }
  }

  const handleProfile = () => {
    navigate('/user/profil')
  }

  const settings = [
    {
      title: 'Profile',
      icon: <AccountCircleIcon />, 
      action: handleProfile
    }, 
    {
      title: 'Logout',
      icon: <LogoutIcon sx={{ color: 'red' }}/>,
      action: handleLogout
    }
  ];
  
  return (
    <Box sx={{ display: 'flex' }}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CssBaseline />
      <AppBar 
        position="fixed"
        open={open}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Logo
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  
                }}
                
              >
                
                <IconButton sx={{ p: 0, cursor: 'text' }}>
                  <Avatar alt={`ahmad syaiful akbar`} src="" />
                </IconButton>
                <Typography mx={2}>
                 Hallo, {auth.user !== null && auth.user.name}
                </Typography>
                <KeyboardArrowDownIcon sx={{ cursor: 'pointer' }} onClick={handleOpenUserMenu} />
              </Box>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                  <MenuItem key={index} onClick={setting.action}>
                    <ListItemIcon>
                      {setting.icon}
                    </ListItemIcon>
                    <Typography textAlign="center">{setting.title}</Typography>
                    {index === settings.length - 1 ? 
                      ''
                    :
                      <Divider />
                    }
                  </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{ 
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper' : {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }} >
          <List>
            { auth.user.role === 'super admin' &&
              appMenuItems.map((item, index) => (
                <AppMenuItem { ...item } key={index}/>
              ))
            }
            { auth.user.role === 'admin' &&
              appMenuItems.map((item, index) => (
                <AppMenuItem { ...item } key={index}/>
              ))
            }
            { auth.user.role === 'finance' &&
              MenuItemFinance.map((item, index) => (
                <AppMenuItem { ...item } key={index}/>
              ))
            }
          </List>
        </Box>
      </Drawer>

      <Main open={open}>
        <DrawerHeader />
        <Typography 
          variant="h5" 
          color="initial"
          sx={{ 
            mb: 3
          }}
        >
          {props.title}
        </Typography>
        { props.render }
      </Main>
    </Box>
  )
}

export default DashboardTemplate
