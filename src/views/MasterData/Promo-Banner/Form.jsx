import React, { useEffect, useState } from 'react';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, TextField, Typography } from '@mui/material'
import { useRecoilState } from 'recoil';
import { dataSizepack } from '../../../Recoil/Size';
import { DateRangePicker, LoadingButton, LocalizationProvider } from '@mui/lab';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { alertState } from '../../../Recoil/Alert';
import { API } from '../../../Variable/API';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { format, parseISO } from 'date-fns';
import moment from 'moment';


const Form = (props) => {
    const navigate = useNavigate()
    const { id } = useParams()

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [sizeRecoil, setSizeRecoil] = useRecoilState(dataSizepack)

    // state
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({
        image_preview: '',
        image_file: ''
    })
    const [form, setForm] = useState({
        name: '',
        description: '',
        date: [null, null]
    })

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

    useEffect(() => {
        let mounted = true
        if(mounted) {
            if(!!props.data){
                const { data } = props
                let start_date = parseISO(data.start_date?.split(' ')[0])
                let end_date = parseISO(data.end_date?.split(' ')[0])
                setForm({
                    ...form,
                    name: data.name,
                    description: data.description,
                    date: [start_date, end_date]
                })
                setImage({
                    ...image,
                    image_preview: data.image_url
                })
            }
        }

    }, [id])

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        let start_date = format(form.date[0], 'yyyy-MM-dd')
        const clock = moment(Date.now()).add('30', 'seconds').format('HH:mm:ss')
        if(start_date === moment(Date.now()).format('YYYY-MM-DD')){
            start_date = `${start_date} ${clock}`
        }else{
            start_date = `${start_date} 00:00:00`
        }
        let end_date = format(form.date[1], 'yyyy-MM-dd')
        end_date = `${end_date} 23:59:59`

        
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('description', form.description)
        formData.append('start_date', start_date)
        formData.append('end_date', end_date)
        
        if(props.title == 'Add'){
            formData.append('image', image.image_file)
            axios.post(`${API}promotion/create`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                setLoading(false)
                setSizeRecoil([])
                setAlert({
                    message: 'Berhasil Menambah Promo Banner',
                    display: true
                })
                navigate('/master-data/promo-banner')
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
        }else{
            if(image.image_file !== '')formData.append('image', image.image_file)
            formData.append('_method', 'patch')
            axios.post(`${API}promotion/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                setLoading(false)
                setSizeRecoil([])
                setAlert({
                    message: 'Berhasil Edit Promo Banner',
                    display: true
                })
                navigate('/master-data/promo-banner')
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
    }

    
    return (
        <div>
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
                    label={`Nama Promo Banner`}
                    name='name'
                    onChange={onChange}
                    value={form.name}
                    required 
                    error={false}
                />
                <TextField
                    sx={{ mt: 2 }}
                    variant="outlined"
                    size='small'
                    fullWidth
                    label={`Description`}
                    name='description'
                    onChange={onChange}
                    value={form.description}
                    required 
                    multiline
                    rows={3}
                    error={false}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                            disablePast
                            inputFormat='dd-MM-yyyy'
                            mask="__-__-____"
                            startText="Berlaku Dari"
                            endText="Berlaku Sampai"
                            value={form.date}
                            onChange={(newValue) => {
                                setForm({
                                    ...form,
                                    date: newValue
                                })
                            }}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField required size="small" fullWidth sx={{ mt: 3 }} {...startProps} />
                                    <Box   Box sx={{ mx: 2 }}> Sampai </Box>
                                    <TextField required size="small" fullWidth sx={{ mt: 3 }} {...endProps} />
                                </React.Fragment>
                            )}
                        />
                </LocalizationProvider>

                <LoadingButton
                    type="submit"
                    variant="contained"
                    sx={{mt: 2, mx: 'auto', borderRadius: 25, minWidth: 400 }}
                    loading={loading}
                >
                    Simpan
                </LoadingButton>
            </Box>
        </div>
    );
};

export default Form;
