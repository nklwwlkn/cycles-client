import axios, { AxiosError } from 'axios'

import { authHeader } from '../utils/authHeader'

const API_URL = `${process.env.REACT_APP_COREAPI_URL}/auth/`

const DEFAULT_AUTH_ERROR = [
  { fieldName: 'auth', message: 'Unexpected Auth Error.' },
]

type RequestSmsPayload = {
  phoneNumber: string
  recaptchaToken: string
}

type VerifySmsPayload = {
  code: string
  phoneNumber: string
  sessionInfo: string
}

const errorHandler = (err: any, cb: any) => {
  // Handle errors here:

  if (err && err instanceof AxiosError) {
    return cb(err.response?.data.errors)
  }

  return cb(DEFAULT_AUTH_ERROR)
}

class AuthService {
  async requestSms(payload: RequestSmsPayload, onSuccess: any, onFailure: any) {
    return axios
      .post(API_URL + 'strategies/sms', payload)
      .then((response) => {
        if (response.data.sessionInfo) {
          return onSuccess(response.data.sessionInfo, payload.phoneNumber)
        }

        return onFailure(response.data.errors)
      })
      .catch((err) => {
        return errorHandler(err, onFailure)
      })
  }

  async verifySms(payload: VerifySmsPayload, onSucess: any, onFailure: any) {
    return axios
      .post(API_URL + 'strategies/sms/verify', payload)
      .then((response) => {
        if (response.data.jwt) {
          localStorage.setItem('jwt', response.data.jwt)
          return onSucess()
        }

        return onFailure(response.data.errors)
      })
      .catch((err) => {
        console.log(err)
        return errorHandler(err, onFailure)
      })
  }

  logout() {
    localStorage.removeItem('jwt')
  }

  async getCurrentUser(onSuccess: any) {
    return axios
      .get(API_URL + 'current-user', {
        headers: authHeader(),
      })
      .then((response) => {
        onSuccess(response.data.currentUser)
      })
  }
}

export default new AuthService()
