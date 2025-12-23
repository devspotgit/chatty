import { useContext, useEffect } from "react"
import { AppContext } from "./Context"

function Notification(){

    const { message, messageType, setMessage } = useContext(AppContext)

    useEffect(()=>{

        if(message != ""){

            setTimeout(()=>{

                setMessage("")

            }, 4000)
        }
    })

    return (
        <div className={"w-[100%] absolute top-[-600px] " + (message != "" ? "notification-anim" : "")}>
            <div className={"max-w-[300px] text-center text-white p-[10px] mx-auto rounded-[5px] " + (messageType == "error" ? "bg-red-400" : "bg-green-400")}>{message}</div>
        </div>
    )
}

export default Notification

