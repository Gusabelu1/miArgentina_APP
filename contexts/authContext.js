import { createContext } from "react"

const authContext = createContext({
    validToken: false,
    setValidToken: (setValidToken) => {}
});

export default authContext;