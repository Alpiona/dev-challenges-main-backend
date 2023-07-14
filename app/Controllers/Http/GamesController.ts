import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameAddToUserService from 'App/Services/Game/GameAddToUserService'
import GameCreateService from 'App/Services/Game/GameCreateService'
import GameGetGenresService from 'App/Services/Game/GameGetGenresService'
import GameGetListService from 'App/Services/Game/GameGetListService'
import GameGetOneService from 'App/Services/Game/GameGetOneService'

export default class GamesController {
  public async create({ response, request, auth }: HttpContextContract) {
    const service = new GameCreateService()

    let input = await request.validate(service.schemaValidator)

    const output = await service.execute({
      ...input,
      auth,
    })

    return response.created({ data: output, errors: [] })
  }

  public async getList({ response, request, auth }: HttpContextContract) {
    let userId

    try {
      userId = (await auth.use('api').authenticate()).id
    } catch {}

    const service = new GameGetListService()

    const input = await request.validate(service.schemaValidator)
    console.log(input)

    const output = await service.execute({ ...input, userId })

    return response.ok({ data: output, errors: [] })
  }

  public async getOne({ response, request, auth }: HttpContextContract) {
    let userId

    try {
      userId = (await auth.use('api').authenticate()).id
    } catch {}

    const service = new GameGetOneService()

    const input = await request.validate(service.schemaValidator)

    const output = await service.execute({ ...input, userId })

    return response.ok({ data: output, errors: [] })
  }

  public async getGenres({ response, request }: HttpContextContract) {
    const service = new GameGetGenresService()

    const input = await request.validate(service.schemaValidator)

    const output = await service.execute(input)

    return response.ok({ data: output, errors: [] })
  }

  public async addGameTouUser({ response, request, auth }: HttpContextContract) {
    const service = new GameAddToUserService()

    const input = await request.validate(service.schemaValidator)

    const output = await service.execute({ ...input, user: auth.user! })

    return response.ok({ data: output, errors: [] })
  }
}
