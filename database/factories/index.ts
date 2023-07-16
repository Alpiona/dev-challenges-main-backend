import Factory from '@ioc:Adonis/Lucid/Factory'
import { GameStatus } from 'App/Constants/GameStatus'
import { UserTypes } from 'App/Constants/UserTypes'
import Game from 'App/Models/Game'
import GameBuild from 'App/Models/GameBuild'
import GameImage from 'App/Models/GameImage'
import Genre from 'App/Models/Genre'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    type: UserTypes.PLAYER,
  }
})
  .relation('games', () => GameFactory)
  .build()

export const GameFactory = Factory.define(Game, ({ faker }) => {
  const title = faker.lorem.words(3)

  return {
    coverImage: `${faker.string.uuid()}.jpg`,
    description: faker.lorem.paragraphs(4),
    title,
    price: Number(faker.commerce.price({ min: 0, max: 100 })),
    platformUrlPath: title
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replaceAll(' ', '_'),
    projectUrl: faker.internet.url(),
    status: faker.number.int({ min: 1, max: Object.keys(GameStatus).length }),
    tagline: faker.lorem.words(3),
    discount: 0,
  }
})
  .relation('author', () => UserFactory)
  .relation('genres', () => GenreFactory)
  .relation('users', () => UserFactory)
  .build()

export const GenreFactory = Factory.define(Genre, ({ faker }) => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.lorem.word(),
  }
})
  .relation('games', () => Game)
  .build()

export const BuildFactory = Factory.define(GameBuild, ({ faker }) => {
  return {
    fileExtension: faker.system.commonFileExt(),
    operatingSystemId: faker.number.int(),
    size: `${faker.number.int({ min: 1, max: 999 })}MB`,
    version: `${faker.number.int({ min: 1, max: 15 })}.${faker.number.int()}`,
  }
})
  .relation('games', () => Game)
  .build()

export const ImageFactory = Factory.define(GameImage, ({ faker }) => {
  return {
    fileExtension: faker.system.commonFileExt(),
  }
})
  .relation('games', () => Game)
  .build()
