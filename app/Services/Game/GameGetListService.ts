import { schema } from '@ioc:Adonis/Core/Validator'
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
    console.log(
      Game.query()
        .preload('images')
        .preload('builds')
        .orderBy('title')
        .if(hasBought, (query) => {
          query.join('game_user', 'games.id', 'game_user.game_id')
          query.where('game_user.user_id', userId!)
        })
        .if(createdAt, (query) => {
          query.where('created_at', '>=', createdAt!)
        })
        .if(genre, (query) => {
          query.join('game_genre', 'games.id', 'game_genre.game_id')
          query.whereIn('game_genre.genre_id', [genre!])
        })
        .if(!isNaN(maxPrice!), (query) => {
          query.where('price', '<=', maxPrice!)
        })
        .if(onSale, (query) => {
          query.where('discount', '!=', 0)
        })
        .if(operatingSystem, (query) => {
          query.join('game_builds', 'games.id', 'game_builds.game_id')
          query.where('game_builds.operating_system_id', OperatingSystems[operatingSystem!])
        })
        .toQuery()
    )
    const games = await Game.query()
      .orderBy('title')
      .if(hasBought, (query) => {
        query.join('game_user', 'games.id', 'game_user.game_id')
        query.where('game_user.user_id', userId!)
      })
      .if(createdAt, (query) => {
        query.where('created_at', '>=', createdAt!)
      })
      .if(genre, (query) => {
        query.leftJoin('game_genre', 'games.id', 'game_genre.game_id')
        query.where('game_genre.genre_id', genre!)
      })
      .if(!isNaN(maxPrice!), (query) => {
        query.where('price', '<=', maxPrice!)
      })
      .if(onSale, (query) => {
        query.where('discount', '!=', 0)
      })
      .if(operatingSystem, (query) => {
        query.join('game_builds', 'games.id', 'game_builds.game_id')
        query.where('game_builds.operating_system_id', OperatingSystems[operatingSystem!])
      })
      .preload('images')
      .preload('builds')

    return games
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
