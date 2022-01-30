import React from 'react';
import { formatRelativeTime } from '../helpers/formatRelativeTime';
import { UserContext } from '../contexts/UserContext';
import axios from "axios"
import CommentForm from './CommentForm';

class Comment extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            openReply: false
        };
        this.onClickUpVote = this.onClickUpVote.bind(this);
        this.isUpvoted = this.isUpvoted.bind(this);
        this.addReply = this.addReply.bind(this);
        this.toggleRelyForm = this.toggleRelyForm.bind(this);
    }

    currentVote() {
        return this.props.votes.find((vote) => vote.comment_id === this.props.comment.id)
    }

    isUpvoted() {
        return !!this.currentVote()
    }

    onClickUpVote() {
        // Check if already upvoted
        if (this.isUpvoted()) {
            this.undoUpvote()
        } else {
            this.upvote()
        }
    }

    async upvote() {
        try {
            const response = await axios({
                method: "post",
                url: '/api/upvote/'+this.props.comment.id, 
                headers: await this.context.getAuthHeaders()
            })
            const vote = response.data
    
            // Add vote
            this.props.addVote(vote)
        } catch (e) {
            console.error(e)
        }
    }

    async undoUpvote() {
        try {
            await axios({
                method: "post",
                url: '/api/upvote/'+this.props.comment.id+'/undo', 
                headers: await this.context.getAuthHeaders()
            })
    
            // Remove current vote
            this.props.removeVote()

        } catch (e) {
            console.error(e)
        }
    }

    addReply(comment) {
        this.props.updateComment({...this.props.comment, children: [...this.props.comment.children, comment]})
    }

    toggleRelyForm() {
        this.setState(currentState => {
            return {
                openReply: !currentState.openReply
            }
        })
    }

    render() {
        return (
            <article className="comment">
                {(this.props.comment.children.length > 0 || this.state.openReply) && <span class="reply-line" />}
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
                        <button type="button" className={"button secundary"+(this.isUpvoted() ? " voted" : "")} onClick={this.onClickUpVote}><span className="icon arrow-up"></span><span>Upvote ({this.props.comment.votes})</span></button>
                        <button type="button" className="button secundary" onClick={this.toggleRelyForm}>Reply</button>
                    </footer>
                    <div class="children">
                        {this.state.openReply && <CommentForm addComment={this.addReply} parentId={this.props.comment.id} />}
                    </div>
                </main>
            </article>
        );
    }
}
  
export default Comment;