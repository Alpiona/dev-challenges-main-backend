import Route from '@ioc:Adonis/Core/Route'
import './routes/userRoutes'

Route.get('/', async () => {
  return { hello: 'world' }
})
