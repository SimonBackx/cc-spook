import React from 'react';
import Comment from './Comment';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            comments: [
                // Simple comment without networking for now
                { 
                    created_at: new Date().toISOString(),
                    message: "Hello world",
                    user: {
                        avatar: "/images/avatar1.jpg",
                        name: "John Doe",
                        id: 1
                    },
                    id: 1,
                    user_id: 1
                }
            ] 
        };
    }

    render() {
        return (
            <section id="comments">
                <h2>Discussion</h2>
                <form id="comment-form">
                    <figure className="avatar">
                        <img src="/images/avatar.jpg" width="60" height="60" alt="Avatar" id="current-avatar" />
                    </figure>
                    <textarea id="comment-message" name="message" placeholder="What are your thoughts?"></textarea>
                    <button type="submit" className="button primary">Comment</button>
                </form>
    
                <hr className="style-hr" />
    
                <div id="comments-box">
                    { 
                        this.state.comments.length === 0 && (
                            <div id="warning">
                                <p>No comments yet.</p>
                            </div>
                        )
                    }
                    { this.state.comments.map(comment => <Comment comment={comment} key={comment.id} />) }
                </div>
            </section>
        );
    }
  }
  
export default Comments;