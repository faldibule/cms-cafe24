import React, { useState, useEffect } from 'react';
import { Box, TextField, CircularProgress, Typography } from '@mui/material'
import { DateRangePicker, LoadingButton, LocalizationProvider  } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useRecoilState } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { format, parseISO } from 'date-fns';
import AlertSuccess from '../../../components/Utils/AlertSuccess'
import moment from 'moment'

const DiskonOngkir = () => {

    // Recoil
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    const [isComplete, setIsComplete] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [tempData, setTempData] = useState({})
    const [form, setForm] = useState({
        max_shipping_discount: '0',
        minimum_price: '0',
        date: [null, null],
    })

    const setState = () => {
        // console.log(tempData)
        let temp = {}
        let date = [null, null]
        const x = parseISO(tempData['start_date'].split(' ')[0])
        const y = parseISO(tempData['end_date'].split(' ')[0])
        if(tempData['max_shipping_discount'] === 0 && tempData.minimum_price === 0){
            date = [null, null]
        }else{
            date = [x, y]
        }
        temp = {
            max_shipping_discount: tempData['max_shipping_discount'],
            minimum_price: tempData.minimum_price,
            date,
        }
        setForm(temp)
        setIsComplete(true)
    }

    const setData = () => {
        setIsComplete(false)
        axios.get(`${API}shipping_discount/show`)
        .then(res => {
            console.log(res.data)
            if(res.data.data){
                setTempData(res.data.data)
            }
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
    }, [])

    useEffect(() => {
        let mounted = true
        if(mounted && JSON.stringify(tempData) !== '{}' ){
            setState()
        }
        
        return () => mounted = false
    }, [tempData])

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
        // console.log(x)
        // console.log(y)

        const formData = new FormData()
        formData.append('minimum_price', form.minimum_price)
        formData.append('max_shipping_discount', form.max_shipping_discount)
        formData.append('start_date', x)
        formData.append('end_date', y)

        

        axios.post(`${API}shipping_discount/set`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            setLoading(false)
            if(form.minimum_price === '0' && form.max_shipping_discount === '0'){
                setForm({
                    ...form,
                    date: [null, null]
                })
            }
            setData()
            setAlert({
                message: 'Berhasil Menambah/Merubah Diskon Ongkir',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 6000)
        })
        .catch(err => {
            err.response && console.log(err.response)
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
                        Form Diskon Ongkir
                    </Typography>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
                    <TextField
                        sx={{ my: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Minimum Pembelian`}
                        name='minimum_price'
                        onChange={onChange}
                        value={form.minimum_price}
                        required 
                        error={false}
                    />

                    <TextField
                        sx={{ my: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Diskon Ongkir`}
                        name='max_shipping_discount'
                        onChange={onChange}
                        value={form.max_shipping_discount}
                        required 
                        error={false}
                    />

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
                                    <TextField required size='small' fullWidth sx={{ mt: 3 }} {...startProps} />
                                    <Box   Box sx={{ mx: 2 }}> Sampai </Box>
                                    <TextField required size='small' fullWidth sx={{ mt: 3 }} {...endProps} />
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

export default DiskonOngkir;
