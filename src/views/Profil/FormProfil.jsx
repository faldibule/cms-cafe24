import React, { useState } from 'react';
import { Box, Typography, TextField, FormControl, Dialog, DialogContent, DialogActions, DialogTitle, Button, InputLabel, Select, MenuItem, FormHelperText, InputAdornment, IconButton, Input, OutlinedInput  } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import axios from 'axios'
import { authentication } from '../../Recoil/Authentication';
import { useRecoilState } from 'recoil';
import { API } from '../../Variable/API'
import { useNavigate } from 'react-router-dom'
import { alertState } from '../../Recoil/Alert';
import { dataPelanggan } from '../../Recoil/PelangganRecoil';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


const DialogEditPassword = (props) => {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        old_password: '',
        password: '',
        password_confirmation: '',
    })
    const [showOld, setShowOld] = useState('password')
    const [showNew, setShowNew] = useState('password')
    const [showCon, setShowCon] = useState('password')

    const [alert, setAlert] = useRecoilState(alertState)

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('old_password', form.old_password)
        formData.append('password', form.password)
        formData.append('password_confirmation', form.password_confirmation)

        axios.post(`${API}user/reset_password/with_old_password`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setAlert({
                message: 'Berhasil Ubah Kata Sandi',
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
            // props.handleClose()
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                console.log(err.response)
                if(typeof err.response.data.data !== 'undefined'){
                    setErrors(err.response.data.data)
                }
                if(typeof err.response.data.errors !== 'undefined'){
                    setErrors(err.response.data.errors)
                }
                
            }
        })
    }

    const onShowOld = (e) => {
        if(showOld === 'password'){
            setShowOld('text')
        }else{
            setShowOld('password')
        }
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
            <DialogTitle>Ubah Password</DialogTitle>
            <Box component="form" sx={{ width: 300 }} onSubmit={onSubmit}>

                <DialogContent>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />

                    {/* Old Password */}
                    <FormControl 
                        sx={{ mt: 2 }}
                        error={typeof errors?.message !== 'undefined' ? true : false}
                    >
                        <InputLabel size="small" htmlFor="old_password">Password Lama</InputLabel>
                        <OutlinedInput
                            id="old_password"
                            type={showOld}
                            variant="outlined"
                            label={'Password Lama'}
                            fullWidth
                            size="small"
                            name='old_password'
                            onChange={onChange}
                            value={form.old_password}
                            required 
                            endAdornment={
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={onShowOld}
                                >
                                    {showOld === 'text' ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText>
                        {typeof errors?.message !== 'undefined' ? <span style={{color: 'red'}}>{errors.message}</span> : ''}
                        </FormHelperText>
                    </FormControl>
                    
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

const FormProfil = () => {
    //utils
    const navigate = useNavigate();

    // recoil
    const [dataUser, setDataUser] = useRecoilState(authentication)
    const [alert, setAlert] = useRecoilState(alertState)
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)

    // state
    const [open, setOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        name: dataUser.user.name,
        phone_number: dataUser.user.phone_number,
        role: 'Admin'
    })
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    // Function
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.put(`${API}user/update/${dataUser.user.id}?name=${form.name}&phone_number=${form.phone_number}&role=super admin&status=active`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setDataUser({
                auth: {
                    ...dataUser.auth
                },
                user: {
                    ...dataUser.user,
                    name: form.name,
                    phone_number: form.phone_number
                }
            })
            setLoading(false)
            setAlert({
                message: 'Edit Profil Berhasil',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            setPelanggan([])
            navigate('/dashboard')
        })
        .catch(err => {
            setLoading(false)
            err.response && console.log(err.response)
            if(err.response){
                setErrors(err.response.data.errors)
            }
        })
    }

    return (
        <Box component="div" sx={{ 
            display: 'flex',
            flexDirection: 'column'
         }}>

                {/* Form */}
                <Box component="form" 
                sx={{
                    p: 2,  
                    width: '100%', 
                    boxShadow: 2, 
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }} onSubmit={onSubmit}>
                    <Typography variant="h6">
                        Form Edit Profil
                    </Typography>

                    {/* name */}
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

                    {/* phone number */}
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            sx={{ mt: 2, width: 70, mr: 1 }}
                            variant="outlined"
                            size='small'
                            name='number_indonesia'
                            defaultValue={'+62'}
                            disabled
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            helperText={typeof errors?.phone_number !== 'undefined' ? <span style={{color: 'red'}}>{errors.phone_number[0]}</span> : ''}
                            label={`Nomor Telepon`}
                            name='phone_number'
                            onChange={onChange}
                            value={form.phone_number}
                            required 
                            error={typeof errors?.phone_number !== 'undefined' ? true : false}
                        />
                    </Box>

                    {/* role */}
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
                            disabled
                            onChange={onChange}
                        >
                            <MenuItem value={form.role}>{form.role}</MenuItem>
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.role !== 'undefined' ? errors.role[0] : ``}</FormHelperText>
                    </FormControl>

                    <Button onClick={handleOpen}>
                        Ganti Password
                    </Button>

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, mx: 'auto', borderRadius: 25, minWidth: 400 }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </Box>
                <DialogEditPassword open={open} handleClose={handleClose}  />
        </Box> 
    );
};

export default FormProfil;