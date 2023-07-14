import Route from '@ioc:Adonis/Core/Route'
import './routes/filesRoutes'
import './routes/gameRoutes'
import './routes/userRoutes'

Route.get('/', async () => {
  return { hello: 'world' }
})
