import { IMemberCreateService } from '@undb/authz'
import { IUserRepository, IUserService, User, UserId } from '@undb/core'
import { MockProxy, mock } from 'vitest-mock-extended'
import { RegisterCommand } from './register.command'
import { RegisterCommandHandler } from './register.command.handler'

describe('register', () => {
  let repo: MockProxy<IUserRepository>
  let memberService: MockProxy<IMemberCreateService>
  let userService: MockProxy<IUserService>

  let command: RegisterCommand
  let handler: RegisterCommandHandler

  beforeEach(() => {
    repo = mock<IUserRepository>()
    memberService = mock<IMemberCreateService>()
    userService = mock<IUserService>()

    command = new RegisterCommand({ email: 'a@a.com', password: 'password' })
    handler = new RegisterCommandHandler(repo, memberService, userService)
  })

  test('should success', async () => {
    repo.exists.mockResolvedValueOnce(false)

    const user = new User()
    user.userId = new UserId('usr1')
    userService.register.mockResolvedValueOnce(user)

    const result = await handler.execute(command)

    expect(repo.exists).toHaveBeenCalledOnce()
    expect(userService.register).toHaveBeenCalledWith(command.email, command.password)
    expect(memberService.grantDefault).toHaveBeenCalledWith(user)

    expect(result).toMatchInlineSnapshot(`
      {
        "email": "a@a.com",
        "sub": "usr1",
      }
    `)
  })

  test('should throw error if exists', async () => {
    repo.exists.mockResolvedValueOnce(true)

    await expect(handler.execute(command)).rejects.toThrowErrorMatchingInlineSnapshot('"user already exists"')

    expect(repo.exists).toHaveBeenCalledOnce()
    expect(userService.register).not.toBeCalled()
    expect(memberService.grantDefault).not.toBeCalled()
  })
})
