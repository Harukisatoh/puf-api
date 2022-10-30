import request from 'supertest'

import { app } from './server-setup'

const server = app.listen()

describe('User routes', () => {
  afterAll(() => {
    server.close()
  })

  it("should return a 404 error if email doesn't exists", async () => {
    // TODO: Need to clear database to ensure email doesn't exist
    const email = 'inexistent@email.com'
    const password = '123456'

    const response = await request(server).get('/login').auth(email, password)

    expect(response.status).toBe(404)
  })

  it('should return a 404 error if password is wrong', async () => {
    // TODO: Need to create user in the db with another password before trying to login
    const email = 'existent@email.com'
    const password = 'wrong_password'

    const response = await request(server).get('/login').auth(email, password)

    expect(response.status).toBe(404)
  })

  // it('should return a 404 error if password is not correct', () => {
  //   const email = 'gabriel@haruki.com'
  //   const password = '123456'

  //   const credentials = `${email}:${password}`

  //   const token = Buffer.from(credentials, 'utf-8').toString('base64')
  //   const basicAuthToken = `Basic ${token}`

  //   const result = decodeBasicAuthToken(basicAuthToken)

  //   expect(result).toEqual([email, password])
  // })
})
