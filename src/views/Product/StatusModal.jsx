import React, { useState, useEffect, useRef } from 'react';
import { Box, FormGroup, FormControlLabel, Switch, Button, CircularProgress, TextField, Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,  } from '@mui/material'
import { blue } from '@mui/material/colors'
import { useRecoilState } from 'recoil'
import { API } from '../../Variable/API'
import axios from 'axios'
import { LoadingButton } from '@mui/lab';
import { alertState } from '../../Recoil/Alert';
import { allProduct } from '../../Recoil/Product';
import CurrencyFormat from 'react-currency-format';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';



const banyak_foto = [1, 2, 3, 4, 5]
const StatusModal = (props) => {
    //ref
    const number = useRef()
    number.current = 0

    //product recoil
    const [product, setProduct] = useRecoilState(allProduct)

    //alert recoil
    const [alert, setAlert] = useRecoilState(alertState)

    // state
    //isComplete
    const [isComplete, setIsComplete] = useState(false)
    const [clear, setClear] = useState(false)

    // berat
    const [beratUkuran, setBeratUkuran] = useState({
        berat: null,
        ukuran: null
    })


    // foto product
    const [fotoProduk, setFotoProduk] = useState({})

    //loading button
    const [loading, setLoading] = useState(false)

    //form
    const [form, setForm] = useState({
        sku: '',
        video_url: null,
        nama: null,
        harga: null,
        status: 'active',
        stok: '',
        minimal_order: null,
        sizePack: '',
        ckEditor: null,
        panjang: '',
        tinggi: '',
        berat: null,
        preorder: null,
        category_parent: '1',
        category_child: null,
        diskon: '',
        discount_type: '',
    })

    //error
    const [errors, setErrors] = useState({})


    //Variant
    const [variantCount, setVariantCount] = useState([])
    const [variantParent, setVariantParent] = useState({})
    const [variantSub, setVariantSub] = useState({})
    const [variantForm, setVariantForm] = useState({})
    const [variantForm2, setVariantForm2] = useState({})
    

    // pre order
    const [check, setCheck] = useState(false)
    const [satuanPreorder, setSatuanPreorder] = useState('day')

    //variant main
    const [main, setMain] = useState(0)
    const [main2, setMain2] = useState('00')
    
    //variant combination
    const [variantOption, setVariantOption] = useState([])
    const [variantOption2, setVariantOption2] = useState([])

    //combination value
    const [combination, setCombination] = useState([])
    const [combination2, setCombination2] = useState([])

    // Diskon
    const [discountCheck, setDiscountCheck] = useState(false)


    const discountChange = (event) => {
        setDiscountCheck(event.target.checked)
    };

    const setDataCombination = () => {
        let variantTemp = {}
        let main = ''
        combination.map((val, i) => {
            variantTemp = {
                ...variantTemp,
                [`form-${i}`]: {
                    sku: val.sku === null ? '' : val.sku,
                    stok: val.stock,
                    harga: val.price,
                    status: val.status,
                    image_file: '',
                    image_preview: val.image_url === null ? '' : val.image_url,
                    main: val.main
                }
            }
            if(val.main !== 0){
                main = i
            }
        })
        setVariantForm(variantTemp)
        setMain(main)
    }

    const getData1Variant = (res) => {
        if(res.data.data.product_variant_option.length === 1){
            setVariantCount(['i'])
            setVariantParent({
                'variantParent-0': res.data.data.product_variant_option[0].variant_name,
            })
            setVariantOption([...res.data.data.product_variant_option])
            setCombination([...res.data.data.product_combination])
            let temp = []
            res.data.data.product_variant_option.map((val, i) => {
                let variantOptionTemp = []
                val.product_variant_option_value.map(p => {
                    variantOptionTemp.push(p.variant_option_name)
                })
                temp.push(variantOptionTemp)
            })
            setVariantSub({
                'variantSub-0': typeof temp[0] === 'string' ? temp[0].split(',') : temp[0],
            })
            setIsComplete(true)
        }
    }

    const setDataCombination2 = () => {
        let nomorUrut = 0
        let variantTemp = {}
        let main = ''
        for(let i = 0; i < variantOption2[0].length; i++){
            for(let j = 0; j <  variantOption2[1].length; j++){
                variantTemp = {
                    ...variantTemp,
                    [`form-${i}${j}`]: {
                        sku: combination2[nomorUrut].sku === null || combination2[nomorUrut].sku === "undefined" ? '' : combination2[nomorUrut].sku,
                        stok: combination2[nomorUrut].stock,
                        harga: combination2[nomorUrut].price,
                        status: combination2[nomorUrut].status,
                        image_file: '',
                        image_preview: combination2[nomorUrut].image_url === null ? '' : combination2[nomorUrut].image_url,
                        main: combination2[nomorUrut].main
                    }
                }
                if(combination2[nomorUrut].main !== 0){
                    main = `${i}${j}`
                }
                nomorUrut++
            }
        }
        setVariantForm2(variantTemp)
        setMain2(main)
        // console.log(variantTemp)
    }

    const getData2Variant = (res) => {
        if(res.data.data.product_variant_option.length === 2){
            setVariantOption2([[...res.data.data.product_variant_option[0].product_variant_option_value], [...res.data.data.product_variant_option[1].product_variant_option_value]])
            setCombination2([...res.data.data.product_combination])
            let temp = []
            res.data.data.product_variant_option.map((val, i) => {
                //variant option
                let variantOptionTemp = []
                val.product_variant_option_value.map(p => {
                    variantOptionTemp.push(p.variant_option_name)
                })
                temp.push(variantOptionTemp)
            })
            setVariantSub({
                'variantSub-0': typeof temp[0] === 'string' ? temp[0].split(',') : temp[0],
                'variantSub-1': typeof temp[1] === 'string' ? temp[1].split(',') : temp[1],
            })
            setVariantCount(['i', 'i'])
            setVariantParent({
                'variantParent-0': res.data.data.product_variant_option[0].variant_name,
                'variantParent-1': res.data.data.product_variant_option[1].variant_name
            })
            setIsComplete(true)
        }
    }

    const setProductData = (id) => {
        setClear(false)
        axios.get(`${API}product/show/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            // console.log(res.data)
            // image produk
            let tempImage = {}
            res.data.data.product_image.map((val, i) => {
                tempImage = {
                    ...tempImage,
                    [`image-${i+1}`]: {
                        image_file: '',
                        image_preview: val.product_image_url
                    }
                }
            })
            
            // Form
            let temp = {
                sizePack: res.data.data.size_guide === null ? "" : res.data.data.size_guide,
                ckEditor: res.data.data.description,
                minimal_order: res.data.data.minimum_order,
                nama: res.data.data.product_name,
                status: res.data.data.status,
                video_url: res.data.data.video_url === null ? '' : res.data.data.video_url,
                berat: res.data.data.product_weight,
                panjang: res.data.data.length,
                tinggi: res.data.data.height,
                category_parent: res.data.data.category.id,
                category_child: res.data.data.sub_category.id,
            }
            if(res.data.data.product_variant_option.length === 0){
                setVariantCount([])
                temp.sku = res.data.data.product_combination[0].sku === null ? '' : temp.sku = res.data.data.product_combination[0].sku
                temp.harga = res.data.data.product_combination[0].price
                temp.stok = res.data.data.product_combination[0].stock
            }else{
                temp.sku = ''
                temp.harga = ''
                temp.stok = ''
            }

            
            //variant
            getData1Variant(res)
            getData2Variant(res)
            
            // foto produk
            setFotoProduk(tempImage)

            // berat
            setBeratUkuran({
                ...beratUkuran,
                berat: res.data.data.weight_unit,
                ukuran: res.data.data.size_unit
            })

            //diskon
            if(res.data.data.active_discount === 1){
                setDiscountCheck(true)
                temp.discount_type = res.data.data.discount_type
                temp.diskon = res.data.data.discount
            }else{
                setDiscountCheck(false)
                temp.discount_type = res.data.data.discount_type === null ? '' : res.data.data.discount_type
                temp.diskon = res.data.data.discount === null ? '' : res.data.data.discount
            }

            // preorder
            if(res.data.data.preorder == 1){
                setCheck(true)
                setSatuanPreorder(res.data.data.duration_unit)
                temp.preorder = res.data.data.duration
            }else{
                setCheck(false)
                temp.preorder = ''
            }

            // form
            setForm({
                ...form,
                ...temp
            })
            
            //complete
            if(res.data.data.product_variant_option.length === 0){
                setIsComplete(true)
            }

            //clear
            setClear(true)

            

        })
        .catch(err => {
            // err.response && console.log(err.response)
        })
        
    }

    useEffect(() => {
        let mounted = true
        // console.log(props)
        if(mounted && typeof props.val !== 'undefined'){
            if(form.nama !== props.val.product_name){
                setProductData(props.val.id)
            }
        }

        return () => {
            mounted = false
        }
    }, [props])

    useEffect(() => {
        let mounted = true

        if(variantOption.length !== 0 && combination.length !== 0){
            setDataCombination()
        }

        return () => mounted = false
    }, [variantOption.length, combination.length])

    useEffect(() => {
        let mounted = true

        if(mounted && variantOption2.length !== 0 && combination2.length !== 0){
            setDataCombination2()
        }

        return () => mounted = false
    }, [variantOption2.length, combination2.length])

    const variantFormChange = (e, index) => {
        setVariantForm({
          ...variantForm,
          [`form-${index}`]: {
              ...variantForm[`form-${index}`],
              [e.target.name]: e.target.value
          }
        })
    }
    
    const variantCheckChange = (e, index) => {
        let temp = []
        for(const x in variantForm){
            temp.push(variantForm[`${x}`].status)
        }
        if(!e.target.checked && temp.filter(val => val === 'active').length === 1){
            setForm({
                ...form,
                status: 'not_active'
            })
        }else if(e.target.checked && temp.filter(val => val === 'active').length === 0){
            setForm({
                ...form,
                status: 'active'
            })
        }
        setVariantForm({
            ...variantForm,
            [`form-${index}`]: {
                ...variantForm[`form-${index}`],
                [e.target.name]: e.target.checked ? 'active' : 'not_active'
            }
        })

    };

    const variantImageChange = (e, index) =>{
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setVariantForm({
            ...variantForm,
            [`form-${index}`]: {
                ...variantForm[`form-${index}`],
                image_preview,
                image_file
            }
        })
    }

    const variantMainChange = (e, index) => {
        setMain(index)
    }

    const variantFormChange2 = (e, index) => {
        setVariantForm2({
            ...variantForm2,
            [`form-${index}`]: {
                ...variantForm2[`form-${index}`],
                [e.target.name]: e.target.value
            }
        })
    }

    const variantCheckChange2 = (e, index) => {
        let temp = []
        for(const x in variantForm2){
            temp.push(variantForm2[`${x}`].status)
        }
        if(!e.target.checked && temp.filter(val => val === 'active').length === 1){
            setForm({
                ...form,
                status: 'not_active'
            })
        }else if(e.target.checked && temp.filter(val => val === 'active').length === 0){
            setForm({
                ...form,
                status: 'active'
            })
        }
        setVariantForm2({
            ...variantForm2,
            [`form-${index}`]: {
                ...variantForm2[`form-${index}`],
                [e.target.name]: e.target.checked ? 'active' : 'not_active'
            }
        })
    };

    const variantImageChange2 = (e, index) =>{
        let image_preview = URL.createObjectURL(e.target.files[0])
        let image_file = e.target.files[0];
        setVariantForm2({
            ...variantForm2,
            [`form-${index}`]: {
                ...variantForm2[`form-${index}`],
                image_preview,
                image_file
            }
        })
    }

    const variantMainChange2 = (e, index) => {
        setMain2(index)
    }

    const formStatusChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.checked ? 'active' : 'not_active'
        })
    }

    const formStatusChange2 = (e) => {
        if(e.target.checked){
            let temp = {}
            let i = 0;
            for(const x in variantForm){
                temp = {
                    ...temp,
                    [`form-${i}`]: {
                        ...variantForm[`form-${i}`],
                        status: 'active'
                    }
                }
                i = i + 1
            }
            setVariantForm(temp)
            setForm({
                ...form,
                [e.target.name]: e.target.checked ? 'active' : 'not_active'
            })
        }else{
            let temp = {}
            let i = 0;
            for(const x in variantForm){
                temp = {
                    ...temp,
                    [`form-${i}`]: {
                        ...variantForm[`form-${i}`],
                        status: 'not_active'
                    }
                }
                i = i + 1
            }
            setVariantForm(temp)
            setForm({
                ...form,
                [e.target.name]: e.target.checked ? 'active' : 'not_active'
            })
        }
        
    }

    const formStatusChange3 = (e) => {
        if(e.target.checked){
            let temp = {}
            variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, i) => {
                variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, j) => {
                    temp = {
                        ...temp,
                        [`form-${i}${j}`]: {
                            ...variantForm2[`form-${i}${j}`],
                            status: 'active'
                        }
                    }
                })
            })
            setVariantForm2(temp)
            setForm({
                ...form,
                [e.target.name]: e.target.checked ? 'active' : 'not_active'
            })
        }else{
            let temp = {}
            variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, i) => {
                variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, j) => {
                    temp = {
                        ...temp,
                        [`form-${i}${j}`]: {
                            ...variantForm2[`form-${i}${j}`],
                            status: 'not_active'
                        }
                    }
                })
            })
            setVariantForm2(temp)
            setForm({
                ...form,
                [e.target.name]: e.target.checked ? 'active' : 'not_active'
            })
        }
        
    }

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        let variant = []
        let combination = []
        let product_image = []

        if(variantCount.filter(x => x === 'i').length === 2){

            let index1 = variantCount.indexOf('i')
            let index2 = variantCount.indexOf('i', variantCount.indexOf('i') + 1)
            variant.push({
                variant_name: variantParent[`variantParent-${index1}`],
                variant_option: variantSub[`variantSub-${index1}`]
            })
            variant.push({
                variant_name:variantParent[`variantParent-${index2}`],
                variant_option: variantSub[`variantSub-${index2}`]
            })

            variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, i) => {
                variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, j) => {
                
                    combination.push({
                        combination_string : `${val1}-${val2}`,
                        sku: variantForm2[`form-${i}${j}`]['sku'],
                        price: variantForm2[`form-${i}${j}`]['harga'],
                        stock: variantForm2[`form-${i}${j}`]['stok'],
                        image: variantForm2[`form-${i}${j}`]['image_file'],
                        status: variantForm2[`form-${i}${j}`]['status'],
                        main: main2 === `${i}${j}` ? 1 : 0
                    })
            
                })
            })
        }

        if(variantCount.filter(x => x === 'i').length === 1){
        let index = variantCount.indexOf('i')
        variant.push({
            variant_name: variantParent[`variantParent-${index}`],
            variant_option: variantSub[`variantSub-${index}`]
        })
        variantSub[`variantSub-${index}`].map((val, i) => {

            combination.push({
            combination_string : val,
            sku: variantForm[`form-${i}`]['sku'],
            price: variantForm[`form-${i}`]['harga'],
            stock: variantForm[`form-${i}`]['stok'],
            image: variantForm[`form-${i}`]['image_file'],
            status: variantForm[`form-${i}`]['status'],
            main: i === main ? 1 : 0
            }) 

        })
        }

        if(JSON.stringify(fotoProduk) !== '{}'){
        banyak_foto.map((val, i) => {
            if(typeof fotoProduk[`image-${val}`] !== 'undefined'){
            product_image.push({
                product_image: fotoProduk[`image-${val}`].image_file,
                order: val,
            }) 
            }
        })
        }
        
        const formData = new FormData()
        //overriding method
        formData.append('_method', 'put')

        // kategori
        formData.append('category_id', form.category_parent)
        formData.append('sub_category_id', form.category_child)

        // deskripsi, nama, sizeguide, min order
        formData.append('description', form.ckEditor)
        formData.append('product_name', form.nama)
        formData.append('size_guide', form.sizePack)
        formData.append('minimum_order', form.minimal_order)

        // berat
        formData.append('product_weight', form.berat)
        formData.append('weight_unit', beratUkuran.berat)
        // ukuran
        formData.append('size_unit', beratUkuran.ukuran === null ? '' : beratUkuran.ukuran)
        if(beratUkuran.ukuran !== null){
            formData.append('length', form.panjang)
            formData.append('height', form.tinggi)
        }

        formData.append('status', form.status)

        formData.append('active_discount', discountCheck ? 1 : 0)
        if(discountCheck){
            formData.append('discount_type', form.discount_type)
            formData.append('discount', form.diskon)
        }

        //pre order
        formData.append('preorder', check ? 1 : 0)
        if(check){
            formData.append('duration', form.preorder)
            formData.append('duration_unit', satuanPreorder)
        }
        
        //jika variant kosong
        if(variantCount.filter(x => x === 'i').length === 0){
            formData.append('sku', form.sku)
            formData.append('stock', form.stok)
            formData.append('price', form.harga)
        }

        //product Image
        if(product_image.length !== 0){
            product_image.map((val, i) => {
                if(val.product_image !== ''){
                    formData.append(`product_image[${i}][product_image]`, val.product_image)
                }
                formData.append(`product_image[${i}][order]`, val.order)
            })
        }

        //video Url
        if(form.video_url !== ""){
            formData.append('video_url', form.video_url)
        }

        //variant dan combination
        if(variantCount.filter(x => x === 'i').length !== 0){
            variant.map((val, i) => {
                formData.append(`variant[${i}][variant_name]`, val.variant_name)
                val.variant_option.map((val2, j) => {
                formData.append(`variant[${i}][variant_option][${j}]`, val2)
                })
            })
            combination.map((val, i) => {
                formData.append(`combination[${i}][sku]`, val.sku)
                formData.append(`combination[${i}][combination_string]`, val.combination_string)
                formData.append(`combination[${i}][price]`, val.price)
                formData.append(`combination[${i}][stock]`, val.stock)
                formData.append(`combination[${i}][status]`, val.status)
                formData.append(`combination[${i}][main]`, val.main)
                if(val.image !== ''){
                    formData.append(`combination[${i}][image]`, val.image)
                }
            })
        }
        


        // console.log(Object.fromEntries(formData))
        // setLoading(false)
        // setAlert({
        //   message: 'Produk Berhasil Ditambah',
        //   display: true
        // })
        // navigate(`/product`)
        
        axios.post(`${API}product/update/${props.val.id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(res => {
            setLoading(false)
            setProduct({
                ...product,
                isComplete: false,
                data: [],
            })
            setAlert({
                message: 'Status Produk Berhasil Diubah',
                display: true
            })
            setTimeout(() => {
                setAlert({
                    message: '',
                    display: false
                })
            }, 6000)
            props.handleClose2()
        })
        .catch(err => {
            if(err.response){
                setErrors(err.response.data.errors)
                // console.log(err.response)
            }
            setLoading(false)
        })

        
    }

    return (
        <div>
            <Box
                onSubmit={onSubmit}
                component='form'
                sx={{ 
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
            }}>

                {/* Discount */}
                <Box>
                    <Dialog
                        maxWidth={'md'}
                        fullWidth
                        open={props.open2}
                        keepMounted
                        onClose={props.handleClose2}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle>Setting Status</DialogTitle>
                            {typeof props.val !== 'undefined' && clear &&
                            
                            <Box component="form" onSubmit={onSubmit}>
                                <DialogContent>
                                    {variantCount.length === 0 &&
                                    <FormGroup sx={{ ml: 2 }}>
                                        <FormControlLabel
                                        control={
                                            <Switch
                                                name='status'
                                                checked={form.status === 'not_active' ? false : true}
                                                onChange={formStatusChange}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } 
                                        label="Status Produk" />
                                    </FormGroup> 
                                    }
                                    {variantCount.length === 1 &&
                                    <FormGroup sx={{ ml: 2 }}>
                                        <FormControlLabel
                                        control={
                                            <Switch
                                                name='status'
                                                checked={form.status === 'not_active' ? false : true}
                                                onChange={formStatusChange2}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } 
                                        label="Status Produk" />
                                    </FormGroup> 
                                    }
                                    {variantCount.length === 2 &&
                                    <FormGroup sx={{ ml: 2 }}>
                                        <FormControlLabel
                                        control={
                                            <Switch
                                                name='status'
                                                checked={form.status === 'not_active' ? false : true}
                                                onChange={formStatusChange3}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        } 
                                        label="Status Produk" />
                                    </FormGroup> 
                                    }

                                    {/* Table */}
                                    {variantCount.length !== 0 && variantCount.some(s => s === 'i') && JSON.stringify(variantSub) !== '{}' &&
                                    <TableContainer sx={{ mt: 1 }} component={Paper}>
                                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                                            <TableHead sx={{ backgroundColor: blue[500]}}>
                                                <TableRow>
                                                    <TableCell sx={{ color: 'white'  }} align="center">Variant 1</TableCell>
                                                    {variantCount.filter(filter => filter === 'i').length > 1 && 
                                                    <TableCell sx={{ color: 'white'  }} align="center">Variant 2</TableCell>
                                                    }
                                                    <TableCell sx={{ color: 'white'  }}>Gambar</TableCell>
                                                    <TableCell sx={{ color: 'white'  }}>Status</TableCell>
                                                    <TableCell sx={{ color: 'white'  }}>Utama</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                            {variantCount.map((count, i) => {
                                                if(count === 'i' && typeof variantSub[`variantSub-${i}`] !== 'undefined'){
                                                if(variantCount.filter(filter => filter === 'i').length === 1 && typeof variantSub[`variantSub-${i}`] !== 'undefined'){
                                                    return variantSub[`variantSub-${i}`].map((x, index2) => {
                                                    if(typeof variantForm[`form-${index2}`] === 'undefined'){
                                                        setVariantForm({
                                                        ...variantForm,
                                                        [`form-${index2}`]: {
                                                            sku: '',
                                                            harga: '',
                                                            stok: '0',
                                                            image_file: '',
                                                            image_preview: '',
                                                            status: 'active',
                                                        }
                                                        })
                                                    }
                                                    return (
                                                        <TableRow key={index2}>
                                                        <TableCell align="center">{x}</TableCell>
                                                        <TableCell>
                                                            <label htmlFor={`image-variant-${index2}`}>
                                                            
                                                            {typeof variantForm[`form-${index2}`] === 'undefined' ? 
                                                                ''
                                                            :
                                                            variantForm[`form-${index2}`]['image_preview'] !== '' ?
                                                                <img style={{ display: 'block', height: '50px', objectFit: 'cover', objectPosition: 'center' }} src={variantForm[`form-${index2}`]['image_preview']} alt={`image-${index2}`} />

                                                                :

                                                                <AddPhotoAlternateIcon />
                                                            }
                                                            </label>
                                                            
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormGroup>
                                                                <FormControlLabel 
                                                                control={typeof variantForm[`form-${index2}`] === 'undefined' ? 
                                                                    <Switch
                                                                        name='status'
                                                                        checked={true}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    />
                                                                    :
                                                                    <Switch
                                                                        name='status'
                                                                        checked={variantForm[`form-${index2}`]['status'] === 'not_active' ? false : true}
                                                                        onChange={(e) => variantCheckChange(e, index2)}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    />
                                                                } 
                                                                label="" />
                                                            </FormGroup>
                                                        </TableCell>
                                                        <TableCell>
                                                            <FormGroup>
                                                                <FormControlLabel 
                                                                control={
                                                                    <Switch
                                                                        name='main'
                                                                        checked={main === index2 ? true : false}
                                                                        onChange={(e) => variantMainChange(e, index2)}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    />
                                                                } 
                                                                label="" />
                                                            </FormGroup>
                                                        </TableCell>
                                                        
                                                        </TableRow>
                                                    )
                                                    })
                                                }
                                                }
                                            })
                                            }
                                            
                                            {/* 2 variant */}
                                            {variantCount.filter(filter => filter === 'i').length > 1 && 
                                                typeof variantSub[`variantSub-${variantCount.indexOf('i')}`] !== 'undefined' && 
                                                typeof variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`] !== 'undefined' && 
                                                
                                                variantSub[`variantSub-${variantCount.indexOf('i')}`].map((val1, index3) => {
                                                    return variantSub[`variantSub-${variantCount.indexOf('i', variantCount.indexOf('i') + 1)}`].map((val2, index4) => {

                                                    if(typeof variantForm2[`form-${index3}${index4}`] === 'undefined'){
                                                        
                                                        setVariantForm2({
                                                        ...variantForm2,
                                                        [`form-${index3}${index4}`]: {
                                                            harga: '',
                                                            stok: '0',
                                                            image_file: '',
                                                            image_preview: '',
                                                            status: 'active'
                                                        }
                                                        })
                                                    }

                                                    return (
                                                        
                                                        <TableRow key={`${index3}${index4}}`}>
                                                            <TableCell align="center">{val1}</TableCell>
                                                            <TableCell align="center">{val2}</TableCell>
                                                            <TableCell>
                                                            <label htmlFor={`image-variant-${index3}${index4}`}>
                                                                
                                                                {typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ? 
                                                                ''
                                                                :
                                                                variantForm2[`form-${index3}${index4}`]['image_preview'] !== '' ?
                                                                    <img style={{ display: 'block', height: '50px', objectFit: 'cover', objectPosition: 'center' }} src={variantForm2[`form-${index3}${index4}`]['image_preview']} alt={`image-${index3}${index4}`} />

                                                                :

                                                                <AddPhotoAlternateIcon />
                                                                }
                                                            </label>
                                                            
                                                            </TableCell>
                                                            <TableCell>
                                                                <FormGroup>
                                                                    <FormControlLabel 
                                                                        control={typeof variantForm2[`form-${index3}${index4}`] === 'undefined' ?
                                                                            <Switch
                                                                                name='status'
                                                                                checked={true}
                                                                            />
                                                                            :
                                                                            <Switch
                                                                                name='status'
                                                                                checked={variantForm2[`form-${index3}${index4}`]['status'] === 'not_active' ? false : true}
                                                                                onChange={(e) => variantCheckChange2(e, `${index3}${index4}`)}
                                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                                            />

                                                                        } 
                                                                        label="" 
                                                                    />
                                                                </FormGroup>
                                                            </TableCell>
                                                            <TableCell>
                                                                <FormGroup>
                                                                    <FormControlLabel 
                                                                    control={
                                                                        <Switch
                                                                            name='main'
                                                                            checked={main2 === `${index3}${index4}` ? true : false}
                                                                            onChange={(e) => variantMainChange2(e, `${index3}${index4}`)}
                                                                            inputProps={{ 'aria-label': 'controlled' }}
                                                                        />
                                                                    } 
                                                                    label="" />
                                                                </FormGroup>
                                                            </TableCell>
                                                            <TableCell sx={{ display: 'none' }}>
                                                            {number.current = number.current + 1}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                    })
                                                })  

                                            }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    }

                                    
                                </DialogContent>
                                <DialogActions>
                                    <LoadingButton
                                            type="submit"
                                            loading={loading}
                                        >
                                            Simpan
                                    </LoadingButton>
                                    <Button type="button" onClick={props.handleClose2}>Close</Button>
                                </DialogActions>
                            </Box>
                            }
                            {!clear&&
                            <Box component='div' sx={{ m: '10px auto' }} >
                                <CircularProgress size={30}/>
                            </Box>
                            }
                    </Dialog>
                    
                </Box> 
            </Box>
        
        </div>
    )

};

export default StatusModal;
