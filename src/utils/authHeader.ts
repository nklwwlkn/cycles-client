import { AxiosRequestHeaders } from 'axios'

function authHeader(): AxiosRequestHeaders {
  const jwt = localStorage.getItem('jwt')

  if (jwt) {
    return { Authorization: 'Bearer ' + jwt }
  } else {
    return {}
  }
}

export { authHeader }
