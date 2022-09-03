import Router from '@koa/router'

import * as usersRouter from './modules/users'

const router = new Router()

router.get('/users', usersRouter.list)
router.post('/users', usersRouter.create)
router.put('/users', usersRouter.update)
router.delete('/users', usersRouter.remove)

export default router
