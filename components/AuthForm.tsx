import React from 'react'

type FormType = {
  type: 'sign-in' | 'sign-up'
}

const AuthForm = ({type} : FormType) => {
  return (
    <div>AuthForm</div>
  )
}

export default AuthForm