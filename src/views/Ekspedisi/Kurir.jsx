import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, CircularProgress, Backdrop } from '@mui/material'
import { blue, grey, green } from '@mui/material/colors'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API } from '../../Variable/API'
import { useRecoilState } from 'recoil';
import { dataKurir } from '../../Recoil/Kurir';
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';

const Kurir = () => {
    const navigate = useNavigate()

    // state
    const [updateLoading, setUpdateLoading] = useState(false)
    const [empty, setEmpty] = useState(false)

    // Recoil
    const [kurir, setKurir] = useRecoilState(dataKurir)
    const [alert, setAlert] = useRecoilState(alertState)

    
    const setKurirData = () => {
        axios.get(`${API}courier/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.length === 0){
                setEmpty(true)
            }else{
                setEmpty(false)
                setKurir([...res.data.data])
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && kurir.length === 0 && !empty){
            setKurirData()
        }

        return () => mounted = false
    }, [kurir.length])

    const onUpdate = (slug, active) => {
        const setNewData = () => {
            // get old post
            let temp = kurir.filter(val => val.slug === slug)[0]
    
            //get index of old post
            let indexOf = kurir.map((val, i) => {
                if(val.slug === slug){
                    return i
                }else{
                    return 'x'
                }
            }).filter(val => val !== 'x')[0]
    
            //update old post
            temp = {
                ...temp,
               active: active == "1" ? 0 : 1
            }
    
            //get except old post
            let unselect = kurir.filter(val => val.slug !== slug)
    
            //push old post to where belong
            let data_baru = [...unselect.slice(0, indexOf), temp, ...unselect.slice(indexOf)]
            return data_baru
        }

        confirmAlert({
            title: 'Data akan Berubah',
            message: 'Yakin Melakukan Ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setUpdateLoading(true)
                    const formData = new FormData()
                    formData.append('_method', 'patch')
                    formData.append('slug', slug)
                    formData.append('active', active == "1" ? 0 : 1)

                    axios.post(`${API}courier/update_active`, formData, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setUpdateLoading(false)
                        const updatedData = setNewData()
                        setKurir([...updatedData])
                        setAlert({
                            message: 'Berhasil Mengubah Status Kurir',
                            display: true
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 3000)
                    })
                    .catch(err => {
                        setUpdateLoading(false)
                        // err.response && console.log(err.response)
                    })
                }
              },
              {
                label: 'Tidak',
                onClick: () => 'Click No'
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
                        Courier Table
                    </Typography>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={updateLoading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    {/* <CircularProgress sx={{ width: 50, display: deleteLoading, my: 2 }} /> */}
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} /> 

                    {/* Table */}
                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: blue[500]}}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Nama Ekspedisi</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {kurir.length !== 0 && kurir.map((val, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {val.courier}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {val.active === 1 && 
                                                    <ToggleOnIcon sx={{ fontSize: '2rem' ,color: green[500], cursor: 'pointer' }} onClick={() => onUpdate(val.slug, val.active)} />
                                                }
                                                {val.active === 0 && 
                                                    <ToggleOffIcon sx={{ fontSize: '2rem' ,color: grey[500], cursor: 'pointer' }} onClick={() => onUpdate(val.slug, val.active)} />
                                                }
                                                
                                                
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {kurir.length === 0 && !empty &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress sx={{ width: 50, display: 'block'}} />
                    </Box> 
                    }
                    {empty &&
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography>
                            Kurir Kosong
                        </Typography>
                    </Box>    
                    }
                </Box>
                
            </Box>
            
            
        </div>
    );
};

export default Kurir;