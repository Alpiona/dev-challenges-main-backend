import Factory from '@ioc:Adonis/Lucid/Factory'
import { UserTypes } from 'App/Constants/UserTypes'
import User from 'App/Models/User'

export default Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    type: UserTypes.PLAYER,
  }
}).build()
