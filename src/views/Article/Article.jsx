import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Dialog, Slide, Grid, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, CircularProgress, Pagination, Card, CardContent, CardActions, IconButton, CardMedia, FormControl, InputLabel, Select, MenuItem, } from '@mui/material'
import { blue, green, pink, grey } from '@mui/material/colors'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import axios from 'axios'
import { API } from '../../Variable/API'
import { dataArticle } from '../../Recoil/Article';
import DefaultImage from '../../Image/default.png'



const Article = () => {
    const navigate = useNavigate()

    // state
    const [open, setOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)
    const [search, setSearch] = useState({
        type: '',
        limit: '6',
    })

    // recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [article, setArticle] = useRecoilState(dataArticle)
    
    // reff
    const number = useRef()
    number.current = 0

    const youtubeParser = (url) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return match && match[7].length === 11 ? match[7] : false;
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const onSearchChange = (e) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const onDelete = (slug) => {
        confirmAlert({
            title: 'Data Produk Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    // setTimeout(() => {
                    //     console.log(id)
                    //     setDeleteLoading('none')
                    //     setArticle({
                    //         ...product,
                    //         data: []
                    //     })
                    //     setAlert({
                    //         display: true,
                    //         message: 'Berhasil Hapus Produk'
                    //     })
                    // }, 2000);
                    axios.delete(`${API}article/delete/${slug}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setAlert({
                            display: true,
                            message: 'Berhasil Hapus Artikel'
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 6000)
                        const filtered = article.data.filter(val => val.slug !== slug)
                        setArticle({
                            ...article,
                            data: [...filtered]
                        })
                    })
                    .catch(err => {
                        // err.response && console.log(err.response)
                        setDeleteLoading('none')
                    })
                }
              },
              {
                label: 'Tidak',
                onClick: () => { return 'x' }
              }
            ]
          });
    }

    const setAllArticle = () => {
        number.current = 0
        setEmpty(false)
        axios.get(`${API}article/fetch?type=${search.type}&limit=${parseInt(search.limit)}&page=1`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setArticle({
                    ...article,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setArticle({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
            // console.log(res.data)
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    const onPageChange = (e, val) => {
        
        if(article.page !== val){
            setArticle({
                ...article,
                isComplete: false
            })
            axios.get(`${API}article/fetch?type=${search.type}&limit=${search.limit}&page=${val}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                // console.log(res.data)
                if(res.data.data.data.length === 0){
                    setEmpty(true)
                }else{
                    setEmpty(false)
                    setArticle({
                        page: res.data.data.meta.current_page,
                        total: res.data.data.meta.last_page,
                        data: [...res.data.data.data],
                        isComplete: true
                    })
                }

            })
            .catch(err => {
                // err.response && console.log(err.response)
            })
        }
    }

    const onSearch = (e) => {
        e.preventDefault()
        setArticle({
            ...article,
            isComplete: false
        })
        handleClose()
        setAllArticle()
    }

    useEffect(() => {
        let mounted = true
        if(article.data.length === 0 && mounted){
            setAllArticle()
        }

        return () => mounted = false


    }, [article.data.length])

    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>

            <Box sx={{ display: 'flex' }}>
                <Button onClick={() => navigate(`/artikel/add`) } size='small' sx={{ my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
                    <AddBoxIcon  /> Tambah Artikel Baru
                </Button>
                <Button onClick={handleClickOpen} size='small' sx={{ ml: 2, my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
                    <FilterAltIcon  /> Filter
                </Button>
            </Box>
            
            <Box component='div' sx={{ mt: 1, display: deleteLoading  }} >
                <CircularProgress size={30}/>
            </Box>
            <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />

            {/* Card */}
            <Grid container spacing={1}>
                {article.data.length !== 0 && article.isComplete && !empty &&
                    article.data.map((val, i) => (
                        <Grid key={i} item md={4} xs={12} sm={6} lg={3}>
                            <Card key={i} sx={{ width: '100%', border: 1, borderColor: 'primary.main', m: 2, borderRadius: 2, boxShadow: 3 }}>
                                {val.type === "article" &&
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={val.image_url}
                                        alt="Article Image"
                                    />
                                }
                                {val.type === "video" &&
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        src={`https://img.youtube.com/vi/${youtubeParser(val.video_url)}/0.jpg`}
                                        alt="Article Image"
                                    />
                                    
                                
                                }
                                <CardContent>
                                    
                                    <Typography variant="body2" >
                                        <b>{val.title}</b>
                                    </Typography>
                                    
                                    
                                </CardContent>
                                <CardActions>
                                    <IconButton aria-label="Edit" onClick={() => navigate(`/artikel/edit/${val.slug}`)} sx={{ marginLeft: 'auto', border: 1}}>
                                        <EditIcon sx={{ color: green[500], cursor: 'pointer' }} />
                                            
                                    </IconButton>
                                    

                                    <IconButton aria-label="Delete" onClick={() => onDelete(val.slug)} sx={{ border: 1, mr: 1 }}>
                                        <DeleteForeverIcon  sx={{ color: pink[500], cursor: 'pointer', }} />
                                    </IconButton>
                                    
                                    
                                </CardActions>




                            </Card>
                        </Grid>
                    ))
                }
            </Grid>



            {!empty && !article.isComplete &&
                <Box component='div' sx={{ mt:2, mx: 'auto' }} >
                    <CircularProgress size={30}/>
                </Box>
            }
            
            {article.data.length !== 0 && article.isComplete && !empty &&
                 <Pagination sx={{ mt: 2, mx: 'auto' }} count={article.total} page={article.page} onChange={onPageChange} color="primary" />
            }
            
            {empty && article.isComplete &&
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                    Artikel Kosong
                </Typography>
            </Box>    
            }

            </Box>


            {/* Dialog */}
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Filter"}</DialogTitle>
                <Box component="form" sx={{ width: 300 }} onSubmit={onSearch}>

                    <DialogContent>
                        <FormControl variant="standard" fullWidth sx={{ mb: 2 }}>
                            <InputLabel id={`id-type`}>
                                Type
                            </InputLabel>
                            <Select
                                size='small'
                                value={search.type}
                                name={'type'} 
                                labelId={`id-type`}
                                onChange={onSearchChange}
                            >
                                <MenuItem value="">
                                    All
                                </MenuItem>
                                <MenuItem value="article">
                                    Article
                                </MenuItem>
                                <MenuItem value="video">
                                    Video
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Submit</Button>
                        <Button type="button" onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Box>
            </Dialog>

        </div>
    );
};

export default Article;