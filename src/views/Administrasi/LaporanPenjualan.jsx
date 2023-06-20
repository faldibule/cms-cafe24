import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TableContainer, Table, Paper, TableRow, TableCell, TableHead, TableBody, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Chip, FormControl, InputLabel, Select, MenuItem, TextField, CircularProgress, Pagination, Autocomplete, Stack } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import { blue, green, grey } from '@mui/material/colors'
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { API } from '../../Variable/API'
import moment from 'moment'
import { useRecoilState } from 'recoil';
import { dataPelanggan } from '../../Recoil/PelangganRecoil';
import { dataReport } from '../../Recoil/Report';
import CurrencyFormat from 'react-currency-format';

// const DialogFilter = ({ open, handleClose, onSearch, setSearch, search, onSearchChange }) => {
//     // state
//     const [isComplete, setIsComplete] = useState(false)
//     const [empty, setEmpty] = useState(false)
//     const [keyword, setKeyword] = useState('')

//     // ref
//     const cancelToken = useRef({})
    
//     // recoil
//     const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    
//     const setDataPelanggan = () => {
//         setEmpty(false)
//         axios.get(`${API}user/customer?search=&page=1&status=&limit=`, {
//             headers: {
//                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
//             }
//         })
//         .then(res => {
//             if(res.data.data.length === 0){
//                 setEmpty(true)
//                 setPelanggan({
//                     ...pelanggan,
//                     data: [],
//                     isComplete: true
//                 })
//             }else{
//                 setEmpty(false)
//                 setPelanggan({
//                     page: res.data.data.meta.current_page,
//                     total: res.data.data.meta.last_page,
//                     data: [...res.data.data.data],
//                     isComplete: true
//                 })
//             }
//         })
//         .catch(err => {
//             // err.response && console.log(err.response)
//         })
//     }

//     const liveSearch = async (keyword, status) => {
//         setEmpty(false)
//         if(typeof cancelToken.current.cancel !== 'undefined'){
//             cancelToken.current.cancel("Canceled")
//         }
//         cancelToken.current = axios.CancelToken.source()
//         try {
//             const res = await axios.get(`${API}user/customer?search=${keyword}&page=1&status=${status}&limit=`, {
//                 cancelToken: cancelToken.current.token,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem('authToken')}`
//                 }
//             })
//             if(res.data.data.data.length === 0){
//                 setEmpty(true)
//                 setPelanggan({
//                     ...pelanggan,
//                     isComplete: true
//                 })
//             }else{
//                 setEmpty(false)
//                 setPelanggan({
//                     page: res.data.data.meta.current_page,
//                     total: res.data.data.meta.last_page,
//                     data: [...res.data.data.data],
//                     isComplete: true
//                 })
//             }
//         } catch (error) {
//             // console.log(error)
//         }
        
//     }

//     useEffect(() => {
//         let mounted = true;
//         if(mounted && open){
//             setDataPelanggan()
//         }
//         return () => mounted = false
//     }, [open])


//     return (
//         <Dialog
//             fullWidth={true}
//             open={open}
//             keepMounted
//             onClose={handleClose}
//             aria-describedby="alert-dialog-slide-description"
//         >
//             <DialogTitle>Filter  <Box component="span"> <Chip label="Reset" sx={{ cursor: 'pointer' }} onClick={() => setSearch({
//                     date: [moment(Date.now()).format('YYYY-MM-DD'),  moment().add(1, 'M').format('YYYY-MM-DD')],
//                     limit: '2',
//                     limit_page: '1',
//                     user_id: '',
//                 })} /> </Box> </DialogTitle>
//             <Box component="form" onSubmit={onSearch}>
//                 <DialogContent>

                   

//                     {/* Date */}
//                     <LocalizationProvider dateAdapter={AdapterDateFns}>
//                         <DateRangePicker
//                             inputFormat='dd-MM-yyyy'
//                             mask="__-__-____"
//                             startText="Dari Tanggal ..."
//                             endText="Tanggal ..."
//                             value={search.date}
//                             onChange={(newValue) => {
//                                 const v1 = moment(newValue[0]).format('YYYY-MM-DD')
//                                 const v2 = moment(newValue[1]).format('YYYY-MM-DD')
//                                 setSearch({
//                                     ...search,
//                                     date: [v1, v2]
//                                 })
//                             }}
//                             renderInput={(startProps, endProps) => (
//                                 <React.Fragment>
//                                     <TextField error={false} size="small" fullWidth sx={{ mt: 3 }} {...startProps} />
//                                     <Box sx={{ mx: 2 }}> Sampai </Box>
//                                     <TextField error={false} size="small" fullWidth sx={{ mt: 3 }} {...endProps} />
//                                 </React.Fragment>
//                             )}
//                         />
//                     </LocalizationProvider>

