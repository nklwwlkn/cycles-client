import { Button } from 'baseui/button'
import { HeadingXXLarge } from 'baseui/typography'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input'

import { Container, ErrorText, InnerContainer, InputWrapper } from '../commons'
import { renderRecaptcha } from '../../utils/renderRecaptcha'
import { auth } from '../../config/firebaseConfig'
import AuthService from '../../services/AuthService'

export type LoginFormPayload = {
  phoneNumber: string
  recaptchaToken: string
  sessionInfo: string
}

function Login() {
  const navigate = useNavigate()

  const [phoneNumber, setPhoneNumber] = useState<any>()
  const [errors, setErrors] = useState<any[]>([])
  const [recaptchaToken, setRecaptchaToken] =
    useState<LoginFormPayload['recaptchaToken']>('')

  useEffect(() => {
    renderRecaptcha('container-recaptcha', auth, setRecaptchaToken)
  }, [])

  const onSuccess = (
    sessionInfo: LoginFormPayload['sessionInfo'],
    phoneNumber: LoginFormPayload['phoneNumber'],
  ) => {
    navigate('/verify', {
      state: { sessionInfo: sessionInfo, phoneNumber: phoneNumber },
    })
  }

  const onSubmit = async () => {
    setErrors([])

    await AuthService.requestSms(
      { phoneNumber, recaptchaToken },
      onSuccess,
      setErrors,
    )
  }

  const formik = useFormik({
    initialValues: {
      phoneNumber: '',
    },
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
