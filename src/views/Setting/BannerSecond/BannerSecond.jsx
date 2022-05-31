import React, { useState, useEffect } from 'react';
import { Box, Typography, FormGroup, CircularProgress } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { API } from '../../../Variable/API'
import axios from 'axios';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


const BannerSecond = () => {
    const [isComplete, setIsComplete] = useState({
        image1: false,
        image2: false
    })
    const [image, setImage] = useState({
        image1: {
            id: '',
            image_preview: '',
            image_file : null,
        },
        image2:{
            id: '',
            image_preview: '',
            image_file : null,
        }
    })

    const bannerImageChange = (e) => {
        setIsComplete({
            ...isComplete,
            [e.target.name]: false
        })
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        const formData = new FormData()
        let id = ''
        if(e.target.name === 'image1'){
            formData.append('order', 1)
            id = 2
        }else{
            formData.append('order', 2)
            id = 3
        }
        formData.append('banner', image_file)
        if(image[e.target.name].image_preview === ''){
            // Post
            axios.post(`${API}setting/second_banner/create`, formData, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                console.log(res.data)
                setImage({
                    ...image,
                    [e.target.name]: {
                        image_preview,
                        image_file
                    }
                })
                setIsComplete({
                    ...isComplete,
                    [e.target.name]: true
                })
            })
            .catch(err => {
                err.response && console.log(err.response)
            })

        }else{
            // Update
            formData.append('_method', 'put')
            axios.post(`${API}setting/second_banner/update/${id}`, formData, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                console.log(res.data)
                setImage({
                    ...image,
                    [e.target.name]: {
                        image_preview,
                        image_file
                    }
                })
                setIsComplete({
                    ...isComplete,
                    [e.target.name]: true
                })
            })
            .catch(err => {
                err.response && console.log(err.response)
            })

        }

        
    }

    const setImageData = () => {
        axios.get(`${API}setting/second_banner/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            console.log(res.data)
            if(res.data.data.length === 0){
                setImage({
                    image1: {
                        id: '',
                        image_preview: '',
                        image_file : null,
                    },
                    image2:{
                        id: '',
                        image_preview: '',
                        image_file : null,
                    }
                })
                setIsComplete({
                    image1: true,
                    image2: true
                })
            }else{
                let imageTemp = {
                    image1: {},
                    image2: {},
                }
                res.data.data.map(val => {
                    console.log(val)
                    if(val.order === 1){
                        imageTemp = {
                            ...imageTemp,
                            image1: val
                        }
                    }else if(val.order === 2){
                        imageTemp = {
                            ...imageTemp,
                            image2: val
                        }
                    }
                })
                console.log(imageTemp)

                setImage({
                    image1: {
                        id: '',
                        image_preview: imageTemp.image1.banner,
                        image_file: null
                    },
                    image2: {
                        id: '',
                        image_preview: imageTemp.image2.banner,
                        image_file : null,
                    },
                })
                setIsComplete({
                    image1: true,
                    image2: true
                })

            }
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
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

            <Box component='div' sx={{
                display: 'flex'
            }}>
                {/* image 1 */}
                {isComplete.image1 && 
                <Box component="div" sx={{ mt: 2 }}>
                    <Typography>
                        Banner 1
                    </Typography>
                    <label htmlFor={`banner1-id`} style={{ cursor: 'pointer' }} >
                    {image.image1.image_preview !== '' ? 
                        <img src={image.image1.image_preview} style={{ display: 'block', height: '300px', objectFit: 'cover', objectPosition: 'center' }} />
                        :
                        <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>
                    }
                    </label>
                    <input 
                        name={`image1`}
                        id={`banner1-id`} 
                        type="file" 
                        onChange={bannerImageChange} 
                        style={{ display: 'none' }}
                    />
                </Box>
                }
                {!isComplete.image1 &&
                <CircularProgress sx={{ width: 50, display: 'block', my: 2, mx: 3 }} />
                }

                {/* image2 */}
                {isComplete.image2 &&
                <Box component="div" sx={{ mt: 2, ml: 4  }}>
                    <Typography>
                        Banner 2
                    </Typography>
                    <label htmlFor={`banner2-id`} style={{ cursor: 'pointer' }} >
                    {image.image2.image_preview !== '' ? 
                        <img src={image.image2.image_preview} style={{ display: 'block', height: '300px', objectFit: 'cover', objectPosition: 'center' }} />
                        :
                        <AddPhotoAlternateIcon sx={{ fontSize: '5rem' }}/>

                    }
                    </label>
                    <input 
                        name={`image2`}
                        id={`banner2-id`} 
                        type="file" 
                        onChange={bannerImageChange} 
                        style={{ display: 'none' }}
                    />

                    
                </Box>
                }
                {!isComplete.image2 &&
                <CircularProgress sx={{ width: 50, display: 'block', my: 2, mx: 3 }} />
                }
            </Box>
        </Box>
    );
};

export default BannerSecond;