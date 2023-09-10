import { IClsService, ClsStore, UserId } from '@undb/core'
import { ApiToken, ApiTokenFactory, IApiTokenRepository } from '@undb/openapi'
import { MockProxy, mock } from 'vitest-mock-extended'
import { CreateApiTokenCommand } from './create-api-token.command'
import { CreateApiTokenCommandHandler } from './create-api-token.command.handler'
import { SpyInstance } from 'vitest'

describe('test create api token command handler', () => {
  let repo: MockProxy<IApiTokenRepository>
  let cls: MockProxy<IClsService<ClsStore>>
  let command: CreateApiTokenCommand
  let handler: CreateApiTokenCommandHandler
  let userId: UserId
  let spy: SpyInstance

  beforeEach(() => {
    repo = mock<IApiTokenRepository>()
    cls = mock<IClsService<ClsStore>>()
    spy = vi.spyOn(ApiTokenFactory, 'new')
    command = new CreateApiTokenCommand({})
    handler = new CreateApiTokenCommandHandler(cls, repo)
    userId = new UserId('user123')
  })

  test('create api token success', async () => {
    cls.get.calledWith('user.userId').mockReturnValue(userId.value)
    await handler.execute(command)
    const tokenObj = spy.mock.results[0]
    expect(spy.mock.calls[0][0]).toBe(userId.value)
    expect(repo.insert).toHaveBeenCalledWith(tokenObj.value)
  })
})
