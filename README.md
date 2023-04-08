# egodb

<img height="50px" src="./docs/logo.png" alt="egodb" align="right" />

Private first, self-hosted no code database.

<a href="https://demo.egodb.io/">Live Demo</a>

> use email `test@example.com` and password `123456` to login

![ego](./docs/ego.png)

## Features

- :closed_lock_with_key: Private first
- :balloon: Light weight, requires just one file storage by default
- :computer: Self hosted in seconds
- :pencil: Customizable
- :sparkles: Multiple built-in field types and variants
- :city_sunset: Different types of views, including grid, kanban, tree, calendar and more

## Deploy

### Deploy with docker

```
docker run -d --name egodb -p 4000:4000 --platform linux/x86_64 -v ~/.egodb/:/var/opts/.ego ghcr.io/ego-io/egodb:latest
```

> And then you can visit http://localhost:4000 and get started

### Deploy with Render.com

<a href="https://render.com/deploy?repo=https://github.com/ego-io/egodb">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render">
</a>

> You'll need a render account to deploy your own egodb instance

## License

egodb is open-source under the GNU Affero General Public License Version 3 (AGPLv3). You can find it [here](./LICENSE).
