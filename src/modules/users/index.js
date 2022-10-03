import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

import { decodeBasicAuthToken } from './services'

export const login = async ctx => {
  const [email, password] = decodeBasicAuthToken(
    ctx.request.headers.authorization
  )

  try {
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
      user,
      token,
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ops! Algo deu errado, tente novamente.'
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
