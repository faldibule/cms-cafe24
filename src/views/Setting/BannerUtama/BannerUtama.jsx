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
import { API } from '../../../Variable/API'
import { useRecoilState } from 'recoil';
import { dataBanner } from '../../../Recoil/Banner';
import { alertState } from '../../../Recoil/Alert';
import AlertSuccess from '../../../components/Utils/AlertSuccess';

const BannerUtama = () => {
    const navigate = useNavigate()

    // state
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)

    // Recoil
    const [image, setImage] = useRecoilState(dataBanner)
    const [alert, setAlert] = useRecoilState(alertState)


    
    const setImageData = () => {
        axios.get(`${API}banner/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.length === 0){
                setEmpty(true)
            }else{
                setEmpty(false)
                setImage([...res.data.data])
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && image.length === 0 && !empty){
            setImageData()
        }

        return () => mounted = false
    }, [image.length])

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Image Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}banner/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setImage([])
                        setAlert({
                            message: 'Berhasil Menghapus Banner',
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
                        Banner Table
                    </Typography>
                    <CircularProgress sx={{ width: 50, display: deleteLoading, my: 2 }} />
                    <Button onClick={() => navigate(`/banner/utama/add`) } size='small' sx={{ my: 2, p:1, minWidth: 200, borderRadius: 25 }} variant="contained">
                        <AddBoxIcon  /> Tambah Gambar
                    </Button>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} /> 

                    {/* Table */}
                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: blue[500]}}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">URL</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Image</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {image.length !== 0 && image.map((val, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {val.url === null ? <i>Tidak Ada URL</i> : val.url}
                                        </TableCell>
                                        <TableCell align="center">
                                            <img style={{ display: 'block', height: '100px', objectFit: 'cover', objectPosition: 'center', margin: '0px auto' }} src={val.banner_url} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/banner/utama/edit/${val.id}`)} />
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
                    {image.length === 0 && !empty &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress sx={{ width: 50, display: 'block'}} />
                    </Box> 
                    }
                    {empty &&
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography>
                            Banner Kosong
                        </Typography>
                    </Box>    
                    }
                </Box>
                
            </Box>
            
            
        </div>
    );
};

export default BannerUtama;