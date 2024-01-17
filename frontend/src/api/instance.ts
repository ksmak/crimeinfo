import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.REACT_APP_HOST_API,
    withCredentials: true,
})

instance.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`
    return config
})

instance.interceptors.response.use((config) => {
    return config
}, (async error => {
    const originalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        const response = await axios({
            method: 'post',
            url: `${process.env.REACT_APP_HOST_API}/api/token/refresh/`,
            data: {
                refresh: localStorage.getItem('refresh_token')
            },
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        if (response.status === 200) {
            const milliseconds = process.env.REACT_APP_ACCESS_TOKEN_LIFETIME
                ? parseInt(process.env.REACT_APP_ACCESS_TOKEN_LIFETIME)
                : 0
            localStorage.setItem('access_token', response.data.access)
            localStorage.setItem('refresh_token', response.data.refresh)
            return instance.request(originalRequest)
        } else {
            console.log('Error authorization!')
        }
    }
    return error
}))

export default instance