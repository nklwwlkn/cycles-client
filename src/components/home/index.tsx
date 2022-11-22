import { Button } from 'baseui/button'
import { DisplayXSmall } from 'baseui/typography'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'

import UserService from '../../services/UserService'

import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from '../commons'

type propType = {
  onLogout: () => void
}

type UserPayload = {
  id: number
  phoneNumber: string
  name: string | null
  email: string | null
}

const DEFAULT_USER_DATA = {
  name: 'No name yet',
  emain: 'No email yet',
}

function Home({ onLogout }: propType) {
  const [errors, setErrors] = useState<any[]>([])
  const [user, setUser] = useState<Partial<UserPayload>>(DEFAULT_USER_DATA)

  useEffect(() => {
    UserService.getMe(setUser, setErrors)
  }, [])

  const onSubmit = async (values: {
    email: UserPayload['email']
    name: UserPayload['name']
  }) => {
    setErrors([])

    await UserService.updateMe(values, setUser, setErrors)
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
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
        <DisplayXSmall>Name: {user.name}</DisplayXSmall>
        <DisplayXSmall>Email: {user.email}</DisplayXSmall>
        <form onSubmit={formik.handleSubmit}>
          {renderErrors}
          <InputWrapper>
            <StyledInput
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="John"
              clearOnEscape
              size="large"
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="test@test.com"
              clearOnEscape
              size="large"
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
              Save
            </Button>
          </InputWrapper>
        </form>
        <Button
          size="large"
          kind="primary"
          onClick={onLogout}
          isLoading={formik.isSubmitting}
        >
          Logout
        </Button>
      </InnerContainer>
    </Container>
  )
}

export { Home }
