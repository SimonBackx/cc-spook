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

        this.addComment = this.addComment.bind(this);
        this.setVotes = this.setVotes.bind(this);
    }

    componentDidMount() {
        this.loadComments().catch(console.error)
    }

    async loadComments() {
        const response = await axios({
            method: "get",
            url: '/api/comments',
            headers: await this.context.getAuthHeaders()
        })
        this.setState(response.data)
    }

    addComment(comment) {
        this.setState({ comments: [comment, ...this.state.comments] })
    }

    setVotes(comment, votes) {
        this.setState({
            comments: this.state.comments.map(c => c.id === comment.id ? { ...c, votes } : c)
        })
    }

    removeVote(comment) {
        this.setVotes(comment, comment.votes - 1)
        this.setState({
            votes: this.state.votes.filter(vote => vote.comment_id !== comment.id)
        })
    }

    addVote(comment, vote) {
        this.setVotes(comment, comment.votes + 1)
        this.setState({
            votes: [...this.state.votes, vote]
        })
    }

    render() {
        return (
            <section id="comments">
                <h2>Discussion</h2>
                <CommentForm addComment={this.addComment} />
    
                <hr className="style-hr" />
    
                <div id="comments-box">
                    { 
                        this.state.comments.length === 0 && (
                            <div id="warning">
                                <p>No comments yet.</p>
                            </div>
                        )
                    }
                    { this.state.comments.map(comment => <Comment comment={comment} votes={this.state.votes} key={comment.id} addVote={(vote) => this.addVote(comment, vote)} removeVote={() => this.removeVote(comment)}/>) }
                </div>
            </section>
        );
    }
  }
  
export default Comments;