import { rules, schema } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { DefaultValidatorMessages } from 'App/Constants/DefaultValidatorMessages'
import Game from 'App/Models/Game'
import BaseService from '../BaseService'

export default class GameGetOneService implements BaseService<Input, Output> {
  public async execute({ params: { platformUrlPath }, userId }: Input): Promise<Output> {
    const game = await Game.query()
      .select('*')
      .where('platformUrlPath', platformUrlPath)
      .if(userId, (query) => {
        query.select(
          Database.raw(`
          EXISTS(SELECT * FROM game_user WHERE game_user.game_id = games.id and game_user.user_id = '${userId}') as bought
          `)
        )
      })
      .firstOrFail()

    const hasBought = game.$extras.bought
    const buildsFields = ['version', 'size', 'operatingSystem']

    if (hasBought) {
      buildsFields.push('url')
    }

    await game.load('builds')
    await game.load('images')
    await game.load('genres')
    await game.load('author')

    const gameFormatted = game.serialize({
      relations: {
        author: {
          fields: ['email'],
        },
        builds: {
          fields: buildsFields,
        },
      },
    })

    return gameFormatted
  }

  public schemaValidator = {
    schema: schema.create({
      params: schema.object().members({
        platformUrlPath: schema.string([
          rules.exists({ table: 'games', column: 'platform_url_path' }),
        ]),
      }),
    }),
    messages: DefaultValidatorMessages,
  }
}

type Input = {
  params: {
    platformUrlPath: string
  }
  userId?: string
}

type Output = ModelObject
