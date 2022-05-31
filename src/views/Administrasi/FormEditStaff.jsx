import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControl, FormGroup, FormControlLabel, Switch, InputLabel, Select, MenuItem, Typography, FormHelperText, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert'
import { dataStaff } from '../../Recoil/Staff';
import { dataRole } from '../../Recoil/Role';

const role = ['admin', 'admin staff', 'admin keuangan', 'test eror']

const FormEditStaff = () => {
    const id = window.location.href.split('/')[6]

    const navigate = useNavigate()

    // recoil
    const [role, setRole] = useRecoilState(dataRole)
    const [staff, setStaff] = useRecoilState(dataStaff)
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    const [isComplete, setIsComplete] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        name: null,
        email: null,
        phone_number: null,
        role: '',
        status: null,
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
            // err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && role.length === 0){
            setDataRole()
        }

        return () => mounted = false

    }, [role.length])

    const setData = () => {
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
                role: res.data.data.role,
                status: res.data.data.status
            })
            setIsComplete(true)
        })
        .catch(err => {
            // err.response && console.log(err.response)
            setIsComplete(true)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setData()
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
            setStaff({
                ...staff,
                isComplete: false,
                data: []
            })
            setLoading(false)
            setAlert({
                message: 'Berhasil Edit Data Staff',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 4000)
            navigate(`/administrasi/staff`)
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
                {isComplete &&
                <Box component="form" 
                sx={{
                    p: 2,  
                    minWidth: `100%`, 
                    boxShadow: 2, 
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }} onSubmit={onSubmit}>
                    <Typography variant="h6">
                        Form Edit Staff
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
                        error={false}
                    />
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
                    {role.length !== 0 &&
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
                                if(val.id === 1 || val.id === 2 || val.id === 3){
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

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, mx: 'auto', borderRadius: 25, minWidth: 400 }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </Box>
                }
                {!isComplete &&
                <CircularProgress sx={{ width: 50}} />
                }
            </Box>
        </div>
    )
};

export default FormEditStaff;
