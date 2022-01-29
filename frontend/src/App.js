import Post from './components/Post';
import Comments from './components/Comments';

function App() {
    return (
        <main id="page-container">
            <Post />
            <hr className="style-hr" />
            <Comments />
        </main>
    );
}

export default App;
