import React, { useEffect, useState, useRef } from 'react';
import { Box, Badge, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, CircularProgress, Grid, Card, CardContent, CardActions, IconButton, Collapse, Stack, CardHeader, Divider, Chip, List, ListItem, ListItemText, ListItemAvatar, Avatar, TextField, FormGroup, FormControlLabel, Switch, Stepper, StepLabel, StepContent, Step, FormControl, InputLabel, MenuItem, Select, Pagination, Autocomplete  } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import { blue, green, yellow, grey } from '@mui/material/colors'
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import InfoIcon from '@mui/icons-material/Info';
import CircleIcon from '@mui/icons-material/Circle';
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert';
import AlertSuccess from '../../components/Utils/AlertSuccess';
import axios from 'axios'
import { API } from '../../Variable/API'
import { dataOrder, dataNotif } from '../../Recoil/Order';
import CurrencyFormat from 'react-currency-format';
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

// collapse icon
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import NoteIcon from '@mui/icons-material/Note';
import { dataPelanggan } from '../../Recoil/PelangganRecoil';
import jsPDF from 'jspdf';
import { formatRelativeWithOptions } from 'date-fns/esm/fp';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const statusSelect = ["pending", "paid_off", "expired", "sent", "canceled", "finish"]

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

const DetailResi = ({ open, handleClose, courier, noResi }) => {
    const [data, setData] = useState({})
    const [show, setShow] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    

    const getDetailResi = async () => {
        setIsComplete(false)
        const formData = new FormData()
        formData.append('waybill', noResi)
        formData.append('courier', courier)
        const res = await axios.post(`${API}shipping/waybill`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        if(typeof res.data.rajaongkir.result !== 'undefined'){
            setData(res.data.rajaongkir)
        }else{
            setData({
                result: null
            })
        }
        setIsComplete(true)
    }

    useEffect(() => {
        let mounted = true
        if(mounted && open){
            getDetailResi().catch(err => {
                if(err.response){
                }
            })
        }

        return () => mounted = false

    }, [open])

    return (
        <Dialog
            fullWidth={true}
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                <Chip sx={{ fontSize: '1.2rem' }} label={'Detail Resi'} color="success" />
            </DialogTitle>
            {isComplete && data.result !== null &&
            <DialogContent>
                <Stack spacing={2}>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Nomor Resi
                        </DialogContentText>
                        <Typography>
                            {data.query.waybill} <br />
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Tanggal Resi 
                        </DialogContentText>
                        <Typography>
                            {moment(`${data.result.details.waybill_date}`).format('ll')}. Pukul {data.result.details.waybill_time} 
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Ekspedisi
                        </DialogContentText>
                        <Typography>
                            {data.query.courier} 
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Dikirim dari
                        </DialogContentText>
                        <Typography>
                            {data.result.details.origin} 
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Alamat Penerima
                        </DialogContentText>
                        <Typography>
                            {data.result.details.receiver_name} <br />
                            {data.result.details.destination}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Status
                        </DialogContentText>
                        <Typography>
                        <Chip label={data.result.delivery_status.status} color="primary" />
                        </Typography>
                    </Stack>
                </Stack>
                
                {!show ?
                <Stack direction="row" spacing={3}>
                    <Box sx={{ minWidth: '25%' }}>
                        <Chip sx={{ my: 2 }} onClick={() => setShow(true)} label='Lacak Barang' />
                    </Box>
                </Stack> 
                :
                <Stack direction="row" spacing={3}>
                    <Box sx={{ minWidth: '25%' }}>
                        <Chip sx={{ my: 2 }} onClick={() => setShow(false)} label='Tutup' />
                    </Box>
                </Stack> 
                }
                
                {show &&
                <>
                    <DialogContentText>
                        Manifest Barang
                    </DialogContentText> 
                    <Stepper orientation="vertical" activeStep={data.result.manifest.length}>
                        {data.result.manifest.map((val, i) => (
                            <Step key={`${val.manifest_code}-${i}`}>
                                <StepLabel 
                                    StepIconComponent={ 
                                        data.result.manifest.length - 1 === i ? () => <CircleIcon sx={{ color: green[500] }} /> : () => <CircleIcon sx={{ color: grey[500] }} /> 
                                    }
                                    sx={data.result.manifest.length - 1 === i ? { color: 'black' } : { color: grey[800] } }
                                >
                                    {val.manifest_description} <br />
                                    <i>
                                    Pukul {val.manifest_time} {moment(`${val.manifest_date}`).format('ll')}
                                    </i>
                                    
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                
                </>
                }
            </DialogContent>
            }
            {isComplete && data.result === null &&
            <DialogContent>
                <Stack spacing={1}>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Nomor Resi
                        </DialogContentText>
                        <Typography>
                            {noResi} 
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={3}>
                        <DialogContentText sx={{ minWidth: '25%' }}>
                            Ekspedisi
                        </DialogContentText>
                        <Typography>
                            {courier} 
                        </Typography>
                    </Stack>
                </Stack>
                <DialogContentText sx={{ mt: 2 }}>
                    <b><i>Resi Tidak Ditemukan</i></b>
                </DialogContentText>
            </DialogContent>
            }
            {!isComplete &&
            <DialogContent>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={30} />
                </Box>
            </DialogContent>
            }
        </Dialog>
    )
}

const SuratJalan = ({ data, isClick, setIsClick }) => {

    const generatePDF = () => {
        const report = new jsPDF('portrait','pt','a4');
        report.html(document.querySelector('#cetak')).then(() => {
            report.save('surat_jalan.pdf');
        });
    }

    return (
        <Dialog open={isClick} onClose={() => setIsClick(false)}>
            <Chip color="primary" onClick={generatePDF} label="Export" sx={{ cursor: 'pointer', m: 2, p: 2 }} />
            <div id="cetak">
                <div style={{ display: 'flex', flexDirection: 'column', alignItem: 'center', padding: 15 }}>
                    <div>
                        <h1>Surat Jalan</h1>
                        <b>{moment(Date.now()).format('YYYY/MM/DD HH:mm')}</b>
                    </div>
                    <div>
                        <table border="1" style={{ borderCollapse: 'collapse' }}>
                            <tr>
                                <th style={{ padding: 5 }}>Pengirim</th>
                                <th style={{ padding: 5 }}>Penerima</th>
                            </tr>
                            <tr>
                                <td style={{ padding: 5 }}>
                                    {data.user.name} <br />
                                    +62-{data.user.phone_number} <br />
                                    Order #{data.id}
                                </td>
                                <td style={{ padding: 5 }}>
                                    {data.address} <br />
                                    <br /><br /><br /><br />
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: 5 }}>Ekspedisi : {data.expedition_service}</td>
                                <td style={{ padding: 5 }}>Catatan : </td>
                            </tr>

                        </table>
                    </div>
                    <div>
                        <h2>Delivery Note #{data.id}</h2>
                        <p>Order Date: {moment(data.created_at).format('ll')}</p>
                    </div>
                    <div>
                        <p>Detail Barang</p>
                        <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <tr>
                                <th style={{ padding: 5 }}>Produk</th>
                                <th style={{ padding: 5 }}>Jumlah</th>
                            </tr>
                            {data.transaction_product.map((val, i) => (
                                <tr key={i}>
                                    <td style={{ padding: 5 }}>
                                        <p><b>{val.product_name}</b> <br/>{val.notes} </p>
                                    </td>
                                    <td style={{ padding: 5 }} align="center"><b>{val.quantity}</b></td>
                                </tr>
                            ))}
                        </table>
                    </div>

                </div>
            </div>
        </Dialog>
    )
}

const CollapseComponent = ({id, expanded}) => {

    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [data, setData] = useState({})
    const [open, setOpen] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [isClick, setIsClick] = useState(false)

    // Recoil
    const [alert, setAlert] = useRecoilState(alertState)
    const [order, setOrder] = useRecoilState(dataOrder)


    const setDetail = async () => {
        setIsComplete(false)
        const res = await axios.get(`${API}transaction/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        setData(res.data.data)
        setIsComplete(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const triggerPreorder = (id) => {
        const triggerAsync = async (id) => {
            try{
                const res = await axios.patch(`${API}transaction/payment/second_payment_po/${id}`, {}, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })
                setLoading(false)
                setAlert({
                    message: 'Berhasil Mengirim Notifikasi',
                    display: true
                })
                setTimeout(() => {
                    setAlert({
                        message: '',
                        display: false
                    })
                }, 3000)
                setOrder({
                    ...order,
                    data: []
                })
            }catch(e){
            }
        }

        confirmAlert({
            title: 'Kirim notifikasi untuk melakukan pembayaran ke 2',
            message: 'Yakin Ingin Melakukan Ini ?',
            buttons: [
              {
                label: 'Ya',
                onClick: () => {
                    setLoading(true)
                    triggerAsync(id)
                   
                }
              },
              {
                label: 'Tidak',
                onClick: () => 'd'
              }
            ]
          });
    }

    useEffect(() => {
        let mounted = true
        if(mounted && expanded){
            setDetail()
                .catch(err => {
                    if(err.response){
                    }
                })
        }

        return () => mounted = false


    }, [expanded])

    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            {isComplete && 
            <CardContent>
                <SuratJalan setIsClick={setIsClick} isClick={isClick} data={data} />
                <Typography variant="body1" sx={{ mr: 1, mb: 2 }}><i>Detail Order</i></Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center' }} divider={<Divider orientation="vertical" flexItem sx={{ backgroundColor: 'blue' }} />}>

                    {/* product */}
                    <Box component="div" sx={{ minWidth: '50%' }}>
                        {data.transaction_product.map((val, i) => (
                            <Grid key={i} container sx={{ justifyContent: 'center', mt: 3 }} spacing={1}>
                                <Grid item md={4} xs={6}>
                                    <img src={val.image} alt="tes" style={{ width: '100%' }} />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <Typography sx={{ textAlign: { xs: 'center', md: 'left' } }} variant="body1">
                                       <b>{val.product_name}</b>
                                    </Typography>
                                    <CurrencyFormat 
                                        value={val.price}
                                        displayType={'text'} 
                                        thousandSeparator={"."}
                                        decimalSeparator={","} 
                                        prefix={'Rp.'} 
                                        renderText={value => 
                                            <Typography variant="span" disabled sx={{ display: 'block', color: grey[400], fontSize: '0.8em', textAlign: { xs: 'center', md: 'left' } }}>
                                                {val.quantity} barang x {value}
                                            </Typography> 
                                        } 
                                    />
                                    <Typography variant="subtitle2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                       Note : <br /> <i>{val.notes}</i> 
                                    </Typography>

                                    <Box sx={{ mt: 3 }}>
                                        
                                    {/* Discount product */}
                                    <CurrencyFormat 
                                        value={val.discount_product}
                                        displayType={'text'} 
                                        thousandSeparator={"."}
                                        decimalSeparator={","} 
                                        prefix={'Rp.'} 
                                        renderText={value => 
                                            <Typography variant="subtitle2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                                Discount Product : <b>{value}</b> 
                                            </Typography>
                                        } 
                                    />
                                    {/* Discount Group */}
                                    <CurrencyFormat 
                                        value={val.discount_group}
                                        displayType={'text'} 
                                        thousandSeparator={"."}
                                        decimalSeparator={","} 
                                        prefix={'Rp.'} 
                                        renderText={value => 
                                            <Typography variant="subtitle2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                                Discount Group : <b>{value}</b> 
                                            </Typography>
                                        } 
                                    />
                                    {/* Discount customer */}
                                    <CurrencyFormat 
                                        value={val.discount_customer}
                                        displayType={'text'} 
                                        thousandSeparator={"."}
                                        decimalSeparator={","} 
                                        prefix={'Rp.'} 
                                        renderText={value => 
                                            <Typography variant="subtitle2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                                Discount Customer : <b>{value}</b> 
                                            </Typography>
                                        } 
                                    />
                                    </Box>
                                    <Typography sx={{ mt: 2, textAlign: { xs: 'center', md: 'left' } }} variant="subtitle2">
                                       Sub Total
                                    </Typography>
                                    <CurrencyFormat 
                                        value={(val.price - val.discount_product - val.discount_group - val.discount_customer) * val.quantity}
                                        displayType={'text'} 
                                        thousandSeparator={"."}
                                        decimalSeparator={","} 
                                        prefix={'Rp.'} 
                                        renderText={value => 
                                            <Typography sx={{ textAlign: { xs: 'center', md: 'left' } }} variant="body1">
                                                <b>{value}</b> 
                                            </Typography>
                                        } 
                                    />
                                    
                                </Grid>

                            </Grid>
                        ))}
                        <Divider sx={{ width: '100%', mt: 3 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'row', mt: 1, gap: 2 }}>
                            <Typography variant="p" sx={{ textAlign: 'center', fontSize: '1rem' }}>
                                Total Harga
                            </Typography>
                            <CurrencyFormat 
                                value={data.payment_method === 'po' ? data.payment[0].total + data.payment[1].total : data.payment[0].total}
                                displayType={'text'} 
                                thousandSeparator={"."}
                                decimalSeparator={","} 
                                prefix={'Rp.'} 
                                renderText={value => 
                                    <Typography variant="p" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
                                        <b>{value}</b>
                                    </Typography>
                                } 
                            />
                        </Box>

                    </Box>
                    
                    {/* List */}
                    <List sx={{ width: '100%' }}>
                        <Typography sx={{ ml: 2 }}>
                            Payment
                        </Typography>
                        {/* Status Payment */}
                        {data.payment.map((val, i) => {
                            let color = ''
                            let label = ''
                            // pending,process,paid_off,expired,canceled
                            if(val.status === 'process'){
                                color = 'warning'
                                label = 'Process'
                            }else if(val.status === 'pending'){
                                color = 'warning'
                                label = 'Pending'
                            }else if(val.status === 'paid_off'){
                                color = 'success'
                                label = 'Paid Off'
                            }else if(val.status === 'expired'){
                                color = 'error'
                                label = 'Expired'
                            }else if(val.status === 'canceled'){
                                color = 'error'
                                label = 'Canceled'
                            }
                            return (
                            <React.Fragment key={i}>
                                <ListItem 
                                    
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ backgroundColor: grey[200] }}>
                                            <DescriptionIcon sx={{ color: blue[500] }} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`Pembayaran ke ${i + 1}`}
                                        secondary={val.paid_off_time !== null && val.status === 'paid_off' && `Dibayarkan Tanggal ${moment(val.paid_off_time).format('ll')} Pukul ${moment(val.paid_off_time).format('HH:mm:ss')}`}
                                    />
                                    {i === 1 && val.status === 'pending' && 
                                        <Chip 
                                            deleteIcon={loading ? 
                                                <CircularProgress size={15} color={'primary'} /> 
                                                : 
                                                <CircleNotificationsIcon />
                                            } 
                                            label={'Kirim Notifikasi'} 
                                            onClick={() => triggerPreorder(val.id)} 
                                            sx={{ ml: 1, mr: 2, cursor: 'pointer' }} />
                                    }
                                    <Chip label={label} color={color} />
                                    {data.status === 'expired' &&
                                        <Chip label={'Edit'} onClick={() => navigate(`/order/edit_payment/${val.id}`)} sx={{ ml: 2, cursor: 'pointer' }} />
                                    }
                                </ListItem>
                            </React.Fragment>
                            )
                        })}

                        {/* List Item */}
                        <ListItem sx={{ cursor: 'pointer' }}>
                            <IconButton onClick={() => setIsClick(true)}>
                                <Chip label='Cetak Surat Jalan' sx={{ cursor: 'pointer' }} />
                            </IconButton>
                        </ListItem>

                        <Typography sx={{ ml: 2 }}>
                            Detail
                        </Typography>
                        {/* Nomor Resi */}
                        {data.number_resi !== null &&
                        <ListItem 
                            alignItems="flex-start"
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: grey[200] }}>
                                    <DescriptionIcon sx={{ color: blue[500] }} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Nomor Resi"
                                secondary={data.number_resi}
                            />
                            <IconButton edge="start" aria-label="delete" onClick={handleOpen}>
                                <InfoIcon sx={{ color: yellow[800] }} /> <Box component="span" sx={{ fontSize: '1.1rem', ml: 2 }}>Detail Resi</Box>
                            </IconButton>
                        </ListItem>
                        
                        }
                        {/* Alamat */}
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: grey[200] }}>
                                    <HomeIcon sx={{ color: blue[500] }} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Address"
                                secondary={data.address} 
                            />
                        </ListItem>
                        {/* ekspedisi */}
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: grey[200] }}>
                                    <LocalShippingIcon sx={{ color: blue[500] }} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Ekspedisi"
                                secondary={data.expedition_service}
                            />
                        </ListItem>
                        {/* Payment method */}
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{ backgroundColor: grey[200] }}>
                                    <PaymentIcon sx={{ color: blue[500] }} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Metode Pembayaran"
                                secondary={
                                    <>
                                        <Box component="span"
                                            sx={{ display: 'inline' }}
                                        >
                                            {data.payment_method === "transfer" && `${data.payment_method} ke Bank ${data.bank_name.toUpperCase()}`}
                                            {data.payment_method === "cod" && `Cash On Delivery`}
                                            {data.payment_method === "po" && `Pre-Order`}
                                        </Box>
                                    
                                    </>
                                }
                            />
                        </ListItem>

                    </List>

                </Stack>
                
            </CardContent>
            }
            {!isComplete &&
            <CardContent>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress size={30} />
                </Box>
            </CardContent>
            }
            {data.number_resi !== null &&
            <DetailResi 
                open={open}  
                handleClose={handleClose}
                courier={data.expedition}
                noResi={data.number_resi}
            />
            }
            
        </Collapse>
    )
}

const CardComponent = ({val}) => {
    const navigate = useNavigate()

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ width: '100%', border: 1, borderColor: 'primary.main', m: 2, borderRadius: 5 }}>
            <CardHeader 
                subheader={
                    <Stack direction="row" spacing={2}>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                            <i>INV/{val.invoice_number}</i>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                            <i>{moment(val.created_at.split(' ')[0]).format('ll')}</i>
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>
                            {val.status === 'pending' && <Chip label={'Pending'} color="warning" />}
                            {val.status === 'expired' && <Chip label={"Expired"} color="error" />}
                            {val.status === 'paid_off' && <Chip label={"Paid Off"} color="success" />}
                            {val.status === 'sent' && <Chip label={'Sent'} color="secondary" />}
                            {val.status === 'canceled' && <Chip label={"Canceled"} color="error" />}
                            {val.status === 'finish' && <Chip label={"Finish"} color="primary" />}
                        </Typography>
                    </Stack>
                }
            />
            <Divider />
            <CardContent>
                <Stack direction='row' spacing={2} alignItems="center" justifyContent="space-evenly" >
                    <img src={val.transaction_product.image} alt="tes" style={{ height: '14vh' }} />
                    <Box>
                        <Typography variant="p" sx={{ textAlign: 'center', fontSize: '1rem' }}>
                            <b>{val.transaction_product.product_name}</b>
                        </Typography>
                        <CurrencyFormat 
                                value={val.transaction_product.price}
                                displayType={'text'} 
                                thousandSeparator={"."}
                                decimalSeparator={","} 
                                prefix={'Rp.'} 
                                renderText={value => 
                                    <Typography variant="p" disabled sx={{ display: 'block', textAlign: 'center', color: grey[400], fontSize: '0.8rem' }}>
                                        {val.transaction_product.quantity} barang x {value}
                                    </Typography>
                                } 
                            /> 
                    </Box>
                    <Divider sx={{ height: '50px' }} orientation="vertical" light={true} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="p" sx={{ textAlign: 'center', fontSize: '0.8rem' }}>
                            <i>Order By</i>
                        </Typography>
                        <Typography variant="p" sx={{ textAlign: 'center', fontSize: '1.1rem' }}>
                            <b>{val.user.name}</b>
                        </Typography>
                    </Box>
                    

                </Stack>
            </CardContent>
            <Divider />
            <CardActions>
                {val.other_product !== 0 &&
                <IconButton sx={{ mr: 'auto'}}>
                    <Chip onClick={handleExpandClick} variant="outlined" color="primary" label={`+${val.other_product} produk lainnya`} />
                </IconButton>
                }
                <IconButton onClick={() => navigate(`/order/edit_resi/${val.id}`)} sx={{ marginLeft: 'auto'}}>
                    <Chip label='Update Resi' />
                </IconButton>
                {val.status !== "pending" &&
                <IconButton aria-label="Edit" onClick={() => navigate(`/order/edit_status/${val.id}`)}>
                    <Chip label='Update Status Order' />
                </IconButton>
                }
                
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <CollapseComponent expanded={expanded} id={val.id} />
        </Card>
    )
}

const Order = () => {

    // state
    const [open, setOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState('none')
    const [empty, setEmpty] = useState(false)
    const [search, setSearch] = useState({
        date: [null, null],
        limit: '5',
        limit_page: '1',
        user_id: '',
        status: '',
        invoice_number: '',
    })
    const [keyword, setKeyword] = useState('')
    const [isComplete, setIsComplete] = useState(false)
    
    // recoil
    const [notif, setNotifData] = useRecoilState(dataNotif)
    const [pelanggan, setPelanggan] = useRecoilState(dataPelanggan)
    const [alert, setAlert] = useRecoilState(alertState)
    const [order, setOrder] = useRecoilState(dataOrder)
    
    // reff
    const number = useRef()
    number.current = 0
    const cancelToken = useRef({})

    


    // User Live Search
    const setDataPelanggan = () => {
        setEmpty(false)
        axios.get(`${API}user/customer?search=&page=1&status=&limit=`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.length === 0){
                setEmpty(true)
                setPelanggan({
                    ...pelanggan,
                    data: [],
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setPelanggan({
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

    useEffect(() => {
        let mounted = true;
        if(mounted && open){
            setDataPelanggan()
        }
        return () => mounted = false
    }, [open])

    const liveSearch = async (keyword, status) => {
        setEmpty(false)
        if(typeof cancelToken.current.cancel !== 'undefined'){
            cancelToken.current.cancel("Canceled")
        }
        cancelToken.current = axios.CancelToken.source()
        try {
            const res = await axios.get(`${API}user/customer?search=${keyword}&page=1&status=${status}&limit=`, {
                cancelToken: cancelToken.current.token,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setPelanggan({
                    ...pelanggan,
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setPelanggan({
                    page: res.data.data.meta.current_page,
                    total: res.data.data.meta.last_page,
                    data: [...res.data.data.data],
                    isComplete: true
                })
            }
        } catch (error) {
        }
        
    }

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

    // Order
    const setAllOrder = () => {
        setOrder({
            ...order,
            data: [],
            isComplete: false
        })
        setEmpty(false)
        
        axios.get(`${API}transaction/fetch?user_id=${search.user_id}&status=${search.status}&invoice_number=${search.invoice_number}&limit_page=${search.limit_page}&from_date=${search.date[0] === null ? '' : search.date[0]}&till_date=${search.date[1] === null ? '' : search.date[1] }&limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setOrder({
                    ...order,
                    data: [],
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setOrder({
                    ...order,
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

    //notification
    const setNotif = async () => {
        const res = await axios.get(`${API}transaction/notification`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        setNotifData(res.data.data)
    }

    const onPageChange = (e, val) => {
        if(order.page !== val){
            setOrder({
                ...order,
                isComplete: false
            })
            axios.get(`${API}transaction/fetch?page=${val}&user_id=${search.user_id}&status=${search.status}&invoice_number=${search.invoice_number}&limit_page=${search.limit_page}&from_date=${search.date[0] === null ? '' : search.date[0]}&till_date=${search.date[1] === null ? '' : search.date[1] }&limit=${search.limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(res => {
                if(res.data.data.data.length === 0){
                    setEmpty(true)
                }else{
                    setEmpty(false)
                    setOrder({
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
        handleClose()
        setAllOrder()
    }

    const onNotifClicked = (status) => {
        setOrder({
            ...order,
            isComplete: false
        })
        setEmpty(false)
        
        axios.get(`${API}transaction/fetch?
            user_id=&
            status=${status}&
            invoice_number=&
            limit_page=${search.limit_page}&
            from_date=${search.date[0] === null ? '' : search.date[0]}&
            till_date=${search.date[1] === null ? '' : search.date[1]}&
            limit=${search.limit}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            if(res.data.data.data.length === 0){
                setEmpty(true)
                setOrder({
                    ...order,
                    data: [],
                    isComplete: true
                })
            }else{
                setEmpty(false)
                setOrder({
                    ...order,
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

    useEffect(() => {
        let mounted = true
        if(order.data.length === 0 && mounted && !empty){
            setAllOrder()
        }

        return () => mounted = false


    }, [order.data.length])

    

    return (
        <div>
            <Box component="div" sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button onClick={handleClickOpen} size='small' sx={{ ml: 2, my: 2, p:1, maxWidth: 300, borderRadius: 25 }} variant="contained">
                    <FilterAltIcon  /> Filter
                </Button>
                {JSON.stringify(notif) !== '{}' &&
                <>
                    <Badge onClick={() => onNotifClicked('pending')} sx={{ ml: 'auto',  }} badgeContent={notif.pending} color="primary">
                        <Chip sx={{ cursor: 'pointer' }} label="Menunggu Pembayaran" color="warning" />
                    </Badge>
                    <Badge onClick={() => onNotifClicked('paid_off')} sx={{ mx: 2 }} badgeContent={notif.paid_off} color="primary">
                        <Chip sx={{ cursor: 'pointer' }} label="Menunggu Konfirmasi" color="success" />
                    </Badge>
                    <Badge onClick={() => onNotifClicked('sent')} badgeContent={notif.sent} color="primary">
                        <Chip sx={{ cursor: 'pointer' }} label="Sedang Dikirim" color="secondary" />
                    </Badge>
                </> 
                }
            </Box>
            
            <Box component='div' sx={{ mt: 1, display: deleteLoading  }} >
                <CircularProgress size={30}/>
            </Box>
            <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />

            {/* Card */}
            <Grid container spacing={2}>
                {order.data.length !== 0 && order.isComplete &&
                    order.data.map((val, i) => (
                        <Grid key={val.id} item xs={12} md={12} lg={12}>
                            <CardComponent val={val}  />
                        </Grid>
                    ))
                }
                
            </Grid>



            {!empty && !order.isComplete &&
                <Box component='div' sx={{ mt:2, mx: 'auto' }} >
                    <CircularProgress size={30}/>
                </Box>
            }
            
            {order.data.length !== 0 && order.isComplete &&
                <Pagination sx={{ mt: 2, mx: 'auto' }} count={order.total} page={order.page} onChange={onPageChange} color="primary" />
            }
            
            {empty && order.isComplete &&
            <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography>
                    Order Kosong
                </Typography>
            </Box>    
            }

            </Box>


            {/* Dialog */}
            <Dialog
                fullWidth={true}
                open={open}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Filter"} <Box component="span"> <Chip label="Reset" sx={{ cursor: 'pointer' }} onClick={() => setSearch({
                    date: [null, null],
                    limit: '5',
                    limit_page: '1',
                    user_id: '',
                    status: '',
                    invoice_number: '',
                })} /> </Box> </DialogTitle>
                <Box component="form" onSubmit={onSearch}>
                    <DialogContent>

                        {/* Nomor Invoice */}
                        <TextField
                            sx={{ my: 1 }}
                            variant="outlined"
                            size='small'
                            fullWidth
                            label={`Nomor Invoice`}
                            name='invoice_number'
                            onChange={onSearchChange}
                            value={search.invoice_number}
                        />
                        {/* User */}
                        {open &&
                        <Autocomplete
                            sx={{ mt: 2 }}
                            size='small'
                            variant="outlined"
                            freeSolo={true}
                            value={pelanggan.data.filter(val => val.id === search.user_id)[0]}
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
                                        {pelanggan.isComplete ? null : <CircularProgress color="inherit" size={20} /> }
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                }} 
                            />}
                        />
                        }

                        {/* Status */}
                        <FormControl variant="standard" fullWidth sx={{ mr: 2, mt: 2 }}>
                            <InputLabel id={`id-status`}>
                                Status Pembayaran
                            </InputLabel>
                            <Select
                                size='small'
                                value={search.status}
                                name={'status'} 
                                labelId={`id-status`}
                                onChange={onSearchChange}
                            >
                                <MenuItem value={''}>
                                    All
                                </MenuItem>
                                {statusSelect.map((select, i) => (
                                    <MenuItem key={i} value={select}>
                                            {select === 'pending' && 'Pending'}
                                            {select === 'paid_off' && 'Paid Off'}
                                            {select === 'expired' && 'Expired'}
                                            {select === 'sent' && 'Sent'}
                                            {select === 'canceled' && 'Canceled'}
                                            {select === 'finish' && 'Finish'}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateRangePicker
                                inputFormat='dd-MM-yyyy'
                                mask="__-__-____"
                                startText="Dari Tanggal ..."
                                endText="Tanggal ..."
                                value={search.date}
                                onChange={(newValue) => {
                                    const v1 = moment(newValue[0]).format('YYYY/MM/DD')
                                    const v2 = moment(newValue[1]).format('YYYY/MM/DD')
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

export default Order;