import { schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import Game from 'App/Models/Game'
import BaseService from '../BaseService'

export default class GameGetListService implements BaseService<Input, Output> {
  public async execute({}: Input): Promise<Output> {
    const games = await Game.all()

    return games
  }

  public schemaValidator = {
    schema: schema.create({}),
    messages: DefaultValidatorMessages,
  }
}

type Input = {}

type Output = Game[]
