import { singleton } from "@undb/di"

@singleton()
export class AuthService {
  public authWithPassword() {
    return "Hello World"
  }
}
