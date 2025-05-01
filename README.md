# Simple URL Shortener

A minimalist URL shortener service built with Deno, Hono, and Redis. It provides an API to create short aliases for long URLs and redirects users to the original URL when they visit the short alias. Includes a basic web interface.

## Features

*   **URL Shortening:** Create short, Base62-encoded IDs for long URLs via a POST request.
*   **URL Redirection:** Redirects short URLs (`/:id`) to their original destination.
*   **Web Interface:** Simple HTML frontend to interact with the shortening service.
*   **Health Check:** `/health` endpoint to verify service status and version.
*   **Redis Storage:** Uses Redis to store the mapping between short IDs and original URLs.
*   **Dockerized:** Ready to run using Docker and Docker Compose.
*   **CI/CD:** GitHub Actions workflow for running tests, building Docker images on tag pushes, and deploying.
*   **Versioning:** Includes a script (`deno task deploy`) to bump the patch version, commit, tag, and push.

## Tech Stack

*   [Deno](https://deno.land/) - Runtime environment
*   [Hono](https://hono.dev/) - Web framework
*   [Redis](https://redis.io/) - In-memory data store
*   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) - Containerization

## Getting Started

### Prerequisites

*   [Deno](https://deno.land/#installation) (v1.x or later)
*   [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)
*   A running Redis instance.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/RyanGst/url-shortener.git
    cd url-shortener
    ```

### Configuration

The application connects to Redis using the following environment variables:

*   `REDIS_HOST`: Hostname of your Redis server (e.g., `localhost`, `127.0.0.1`).
*   `REDIS_PORT`: Port your Redis server is running on (e.g., `6379`).
*   `REDIS_PASSWORD`: Password for your Redis server (if configured).

You can set these variables in your environment or use a `.env` file (note: `.env` file handling is not built-in, you might need to adjust how environment variables are loaded if you prefer this method, e.g., using `docker compose --env-file`).

### Running Locally (with Deno)

1.  Ensure your Redis instance is running and accessible.
2.  Set the required environment variables (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`).
3.  Start the development server:
    ```bash
    deno task start
    ```
    The application will be available at `http://localhost:8000`.

### Running with Docker Compose

1.  Ensure Docker and Docker Compose are running.
2.  The provided `docker-compose.yml` sets up the `app` service. You might need to modify it or use an override file (`docker-compose.override.yml`) to include a Redis service and configure environment variables if you want a fully containerized local setup.
3.  To run the application service as defined (assuming an external Redis and configured environment variables):
    ```bash
    docker compose up --build
    ```

## API Endpoints

*   **`GET /`**: Redirects to the `/index.html` web interface.
*   **`GET /index.html`**: Serves the static HTML frontend.
*   **`GET /health`**: Returns the current status and application version.
    *   **Response:**
        ```json
        {
          "status": "ok",
          "version": "x.y.z"
        }
        ```
*   **`POST /create`**: Creates a short URL.
    *   **Request Body:**
        ```json
        {
          "url": "https://your-very-long-url.com/goes/here"
        }
        ```
    *   **Response:**
        ```json
        {
          "status": "ok",
          "id": "base62Id"
        }
        ```
*   **`GET /:id`**: Redirects to the original URL associated with the `id`.
    *   If found, returns a `302 Found` redirect.
    *   If not found, returns a `404 Not Found` with JSON body:
        ```json
        {
          "status": "not found"
        }
        ```

## Deployment

*   CI/CD is handled by GitHub Actions (`.github/workflows/deno.yml`).
*   Tests are run on pushes and pull requests to the `main` branch.
*   On pushes of tags matching `v*.*.*`:
    *   Tests are run.
    *   A Docker image is built and pushed to GitHub Container Registry (`ghcr.io/ryangst/url-shortener`).
    *   The application is deployed (deployment details specific to the `cssnr/stack-deploy-action` configuration).
    

