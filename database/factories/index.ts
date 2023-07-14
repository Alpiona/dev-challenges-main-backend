import Factory from '@ioc:Adonis/Lucid/Factory'
import { GameStatus } from 'App/Constants/GameStatus'
import { UserTypes } from 'App/Constants/UserTypes'
import Game from 'App/Models/Game'
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
  const title = faker.commerce.productName()

  return {
    coverImage: `${faker.string.uuid()}.jpg`,
    description: faker.lorem.paragraphs(4),
    title,
    price: Number(faker.commerce.price({ min: 0, max: 100 })),
    platformUrlPath: title.replace(' ', '_'),
    projectUrl: faker.internet.url(),
    status: faker.number.int({ min: 1, max: Object.keys(GameStatus).length }),
    tagline: faker.lorem.words(3),
  }
})
  .relation('author', () => UserFactory)
  .relation('genres', () => GenreFactory)
  .relation('users', () => UserFactory)
  .build()

export const GenreFactory = Factory.define(Genre, ({ faker }) => {
  return {}
})
  .relation('games', () => Game)
  .build()
