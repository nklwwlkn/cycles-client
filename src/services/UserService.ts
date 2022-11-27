import axios, { AxiosError } from 'axios'
import { authHeader } from '../utils/authHeader'

const API_URL = `${process.env.REACT_APP_COREAPI_URL}/users/`

const DEFAULT_AUTH_ERROR = [
  { fieldName: 'user', message: 'Unexpected User Error.' },
]

export type UserPayload = {
  id: number
  phoneNumber: string
  name: string | null
  email: string | null
}
type UpdateUserPayload = Pick<UserPayload, "email" | "name">

type onSuccessCb = (params?: any) => any
type onFailureCb = (errors: any[]) => void

const errorHandler = (err: any, cb: onFailureCb) => {
  // Handle errors here:

  if (err && err instanceof AxiosError) {
    return cb(err.response?.data.errors)
  }

  return cb(DEFAULT_AUTH_ERROR)
}

class UserService {
  async getMe(onSuccess: onSuccessCb, onFailure: onFailureCb) {
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

  async updateMe(payload: UpdateUserPayload, onSuccess: onSuccessCb, onFailure: onFailureCb) {
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
