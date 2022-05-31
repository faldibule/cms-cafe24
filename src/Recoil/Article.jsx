import { atom } from 'recoil'

export const dataArticle = atom({
    key: 'dataArticle',
    default: {
        data : [],
        total: 0,
        page: 1,
        isComplete: false,

    }
})