import { makeStyles } from "@mui/styles";

export const formKategoriStyle = makeStyles((theme) => (
    {
        container: {
            display: 'flex',
        },
        textarea: {
            width: '100%',
            height: '300px',
            padding: '12px 20px',
            boxSizing: 'border-box',
            border: '2px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f8f8f8',
        },
        form: {
            marginRight: '50px',
            width: '100%',
        },
        input: {
            maxWidth: '550px',
            padding: '5px',
            marginBottom: '15px'
        },
        button: {
            borderRadius: 25,
            padding: '5px',
            margin: '10px 10px',
            width: '100px'
        },
        list: {
            width: '50%'
        },
        mb: {
            marginBottom: '10px'
        },
        editIcon: {
            color: '#2e7d32',
            cursor: 'pointer'
        },
        deleteIcon: {
            color: '#d32f2f',
            cursor: 'pointer'
        },
        buttonAdd: {
            margin: '10px 0',
            width: '300px',
            borderRadius: 25,
        }

    }
))