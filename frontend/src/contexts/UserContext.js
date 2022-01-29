import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext({});

function chooseRandomUserData() {
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

const UserProvider = ({ children }) => {
    function getFromStorage() {
        try {
            const json = sessionStorage.getItem('user')
            if (json) {
                const user = JSON.parse(json)
                if (user && user.name && user.avatar && user.id) {
                    return user
                }
            }
        } catch (e) {
            // Session storage not supported or enabled
            console.error("Failed to restore session", e)
        }
        return null
    }

    function save(user) {
        try {
            sessionStorage.setItem('user', JSON.stringify(user))
        } catch (e) {
            // Session storage not supported or enabled
            console.error("Failed to save session", e)
        }
    }

    const [user, setUser] = useState(getFromStorage());
    let _pendingSignIn = null;

    async function signInIfNeeded() {
        if (!user) {
            _pendingSignIn = _pendingSignIn ?? signIn()
            const result = await _pendingSignIn
            _pendingSignIn = null
            return result
        }
    }


    async function signIn(userData) {
        if (!userData) {
            userData = chooseRandomUserData()
        }
        const response = await axios({
            method: "post",
            url: '/api/sign-in', 
            data: userData
        })
        setUser(response.data)
        save(response.data)
    }


    async function getAuthHeaders() {
        await signInIfNeeded()
        return {
            "Authorization": "USER_ID "+user.id
        }
    }

    // Sign in right away if needed
    useEffect(() => {
        signInIfNeeded().catch(console.error);
    });
 
    return (
        <UserContext.Provider value={{ user, setUser, getAuthHeaders }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
