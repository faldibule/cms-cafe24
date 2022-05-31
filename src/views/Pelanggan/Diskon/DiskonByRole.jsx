import React, { useState, useEffect } from 'react';
import { Box, TableContainer, Table, Paper, TableHead, TableBody, TableRow, TableCell, Checkbox, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText, FormControlLabel, FormGroup, Switch, CircularProgress } from '@mui/material'
import { green, blue, pink } from '@mui/material/colors'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { kategoriParent } from '../../../Recoil/Kategori';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { dataDiskonUser } from '../../../Recoil/DiskonUser';
import { format } from 'date-fns';
import moment from 'moment'
import AlertSuccess from '../../../components/Utils/AlertSuccess'
import { dataRole } from '../../../Recoil/Role';
import CurrencyFormat from 'react-currency-format';



const DiskonByRole = () => {
    
    //utils
    const id = window.location.href.split('/')[4]
    const navigate = useNavigate()

    // recoil
    const [role, setRole] = useRecoilState(dataRole)
    const [alert, setAlert] = useRecoilState(alertState)
    const allKategori = useRecoilValue(kategoriParent)
    const [diskonTemp, setDiskonTemp] = useRecoilState(dataDiskonUser)

    // state
    const [empty, setEmpty] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [diskon, setDiskon] = useState([])
    const [errors, setErrors] = useState({})
    const [deleteLoading, setDeleteLoading] = useState('none')

    const setDiskonGroup = () => {
        axios.get(`${API}discount/fetch?type=group&group_user_id=${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.length === 0){
                setEmpty(true)
                setDiskon([...allKategori])
                setIsComplete(true)
            }else{
                setEmpty(false)
                let selected = res.data.data.map(v => v.category.id)
                let unselected = allKategori.filter(v => {
                    return !selected.includes(v.id)
                })
                setDiskon([...res.data.data, ...unselected])
                setIsComplete(true)
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setDiskonGroup()
        }
        return () => mounted = false
    }, [id])


    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Pelanggan Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    
                    setDeleteLoading('block')
                    let x = format(new Date(), 'yyyy-MM-dd')
                    x = `${x} 23:59:59`
                    let y = format(new Date(), 'yyyy-MM-dd')
                    y = `${y} 23:59:59`
                    const formData = new FormData()
                    formData.append('_method', 'patch')
                    formData.append('discount_type', 'rp')
                    formData.append('discount', '0')
                    formData.append('start_date', x)
                    formData.append('end_date', y)
                    axios.post(`${API}discount/update/${id}`, formData, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('authToken')
                        }
                    })
                    .then(res => {
                        setDiskonTemp([])
                        setDiskonGroup()
                        setIsComplete(false)
                        setAlert({
                            message: 'Berhasil Hapus Diskon',
                            display: true
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 3000)
                        setDeleteLoading('none')

                    })
                    .catch(err => {
                        setDeleteLoading('none')
                        if(err.response) console.log(err.response)
                    })
                }
              },
              {
                label: 'Tidak',
                onClick: () => console.log(new Date().toLocaleString())
              }
            ]
          });
    }



    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
            }}>

                {/* Kategory by user id */}
                <Box component="div" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '100%'
                }}>
                <Typography variant="h5">
                    Daftar Diskon Untuk "<b>{role.filter(v => v.id == id)[0].name}</b>"
                </Typography>
                <CircularProgress sx={{ width: 50, display: deleteLoading }} />
                <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
                <TableContainer sx={{ mt: 1 }} component={Paper}>
                    <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: blue[500]}}>
                            <TableRow>
                                <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Kategori</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Diskon</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Dari</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Sampai</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isComplete && diskon.map((val, i) => {
                                if(typeof val.discount !== 'undefined'){
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{++i}</TableCell>
                                            <TableCell align="center">{val.category.category_name}</TableCell>
                                            {val.discount_type === "rp" && val.discount !== 0 &&
                                                <CurrencyFormat 
                                                    value={val.discount} 
                                                    displayType={'text'} 
                                                    thousandSeparator={"."}
                                                    decimalSeparator={","} 
                                                    prefix={'Rp.'} 
                                                    renderText={value => 
                                                        <TableCell align="center">{value}</TableCell>
                                                    } 
                                                /> 
                                                
                                            
                                            }
                                            {val.discount_type === "percent" && val.discount !== 0 &&
                                                <TableCell align="center">{val.discount}%</TableCell>
                                            }
                                            {val.discount === 0 &&
                                                <TableCell align="center">0</TableCell>
                                            }
                                            <TableCell align="center">{val.discount === 0 ? '-' : moment(val.start_date.split(' ')[0]).format('ll')}</TableCell>
                                            <TableCell align="center">{val.discount === 0 ? '-' : moment(val.end_date.split(' ')[0]).format('ll')}</TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/diskon/edit/${val.id}`)} />
                                                    {val.discount !== 0 &&
                                                        <>
                                                            <Box component="span" sx={{ fontSize: '1.2rem' }}>|</   Box>
                                                            <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} />
                                                        </>
                                                    }
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }else{
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{++i}</TableCell>
                                            <TableCell align="center">{val.category_name}</TableCell>
                                            <TableCell align="center">0</TableCell>
                                            <TableCell align="center">-</TableCell>
                                            <TableCell align="center">-</TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/diskon/add/${val.id}-${id}`)} />
                                                </Box>
                                            </TableCell>
                                            
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer> 
                {!isComplete && 
                    <CircularProgress sx={{ width: 50, mx: 'auto', mt: 2}} />
                }
                </Box>
            </Box>
        </div>
    )
};

export default DiskonByRole;
