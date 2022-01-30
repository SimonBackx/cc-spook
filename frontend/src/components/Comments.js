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
        this.addVote = this.addVote.bind(this);
        this.removeVote = this.removeVote.bind(this);
        this.updateComment = this.updateComment.bind(this);
    }

    componentDidMount() {
        this.loadComments().catch(console.error)
        
        const ws = new WebSocket("ws://" + window.location.host + "/ws");
        this.ws = ws

        ws.onopen = () => {
            console.log("Opened ws connection")
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)

            console.log("Received websocket message", message)
            if (message.updateComment) {
                this.updateComment(message.updateComment)
            }
        }
    }

    componentWillUnmount() {
        this.ws?.close()
    }

    async loadComments() {
        const response = await axios({
            method: "get",
            url: '/api/comments',
            headers: await this.context.getAuthHeaders()
        })
        this.setState(response.data)
    }

    /**
     * Update one, or more properties of a comment (id and parent_id property should always be set)
     */
    updateComment(comment) {
        console.log("Updating comment", comment)
        this.setState(currentState => {
            return {
                comments: this.updateCommentInComments(currentState.comments, comment)
            }   
        })
    }

    // Helper method to recursively update comments
    updateCommentInComments(comments, comment) {
        return comments.map(c => {
            if (c.id === comment.id) {
                return { ...c, ...comment}
            }
            if (c.id === comment.parent_id) {
                return { ...c, children: this.updateCommentInComments(c.children, comment) }
            }
            return c
        })
    }   


    addComment(comment) {
        this.setState({ comments: [comment, ...this.state.comments] })
    }

    setVotes(comment, votes) {
        this.setState(currentState => {
            return {
                comments: currentState.comments.map(c => c.id === comment.id ? { ...c, votes } : c)
            }
        })
    }

    removeVote(vote) {
        // Don't update the vote count here, wait for the websocket message (or we get a race condition)
        this.setState(currentState => {
            return {
                votes: currentState.votes.filter(v => v.id !== vote.id)
            }
        })
    }

    addVote(vote) {
        // Don't update the vote count here, wait for the websocket message (or we get a race condition)
        this.setState(currentState => {
            return {
                votes: [...currentState.votes, vote]
            }
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
                    { this.state.comments.map(comment => <Comment comment={comment} votes={this.state.votes} key={comment.id} updateComment={this.updateComment} addVote={this.addVote} removeVote={this.removeVote} />) }
                </div>
            </section>
        );
    }
  }
  
export default Comments;