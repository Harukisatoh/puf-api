import request from 'supertest'
import jwt from 'jsonwebtoken'

import { prisma } from '~/data'

import { app } from './server-setup'

const server = app.listen()

const existingUser = {
  name: 'Gabriel',
  email: 'existent@email.com',
  hashedPassword:
    '$2b$10$EqHJJ/k/88ZrKWdR2bntduYKlqQMv6ev8DBvyPTnemx5l92yPKv1u', // 123456
  rawPassword: '123456',
}

describe('User routes', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({})
    const { id: createdUserId } = await prisma.user.create({
      data: {
        name: existingUser.name,
        email: existingUser.email,
        password: existingUser.hashedPassword,
      },
    })

    existingUser.id = createdUserId
  })

  afterAll(() => {
    server.close()
  })

  it("should return a 404 error if email doesn't exists", async () => {
    const email = 'inexistent@email.com'
    const password = existingUser.rawPassword

    const response = await request(server).get('/login').auth(email, password)

    expect(response.status).toBe(404)
  })

  it('should return a 404 error if password is wrong', async () => {
    const email = existingUser.email
    const password = 'wrong_password'

    const response = await request(server).get('/login').auth(email, password)

    expect(response.status).toBe(404)
  })

  it('should return a success with the corresponding user when credentials are correct', async () => {
    const email = existingUser.email
    const password = existingUser.rawPassword

    const response = await request(server).get('/login').auth(email, password)
    const decodedToken = jwt.verify(response.body.token, process.env.JWT_SECRET)

    expect(response.status).toBe(200)
    expect(response.body.user).toBeTruthy()
    expect(response.body.user.id).toBeTruthy()
    expect(response.body.user.email).toBe(email)
    expect(response.body.user.password).toBeFalsy()

    expect(decodedToken.sub).toBe(existingUser.id)
  })
})
