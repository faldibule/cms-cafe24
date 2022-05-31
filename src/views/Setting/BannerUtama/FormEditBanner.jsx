import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, TextField, Typography } from '@mui/material'
import { useRecoilState } from 'recoil';
import { dataBanner } from '../../../Recoil/Banner';
import { LoadingButton } from '@mui/lab';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { alertState } from '../../../Recoil/Alert';
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const FormEditBanner = () => {
    const navigate = useNavigate()
    const id = window.location.href.split('/')[6]

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [imageRecoil, setImageRecoil] = useRecoilState(dataBanner)

    // state
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({
        image_preview: '',
        image_file: ''
    })
    const [form, setForm] = useState({
        order: imageRecoil.length + 1,
        url: ''
    })

    const setData = () => {
        axios.get(`${API}banner/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setForm({
                order: res.data.data.order,
                url: res.data.data.url === null ? '' : res.data.data.url 
            })
            setImage({
                ...image,
                image_preview: res.data.data.banner_url
            })
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true;
        if(mounted){
            setData()
        }

        return () => mounted = false
    }, [id])

    const onChange = (e) => {
        setForm({
            ...form, 
            [e.target.name]: e.target.value
        })
    }

    const bannerImageChange = (e) => {
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setImage({
            image_preview,
            image_file
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('_method', 'put')
        formData.append('order', form.order)
        if(image.image_file !== ''){
            formData.append('banner', image.image_file)
        }
        if(form.url !== ''){
            formData.append('url', form.url)
        }
        
        axios.post(`${API}banner/update/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setImageRecoil([])
            setAlert({
                message: 'Berhasil Edit Banner',
                display: true
            })
            navigate('/banner/utama')
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 8000)

        })
        .catch(err => {
            err.response && console.log(err.response)
            setLoading(false)
            setErrors(err.response.data.errors)
        })
    }

    return (
        <div>
            {image.image_preview !== '' && 
            <Box component='form' onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                
                <Box component="div" sx={{ mt: 2 }}>
                    <Typography>
                        Image
                    </Typography>
                    <label htmlFor={`image-id`} style={{ cursor: 'pointer' }} >
                        {image.image_preview !== '' ?
                            <img src={image.image_preview} style={{ height: '150px', objectFit: 'cover', objectPosition: 'center' }} />
                        :
                            <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>
                        }

                    </label>
                    <input 
                        name={`image`}
                        id={`image-id`} 
                        type="file" 
                        onChange={bannerImageChange} 
                        style={{ display: 'none' }}
                    />
                </Box>
                <TextField
                    sx={{ mt: 2 }}
                    variant="outlined"
                    size='small'
                    fullWidth
                    label={`Order`}
                    name='order'
                    onChange={onChange}
                    value={form.order}
                    required 
                    error={false}
                    disabled
                />
                <TextField
                    sx={{ mt: 2 }}
                    variant="outlined"
                    size='small'
                    fullWidth
                    label={`URL`}
                    name='url'
                    onChange={onChange}
                    value={form.url}
                    helperText={typeof errors?.url !== 'undefined' ? errors.url[0] : ''}
                    error={typeof errors?.url !== 'undefined' ? true : false}
                />



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
            {image.image_preview === '' &&
                <CircularProgress sx={{ width: 50, display: 'block', my: 2 }} />
            }
        </div>
    );
};

export default FormEditBanner;
