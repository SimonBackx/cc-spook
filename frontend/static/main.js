function createCommentElement(comment) {
    const template = document.querySelector('#comment-template');
    if (!template) {
        throw new Error("Missing template")
    }

    const clone = template.content.cloneNode(true);

    // Set avatar (todo)
    // Set author name
    // Set time string
    // Set message

    //clone.querySelector('h3').textContent = comment.user.name
    clone.querySelector('p').textContent = comment.message
    clone.querySelector('time').textContent = comment.created_at
    clone.querySelector('h3').textContent = comment.user.name
    clone.querySelector('img').src = comment.user.avatar

    return clone
}

async function fetchComments() {
    const response = await axios.get('/api/comments')

    const comments = response.data.comments

    for (const comment of comments) {
        const element = createCommentElement(comment)
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
        document.querySelector('#comments-box').prepend(element)
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