import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserCreateService from 'App/Services/User/UserCreateService'
import UserLoginService from 'App/Services/User/UserLoginService'
import UserLogoutService from 'App/Services/User/UserLogoutService'

export default class UsersController {
  public async create({ request, response }: HttpContextContract) {
    const service = new UserCreateService()

    const input = await request.validate(service.schemaValidator)

    await service.execute(input)

    return response.created({ data: {}, errors: [] })
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const service = new UserLoginService()

    const input = await request.validate(service.schemaValidator)

    const output = await service.execute({ ...input, auth })

    return response.ok({
      data: output,
      errors: [],
    })
  }

  public async logout({ response, auth }: HttpContextContract) {
    const service = new UserLogoutService()

    await service.execute({ auth })

    return response.ok({
      data: {},
      errors: [],
    })
  }
}
