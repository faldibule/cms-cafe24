import React, { useState, useRef, useEffect } from 'react';
import { Box, Autocomplete, TextField, CircularProgress } from '@mui/material'
import { useRecoilState } from 'recoil'
import { dataPelanggan } from '../../Recoil/PelangganRecoil'
import { dataUserAnda } from '../../Recoil/DetailUserAnda'
import { LoadingButton } from '@mui/lab';
import axios from 'axios'
import { API } from '../../Variable/API'
import { useNavigate } from 'react-router-dom';
import { alertState } from '../../Recoil/Alert';



const FormUserAnda = () => {
    //utils
    const navigate = useNavigate()
    const params = window.location.href.split('/')[5]

    //State
    const [parentId, setParentId] = useState('')
    const [search, setSearch] = useState({
        user_id: ''
    })
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [empty2, setEmpty2] = useState(false)
    const [temp, setTemp] = useState({})
    const [isComplete, setIsComplete] = useState(false)

    // Recoil
    const [pelangganAnda, setPelangganAnda] = useRecoilState(dataUserAnda)
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    const [alert, setAlert] = useRecoilState(alertState)

    // Ref
    const cancelToken = useRef({})

    const setDataPelanggan = () => {
        setEmpty2(false)
        axios.get(`${API}user/customer?search=&page=1&status=&limit=3&parent=no`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty2(true)
                setPelanggan({
                    ...pelanggan,
                    data: [],
                    isComplete: true
                })
            }else{
                setEmpty2(false)
                setPelanggan({
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
    
    const setDataUpdate = (userId) => {
        axios.get(`${API}user/show/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            setTemp(res.data.data)
            setSearch({
                user_id: userId
            })
            setIsComplete(true)
        })
        .catch(err => {
            err.response && console.log(err.response)
        })
    }

    useEffect(() => {
        let mounted = true;
        if(mounted){
            if(params.includes('-')){
                const parent = params.split('-')[0]
                const user = params.split('-')[1]
                setParentId(parent)
                setDataUpdate(user)
            }else{
                setParentId(params)
                setIsComplete(true)

            }
        }
        return () => mounted = false
    }, [params])

    useEffect(() => {
        let mounted = true;
        if(mounted){
            setDataPelanggan()
        }
        return () => mounted = false
    }, [])

    const liveSearch = async (keyword, status) => {
        setEmpty2(false)
        if(typeof cancelToken.current.cancel !== 'undefined'){
            cancelToken.current.cancel("Canceled")
        }
        cancelToken.current = axios.CancelToken.source()
        try {
            const res = await axios.get(`${API}user/customer?search=${keyword}&page=1&status=${status}&limit=1&parent=no`, {
                cancelToken: cancelToken.current.token,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if(res.data.data.data.length === 0){
                setEmpty2(true)
                setPelanggan({
                    ...pelanggan,
                    isComplete: true
                })
            }else{
                setEmpty2(false)
                setPelanggan({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        } catch (error) {
            // console.log(error)
        }
        
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData()
        formData.append('user_id', search.user_id)
        formData.append('parent_id', parentId)

        if(params.includes('-')){
            const parent = params.split('-')[0]
            const user = params.split('-')[1]
            axios.post(`${API}user/parent/set/${user}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                // console.log(res)
                setLoading(false)
                setAlert({
                    message: 'Berhasil Edit Data Pelanggan Anda',
                    display: true
                })
                setTimeout(() => {
                    setAlert({
                        message: '',
                        display: false
                    })
                }, 4000)
                setPelangganAnda({
                    ...pelangganAnda,
                    data: []
                })
                navigate(`/admin/user/${parentId}`)
            })
            .catch(err => {
                setLoading(false)
                // console.log(err.response)
            })
        }else{
            axios.post(`${API}user/parent/set`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                // console.log(res)
                setLoading(false)
                setAlert({
                    message: 'Berhasil Menambah Data Pelanggan Anda',
                    display: true
                })
                setTimeout(() => {
                    setAlert({
                        message: '',
                        display: false
                    })
                }, 4000)
                setPelangganAnda({
                    ...pelangganAnda,
                    data: []
                })
                navigate(`/admin/user/${parentId}`)
            })
            .catch(err => {
                setLoading(false)
                // console.log(err.response)
            })

        }

        
    }


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box component="form" onSubmit={onSubmit}>
                {isComplete && 
                <>
                    <Autocomplete
                        sx={{ mt: 3, flexGrow: 2 }}
                        size='small'
                        freeSolo={true}
                        variant="outlined"
                        value={
                            [temp, ...pelanggan.data].filter(val => val.id == search.user_id).length !== 0 ?
                                [temp, ...pelanggan.data].filter(val => val.id == search.user_id)[0] 
                            :
                                ''
                        }
                        onChange={(event, newValue) => {
                            // select
                            newValue !== null && setSearch({
                                ...search,
                                user_id: newValue.id  
                            })
                            
                        }}
                        inputValue={keyword}
                        loading={pelanggan.isComplete ? false : true}
                        onInputChange={(event, newInputValue) => {
                            // ketik
                            setKeyword(newInputValue)
                            liveSearch(newInputValue, "active")
                        }}  
                        id="controllable-states-demo"
                        options={[temp, ...pelanggan.data]}
                        isOptionEqualToValue={(option, value) => {
                                return option.id === value.id
                            }
                        }
                        getOptionLabel={(option) => typeof option.name !== 'undefined' ? option.name : ''}
                        renderInput={(params) => <TextField 
                            {...params} 
                            label="User"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                    {pelanggan.isComplete ? params.InputProps.endAdornment : <CircularProgress color="inherit" size={20} /> }
                                    
                                    </React.Fragment>
                                ),
                            }} 
                        />}
                    />
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        sx={{mt: 2, borderRadius: 25, width: '100%' }}
                        loading={loading}
                    >
                        Simpan
                    </LoadingButton>
                </>
                }
                {!isComplete && <CircularProgress />}
            </Box>
        </Box>
    );
};


export default FormUserAnda;