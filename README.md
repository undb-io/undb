<h1 align="center" style="border-bottom: none">
    <div>
        <a href="https://www.undb.io">
            <img src="/docs/images/logo.png" width="80" />
            <br>
            undb
        </a>
    </div>
    The Open Source no code database / BaaS <br>
</h1>

UNDB is a no-code platform that can also serve as a Backend as a Service (BaaS). It is based on SQLite and can be packaged into a binary file using Bun for backend service. Additionally, it can be deployed as a service via Docker, offering a UI for table management.

## Features

- ⚡ No-code platform, easy to use
- 🗄️ Based on SQLite, a lightweight database
- 🔐 Private and local first
- 📦 Can be packaged into a binary file using Bun
- 🪜 Progressive deployment, from local in single file to cloud complicated stacks.
- 🐳 Supports Docker deployment
- 🛠️ Provides a UI for table management

## Quick start

```bash
docker run -p 3721:3721 ghcr.io/undb-io/undb:latest
```

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
