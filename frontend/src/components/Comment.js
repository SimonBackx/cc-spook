import React from 'react';
import { formatRelativeTime } from '../helpers/formatRelativeTime';
import { UserContext } from '../contexts/UserContext';
import axios from "axios"

class Comment extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.onClickUpVote = this.onClickUpVote.bind(this);
        this.isUpvoted = this.isUpvoted.bind(this);
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
                        <button type="button" className={"button secundary"+(this.isUpvoted() ? " voted" : "")} onClick={this.onClickUpVote}><span className="icon arrow-up"></span><span>Upvote ({this.props.comment.votes})</span></button>
                        <button type="button" className="button secundary">Reply</button>
                    </footer>
                </main>
            </article>
        );
    }
}
  
export default Comment;