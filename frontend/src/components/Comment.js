import React from 'react';
import { formatRelativeTime } from '../helpers/formatRelativeTime';

class Comment extends React.Component {
    render() {
        return (
            <article className="comment">
                <figure className="avatar">
                    <img src={this.props.comment.user.avatar} width="60" height="60" alt="Avatar" />
                </figure>
                <main>
                    <header>
                        <h3>{this.props.comment.user.name}</h3>
                        <time>{formatRelativeTime(this.props.comment.created_at)}</time>
                    </header>
                    <p>{this.props.comment.message}</p>
                    <footer>
                        <button type="button" className="button secundary"><span className="icon arrow-up"></span><span>Upvote ({this.props.comment.votes})</span></button>
                        <button type="button" className="button secundary">Reply</button>
                    </footer>
                </main>
            </article>
        );
    }
}
  
export default Comment;