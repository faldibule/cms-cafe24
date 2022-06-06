import React, { useState } from 'react'

import { 
    Alert,
    Button,
    Card, 
    CardContent, 
    CardHeader, 
    FormControl, 
    Grid,
    Link,
    TextField,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/system'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { authentication } from '../../Recoil/Authentication';
import { API } from '../../Variable/API'

function Login() {
    const [data, setData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState({
        display: "none",
        message: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const [auth, setAuth] = useRecoilState(authentication)
    const handleChange = (e) => {
        setData({
            ...data, 
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = {
            email: data.email,
            password: data.password,
            type: 'staff',
        }
        axios.post(`${API}auth/login`, formData)
            .then(res => {
                setLoading(false)
                setAuth({
                    user: res.data.data.user,
                    auth: true,
                })
                localStorage.setItem('authToken', res.data.data.access_token)
                navigate('/dashboard')
            })
            .catch(err => {
                console.log(err.response)
                if(err.response){
                    setLoading(false)
                    setError({
                        display: "relative",
                        message: 'Email/Password Salah!'
                    })
                }
            })
    }

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" mt={30}>
            <Grid item xs={12} lg={3.5}>
                <Card>
                    <CardHeader 
                        title="Login Now" 
                        sx={{ 
                            textAlign: 'center',
                         }}
                    />
                    
                    <CardContent>
                        <Alert 
                        sx={{
                            display: error.display,
                        }} 
                        severity="error">{error.message}</Alert>
                        <form onSubmit={handleSubmit}>
                            <FormControl
                                fullWidth
                                required
                                sx={{ 
                                    '& .MuiTextField-root' : { m: 1 }
                                }}
                            >
                                <TextField 
                                    label="email"
                                    type="email"
                                    autoComplete="email"
                                    name="email"
                                    onChange={handleChange}
                                />
                                <TextField 
                                    label="password"
                                    type="password"
                                    autoComplete="current-password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <Box 
                                sx={{ 
                                    fontSize: 13,
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    m: 1
                                }}
                            >
                                <div>
                                    <Link 
                                        href="#"
                                    >
                                        Forgot Password ?
                                    </Link>
                                </div>
                            </Box>
                            <LoadingButton
                                variant="contained"
                                fullWidth
                                sx={{ m: 1, mt: 2,borderRadius: 25 }}
                                type="submit"
                                loading={loading}
                            >
                                Login
                            </LoadingButton>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Login
