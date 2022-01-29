import React from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { UserContext } from '../contexts/UserContext';
import axios from "axios"

class Comments extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = { 
            comments: [],
            votes: []
        };
    }

    async loadComments() {
        const response = await axios({
            method: "get",
            url: '/api/comments',
            headers: await this.context.getAuthHeaders()
        })
        this.setState(response.data)
    }

    componentDidMount() {
        this.loadComments().catch(console.error)
    }

    render() {
        return (
            <section id="comments">
                <h2>Discussion</h2>
                <CommentForm />
    
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