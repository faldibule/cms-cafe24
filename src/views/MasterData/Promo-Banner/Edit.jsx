import React, { useEffect, useState } from "react";
import Form from "./Form";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API } from "../../../Variable/API";

const Edit = () => {
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

    const getDataPromoById = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${API}promotion/show/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            return res.data
        } catch (err) {
            // console.log(err.response);
        }
    }

    useEffect(() => {
        let mounted = true       
        getDataPromoById().then(res => {
            if(mounted){
                setData(res.data)
                setLoading(false)
            }
        })
    }, [id])

    return (
        <div>
            {!loading ? 
                <Form title='Edit' data={data} />
            :
                "Loading..."
            }
        </div>
    )
};

export default Edit;
