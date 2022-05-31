import axios from "axios";
import { atom, selector } from "recoil";
import { API } from "../Variable/API";

export const authentication = atom({
    key: 'authentication',
    default: selector({
        key: 'default-authentication',
        get: async () => {
            let auth = false
            let user = null
            try {
                const {data} = await axios.get(`${API}auth/user`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('authToken')
                    }
                })
                
                user = data.data
                auth = true;
                // console.log(user)
            } catch(e) {
                // console.log(e.response)
                user = null
                auth = false
            }
            return {
                user,
                auth
            }
        }
    })
})

