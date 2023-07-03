import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GameCreateService from 'App/Services/Game/GameCreateService'
import GameGetListService from 'App/Services/Game/GameGetListService'
import GameGetOneService from 'App/Services/Game/GameGetOneService'

export default class GamesController {
  async create({ response, request, response }: HttpContextContract) {
    const service = new GameCreateService()

    const input = await request.validate(service.schemaValidator)

    await service.execute(input)

    return response.created({ data: {}, errors: [] })
  }

  async getList({ response, request, response }: HttpContextContract) {
    const service = new GameGetListService()

    const input = await request.validate(service.schemaValidator)

    await service.execute(input)

    return response.created({ data: {}, errors: [] })
  }

  async getOne({ response, request, response }: HttpContextContract) {
    const service = new GameGetOneService()

    const input = await request.validate(service.schemaValidator)

    await service.execute(input)

    return response.created({ data: {}, errors: [] })
  }

  // async uploadImage({ response, request, response }: HttpContextContract) {}

  // async uploadCoverImage({ response, request, response }: HttpContextContract) {}

  // async uploadBuild({ response, request, response }: HttpContextContract) {}

  // async buyGame({ response, request, response }: HttpContextContract) {}
}
