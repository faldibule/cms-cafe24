import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, CircularProgress, Pagination } from '@mui/material'
import { blue, pink, grey, green } from '@mui/material/colors'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { LoadingButton } from '@mui/lab';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios'
import { API } from '../../../Variable/API'
import { useRecoilState } from 'recoil';
import { alertState } from '../../../Recoil/Alert';
import { dataSizepack } from '../../../Recoil/Size';
import AlertSuccess from '../../../components/Utils/AlertSuccess';

const Index = () => {
    const navigate = useNavigate()

    // state
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)
    const [data, setData] = useState([])
    const [params, setParams] = useState({
        page: 1,
        limit: 10,
        total: 0
    })
    const [loading, setLoading] = useState(false)

    // Recoil
    const [alert, setAlert] = useRecoilState(alertState)
    
    const getDataPromoBanner = () => {
        setLoading(true)
        axios.get(`${API}promotion/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            },
            params: {
                status: 'all',
                paginate: 1,
                limit: params.limit,
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty(true)
            }else{
                setEmpty(false)
                setData([...res.data.data.data])
                setParams({
                    ...params,
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                })
            }
            setLoading(false)
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    const onPageChange = (e, val) => {
        
        if(params.page !== val){
            setLoading(true)
            axios.get(`${API}promotion/fetch?paginate=1&status=all&limit=${params.limit}&page=${val}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                if(res.data.data.data.length === 0){
                    setEmpty(true)
                }else{
                    setEmpty(false)
                    setData([...res.data.data.data])
                    setParams({
                        ...params,
                        page: res.data.data.meta.current_page,
                        total: res.data.data.meta.last_page,
                    })
                }
                setLoading(false)


            })
            .catch(err => {
                // err.response && console.log(err.response)
            })
        }
    }

    useEffect(() => {
        let mounted = true
        if(mounted && data.length === 0 && !empty){
            getDataPromoBanner()
        }

        return () => mounted = false
    }, [data.length])

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Image Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}promotion/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setData([])
                        setAlert({
                            message: 'Berhasil Menghapus Promo Banner',
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
                        // err.response && console.log(err.response)
                    })
                }
              },
              {
                label: 'promotion',
                onClick: () => 'Click no'
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
                        Promo Banner
                    </Typography>
                    <CircularProgress sx={{ width: 50, display: deleteLoading, my: 2 }} />
                    <Button onClick={() => navigate(`/master-data/promo-banner/add`) } size='small' sx={{ my: 2, p:1, minWidth: 200, borderRadius: 25 }} variant="contained">
                        <AddBoxIcon  /> Tambah Promo Banner
                    </Button>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} /> 

                    {/* Table */}
                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: blue[500]}}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white'  }} align="center">Nama</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Image</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {!loading && data.map((val, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell align="center">
                                            {val.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            <img style={{ display: 'block', height: '150px', objectFit: 'cover', objectPosition: 'center', margin: '0px auto' }} src={val.image_url} alt="x" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/master-data/promo-banner/edit/${val.id}`)} />
                                                <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                                <DeleteForeverIcon disabled={true} sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} />
                                                
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {loading &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress sx={{ width: 50, display: 'block'}} />
                    </Box> 
                    }
                    {data.length !== 0 && !empty &&
                        <Pagination sx={{ mt: 2, mx: 'auto' }} count={params.total} page={params.page} onChange={onPageChange} color="primary" />
                    }
                    {empty &&
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography>
                            Banner Promo Kosong
                        </Typography>
                    </Box>    
                    }
                </Box>
                
            </Box>
            
            
        </div>
    );
};

export default Index;