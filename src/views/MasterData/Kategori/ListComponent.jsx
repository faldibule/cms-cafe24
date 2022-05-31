import { List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ListComponent = ({classes, listKategori}) => {
    const navigate = useNavigate()
    
    return (
        <div className={classes.list}>
            <Typography  variant="h5">
                Susunan Kategori 
            </Typography>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    boxShadow: 1,
                    '& ul': { padding: 0 },
                }}
                subheader={<li />}
                >
                {listKategori.map((val) => (
                    <li key={`section-${val.category_name}`}>
                        <ul>
                            <ListSubheader sx={{ cursor: 'pointer' }} onClick={() => navigate(`/master-data/kategori/parent_update/${val.id}`)}><span style={{fontSize: '1.2rem'}}>{val.category_name}</span></ListSubheader>
                            {val.child.map((child) => (
                            <ListItem key={`item-${val.category_name}-${child.sub_category_name}`}>
                                <ListItemText 
                                    sx={{ cursor: 'pointer', ml: 2 }} 
                                    onClick={() => navigate(`/master-data/kategori/child_update/${child.id}-${val.id}`)} 
                                    primary={"- "+child.sub_category_name} />
                            </ListItem>
                            ))}
                        </ul>
                    </li>
                ))}
                </List>
        </div>
    )
}

export default ListComponent
