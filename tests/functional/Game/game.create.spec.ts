import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { GameStatus } from 'App/Constants/GameStatus'
import Game from 'App/Models/Game'
import Genre from 'App/Models/Genre'
import User from 'App/Models/User'
import { GameFactory, GenreFactory, UserFactory } from 'Database/factories'

let user: User
let gameAttributes: Game
let genres: Genre[]

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    user = await UserFactory.create()
    gameAttributes = await GameFactory.with('author').make()
    genres = await GenreFactory.createMany(2)

    return () => Database.rollbackGlobalTransaction()
  })
}

test.group('Games - Create (Success) ', (group) => {
  setupGroupHooks(group)

  test('should create a game', async ({ client, route }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      genresIds: genres.map((genre) => genre.id),
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      data: {
        ...gameAttributes.toJSON(),
        status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      },
      errors: [],
    })
    response.assertStatus(201)
  })

  test('should add platformUrlPath using the game title', async ({ client, route, assert }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      genresIds: genres.map((genre) => genre.id),
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertStatus(201)

    const game = await Game.first()

    assert.equal(
      game?.platformUrlPath,
      game?.title
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replaceAll(' ', '_')
    )
  })
})

test.group('Games - Create (Failed) ', (group) => {
  setupGroupHooks(group)

  test('should return error if title is already in use', async ({ client, route }) => {
    const game = await GameFactory.with('author').create()

    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      title: game.title,
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'title' is already in use" }],
    })
    response.assertStatus(422)
  })

  test('should return error if title is null', async ({ client, route }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      title: null,
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'title' is required" }],
    })
    response.assertStatus(422)
  })

  test('should return error if description is null', async ({ client, route }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      description: null,
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'description' is required" }],
    })
    response.assertStatus(422)
  })

  test('should return error if price is null', async ({ client, route }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      price: null,
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'price' is required" }],
    })
    response.assertStatus(422)
  })

  test('should return error if price is null', async ({ client, route }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      price: null,
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'price' is required" }],
    })
    response.assertStatus(422)
  })

  test('should return error if status is null', async ({ client, route }) => {
    const requestBody = { ...gameAttributes.toJSON(), status: null, builds: [], images: [] }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'status' is required" }],
    })
    response.assertStatus(422)
  })

  test('should return error if status is invalid', async ({ client, route }) => {
    const requestBody = { ...gameAttributes.toJSON(), status: 'NON-EXISTENT' }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: `The 'status' only accepts the values [${Object.keys(GameStatus)}]` }],
    })
    response.assertStatus(422)
  })

  test('should return error if coverImage is null', async ({ client, route }) => {
    const requestBody = {
      ...gameAttributes.toJSON(),
      status: Object.keys(GameStatus).find((key) => GameStatus[key] === gameAttributes.status),
      coverImage: null,
      builds: [],
      images: [],
    }

    const response = await client
      .post(route('GamesController.create'))
      .loginAs(user)
      .json(requestBody)

    response.assertBodyContains({
      errors: [{ message: "The 'coverImage' is required" }],
    })
    response.assertStatus(422)
  })
})
