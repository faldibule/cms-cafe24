import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { AttributeStyle } from './AttributeStyle'
import axios from 'axios'
import { API } from '../../../Variable/API';
import { useRecoilState } from 'recoil';
import { alertState } from '../../../Recoil/Alert';
import { LoadingButton } from '@mui/lab';
import { allAttr } from '../../../Recoil/Attr';

const EditOptionsForm = () => {
    const classes = AttributeStyle();
    const id = window.location.pathname.split('/')[4];
    const navigate = useNavigate()

    const [allAttribute, setAllAttribute] = useRecoilState(allAttr)
    const [alert, setAlert] = useRecoilState(alertState)

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: null,
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
        axios.put(`${API}variant_option/update/${id}?variant_option_name=${form.nama}`, {}, {
            headers: {
                Authorization:'Bearer '+ localStorage.getItem('authToken')
            }
        })
        .then(res => {
            setLoading(false)
            setAlert({
                message: 'Berhasil Update Option',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            setAllAttribute([])
            navigate(-1)
        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                //console.log(err.response)
                setErrors(err.response.data.errors)
            }
        })
    }

    const setDataForm = () => {
        axios.get(`${API}variant_option/show/${id}`, {
            headers: {
                Authorization:'Bearer '+ localStorage.getItem('authToken')
            }
        })
        .then(res => {
            setForm({
                nama: res.data.data.variant_option_name
            })
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        // console.log(id)
        if(mounted){
           setDataForm()
        }
        return () => mounted = false
    }, [id])



    return (
        <div className={classes.container}>
            <form onSubmit={onSubmit} className={classes.form}>
                <Typography className={classes.input} variant="h5">
                    Form Edit Option
                </Typography>
                {/* Nama */}
                {form.nama !== null &&
                    <TextField
                        className={classes.input}
                        name="nama"
                        value={form.nama}
                        variant="outlined"
                        fullWidth  
                        label="Nama"
                        onChange={onChange}
                        required 
                        helperText={typeof errors?.variant_option_name !== 'undefined' ? <span style={{color: 'red'}}>{errors.variant_option_name[0]}</span> : ''}
                        error={typeof errors?.variant_option_name !== 'undefined' ? true : false}
                    />
                
                }
                {form.nama === null &&
                    <Box 
                        sx={{width: 400, display: 'flex', justifyContent: 'center', margin: '10px auto'}}
                        component='div'
                        >
                        <CircularProgress sx={{margin: '10px auto'}} />
                    </Box>
                }

                {/* Button */}
                <LoadingButton
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{mt: 1,borderRadius: 25 }}
                    loading={loading}
                >
                    Simpan
                </LoadingButton>
            </form>
        </div>
    )
}

export default EditOptionsForm
