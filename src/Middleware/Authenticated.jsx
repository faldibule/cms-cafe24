import React, { useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router'
import { useRecoilValue } from 'recoil'
import { authentication } from '../Recoil/Authentication'

function Authenticated(props) {
    const navigate = useNavigate()
    const { auth } = useRecoilValue(authentication)
    
    
    if(!auth){
        return <Navigate to={`/`} />
    }
    
    return props.children
}

export default Authenticated
