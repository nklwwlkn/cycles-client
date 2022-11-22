import { Auth, RecaptchaVerifier } from 'firebase/auth'

export async function renderRecaptcha(id: string, auth: Auth, cb: any) {
  cb('')
  new RecaptchaVerifier(
    id,
    {
      size: 'normal',
      callback: (token: string) => {
        cb(token)
      },
    },
    auth,
  )
    .render()
    .catch((_) => {})
}
