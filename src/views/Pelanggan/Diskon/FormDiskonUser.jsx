import React, { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { DateRangePicker, LoadingButton, LocalizationProvider  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { dataPelanggan } from '../../../Recoil/PelangganRecoil';
import { dataDiskonUser } from '../../../Recoil/DiskonUser';
import moment from 'moment'
import CurrencyFormat from 'react-currency-format';
import { format } from 'date-fns';

const role = ['customer', 'distributor', 'reseller', 'admin', 'test eror']

const FormDiskonUser = () => {
    const navigate = useNavigate()
    const kategoriId = window.location.href.split('/')[5].split('-')[0]
    const userId = window.location.href.split('/')[5].split('-')[1]

    // Recoil
    const [diskonTemp, setDiskonTemp] = useRecoilState(dataDiskonUser)
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    const [dateTemp, setDateTemp] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        type: '',
        diskon: '',
        date: [null, null],
        
    })

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)    

        let x = format(form.date[0], 'yyyy-MM-dd')
        const clock = moment(Date.now()).add('30', 'seconds').format('HH:mm:ss')
        if(x === moment(Date.now()).format('YYYY-MM-DD')){
            x = `${x} ${clock}`
        }else{
            x = `${x} 00:00:00`
        }
        let y = format(form.date[1], 'yyyy-MM-dd')
        y = `${y} 23:59:59`
        const formData = new FormData()
        formData.append('type', 'user')
        formData.append('discount_type', form.type)
        formData.append('user_id', userId)
        formData.append('category_id', kategoriId)
        formData.append('discount', form.diskon)
        formData.append('start_date', x)
        formData.append('end_date', y)

        

        axios.post(`${API}discount/create`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setDiskonTemp([])
            setAlert({
                message: 'Berhasil Menambah Diskon',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 6000)
            navigate(-1)
        })
        .catch(err => {
            if(err.response){
                setErrors(err.response.data.errors)
                console.log(err.response)
            }
            setLoading(false)

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
                    minWidth: `100%`, 
                    boxShadow: 2, 
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }} onSubmit={onSubmit}>
                    <Typography variant="h6">
                        Form Tambah Diskon User
                    </Typography>

                    <FormControl 
                        variant="standard" 
                        fullWidth 
                        sx={{ my: 2 }} 
                        error={typeof errors?.discount_type !== 'undefined' ? true : false}
                    >
                        <InputLabel id={`id-type`}>
                            Type
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.type}
                            name={'type'} 
                            labelId={`id-type`}
                            onChange={onChange}
                        >
                            <MenuItem value="">
                                None
                            </MenuItem>
                            <MenuItem value="rp">
                                Rupiah
                            </MenuItem>
                            <MenuItem value="percent">
                                Percent
                            </MenuItem>
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.discount_type !== 'undefined' ? errors.discount_type[0] : ``}</FormHelperText>
                    </FormControl>

                    {form.type === 'rp' &&
                        <CurrencyFormat 
                            customInput={
                                TextField
                            } 
                            value={form.diskon}
                            label={`Nilai Diskon`}
                            size="small" 
                            thousandSeparator={"."} 
                            decimalSeparator={","}
                            prefix={'Rp'}
                            onValueChange={(val => {
                                setForm({
                                    ...form,
                                    diskon: val.value
                                })
                            })}
                        /> 
                    }
                    {form.type === 'percent' &&
                    <TextField
                        sx={{ my: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Nilai Diskon`}
                        name='diskon'
                        onChange={onChange}
                        value={form.diskon}
                        required 
                        helperText={typeof errors?.discount !== 'undefined' ? <span style={{color: 'red'}}>{errors.discount[0]}</span> : ''}
                        error={typeof errors?.discount !== 'undefined' ? true : false}
                    />
                    }

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                            disablePast
                            inputFormat='dd-MM-yyyy'
                            mask="__-__-____"
                            startText="Berlaku Dari"
                            endText="Berlaku Sampai"
                            value={form.date}
                            onChange={(newValue) => {

                                setForm({
                                    ...form,
                                    date: newValue
                                })
                            }}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField required size="small" fullWidth sx={{ mt: 3 }} {...startProps} />
                                    <Box   Box sx={{ mx: 2 }}> Sampai </Box>
                                    <TextField required size="small" fullWidth sx={{ mt: 3 }} {...endProps} />
                                </React.Fragment>
                            )}
                        />
                    </LocalizationProvider>
                    
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

export default FormDiskonUser;
