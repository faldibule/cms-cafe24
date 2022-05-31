import { atom, selector } from 'recoil'

export const dataPelanggan = atom({
    key: 'dataPelanggan',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,
    }
})