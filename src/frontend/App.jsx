
import Login from "./Login"
import Signup from "./Signup"
import Notification from "./Notification"
import Loading from "./Loading"
import Activation from "./Activation"
import { AppContext } from "./Context"
import { useState }  from "react"

function App() {

  const [page, setPage] = useState("login")

  const [message, setMessage] = useState("")

  const [messageType, setMessageType] = useState("")

  const [isLoadingVisible, setLoadingVisibility] = useState(false)


  return (
    <AppContext.Provider value={{page, setPage, message, setMessage, messageType, setMessageType, isLoadingVisible, setLoadingVisibility}}>
      {/* <Signup />
      <Login />
      <Notification />
      <Loading />
      <Activation /> */}
    </AppContext.Provider>
  )
}

export default App
