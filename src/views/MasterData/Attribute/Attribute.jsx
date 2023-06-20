import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { useEffect, useState } from 'react'
import { AttributeStyle } from './AttributeStyle'
import { Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil'
import { allAttr, parentAttr } from '../../../Recoil/Attr';
import { API } from '../../../Variable/API';
import axios from 'axios';
import { blue, green, pink, grey } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AlertSuccess from '../../../components/Utils/AlertSuccess';
import { alertState } from '../../../Recoil/Alert';

const theme = createTheme()


const Attribute = () => {
    const classes = AttributeStyle()
    const history = useNavigate()

    // state
    const [deleteLoading, setDeleteLoading] = useState('none')

    // recoil
    const parentRefresh = useRecoilRefresher_UNSTABLE(parentAttr)
    const parent = useRecoilValue(parentAttr)
    const [allAttribute, setAllAttribute] = useRecoilState(allAttr)
    const [alert, setAlert] = useRecoilState(alertState)

    const setAttr = () => {
        let x = []
            parent.map((p, i) => {
                axios.get(`${API}variant_option/fetch?variant_id=${p.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                .then(child => {
                    x.push({
                        ...p,
                        child: [...child.data.data]
                    })
                    setAllAttribute([...allAttribute, ...x])
                    
                })
                .catch(err => {
                    // if(err.response) console.log(err.response)
                })
            })
    }
    
    useEffect(() => {
        let mounted = true;

        if(mounted && allAttribute.length === 0){
            setAttr()
        }


        return () => mounted = false
    }, [allAttribute.length])

    useEffect(() => {
        let mounted = true
        if(alert.display && mounted && !alert.message.includes('Attribute')){
            setAlert({
                message: '',
                display: false
            })
        }
        return () => mounted = false
    })

    const onDelete = (id) => {
        confirmAlert({
            title: 'Data Pelanggan Akan Hilang Permanen',
            message: 'Yakin Ingin Menghapus ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setDeleteLoading('block')
                    axios.delete(`${API}variant/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`
                        }
                    })
                    .then(res => {
                        setDeleteLoading('none')
                        parentRefresh()
                        setAllAttribute([])
                    })
                    .catch(err => {
                        // err.response && console.log(err.response)
                        setDeleteLoading('none')
                    })
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
            <Button onClick={() => history(`/master-data/attr_parent/add`) } size='small' className={classes.buttonAdd} variant="contained">
                <AddBoxIcon  /> Tambah Attribute
            </Button>
            <Box component='div' sx={{ mt: 1, display: deleteLoading  }} >
                <CircularProgress size={30}/>
            </Box>
            <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
            <div className={classes.container}>
                <div className={classes.table}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                            <TableHead >
                                <TableRow sx={{backgroundColor: green[500]}}>
                                    <TableCell sx={{ fontSize: '1.1rem', width: '10%', color: 'white' }} align="center">No</TableCell>
                                    <TableCell sx={{ fontSize: '1.1rem', width: '10%', color: 'white' }} align="center">Name</TableCell>
                                    <TableCell sx={{ fontSize: '1.1rem', width: '70%', color: 'white' }} align="center">Options</TableCell>
                                    <TableCell sx={{ fontSize: '1.1rem', width: '70%', color: 'white' }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allAttribute.length === parent.length &&
                                    allAttribute.map((val, i) => (
                                        <TableRow key={val.variant_name+`section`}>
                                            <TableCell align="center">{++i}</TableCell>
                                            <TableCell align="center">{val.variant_name}</TableCell>
                                            <TableCell >
                                                {val.child.length !== 0 && val.child.map((child, i) => {
                                                    if(i === val.child.length - 1){
                                                        return (
                                                            <div style={{ display:'inline' }} key={`${child.variant_option_name}-section`}>
                                                                <span>{child.variant_option_name}.</span>
                                                                <span style={{cursor: 'pointer', color: 'red'}} onClick={()=> history(`/master-data/attr/${val.variant_name}-${val.id}`)} >Setting Options</span>
                                                            </div>
                                                        )
                                                    }else{
                                                        return (
                                                            <span key={`${child.variant_option_name}-section`}>{child.variant_option_name}, </span>
                                                        )
                                                    }
                                                })}
                                                {val.child.length === 0 && 
                                                    <span style={{cursor: 'pointer', color: 'red'}} onClick={()=> history(`/master-data/attr/${val.variant_name}-${val.id}`)} >Setting Options</span>
                                                }
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => history(`/master-data/attr_parent/edit/${val.id}`)} />
                                                    <Box component="span" sx={{ fontSize: '1.2rem' }}>|</Box>
                                                    {val.child.length === 0 ? 
                                                        <DeleteForeverIcon sx={{ color: pink[500], cursor: 'pointer' }} onClick={() => onDelete(val.id)} /> 
                                                    : 
                                                        <DeleteForeverIcon sx={{ color: grey[500] }} />
                                                    }
                                                    
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                
                                
                                }    
                            </TableBody>
                        </Table>
                    </TableContainer> 
                    {allAttribute.length !== parent.length &&
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

export default Attribute