//                     <Autocomplete
//                         sx={{ mt: 2 }}
//                         size='small'
//                         variant="outlined"
//                         value={pelanggan.data.filter(val => val.name === search.user_id)[0]}
//                         onChange={(event, newValue) => {
//                             // select
//                             newValue !== null && setSearch({
//                                 ...search,
//                                 user_id: newValue.id  
//                             })
                            
//                         }}
//                         inputValue={keyword}
//                         loading={pelanggan.isComplete ? false : true}
//                         onInputChange={(event, newInputValue) => {
//                             // ketik
//                             setKeyword(newInputValue)
//                             liveSearch(newInputValue, "active")
//                         }}
//                         id="controllable-states-demo"
//                         options={pelanggan.data}
//                         isOptionEqualToValue={(option, value) => {
//                                 return option.id === value.id
//                             }
//                         }
//                         getOptionLabel={(option) => typeof option.name !== 'undefined' ? option.name : ''}
//                         renderInput={(params) => <TextField 
//                             {...params} 
//                             label="User"
//                             InputProps={{
//                                 ...params.InputProps,
//                                 endAdornment: (
//                                     <React.Fragment>
//                                     {pelanggan.isComplete ? null : <CircularProgress color="inherit" size={20} /> }
//                                     {params.InputProps.endAdornment}
//                                     </React.Fragment>
//                                 ),
//                             }} 
//                         />}
//                     />

                    
//                     <br />
//                     <br />
//                     <br />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button type="submit">Submit</Button>
//                     <Button type="button" onClick={handleClose}>Close</Button>
//                 </DialogActions>
//             </Box>
//         </Dialog>
//     )
// }

