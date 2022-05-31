import React, { useState, useEffect, useRef } from 'react';
import { Box, FormGroup, FormControlLabel, Switch, Button, FormHelperText, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useRecoilState } from 'recoil'
import { API } from '../../Variable/API'
import axios from 'axios'
import { LoadingButton } from '@mui/lab';
import { alertState } from '../../Recoil/Alert';
import { allProduct } from '../../Recoil/Product';
import CurrencyFormat from 'react-currency-format';


const banyak_foto = [1, 2, 3, 4, 5]
const DiskonModal = (props) => {

    //product recoil
    const [product, setProduct] = useRecoilState(allProduct)

    //alert recoil
    const [alert, setAlert] = useRecoilState(alertState)

    // state

    //loading button
    const [loading, setLoading] = useState(false)

    //form
    const [form, setForm] = useState({
        id: '',
        nama: '',
        diskon: '',
        discount_type: '',
    })

    //error
    const [errors, setErrors] = useState({})

    // Diskon
    const [discountCheck, setDiscountCheck] = useState(false)

    const discountChange = (e) => {
        setDiscountCheck(e.target.checked)
    }

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const active_discount = discountCheck ? 1 : 0
        axios.patch(`${API}product/discount/update/${form.id}?active_discount=${active_discount}&discount_type=${form.discount_type}&discount=${form.diskon}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setProduct({
                ...product,
                isComplete: false,
                data: [],
            })
            setAlert({
                message: 'Diskon Produk Berhasil Diubah',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 6000)
            props.handleClose2()
        })
        .catch(err => {
            if(err.response){
                setErrors(err.response.data.errors)
                console.log(err.response)
            }
            setLoading(false)
        })

        
    }

    useEffect(() => {
        let mounted = true
        if(mounted && typeof props.val !== 'undefined'){
            // console.log(props)
            if(form.nama !== props.val.product_name){
                setForm({
                    id: props.val.id,
                    nama: props.val.product_name,
                    discount_type: props.val.discount_type === null ? '' : props.val.discount_type  ,
                    diskon: props.val.discount === null ? '' : props.val.discount,
                })
                setDiscountCheck(props.val.active_discount === 1 ? true : false)
            }
        }


        return () => mounted =false
    }, [props])

    return (
        <div>
            <Box
                onSubmit={onSubmit}
                component='form'
                sx={{ 
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
            }}>

                {/* Discount */}
                <Box>
                    <Dialog
                        maxWidth={'lg'}
                        open={props.open2}
                        keepMounted
                        onClose={props.handleClose2}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>Setting Diskon</DialogTitle>
                            {typeof props.val !== 'undefined' &&

                            <Box component="form" sx={{ width: 500 }} onSubmit={onSubmit}>
                                <DialogContent>
                                    <Box sx={{ display: 'flex' }} >
                                        <FormGroup 
                                        sx={{ ml: 2 }}>
                                            <FormControlLabel 
                                            control={
                                                <Switch
                                                    name='status'
                                                    checked={discountCheck}
                                                    onChange={discountChange}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                />
                                            } 
                                            label="Aktifkan Diskon Jika Diperlukan" 
                                            />
                                        </FormGroup>
                                    </Box>
                                    {discountCheck &&
                                        <Box>
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
                                                    value={form.discount_type}
                                                    name={'discount_type'} 
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

                                            {form.discount_type === 'rp' &&
                                                <CurrencyFormat 
                                                    customInput={TextField}
                                                    value={form.diskon}
                                                    label={`Nilai Diskon`}
                                                    size="small"
                                                    fullWidth={true}  
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
                                            {form.discount_type === 'percent' &&
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
                                        </Box>
                                    }
                                </DialogContent>
                                <DialogActions>
                                    <LoadingButton
                                            type="submit"
                                            loading={loading}
                                        >
                                            Simpan
                                    </LoadingButton>
                                    <Button type="button" onClick={props.handleClose2}>Close</Button>
                                </DialogActions>
                            </Box>
                            }
                    </Dialog>
                    
                </Box> 
            </Box>
        
        </div>
    )

};

export default DiskonModal;
