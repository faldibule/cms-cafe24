import { atom } from 'recoil'

export const allProduct = atom({
    key: 'allProduct',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,

    }
})