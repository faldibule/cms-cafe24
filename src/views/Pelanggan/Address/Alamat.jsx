import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Card, CardContent, CardActions, CircularProgress, List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import { blue, green, pink } from '@mui/material/colors'
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil';
import { alertState } from '../../../Recoil/Alert';
import AlertSuccess from '../../../components/Utils/AlertSuccess';
import { confirmAlert } from 'react-confirm-alert';
import axios from 'axios';
import { API } from '../../../Variable/API'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

const Alamat = () => {
    // other
    const navigate = useNavigate()
    const id = window.location.href.split('/')[5]
    
    // recoil
    const [alert, setAlert] = useRecoilState(alertState)

    // State
    const [address, setAddress] = useState([])
    const [loading, setLoading] = useState('none')
    const [userData, setUserData] = useState({})
    const [empty, setEmpty] = useState(false)

    const onDelete = (id_address) => {
        confirmAlert({
            title: 'Data Alamat Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setLoading('block')
                    axios.delete(`${API}user/address/delete/${id_address}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setAddress([])
                        setLoading('none')
                        setAlert({
                            message: 'Berhasil Hapus Alamat',
                            display: true
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 5000)
                    })
                    .catch(err => {
                        setLoading('none')
                        // err.response && console.log(err.response)
                    })
                }
              },
              {
                label: 'Tidak',
                onClick: () => 'click no'
              }
            ]
          });
    }

    const getUserAddress = () => {
        axios.get(`${API}user/address/fetch?user_id=${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            if(res.data.data.length === 0){
                setEmpty(true)
            }else{
                setEmpty(false)
                setAddress([...res.data.data])
            }
            
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    const getUserId = () => {
        axios.get(`${API}user/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setUserData({...res.data.data})
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && JSON.stringify(userData) === '{}'){
            getUserId()
        }

        return () => mounted = false
    }, [])

    useEffect(() => {
        let mounted = true;
        if(mounted && address.length === 0 && !empty){
            getUserAddress()
        }

        return () => mounted = false
    }, [address.length])
    
    return (
        <Box component='div' sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            {JSON.stringify(userData) === '{}' &&
                <Box>
                    <CircularProgress sx={{ width: 50 }} />
                </Box>
            }
            {JSON.stringify(userData) !== '{}' && 
            <Box>
                <Box component="div" sx={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography>
                        Data Pelanggan
                    </Typography>
                    <List>
                        {Object.entries(userData).map(([key,value],i) => {
                            if(key === 'name' || key === 'email' || key === 'phone_number'){
                                return (
                                    <ListItem key={key}>
                                        <ListItemIcon>
                                            {key === 'name' && <AccountCircleIcon size='large' />}
                                            {key === 'email' && <ContactMailIcon size='large' />}
                                            {key === 'phone_number' && <ContactPhoneIcon size='large' />}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={key === 'phone_number' ? 'Phone Number' : key}
                                            secondary={key === 'phone_number' ? `+62-${value}` : value}
                                        />
                                    </ListItem>
                                )
                            }
                        })}    
                    </List>
                </Box>

                <Typography sx={{ mt: 2 }} variant='h6'>
                    Data Alamat `{userData.name}`
                </Typography>
                
                <Button onClick={() => navigate(`/pelanggan/alamat_add/${id}`) } size='small' sx={{ my: 2, p:1, minWidth: 250, borderRadius: 25 }} variant="contained">
                    <AddBoxIcon  /> Tambah Data Alamat
                </Button>
                <CircularProgress sx={{ width: 50, display: loading }} />
                <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
                
                {/* Card */}
                <Box sx={{ display: 'flex' }}>
                    {address.length !== 0 &&
                            address.map((val, i) => (
                                <Card key={i} sx={{ maxWidth: 345, border: 1, borderColor: 'primary.main', m: 2 }}>
                                    <CardContent>
                                        <Typography gutterBottom variant="body1" component="div">
                                        <b>{val.label}</b>
                                        </Typography>
                                        <Typography variant="h6">
                                            <b>{val.recipients_name}</b>  
                                        </Typography>
                                        <Typography>
                                            <i>+{val.phone_number}</i>  
                                        </Typography>
                                        <Typography>
                                            {val.address}, (POS : <i><b>{val.postal_code}</b></i>),  
                                        </Typography>
                                        <Typography>
                                        {val.district.district}, {val.city.city}, {val.province.province}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/pelanggan/alamat_edit/${val.id}`)} />
                                        <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                        <DeleteForeverIcon onClick={() => onDelete(val.id)} sx={{ color: pink[500], cursor: 'pointer' }} />
                                    </CardActions>
                                </Card>
                            ))
                    }
                </Box>



                {address.length === 0 && !empty &&
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress sx={{ width: 50, display: 'block'}} />
                </Box> 
                }
                {empty &&
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography>
                        Address Kosong
                    </Typography>
                </Box>    
                }
            </Box>
            } 
        </Box>
    )
};

export default Alamat;
