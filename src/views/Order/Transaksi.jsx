import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, CircularProgress, Autocomplete, Stack, TextField } from '@mui/material'
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
import { dataTransaksi } from '../../Recoil/Order';
import { dataPelanggan } from '../../Recoil/PelangganRecoil';
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment'

const Transaksi = () => {
    const navigate = useNavigate()

    // state
    const [allTransaksi, setAllTransaksi] = useState([])
    const [empty, setEmpty] = useState(false)
    const [empty2, setEmpty2] = useState(false)
    const [search, setSearch] = useState({
        user_id: '',
        kode_unik: '',
    })
    const [keyword, setKeyword] = useState('')

    // Recoil
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    const [transaksi, setTransaksi] = useRecoilState(dataTransaksi)
    const [alert, setAlert] = useRecoilState(alertState)

    //ref
    const cancelToken = useRef({})

    const setDataTransaksi = () => {
        axios.get(`${API}transaction/payment?user_id=&status=process`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.length === 0){
                setEmpty(true)
            }else{
                setEmpty(false)
                setTransaksi([...res.data.data])
                setAllTransaksi([...res.data.data])
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    const liveSearch = async (keyword, status) => {
        setEmpty2(false)
        if(typeof cancelToken.current.cancel !== 'undefined'){
            cancelToken.current.cancel("Canceled")
        }
        cancelToken.current = axios.CancelToken.source()
        try {
            const res = await axios.get(`${API}user/customer?search=${keyword}&page=1&status=${status}&limit=`, {
                cancelToken: cancelToken.current.token,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if(res.data.data.data.length === 0){
                setEmpty2(true)
                setPelanggan({
                    ...pelanggan,
                    isComplete: true
                })
            }else{
                setEmpty2(false)
                setPelanggan({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        } catch (error) {
            // console.log(error)
        }
        
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let temp = [];
        if(keyword !== '' && search.kode_unik == ''){
            temp = allTransaksi.filter(val => val.user.id === search.user_id)
        }else if(keyword == '' && search.kode_unik !== ''){
            temp = allTransaksi.filter(val => val.unique_code == search.kode_unik)
        }else if(keyword !== '' && search.kode_unik !== ''){
            temp = allTransaksi.filter(val => val.user.id === search.user_id && val.unique_code == search.kode_unik)
        }else if(keyword == '' && search.kode_unik == ''){
            temp = [...allTransaksi]
        }
        setTransaksi([...temp])
    }

    useEffect(() => {
        let mounted = true
        if(mounted && transaksi.length === 0 && !empty){
            setDataTransaksi()
        }

        return () => mounted = false
    }, [transaksi.length])

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
                        Transaksi yang Sedang Berlangsung
                    </Typography>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} /> 

                    <Box component="form" sx={{ width: '100%', mt: 2 }} onSubmit={onSubmit}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                            {/* search */}
                            <Autocomplete
                                sx={{ width: '50%' }}
                                size='small'
                                variant="outlined"
                                freeSolo={true}
                                value={pelanggan.data.filter(val => val.id === search.user_id)[0]}
                                onChange={(event, newValue) => {
                                    // console.log(newValue)
                                    // select
                                    if(newValue === null){
                                        setKeyword('')
                                    }
                                    if(newValue !== null){
                                        setKeyword(newValue.name)
                                        setSearch({
                                            ...search,
                                            user_id: newValue.id  
                                        })
                                    }
                                    
                                }}
                                inputValue={keyword}
                                loading={pelanggan.isComplete ? false : true}
                                onInputChange={(event, newInputValue) => {
                                    // ketik
                                    setKeyword(newInputValue)
                                    liveSearch(newInputValue, "active")
                                }}
                                id="controllable-states-demo"
                                options={[...pelanggan.data]}
                                isOptionEqualToValue={(option, value) => {
                                        return option.id === value.id
                                    }
                                }
                                getOptionLabel={(option) => typeof option.name !== 'undefined' ? option.name : ''}
                                renderInput={(params) => 
                                <TextField 
                                    {...params} 
                                    label="User"
                                    InputProps={{
                                        ...params.InputProps,
                                    }} 
                                />}
                            />
                            <TextField
                                sx={{ width: '50%' }}
                                size="small"
                                label="Kode Unik"
                                name="kode_unik"
                                value={search.kode_unik}
                                onChange={(e) => {
                                    setSearch({
                                        ...search,
                                        [e.target.name]: e.target.value
                                    })
                                }}
                            />
                            <Button variant="contained" sx={{ borderRadius: 25 }} type="submit">Cari</Button>
                        </Stack>
                    </Box>
                    {/* Table */}
                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: blue[500]}}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Nama</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Kode Unik</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Total</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Tanggal</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {transaksi.length !== 0 && transaksi.map((val, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {i + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            {val.user.name}
                                        </TableCell>
                                        <TableCell align="center">
                                            {val.unique_code}
                                        </TableCell>
                                        <TableCell align="center">
                                            <CurrencyFormat 
                                                value={val.total}
                                                displayType={'text'} 
                                                thousandSeparator={"."}
                                                decimalSeparator={","} 
                                                prefix={'Rp.'} 
                                                renderText={value =>  
                                                        <b>{value}</b>
                                                } 
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {moment(val.created_at.split(' ')[0]).format('ll')}
                                            <Box sx={{ ml: 1 }} component="span">Pukul</Box> {moment(val.created_at).format('HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                        <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/transaksi/${val.id}`)} />
                                                
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {transaksi.length === 0 && !empty &&
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

export default Transaksi;