function relativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    // Diff is in seconds
    let diff = Math.round((now.getTime() - date.getTime()) / 1000);
    if (diff < 5) {
        return "Just now"
    }

    if (diff < 60) {
        return `${diff} seconds ago`;
    }

    // Diff in minutes
    diff = diff / 60;
    if (diff < 60) {
        if (Math.floor(diff) === 1) {
            return `One minute ago`;
        }
        return `${Math.floor(diff)} minutes ago`;
    }

    // First check for yesterday 
    // (we ignore setting 'yesterday' if close to midnight and keep using minutes until 1 hour difference)
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if (date.getFullYear() === yesterday.getFullYear() && date.getMonth() === yesterday.getMonth() && date.getDate() === yesterday.getDate()) {
        return "Yesterday";
    }

    // Diff in hours
    diff = diff / 60;
    if (diff < 24) {
        if (Math.floor(diff) === 1) {
            return `One hour ago`;
        }
        return `${Math.floor(diff)} hours ago`;
    }

    // Diff in days
    diff = diff / 24;
    if (diff < 7) {
        if (Math.floor(diff) === 1) {
            // Special case, we should compare based on dates in the future instead
            return `One day ago`;
        }
        return `${Math.floor(diff)} days ago`;
    }

    // Diff in weeks
    diff = diff / 7;
    if (Math.floor(diff) === 1) {
        // Special case, we should compare based on dates in the future instead
        return `One week ago`;
    }
    return `${Math.floor(diff)} weeks ago`;
}

function Comment(props) {
    return (
        <article className="comment">
            <figure className="avatar">
                <img src={props.comment.user.avatar} width="60" height="60" alt="Avatar" />
            </figure>
            <main>
                <header>
                    <h3>{props.comment.user.name}</h3>
                    <time>{relativeTime(props.comment.created_at)}</time>
                </header>
                <p>{props.comment.message}</p>
                <footer>
                    <button type="button" className="button secundary" data-button-upvote><span className="icon arrow-up"></span><span>Upvote ({props.comment.votes})</span></button>
                    <button type="button" className="button secundary" data-button-reply>Reply</button>
                </footer>
            </main>
        </article>
    );
}
  
export default Comment;