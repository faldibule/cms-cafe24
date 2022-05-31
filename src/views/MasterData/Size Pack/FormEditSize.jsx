import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, TextField, Typography } from '@mui/material'
import { useRecoilState } from 'recoil';
import { dataSizepack } from '../../../Recoil/Size';
import { LoadingButton } from '@mui/lab';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { alertState } from '../../../Recoil/Alert';
import { API } from '../../../Variable/API';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'


const FormEditSize = () => {
    const navigate = useNavigate()
    const id = window.location.href.split('/')[6]

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [size, setSizeRecoil] = useRecoilState(dataSizepack)

    // state
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({
        image_preview: '',
        image_file: ''
    })
    const [form, setForm] = useState({
        name: ''
    })

    const setData = () => {
        axios.get(`${API}size_pack/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setForm({
                name: res.data.data.name
            })
            setImage({
                ...image,
                image_preview: res.data.data.file_url
            })
        })
        .catch(err => {
            // err.response && console.log(err.response)
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
        formData.append('name', form.name)
        if(image.image_file !== ''){
            formData.append('file', image.image_file)
        }
        // console.log(Object.fromEntries(formData))
        axios.post(`${API}size_pack/update/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setSizeRecoil([])
            setAlert({
                message: 'Berhasil Edit Size Pack',
                display: true
            })
            navigate('/master-data/size')
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 8000)

        })
        .catch(err => {
            // err.response && console.log(err.response)
            setLoading(false)
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
                            <img src={image.image_preview} style={{ width: '150px', height: '150px', objectFit: 'cover', objectPosition: 'center' }} />
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
                    label={`Nama Size Pack`}
                    name='name'
                    onChange={onChange}
                    value={form.name}
                    required 
                    error={false}
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

export default FormEditSize;
