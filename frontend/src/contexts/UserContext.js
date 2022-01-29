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

    async function signInIfNeeded(force = false) {
        if (force || !user) {
            _pendingSignIn = _pendingSignIn ?? signIn()
            const result = await _pendingSignIn
            _pendingSignIn = null
            return result
        }
        return user
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
        return response.data
    }


    async function getAuthHeaders(force = false) {
        const user = await signInIfNeeded(force)
        return {
            "Authorization": "USER_ID "+user.id
        }
    }

    // Intercept auth errors (e.g. when a user is signed out automatically -> removed in database)
    axios.interceptors.response.use(response => response, error => {
        if (error.response && error.response.status === 401 && !error.config._didRetry) {
            console.error("User is signed out")

            // Retry
            setUser(null)
            return getAuthHeaders(true).then((headers) => {
                const config = error.config;
                config._didRetry = true;
                config.headers = headers;
                return axios(config);
            })
        }
        return error;
    });

    signInIfNeeded().catch(console.error);

 
    return (
        <UserContext.Provider value={{ user, setUser, getAuthHeaders }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
