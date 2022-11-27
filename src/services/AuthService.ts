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

type onSuccessCb = (params?: any) => any
type onFailureCb = (errors: any[]) => void

const errorHandler = (err: any, cb: onFailureCb) => {
  // Handle errors here:

  if (err && err instanceof AxiosError) {
    return cb(err.response?.data.errors)
  }

  // Right now just send generic error here:
  return cb(DEFAULT_AUTH_ERROR)
}

class AuthService {
  async requestSms(payload: RequestSmsPayload, onSuccess: onSuccessCb, onFailure: onFailureCb) {
    return axios
      .post(API_URL + 'strategies/sms', payload)
      .then((response) => {
        const { sessionInfo } = response.data
        const { phoneNumber } = payload

        if (sessionInfo) {
          return onSuccess({
            sessionInfo: sessionInfo,
            phoneNumber: phoneNumber
          })
        }

        return onFailure(response.data.errors)
      })
      .catch((err) => {
        return errorHandler(err, onFailure)
      })
  }

  async verifySms(payload: VerifySmsPayload, onSucess: onSuccessCb, onFailure: onFailureCb) {
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

  async getCurrentUser(onSuccess: onSuccessCb) {
    return axios
      .get(API_URL + 'current-user', {
        headers: authHeader(),
      })
      .then((response) => {
        const { currentUser } = response.data

        onSuccess(currentUser)
      })
  }
}

export default new AuthService()
