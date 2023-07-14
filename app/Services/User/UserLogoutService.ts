import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { schema } from '@ioc:Adonis/Core/Validator'
import BaseService from '../BaseService'

export default class UserLogoutService implements BaseService<Input, Output> {
  public async execute({ auth }: Input): Promise<Output> {
    await auth.use('api').logout()
  }

  public schemaValidator = {
    schema: schema.create({}),
  }
}

type Input = {
  auth: AuthContract
}

type Output = void
