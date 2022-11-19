import { UserIdInterceptor } from './user-id.interceptor';

describe('UserIdInterceptor', () => {
  it('should be defined', () => {
    expect(new UserIdInterceptor()).toBeDefined();
  });
});
