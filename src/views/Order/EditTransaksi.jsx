import React, { useState, useEffect } from 'react';
import { Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem, Stack, Chip } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { alertState } from '../../Recoil/Alert';
import { dataOrder, dataTransaksi } from '../../Recoil/Order'
import { useRecoilState } from 'recoil'
import CurrencyFormat from 'react-currency-format';
import moment from 'moment'

const selects = ['pending', 'paid_off', 'expired', 'process']
const EditTransaksi = () => {
    const id = window.location.pathname.split('/')[2]
    // console.log(id);
    const navigate = useNavigate()
    const [form, setForm] = useState({
        status: null
    })
    const [loading, setLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [detail, setDetail] = useState({})
    const [open, setOpen] = useState(false)
    

    //recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [order, setOrder] = useRecoilState(dataOrder)
    const [transaksi, setTransaksi] = useRecoilState(dataTransaksi)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const setStatusOrder = async () => {
        try {
            const res = await axios.get(`${API}transaction/payment/show/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            // console.log(res)
            setForm({
                status: res.data.data.status
            })
            return res
            
        } catch (err) {
            err.response && console.log(err.response)
        }
    }

    const setDetailTransaksi = async () => {
        try {
            const res = await axios.get(`${API}transaction/payment/show/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            // console.log(res)
            setDetail(res.data.data)
            return res
            
        } catch (err) {
            err.response && console.log(err.response)
        }
    }

    const allPromiseGet = async () => { 
        let promise = await Promise.all([
            setStatusOrder(),
            setDetailTransaksi()
        ])
        setIsComplete(true)
     }

    useEffect(() => {
        let mounted = true
        if(mounted){
            allPromiseGet()
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
        axios.patch(`${API}transaction/payment/update_status/${id}?status=${form.status}`, {}, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res)
            setLoading(false)
            setAlert({
                display: true,
                message: 'Berhasil Edit Status Pembayaran'
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
            setTransaksi([])
            navigate('/transaksi')
        })
        .catch(err => {
            err.response && console.log(err.response)
            setLoading(false)
        })
    }

    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: {
                xs: 'column',
                md: 'row',
            }
        }}>
            
            {isComplete &&
            <>
                <Box component='form' onSubmit={onSubmit} sx={{
                    mt: 2,
                    width: '100%',
                    mr: { lg: 3 }
                }}>
                    <Typography>
                        Form Edit Status Pembayaran
                    </Typography>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id={`id-status`}>
                            Status Pembayaran
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.status}
                            name={'status'} 
                            labelId={`id-status`}
                            onChange={onChange}
                            >
                            {selects.map((select, i) => (
                                <MenuItem key={i} value={select}>
                                    {select === 'pending' && 'Pending'}
                                    {select === 'paid_off' && 'Paid Off'}
                                    {select === 'expired' && 'Expired'}
                                    {select === 'process' && 'Process'}
                                    {select === 'canceled' && 'Canceled'}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <LoadingButton
                            type="submit"
                            variant="contained"
                            sx={{mt: 2, px: 4, borderRadius: 25, width: '100%' }}
                            loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </Box>
                <Box sx={{ 
                    boxShadow: 2,
                    mt: 1,
                    mr: 2,
                    width: '100%',
                 }}>
                    <Typography sx={{ mt: 2, mb: 1, ml: 2, fontSize: '1.4rem' }}>
                        Detail Transaksi
                    </Typography>
                    <Stack ml={3}>
                        <Stack direction="row" gap={3} mt={1}>
                            <Typography sx={{ width: '35%' }}>
                                Kode Order
                            </Typography>
                            <Typography>
                                INV/{detail.id}
                            </Typography>
                        </Stack>
                        <Stack direction="row" gap={3} mt={1}>
                            <Typography sx={{ width: '35%' }}>
                                Nama
                            </Typography>
                            <Typography>
                                {detail.user.name}
                            </Typography>
                        </Stack>
                        <Stack direction="row" gap={3} mt={1}>
                            <Typography sx={{ width: '35%' }}>
                                Kode Unik
                            </Typography>
                            <Typography>
                                {detail.unique_code}
                            </Typography>
                        </Stack>
                        <Stack direction="row" gap={3} mt={1}>
                            <Typography sx={{ width: '35%' }}>
                                Total
                            </Typography>
                            <CurrencyFormat 
                                value={detail.total}
                                displayType={'text'} 
                                thousandSeparator={"."}
                                decimalSeparator={","} 
                                prefix={'Rp.'} 
                                renderText={value => 
                                    <Typography sx={{ color: 'red' }}>
                                        {value}
                                    </Typography>
                                } 
                            />
                            
                        </Stack>
                        {detail.paid_off_time !== null &&
                        <Stack direction="row" gap={3} mt={1}>
                            <Typography sx={{ width: '35%' }}>
                                Dibayarkan Pada
                            </Typography>
                            <Typography>
                                {moment(`${detail.paid_off_time}`).format('dddd, MM YYYY, HH:mm:ss')}. 

                            </Typography>
                        </Stack>
                        }
                        {detail.evidence !== null &&
                        <Stack direction="row" gap={3} mt={1} mb={2}>
                            <Typography sx={{ width: '35%' }}>
                                Bukti Transfer
                            </Typography>
                            <Chip label="Lihat Bukti Transfer" onClick={handleClickOpen} />
                        </Stack>
                        }
                    </Stack>
                    
                </Box>
                
                <Dialog
                    fullWidth={true}
                    open={open}
                    maxWidth={'sm'}
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>
                        <Box sx={{ display: 'flex',  }}>
                            <Typography>
                                Bukti Transfer
                            </Typography>
                            <Button type="button" sx={{ ml: 'auto' }} color="error"  onClick={handleClose}>X</Button>
                        </Box>
                    
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center',   }} >
                            
                            <Box component="img" sx={{ height: { xs: '400px', md: '300px', lg: '400px' }, }} src={detail.evidence.evidence_url} alt="Bukti TF"/>
                            
                        </Box>
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                        <br />
                    </DialogContent>
                    <DialogActions>
                    </DialogActions>
                </Dialog>
               
            </>
            }
            {!isComplete &&
            <CircularProgress sx={{ width: 50, display: 'block', mt: 2}} />
            }
        </Box>
    );
};

export default EditTransaksi;