import React, { useState, useEffect } from 'react';
import { Box, TextField, FormControl, CircularProgress, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { DateRangePicker, LoadingButton, LocalizationProvider  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { dataDiskonUser } from '../../../Recoil/DiskonUser';
import { format, parseISO } from 'date-fns';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment'

const FormEditDiskon = () => {
    const navigate = useNavigate()
    const diskonId = window.location.href.split('/')[5]

    // Recoil
    const [diskonTemp, setDiskonTemp] = useRecoilState(dataDiskonUser)
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    const [isComplete, setIsComplete] = useState(false)
    const [dateTemp, setDateTemp] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        type: '',
        diskon: '',
        date: [null, null],
        
    })

    const setData = () => {
        axios.get(`${API}discount/show/${diskonId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            let x = parseISO(res.data.data.start_date.split(' ')[0])
            let y = parseISO(res.data.data.end_date.split(' ')[0])
            setForm({
                type: res.data.data.discount === 0 ? '' : res.data.data.discount_type,
                diskon: res.data.data.discount === 0 ? '' : res.data.data.discount,
                date: res.data.data.discount === 0 ? [null, null] : [x, y]
            })
            setIsComplete(true)
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setData()
        }

        return () => mounted = false
    }, [diskonId])

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
        formData.append('_method', 'patch')
        formData.append('discount_type', form.type)
        formData.append('discount', form.diskon)
        formData.append('start_date', x)
        formData.append('end_date', y)


        

        axios.post(`${API}discount/update/${diskonId}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setDiskonTemp([])
            setAlert({
                message: 'Berhasil Ubah Diskon',
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
                        Form Edit Diskon
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
                            label={`Nilai Diskon`}
                            size="small"
                            value={form.diskon} 
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
                                setDateTemp(new Date())
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
                }
                {!isComplete &&
                    <CircularProgress sx={{ width: 50}} />
                }
            </Box>
        </div>
    )
};

export default FormEditDiskon;
