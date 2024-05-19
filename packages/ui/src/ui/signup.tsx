export const SignUp = () => {
  return (
    <form action="signup" method="POST" hx-ext="json-enc">
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Send</button>
    </form>
  )
}
