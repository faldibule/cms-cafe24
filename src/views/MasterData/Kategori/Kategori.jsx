import React, { useEffect, useRef, useState } from 'react'
import {  TableBody, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, Button, CircularProgress, Box} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { formKategoriStyle } from './Style';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useLocation } from 'react-router-dom';
import ListComponent from './ListComponent';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil'
import { allKategori, kategoriParent } from '../../../Recoil/Kategori';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import axios from 'axios';
import { API } from '../../../Variable/API';
import AlertSuccess from '../../../components/Utils/AlertSuccess';
import { alertState } from '../../../Recoil/Alert';
import { blue, green, pink, grey } from '@mui/material/colors'

const theme = createTheme();

const Kategori = () => {
    const nomor = useRef();
    nomor.current = 0;
    const [alert, setAlert] = useRecoilState(alertState)
    const history = useNavigate()
    const classes = formKategoriStyle()
    const parent = useRecoilValue(kategoriParent)
    const refreshParent = useRecoilRefresher_UNSTABLE(kategoriParent)
    const [listKategori, setListKategori] = useRecoilState(allKategori);

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
                setListKategori([...x, ...listKategori,])
            })
            .catch(err => {
                //if(err.response) console.log(err.response)
            })
        })
    }

    useEffect(() => {
        let mounted = true;

        if(listKategori.length === 0 && mounted){
            setKategori()
        }

        return () => {
            mounted = false
        }
    }, [listKategori])

    const deleteParentById = (id) => {
        let length = 0
        axios.get(`${API}sub_category/fetch?category_id=${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('authToken')
            }
        })
        .then(res => {
            length = res.data.data.length
            if(length === 0){
                return axios.delete(`${API}category/delete/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                .then(del => {
                    setAlert({
                        message: 'Berhasil Menghapus Kategori',
                        display: true
                    })
                    setTimeout(() => {
                        setAlert({
                            message: '',
                            display: false
                        })
                    }, 5000)
                    refreshParent();
                    setListKategori([]);
                })
                .catch(err => {
                    // if(err.response) console.log(err.response)
                })
            }
            // res.data.data.forEach((val, i) => {
            //     axios.delete(`${API}sub_category/delete/${val.id}`, {
            //         headers: {
            //             Authorization: 'Bearer ' + localStorage.getItem('authToken')
            //         }
            //     })
            //     .then(res => {
            //         if(i === length - 1){
            //             axios.delete(`${API}category/delete/${id}`, {
            //                 headers: {
            //                     Authorization: 'Bearer ' + localStorage.getItem('authToken')
            //                 }
            //             })
            //             .then(del => {
            //                 refreshParent();
            //                 setAlert({
            //                     message: 'Berhasil Menghapus',
            //                     display: true
            //                 })
            //                 setListKategori([]);
            //             })
            //             .catch(err => {
            //                 if(err.response) console.log(err.response)
            //             })
            //         }
            //     })
            //     .catch(err => {
            //         if(err.response) console.log(err.response)
            //     })
            // })
        })
        .catch(err => {
            // err.response && console.log(err)
        })
    
    }

    const parentDelete = (id) => {
        confirmAlert({
            title: 'Data Kategori Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: async () => {
                    try {
                        await deleteParentById(id)
                        
                    } catch (error) {
                        // if(error.response) console.log(error.response)
                    }
                    

                }
              },
              {
                label: 'Tidak',
                onClick: () => 'Click No'
              }
            ]
          });
    }


    return (
        <ThemeProvider theme={theme}>
            <div className={classes.container}>
                <div className={classes.form}>
                    <Typography variant="h5">
                        Daftar Kategori
                    </Typography>
                    <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
                    <Button className={classes.buttonAdd} variant="contained" onClick={() => history('/master-data/kategori/form') }><AddBoxIcon /> Tambah Kategori Baru</Button>
                    <TableContainer sx={{ minWidth: 600 }} component={Paper}>
                        <Table sx={{ minWidth: 600 }} aria-label="simple table">
                            <TableHead sx={{ backgroundColor: blue[500]}}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Name</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Image</TableCell>
                                    <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {parent.length === listKategori.length && listKategori.map((val, i) => {
                                    return (
                                        <TableRow key={`${val.id}-${i}`}>
                                            
                                            <TableCell>{i + 1}</TableCell>
                                            <TableCell align="center" sx={{ cursor: 'pointer', color: 'blue' }} onClick={() => history(`/master-data/sub_kategori/${val.id}`)} >{val.category_name}</TableCell>
                                            <TableCell align="center">
                                                <img src={val.image_url} style={{ height: '60px', objectFit: 'cover', objectPosition: 'center' }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => history(`/master-data/kategori/parent_update/${val.id}`)} />
                                                    <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                                    {val.child.length === 0 ? 
                                                        <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => parentDelete(val.id)} /> 
                                                    : 
                                                        <DeleteForeverIcon sx={{ color: grey[500] }} />
                                                    }
                                                    
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>                      
                    {parent.length !== listKategori.length && 
                        <Box 
                            sx={{width: 400, display: 'flex', justifyContent: 'center', margin: '10px auto'}}
                            component='div'
                        >
                            <CircularProgress sx={{margin: '10px auto'}} />
                        </Box>
                    }
            </div>
            </div>
        </ThemeProvider>
    )
}

export default Kategori
