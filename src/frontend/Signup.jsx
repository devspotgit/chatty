
import { IoEyeOutline } from "react-icons/io5"
import { PiEyeSlashLight } from "react-icons/pi"
import { useState, useContext } from "react"
import { AppContext } from "./Context"

function Signup(){

    const [ isPasswordVisible, setPasswordVisibility ] = useState(false)

    const { page, setPage, setMessage, setMessageType } = useContext(AppContext)

    function submit(e){

        e.preventDefault()
    }

    return (
        <form className={"flex-col gap-[20px] p-[20px] bg-(--primary-lighter-plus) rounded-[10px] " + (page != "signup" ? "hidden" : "flex")} onSubmit={submit}>
            <span className="font-bold text-center text-[1.5rem] text-(--primary)">Sign Up</span>
            <div className="flex flex-col gap-[15px]">
                <label className="text-(--primary-light) text-[0.8rem] font-bold" for="signupEail">Email</label>
                <input className="p-[10px] focus:outline-[0px] text-white bg-(--primary-lighter) rounded-[5px] placeholder:text-white" type="text" placeholder="Email" name="email" id="signupEmail" />
            </div>
            <div className="flex flex-col gap-[15px]">
                <label className="text-[0.8rem] text-(--primary-light) font-bold" for="signupPassword">Password</label>
                <div className="flex flex-row gap-[10px] bg-(--primary-lighter) p-[10px] rounded-[5px]">
                    <input className="text-white placeholder:text-white focus:outline-[0px]" type={isPasswordVisible ? "text" : "password"} placeholder="Password" name="password" id="signupPassword" />
                    <button className={"cursor-pointer text-white " + (isPasswordVisible ? "hidden" : "")}   type="button" onClick={() => setPasswordVisibility(!isPasswordVisible)}><IoEyeOutline /></button>
                    <button className={"cursor-pointer text-white " + (isPasswordVisible ? "" : "hidden")} type="button" onClick={() => setPasswordVisibility(!isPasswordVisible)}><PiEyeSlashLight /></button>
                </div>
            </div>
            <button className="text-white bg-(--primary) rounded-[5px] p-[10px] self-center cursor-pointer">Submit</button>
            <p className="text-[0.8rem]">
                <span className="text-white">Already have an account, </span>
                <a className="text-(--primary) font-bold" href="" onClick={(e) => {
                    e.preventDefault()
                    setPage("login")
                }}>Login</a>
            </p>
        </form>
    )
}

export default Signup

