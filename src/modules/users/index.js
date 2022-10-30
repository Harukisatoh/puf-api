import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { omit } from 'ramda'

import { prisma } from '~/data'

import { decodeBasicAuthToken } from './services'

const errorStatuses = {
  TokenTypeError: 400,
  TokenEncodeError: 400,
  CredentialsFormatError: 400,
}

export const login = async ctx => {
  try {
    const [email, password] = decodeBasicAuthToken(
      ctx.request.headers.authorization
    )

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    const isPasswordEqual = await bcrypt.compare(password, user?.password || '')

    if (!user || !isPasswordEqual) {
      ctx.status = 404
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

    ctx.body = {
      user: omit(['password'], user),
      token,
    }
  } catch (error) {
    const errorStatusCode = errorStatuses[error.name] || 500
    const errorMessage =
      error.message || 'Ops! Algo deu errado, tente novamente.'

    ctx.status = errorStatusCode
    ctx.body = errorMessage
  }
}

export const list = async ctx => {
  try {
    const users = await prisma.user.findMany()

    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}

export const create = async ctx => {
  const { name, email, password } = ctx.request.body

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    })

    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}

export const update = async ctx => {
  const { name, email } = ctx.request.body

  try {
    const user = await prisma.user.update({
      where: {
        id: ctx.params.id,
      },
      data: {
        name,
        email,
      },
    })

    ctx.body = user
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}

export const remove = async ctx => {
  try {
    await prisma.user.delete({
      where: {
        id: ctx.params.id,
      },
    })

    ctx.body = { id: ctx.params.id }
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
  }
}
