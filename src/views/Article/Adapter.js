import axios from 'axios'
import { API } from '../../Variable/API'

// Custom Upload Adapter
export class UploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  async upload() {
    return this.loader.file.then((file) => {
      const data = new FormData()
      data.append("file", file)
      const genericError = `Couldn't upload file: ${file.name}.`
      // console.log(Object.fromEntries(data))
      return axios({
        data,
        method: "post",
        url: `${API}article_file/create`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        },
        onUploadProgress: (progressEvent) => {
          this.loader.uploadTotal = progressEvent.total
          this.loader.uploaded = progressEvent.loaded
          const uploadPercentage = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          )
        },
      })
        .then((res) => {
          return { 
            default: res.data.data.file_url
          }
        })
        .catch(({ error }) => Promise.reject(error?.message ?? genericError))
    })
  }

  abort() {
    return Promise.reject()
  }
}

// CKEditor FileRepository
export function uploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
    new UploadAdapter(loader)
}