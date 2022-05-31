import { atom } from 'recoil'

export const dataUserAnda = atom({
    key: 'dataUserAnda',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,
    }
})