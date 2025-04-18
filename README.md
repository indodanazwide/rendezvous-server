# Rendezvous Server

This is the backend server for the Rendezvous Restaurant full-stack web application. It facilitates three core systems:

1. **Authentication System**: Handles user registration, login, and authentication.
2. **Reservation System**: Manages table reservations for customers.
3. **Ordering System**: Processes food and drink orders.

## Features

- RESTful API built with Express.js
- MySQL database integration
- Environment configuration using `dotenv`
- Modular and scalable architecture

## Prerequisites

- Node.js (v16 or higher)
- MySQL database

## Installation

1. Clone the repository:

  ```bash
  git clone https://github.com/indodanazwide/rendezvous-server.git
  cd rendezvous-server
  ```

2. Install dependencies:

  ```bash
  npm install
  ```

3. Create a `.env` file in the root directory and configure the following variables:

  ```env
  PORT=8008
  DB_HOST=your-database-host
  DB_USER=your-database-username
  DB_PASSWORD=your-database-password
  DB_NAME=your-database-name
  ```

4. Start the server:

- For production:

  ```bash
  npm start
  ```

- For development (with hot-reloading):

  ```bash
  npm run dev
  ```

## Usage

- The server will start on the port specified in the .env file or default to `8008`.
- Use tools like Postman or cURL to interact with the API.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/indodanazwide/rendezvous-server).

## Contact

For questions or support, contact **Bukeka Nxumalo** at [nxumalobukeka66@gmail.com].
