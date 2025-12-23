
import { ImSpinner8 } from "react-icons/im"

import { AppContext } from "./Context"

import { useContext } from "react"


function Loading(){

    const { isLoadingVisible } = useContext(AppContext)

    return (
        <div className = {"top-[0px] left-[0px] h-[100%] w-[100%] bg-[rgba(255,255,255,0.7)] absolute justify-center items-center " + (isLoadingVisible ? "flex" : "hidden")}>
            <span className = "text-(--primary-light) text-[4rem] loading-anim"><ImSpinner8 /></span>
        </div>
    )
}

export default Loading

