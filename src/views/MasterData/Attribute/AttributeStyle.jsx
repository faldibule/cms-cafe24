import { makeStyles } from "@mui/styles";

export const AttributeStyle = makeStyles(theme => ({
    container: {
        display: 'flex',
        padding: '10px',
    },

    //attribute style
    table: {
       width: '100%',
    },
    terms: {
        width: '700px'
    },

    // childform style
    formChild: {
        maxWidth: '50%',
        marginRight: '40px'
    },
    tableChild: {
        width: '50%'
    },
    textarea: {
        width: '100%',
        padding: '12px 20px',
        boxSizing: 'border-box',
        border: '2px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#f8f8f8',
    },
    input: {
        marginBottom: '20px'
    },
    button: {
        width: '150px',
        fontSize: '0.65rem',
        borderRadius: 25,
    },
    buttonAdd: {
        color: '#eee',
        backgroundColor: '#4CAF50',
        my: 2, 
        p:1, 
        maxWidth: 300, 
        borderRadius: 25,
        '&:hover': {
            backgroundColor: '#43a047'
        }
    },

    //parentform style
    form: {
        width: '70%'
    }
}))