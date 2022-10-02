import { decodeBasicAuthToken } from './index'

describe('User module', () => {
  it('should decode basic auth token', () => {
    const email = 'gabriel@haruki.com'
    const password = '123456'

    const credentials = `${email}:${password}`

    const token = Buffer.from(credentials, 'utf-8').toString('base64')
    const basicAuthToken = `Basic ${token}`

    const result = decodeBasicAuthToken(basicAuthToken)

    expect(result).toEqual([email, password])
  })

  it('should throw an error if the token is not a basic auth token', () => {
    const email = 'gabriel@haruki.com'
    const password = '123456'

    const credentials = `${email}:${password}`

    const token = Buffer.from(credentials, 'utf-8').toString('base64')
    const bearerAuthToken = `Bearer ${token}` // Bearer token is not a valid option

    const decode = () => decodeBasicAuthToken(bearerAuthToken)

    expect(decode).toThrowError('Wrong token type')
  })

  it('should throw an error if the credentials has a wrong format', () => {
    const email = 'gabriel@haruki.com'
    const password = '123456'

    const credentials = `${email}${password}` // The correct format would be: 'email:password'

    const token = Buffer.from(credentials, 'utf-8').toString('base64')
    const basicAuthToken = `Basic ${token}`

    const decode = () => decodeBasicAuthToken(basicAuthToken)

    expect(decode).toThrowError('Credentials are incorrectly formatted')
  })

  it('should throw an error if the token is not base64 encoded', () => {
    const email = 'gabriel@haruki.com'
    const password = '123456'

    const credentials = `${email}:${password}`

    const basicAuthToken = `Basic ${credentials}`

    const decode = () => decodeBasicAuthToken(basicAuthToken)

    expect(decode).toThrowError('Token is not base64 encoded')
  })
})
