import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Game from 'App/Models/Game'
import { GameFactory, UserFactory } from 'Database/factories'

let games: Game[]

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    games = await GameFactory.with('author').createMany(5)
    games.sort((a, b) => a.title.localeCompare(b.title))

    return () => Database.rollbackGlobalTransaction()
  })
}

test.group('Games - Get List (Success)', (group) => {
  setupGroupHooks(group)

  test('should return games list', async ({ client, route }) => {
    const response = await client.get(route('GamesController.getList'))

    response.assertStatus(200)
    response.assertBody({
      data: games.map((game) => {
        return { ...game.toJSON(), images: [], builds: [] }
      }),
      errors: [],
    })
  })
  test('should return games list filtered by sale', async ({ client, route }) => {
    await GameFactory.merge({ discount: 0.25 }).with('author').createMany(3)

    const gamesOnSale = await Game.query()
      .where('discount', '>', 0)
      .orderBy('title')
      .preload('author')
      .preload('builds')
      .preload('images')

    const response = await client.get(route('GamesController.getList')).qs({ onSale: true })

    gamesOnSale.sort((a, b) => a.title.localeCompare(b.title))

    response.assertStatus(200)
    response.assertBody({
      data: gamesOnSale.map((game) => game.toJSON()),
      errors: [],
    })
  })

  test('should return games list filtered by games bought', async ({ client, route }) => {
    const user = await UserFactory.create()
    await GameFactory.merge({ authorId: user.id }).createMany(5)
    const userGames = await Game.query()
      .join('game_user', 'games.id', 'game_user.game_id')
      .where('game_user.user_id', user.id)
      .preload('author')

    userGames.sort((a, b) => a.title.localeCompare(b.title))

    const response = await client
      .get(route('GamesController.getList'))
      .qs({ hasBought: true })
      .loginAs(user)

    response.assertStatus(200)
    response.assertBody({ data: userGames.map((game) => game.toJSON()), errors: [] })
  })

  test('should return games list filtered by max price', async ({ client, route }) => {
    const response = await client.get(route('GamesController.getList')).qs('maxPrice', 15)

    const gamesFiltered = games.filter((game) => game.price <= 15)

    response.assertStatus(200)
    response.assertBody({
      data: gamesFiltered.map((game) => {
        return { ...game.toJSON(), images: [], builds: [] }
      }),
      errors: [],
    })
  })
})
