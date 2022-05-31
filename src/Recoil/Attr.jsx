import axios from 'axios';
import { atom, selector } from 'recoil'
import { API } from "../Variable/API";

export const parentAttr = atom({
    key: 'parentAttr',
    default: selector({
        key: 'parentAttrSelector',
        get: async () => {
            let parent = []
            try {
                const {data} = await axios.get(`${API}variant/fetch`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                parent = await [...data.data]
            } catch(err) {
                console.log(err)
            }
            return parent
        }
    })
})


export const allAttr = atom({
    key: 'allAttr',
    default: []
})

export const initStateParent = selector({
    key: 'initStateParent',
    get: ({get}) => {
        const parent = get(parentAttr)
        let temp = {}
        parent.forEach(val => {
            temp[val.variant_name] = []
        })
        return temp
    }
})