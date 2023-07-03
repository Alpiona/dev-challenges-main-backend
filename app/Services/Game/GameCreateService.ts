import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import Game from 'App/Models/Game'
import BaseService from '../BaseService'

export default class GameCreateService implements BaseService<Input, Output> {
  public async execute({
    description,
    price,
    status,
    title,
    projectUrl,
    tagline,
  }: Input): Promise<Output> {
    const platformUrlPath = title
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(' ', '_')

    const game = await Game.create({
      description,
      price,
      status,
      title,
      projectUrl,
      tagline,
      platformUrlPath,
      coverImage: 'needtochange',
    })

    return game
  }

  public schemaValidator = {
    schema: schema.create({
      title: schema.string([rules.unique({ table: 'games', column: 'title' })]),
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
  title: string
  description: string
  price: number
  projectUrl?: string
  tagline?: string
  status: number
}

type Output = Game
