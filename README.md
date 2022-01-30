# CC-Spook

This project is split into two packages: one for the frontend code and one for the backend code. The backend server depends on the frontend because it will host the static contents, for convenience. You can find a full overview of the project structure below.

## Notes

### Yarn workspaces

I decided to not use yarn workspaces because that might be too dependent on the yarn version you are using locally.

### Authentication

- Every time you open a new browser window or tab, you'll login as a different, newly created user. You stay logged in after a page reload.
- Authentication information is stored in SessionStorage
- Authentication uses the user id's as tokens (in the Authorization header), which obviously is not secure, but could easily get replaced with secure access and refresh tokens.
    - Handled inside `backend/middleware/auth.js` and `frontend/src/context/UserContext.js`

### Used technologies and libraries

- Node.js, JavaScript, CSS (used SCSS here), HTML, React
- Bookshelf.js with Knex.js for connecting with the database, the models and migrations
- Express.js for the backend routes
- Jest for running tests
- Websockets to sync upvotes in real-time
- Axios (to save some time having to write XMLHttpRequest boilerplate code)

I decided to use some new technologies (Bookshelf, Knex and React) I didn't have experience with. So this was also a good learning opportunity for me.

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
    - `server.js`: Express server setup without starting the server (used in tests)
    - `websocketServer.js`: Websocket server and methods
    - `knexfile.js`: Config file to run the migrations
- `frontend/`: Frontend project
    - `build/`: Webpack will build the project to this (gitignored) directory
    - `src/`: Source files, not compiled
        - `components/`: All React components
        - `contexts/`: React Context and providers (mainly for authentication)
        - `helpers/`: Helper methods (e.g. formatting)
        - `scss/`: Sass files
            - `base/`: The SCSS files that are often used by others (variables, styles...)
            - `components/`: SCSS that is associated with a given (React) component. For now, these are all imported via the `index.scss` file, but we could move the individual scss files to get only imported with the corresponding React component (that would allow to do some code chunking in the future)
            - `elements/`: CSS that is bound to HTML element tags (no classes or ids)
        - `App.js`: Main React component
        - `index.js`: starting point of the frontend app (mounts the App component to the DOM)