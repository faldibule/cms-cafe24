import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { dataPelanggan } from '../../../Recoil/PelangganRecoil';
import { dataRole } from '../../../Recoil/Role';


const FormPelanggan = () => {
    const navigate = useNavigate()

    
    // recoil
    const [role, setRole] = useRecoilState(dataRole)
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        number_indonesia: '+62',
        name: '',
        email: '',
        phone_number: '',
        password_confirmation: '',
        password: '',
        role: ''
    })

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

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('email', form.email)
        formData.append('phone_number', form.phone_number)
        formData.append('password', form.password)
        formData.append('password_confirmation', form.password_confirmation)
        formData.append('role', 'customer')
        axios.post(`${API}user/create_customer`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setPelanggan({
                ...pelanggan,
                isComplete: false,
                data: []
            })
            setLoading(false)
            setAlert({
                message: 'Berhasil Menambah Data Pelanggan',
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
                flexDirection: 'column',
            }}>
                <Box component="form" 
                sx={{
                    p: 2,  
                    minWidth: '100%', 
                    boxShadow: 2, 
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }} onSubmit={onSubmit}>
                    <Typography variant="h6">
                        Form Tambah Pelanggan
                    </Typography>
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
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Email`}
                        name='email'
                        onChange={onChange}
                        value={form.email}
                        required
                        type={'email'} 
                        helperText={typeof errors?.email !== 'undefined' ? <span style={{color: 'red'}}>{errors.email[0]}</span> : ''}
                        error={typeof errors?.email !== 'undefined' ? true : false}

                    />
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
                            helperText={typeof errors?.phone_number !== 'undefined' ? <span style={{color: 'red'}}>{errors.phone_number[0]}</span> : ''}
                            label={`Nomor Telepon`}
                            name='phone_number'
                            onChange={onChange}
                            value={form.phone_number}
                            required 
                            error={typeof errors?.phone_number !== 'undefined' ? true : false}
                        />

                    </Box>
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        helperText={typeof errors?.password !== 'undefined' ? <span style={{color: 'red'}}>{errors.password[0]}</span> : ''}
                        label={`Password`}
                        name='password'
                        onChange={onChange}
                        value={form.password}
                        required 
                        error={typeof errors?.password !== 'undefined' ? true : false}
                        type={'password'}
                    />
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        helperText={typeof errors?.password !== 'undefined' ? <span style={{color: 'red'}}>{errors.password[0]}</span> : ''}
                        label={`Ulangi Password`}
                        name='password_confirmation'
                        onChange={onChange}
                        value={form.password_confirmation}
                        required 
                        type={'password'}
                        error={typeof errors?.password !== 'undefined' ? true : false}
                    />
                    {/* {role.length !== 0 &&
                    <FormControl variant="standard" sx={{ my: 1 }}  
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
                    } */}

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, mx: 'auto', borderRadius: 25, minWidth: 400 }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </Box>
            </Box>
        </div>
    )
};

export default FormPelanggan;
