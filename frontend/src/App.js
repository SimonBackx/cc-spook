import Post from './components/Post';
import Comments from './components/Comments';
import { UserProvider } from './contexts/UserContext';

function App() {
    return (
        <main id="page-container">
            <Post />
            <hr className="style-hr" />
            <UserProvider>
                <Comments />
            </UserProvider>
        </main>
    );
}

export default App;
