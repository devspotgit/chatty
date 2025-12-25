
import { AppContext } from "./Context"
import { useContext } from "react"
import { CiMenuBurger } from "react-icons/ci"
import { useState } from "react"




function Sidepanel({panelVisibility, setPanelVisibility}){

    return (

        <div className = {" z-[2] absolute top-[0px] left-[-250px] bg-blue-200 w-[250px] h-[100%] transition-[left] sm:top-[initial] sm:left-[initial] sm:h-[auto] sm:static sm:w-[auto] "  + (panelVisibility ? "left-[0px]" : "")}>
            <div className = "border-red-200 border-[1px] h-[25%] relative">
                <button className = "text-[1.5rem] absolute top-[0px] cursor-pointer left-[100%] sm:hidden" onClick={()=>setPanelVisibility(!panelVisibility)}><CiMenuBurger /></button>
            </div> 
           <div className = "h-[75%] border-[1px] border-red-200">
                
           </div>
        </div>
    )
}


function Mainscreen(){

    return (

        <div>
            <div className = "border-red-200 border-[1px] h-[15%]"></div>
            <div className = "border-red-200 border-[1px] h-[70%]"></div>
            <div className = "border-red-200 border-[1px] h-[15%]"></div>
        </div>
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

