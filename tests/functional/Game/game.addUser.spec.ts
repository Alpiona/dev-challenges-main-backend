import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import { GameFactory, UserFactory } from 'Database/factories'

let game: Game
let user: User

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    game = await GameFactory.with('author').create()
    user = await UserFactory.create()

    return () => Database.rollbackGlobalTransaction()
  })
}

test.group('Games - Add User (Success)', (group) => {
  setupGroupHooks(group)

  test('should return without errors', async ({ client, route }) => {
    const payload = {
      gameId: game.id,
    }

    const response = await client
      .post(route('GamesController.addGameTouUser'))
      .json(payload)
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      errors: [],
    })
  })

  test('should add game to the user', async ({ client, route, assert }) => {
    const payload = {
      gameId: game.id,
    }

    const response = await client
      .post(route('GamesController.addGameTouUser'))
      .json(payload)
      .loginAs(user)

    response.assertStatus(200)

    await user.load('games')

    assert.equal(user.games.length, 1)
    assert.equal(user.games[0].id, game.id)
  })
})
