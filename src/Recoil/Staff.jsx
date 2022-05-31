import { atom } from 'recoil'

export const dataStaff = atom({
    key: 'dataStaff',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,
    }
})