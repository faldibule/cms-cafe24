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
import { errorState } from '../../../Recoil/Error';
import AlertError from '../../../components/Utils/AlertError';


const theme = createTheme();

const FormKategori = () => {
    const navigate = useNavigate()
    const classes = formKategoriStyle();
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: '',
    })
    const [image, setImage] = useState({
        image_preview: '',
        image_file: ''
    })
    const parent = useRecoilValue(kategoriParent)
    const refreshParent = useRecoilRefresher_UNSTABLE(kategoriParent)
    const [listKategori, setListKategori] = useRecoilState(allKategori);
    const [alert, setAlert] = useRecoilState(alertState)
    const [alertErrorData, setAlertErrorData] = useRecoilState(errorState)


    const length = ['nama', 'parent', 'size'];

    const setKategori = () => {
        let x = []
        parent.map((p, i) => {
            axios.get(`${API}sub_category/fetch?category_id=${p.id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
            .then(child => {
                x.push({
                    ...p,
                    child: [...child.data.data]
                })
                if(i === parent.length - 1){
                    setListKategori([...x])
                }
            })
            .catch(err => {
                // if(err.response) console.log(err.response)
            })
        })
    }

    useEffect(() => {
        let mounted = true;
        if(mounted){
            setKategori()
        }
        return () => {
            mounted = false
            setListKategori([]);
        }
    }, [])

    const fotoProdukChange = (e) => {
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setImage({
            image_preview,
            image_file
        })
    }

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
        data.append('image', image.image_file)
        axios.post(`${API}category/create`, data, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('authToken')
                }
            })
        .then(res => {
            setLoading(false)
            refreshParent()
            navigate('/master-data/kategori')
            setAlert({
                message: 'Berhasil Menambah Kategori',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
        })
        .catch(err => {
            setLoading(false)
            if(err.response){
                setErrors(err.response.data.errors)
                if(typeof err.response.data.errors.image !== 'undefined'){
                    setAlertErrorData({
                        display: true,
                        message: 'Image is Required'
                    })
                    setTimeout(() => {
                        setAlertErrorData({
                            display: false,
                            message: ''
                        })
                    }, 4000)
                }
            }
        })
        
        
        // console.log(Object.fromEntries(data));
        
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.container}>
                <form className={classes.form} onSubmit={onSubmit}>
                    <Typography className={classes.mb} variant="h5">
                        Form Kategori
                    </Typography>
                    <AlertError message={alertErrorData.message} onTutup={()=> setAlertErrorData({message: '', display: false})} display={alertErrorData.display}/>

                    <TextField
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={'nama'}
                        name={'nama'} 
                        onChange={onChange}
                        value={form.nama}
                        required 
                        helperText={typeof errors?.category_name !== 'undefined' ? errors.category_name[0] : ''}
                        error={typeof errors?.category_name !== 'undefined' ? true : false}
                    />
                    <Box component="div" sx={{ my: 2 }}>
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

                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2,borderRadius: 25, maxWidth: '100%' }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </form>
            </div>
            <br />
            <br />  
        </ThemeProvider>
    )
}

export default FormKategori
