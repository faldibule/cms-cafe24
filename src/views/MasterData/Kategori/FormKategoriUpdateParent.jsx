import React, { useState, useEffect } from 'react'
import { Input, Checkbox, TextareaAutosize, TextField, FormControl, InputLabel, NativeSelect, Typography, FormGroup, FormControlLabel, Button, List, ListSubheader, ListItem, ListItemText, MenuItem, Select, Box, CircularProgress} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { formKategoriStyle } from './Style';
import ListComponent from './ListComponent';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil'
import { allKategori, kategoriParent } from '../../../Recoil/Kategori';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { API } from '../../../Variable/API';
import { alertState } from '../../../Recoil/Alert';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const theme = createTheme();

const FormKategoriUpdateParent = () => {
    const navigate = useNavigate()
    const id = window.location.href.split('/')[6]
    const classes = formKategoriStyle();
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: null,
    })
    const [image, setImage] = useState({
        image_preview: '',
        image_file: ''
    })
    const refreshParent = useRecoilRefresher_UNSTABLE(kategoriParent)
    const [listKategori, setListKategori] = useRecoilState(allKategori);
    const [alert, setAlert] = useRecoilState(alertState)

    const fotoProdukChange = (e) => {
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setImage({
            image_preview,
            image_file
        })
    }


    const setFormValue = (id) => {
        axios.get(`${API}category/show/${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            setImage({
                ...image,
                image_preview: res.data.data.image_url !== null ? res.data.data.image_url : ''
            })
            setForm({
                ...form,
                nama: res.data.data.category_name
            })
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true;
        if(id){
            if(mounted){
                setFormValue(id)
            }
        }
        return () => {
            mounted = false
            setForm({
                nama: null
            })
        }
    }, [id])

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) =>{
        e.preventDefault()
        setLoading(true)
        const data = new FormData()
        data.append('category_name', form.nama)
        if(image.image_file !== ''){
            data.append('image', image.image_file)
        }
        data.append('_method', 'put')
        axios.post(`${API}category/update/${id}`, data, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            setLoading(false)
            setListKategori([])
            refreshParent()
            navigate('/master-data/kategori')
            setAlert({
                message: 'Berhasil Update Kategori',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 8000)
        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                setErrors(err.response.data.errors)
                
            }
        })
        
        
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box component="form" sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                 }} onSubmit={onSubmit}>
                    <Typography className={classes.mb} variant="h5">
                        Form Update Kategori
                    </Typography>
                    {form.nama !== null && 
                        <TextField
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={'Nama'}
                            name='nama'
                            onChange={onChange}
                            value={form.nama}
                            required 
                            helperText={typeof errors?.category_name !== 'undefined' ? errors.category_name[0] : ''}
                            error={typeof errors?.category_name !== 'undefined' ? true : false}
                        />
                    }
                    {form.nama === null &&
                        <Box 
                            sx={{ my: 2 }}
                            component='div'
                        >
                            <CircularProgress sx={{width: 50}} />
                        </Box>
                    }
                    {form.nama !== null &&
                        <Box component="div" sx={{ mt: 2 }}>
                            <Typography>
                                Image
                            </Typography>
                            <label htmlFor={`image-id`} style={{ cursor: 'pointer' }} >
                                {image.image_preview !== '' ?
                                    <img src={image.image_preview} style={{ height: '120px', objectFit: 'cover', objectPosition: 'center' }} />
                                :
                                    <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>
                                }

                            </label>
                            <input 
                                name={`image`}
                                id={`image-id`} 
                                type="file" 
                                onChange={fotoProdukChange} 
                                style={{ display: 'none' }}
                            />
                        </Box>
                    }
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ m: 1, mt: 2,borderRadius: 25, width: '100%' }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </Box>
            </Box>
            <br />
            <br />  
        </ThemeProvider>
    )
}

export default FormKategoriUpdateParent
