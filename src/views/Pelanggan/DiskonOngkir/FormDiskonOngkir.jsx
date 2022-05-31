import React, { useState } from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { DateRangePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../../Recoil/Alert'
import { dataPelanggan } from '../../../Recoil/PelangganRecoil';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const produk = ['Madu 1', 'Madu 2', 'Madu 3', 'Madu 4']

const FormDiskonOngkir = () => {
    const navigate = useNavigate()

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        minimal_belanja: '',
        potongan: '',
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
        setTimeout(() => {
            console.log(form)
            setLoading(false)
        }, 2000);
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
                        Form Tambah Produk Promo
                    </Typography>
                    
                    {/* Minimal Belanja */}
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        helperText={`Masukan Nilai Minimal Belanja`}
                        label={`Minimal Belanja`}
                        name='minimal_belanja'
                        onChange={onChange}
                        value={form.minimal_belanja}
                        required 
                        error={false}
                    />

                    {/* Potongan */}
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        helperText={`Masukan Nilai Potongan`}
                        label={`Potongan`}
                        name='potongan'
                        onChange={onChange}
                        value={form.potongan}
                        required 
                        error={false}
                    />
                    
                    {/* start and ent date */}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                            
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
                                    <TextField fullWidth sx={{ mt: 3 }} {...startProps} />
                                    <Box   Box sx={{ mx: 2 }}> Sampai </Box>
                                    <TextField fullWidth sx={{ mt: 3 }} {...endProps} />
                                </React.Fragment>
                            )}
                        />
                    </LocalizationProvider>

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, mx: 'auto', borderRadius: 25, minWidth: 400 }}
                        type="submit"
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </Box>
            </Box>
        </div>
    )
};

export default FormDiskonOngkir;
