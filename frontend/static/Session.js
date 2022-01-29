class Session {
    static shared = new Session();
    user = null;

    /** Keep track of pending sign in promise to prevent multiple sign ins */ 
    _pendingSignIn = null;

    constructor() {
        this.restore()
        this.signInIfNeeded().catch(console.error)
    }

    async signInIfNeeded() {
        if (!this.user) {
            this._pendingSignIn = this._pendingSignIn ?? this.signIn()
            const result = await this._pendingSignIn
            this._pendingSignIn = null
            return result
        }
    }

    save() {
        try {
            sessionStorage.setItem('user', JSON.stringify(this.user))
        } catch (e) {
            // Session storage not supported or enabled
            console.error("Failed to save session", e)
        }
    }

    restore() {
        try {
            const json = sessionStorage.getItem('user')
            if (json) {
                const user = JSON.parse(json)
                if (user && user.name && user.avatar && user.id) {
                    this.setUser(user)
                }
            }
        } catch (e) {
            // Session storage not supported or enabled
            console.error("Failed to restore session", e)
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
        this.setUser(response.data)
        this.save()
    }

    setUser(user) {
        this.user = user
        // Update the avatar

        document.querySelector('#current-avatar').src = this.user.avatar
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