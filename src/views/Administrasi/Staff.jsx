import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Paper, Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, CircularProgress, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Pagination } from '@mui/material'
import { blue, pink, green, grey } from '@mui/material/colors';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useRecoilState } from 'recoil'
import { dataStaff } from '../../Recoil/Staff'
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EditIcon from '@mui/icons-material/Edit';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import axios from 'axios';
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom';

const Staff = () => {
    const navigate = useNavigate();

    // ref
    const cancelToken = useRef({})
    const number = useRef()
    number.current = 0

    // recoil
    const [staff, setStaff] = useRecoilState(dataStaff)
    const [alert, setAlert] = useRecoilState(alertState)
    
    // state
    const [search, setSearch] = useState({
        status: '',
        search: '',
        limit: '10',
    })
    const [loading, setLoading] = useState('none')
    const [empty, setEmpty] = useState(false)

    const setDataStaff = () => {
        setEmpty(false)
        axios.get(`${API}user/staff?search=${search.search}&page=1&status=${search.status}&limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setStaff({
                    ...staff,
                    data: [],
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setStaff({
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

    const onPageChange = (e, val) => {
        if(staff.page !== val){
            setStaff({
                ...staff,
                isComplete: false
            })
            axios.get(`${API}user/staff?search=${search.search}&page=1&status=${search.status}&limit=${search.limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                if(res.data.data.length === 0){
                    setEmpty(true)
                    setStaff({
                        ...staff,
                        data: [],
                        isComplete: true
                    })
                }else{
                    setEmpty(false)
                    setEmpty(false)
                    setStaff({
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
        if(staff.data.length === 0 && mounted && !empty){
            setDataStaff()
        }
        return () => mounted = false
    }, [staff.data.length])

    const liveSearch = async (keyword, status) => {
        setEmpty(false)
        if(typeof cancelToken.current.cancel !== 'undefined'){
            cancelToken.current.cancel("Canceled")
        }
        cancelToken.current = axios.CancelToken.source()
        try {
            const res = await axios.get(`${API}user/staff?search=${keyword}&page=1&status=${status}&limit=${search.limit}`, {
                cancelToken: cancelToken.current.token,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setStaff({
                    ...staff,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setStaff({
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
            setStaff({
                ...staff,
                isComplete: false
            })
            liveSearch(e.target.value, search.status)
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            })
        }else{
            setStaff({
                ...staff,
                isComplete: false
            })
            liveSearch(search.search, e.target.value)
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            })
        }
    }


    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Staff Akan Hilang Permanen',
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
                        setStaff({
                            ...staff,
                            isComplete: false
                        })
                        setAlert({
                            message: 'Berhasil Menghapus',
                            display: true
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 4000)
                        setLoading('none')
                        setDataStaff()
                    })
                    .catch(err => {
                        setLoading('none')
                        //if(err.response) console.log(err.response)
                    })
                }
              },
              {
                label: 'Tidak',
                //onClick: () => console.log('Click No')
              }
            ]
          });
    }

    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Typography variant="h5">
                Daftar Staff
            </Typography>
            <Button onClick={() => navigate(`/administrasi/staff/add`) } size='small' sx={{ my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
               <AddBoxIcon  /> Tambah Data Staff
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
                    <TableHead sx={{ backgroundColor: blue[500]}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white'  }}>No</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Nama</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Status</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Role</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Pelanggan Anda</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staff.data.length !== 0 && !empty && staff.isComplete && staff.data.map((val, i) => {
                            number.current = (number.current + 1) + (search.limit * (staff.page - 1)) 
                            return (
                                <TableRow key={val.id}>
                                    <TableCell>{number.current}</TableCell>
                                    <TableCell align="center"  sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate(`/administrasi/staff/edit/${val.id}`)}><i>{ val.name }</i></TableCell>
                                    <TableCell align="center">
                                        { val.status === 'active' ? 
                                            <ToggleOnIcon sx={{ color: green[400], fontSize: 40 }} /> 
                                        :
                                            <ToggleOffIcon sx={{ color: grey[400], fontSize: 40 }} />
                                        }
                                    </TableCell>
                                    <TableCell align="center">{val.role}</TableCell>
                                    <TableCell sx={{ cursor: 'pointer', color: 'blue' }} align="center" onClick={() => navigate(`/admin/user/${val.id}`)}><i>Detail Pelanggan Anda</i></TableCell>
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/administrasi/staff/edit/${val.id}`)} />
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
            {staff.data.length !== 0 && staff.isComplete && !empty &&
                 <Pagination sx={{ mt: 2, mx: 'auto' }} count={staff.total} page={staff.page} onChange={onPageChange} color="primary" />
            } 
            {!empty && !staff.isComplete &&
                <CircularProgress sx={{ width: 50, mx: 'auto', mt: 1 }} />
            }
            {empty && staff.isComplete &&
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                    Staff Kosong
                </Typography>
            </Box>    
            }
        </Box>
    )
}
export default Staff
