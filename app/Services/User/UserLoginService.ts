import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { ConfigurationValues } from 'App/Constants/ConfigurationValues'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import { UserTypes } from 'App/Constants/UserTypes'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import BaseService from '../BaseService'

export default class UserLoginService implements BaseService<Input, Output> {
  public async execute({ email, username, password, auth }: Input): Promise<Output> {
    const user = await User.query()
      .if(email, (query) => {
        query.where('email', email!)
      })
      .if(username, (query) => {
        query.where('username', username!)
      })
      .first()

    if (!user) {
      throw new Exception('Invalid credentials', 401, 'E_INVALID_CREDENTIALS')
    }

    const token = await auth.use('api').attempt(user!.email || user!.email, password, {
      expiresIn: ConfigurationValues.TOKEN_EXPIRATION,
    })

    return {
      accessType: Object.keys(UserTypes).find((key) => UserTypes[key] === user.type)!,
      username: user.username,
      token: token.token,
      expiresAt: token.expiresAt,
    }
  }

  public schemaValidator = {
    schema: schema.create({
      email: schema.string.optional([rules.email(), rules.requiredIfNotExists('username')]),
      username: schema.string.optional([rules.requiredIfNotExists('email')]),
      password: schema.string({}, [rules.minLength(6)]),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  email?: string
  username?: string
  password: string
  auth: AuthContract
}

type Output = {
  username: string
  accessType: string
  token: string
  expiresAt?: DateTime
}
