import { Button } from 'baseui/button'
import { HeadingXXLarge } from 'baseui/typography'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from '../commons'
import AuthService from '../../services/AuthService'

type VerifyFormPayload = {
  code: string
}

type VerifyState = {
  sessionInfo: string
  phoneNumber: string
}

type propType = {
  onSuccessVerify: () => Promise<void>
}

function Verify({ onSuccessVerify }: propType) {
  const location = useLocation()
  const [errors, setErrors] = useState<any[]>([])

  const { sessionInfo, phoneNumber } = location.state as VerifyState

  const onSuccess = async () => {
    await onSuccessVerify()
  }

  const onSubmit = async (values: VerifyFormPayload) => {
    setErrors([])

    const { code } = values

    if (!code) return setErrors([{fieldName: 'code', message: "Provide a code."}])

    await AuthService.verifySms(
      { code, phoneNumber, sessionInfo },
      onSuccess,
      setErrors,
    )
  }

  const formik = useFormik({
    initialValues: {
      code: '',
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
          <HeadingXXLarge>One more step.</HeadingXXLarge>
          {renderErrors}
          <InputWrapper>
            <StyledInput
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              placeholder="888888"
              clearOnEscape
              size="large"
            />
          </InputWrapper>
          <div id="container-recaptcha"></div>
          <InputWrapper>
            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
              Verify
            </Button>
          </InputWrapper>
        </form>
      </InnerContainer>
    </Container>
  )
}

export { Verify }
