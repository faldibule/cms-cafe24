import React, { useState, useEffect } from 'react';
import { Box, FormGroup, CircularProgress, FormControlLabel, Switch, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormHelperText } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'
import { API } from '../../Variable/API';
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert'
import { errorState } from '../../Recoil/Error'
import AlertSuccess from '../../components/Utils/AlertSuccess'
import AlertError from '../../components/Utils/AlertError'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


const role = ['customer', 'distributor', 'reseller', 'admin', 'test eror']

const SiteSetting = () => {
    const navigate = useNavigate()

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [alertErrorData, setAlertErrorData] = useRecoilState(errorState)

    // state
    const [cityLoading, setCityLoading] = useState(false)
    const [districtLoading, setDistrictLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [logo, setLogo] = useState({
        logo_preview: '',
        logo_file: ''
    })
    const [form, setForm] = useState({
        web_name: '',
        email: '',
        phone_number: '',
        description: '',
        address: '',
        postal_code: '',
        province_id: '11',
        city_id: '1101',
        district_id: '1101010',
        facebook: '',
        facebook_status: 1,
        twitter: '',
        twitter_status: 1,
        youtube: '',
        youtube_status: 0,
        instagram: '',
        instagram_status: 0,
    })
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
        })
        .catch(err => {
            err.response && console.log(err.response)
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
            err.response && console.log(err.response)
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
            setIsComplete(true)
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    const getSetting = () => {
        setIsComplete(false)
        axios.get(`${API}setting`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            getProv()
            getCity(res.data.data.province.id)
            getDistrict(res.data.data.city.id)
            setForm({
                ...form,
                web_name: res.data.data.name,
                email: res.data.data.email,
                phone_number: res.data.data.phone,
                address: res.data.data.address === null ? '' : res.data.data.address,
                description: res.data.data.description === null ? '' : res.data.data.description,
                postal_code: res.data.data.postal_code,
                province_id: res.data.data.province.id,
                city_id: res.data.data.city.id,
                district_id: res.data.data.district.id,
                facebook: res.data.data.fb === null ? '' : res.data.data.fb,
                facebook_status: res.data.data.fb_status,
                twitter: res.data.data.tw === null ? '' : res.data.data.tw,
                twitter_status: res.data.data.tw_status,
                youtube: res.data.data.yt === null ? '' : res.data.data.yt,
                youtube_status: res.data.data.yt_status,
                instagram: res.data.data.ig === null ? '' : res.data.data.ig,
                instagram_status: res.data.data.ig_status,
            })
            setLogo({
                ...logo,
                logo_preview: res.data.data.logo_url
            })
        })
        .catch(err => {
            err.response && console.log(err.response)
            setIsComplete(true)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted){
            getSetting()
        }

        return () => mounted = false
    }, [])

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

    const fotoProdukChange = (e) => {
        let logo_preview = URL.createObjectURL(e.target.files[0])
        let logo_file = e.target.files[0];
        setLogo({
            logo_preview,
            logo_file
        })
    }

    const checkChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.checked ? 1 : 0
        });
    };

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('name', form.web_name)
        formData.append('email', form.email)
        formData.append('phone', form.phone_number)
        formData.append('address', form.address)
        formData.append('description', form.description)
        formData.append('postal_code', form.postal_code)
        formData.append('province_id', form.province_id)
        formData.append('city_id', form.city_id)
        formData.append('district_id', form.district_id)
        formData.append('fb', form.facebook === '' ? '' : form.facebook)
        formData.append('fb_status', form.facebook_status)
        formData.append('tw', form.twitter === '' ? '' : form.twitter)
        formData.append('tw_status', form.twitter_status)
        formData.append('yt', form.youtube === '' ? '' : form.youtube)
        formData.append('yt_status', form.youtube_status)
        formData.append('ig', form.instagram === '' ? '' : form.instagram)
        formData.append('ig_status', form.instagram_status)
        if(logo.logo_file !== ''){
            formData.append('logo', logo.logo_file)
        }

        // console.log(Object.fromEntries(formData))
        axios.post(`${API}setting`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            getSetting()
            setErrors({})
            setAlert({
                message: 'Berhasil SImpan Setting',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000);
        })
        .catch(err => {
            err.response && console.log(err.response)
            setLoading(false)
            setErrors(err.response.data.errors)
        })

    }

    return (
        <div>
            {isComplete && 
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Box component="form" 
                sx={{
                    p: 2,  
                    
                    display: 'flex',
                    flexDirection: 'column', 
                    justifyContent: 'center' 
                }} onSubmit={onSubmit}>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
                    <AlertError message={alertErrorData.message} onTutup={()=> setAlertErrorData({message: '', display: false})} display={alertErrorData.display}/>
                    
                    {/* Informasi Utama */}
                    <Box sx={{ display: 'flex', p: 2, minWidth: '100%', boxShadow: 2,  flexDirection: 'column' }}>
                        <Typography variant="h6">
                            Informasi Utama
                        </Typography>

                        {/* Logo */}
                        <Box component="div" sx={{ mt: 2 }}>
                            <Typography>
                                Logo
                            </Typography>
                            <label htmlFor={`logo-id`} style={{ cursor: 'pointer' }} >
                                {logo.logo_preview !== '' ?
                                    <img src={logo.logo_preview} style={{ height: '130px', objectFit: 'cover', objectPosition: 'center' }} />
                                :
                                    <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>
                                }

                            </label>
                            <input 
                                name={`logo`}
                                id={`logo-id`} 
                                type="file" 
                                onChange={fotoProdukChange} 
                                style={{ display: 'none' }}
                            />
                        </Box>

                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={`Web Name`}
                            name='web_name'
                            onChange={onChange}
                            value={form.web_name}
                            required 
                            error={false}
                        />
                        {/* Email */}
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={`Email`}
                            name='email'
                            onChange={onChange}
                            value={form.email}
                            required 
                            helperText={typeof errors?.email !== 'undefined' ? errors.email[0] : ''}
                            error={typeof errors?.email !== 'undefined' ? true : false}
                        />
                        {/* nomor telepon */}
                        <Box sx={{ display: 'flex' }}>
                            <TextField
                                sx={{ mt: 2, width: 70, mr: 1 }}
                                variant="outlined"
                                size='small'
                                name='number_indonesia'
                                defaultValue={'+62'}
                                disabled
                            />
                            <TextField
                                sx={{ mt: 2 }}
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Nomor Telepon`}
                                name='phone_number'
                                onChange={onChange}
                                value={form.phone_number}
                                required 
                                helperText={typeof errors?.phone !== 'undefined' ? errors.phone[0] : ''}
                                error={typeof errors?.phone !== 'undefined' ? true : false}
                            />
                        </Box>
                        
                        {/* description */}
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            helperText={typeof errors?.description !== 'undefined' ? errors.description[0] : ''}
                            label={`Deskripsi Toko`}
                            name='description'
                            onChange={onChange}
                            value={form.description}
                            required 
                            error={typeof errors?.description !== 'undefined' ? true : false}
                            multiline
                            minRows={5}
                        /> 
                    </Box>

                    {/* Alamat  */}
                    <Box sx={{ display: 'flex', p: 2, mt: 2, minWidth: '100%', boxShadow: 2, flexDirection: 'column'}}>
                        <Typography variant="h6">
                            Alamat
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
                            error={typeof errors?.district_id !== 'undefined' ? true : false}
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

                        {/* kode Pos */}
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={`Kode Pos`}
                            name='postal_code'
                            onChange={onChange}
                            value={form.postal_code}
                            required 
                            helperText={typeof errors?.postal_code !== 'undefined' ? <span style={{color: 'red'}}>{errors.postal_code[0]}</span> : ''}
                            error={typeof errors?.postal_code !== 'undefined' ? true : false}
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            helperText={typeof errors?.address !== 'undefined' ? errors.address[0] : ''}
                            label={`Deskripsi Alamat`}
                            name='address'
                            onChange={onChange}
                            value={form.address}
                            required 
                            error={typeof errors?.address !== 'undefined' ? true : false}
                            multiline
                            minRows={5}
                        /> 
                    </Box>
                    
                    {/* Sosmed */}
                    <Box sx={{ display: 'flex', p: 2, mt: 2, minWidth: '100%', boxShadow: 2, flexDirection: 'column'}}>
                        <Typography variant="h6">
                            Sosial Media
                        </Typography>
                        {/* Facebook */}
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                sx={{ mt: 2, width: 750 }}
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Facebook`}
                                name='facebook'
                                onChange={onChange}
                                value={form.facebook}
                                required 
                                helperText={typeof errors?.fb !== 'undefined' ? errors.fb[0] : ''}
                                error={typeof errors?.fb !== 'undefined' ? true : false}
                                disabled={form.facebook_status === 1 ? false : true}
                            />
                            <FormGroup sx={{ ml: 2 }}>
                                <FormControlLabel 
                                control={
                                    <Switch
                                        name='facebook_status'
                                        checked={form.facebook_status === 1 ? true : false}
                                        onChange={checkChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                } 
                                label="Status Facebook" />
                            </FormGroup>
                        </Box>

                        {/* twitter */}
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                sx={{ mt: 2, width: 750 }}
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Twitter`}
                                name='twitter'
                                onChange={onChange}
                                value={form.twitter}
                                required 
                                helperText={typeof errors?.tw !== 'undefined' ? errors.tw[0] : ''}
                                error={typeof errors?.tw !== 'undefined' ? true : false}
                                disabled={form.twitter_status === 1 ? false : true}
                            />
                            <FormGroup sx={{ ml: 2 }}>
                                <FormControlLabel 
                                control={
                                    <Switch
                                        name='twitter_status'
                                        checked={form.twitter_status === 1 ? true : false}
                                        onChange={checkChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                } 
                                label="Status Twitter" />
                            </FormGroup>
                        </Box>

                        {/* youtube */}
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                sx={{ mt: 2, width: 750 }}
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Youtube`}
                                name='youtube'
                                onChange={onChange}
                                value={form.youtube}
                                required
                                helperText={typeof errors?.yt !== 'undefined' ? errors.yt[0] : ''}
                                error={typeof errors?.yt !== 'undefined' ? true : false}
                                disabled={form.youtube_status === 1 ? false : true}
                            />
                            <FormGroup sx={{ ml: 2 }}>
                                <FormControlLabel 
                                control={
                                    <Switch
                                        name='youtube_status'
                                        checked={form.youtube_status === 1 ? true : false}
                                        onChange={checkChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                } 
                                label="Status Youtube" />
                            </FormGroup>
                        </Box>

                        {/* Instagram */}
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                sx={{ mt: 2, width: 750 }}
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Instagram`}
                                name='instagram'
                                onChange={onChange}
                                value={form.instagram}
                                required 
                                helperText={typeof errors?.ig !== 'undefined' ? errors.ig[0] : ''}
                                error={typeof errors?.ig !== 'undefined' ? true : false}
                                disabled={form.instagram_status === 1 ? false : true}
                            />
                            <FormGroup sx={{ ml: 2 }}>
                                <FormControlLabel 
                                control={
                                    <Switch
                                        name='instagram_status'
                                        checked={form.instagram_status === 1 ? true : false}
                                        onChange={checkChange}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                } 
                                label="Status Instagram" />
                            </FormGroup>
                        </Box>

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
            </Box>
            }
            {!isComplete &&
                <CircularProgress sx={{ width: 50, display: 'block', my: 2 }} />
            }
        </div>
    )
};

export default SiteSetting;
