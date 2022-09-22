import Router from '@koa/router'

import * as usersRouter from './modules/users'

const router = new Router()

// Auth
router.post('/login', usersRouter.login)

// Users
router.get('/users', usersRouter.list)
router.post('/users', usersRouter.create)
router.put('/users/:id', usersRouter.update)
router.delete('/users/:id', usersRouter.remove)

export default router
