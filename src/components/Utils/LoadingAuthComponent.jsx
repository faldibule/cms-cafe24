import { Typography, Box, CircularProgress } from '@mui/material';
import React from 'react';
import LoadingGif from '../../Image/loading.gif'
import LoadingText from '../../Image/loadingText.gif'

const LoadingAuthComponent = () => {
  return (
        <Box 
            sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
            component='div'
            >
            <img src={LoadingGif} style={{ height: '80px', marginBottom: '-130px' }} alt="te" />
            <img src={LoadingText} style={{ height: '300px' }} alt="te" />
            
        </Box>
    )
};

export default LoadingAuthComponent;
