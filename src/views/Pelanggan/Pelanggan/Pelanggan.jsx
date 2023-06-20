import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Paper, Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, CircularProgress, Pagination, Stack, TextField, Select, FormControl, InputLabel, MenuItem } from '@mui/material'
import { blue, pink, green, grey } from '@mui/material/colors';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useRecoilState } from 'recoil'
import { dataPelanggan } from '../../../Recoil/PelangganRecoil'
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EditIcon from '@mui/icons-material/Edit';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { alertState } from '../../../Recoil/Alert';
import AlertSuccess from '../../../components/Utils/AlertSuccess';
import axios from 'axios';
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom';

const Pelanggan = () => {
    const navigate = useNavigate();

    // recoil
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    const [alert, setAlert] = useRecoilState(alertState)

    // ref
    const cancelToken = useRef({})
    const number = useRef()
    number.current = 0

    // state
    const [search, setSearch] = useState({
        status: '',
        search: '',
        limit: '10',
    })
    const [loading, setLoading] = useState('none')
    const [empty, setEmpty] = useState(false)
    
    const setDataPelanggan = () => {
        setEmpty(false)
        axios.get(`${API}user/customer?search=${search.search}&page=1&status=${search.status}&limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setPelanggan({
                    ...pelanggan,
                    data: [],
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setPelanggan({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    const onPageChange = (e, val) => {
        if(pelanggan.page !== val){
            setPelanggan({
                ...pelanggan,
                isComplete: false
            })
            axios.get(`${API}user/customer?search=${search.search}&page=${val}&status=${search.status}&limit=${search.limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                if(res.data.data.length === 0){
                    setEmpty(true)
                    setPelanggan({
                        ...pelanggan,
                        data: [],
                        isComplete: true
                    })
                }else{
                    setEmpty(false)
                    setPelanggan({
                        page: res.data.data.meta.current_page,
                        total: res.data.data.meta.last_page,
                        data: [...res.data.data.data],
                        isComplete: true
                    })
                }

            })
            .catch(err => {
                // err.response && console.log(err.response)
            })
        }
    }

    useEffect(() => {
        let mounted = true;
        if(pelanggan.data.length === 0 && mounted && !empty){
            setDataPelanggan()
        }
        return () => mounted = false
    }, [pelanggan.data.length])

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Pelanggan Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setLoading('block')
                    
                    axios.delete(`${API}user/delete/${id}`, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('authToken')
                        }
                    })
                    .then(res => {
                        setAlert({
                            message: 'Berhasil Menghapus',
                            display: true
                        })
                        setLoading('none')
                        setPelanggan({
                            ...pelanggan,
                            isComplete: false
                        })
                        setDataPelanggan()
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 3000)
                    })
                    .catch(err => {
                        setLoading('none')
                        if(err.response) console.log(err.response)
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

    const liveSearch = async (keyword, status) => {
        setEmpty(false)
        if(typeof cancelToken.current.cancel !== 'undefined'){
            cancelToken.current.cancel("Canceled")
        }
        cancelToken.current = axios.CancelToken.source()
        try {
            const res = await axios.get(`${API}user/customer?search=${keyword}&page=1&status=${status}&limit=${search.limit}`, {
                cancelToken: cancelToken.current.token,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setPelanggan({
                    ...pelanggan,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setPelanggan({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    const onSearchChange = (e) => {
        if(e.target.name === 'search'){
            setPelanggan({
                ...pelanggan,
                isComplete: false
            })
            liveSearch(e.target.value, search.status)
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            })
        }else{
            setPelanggan({
                ...pelanggan,
                isComplete: false
            })
            liveSearch(search.search, e.target.value)
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            })
        }
    }

    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Typography variant="h5">
                Daftar Pelanggan
            </Typography>
            <Button onClick={() => navigate(`/pelanggan/add`) } size='small' sx={{ my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
               <AddBoxIcon  /> Tambah Data Pelanggan
            </Button>
            <CircularProgress sx={{ width: 50, display: loading }} />
            <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
            <Box component="form">
                <Stack direction="row" spacing={3}>
                    {/* search */}
                    <TextField
                        sx={{ my: 1 }}
                        variant="outlined"
                        size='small'
                        label={`Search`}
                        name='search'
                        onChange={onSearchChange}
                        value={search.search}
                    />

                    {/* status */}
                    <FormControl variant="standard" sx={{ mb: 2, minWidth: 100 }}>
                        <InputLabel id={`id-status`}>
                            Status
                        </InputLabel>
                        <Select
                            size='small'
                            value={search.status}
                            name={'status'} 
                            labelId={`id-status`}
                            onChange={onSearchChange}
                        >
                            <MenuItem value="">
                                All
                            </MenuItem>
                            <MenuItem value="active">
                                Active
                            </MenuItem>
                            <MenuItem value="not_active">
                                Not Active
                            </MenuItem>
                        </Select>
                    </FormControl>

                    
                </Stack>
            </Box>
            
            <TableContainer sx={{ mt: 1 }} component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: green[500]}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white'  }}>No</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Nama</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Status</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Role</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Alamat</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pelanggan.data.length !== 0 && !empty && pelanggan.isComplete && pelanggan.data.map((val, i) => {
                            number.current = (number.current + 1) + (search.limit * (pelanggan.page - 1)) 
                            return (
                                <TableRow key={val.id}>
                                    <TableCell>{number.current}</TableCell>
                                    <TableCell align="center"  sx={{ cursor: 'pointer' }} onClick={() => navigate(`/pelanggan/edit/${val.id}`)}><Box component="span" sx={{ color: 'blue',  }}><i>{ val.name }</i></Box></TableCell>
                                    <TableCell align="center">
                                        { val.status === 'active' ? 
                                            <ToggleOnIcon sx={{ color: green[400], fontSize: 40 }} /> 
                                        :
                                            <ToggleOffIcon sx={{ color: grey[400], fontSize: 40 }} />
                                        }
                                    </TableCell>
                                    <TableCell align="center">{val.role}</TableCell>
                                    <TableCell sx={{ cursor: 'pointer' }} align="center" onClick={() => navigate(`/pelanggan/alamat/${val.id}`)}><Box component="span" sx={{ color: 'blue',  }}><i>Lihat Alamat</i></Box></TableCell>
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/pelanggan/edit/${val.id}`)} />
                                            <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                            <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {pelanggan.data.length !== 0 && pelanggan.isComplete && !empty &&
                 <Pagination sx={{ mt: 2, mx: 'auto' }} count={pelanggan.total} page={pelanggan.page} onChange={onPageChange} color="primary" />
            } 
            {!empty && !pelanggan.isComplete &&
                <CircularProgress sx={{ width: 50, mx: 'auto', mt: 1 }} />
            }
            {empty && pelanggan.isComplete &&
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                    Pelanggan Kosong
                </Typography>
            </Box>    
            }


            

        </Box>
    )
}
export default Pelanggan
