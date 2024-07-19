## Transactional

This is usually where you store transactional-related code of your application to organize and simplify things.
This also allows for using the email templates you make anywhere on your codebase by just installing with
the monorepo setup.

This also uses the [react.email](https://react.email/) CLI for previewing and compiling the email templates
into HTML ones.

Using the CLI you can also preview your emails, see how they are going to look and try sending them
to yourself for testing purposes.

### Previewing email templates

First, install the dependencies:

```sh
bun install
```

Then, you can run the react.email developmenet server by running:

```sh
bun dev
```

Open [localhost:3001](http://localhost:3001) with your browser to see the result.

---

See the [react.email docs](https://react.email/docs/introduction) for more details.

## License

MIT License
