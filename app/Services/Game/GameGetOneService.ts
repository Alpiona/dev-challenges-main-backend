import { schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import Game from 'App/Models/Game'
import BaseService from '../BaseService'

export default class GameGetOneService implements BaseService<Input, Output> {
  public async execute({ id }: Input): Promise<Output> {
    const game = await Game.findOrFail(id)

    return game
  }

  public schemaValidator = {
    schema: schema.create({}),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  id: string
}

type Output = Game
