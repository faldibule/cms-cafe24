import { atom } from 'recoil'

export const dataOrder = atom({
    key: 'dataOrder',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,
    }
})