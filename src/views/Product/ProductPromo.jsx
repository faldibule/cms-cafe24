import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, CircularProgress } from '@mui/material'
import { blue, pink, grey, green } from '@mui/material/colors'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { LoadingButton } from '@mui/lab';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios'
import { API } from '../../Variable/API'
import { useRecoilState } from 'recoil';
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import { dataPromo } from '../../Recoil/Promo';

const ProductPromo = () => {
    const navigate = useNavigate()

    // state
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)

    // Recoil
    const [promo, setPromo] = useRecoilState(dataPromo)
    const [alert, setAlert] = useRecoilState(alertState)


    
    const setPromoData = () => {
        axios.get(`${API}product_slider/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res.data)
            if(res.data.data.length === 0){
                setEmpty(true)
            }else{
                setEmpty(false)
                setPromo([...res.data.data])
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && promo.length === 0 && !empty){
            setPromoData()
        }

        return () => mounted = false
    }, [promo.length])

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Promo Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}product_slider/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setPromo([])
                        setAlert({
                            message: 'Berhasil Menghapus Hightlight Produk',
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
                        setDeleteLoading('none')
                        err.response && console.log(err.response)
                    })
                }
              },
              {
                label: 'Tidak',
                onClick: () => console.log('Click No')
              }
            ]
        });
    }

    return (
        <div>
            <Box component="div" sx={{
                p: 2,  
                minWidth: '100%', 
                display: 'flex',
                flexDirection: 'column', 
                justifyContent: 'center' 
            }}>
                <Box component="div">
                    <Typography variant="h6">
                        Tabel Hightlight Produk
                    </Typography>
                    <CircularProgress sx={{ width: 50, display: deleteLoading, my: 2 }} />
                    <Button onClick={() => navigate(`/promo/add`) } size='small' sx={{ my: 2, p:1, minWidth: 200, borderRadius: 25 }} variant="contained">
                        <AddBoxIcon  /> Tambah Hightlight
                    </Button>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} /> 

                    {/* Table */}
                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: green[500]}}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Nama</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Image</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {promo.length !== 0 && promo.map((val, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {val.product.product_name}
                                        </TableCell>
                                        <TableCell align="center">
                                            <img style={{ display: 'block', height: '100px', objectFit: 'cover', objectPosition: 'center', margin: '0px auto' }} src={val.product.image} alt="x" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} />
                                                
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {promo.length === 0 && !empty &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress sx={{ width: 50, display: 'block'}} />
                    </Box> 
                    }
                    {empty &&
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography>
                            Highligt Produk Kosong
                        </Typography>
                    </Box>    
                    }
                </Box>
                
            </Box>
            
            
        </div>
    );
};

export default ProductPromo;