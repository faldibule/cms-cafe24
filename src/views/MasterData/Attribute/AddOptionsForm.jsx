import React, { useEffect, useState } from 'react'
import {TableContainer, Table, TableRow, TableHead, TableBody, TableCell, Paper, TextField, Button, Typography, Box, CircularProgress } from '@mui/material'
import { AttributeStyle } from './AttributeStyle'
import axios from 'axios'
import { API } from '../../../Variable/API'
import { useNavigate, Navigate } from 'react-router-dom'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { LoadingButton } from '@mui/lab'
import { alertState } from '../../../Recoil/Alert';
import { errorState } from '../../../Recoil/Error'
import { useRecoilState } from 'recoil'
import AlertSuccess from '../../../components/Utils/AlertSuccess';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import EditOffIcon from '@mui/icons-material/EditOff';
import { grey, blue, green, pink } from '@mui/material/colors'
import { allAttr } from '../../../Recoil/Attr'


const AddOptionsForm = () => {
    const parent = window.location.pathname.split('/')[3].split('-')[0].replace('%20', ' ')
    const parentId = window.location.pathname.split('/')[3].split('-')[1]
    const classes = AttributeStyle()
    const history = useNavigate()

    // state
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [found, setFound] = useState(true)
    const [empty, setEmpty] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dataTable, setDataTable] = useState([])
    const [form, setForm] = useState({
        nama: '',
        deskripsi: '',
    })

    // recoil
    const [errors, setErrors] = useState({})
    const [alert, setAlert] = useRecoilState(alertState)
    const [allAttribute, setAllAttribute] = useRecoilState(allAttr)

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Variant Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}variant_option/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setAlert({
                            message: 'Berhasil Delete Option',
                            display: true
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 5000)
                        const newDataTable = dataTable.filter(val => val.id !== id)
                        setDataTable([...newDataTable])
                    })
                    .catch(err => {
                        if(err.response){
                            // console.log(err.response)
                        }
                        setDeleteLoading('none')
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
    
    const onSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            variant_id: parentId,
            variant_option_name: form.nama
        }
        axios.post(`${API}variant_option/create`, data, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            // console.log(res.data.data)
            setLoading(false)
            setDataTable(
                [
                    {
                        ...res.data.data,
                        default: 0,
                    },
                    ...dataTable,
                ]
            )
            setAlert({
                message: 'Berhasil Menambah Options',
                display: true
            })
            setErrors({})
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            setForm({
                ...form,
                nama: '',
            })
            setEmpty(false)
            setAllAttribute([])
        })
        .catch(err => {
            if(err.response){
                // console.log(err.response)
                setErrors({
                    ...err.response.data.errors
                })
            } 
            setLoading(false)
        })
        
    }

    const setData = () => {
        axios.get(`${API}variant_option/fetch?variant_id=${parentId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            // console.log(res.data)
            if(res.data.data.length === 0){
                setEmpty(true)
            }else{
                setDataTable([...res.data.data].reverse())
            }
        })
        .catch(err => {
            if(err.response){
                // console.log(err.response)
                setFound(false)
            }
        })
    }


    useEffect(() => {
        let mounted = true;
        if(mounted && dataTable.length === 0 && !empty){
            setData()
        }

        return () => mounted = false

    }, [parent, dataTable])

    if(!found){
        return <Navigate to={'/master-data/attr'} />
    }

    return (
        <div className={classes.container}>
            <form onSubmit={onSubmit} className={classes.formChild}>
                <Typography variant='h6' sx={{mb: 2}}>
                    Form Add New Options
                </Typography>
                <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
                <Box component='div' sx={{ mt: 1, display: deleteLoading  }} >
                    <CircularProgress size={30}/>
                </Box>
            
                <TextField
                    className={classes.input}
                    variant="outlined"
                    size='small'
                    fullWidth
                    label={`Nama ${parent}`}
                    name={'nama'} 
                    onChange={onChange}
                    value={form.nama}
                    required 
                    helperText={typeof errors?.variant_option_name !== 'undefined' ? <span style={{color: 'red'}}>{errors.variant_option_name[0]}</span> : ''}
                    error={typeof errors?.variant_option_name !== 'undefined' ? true : false}
                />
                <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{mt: 1,borderRadius: 25 }}
                    loading={loading}
                >
                    Simpan
                </LoadingButton>
            </form>

            
            <div className={classes.tableChild}>
                <Typography variant='h6' sx={{mb: 2}}>
                    Options Table
                </Typography>
                <TableContainer sx={{ minWidth: 650, maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: blue[500]}}>
                            <TableRow>
                                <TableCell sx={{ color: 'white'  }} align="center">No</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Name</TableCell>
                                <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataTable.length !== 0 && dataTable.map((val, i) => (
                                <TableRow key={i}>
                                    <TableCell align="center">{++i}</TableCell>
                                    <TableCell align="center">{val.variant_option_name}</TableCell>
                                    <TableCell align="center">
                                        {val.default === 0 ?
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => history(`/master-data/attr/edit/${val.id}`)} />
                                                <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                                <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} /> 
                                            
                                                
                                            </Box>
                                        :
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <span className={classes.editIcon}> <EditOffIcon sx={{color: grey[400]}} /> </span>
                                                |
                                                <span className={classes.editIcon}> <DeleteForeverIcon sx={{color: grey[400]}} /> </span>
                                                
                                            </Box>
                                        }
                                        
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                {empty && <Box style={{ mx: 'auto', width: '100%', color: 'red', textAlign: 'center' }}>Data Kosong</Box>}
                {dataTable.length === 0 && !empty &&
                <Box 
                    sx={{width: 400, display: 'flex', justifyContent: 'center', margin: '10px auto'}}
                    component='div'
                    >
                    <CircularProgress sx={{margin: '10px auto'}} />
                </Box>
                }
                </TableContainer> 
            </div>
        </div>
    )
}

export default AddOptionsForm
