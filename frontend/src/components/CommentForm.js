import React from 'react';
import { UserContext } from '../contexts/UserContext';
import axios from "axios"

class CommentForm extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            message: ""
        };

        this.submitForm = this.submitForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async submitForm(event) {
        event.preventDefault();
        const message = this.state.message;
        try {
            const response = await axios({
                method: "post",
                url: '/api/comments', 
                data: { message },
                headers: await this.context.getAuthHeaders()
            })
        
            const comment = response.data
            this.props.addComment(comment)

            // Clear message on success
            this.setState({ message: "" });
        } catch (e) {
            console.error(e)
        }
    }

    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    render() {
        return (
            <form onSubmit={this.submitForm} className="comment-form">
                <figure className="avatar">
                    { this.context.user ? <img src={this.context.user.avatar} width="60" height="60" alt="Avatar"/> : <span /> }
                </figure>
                <textarea value={this.state.message} onChange={this.handleChange} placeholder="What are your thoughts?" />
                <button type="submit" className="button primary">Comment</button>
            </form>
        );
    }
  }
  
export default CommentForm;