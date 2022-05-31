import React, { useState, useEffect } from 'react'
import { Box, Typography, ListItem, List, ListItemIcon, ListItemText, Divider, Chip, Dialog, DialogContent, DialogActions, DialogTitle, TextField, Button, CircularProgress, Grid } from '@mui/material'
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import { useRecoilState } from 'recoil'
import { alertState } from '../../Recoil/Alert'
import AlertSuccess from '../../components/Utils/AlertSuccess'
import { Bar } from 'react-chartjs-2';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NoteIcon from '@mui/icons-material/Note';
import CancelIcon from '@mui/icons-material/Cancel';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios'
import { API } from '../../Variable/API'
import moment from 'moment'

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const month = ['Januari', 'February', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

const DialogFilter = ({ open, handleClose, setSearch, search, onSearch }) => {

    return (
        <Dialog
            fullWidth={true}
            open={open}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>{"Filter"}</DialogTitle>
            <Box component="form" onSubmit={onSearch}>
                <DialogContent>

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
                    <br />
                    <br />
                    <br />
                    <br />
                    
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Submit</Button>
                    <Button type="button" onClick={handleClose}>Close</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

function Dashboard() {
    // Recoil
    const [alert, setAlert] = useRecoilState(alertState)

    // State
    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const [label, setLabel] = useState([])
    const [value, setValue] = useState([])
    const [dataMonth, setDataMonth] = useState([])
    const [dataYear, setDataYear] = useState([])
    const [isComplete, setIsComplete] = useState(false)
    const [search, setSearch] = useState({
        date: [moment(Date.now()).format('YYYY-MM-DD'),  moment().add(1, 'M').format('YYYY-MM-DD')]
    })

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const onSearch = () => {
        getData()
        handleClose()
    }

    const settingLabel = (res) => {
        let label = []
        let value = []
        res.data.data.map(val => {
            Object.keys(val).map(key => {
                if(key !== 'total'){
                    label.push(key)
                    value.push(val[`${key}`])
                }
            })
        })
        setLabel([...label])
        setValue([...value])
    }

    const getData = async () => {
        setIsComplete(false)
        const res = await axios.get(`${API}report/activity_transaction?from_date=${search.date[0]}&until_date=${search.date[1]}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        settingLabel(res)
        setData([...res.data.data])
        setIsComplete(true)
    }

    const settingData = (res) => {
        let data = []
        res.data.data.map(val => {
            data.push({
                x: val.name,
                y: val.total
            })
        })
        return data
    }

    const getDataMonth = async () => {
        const res = await axios.get(`${API}report/turnover?from_date=${search.date[0]}&until_date=${search.date[1]}&type=month`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        setDataMonth([...settingData(res)])
        
    }

    const getDataYear = async () => {
        const res = await axios.get(`${API}report/turnover?from_date=${search.date[0]}&until_date=${search.date[1]}&type=year`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        setDataYear([...settingData(res)])
    }

    useEffect(() => {
        let mounted = true

        if(mounted && !isComplete){
            getData().catch(err => {
                // console.log(err)
                if(err.response){
                    // console.log(err.response)
                }
            })
            getDataMonth()
            getDataYear()
        }

        return () => mounted = false
    }, [isComplete])

    

    return (
        <Box component="div" sx={{ 
            
         }}>
            
            <AlertSuccess message={alert.message} onTutup={()=> setAlert({message: '', display: false})} display={alert.display} />
            
            {isComplete &&
            <>
                <Grid sx={{ justifyContent: 'start' }} container spacing={4}>
                    <Grid item md={4} xs={12} lg={4}>
                        <Typography variant="h6">
                            Aktifitas Bulan Ini <Box component="span"> <Chip label="Filter" color="primary" sx={{ cursor: 'pointer' }} onClick={handleOpen} /> </Box>
                        </Typography>
                        <List sx={{ maxWidth: 330 }}>
                            {data.map((val, i) => {
                                return Object.keys(val).map(key => (
                                    <Box key={key}>
                                        <ListItem 
                                            secondaryAction={
                                                <Typography edge='end' variant="span">
                                                    {val[`${key}`]}
                                                </Typography>
                                            }
                                            sx={{  
                                                border: '1px solid grey',
                                                width: 330
                                            }}>
                                            {/* <ListItemIcon>
                                                {val.icon}
                                            </ListItemIcon> */}
                                            {key === 'pending' &&
                                            <>
                                                <ListItemIcon>
                                                    <NoteIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Pending'}
                                                />
                                            </>
                                            }
                                            {key === 'expired' && 
                                            <>
                                                <ListItemIcon>
                                                    <CancelIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Expired'}
                                                />
                                            </>
                                            }
                                            {key === 'canceled' && 
                                            <>
                                                <ListItemIcon>
                                                    <CancelIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Canceled'}
                                                />
                                            </>
                                            }
                                            {key === 'paid_off' && 
                                            <>
                                                <ListItemIcon>
                                                    <DoneAllIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Paid Off'}
                                                />
                                            </>
                                            }
                                            {key === 'sent' && 
                                            <>
                                                <ListItemIcon>
                                                    <DoneAllIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Sent'}
                                                />
                                            </>
                                            }
                                            {key === 'finish' && 
                                            <>
                                                <ListItemIcon>
                                                    <DoneAllIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Finish'}
                                                />
                                            </>
                                            }
                                            {key === 'total' && 
                                            <>
                                                <ListItemIcon>
                                                    <DoneAllIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={'Total'}
                                                />
                                            </>
                                            }
                                            
                                        </ListItem>
                                        <Divider variant="inset" />
                                    </Box>
                                ))
                            })}
                            
                        </List>
                    </Grid>
                    <Grid sx={{ ml: 2 }} item md={3} xs={12} lg={6}>
                        <Doughnut 
                            data={{
                                labels: label,
                                datasets: [
                                {
                                    label: 'Laporan Order',
                                    data: value,
                                    backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    ],
                                    borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    ],
                                    borderWidth: 1,
                                },
                                ],
                            }}

                            height={300}
                            width={600}
                            options={{
                                maintainAspectRatio: false
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid sx={{ justifyContent: 'center' }} container spacing={4}>
                    <Grid item md={3} xs={12} lg={6}>
                        <Bar 
                            data={{
                                labels: [],
                                datasets: [{
                                    label: 'Sebulan Terakhir',
                                    data: dataMonth
                                }]
                                }}

                            height={300}
                            width={600}
                            options={{
                                // scales: {
                                //     y: {
                                //         min: 0,
                                //         max: 2000000,
                                //         ticks: {
                                //             stepSize: 500000,
                                //         }
                                //     }
                                // },
                                maintainAspectRatio: false
                            }}
                        />
                    </Grid>
                    <Grid item md={3} xs={12} lg={6}>
                        <Bar 
                            data={{
                                labels: [],
                                datasets: [{
                                    label: 'Setahun Terakhir',
                                    data: dataYear
                                }]
                                }}

                            height={300}
                            width={600}
                            options={{
                                // scales: {
                                //     y: {
                                //         min: 0,
                                //         max: 2000000,
                                //         ticks: {
                                //             stepSize: 500000,
                                //         }
                                //     }
                                // },
                                maintainAspectRatio: false
                            }}
                        />
                    </Grid>
                </Grid>
                <DialogFilter 
                    open={open} 
                    handleClose={handleClose} 
                    setSearch={setSearch} 
                    search={search} 
                    onSearch={onSearch}
                />
            </>
            }
            {!isComplete &&
                <CircularProgress />
            }
        </Box>
    )
}

export default Dashboard
