# Backend

## Running the server

### Create your MySQL database

First create an empty MySQL database where you can access it.

### Environment variables

Create a file `.env` in the `/backend` folder, with the following contents, and fill in the credentials for your database.

```
PORT=7777
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your-password
DB_DATABASE=cc-spook
```

### Run the migrations

```
yarn migrate
```

### Run the server

````
yarn start
```