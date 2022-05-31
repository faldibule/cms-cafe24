import React, { useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios'
import { API } from '../../Variable/API'
import { uploadAdapterPlugin } from './Adapter';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert'
import { dataArticle } from '../../Recoil/Article'
import { errorState } from '../../Recoil/Error'
import AlertError from '../../components/Utils/AlertError';
// import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage';

const FormArticle = () => {

    //utils
    const navigate = useNavigate()

    //Recoil
    const [alertErrorData, setAlertErrorData] = useRecoilState(errorState)
    const [alert, setAlert] = useRecoilState(alertState)
    const [artikel, setArtikel] = useRecoilState(dataArticle)


    // State
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        content: '',
        type: '',
        title: '',
        video_url: '',
    })
    const [image, setImage] = useState({
        image_file: '',
        image_preview: ''
    })

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

    const ckEditorChange = (e, editor) => {
        const data = editor.getData()
        setForm({
            ...form,
            content: data
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('type', form.type)
        formData.append('title', form.title)
        formData.append('content', form.content)
        if(form.type === 'video'){
            formData.append('video_url', form.video_url)
        }
        if(form.type === 'article'){
            formData.append('image', image.image_file)
        }
        // console.log(Object.fromEntries(formData))
        // setLoading(false)
        axios.post(`${API}article/create`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setArtikel({
                ...artikel,
                data: [],
                isComplete: false
            })
            setAlert({
                message: 'Berhasil Menambah Data Artikel',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 5000)
            
            navigate(`/artikel`)
            
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
    }

    return (
        <div>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box component='form' onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
                    <Typography variant="h5">
                        Form Artikel
                    </Typography>
                    <AlertError message={alertErrorData.message} onTutup={()=> setAlertErrorData({message: '', display: false})} display={alertErrorData.display}/>

                    <FormControl variant="standard" fullWidth sx={{ my: 2 }}>
                        <InputLabel id={`id-type`}>
                            Type
                        </InputLabel>
                        <Select
                            size='small'
                            value={form.type}
                            name={'type'} 
                            labelId={`id-type`}
                            onChange={onChange}
                        >
                            <MenuItem value="">
                                None
                            </MenuItem>
                            <MenuItem value="article">
                                Article
                            </MenuItem>
                            <MenuItem value="video">
                                Video
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        sx={{ my: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Judul`}
                        name='title'
                        onChange={onChange}
                        value={form.title}
                        helperText={typeof errors?.title !== 'undefined' ? <span style={{color: 'red'}}>{errors.title[0]}</span> : ''}
                        error={typeof errors?.title !== 'undefined' ? true : false}
                    />

                    {form.type === 'video' &&
                    <TextField
                        sx={{ my: 2 }}
                        variant="outlined"
                        size='small'
                        fullWidth
                        label={`Link Video`}
                        name='video_url'
                        onChange={onChange}
                        value={form.video_url}
                        helperText={typeof errors?.video_url !== 'undefined' ? <span style={{color: 'red'}}>{errors.video_url[0]}</span> : ''}
                        error={typeof errors?.video_url !== 'undefined' ? true : false}
                    />
                    }

                    {form.type === 'article' &&
                    <Box>
                        <Box component="div" sx={{ my: 2 }}>
                            <Typography>
                                Thumbnail Artikel
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
                    </Box>
                    }
                    <CKEditor
                        editor={ ClassicEditor }
                        onReady={(editor) => {
                            uploadAdapterPlugin(editor)
                            editor.editing.view.change((writer) => {
                                writer.setStyle(
                                    "height",
                                    "350px",
                                    editor.editing.view.document.getRoot()
                                );
                            });
                        }}
                        data={form.content}
                        config={ {

                        } }
                        onChange={ckEditorChange}
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

            </Box>
            
        </div>
    );
};

export default FormArticle;