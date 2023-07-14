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
    response.assertBody({ data: games.map((game) => game.toJSON()), errors: [] })
  })

  test('should return games list filtered by free price', async ({ client, route }) => {
    const response = await client.get(route('GamesController.getList'))

    response.assertStatus(200)
    response.assertBody({
      data: games.map((game) => game.toJSON()).filter((game) => game.price === 0),
      errors: [],
    })
  })

  test('should return games list filtered by sale', async ({ client, route }) => {
    const response = await client.get(route('GamesController.getList'))

    response.assertStatus(200)
    response.assertBody({
      data: games.map((game) => game.toJSON()).filter((game) => game.price !== 0),
      errors: [],
    })
  }).skip()

  test('should return games list filtered by games bought', async ({ client, route }) => {
    const user = await UserFactory.with('games', 3).create()

    await user.load('games')
    user.games.sort((a, b) => a.title.localeCompare(b.title))

    const response = await client.get(route('GamesController.getList'))

    response.assertStatus(200)
    response.assertBody({ data: user.games.map((game) => game.toJSON()), errors: [] })
  })

  test('should return games list filtered by max price', async ({ client, route }) => {
    const response = await client.get(route('GamesController.getList'))

    const gamesFiltered = games.filter((game) => game.price <= 15)

    response.assertStatus(200)
    response.assertBody({ data: gamesFiltered.map((game) => game.toJSON()), errors: [] })
  })
})
