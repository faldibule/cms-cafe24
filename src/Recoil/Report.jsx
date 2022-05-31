import { atom } from 'recoil'

export const dataReport = atom({
    key: 'dataReport',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,
    }
})