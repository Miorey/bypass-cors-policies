# bypass-cors-policies

Bypass CORS (Cross-Origin Resource Sharing) policies of a remote server. This tool is particularly useful for development purposes when working with APIs that don't provide the necessary CORS headers for local development.

> **Warning**: Use responsibly! Only use this for legal and legitimate purposes. Bypassing CORS on servers without permission can be illegal and unethical.

## Local Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/Miorey/bypass-cors-policies
    cd bypass-cors-policies
    ```

2. Modify the `.env` file and set the `SERVER_NAME` to the server from which you wish to bypass CORS:
    ```env
    SERVER_NAME="https://www.example.com"
    ```

3. Install the necessary Node version using nvm:
    ```bash
    nvm install
    nvm use
    ```

4. Install dependencies:
    ```bash
    npm ci
    ```

5. Start the application:
    ```bash
    node start
    ```

## Docker Compose Setup

1. Modify the `docker-compose.yml` file and set the `SERVER_NAME` environment variable:

    ```yaml
    version: '3'
    services:
      bypass-cors-policies:
        image: miorey/bypass-cors-policies
        environment:
          - SERVER_NAME=https://www.example.com
        volumes:
          - ./storage:/usr/src/app/storage
        ports:
          - "3001:3000"
    ```

2. Run the Docker Compose:
    ```bash
    docker-compose up
    ```

## Data Storage

Files are stored in the `storage` directory. To clear stored files, simply remove the contents of the `storage` directory:
```bash
rm -rf storage/*
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


