import { Exception } from '@adonisjs/core/build/standalone'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import { UserTypes } from 'App/Constants/UserTypes'
import User from 'App/Models/User'
import BaseService from '../BaseService'

export default class UserCreateService implements BaseService<Input, Output> {
  public async execute({ email, password, username }: Input): Promise<Output> {
    const user = await User.query().where('email', email).orWhere('username', username).first()

    if (!user) {
      await User.create({ email, password, username, type: UserTypes.PLAYER })
    } else if (user.email === email) {
      throw new Exception('Email already in use', 409, 'E_UNIQUE_EMAIL')
    } else if (user.username === username) {
      throw new Exception('Username already in use', 409, 'E_UNIQUE_USERNAME')
    }
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string([rules.email()]),
      username: schema.string(),
      password: schema.string({}, [rules.minLength(6), rules.confirmed('passwordConfirmation')]),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  email: string
  username: string
  password: string
}

type Output = void
