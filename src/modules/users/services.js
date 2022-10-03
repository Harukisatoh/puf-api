export class TokenTypeError extends Error {
  constructor(message = 'Wrong token type') {
    super()
    this.message = message
    this.name = 'TokenTypeError'
  }
}

export class TokenEncodeError extends Error {
  constructor(message = 'Token is not base64 encoded') {
    super()
    this.message = message
    this.name = 'TokenEncodeError'
  }
}

export class CredentialsFormatError extends Error {
  constructor(message = 'Credentials are incorrectly formatted') {
    super()
    this.message = message
    this.name = 'CredentialsFormatError'
  }
}

export const decodeBasicAuthToken = basicAuthToken => {
  const [type, encodedCredentials] = basicAuthToken.split(' ')

  if (type !== 'Basic') {
    throw new TokenTypeError()
  }

  const decodedString = Buffer.from(encodedCredentials, 'base64').toString()
  const encodedString = Buffer.from(decodedString, 'utf8').toString('base64') // Re-encode credentials to check if it's a base64 encoding

  if (encodedString !== encodedCredentials) {
    throw new TokenEncodeError()
  }

  const decodedCredentials = decodedString.split(':')

  if (decodedCredentials.length !== 2) {
    throw new CredentialsFormatError()
  }

  return decodedCredentials
}
