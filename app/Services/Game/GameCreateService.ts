import { Exception } from '@adonisjs/core/build/standalone'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import { GameStatus } from 'App/Constants/GameStatus'
import Game from 'App/Models/Game'
import GameBuild from 'App/Models/GameBuild'
import GameImage from 'App/Models/GameImage'
import BaseService from '../BaseService'

export default class GameCreateService implements BaseService<Input, Output> {
  public async execute({
    auth,
    description,
    price,
    status,
    title,
    projectUrl,
    tagline,
    coverImage,
    genresIds,
    builds,
    images,
  }: Input): Promise<Output> {
    const { user } = auth

    if (!user) {
      throw new Exception('Access unauthorized', 401, 'E_UNAUTHORIZED_ACCESS')
    }

    const platformUrlPath = title
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replaceAll(' ', '_')

    const game = await Game.create({
      authorId: user.id,
      description,
      price,
      status: GameStatus[status],
      title,
      projectUrl,
      tagline,
      platformUrlPath,
      coverImage,
    })

    await this.syncBuilds(game.id, builds)
    await this.syncImages(game.id, images)

    await game.related('genres').sync(genresIds)

    return game
  }

  private async syncBuilds(gameId: string, builds: string[]) {
    const ids = builds.map((build) => build.split('.')[0])
    await GameBuild.query().whereIn('id', ids).update('gameId', gameId)
  }

  private async syncImages(gameId: string, images: string[]) {
    const ids = images.map((image) => image.split('.')[0])
    await GameImage.query().whereIn('id', ids).update('gameId', gameId)
  }

  public schemaValidator = {
    schema: schema.create({
      title: schema.string([rules.unique({ table: 'games', column: 'title' })]),
      description: schema.string(),
      price: schema.number(),
      projectUrl: schema.string.optional(),
      tagline: schema.string.optional(),
      status: schema.enum(Object.keys(GameStatus)),
      coverImage: schema.string(),
      genresIds: schema.array([rules.distinct('*')]).members(schema.number()),
      builds: schema.array([rules.distinct('*')]).members(schema.string()),
      images: schema.array([rules.distinct('*')]).members(schema.string()),
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
  status: string
  coverImage: string
  auth: AuthContract
  genresIds: number[]
  builds: string[]
  images: string[]
}

type Output = Game
