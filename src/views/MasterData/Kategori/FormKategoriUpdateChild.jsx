import React, { useState, useEffect } from 'react'
import { Input, Checkbox, TextareaAutosize, TextField, FormControl, InputLabel, NativeSelect, Typography, FormGroup, FormControlLabel, Button, List, ListSubheader, ListItem, ListItemText, MenuItem, Select, Box, CircularProgress} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { formKategoriStyle } from './Style';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil'
import { allKategori, kategoriParent } from '../../../Recoil/Kategori';
import { dataSubKategori } from '../../../Recoil/SubKategori';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { API } from '../../../Variable/API';
import { alertState } from '../../../Recoil/Alert';

const theme = createTheme();

const FormKategoriUpdateChild = () => {
    const navigate = useNavigate()
    const id = window.location.href.split('/')[6].split('-')[0]
    const parentId = window.location.href.split('/')[6].split('-')[1]
    const classes = formKategoriStyle();
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: null,
        parent: null
    })
    const parent = useRecoilValue(kategoriParent)
    const refreshParent = useRecoilRefresher_UNSTABLE(kategoriParent)
    const [subKategori, setSubKategori] = useRecoilState(allKategori);
    const [alert, setAlert] = useRecoilState(alertState)

    
    const setFormValue = (id) => {
        axios.get(`${API}sub_category/show/${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            setForm({
                ...form,
                nama: res.data.data.sub_category_name,
                parent: parentId
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
            mounted = false;
            setForm({
                nama: null,
                parent: null
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
        axios.put(`${API}sub_category/update/${id}?sub_category_name=${form.nama}`,{}, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            setLoading(false)
            setSubKategori([])
            setAlert({
                message: 'Berhasil Update Sub Kategori',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            navigate(`/master-data/sub_kategori/${parentId}`)
        })
        .catch(err => {
            if(err.response){
                // console.log(err.response)
                setErrors(err.response.data.errors)
            }
            setLoading(false)
        })
        
        
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }} >
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column', 
                }} component="form" onSubmit={onSubmit}>
                    <Typography className={classes.mb} variant="h5">
                        Form Update Sub Kategori
                    </Typography>
                    {form.nama !== null && 
                    <TextField
                        sx={{ my: 1 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={'Nama'}
                        name='nama'
                        onChange={onChange}
                        value={form.nama}
                        required 
                        helperText={typeof errors?.sub_category_name !== 'undefined' ? errors.sub_category_name[0] : ''}
                        error={typeof errors?.sub_category_name !== 'undefined' ? true : false}
                    />
                    }
                    {form.parent !== null && 
                    <FormControl sx={{ marginTop: 3 }} fullWidth variant="standard">
                        <InputLabel id={`id-parent`}>
                            Parent
                        </InputLabel>
                        <Select
                            value={form.parent}
                            name='parent'
                            labelId={`id-parent`}
                            onChange={onChange}
                            disabled
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {parent.map(parent => (
                                <MenuItem key={parent.id} value={parent.id}>{parent.category_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    }
                    {form.nama === null &&
                        <Box 
                            sx={{ mt: 2 }}
                            component='div'
                        >
                            <CircularProgress sx={{width: 50}} />
                        </Box>
                    
                    
                    }
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ m: 1, mt: 3, borderRadius: 25, }}
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

export default FormKategoriUpdateChild
