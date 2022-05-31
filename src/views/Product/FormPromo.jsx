import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert'
import { allProduct } from '../../Recoil/Product';
import { dataPromo } from '../../Recoil/Promo';

// const produk = ['Madu 1', 'Madu 2', 'Madu 3', 'Madu 4']

const FormPromo = () => {
    const navigate = useNavigate()

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [product, setProduct] = useRecoilState(allProduct)
    const [promo, setPromo] = useRecoilState(dataPromo)

    // state
    const [isComplete1, setIsComplete1] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        product_id: '',
        date: [null, null]
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
        
        const formData = new FormData()
        formData.append('product_id', form.product_id)

        axios.post(`${API}product_slider/create`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setPromo([])
            setAlert({
                message: 'Berhasil Menambah Hightlight Produk',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            setLoading(false)
            navigate('/promo')

        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                console.log(err.response)
            }
        })
    }

    // Filtered
    const filtered = (product, promo) => {
        return product.filter(el => {
            return !promo.find(element => {
                return element.product.id === el.id;
            });
        })
    }

    // Promo
    const setPromoData = () => {
        axios.get(`${API}product_slider/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setPromo([...res.data.data])
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && promo.length === 0){
            setPromoData()
        }

        return () => mounted = false
    }, [promo.length])

    // Product
    const setAllProduct = () => {
        setProduct({
            ...product,
            isComplete: false
        })
        axios.get(`${API}product/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setProduct({
                    ...product,
                    isComplete: true
                })
            }else{
                setProduct({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(product.data.length === 0 && mounted){
            setAllProduct()
        }

        return () => mounted = false


    }, [product.data.length])

    useEffect(() => {

    }, [])

    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
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
                        Form Tambah Produk Promo
                    </Typography>
                    
                    {/* nama produk */}
                    <FormControl variant="standard" sx={{ my: 2 }}  
                        fullWidth 
                        error={typeof errors?.product_id !== 'undefined' ? true : false}
                    >
                        <InputLabel id={`id-produk`}>
                            Nama Produk
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.product_id}
                            name={`product_id`} 
                            labelId={`id-produk`}
                            onChange={onChange}
                            disabled={product.data.length === 0 ? true : false}
                        >
                            {filtered(product.data, promo).length !== 0 && 
                            
                            filtered(product.data, promo).map((val, i) => (
                                <MenuItem key={i} value={val.id}>{val.product_name}</MenuItem>
                            ))}
                            {filtered(product.data, promo).length === 0 && 
                                <MenuItem value="" disabled>Seluruh Produk Sudah Menjadi Hightlight</MenuItem>
                            }
                        </Select>
                        {/* <FormHelperText sx={{ ml: 2 }}>{typeof errors?.role !== 'undefined' ? errors.role[0] : `Pilih role sesuai dengan teliti dan cermat`}</FormHelperText> */}
                    </FormControl>
                    
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

export default FormPromo;
