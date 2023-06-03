# undb

<img height="50px" src="./docs/logo.png" alt="undb" align="right" />

Private first, unified, self-hosted no code database.

<a href="https://demo.undb.xyz/">Live Demo</a>
·
<a href="https://docs.undb.xyz/">Documentation</a>
·
<a href="https://www.undb.xyz/">Website</a>

> use email `test@example.com` and password `123456` to login

![undb](./docs/undb.png)

<p>
  <a href="https://discord.gg/3rcNdU3y3U"><img alt="Discord" src="https://img.shields.io/badge/discord-chat-5865f2?logo=discord&logoColor=f5f5f5" /></a>
</p>

## Features

- :closed_lock_with_key: Private first
- :balloon: Light weight, requires just one file storage by default
- :computer: Self hosted in seconds
- :pencil: Customizable
- :sparkles: Multiple built-in field types and variants
- :city_sunset: Different types of views, including grid, kanban, tree, calendar and more

## Easy creation

- Create table

  ![Create table](./docs/create-new-table.png)

- Create new field

  ![Create table](./docs/create-new-field.png)

- Create new record

  ![Create new record](./docs/create-new-record.gif)

- Create new view

  ![Create table](./docs/create-new-view.gif)

> Please refer to the user manual for more detailed instructions on how to use. :memo: [Documentation](https://docs.undb.xyz/)

## Deploy

### Deploy with docker

```
docker run -d --name undb -p 4000:4000 --platform linux/x86_64 -v ~/.undb/:/var/opts/.undb ghcr.io/undb-xyz/undb:latest
```

> And then you can visit http://localhost:4000 and get started

### Deploy with Render.com

<a href="https://render.com/deploy?repo=https://github.com/undb-xyz/undb">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render">
</a>

> You'll need a render account to deploy your own undb instance

![Alt](https://repobeats.axiom.co/api/embed/4e19a26c5f110e58bbcce4bb6a79c144a481c3dd.svg 'Repobeats analytics image')

## License

undb is open-source under the GNU Affero General Public License Version 3 (AGPLv3). You can find it [here](./LICENSE).
