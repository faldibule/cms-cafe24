import axios from "axios";
import { atom, selector } from "recoil";
import { API } from "../Variable/API";

export const kategoriParent = atom({
    key : 'kategoriParent',
    default: selector({
        key: 'selector1',
        get: async () => {
            let parent = []
            try {
                const {data} = await axios.get(`${API}category/fetch`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken'),
                    }
                })
                parent = [...data.data]
            } catch(err) {
                console.log(err)
            }
            return parent
        }
    })
})


export const allKategori = atom({
    key: 'allKategori',
    default: []
})

