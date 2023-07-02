import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GamesController {
  async create({ response, request, response }: HttpContextContract) {}

  async getList({ response, request, response }: HttpContextContract) {}

  async getOne({ response, request, response }: HttpContextContract) {}

  async uploadImage({ response, request, response }: HttpContextContract) {}

  async uploadCoverImage({ response, request, response }: HttpContextContract) {}

  async uploadBuild({ response, request, response }: HttpContextContract) {}

  async buyGame({ response, request, response }: HttpContextContract) {}
}
