import Factory from '@ioc:Adonis/Lucid/Factory'
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
  return {}
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
