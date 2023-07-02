import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

const password = 'Pass@123'
let user: User

const setupGroupHooks = (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    user = await UserFactory.merge({ password }).create()

    return () => Database.rollbackGlobalTransaction()
  })

  group.tap((test) => test.tags(['user-logout']))
}

test.group('Users - Logout (Success)', (group) => {
  setupGroupHooks(group)

  test('should logout user', async ({ client, route, assert }) => {
    const requestBody = { email: user.email, password }
    const loginResponse = await client.post(route('UsersController.login')).json(requestBody)

    const { token } = loginResponse.body().data

    const firstResponse = await client
      .delete(route('UsersController.logout'))
      .header('Authorization', `Bearer ${token}`)

    assert.property(firstResponse.body(), 'errors')
    assert.isEmpty(firstResponse.body().errors)

    const secondResponse = await client
      .delete(route('UsersController.logout'))
      .header('Authorization', `Bearer ${token}`)

    secondResponse.assertTextIncludes('Access unauthorized')
    secondResponse.assertStatus(401)
  })
})

test.group('Users - Logout (Failed)', (group) => {
  setupGroupHooks(group)

  test('should return error without authentication', async ({ client, route }) => {
    const requestBody = { email: user.email, password }
    await client.post(route('UsersController.login')).json(requestBody)

    const response = await client.delete(route('UsersController.logout'))

    response.assertTextIncludes('Access unauthorized')
    response.assertStatus(401)
  })
})
