import { schema } from '@ioc:Adonis/Core/Validator'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import { OperatingSystems } from 'App/Constants/OperatingSystems'
import Game from 'App/Models/Game'
import BaseService from '../BaseService'

export default class GameGetListService implements BaseService<Input, Output> {
  public async execute({
    createdAt,
    genre,
    hasBought,
    maxPrice,
    onSale,
    operatingSystem,
    userId,
  }: Input): Promise<Output> {
    const query = this.getQuery(
      createdAt,
      genre,
      hasBought,
      maxPrice,
      onSale,
      operatingSystem,
      userId
    )

    const games = await query.exec()

    return games
  }

  private getQuery(
    createdAt: string | undefined,
    genre: string | undefined,
    hasBought: boolean | undefined,
    maxPrice: number | undefined,
    onSale: boolean | undefined,
    operatingSystem: string | undefined,
    userId: string | undefined
  ): ModelQueryBuilderContract<typeof Game, Game> {
    const query = Game.query()
      .orderBy('title')
      .if(hasBought, (query) => {
        query.join('game_user', 'games.id', 'game_user.game_id')
        query.where('game_user.user_id', userId!)
      })
      .if(createdAt, (query) => {
        query.where('created_at', '>=', createdAt!)
      })
      .if(genre, (query) => {
        query.whereHas('genres', (genreQuery) => {
          genreQuery.where('genres.id', genre!)
        })
      })
      .if(!isNaN(maxPrice!), (query) => {
        query.where('price', '<=', maxPrice!)
      })
      .if(onSale, (query) => {
        query.where('discount', '>', 0)
      })
      .if(operatingSystem, (query) => {
        query.whereHas('builds', (buildQuery) => {
          buildQuery.where('game_builds.operating_system_id', OperatingSystems[operatingSystem!])
        })
      })
      .preload('author')
      .preload('images')
      .preload('builds')

    return query
  }

  public schemaValidator = {
    schema: schema.create({
      hasBought: schema.boolean.optional(),
      maxPrice: schema.number.optional(),
      onSale: schema.boolean.optional(),
      createdAt: schema.string.optional(),
      genre: schema.string.optional(),
      operatingSystem: schema.string.optional(),
      status: schema.string.optional(),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  userId?: string
  hasBought?: boolean
  maxPrice?: number
  onSale?: boolean
  createdAt?: string
  genre?: string
  operatingSystem?: string
  status?: string
}

type Output = Game[]
