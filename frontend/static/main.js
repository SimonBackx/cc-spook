function createCommentElement(comment, didVote = false) {
    const template = document.querySelector('#comment-template');
    if (!template) {
        throw new Error("Missing template")
    }

    const clone = template.content.cloneNode(true);

    clone.querySelector('p').textContent = comment.message
    clone.querySelector('time').textContent = Formatter.relativeTime(comment.created_at)
    clone.querySelector('h3').textContent = comment.user.name
    clone.querySelector('img').src = comment.user.avatar

    function updateVotes() {
        if (comment.votes > 0) {
            upvoteButton.querySelector("span:last-child").textContent = `Upvote (${comment.votes})`
        }

        if (didVote) {
            upvoteButton.classList.add("voted")
        } else {
            upvoteButton.classList.remove("voted")
        }
    }

    const upvoteButton = clone.querySelector("[data-button-upvote]")
    updateVotes()

    upvoteButton.addEventListener("click", () => {
        if (didVote) {
            // Remove vote
            undoUpvoteComment(comment).then(() => {
                didVote = false
                updateVotes()
            })
        } else {
            upvoteComment(comment).then(() => {
                didVote = true
                updateVotes()
            })
        }
    })

    clone.querySelector("[data-button-reply]").addEventListener("click", () => {
        alert("Reply functionality not implemented yet.")
    })

    return clone
}

function hideWarning() {
    document.querySelector('#warning').style.display = 'none'
}

async function fetchComments() {
    const response = await axios({
        method: "get",
        url: '/api/comments',
        headers: await Session.shared.getAuthHeaders()
    })

    const comments = response.data.comments

    if (comments.length > 0) {
        hideWarning()
    }

    for (const comment of comments) {
        const didVote = response.data.votes.find(v => v.comment_id === comment.id)
        const element = createCommentElement(comment, didVote)
        document.querySelector('#comments-box').appendChild(element)
    }
}

async function placeComment(message) {
    try {
        const response = await axios({
            method: "post",
            url: '/api/comments', 
            data: { message },
            headers: await Session.shared.getAuthHeaders()
        })
    
        const comment = response.data
    
        // Insert at the top (will get moved to the correct position the next reload, but this has a better UX)
        const element = createCommentElement(comment)
        hideWarning()
        document.querySelector('#comments-box').prepend(element)
    } catch (e) {
        console.error(e)
    }
    
}

async function upvoteComment(comment) {
    try {
        await axios({
            method: "post",
            url: '/api/upvote/'+comment.id, 
            headers: await Session.shared.getAuthHeaders()
        })

        comment.votes += 1
    } catch (e) {
        console.error(e)
    }
}

async function undoUpvoteComment(comment) {
    try {
        await axios({
            method: "post",
            url: '/api/upvote/'+comment.id+'/undo', 
            headers: await Session.shared.getAuthHeaders()
        })

        comment.votes -= 1
    } catch (e) {
        console.error(e)
    }
}

// On start
fetchComments().catch(console.error)

// Submit comment handler
document.getElementById("comment-form").addEventListener("submit", (event) => {
    event.preventDefault()

    const input = document.getElementById("comment-message")
    const message = input.value

    input.disabled = true

    placeComment(message).then(() => {
        input.value = ""
    }).catch(console.error).finally(() => {
        input.disabled = false
    })
})