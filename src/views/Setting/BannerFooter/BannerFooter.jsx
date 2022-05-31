import React, { useState, useEffect } from 'react';
import { Box, Typography, FormGroup, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { API } from '../../../Variable/API'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios'

const BannerFooter = () => {
    const [loading, setLoading] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [image, setImage] = useState({
        image_preview: '',
        image_file : null,
    })

    const bannerImageChange = (e) => {
        setIsComplete(false)
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        const formData = new FormData()
        formData.append('banner', image_file)
        axios.post(`${API}setting/footer_banner`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setImage({
                image_preview,
                image_file
            })
            setIsComplete(true)
        })
        .catch(err => {
            err.response && console.log(err.response)
            setIsComplete(true)
        })

        
    }

    const setImageData = () => {
        axios.get(`${API}setting/footer_banner/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res.data)
            setImage({
                ...image,
                image_preview: res.data.data.banner
            })
            setIsComplete(true)
        })
        .catch(err => {
            err.response && console.log(err.response)
            setIsComplete(true)
        })
    }

    useEffect(() => {
        let mounted = true;
        
        if(mounted){
            setImageData()
        }

        return () => mounted = false
    }, [])

    return (
        <Box component="form" sx={{
            p: 2,  
            minWidth: '100%', 
            boxShadow: 2, 
            display: 'flex',
            flexDirection: 'column', 
            justifyContent: 'center' 
        }}>
            {isComplete && 
            <Box component="div" sx={{ mt: 2 }}>
                <Typography>
                    Banner Footer
                </Typography>
                <label htmlFor={`banner-id`} style={{ cursor: 'pointer' }} >
                    {image.image_preview !== '' ?
                        <img src={image.image_preview} style={{ display: 'block', height: '300px', objectFit: 'cover', objectPosition: 'center' }} />
                        :
                        <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>
                    }

                </label>
                <input 
                    name={`logo`}
                    id={`banner-id`} 
                    type="file" 
                    onChange={bannerImageChange} 
                    style={{ display: 'none' }}
                />

            </Box>
            }
            {!isComplete && 
                <CircularProgress sx={{ width: 50, display: 'block', my: 2, mx: 3 }} />
            }
        </Box>
    );
};

export default BannerFooter;