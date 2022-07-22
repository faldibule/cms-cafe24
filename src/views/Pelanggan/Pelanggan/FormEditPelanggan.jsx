import React, { useState, useEffect } from 'react';
import { Box, TableContainer, Table, Paper, TableHead, TableBody, TableRow, TableCell, Checkbox, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText, FormControlLabel, FormGroup, Switch, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, OutlinedInput, InputAdornment, IconButton, Button } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { green, blue, pink } from '@mui/material/colors'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { dataPelanggan } from '../../../Recoil/PelangganRecoil';
import { kategoriParent } from '../../../Recoil/Kategori';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { dataDiskonUser } from '../../../Recoil/DiskonUser';
import { format } from 'date-fns';
import moment from 'moment'
import AlertSuccess from '../../../components/Utils/AlertSuccess'
import { dataRole } from '../../../Recoil/Role';
import CurrencyFormat from 'react-currency-format';



const DialogEditPassword = (props) => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        password: '',
        password_confirmation: '',
    })
    const [showNew, setShowNew] = useState('password')
    const [showCon, setShowCon] = useState('password')

    const [alert, setAlert] = useRecoilState(alertState)

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('user_id', props.id)
        formData.append('password', form.password)
        formData.append('password_confirmation', form.password_confirmation)

        axios.post(`${API}user/reset_password/without_confirmation`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setAlert({
                message: 'Berhasil Reset Kata Sandi',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            setForm({
                old_password: '',
                password: '',
                password_confirmation: '',
            })
            setErrors({})
            props.handleClose()
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                // console.log(err.response)
                if(typeof err.response.data.data !== 'undefined'){
                    setErrors(err.response.data.data)
                }
                if(typeof err.response.data.errors !== 'undefined'){
                    setErrors(err.response.data.errors)
                }
                
            }
        })
    }

    const onShowNew = (e) => {
        if(showNew === 'password'){
            setShowNew('text')
        }else{
            setShowNew('password')
        }
    }

    const onShowCon = (e) => {
        if(showCon === 'password'){
            setShowCon('text')
        }else{
            setShowCon('password')
        }
    }

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    return (
        <Dialog
            open={props.open}
            keepMounted
            onClose={props.handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>Reset Password</DialogTitle>
            <Box component="form" sx={{ width: 300 }} onSubmit={onSubmit}>

                <DialogContent>
                    
                    {/* New Password */}
                    <FormControl 
                        sx={{ mt: 2 }} 
                        error={typeof errors?.password !== 'undefined' ? true : false}
                    >
                        <InputLabel size="small" htmlFor="password">Password Baru</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showNew}
                            label={'Password Baru'}
                            variant="outlined"
                            fullWidth
                            size="small"
                            name='password'
                            onChange={onChange}
                            value={form.password}
                            required 
                            endAdornment={
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onShowNew}
                                >
                                    {showNew === 'text' ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>
                        {typeof errors?.password !== 'undefined' ? <span style={{color: 'red'}}>{errors.password[0]}</span> : ''}
                        </FormHelperText>
                    </FormControl>

                    {/* Confirmation */}
                    <FormControl 
                        sx={{ mt: 2 }} 
                        error={typeof errors?.password_confirmation !== 'undefined' ? true : false}
                    >
                        <InputLabel size="small" htmlFor="password_confirmation">Ulangi Password Baru</InputLabel>
                        <OutlinedInput
                            id="password_confirmation"
                            type={showCon}
                            label={'Ulangi Password Baru'}
                            variant="outlined"
                            fullWidth
                            size="small"
                            name='password_confirmation'
                            onChange={onChange}
                            value={form.password_confirmation}
                            required 
                            endAdornment={
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password_confirmation visibility"
                                    onClick={onShowCon}
                                >
                                    {showCon === 'text' ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>
                        {typeof errors?.password_confirmation !== 'undefined' ? <span style={{color: 'red'}}>{errors.password_confirmation[0]}</span> : ''}
                        </FormHelperText>
                    </FormControl>
                    
                </DialogContent>

                <DialogActions>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                    <Button type="button" onClick={props.handleClose}>Close</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

const FormEditPelanggan = () => {
    
    //utils
    const id = window.location.href.split('/')[5]
    const navigate = useNavigate()

    // recoil
    const [role, setRole] = useRecoilState(dataRole)
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    const [alert, setAlert] = useRecoilState(alertState)
    const allKategori = useRecoilValue(kategoriParent)
    const [diskonTemp, setDiskonTemp] = useRecoilState(dataDiskonUser)


    // state
    const [open, setOpen] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [empty, setEmpty] = useState(false)
    const [diskon, setDiskon] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [form, setForm] = useState({
        number_indonesia: '+62',
        email: null,
        name: null,
        phone_number: null,
        status: null,
        role: '',
    })

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const setDataRole = () => {
        axios.get(`${API}role/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setRole([...res.data.data])
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && role.length === 0){
            setDataRole()
        }

        return () => mounted = false

    }, [role.length])

    const setDiskonUser = () => {
        axios.get(`${API}discount/fetch?type=user&user_id=${id}`, {
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

    const setDataForm = () => {
        axios.get(`${API}user/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setForm({
                ...form,
                name: res.data.data.name,
                email: res.data.data.email,
                phone_number: res.data.data.phone_number,
                status: res.data.data.status,
                role: res.data.data.role
            })
            setDiskonUser()
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setDiskonTemp([])
            setDataForm()
        }
        return () => mounted = false
    }, [id])

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const checkChange = (event) => {
        setForm({
            ...form,
            status: event.target.checked ? 'active' : 'not_active'
        });
    };

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
                        setDiskonUser()
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
                        setLoading('none')
                        // if(err.response) console.log(err.response)
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

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.put(`${API}user/update/${id}?name=${form.name}&phone_number=${form.phone_number}&role=${form.role}&status=${form.status}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            setPelanggan({
                ...pelanggan,
                isComplete: false,
                data: []
            })
            setLoading(false)
            setAlert({
                message: 'Berhasil Update Data Pelanggan',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 4000)
            navigate(`/pelanggan`)
        })
        .catch(err => {
            if(err.response){
                setLoading(false)
                // console.log(err.response)
                setErrors(err.response.data.errors)
            }
        })
    }


    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
            }}>
                
                {/* Form */}
                {form.name !== null && 
                <Box component="form" 
                sx={{
                    p: 2,  
                    minWidth: '45%', 
                    boxShadow: 2, 
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    mr: 3 
                }} onSubmit={onSubmit}>
                    <Typography variant="h6">
                        Form Edit Pelanggan
                    </Typography>

                    {/* name */}
                    {form.name !== null &&
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Name`}
                        name='name'
                        onChange={onChange}
                        value={form.name}
                        required 
                        error={false}
                    />
                    }

                    {/* email */}
                    {form.email !== null &&
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Email`}
                        name='email'
                        value={form.email}
                        required 
                        disabled
                        error={false}
                    />
                    }

                    {/* phone number */}
                    {form.phone_number !== null &&
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            sx={{ mt: 2, width: 70, mr: 1 }}
                            variant="outlined"
                            size='small'
                            name='number_indonesia'
                            value={form.number_indonesia}
                            disabled
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={`Nomor Telepon`}
                            name='phone_number'
                            onChange={onChange}
                            value={form.phone_number}
                            required 
                            helperText={typeof errors?.phone_number !== 'undefined' ? <span style={{color: 'red'}}>{errors.phone_number[0]}</span> : ''}
                            error={typeof errors?.phone_number !== 'undefined' ? true : false}
                        />
                    </Box> 
                    }

                    {/* role */}
                    {role.length !== 0 &&
                    <FormControl variant="standard" sx={{ my: 2 }}  
                        fullWidth 
                        error={typeof errors?.role !== 'undefined' ? true : false}
                    >
                        <InputLabel id={`id-role`}>
                            Role User
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.role}
                            name={`role`} 
                            labelId={`id-role`}
                            onChange={onChange}
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {role.map((val, i) => {
                                if(val.id !== 1 && val.id !== 2 && val.id !== 3){
                                    return (
                                        <MenuItem key={i} value={val.name}>{val.name}</MenuItem>
                                    )
                                }
                            })}
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.role !== 'undefined' ? errors.role[0] : ``}</FormHelperText>
                    </FormControl>
                    }
                    {role.length === 0 &&
                        <CircularProgress sx={{ width: 50, display: 'block', my: 2 }} />
                    }

                    {/* status */}
                    {form.status !== null &&
                    
                    <FormGroup>
                        <FormControlLabel 
                        control={
                            <Switch
                                name='status'
                                checked={form.status === 'not_active' ? false : true}
                                onChange={checkChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        } 
                        label="Status Pelanggan" />
                    </FormGroup>
                    }
                    <Button onClick={handleOpen}>
                        Reset Password
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, mx: 'auto', borderRadius: 25, minWidth: '50%' }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                    
                </Box>
                }
                
                <DialogEditPassword handleClose={handleClose} id={id} open={open} />
                
                {form.name === null &&
                    <CircularProgress sx={{ width: 50}} />
                }



                {/* Kategory by user id */}
                {form.name !== null && 
                <Box component="div" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: '50%'
                }}>
                <Typography variant="h5">
                    Daftar Diskon untuk {form.name}
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
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/diskon_user/edit/${val.id}`)} />
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
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/diskon_user/add/${val.id}-${id}`)} />
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
                }


            </Box>
        </div>
    )
};

export default FormEditPelanggan;
