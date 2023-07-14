import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/games', 'GamesController.getList')

  Route.get('/games/genres', 'GamesController.getGenres')

  Route.get('/games/operating-systems', 'GamesController.getOperatingSystems')

  Route.get('/games/:platformUrlPath', 'GamesController.getOne')
})

Route.group(() => {
  Route.post('/games', 'GamesController.create')

  Route.post('/games/get-game', 'GamesController.addGameTouUser')
}).middleware('auth')
