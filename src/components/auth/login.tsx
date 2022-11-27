import { Button } from 'baseui/button'
import { HeadingXXLarge } from 'baseui/typography'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import  PhoneInput from 'react-phone-number-input'

import { Container, ErrorText, InnerContainer, InputWrapper } from '../commons'
import { renderRecaptcha } from '../../utils/renderRecaptcha'
import { auth } from '../../config/firebaseConfig'
import AuthService from '../../services/AuthService'

export type LoginFormPayload = {
  phoneNumber: string | undefined
  recaptchaToken: string
  sessionInfo: string
}

function Login() {
  const navigate = useNavigate()

  const [phoneNumber, setPhoneNumber] = useState<LoginFormPayload['phoneNumber']>('')
  const [recaptchaToken, setRecaptchaToken] =
    useState<LoginFormPayload['recaptchaToken']>('')
  const [errors, setErrors] = useState<any[]>([])

  useEffect(() => {
    renderRecaptcha('container-recaptcha', auth, setRecaptchaToken)
  }, [])

  const onSuccess = (payload: Pick<LoginFormPayload, 'sessionInfo' | 'phoneNumber'>) => {
    const { sessionInfo, phoneNumber } = payload

    navigate('/verify', {
      state: { sessionInfo: sessionInfo, phoneNumber: phoneNumber },
    })
  }

  const onSubmit = async () => {
    setErrors([])

    if (!phoneNumber) return setErrors([{fieldName: "phoneNumber", message: "Provide phone number."}])
    if (!recaptchaToken) return setErrors([{ fieldName: "recaptchaToken", message: "Try again recaptcha." }])

    await AuthService.requestSms(
      { phoneNumber, recaptchaToken },
      onSuccess,
      setErrors,
    )
  }

  const formik = useFormik({
    initialValues: {},
    onSubmit,
  })

  const renderErrors =
    errors.length > 0
      ? errors.map((err) => (
          <div>
            <ErrorText key={err.fieldName}>{err.message}</ErrorText>
          </div>
        ))
      : ''

  return (
    <Container>
      <InnerContainer>
        <form onSubmit={formik.handleSubmit}>
          <HeadingXXLarge>Welcome, Buddy!</HeadingXXLarge>
          {renderErrors}
          <InputWrapper>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="NO"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          </InputWrapper>
          <div id="container-recaptcha"></div>
          <InputWrapper>
            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
              Send Code
            </Button>
          </InputWrapper>
        </form>
      </InnerContainer>
    </Container>
  )
}

export { Login }
