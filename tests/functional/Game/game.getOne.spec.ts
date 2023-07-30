import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Game from 'App/Models/Game'
import { GameFactory } from 'Database/factories'

let game: Game

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    game = await GameFactory.with('author').create()

    return () => Database.rollbackGlobalTransaction()
  })
}

test.group('Games - Get One (Success)', (group) => {
  setupGroupHooks(group)

  test('should return game', async ({ client, route }) => {
    const response = await client.get(
      route('GamesController.getOne', { platformUrlPath: game.platformUrlPath })
    )

    response.assertStatus(200)
    response.assertBodyContains({
      data: game.toJSON(),
      errors: [],
    })
  })
})

test.group('Games - Get One (Failure)', (group) => {
  setupGroupHooks(group)

  test('should return error if game does not exist', async ({ client, route }) => {
    const response = await client.get(
      route('GamesController.getOne', { platformUrlPath: 'game.platformUrlPath' })
    )

    response.assertStatus(422)
    response.assertBodyContains({
      data: {},
      errors: [{ message: 'The data you are looking for could not be found' }],
    })
  })
})
