# CC-Spook

This project is split into two packages: one for the frontend code and one for the backend code. The backend server depends on the frontend because it will host the static contents, for convenience. You can find a full overview of the project structure below.

## Live server

Try it out yourself on my hosted server, or run it locally (steps below).

- [V1 @ spook-v1.simonbackx.com](http://spook-v1.simonbackx.com)
- [V2 @ spook-v2.simonbackx.com](http://spook-v2.simonbackx.com)

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
- MySQL (and SQLite for tests)
- Express.js for the backend routes
- Jest for running tests
- Websockets to sync upvotes in real-time
- Axios (to save some time having to write XMLHttpRequest boilerplate code)

I decided to use some new technologies (Bookshelf, Knex and React) I didn't have experience with. So this was also a good learning opportunity for me.

### HMR in frontend

The HMR (`yarn start` in the frontend folder) for the React app is not yet supported because currently the project expects the frontend and backend to be hosted by the same server. We could get around this by setting up CORS headers in the backend and adding some extra configuration files in the frontend. But I wanted to avoid having to make the setup more complicated for this small demonstration (since the frontend would need to know the port and host of the backend server and have its own environment). A different approach would be to proxy the HMR server through the Express backend.

### Internet connection

Note that the project doesn't include automatic network retries and loading indicators. If you run the project locally, this isn't needed, but for the hosted version you will need a reliable internet connection.

### Commit times

The commit times are a bit messed up since V1 because I found a bug (commit [`661fb44`](https://github.com/SimonBackx/cc-spook/commit/661fb441d49edd1dff5707d560627bd7a73082cc)) in V1 when I already started working on V2. So I made the fixes on the V1 tag and rebased the main branch onto those fixes.

## Running the project locally

### What you need

- Yarn
- A MySQL server locally (or easily accessible), with a clean database, with legacy password encryption (MySQL 5.x) enabled

### Step by step

1. Make sure you install the dependencies in both packages using yarn:
```bash
cd backend
yarn install
cd ../frontend
yarn install
cd ..
```

2. Compile the frontend app
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
DB_PORT=3306
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