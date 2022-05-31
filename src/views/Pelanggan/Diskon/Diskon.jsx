import React, { useEffect, useRef } from 'react';
import { Box, Button, TableContainer, CircularProgress, Table, Paper, TableRow, TableCell, TableHead, TableBody, Typography } from '@mui/material'
import { blue, green } from '@mui/material/colors'
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil'
import { dataRole } from '../../../Recoil/Role';
import axios from 'axios'
import { API } from '../../../Variable/API'; 

const Diskon = () => {
    const navigate = useNavigate()
    const [role, setRole] = useRecoilState(dataRole)
    const number = useRef()
    number.current = 0

    const setDataRole = () => {
        axios.get(`${API}role/fetch`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setRole([...res.data.data])
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true
        if(mounted && role.length === 0){
            setDataRole()
        }

        return () => mounted = false

    }, [role.length])

    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Typography variant="h5">
                Daftar Group
            </Typography>
            {role.length !== 0 &&
            <TableContainer sx={{ mt: 1 }} component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: blue[500]}}>
                        <TableRow>
                            <TableCell sx={{ color: 'white'  }}>No</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Nama Group</TableCell>
                            <TableCell sx={{ color: 'white'  }} align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {role.map((val, i) => {
                            if(val.id !== 1 && val.id !== 2 && val.id !== 3){
                                number.current = number.current + 1
                                return (
                                    <TableRow key={val.id}>
                                        <TableCell align="center">{number.current}</TableCell>
                                        <TableCell align="center">{val.name}</TableCell>
                                        <TableCell align="center">
                                            <EditIcon sx={{ color: green[500], cursor: 'pointer' }} onClick={() => navigate(`/diskon/${val.id}`)} />
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        })}
                    </TableBody>
                </Table>
            </TableContainer> 
            }
            {role.length === 0 &&
                <CircularProgress sx={{ width: 50, mx: 'auto', mt: 2}} />
            }
            </Box>
        </div>
    );
};

export default Diskon;