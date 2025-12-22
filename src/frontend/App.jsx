
import Login from "./Login"
import Signup from "./Signup"
import Notification from "./Notification"
import { AppContext } from "./Context"
import { useState }  from "react"

function App() {

  const [page, setPage] = useState("login")

  const [message, setMessage] = useState("")

  const [messageType, setMessageType] = useState("")

  return (
    <AppContext.Provider value={{page, setPage, message, setMessage, messageType, setMessageType}}>
      <Signup />
      <Login />
      <Notification />
    </AppContext.Provider>
  )
}

export default App
