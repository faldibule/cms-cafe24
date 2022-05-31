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
import { useRecoilRefresher_UNSTABLE, useRecoilState } from 'recoil';
import { dataSubKategori } from '../../../Recoil/SubKategori';
import { alertState } from '../../../Recoil/Alert';
import AlertSuccess from '../../../components/Utils/AlertSuccess';
import { errorState } from '../../../Recoil/Error';
import AlertError from '../../../components/Utils/AlertError';
import { allKategori, kategoriParent } from '../../../Recoil/Kategori';

const SubKategori = () => {
    const id = window.location.href.split('/')[5]
    const navigate = useNavigate()

    // state
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)

    // Recoil
    const [listKategori, setListKategori] = useRecoilState(allKategori);
    const [subKategori, setSubKategori] = useRecoilState(dataSubKategori)
    const [parent, setParent] = useRecoilState(kategoriParent)
    const [alert, setAlert] = useRecoilState(alertState)
    const [alertErrorData, setAlertErrorData] = useRecoilState(errorState)
    
    const setSubData = () => {
        setSubKategori([])
        axios.get(`${API}sub_category/fetch?category_id=${id}`, {
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
                setSubKategori([...res.data.data])
            }
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && !empty){
            setSubData()
        }

        return () => {
            mounted = false
        }
    }, [id])

    const childDelete = (id) => {
        confirmAlert({
            title: 'Data Kategori Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}sub_category/delete/${id}`, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('authToken')
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setAlert({
                            message: 'Berhasil Menghapus Sub Kategori',
                            display: true
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 5000)
                        setSubData()
                        setListKategori([])
                    })
                    .catch(err => {
                        if(err.response){
                            // console.log(err.response)
                            setAlertErrorData({
                                display: true,
                                message: err.response.data.errors.sub_category
                            })
                            setTimeout(() => {
                                setAlertErrorData({
                                    display: false,
                                    message: ''
                                })
                            }, 4000)
                        }
                        setDeleteLoading('none')
                    })
                }
              },
              {
                label: 'Tidak',
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
                        Sub Kategori
                    </Typography>
                    <CircularProgress sx={{ width: 50, display: deleteLoading, my: 2 }} />
                    <Button onClick={() => navigate(`/master-data/sub_kategori_add/${id}`) } size='small' sx={{ my: 2, p:1, minWidth: 200, borderRadius: 25 }} variant="contained">
                        <AddBoxIcon  /> Tambah Sub Kategori
                    </Button>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} /> 
                    <AlertError message={alertErrorData.message} onTutup={()=> setAlertErrorData({message: '', display: false})} display={alertErrorData.display}/>

                    {/* Table */}
                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: blue[500]}}>
                            <TableRow>
                                    <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Name</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {subKategori.length !== 0 && subKategori.map((val, i) => (
                                
                                    <TableRow key={`${i}-section`}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell align="center">{val.sub_category_name}</TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/master-data/kategori/child_update/${val.id}-${id}`)} />
                                                <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                                <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => childDelete(val.id)} />
                                                
                                            </Box>
                                        </TableCell>
                                    </TableRow> 
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {subKategori.length === 0 && !empty &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress sx={{ width: 50, display: 'block'}} />
                    </Box> 
                    }
                    {empty &&
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography>
                            Sub Kategori Kosong
                        </Typography>
                    </Box>    
                    }
                </Box>
                
            </Box>
            
            
        </div>
    );
};

export default SubKategori;