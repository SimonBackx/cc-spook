class Session {
    static shared = new Session();
    user = null;

    constructor() {
        this.signInIfNeeded().catch(console.error)
    }

    async signInIfNeeded() {
        if (!this.user) {
            await this.signIn()
        }
    }

    async signIn(userData) {
        if (!userData) {
            userData = this.chooseRandomUserData()
        }
        const response = await axios({
            method: "post",
            url: '/api/sign-in', 
            data: userData
        })
        this.user = response.data
    
        // Update the avatar
        document.querySelector('#current-avatar').src = userData.avatar
    }
    
    chooseRandomUserData() {
        const users = [
            {
                name: "Cooper Flores",
                avatar: "/images/avatar1.jpg"
            },
            {
                name: "Autumn Merritt",
                avatar: "/images/avatar2.jpg"
            },
            {
                name: "Grover Curtis",
                avatar: "/images/avatar3.jpg"
            },
            {
                name: "Arnas Melia",
                avatar: "/images/avatar4.jpg"
            },
            {
                name: "Derren Russell",
                avatar: "/images/avatar5.jpg"
            },
            {
                name: "Rob Hope",
                avatar: "/images/avatar6.jpg"
            },
            {
                name: "Sophie Brecht",
                avatar: "/images/avatar7.jpg"
            },
            {
                name: "James",
                avatar: "/images/avatar8.jpg"
            },
            {
                name: "Cameron Lawrence",
                avatar: "/images/avatar9.jpg"
            },
            {
                name: "Kylie Mcneil",
                avatar: "/images/avatar10.jpg"
            }
        ]
    
        const randomIndex = Math.floor(Math.random() * users.length)
        return users[randomIndex]
    }

    async getAuthHeaders() {
        await this.signInIfNeeded()
        return {
            "Authorization": "USER_ID "+this.user.id
        }
    }
}