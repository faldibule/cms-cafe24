import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { alertState } from '../../Recoil/Alert';
import { dataOrder } from '../../Recoil/Order'
import { useRecoilState } from 'recoil'

const FormEditResi = () => {
    const id = window.location.pathname.split('/')[3]
    const navigate = useNavigate()
    const [form, setForm] = useState({
        resi: null
    })
    const [loading, setLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    

    //recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [order, setOrder] = useRecoilState(dataOrder)

    const setResi = async () => {
        try {
            const res = await axios.get(`${API}transaction/show/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            console.log(res.data)
            setForm({
                resi: res.data.data.number_resi === null ? '' : res.data.data.number_resi
            })
            setIsComplete(true)
            
        } catch (err) {
            err.response && console.log(err.response)
        }
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setResi()
        }

        return () => mounted = false
    }, [id])

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        axios.patch(`${API}transaction/update_resi/${id}?number_resi=${form.resi}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res)
            setLoading(false)
            setAlert({
                display: true,
                message: 'Berhasil Update Nomor Resi'
            })
            setTimeout(() => {
                setAlert({
                    display: false,
                    message: ''
                })
            }, 6000)
            setOrder({
                ...order,
                data: []
            })
            navigate('/order')
        })
        .catch(err => {
            err.response && console.log(err.response)
            setLoading(false)
        })
    }

    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h6">
                Form Update Nomor Resi
            </Typography>
            {isComplete &&
            <Box component='form' onSubmit={onSubmit} sx={{
                mt: 2
            }}>
                <TextField 
                    value={form.resi}
                    onChange={onChange}
                    name={`resi`}
                    size={`small`}
                    fullWidth

                
                />
                <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, px: 4, borderRadius: 25, width: '100%' }}
                        loading={loading}
                >
                    Simpan
                </LoadingButton>
            </Box>
            }
            {!isComplete &&
            <CircularProgress sx={{ width: 50, display: 'block', mt: 2}} />
            }
        </Box>
    );
};

export default FormEditResi;