
import { AppContext } from "./Context"
import { useContext } from "react"
import { CiMenuBurger } from "react-icons/ci"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { useState } from "react"
import chatty from "./../backend/lib.js"


function Sidepanel({panelVisibility, setPanelVisibility}){

    const { currentUser, setCurrentUser, setLoadingVisibility, currentReceiver, setCurrentReceiver, users, setUsers, search, setSearch } = useContext(AppContext)

    const [isDropDownOpen, setDropDown] = useState(false)

    function logout(){

        chatty.logout()

        .catch(error => {

            console.log(error)
        })
    }

    function avatarChange(e){

        chatty.updateAvatar(e.target.files[0])

        .then(({currentUser}) => {

            setLoadingVisibility(false)

            setCurrentUser(currentUser)
        })
        .catch( error => {

            setLoadingVisibility(false)

            console.log(error)
        })

        setLoadingVisibility(true)
    }

    return (

        <div className = {" z-[2] bg-(--primary-light) absolute top-[0px] left-[-250px] w-[250px] transition-[left] sm:static sm:h-[100%] "  + (panelVisibility ? "left-[0px]" : "")}>

            <div className = "flex flex-col gap-[20px] justify-between relative p-[10px] h-[125px] box-border">
                <button className = "text-[1.5rem] absolute top-[0px] cursor-pointer left-[100%] sm:hidden" onClick={()=>setPanelVisibility(!panelVisibility)}><CiMenuBurger /></button>
                <div className="flex flex-row justify-between relative">
                    <div className="flex flex-row gap-[10px] items-center">
                        <div className = "relative w-[40px] h-[40px] overflow-hidden flex justify-center items-center bg-(--primary-lighter) rounded-[100%]">
                            <span className="text-white text-[1.3rem] font-bold">{currentUser.email.split("")[0].toUpperCase()}</span>
                            <img className={"absolute top-[0px] left-[0px] w-[100%] h-[100%] " + (!currentUser.avatar ? "hidden" : "")} src={currentUser.avatar} />
                        </div>
                        <span className="text-white text-[1.2rem] font-bold">{currentUser?.email.split("@")[0].split("").map((letter, index) => index == 0 ? letter.toUpperCase() : letter)}</span>
                    </div>
                    <button className="cursor-pointer text-white text-[1.5rem]" onClick={() => setDropDown(!isDropDownOpen)}><HiOutlineDotsVertical /></button>
                    <div className={"absolute top-[100%] right-[0px] p-[10px] rounded-[5px] flex-col bg-(--primary-lighter) gap-[10px] " + (isDropDownOpen ? "flex" : "hidden")}>
                        <label for="avatar" className="text-white cursor-pointer p-[5px]">Update Avatar</label>
                        <input type="file"  id="avatar" className="hidden" accept="image/*" onChange={avatarChange}/>
                        <button className="bg-red-400 rounded-[5px] cursor-pointer p-[5px] text-white" onClick={logout}>Logout</button>
                    </div>
                </div>
                <input type="text" placeholder="search users" className="rounded-[5px] text-white p-[10px] bg-(--primary-lighter-plus) placeholder:text-white focus:outline-[0px]" />
            </div> 


           <div className = "overflow-auto h-[375px]">
               {users?.map((user, index) => (
                    <div className={"flex cursor-pointer flex-row p-[10px] gap-[10px] items-center " + (index < users.length-1 ? "border-b-(--primary-lighter-plus) border-b-[1px]" : "")}>
                        <div className={"w-[40px] h-[40px] relative rounded-[100%] flex justify-center items-center bg-(--primary-lighter) overflow-hidden " + (user.isCurrentReceiver ? "border-green-600 border-[3px]" : "")}>
                            <span className="text-white text-[1.3rem] font-bold">{user.email.split("")[0].toUpperCase()}</span>
                            <img src={user.avatar} className={"absolute w-[100%] h-[100%] top-[0px] left-[0px] " + (!user.avatar ? "hidden" : "")} />
                        </div>
                        <div className="flex flex-col justify-between grow">
                            <span className="text-white font-bold">{user.email.split("@")[0].split("").map((letter, index) => index == 0 ? letter.toUpperCase() : letter)}</span>
                            <span className="text-ellipsis w-[100px] overflow-hidden whitespace-nowrap text-(--primary-lighter-plus) text-[0.8rem]">{user.lastMessage}</span>
                        </div>
                        <span className={"text-white w-[25px] text-[0.8rem] text-center leading-[25px] rounded-[100%] font-bold h-[25px] bg-green-600 " + (user.nonReadMessage == 0 ? "hidden" : "")}>{user.nonReadMessage}</span>
                    </div>
               ))}
           </div>

        </div>
    )
}


function Mainscreen(){

    return (

        <>
            {/* <div>
                <div className = "h-[15%]"></div>
                <div className = "h-[70%]"></div>
                <div className = "h-[15%]"></div>
            </div> */}

            <div className=""> 
                <span>Select a user to start a chat</span>
            </div>
        </>
    )
}


function Userspace(){

    const { page } = useContext(AppContext)

    const [panelVisibility, setPanelVisibility] = useState(false)

    return (

        <div className={ "w-[800px] h-[500px] bg-(--primary-lighter-plus) grid-cols-[auto] relative sm:grid-cols-[250px_auto] " + (page != "userspace" ? "hidden" : "grid" )}>
            <Sidepanel panelVisibility={panelVisibility} setPanelVisibility={setPanelVisibility} />
            <Mainscreen />
            <div className={ " z-[1] absolute h-[100%] w-[100%] bg-[rgba(255,255,255,0.5)] sm:hidden " + (panelVisibility ? "block" : "hidden")} onClick={()=>setPanelVisibility(!panelVisibility)}></div>
        </div>
    )
}

export default Userspace