const LaporanPenjualan = () => {
    // state
    const [open, setOpen] = useState(false)
    const [empty, setEmpty] = useState(false)
    const [search, setSearch] = useState({
        date: [moment(Date.now()).format('YYYY-MM-DD'),  moment().add(1, 'M').format('YYYY-MM-DD')],
        limit: '5',
        limit_page: '1',
        user_id: '',
    })
    const [dataCetak, setDataCetak] = useState({
        data: [],
        isComplete: false
    })

    const [isComplete, setIsComplete] = useState(false)
    const [empty2, setEmpty2] = useState(false)
    const [keyword, setKeyword] = useState('')

    // ref
    const cancelToken = useRef({})
    
    // recoil
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    
    const setDataPelanggan = () => {
        setEmpty2(false)
        axios.get(`${API}user/customer?search=&page=1&status=&limit=1`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.length === 0){
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

    const liveSearch = async (keyword, status) => {
        setEmpty2(false)
        if(typeof cancelToken.current.cancel !== 'undefined'){
            cancelToken.current.cancel("Canceled")
        }
        cancelToken.current = axios.CancelToken.source()
        try {
            const res = await axios.get(`${API}user/customer?search=${keyword}&page=1&status=${status}&limit=1`, {
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

    useEffect(() => {
        let mounted = true;
        if(mounted){
            setDataPelanggan()
        }
        return () => mounted = false
    }, [])


    // recoil
    const [report, setReport] = useRecoilState(dataReport)

    // export Excel
    function exportTableToExcel(tableID, filename = ''){
        let downloadLink;
        const dataType = 'application/vnd.ms-excel';
        const tableSelect = document.querySelector(tableID);
        const tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
        
        // Specify file name
        filename = filename?filename+'.xls':'excel_data.xls';
        
        // Create download link element
        downloadLink = document.createElement("a");
        
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob){
            var blob = new Blob(['\ufeff', tableHTML], {
                type: dataType
            });
            navigator.msSaveOrOpenBlob( blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
        
            // Setting the file name
            downloadLink.download = filename;
            
            //triggering the function
            downloadLink.click();
        }
    }

    // Sum Function
    const sumOngkir = (order) => {
        const tes = order.map(x => x.shipping_cost - x.shipping_discount)
        const initialValue = 0;
        const sumWithInitial = tes.reduce((previousValue, currentValue) => previousValue + currentValue,
            initialValue);
        return sumWithInitial
    }

    const sumAllJumlah = (order) => {
        const tes = order.map(x => x.transaction_product.length)
        const initialValue = 0;
        const sumWithInitial = tes.reduce((previousValue, currentValue) => previousValue + currentValue,
            initialValue);
        return sumWithInitial
    }

    const sumHarga = (order) => {
        const tes = order.map(x => {
            const temp =  x.transaction_product.map(y => { 
                return (y.price - y.discount_product) * y.quantity
            })
            return temp.reduce((prev, curr) => prev + curr, 0)
        })
        const initialValue = 0;
        const sumWithInitial = tes.reduce((previousValue, currentValue) => previousValue + currentValue,
            initialValue);
        return sumWithInitial
    }

    // // Filter dan data
    // const handleOpen = () => {
    //     setOpen(true);
    // };
    
    // const handleClose = () => {
    //     setOpen(false);
    // };

    const onSearchChange = (e) => {
        setSearch({
            ...search,
            [e.target.name]: e.target.value
        })
    }

    const setDataReport = () => {
        setReport({
            ...report,
            isComplete: false
        })
        setEmpty(false)
        axios.get(`${API}report/sales?user_id=${search.user_id}&limit_page=${search.limit_page}&from_date=${search.date[0] === null ? '' : search.date[0]}&till_date=${search.date[1] === null ? '' : search.date[1]}&limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setReport({
                    ...report,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setReport({
                    ...report,
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

    const setDataReportCetak = () => {
        setDataCetak({
            ...dataCetak,
            isComplete: false
        })
        setEmpty(false)
        axios.get(`${API}report/sales?user_id=${search.user_id}&limit_page=0&from_date=${search.date[0] === null ? '' : search.date[0]}&till_date=${search.date[1] === null ? '' : search.date[1]}&limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setDataCetak({
                    ...dataCetak,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setDataCetak({
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
    }

    const onPageChange = (e, val) => {
        if(report.page !== val){
            setReport({
                ...report,
                isComplete: false
            })
            setEmpty(false)
            axios.get(`${API}report/sales?page=${val}&user_id=${search.user_id}&limit_page=${search.limit_page}&from_date=${search.date[0] === null ? '' : search.date[0]}&till_date=${search.date[1] === null ? '' : search.date[1] }&limit=${search.limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                if(res.data.data.length === 0){
                    setEmpty(true)
                    setReport({
                        ...report,
                        isComplete: true
                    })
                }else{
                    setEmpty(false)
                    setReport({
                        ...report,
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
        // console.log(search)
        // handleClose()
        setDataReport()
        setDataReportCetak()
    }

    useEffect(() => {
        let mounted = true
        if(report.data.length === 0 && mounted){
            setDataReport()
            setDataReportCetak()
        }

        return () => mounted = false


    }, [report.data.length])

    return (
        <div> 
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="h5">
                    Table 
                </Typography>
                {!empty && report.isComplete &&
                    <Box component="span" sx={{ display: 'block' }}> <Chip sx={{ cursor: 'pointer' }} onClick={() => exportTableToExcel("#table", `Laporan_Penjualan(${search.date[0]} s/d ${search.date[1]})`)} label='Export' color="primary" /> </Box>
                }
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }} component="form" onSubmit={onSearch}>
                {/* user */}
                <Autocomplete
                    sx={{ mt: 3, flexGrow: 2 }}
                    size='small'
                    freeSolo={true}
                    variant="outlined"
                    value={
                        pelanggan.data.filter(val => val.id === search.user_id)[0]
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
                    options={[{ id: '', name: 'All' }, ...pelanggan.data]}
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

                {/* Date */}
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateRangePicker
                            inputFormat='dd-MM-yyyy'
                            mask="__-__-____"
                            startText="Dari Tanggal ..."
                            endText="Tanggal ..."
                            value={search.date}
                            onChange={(newValue) => {
                                const v1 = moment(newValue[0]).format('YYYY-MM-DD')
                                const v2 = moment(newValue[1]).format('YYYY-MM-DD')
                                setSearch({
                                    ...search,
                                    date: [v1, v2]
                                })
                            }}
                            renderInput={(startProps, endProps) => (
                                <React.Fragment>
                                    <TextField error={false} size="small" fullWidth sx={{ mt: 3 }} {...startProps} />
                                    <Box sx={{ mx: 2 }}> Sampai </Box>
                                    <TextField error={false} size="small" fullWidth sx={{ mt: 3 }} {...endProps} />
                                </React.Fragment>
                            )}
                        />
                </LocalizationProvider>

                
                <Button type="submit" size='small' variant="outlined" sx={{ mt: 2, flexGrow: 0.2, borderRadius: 25 }}>Submit</Button>

            </Box>
            
            {!empty && report.isComplete && report.data.map((val, i) => {
                    return (
                        <TableContainer key={i} sx={{ mt: 3 }} component={Paper}>
                            <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                <TableHead sx={{ backgroundColor: blue[600] }}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white'  }} align="center" colSpan={2}><b>Nama</b></TableCell>
                                        <TableCell sx={{ color: 'white'  }} colSpan={9}><b>{val.name}</b></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white'  }} align="center" colSpan={2}><b>Periode</b></TableCell>
                                        <TableCell sx={{ color: 'white'  }} colSpan={9}>
                                            <b>{moment(search.date[0]).format("ll")} s/d {moment(search.date[1]).format("ll")}</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableHead sx={{ backgroundColor: green[500]}}>
                                    <TableRow>
                                        <TableCell sx={{ color: 'white'  }}>No</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Tanggal</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">No Order</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Ongkos Kirim</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Ekspedisi</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">No. Resi</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Item</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Harga</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Jumlah</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Diskon</TableCell>
                                        <TableCell sx={{ color: 'white'  }} align="center">Subtotal</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {val.transaction.map((t, i) => {
                                        const diskon =  t.transaction_product[0].discount_product +
                                                        t.transaction_product[0].discount_customer +
                                                        t.transaction_product[0].discount_group
                                        return (
                                            <React.Fragment key={i}>
                                                <TableRow sx={ i % 2 == 0 ? { backgroundColor: grey[200] } : { backgroundColor: grey[300] }}>
                                                    <TableCell rowSpan={t.transaction_product.length} align="center">{i + 1}</TableCell>
                                                    <TableCell rowSpan={t.transaction_product.length} align="center">{moment(t.created_at).format('YYYY-MM-DD')}</TableCell>
                                                    <TableCell rowSpan={t.transaction_product.length} align="center">{t.id}</TableCell>
                                                    <TableCell rowSpan={t.transaction_product.length} align="center">{t.shipping_cost - t.shipping_discount}</TableCell>
                                                    <TableCell rowSpan={t.transaction_product.length} align="center">{t.expedition_service}</TableCell>
                                                    <TableCell rowSpan={t.transaction_product.length} align="center">{t.number_resi === null ? '-' : t.number_resi}</TableCell>

                                                    {/* item 1 */}
                                                    <TableCell align="center">
                                                        {t.transaction_product[0].product_name}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <CurrencyFormat 
                                                            value={t.transaction_product[0].price} 
                                                            displayType={'text'} 
                                                            thousandSeparator={"."}
                                                            decimalSeparator={","} 
                                                            prefix={'Rp.'} 
                                                            renderText={value => 
                                                                <p>{value}</p>
                                                            } 
                                                        /> 
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {t.transaction_product[0].quantity}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <CurrencyFormat 
                                                            value={
                                                                diskon
                                                            }
                                                            displayType={'text'} 
                                                            thousandSeparator={"."}
                                                            decimalSeparator={","} 
                                                            prefix={'Rp.'} 
                                                            renderText={value => 
                                                                <p>{value}</p>
                                                            } 
                                                        /> 
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <CurrencyFormat 
                                                            value={(t.transaction_product[0].price - diskon)*t.transaction_product[0].quantity}
                                                            displayType={'text'} 
                                                            thousandSeparator={"."}
                                                            decimalSeparator={","} 
                                                            prefix={'Rp.'} 
                                                            renderText={value => 
                                                                <p>{value}</p>
                                                            } 
                                                        /> 
                                                    </TableCell>
                                                </TableRow>
                                                {t.transaction_product.map((v, j) => {
                                                    if(j !== 0){
                                                        return (
                                                            <TableRow key={j} sx={ i % 2 == 0 ? { backgroundColor: grey[200] } : { backgroundColor: grey[300] }}>
                                                                <TableCell align="center">{v.product_name}</TableCell>
                                                                <TableCell align="center">
                                                                    <CurrencyFormat 
                                                                        value={v.price}
                                                                        displayType={'text'} 
                                                                        thousandSeparator={"."}
                                                                        decimalSeparator={","} 
                                                                        prefix={'Rp.'} 
                                                                        renderText={value => 
                                                                            <p>{value}</p>
                                                                        } 
                                                                    /> 
                                                                </TableCell>
                                                                <TableCell align="center">{v.quantity}</TableCell>
                                                                <TableCell align="center">
                                                                    <CurrencyFormat 
                                                                        value={v.discount_group + v.discount_customer + v.discount_product}
                                                                        displayType={'text'} 
                                                                        thousandSeparator={"."}
                                                                        decimalSeparator={","} 
                                                                        prefix={'Rp.'} 
                                                                        renderText={value => 
                                                                            <p>{value}</p>
                                                                        } 
                                                                    /> 
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <CurrencyFormat 
                                                                        value={(v.price - (v.discount_group + v.discount_customer + v.discount_product))*v.quantity} 
                                                                        displayType={'text'} 
                                                                        thousandSeparator={"."}
                                                                        decimalSeparator={","} 
                                                                        prefix={'Rp.'} 
                                                                        renderText={value => 
                                                                            <p>{value}</p>
                                                                        } 
                                                                    /> 
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    }
                                                    
                                                })}
                                            </React.Fragment>
                                        )
                                    })}
                                    
                                    
                                    <TableRow sx={{ backgroundColor: blue[100] }}>
                                        <TableCell></TableCell>
                                        <TableCell align="center"> <b>TOTAL</b></TableCell>
                                        <TableCell align="center" ><b>{val.transaction.length}</b> </TableCell>
                                        <TableCell align="center">
                                            <CurrencyFormat 
                                                value={sumOngkir(val.transaction)}
                                                displayType={'text'} 
                                                thousandSeparator={"."}
                                                decimalSeparator={","} 
                                                prefix={'Rp.'} 
                                                renderText={value => 
                                                    <b>{value}</b>
                                                } 
                                            /> 
                                        </TableCell>
                                        <TableCell align="center" colSpan={2}></TableCell>
                                        <TableCell align="center">
                                            <b>{sumAllJumlah(val.transaction)}</b>
                                        </TableCell>
                                        <TableCell align="center" colSpan={3} ></TableCell>
                                        <TableCell colSpan={2}>
                                            <CurrencyFormat 
                                                value={sumHarga(val.transaction)}
                                                displayType={'text'} 
                                                thousandSeparator={"."}
                                                decimalSeparator={","} 
                                                prefix={'Rp.'} 
                                                renderText={value => 
                                                    <b>{value}</b>
                                                } 
                                            /> 
                                        </TableCell>
                                    </TableRow>
                                    <TableRow sx={{ backgroundColor: blue[200] }}>
                                        <TableCell></TableCell>
                                        <TableCell align="center"><b>JUMLAH TAGIHAN</b></TableCell>
                                        <TableCell align="right" colSpan={9}>
                                            <CurrencyFormat 
                                                value={sumOngkir(val.transaction) + sumHarga(val.transaction)}
                                                displayType={'text'} 
                                                thousandSeparator={"."}
                                                decimalSeparator={","} 
                                                prefix={'Rp.'} 
                                                renderText={value => 
                                                    <h2><b>{value}</b></h2>
                                                } 
                                            /> 
                                            
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                })
            }
            
            {!empty && report.isComplete &&
                    <Pagination sx={{ mt: 2, mx: 'auto' }} count={report.total} page={report.page} onChange={onPageChange} color="primary" />
            }
            {!empty && !report.isComplete &&
                <Box component='div' sx={{ mt:2, mx: 'auto' }} >
                    <CircularProgress size={30}/>
                </Box>
            }
            {empty && report.isComplete &&
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                    Kosong
                </Typography>
            </Box>    
            }

            <div style={{ display: 'none', }} id="table">
                {!empty && dataCetak.isComplete && dataCetak.data.map((val, i) => {
                return (
                    <React.Fragment key={i}>
                        <table border='1' aria-label="simple table" style={{ borderCollapse: 'collapse', }}>
                            <thead>
                                <tr>
                                    <td style={{ padding: 5 }} align="center" colSpan={2}><b>Nama</b></td>
                                    <td style={{ padding: 5 }} colSpan={9}><b>{val.name}</b></td>
                                </tr>
                                <tr>
                                    <td style={{ padding: 5 }} align="center" colSpan={2}><b>Periode</b></td>
                                    <td style={{ padding: 5 }} colSpan={9}>
                                        <b>{moment(search.date[0]).format("ll")} s/d {moment(search.date[1]).format("ll")}</b>
                                    </td>
                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <td style={{ padding: 5 }} >No</td>
                                    <td style={{ padding: 5 }} align="center">Tanggal</td>
                                    <td style={{ padding: 5 }} align="center">No Order</td>
                                    <td style={{ padding: 5 }} align="center">Ongkos Kirim</td>
                                    <td style={{ padding: 20 }} align="center">Ekspedisi</td>
                                    <td style={{ padding: 20 }} align="center">No. Resi</td>
                                    <td style={{ padding: 20 }} align="center">Item</td>
                                    <td style={{ padding: 20 }} align="center">Harga</td>
                                    <td style={{ padding: 20 }} align="center">Jumlah</td>
                                    <td style={{ padding: 20 }} align="center">Diskon</td>
                                    <td style={{ padding: 20 }} align="center">Subtotal</td>
                                </tr>
                            </thead>
                            <tbody>
                                {val.transaction.map((t, i) => {
                                    const diskon =  t.transaction_product[0].discount_product +
                                                    t.transaction_product[0].discount_customer +
                                                    t.transaction_product[0].discount_group
                                    return (
                                        <React.Fragment key={i}>
                                            <tr>
                                                <td rowSpan={t.transaction_product.length} align="center">{i + 1}</td>
                                                <td rowSpan={t.transaction_product.length} align="center">{moment(t.created_at).format('YYYY-MM-DD')}</td>
                                                <td rowSpan={t.transaction_product.length} align="center">{t.id}</td>
                                                <td rowSpan={t.transaction_product.length} align="center">{t.shipping_cost - t.shipping_discount}</td>
                                                <td rowSpan={t.transaction_product.length} align="center">{t.expedition_service}</td>
                                                <td rowSpan={t.transaction_product.length} align="center">{t.number_resi === null ? '-' : t.number_resi}</td>

                                                {/* item 1 */}
                                                <td align="center">{t.transaction_product[0].product_name}</td>
                                                <td align="center">{t.transaction_product[0].price}</td>
                                                <td align="center">{t.transaction_product[0].quantity}</td>
                                                <td align="center">{diskon}</td>
                                                <td align="center">{(t.transaction_product[0].price - diskon)*t.transaction_product[0].quantity}</td>
                                            </tr>
                                            {t.transaction_product.map((v, i) => {
                                                if(i !== 0){
                                                    const diskon =  v.discount_product +
                                                                    v.discount_customer +
                                                                    v.discount_group
                                                    return (
                                                        <tr key={i}>
                                                            <td align="center">{v.product_name}</td>
                                                            <td align="center">{v.price}</td>
                                                            <td align="center">{v.quantity}</td>
                                                            <td align="center">{diskon}</td>
                                                            <td align="center">{(v.price - diskon)*v.quantity}</td>
                                                        </tr>
                                                    )
                                                }
                                                
                                            })}
                                        </React.Fragment>
                                    )
                                })}
                                
                                
                                <tr sx={{ backgroundColor: blue[100] }}>
                                    <td></td>
                                    <td align="center"> <b>TOTAL</b></td>
                                    <td align="center" ><b>{val.transaction.length}</b> </td>
                                    <td align="center"><b>{sumOngkir(val.transaction)}</b></td>
                                    <td align="center" colSpan={2}></td>
                                    <td align="center" ><b>{sumAllJumlah(val.transaction)}</b> </td>
                                    <td align="center" colSpan={3} ></td>
                                    <td align="center" colSpan={1} ><b>{sumHarga(val.transaction)}</b> </td>
                                </tr>
                                <tr sx={{ backgroundColor: blue[200] }}>
                                    <td></td>
                                    <td align="center"><b>JUMLAH TAGIHAN</b></td>
                                    <td align="right" colSpan={9}><h2><b>{sumOngkir(val.transaction) + sumHarga(val.transaction)}</b></h2></td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <br />
                    
                    </React.Fragment>
                )
                })}
                {empty && 
                    <table>
                        
                        
                    </table>
                }
            </div>
            {/* <DialogFilter 
                open={open}
                handleClose={handleClose}
                onSearch={onSearch}
                setSearch={setSearch}
                search={search}
                onSearchChange={onSearchChange}

            />  */}
            </Box>
        </div>
    );
};

export default LaporanPenjualan;