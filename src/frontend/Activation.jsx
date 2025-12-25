
import { useState, useContext } from "react"
import { AppContext } from "./Context"
import chatty from "./../backend/lib.js"


function Activation(){

    const [profilePicture, setProfilePicture] = useState("/images/avatar.png")

    const { page, setPage, setLoadingVisibility, setMessage, setMessageType, setCurrentReceiver, setCurrentUser, setUsers } = useContext(AppContext)


    function submitUpload(e){

        const url = URL.createObjectURL(e.target.files[0])

        setProfilePicture(url)
    }


    async function submit(e){

        e.preventDefault()

        try{

            setLoadingVisibility(true)

            const formData = new FormData(e.target)
    
            const username = formData.get("activationUsername").trim()
    
            const fileUpload = formData.get("activationUpload")
    
            const res = await fetch("/images/avatar.png")
    
            const defaultFile = await res.blob()
    
            const file = (fileUpload.size != 0 ? fileUpload : defaultFile) 

    
            if(!username){
    
                setLoadingVisibility(false)

                setMessageType("error")
    
                setMessage("username required")
            }
            else{

                const res = await chatty.activation(username, file)

                setLoadingVisibility(false)

                setCurrentReceiver(res.data.currentReceiver)

                setCurrentUser(res.data.currentUser)

                setUsers(res.data.users)

                setPage(res.action) 
            }
        }
        catch(error){

            setLoadingVisibility(false)

            setMessageType("error")

            setMessage(error.code)
        }
    }

    return (
        <form className={"bg-(--primary-lighter-plus) flex-col p-[20px] gap-[20px] rounded-[10px] " + (page != "activation" ? "hidden" : "flex")} onSubmit={submit}>
            <div className="flex flex-col gap-[15px]">
                <label for="activationUpload" className="cursor-pointer text-center text-[0.8rem] font-bold text-(--primary)">Upload profile picture</label>
                <input className="hidden" type="file" accept="image/*" name="activationUpload" id="activationUpload" onChange={submitUpload}/>
                <div className = "h-[60px] w-[60px] relative self-center rounded-[100%] overflow-hidden">
                    <img src={profilePicture} className = "absolute top-[0px] left-[0px] w-[100%] h-[100%]" />
                </div>
            </div>
            <div className="flex flex-col gap-[15px]">
                <label for="activationUsername" className="text-center text-[0.8rem] font-bold text-(--primary)">Username</label>
                <input className="focus:outline-[0px] text-white placeholder:text-white p-[10px] rounded-[5px] bg-(--primary-lighter)" type="text" placeholder = "Username" name="activationUsername" id="activationUsername" />
            </div>
            <button className="p-[10px] rounded-[5px] bg-(--primary) text-white self-center cursor-pointer">Submit</button>
        </form>
    )
}

export default Activation

