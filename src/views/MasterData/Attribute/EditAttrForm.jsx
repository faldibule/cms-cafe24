import React, { useState, useEffect } from 'react';
import { Typography, Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { API } from '../../../Variable/API';
import { allAttr, parentAttr } from '../../../Recoil/Attr';
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilRefresher_UNSTABLE } from 'recoil'
import { alertState } from '../../../Recoil/Alert';


const EditAttrForm = () => {
    const id = window.location.pathname.split('/')[4]
    const navigate = useNavigate()
    const [form, setForm] = useState({
        variant_name: null
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    //recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const parentRefresh = useRecoilRefresher_UNSTABLE(parentAttr)
    const [allAttribute, setAllAttribute] = useRecoilState(allAttr)

    const setDataAttribute = () => {
        // console.log(allAttribute)
        setForm({
            variant_name: allAttribute.filter(val => val.id == id)[0].variant_name
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            setDataAttribute()
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
        const formData = new FormData()
        formData.append('_method', 'put')
        formData.append('variant_name', form.variant_name)
        formData.append('image', 0)
        axios.post(`${API}variant/update/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res)
            setLoading(false)
            setAlert({
                display: true,
                message: 'Berhasil Edit Attribute'
            })
            setTimeout(() => {
                setAlert({
                    display: false,
                    message: ''
                })
            }, 5000)
            parentRefresh()
            setAllAttribute([])
            navigate('/master-data/attr')
        })
        .catch(err => {
            if(err.response){
                // console.log(err.response)
                setErrors(err.response.data.errors)

            }
            setLoading(false)
        })
        // console.log(form)
    }

    return (
        <Box component="div" sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography>
                Form Tambah Attribute
            </Typography>
            <Box component='form' onSubmit={onSubmit} sx={{
                
            }}>
                <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Attribute`}
                        name='variant_name'
                        onChange={onChange}
                        value={form.variant_name === null ? '' : form.variant_name}
                        required 
                        helperText={typeof errors?.variant_name !== 'undefined' ? <span style={{color: 'red'}}>{errors.variant_name[0]}</span> : ''}
                        error={typeof errors?.variant_name !== 'undefined' ? true : false}
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
        </Box>
    );
};

export default EditAttrForm;