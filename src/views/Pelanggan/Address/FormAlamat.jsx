import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { LoadingButton } from '@mui/lab';
import { useRecoilState } from 'recoil';
import { alertState } from '../../../Recoil/Alert';
import axios from 'axios'
import { API } from '../../../Variable/API'
import { errorState } from '../../../Recoil/Error';
import AlertError from '../../../components/Utils/AlertError';


const FormAlamat = () => {
    // other
    const navigate = useNavigate()
    const id = window.location.href.split('/')[5]

    // Recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [alertErrorData, setAlertErrorData] = useRecoilState(errorState)


    // state
    const [form, setForm] = useState({
        number_indonesia: '+62',
        label: '',
        recipients_name: '',
        house_number: '',
        phone_number: '',
        kode_pos: '',
        province_id: '',
        city_id: '',
        district_id: '',
        address_description: '',
        type: '',
    })
    const [cityLoading, setCityLoading] = useState(false)
    const [districtLoading, setDistrictLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [prov, setProv] = useState([])
    const [city, setCity] = useState([])
    const [district, setDistrict] = useState([])

    const getProv = () => {
        axios.get(`${API}region/province`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setProv([...res.data.data])
            setIsComplete(true)
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    const getCity = (id) => {
        setCityLoading(true)
        axios.get(`${API}region/city?province_id=${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setCity([...res.data.data])
            setCityLoading(false)

        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    const getDistrict = (id) => {
        setDistrictLoading(true)
        axios.get(`${API}region/district?city_id=${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setDistrict([...res.data.data])
            setDistrictLoading(false)
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && prov.length === 0){
            getProv()
        }

        return () => mounted = false
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const data = {
            user_id: id,
            label: form.label,
            recipients_name: form.recipients_name,
            phone_number: `+62${form.phone_number}`,
            province_id: form.province_id,
            city_id: form.city_id,
            district_id: form.district_id,
            postal_code: form.kode_pos,
            address: form.address_description,
            type: form.type,
        }
        axios.post(`${API}user/address/create`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setAlert({
                message: 'Berhasil Menambah Alamat',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            navigate(-1)
        })
        .catch(err => {
            if(err.response){
                setErrors({
                    ...err.response.data.errors
                })
                if(typeof err.response.data.errors.role !== 'undefined'){
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
            //err.response && console.log(err.response)
            setLoading(false)
        })
    }

    const onChange = (e) => {
        
        if(e.target.name === 'province_id'){
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                city_id: '',
                district_id: '',
            })
            getCity(e.target.value)
        }else if(e.target.name === 'city_id'){
            getDistrict(e.target.value)
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                district_id: ''
            })
        }else{
            setForm({
                ...form,
                [e.target.name]: e.target.value
            })
        }
    }

    return (
        <Box
            component='div'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            {isComplete &&
            <Box component="form" 
                sx={{
                    p: 2,  
                    width: '100%', 
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }} onSubmit={onSubmit}>
                
                <AlertError message={alertErrorData.message} onTutup={()=> setAlertErrorData({message: '', display: false})} display={alertErrorData.display}/>


                {/* informasi utama */}
                <Box sx={{ boxShadow: 2, p: 2 }}>
                    <Typography variant="h6">
                        Informasi Alamat
                    </Typography>
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Label`}
                        name='label'
                        onChange={onChange}
                        value={form.label}
                        required 
                        helperText={typeof errors?.label !== 'undefined' ? <span style={{color: 'red'}}>{errors.label[0]}</span> : ''}
                        error={typeof errors?.label !== 'undefined' ? true : false}
                    />
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Recipients Name`}
                        name='recipients_name'
                        onChange={onChange}
                        value={form.recipients_name}
                        required
                        helperText={typeof errors?.recipients_name !== 'undefined' ? <span style={{color: 'red'}}>{errors.recipients_name[0]}</span> : ''}
                        error={typeof errors?.recipients_name !== 'undefined' ? true : false}
                    />
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            sx={{ mt: 2, width: 70, mr: 1 }}
                            variant="outlined"
                            size='small'
                            name='number_indonesia'
                            value={form.number_indonesia}
                            disabled
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            helperText={typeof errors?.phone_number !== 'undefined' ? <span style={{color: 'red'}}>{errors.phone_number[0]}</span> : ''}
                            label={`Nomor Telepon`}
                            name='phone_number'
                            onChange={onChange}
                            value={form.phone_number}
                            required 
                            error={typeof errors?.phone_number !== 'undefined' ? true : false}
                        />
                    </Box>
                    <FormControl variant="standard" sx={{ mt: 2 }}  
                        fullWidth 
                        error={typeof errors?.type !== 'undefined' ? true : false}
                    >
                        <InputLabel id={`id-type`}>
                            Type
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.type}
                            name={`type`} 
                            labelId={`id-type`}
                            onChange={onChange}
                        >
                            <MenuItem value="alone">Alamat Pribadi</MenuItem>
                            <MenuItem value="receiver">Alamat Orang Lain</MenuItem>
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.type !== 'undefined' ? errors.type[0] : ``}</FormHelperText>
                    </FormControl>
                    
                </Box>

                {/* Keterangan */}
                <Box sx={{ boxShadow: 2, p: 2, mt: 2}}>
                    <Typography variant="h6">
                        Deskripsi Alamat
                    </Typography>

                    {/* Provinsi */}
                    {prov.length === 0 && 
                        <CircularProgress sx={{ width: 50, display: 'block', my: 2 }} />
                    }
                    {prov.length !== 0 && 
                    <FormControl variant="standard" sx={{ mt: 2 }}  
                        fullWidth 
                        error={typeof errors?.province_id !== 'undefined' ? true : false}
                    >
                        <InputLabel id={`id-role`}>
                            Provinsi
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.province_id}
                            name={`province_id`} 
                            labelId={`id-province_id`}
                            onChange={onChange}
                            >
                            {prov.map((val, i) => (
                                <MenuItem key={val.id} value={val.id}>{val.province}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.province_id !== 'undefined' ? errors.province_id[0] : ``}</FormHelperText>
                    </FormControl>
                    }

                    {/* City */}
                    <FormControl variant="standard" sx={{ mt: 2 }}  
                        fullWidth 
                        error={typeof errors?.city_id !== 'undefined' ? true : false}
                        
                    >
                        <InputLabel id={`id-role`}>
                            Kota/Kabupaten
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.city_id}
                            name={`city_id`} 
                            labelId={`id-city_id`}
                            onChange={onChange}
                            disabled={form.province_id === '' ? true : false }
                        >   
                            {cityLoading && 
                            <MenuItem value="">
                                <CircularProgress size={20} />
                            </MenuItem>
                            }
                            {city.length !== 0 && !cityLoading && city.map((val, i) => (
                                <MenuItem key={val.id} value={val.id}>{val.city}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.city_id !== 'undefined' ? errors.city_id[0] : ``}</FormHelperText>
                    </FormControl>

                    {/* District */}
                    <FormControl variant="standard" sx={{ mt: 2 }}  
                        fullWidth 
                        error={typeof errors?.type !== 'undefined' ? true : false}
                    >
                        <InputLabel id={`id-role`}>
                            Kecamatan
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.district_id}
                            name={`district_id`} 
                            labelId={`id-district_id`}
                            onChange={onChange}
                            disabled={form.city_id === '' ? true : false }
                        >
                            {districtLoading && 
                            <MenuItem value="">
                                <CircularProgress size={20} />
                            </MenuItem>
                            }
                            {district.length !== 0 && !districtLoading && district.map((val, i) => (
                                <MenuItem key={val.id} value={val.id}>{val.district}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText sx={{ ml: 2 }}>{typeof errors?.district_id !== 'undefined' ? errors.district_id[0] : ``}</FormHelperText>
                    </FormControl>

                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Kode Pos`}
                        name='kode_pos'
                        onChange={onChange}
                        value={form.kode_pos}
                        required 
                        helperText={typeof errors?.postal_code !== 'undefined' ? <span style={{color: 'red'}}>{errors.postal_code[0]}</span> : ''}
                        error={typeof errors?.postal_code !== 'undefined' ? true : false}
                    /> 

                    {/* Keterangan */}
                    <TextField
                        sx={{ mt: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        helperText={typeof errors?.address_description !== 'undefined' ? errors.address_description[0] : ''}
                        label={`Deskripsi Alamat`}
                        name='address_description'
                        onChange={onChange}
                        value={form.address_description}
                        required 
                        error={typeof errors?.address_description !== 'undefined' ? true : false}
                        multiline
                        minRows={5}
                    />
                </Box>
                

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
            {!isComplete &&
                    <CircularProgress sx={{ width: 50 }} />
            }
        </Box>
    )
};

export default FormAlamat;
