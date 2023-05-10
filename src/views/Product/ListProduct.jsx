import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, TableContainer, MenuItem, Table, Paper, TableRow, TableCell, TableHead, TableBody, Typography, CircularProgress, Pagination, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, TextField } from '@mui/material'
import { blue, green, pink, grey } from '@mui/material/colors'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useRecoilState, useRecoilValue } from 'recoil'
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import axios from 'axios'
import { API } from '../../Variable/API'
import { kategoriParent } from '../../Recoil/Kategori';
import { allProduct } from '../../Recoil/Product';
import CurrencyFormat from 'react-currency-format';
import DiskonModal  from './DiskonModal'
import StatusModal from './StatusModal';

const ListProduct = () => {
    const navigate = useNavigate()

    // state
    const [index, setIndex] = useState(0)
    const [index2, setIndex2] = useState(0)
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)
    const [search, setSearch] = useState({
        category_id: '',
        sub_category_id: '',
        min_price: '',
        max_price: '',
        search: '',
        limit: '',
    })
    const [subCategory, setSubCategory] = useState([])
    const [category, setCategory] = useState([])

    // recoil
    const categoryRecoil = useRecoilValue(kategoriParent)
    const [alert, setAlert] = useRecoilState(alertState)
    const [product, setProduct] = useRecoilState(allProduct)
    
    // reff
    const number = useRef()
    number.current = 0

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen2 = (id) => {
        setIndex(id)
        setOpen2(true);
    };
    
    const handleClose2 = () => {
        setOpen2(false);
    };

    const handleClickOpen3 = (id) => {
        setIndex2(id)
        setOpen3(true);
    };
    
    const handleClose3 = () => {
        setOpen3(false);
    };

    const getSubCategory = async () => {
        const res = await axios.get(`${API}sub_category/fetch`)
        setSubCategory([...res.data.data])
        setCategory([...categoryRecoil])
    }

    const onSearchChange = (e) => {
        if(e.target.name === 'category_id'){
            setSearch({
                ...search,
                [e.target.name]: e.target.value,
                sub_category_id: '',
            })
        }else{
            setSearch({
                ...search,
                [e.target.name]: e.target.value
            })
        }

    }

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Produk Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}product/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        setAlert({
                            display: true,
                            message: 'Berhasil Hapus Produk'
                        })
                        setTimeout(() => {
                            setAlert({
                                message: '',
                                display: false
                            })
                        }, 6000)
                        setProduct({
                            ...product,
                            data: []
                        })
                    })
                    .catch(err => {
                        setDeleteLoading('none')
                    })
                }
              },
              {
                label: 'Tidak',
                onClick: () => console.log('Click No')
              }
            ]
          });
    }

    const setAllProduct = () => {
        number.current = 0
        setProduct({
            ...product,
            isComplete: false
        })
        setEmpty(false)
        axios.get(`${API}product/fetch?page=1&category_id=${search.category_id}&sub_category_id=${search.sub_category_id}&min_price=${search.min_price}&max_price=${search.max_price}&search=${search.search}&limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setProduct({
                    ...product,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setProduct({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        })
        .catch(err => {
        })
    }

    const onPageChange = (e, val) => {

        
        if(product.page !== val){
            setProduct({
                ...product,
                isComplete: false
            })
            axios.get(`${API}product/fetch?page=${val}&category_id=${search.category_id}&sub_category_id=${search.sub_category_id}&min_price=${search.min_price}&max_price=${search.max_price}&search=${search.search}&limit=${search.limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                if(res.data.data.data.length === 0){
                    setEmpty(true)
                }else{
                    setEmpty(false)
                    setProduct({
                        page: res.data.data.meta.current_page,
                        total: res.data.data.meta.last_page,
                        data: [...res.data.data.data],
                        isComplete: true
                    })
                }
            })
            .catch(err => {
            })
        }
    }

    const onSearch = (e) => {
        e.preventDefault()
        setProduct({
            ...product,
            isComplete: false
        })
        handleClose()
        setAllProduct()
    }

    const handleReset = () => {
        setSearch({
            category_id: '',
            sub_category_id: '',
            min_price: '',
            max_price: '',
            search: '',
            limit: '',
        })
    }

    useEffect(() => {
        let mounted = true
        if(product.data.length === 0 && mounted){
            setAllProduct()
        }

        return () => mounted = false


    }, [product.data.length])

    useEffect(() => {
        let mounted = true

        if(mounted && open){
            getSubCategory()
        }
        if(mounted && !open){
            setSubCategory([])
        }

        return () => mounted = false
    }, [open])

    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Typography variant="h5">
                Daftar Produk
            </Typography>

            <Box sx={{ display: 'flex' }}>
                <Button onClick={() => navigate(`/product/add`) } size='small' sx={{ my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
                    <AddBoxIcon  /> Tambah Data Produk
                </Button>
                <Button onClick={handleClickOpen} size='small' sx={{ ml: 2, my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
                    <FilterAltIcon  /> Filter
                </Button>
            </Box>

            <Box component='div' sx={{ mt: 1, display: deleteLoading  }} >
                <CircularProgress size={30}/>
            </Box>
            <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
            
            {/* Table */}
            <TableContainer sx={{ mt: 1 }} component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: blue[500]}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white'  }}>No</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Nama</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Harga</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Gambar</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Status</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Diskon</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Setting Diskon</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                        {product.data.length !== 0 && product.isComplete && !empty &&
                            <TableBody>
                                {product.data.map(val => {
                                    number.current = (number.current + 1) + (15 * (product.page - 1)) 
                                    return (
                                        <TableRow key={number.current}>
                                            <TableCell>{number.current}</TableCell>
                                            <TableCell align="center">{val.product_name}</TableCell>
                                            <TableCell align="center">
                                                <CurrencyFormat 
                                                    value={val.price}
                                                    displayType={'text'} 
                                                    thousandSeparator={"."}
                                                    decimalSeparator={","} 
                                                    prefix={'Rp.'} 
                                                    renderText={value => 
                                                        <b>{value}</b> 
                                                    } 
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <img src={val.image} style={{ width: '80px', height: '80px', objectFit: 'cover', objectPosition: 'center' }} />
                                            </TableCell>
                                            <TableCell align="center" sx={{ cursor: 'pointer' }} onClick={() => handleClickOpen3(val.id)}>
                                                { val.status === 'active' ? 
                                                    <ToggleOnIcon sx={{ color: green[400], fontSize: 40 }} /> 
                                                :
                                                    <ToggleOffIcon sx={{ color: grey[400], fontSize: 40 }} />
                                                }
                                            </TableCell>
                                            {val.discount !== null && val.active_discount !== 0 && 
                                                <TableCell align="center">
                                                    {val.discount_type === 'rp' &&
                                                        <CurrencyFormat 
                                                            value={val.discount} 
                                                            displayType={'text'} 
                                                            thousandSeparator={"."}
                                                            decimalSeparator={","} 
                                                            prefix={'Rp.'} 
                                                            renderText={value => 
                                                                <p>{value}</p>
                                                            } 
                                                        /> 
                                                    }
                                                    {val.discount_type === 'percent' &&
                                                        <p>{val.discount}%</p>
                                                    }
                                                </TableCell>
                                            }
                                            {val.discount === null && 
                                                <TableCell align="center">0</TableCell>
                                            }
                                            <TableCell align="center">
                                                <Button variant="contained" onClick={() => handleClickOpen2(val.id)}>
                                                    Setting Diskon
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/product/edit/${val.id}`)} />
                                                    <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                                    <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} />
                                                </Box>
                                            </TableCell>
                                            
                                        </TableRow>
                                    )
                                })}
                            </TableBody>

                        }
                </Table>
            </TableContainer>


            {product.data.length !== 0 && product.isComplete && !empty &&
                 <Pagination sx={{ mt: 2, mx: 'auto' }} count={product.total} page={product.page} onChange={onPageChange} color="primary" />
            }
            {!empty && !product.isComplete &&
                <Box component='div' sx={{ mt:2, mx: 'auto' }} >
                    <CircularProgress size={30}/>
                </Box>
            }
            {empty && product.isComplete &&
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                    Produk Kosong
                </Typography>
            </Box>    
            }

            </Box>
            
            {/* Diskon */}
            <DiskonModal 
                val={product.data.filter(val => val.id == index)[0]} 
                open2={open2} 
                handleClose2={handleClose2} 
                TextField={TextField}
                setAlert={setAlert} 
            />

            {/* Status */}
            <StatusModal
                val={product.data.filter(val => val.id == index2)[0]} 
                open2={open3} 
                handleClose2={handleClose3} 
                TextField={TextField}
                setAlert={setAlert} 
            />

            {/* Dialog */}
            <Dialog
                maxWidth={'lg'}
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Filter"}</DialogTitle>
                <Box component="form" sx={{ width: 500 }} onSubmit={onSearch}>
                    <DialogContent>

                        {/* Search */}
                        <TextField
                            sx={{ my: 2 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={`Kata Kunci`}
                            name='search'
                            onChange={onSearchChange}
                            value={search.search}
                        />

                         {/* Price  */}
                         <Box sx={{ display: 'flex', }}>
                            <TextField
                                sx={{ mr: 1 }}
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Harga Minimal`}
                                name='min_price'
                                onChange={onSearchChange}
                                value={search.min_price}
                            />
                            <TextField
                                variant="outlined"
                                size='small'
                                fullWidth
                                label={`Harga Maximum`}
                                name='max_price'
                                onChange={onSearchChange}
                                value={search.max_price}
                            />
                         </Box>

                        {/* Kategori */}
                        <Box sx={{ display: 'flex', mt: 2}}>
                            <FormControl variant="standard" fullWidth sx={{ mr: 2 }}>
                                <InputLabel id={`id-kategori`}>
                                    Kategori
                                </InputLabel>
                                <Select
                                    size='small'
                                    value={search.category_id}
                                    name={'category_id'} 
                                    labelId={`id-kategori`}
                                    onChange={onSearchChange}
                                >
                                    {category.map(val => (
                                        <MenuItem key={val.id} value={val.id}>
                                            {val.category_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" fullWidth >
                                <InputLabel id={`id-sub-kategori`}>
                                    Sub Kategori
                                </InputLabel>
                                <Select
                                    size='small'
                                    value={search.sub_category_id}
                                    name={'sub_category_id'} 
                                    labelId={`id-sub-kategori`}
                                    onChange={onSearchChange}
                                    disabled={subCategory.length === 0 ? true : false}
                                >
                                    {search.category_id !== '' && subCategory.map(val => {
                                        if(search.category_id === val.category_id){
                                            return (
                                                <MenuItem key={val.id} value={val.id}>
                                                    {val.sub_category_name}
                                                </MenuItem>
                                            ) 
                                        }
                                        
                                    })}
                                    {search.category_id !== '' && subCategory.filter(val => val.category_id === search.category_id).length === 0 &&
                                        <MenuItem value={''} disabled>
                                            Kosong
                                        </MenuItem>
                                    }
                                    {search.category_id === '' && 
                                        subCategory.map(val => (
                                            <MenuItem key={val.id} value={val.id}>
                                                {val.sub_category_name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            
                         </Box>
                        

                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={handleReset}>Reset</Button>
                        <Button type="submit">Submit</Button>
                        <Button type="button" onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </div>
    );
};

export default ListProduct;