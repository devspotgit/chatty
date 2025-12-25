
import Login from "./Login"
import Signup from "./Signup"
import Notification from "./Notification"
import Loading from "./Loading"
import Activation from "./Activation"
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

  const [users, setUsers] = useState(null)

  const [search, setSearch] = useState(null)

  
  useEffect(()=>{

    setTimeout(()=>{

      chatty.initApp()

      .then(res => {

        if(res.data){

          setCurrentReceiver(res.data.currentReceiver)

          setCurrentUser(res.data.currentUser)

          setUsers(res.data.users)

          setPage(res.action)
        }
        else{

          setPage(res.action)
        }

      })

    }, 500)

  }, [])


  return (
    <AppContext.Provider value={{page, setPage, message, setMessage, messageType, setMessageType, isLoadingVisible, setLoadingVisibility, currentUser, setCurrentUser, currentReceiver, setCurrentReceiver, users, setUsers, search, setSearch}}>
      <Signup />
      <Login />
      <Notification />
      <Loading />
      <Activation />
      <Userspace />
    </AppContext.Provider>
  )
}

export default App
