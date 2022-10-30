import { prisma } from '~/data'

export const findUnique = prisma.user.findUnique
export const findMany = prisma.user.findMany
export const create = prisma.user.create
export const update = prisma.user.update
export const remove = prisma.user.delete
