import React, { useState, useEffect } from 'react'
import { Box, TextField, FormControl, InputLabel, Typography, MenuItem, Select, CircularProgress} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { formKategoriStyle } from './Style';
import { useRecoilState, useRecoilValue } from 'recoil'
import { allKategori, kategoriParent } from '../../../Recoil/Kategori';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { API } from '../../../Variable/API';
import { alertState } from '../../../Recoil/Alert';
import { dataSubKategori } from '../../../Recoil/SubKategori';


const theme = createTheme();

const FormSubKategori = () => {
    const id = window.location.href.split('/')[5]

    const navigate = useNavigate()
    const classes = formKategoriStyle();
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nama: '',
        parent: id,
    })
    const [listKategori, setListKategori] = useRecoilState(allKategori);
    const parent = useRecoilValue(kategoriParent)
    const [subKategori, setSubKategori] = useRecoilState(dataSubKategori);
    const [alert, setAlert] = useRecoilState(alertState)

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
        data.append('category_id', form.parent)
        data.append('sub_category_name', form.nama)
        axios.post(`${API}sub_category/create`, data, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            // console.log(res.data)
            setListKategori([])
            setSubKategori([])
            setLoading(false)
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
            navigate(`/master-data/sub_kategori/${id}`)
        })
        .catch(err => {
            if(err.response){
                // console.log(err.response)
                setErrors(err.response.data.errors)
            }
            setLoading(false)
        })
        
        
        // console.log(Object.fromEntries(data));
        
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx= {{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                
            }}>
                <form className={classes.form} onSubmit={onSubmit}>
                    <Typography className={classes.mb} variant="h5">
                        Form Kategori
                    </Typography>

                    <TextField
                        sx={{ 
                            my: 3
                        }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={'Sub Kategori'}
                        name={'nama'} 
                        onChange={onChange}
                        value={form.nama}
                        required 
                        helperText={typeof errors?.sub_category_name !== 'undefined' ? errors.sub_category_name[0] : ''}
                        error={typeof errors?.sub_category_name !== 'undefined' ? true : false}
                    />

                    <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                        <InputLabel id={`id-parent`}>
                            Parent Kategori
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.parent}
                            name={'parent'} 
                            labelId={`id-parent`}
                            onChange={onChange}
                            disabled={true}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {parent.map(parent => (
                                <MenuItem key={parent.id} value={parent.id}>{parent.category_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ m: 1, mt: 2,borderRadius: 25 }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </form>
            </Box>
            <br />
            <br />  
        </ThemeProvider>
    )
}

export default FormSubKategori
