# CC-Spook

This project is split into two packages: one for the frontend code and one for the backend code. The backend server depends on the frontend because it will host the static contents, for convenience.

Note that I decided to not use yarn workspaces because that might be too dependent on the yarn version you are using.

## Running the project locally

### What you need

- Yarn
- A MySQL server locally (or easily accessible without SSL), with a clean database

### Step by step

1. Make sure you install the dependencies in both packages using yarn:
```bash
cd backend
yarn install
cd ../frontend
yarn install
cd ..
```

2. Compile the SCSS code in the frontend package.
```bash
cd frontend
yarn build
cd ..
```

3. Create a file `.env` in the `/backend` folder, with the following contents, and fill in the credentials for your database.

```bash
PORT=7777
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your-password
DB_DATABASE=cc-spook
```

4. Run the migrations
```bash
cd backend
yarn migrate
```

5. Start the server
```bash
cd backend
yarn start
```

6. Open `localhost:7777` (depending on your port) in your browser.

## Running tests (Jest)

Currently we only have tests for the backend api.

```bash
cd backend
yarn test
```

The backend tests use an in memory SQLite database, so no extra database or environment file is needed.

## Project structure

- `backend/`: The backend project
    - `errors/`: Custom error classes
    - `middleware/`: Express middleware (authentication and error handling)
    - `migrations/`: Knex.js migrations (run using `yarn migrate`)
    - `models/`: Bookshelf.js models
        - `bookshelf/`: Access the database configuration, knex instance and bookshelf instance
    - `routes/`: Express routes and tests
    - `tests/`: Jest setup scripts
    - `.env`: Your environment file
    - `index.js`: Runs the server with the .env environment file
    - `knexfile.js`: Config file to run the migrations
- `frontend/`: Frontend project
    - `dist/`: Generated frontend assets that will get served in the root directory of the backend server
        - `css/`: The compiled css files
    - `scss/`: Sass files
        - `base/`: The SCSS files that are often used by others (variables, styles...)
        - `components/`: Reusable CSS for specific parts of a page
        - `elements/`: CSS that is bound to HTML element tags (no classes or ids)
    - `static/`: All the static assets of the frontend. These will get served in the root directory of the backend server.
    