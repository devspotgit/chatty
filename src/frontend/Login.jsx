
import { IoEyeOutline } from "react-icons/io5"
import { PiEyeSlashLight } from "react-icons/pi"
import { useState, useContext } from "react"
import { AppContext } from "./Context"

function Login(){

    const [ isPasswordVisible, setPasswordVisibility ] = useState(false)

    const { page, setPage, setMessage, setMessageType, setLoadingVisibility } = useContext(AppContext)

    function submit(e){

        e.preventDefault()

        // setLoadingVisibility(true)

        // setTimeout(()=>{

        //     setLoadingVisibility(false)

        //     setMessage("login")

        //     setMessageType("success")

        // }, 2000)
    }

    return (
        <form className={"flex-col gap-[20px] bg-(--primary-lighter-plus) p-[20px] rounded-[10px] " + (page!="login" ? "hidden" : "flex")} onSubmit={submit}>
            <span className="text-center font-bold text-[1.5rem] text-(--primary)">Login</span>
            <div className="flex flex-col gap-[15px]">
                <label for="loginEmail" className="text-[0.8rem] text-(--primary-light) font-bold">Email</label>
                <input className="focus:outline-[0px] p-[10px] rounded-[5px] bg-(--primary-lighter) text-white placeholder:text-white" type="text" placeholder="Email" name="email" id="loginEmail" />
            </div>
            <div className="flex flex-col gap-[15px]">
                <label className="text-[0.8rem] text-(--primary-light) font-bold" for="loginPassword">Password</label>
                <div className="flex flex-row p-[10px] bg-(--primary-lighter) rounded-[5px] gap-[10px]">
                    <input className="text-white placeholder:text-white focus:outline-[0px]" type={isPasswordVisible ? "text" : "password"} placeholder="Password" name="password" id="loginPassword" />
                    <button type="button" className={"cursor-pointer text-white " + (isPasswordVisible ? "hidden" : "")} onClick={() => setPasswordVisibility(!isPasswordVisible)}><IoEyeOutline /></button>
                    <button type="button" className={ "cursor-pointer text-white " + (isPasswordVisible ? "" : "hidden")} onClick={() => setPasswordVisibility(!isPasswordVisible)}><PiEyeSlashLight /></button>
                </div>
            </div>
            <button className="p-[10px] rounded-[5px] bg-(--primary) text-white self-center cursor-pointer">Submit</button>
            <p className="text-[0.8rem]">
                <span className="text-white">Don't have an account yet, </span> 
                <a className="text-(--primary) font-bold" href="" onClick={(e)=>{
                    e.preventDefault()
                    setPage("signup")
                }}>Sign up</a></p>
        </form>
    )
}

export default Login
