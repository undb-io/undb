# UNDB

UNDB is a no-code platform that can also serve as a Backend as a Service (BaaS). It is based on SQLite and can be packaged into a binary file using Bun for backend service. Additionally, it can be deployed as a service via Docker, offering a UI for table management.

## Features

- No-code platform, easy to use
- Based on SQLite, a lightweight database
- Can be packaged into a binary file using Bun
- Supports Docker deployment
- Provides a UI for table management

## Quick start

```bash
docker run -p 3721:3721 ghcr.io/undb-io/undb:v1.0.0-1
```

## Installation and Usage

### Prerequisites

- [Bun](https://bun.sh) - Bun is a fast JavaScript runtime and package manager

### Local Development

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
