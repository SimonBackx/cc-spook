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

let user;

async function signIn(name = "My Demo") {
    const response = await axios({
        method: "post",
        url: '/api/sign-in', 
        data: { name }
    })
    window.user = response.data

}

async function placeComment(message) {
    if (!window.user) {
        await signIn()
    }
    const response = await axios({
        method: "post",
        url: '/api/comments', 
        data: { message },
        headers: {
            "Authorization": "USER_ID "+window.user.id
        }
    })

    const comment = response.data

    // Insert at the top (will get moved to the correct position the next reload, but this has a better UX)
    const element = createCommentElement(comment)
    document.querySelector('#comments-box').prepend(element)
}

// On start
fetchComments().catch(console.error)

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