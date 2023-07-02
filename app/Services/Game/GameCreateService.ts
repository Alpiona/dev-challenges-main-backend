import { Exception } from '@adonisjs/core/build/standalone'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import User from 'App/Models/User'
import BaseService from '../BaseService'

export default class GameCreateService implements BaseService<Input, Output> {
  public async execute({ email, password, username }: Input): Promise<Output> {
    const user = await User.query().where('email', email).orWhere('username', username).first()

    if (!user) {
      await User.create({ email, password, username })
    } else if (user.email === email) {
      throw new Exception('Email already in use', 409, 'E_UNIQUE_EMAIL')
    } else if (user.username === username) {
      throw new Exception('Username already in use', 409, 'E_UNIQUE_USERNAME')
    }
  }

  /**
   * Header do jogo
  - Imagens cadastradas do jogo
  - Título do jogo
  - Descrição
  - Builds
  - Preço
   */

  public schemaValidator = {
    schema: schema.create({
      title: schema.string(),
      description: schema.string(),
      price: schema.number(),
      projectUrl: schema.string.optional(),
      tagline: schema.string.optional(),
      status: schema.number(),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  email: string
  password: string
  username: string
}

type Output = void
