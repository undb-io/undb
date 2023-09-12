import { IClsService, ClsStore, UserId } from '@undb/core'
import { ApiToken, IApiTokenRepository } from '@undb/openapi'
import { MockProxy, mock } from 'vitest-mock-extended'
import { DeleteApiTokenCommand } from './delete-api-token.command'
import { DeleteApiTokenCommandHandler } from './delete-api-token.command.handler'
import { None, Some } from 'oxide.ts'

describe('test DeleteApiTokenCommandHandler', () => {
  let repo: MockProxy<IApiTokenRepository>
  let cls: MockProxy<IClsService<ClsStore>>
  let command: DeleteApiTokenCommand
  let handler: DeleteApiTokenCommandHandler
  const apiToken = new ApiToken()
  let userId: UserId

  beforeEach(() => {
    repo = mock<IApiTokenRepository>()
    cls = mock<IClsService<ClsStore>>()
    command = new DeleteApiTokenCommand({ apiTokenId: 'apiTokenIdString' })
    handler = new DeleteApiTokenCommandHandler(repo, cls)
    userId = new UserId('user123')
    cls.get.calledWith('user.userId').mockReturnValue('user123')
    apiToken.userId = userId
  })
  test('Delete api token success', async () => {
    repo.findOneById.mockResolvedValue(Some(apiToken))
    await handler.execute(command)
    expect(repo.findOneById).toHaveBeenCalledWith(command.apiTokenId)
    expect(repo.deleteOneById).toHaveBeenCalledWith(command.apiTokenId)
  })

  test('Delete api token faild', async () => {
    repo.findOneById.mockResolvedValue(None)
    await handler.execute(command)
    expect(repo.deleteOneById).not.toHaveBeenCalled()
  })

  test('Delete api token error', async () => {
    cls.get.calledWith('user.userId').mockReturnValue('user321')
    repo.findOneById.mockResolvedValue(Some(apiToken))
    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot(
      '"cannot delete api token belongs to other user"',
    )
    expect(repo.deleteOneById).not.toHaveBeenCalled()
  })
})
