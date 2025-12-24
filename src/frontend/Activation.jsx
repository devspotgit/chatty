
import { useState } from "react"


function Activation(){

    function submit(e){

        e.preventDefault()
    }

    const [profilePicture, setProfilePicture] = useState("/images/avatar.png")

    return (
        <form className="bg-(--primary-lighter-plus) flex flex-col p-[20px] gap-[20px] rounded-[10px]" onSubmit={submit}>
            <div className="flex flex-col gap-[15px]">
                <label for="activationUpload" className="cursor-pointer text-center text-[0.8rem] font-bold text-(--primary)">Upload profile picture</label>
                <input className="hidden" type="file" accept="image/*" id="activationUpload"/>
                <div className = "h-[60px] w-[60px] relative self-center">
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

