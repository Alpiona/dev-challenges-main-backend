import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Genre from 'App/Models/Genre'
import { GenreFactory } from 'Database/factories'

let genres: Genre[]

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    genres = await GenreFactory.createMany(5)

    return () => Database.rollbackGlobalTransaction()
  })
}

test.group('Games - Get Genres (Success)', (group) => {
  setupGroupHooks(group)

  test('should return genres list', async ({ client, route }) => {
    const response = await client.get(route('GamesController.getGenres'))

    response.assertStatus(200)
    response.assertBodyContains({
      data: genres.map((genre) => genre.toJSON()),
      errors: [],
    })
  })
})
