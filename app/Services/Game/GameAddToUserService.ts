import { Exception } from '@adonisjs/core/build/standalone'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import Game from 'App/Models/Game'
import User from 'App/Models/User'
import BaseService from '../BaseService'

export default class GameAddToUserService implements BaseService<Input, Output> {
  public async execute({ gameId, user }: Input): Promise<Output> {
    const game = await Game.find(gameId)

    if (!game) {
      throw new Exception('Game not found!')
    }

    await game.related('users').save(user)
  }

  public schemaValidator = {
    schema: schema.create({
      gameId: schema.string([rules.uuid()]),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = { user: User; gameId: string }

type Output = void
