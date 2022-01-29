import React from 'react';
import { UserContext } from '../contexts/UserContext';

class CommentForm extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <form id="comment-form">
                <figure className="avatar">
                    { this.context.user ? <img src={this.context.user.avatar} width="60" height="60" alt="Avatar" id="current-avatar" /> : <span /> }
                </figure>
                <textarea id="comment-message" name="message" placeholder="What are your thoughts?"></textarea>
                <button type="submit" className="button primary">Comment</button>
            </form>
        );
    }
  }
  
export default CommentForm;