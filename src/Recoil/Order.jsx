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

export const dataNotif = atom({
    key: 'dataNotif',
    default: {}
})

export const dataTransaksi = atom({
    key: 'dataTransaksi',
    default: []
})