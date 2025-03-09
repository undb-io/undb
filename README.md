<h1 align="center" style="border-bottom: none">
    <div>
        <a href="https://undb.io">
            <img src="/docs/images/logo.png" width="80" />
            <br>
            undb
        </a>
    </div>
    The Open Source no code database / BaaS <br>
</h1>

UNDB is a no-code platform that can also serve as a Backend as a Service (BaaS). It is based on SQLite and can be packaged into a binary file using Bun for backend service. Additionally, it can be deployed as a service via Docker, offering a UI for table management.

![undb](./docs/images/intro.jpeg)

<div align="center">
    <a href="https://app.undb.io">Website</a> |
    <a href="https://docs.undb.io">Documentation</a> |
    <a href="https://x.com/unified_undb">Twitter / X</a> |
    <a href="https://discord.gg/3rcNdU3y3U">Discord</a> |
    <a href="https://app.undb.io/s/v/shrd0q2m4dyijmh">Roadmap</a>
</div>

<br />

<div align="center">
    <a href="https://github.com/undb-io/undb/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/undb-io/undb" alt="License">
    </a>
    <a href="https://github.com/undb-io/undb/releases">
        <img src="https://img.shields.io/github/v/release/undb-io/undb" alt="Release">
    </a>
</div>

<br />

## Features

- ⚡ No-code platform, easy to use
- 🗄️ Based on SQLite, a lightweight database
- 🥁 Built-in playground mode, try it out without any setup
- 🔐 Private and local first
- 📦 Can be packaged into a binary file using Bun
- 📊 Support formula field like Excel/Airtable
- 🌐 OpenAPI RESTful API support
- 🪜 Progressive deployment, from local in single file to cloud complicated stacks.
- 🐳 Supports Docker deployment
- 🛠️ Provides a UI for table management

## Screenshot

![kanban](./docs/images/kanban.jpeg)
![gallery](./docs/images/gallery.jpeg)
![calendar](./docs/images/calendar.jpeg)
![pivot](./docs/images/pivot.jpeg)
![form](./docs/images/form.jpeg)
![openapi](./docs/images/openapi.jpeg)

## Quick start

- Try [undb cloud](https://app.undb.io)

- Run with docker

```bash
docker run -p 3721:3721 ghcr.io/undb-io/undb:latest
```

- Run with docker with volume

```bash
docker run -d \
  -p 3721:3721 \
  -v $(pwd)/undb:/usr/src/app/.undb \
  --name undb \
  ghcr.io/undb-io/undb:latest
```

### Deploy on Render.com

<a href="https://render.com/deploy?repo=https://github.com/undb-io/undb">
  <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render">
</a>

## Development

### Local Development (Recommended)

1. **Install Bun**

   Refer to [Bun's official documentation](https://bun.sh/docs) for installation instructions.

2. **Clone the repository**

   ```bash
   git clone https://github.com/undb-io/undb.git
   cd undb
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Start the development server**

   ```bash
   bun run dev
   ```

### Docker compose development

```bash
docker compose up -d
```

then visit `http://localhost:3721`

## Build

### Packaging into a Binary File

1. **Build**
   ```bash
   bun run build
   ```

### Docker Deployment

1. **Build the Docker image**

   ```bash
   docker build -t undb .
   ```

2. **Run the Docker container**

   ```bash
   docker run -d -p 3721:3721 undb
   ```
