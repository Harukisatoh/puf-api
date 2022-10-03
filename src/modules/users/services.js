export const decodeBasicAuthToken = basicAuthToken => {
  const [type, encodedCredentials] = basicAuthToken.split(' ')

  if (type !== 'Basic') {
    throw new Error('Wrong token type')
  }

  const decodedString = Buffer.from(encodedCredentials, 'base64').toString()
  const encodedString = Buffer.from(decodedString, 'utf8').toString('base64') // Re-encode credentials to check if it's a base64

  if (encodedString !== encodedCredentials) {
    throw new Error('Token is not base64 encoded')
  }

  const decodedCredentials = decodedString.split(':')

  if (decodedCredentials.length !== 2) {
    throw new Error('Credentials are incorrectly formatted')
  }

  return decodedCredentials
}
