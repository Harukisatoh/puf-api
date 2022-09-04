import Koa from 'koa'
import router from './router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(process.env.SERVER_PORT)
