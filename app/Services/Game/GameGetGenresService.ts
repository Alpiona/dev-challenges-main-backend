import { schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import Genre from 'App/Models/Genre'
import BaseService from '../BaseService'

export default class GameGetGenresService implements BaseService<Input, Output> {
  public async execute({}: Input): Promise<Output> {
    const genres = await Genre.query().orderBy('name', 'asc')

    return genres
  }

  public schemaValidator = {
    schema: schema.create({}),
    messages: DefaultValidatorMessages,
  }
}

type Input = {}

type Output = Genre[]
