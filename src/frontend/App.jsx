
import Login from "./Login"
import Signup from "./Signup"
import Notification from "./Notification"
import Loading from "./Loading"
import Userspace from "./Userspace"
import { AppContext } from "./Context"
import { useState, useEffect }  from "react"
import chatty from "./../backend/lib.js"

function App() {

  const [page, setPage] = useState("")

  const [message, setMessage] = useState("")

  const [messageType, setMessageType] = useState("")

  const [isLoadingVisible, setLoadingVisibility] = useState(false)

  const [currentUser, setCurrentUser] = useState(null)

  const [currentReceiver, setCurrentReceiver] = useState(null)

  const [users, setUsers] = useState([])

  const [search, setSearch] = useState(null)

  
  useEffect(()=>{

    chatty.onAuthChange({
      
      userLogin:({users, currentUser, currentReceiver})=>{

        setUsers(users)

        setCurrentReceiver(currentReceiver)

        setCurrentUser(currentUser)

        setPage("userspace")
      },

      userLogout:()=>{

        setPage("login")
      },

      errorHandler:(error)=>{

        console.log(error)
      }
    })

  }, [])


  return (
    <AppContext.Provider value={{page, setPage, message, setMessage, messageType, setMessageType, isLoadingVisible, setLoadingVisibility, currentUser, setCurrentUser, currentReceiver, setCurrentReceiver, users, setUsers, search, setSearch}}>
      <Signup />
      <Login />
      <Notification />
      <Loading />
      <Userspace />
    </AppContext.Provider>
  )
}

export default App
