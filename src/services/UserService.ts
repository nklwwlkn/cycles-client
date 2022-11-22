import axios, { AxiosError } from 'axios'
import { authHeader } from '../utils/authHeader'

const API_URL = `${process.env.REACT_APP_COREAPI_URL}/users/`

const DEFAULT_AUTH_ERROR = [
  { fieldName: 'User', message: 'Unexpected User Error.' },
]

const errorHandler = (err: any, cb: any) => {
  // Handle errors here:

  if (err && err instanceof AxiosError) {
    return cb(err.response?.data.errors)
  }

  return cb(DEFAULT_AUTH_ERROR)
}

class UserService {
  async getMe(onSuccess: any, onFailure: any) {
    return axios
      .get(API_URL + 'me', {
        headers: authHeader(),
      })
      .then((response) => {
        onSuccess(response.data)
      })
      .catch((err) => {
        errorHandler(err, onFailure)
      })
  }

  async updateMe(payload: any, onSuccess: any, onFailure: any) {
    return axios
      .patch(API_URL + 'me', payload, {
        headers: authHeader(),
      })
      .then((response) => {
        onSuccess(response.data)
      })
      .catch((err) => {
        errorHandler(err, onFailure)
      })
  }
}

export default new UserService()
