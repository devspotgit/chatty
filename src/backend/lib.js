import { auth, db, rtdb, storage } from "./firebase_config.js"

import { collection, getDocs, addDoc, getDoc, doc, setDoc, query, where } from "firebase/firestore"

import { ref, set, onValue } from "firebase/database"

import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"


const chatty = {

    users: [],

    currentUser: null,

    currentReceiver: null,


    /* -------------------------------- logout ------------------------------ */
    logout(){

        this.users = []

        this.currentReceiver = null

        this.currentUser = null

        return signOut(auth)
    },


    /* -------------------------------- signup ------------------------------ */
    signup(email, password){

        return  createUserWithEmailAndPassword(auth, email, password)
    },


    /* -------------------------------- login ------------------------------ */
    login(email, password){

        return  signInWithEmailAndPassword(auth, email, password)
    },


    /* -------------------------------- auth change ------------------------------ */
    onAuthChange({userLogin, userLogout, errorHandler}){

        onAuthStateChanged(auth, user => {

            if(user){

                this.init({user, userLogin, errorHandler})
            }
            else{

                this.init({userLogout, errorHandler})
            }
        })
    },


    /* -------------------------------- initialize app ------------------------------ */
    async init({user, userLogin, userLogout, errorHandler}){

        try{

            if(user){ 

                const userDoc = await getDoc(doc(db, "users", user.uid))

                if(!userDoc.exists()){

                    await setDoc(doc(db, "users", user.uid), {

                        id: user.uid,

                        email: user.email,

                        avatar: null
                    })
                }
    
                const userDocs = await getDocs(collection(db, "users"))
    
                const messageDocs = await getDocs(collection(db, "messages"))
        
                userDocs.forEach(userDoc => {
    
                    if(userDoc.id != user.uid){
        
                        const messages = []
        
                        messageDocs.forEach(messageDoc => {                 
        
                            if((messageDoc.data().sender == user.uid && messageDoc.data().receiver == userDoc.id) || (messageDoc.data().sender == userDoc.id && messageDoc.data().receiver == user.uid)){
        
                                messages.push(messageDoc.data())
                            }
                        })
        
                        this.users.push({...userDoc.data(), isCurrentReceiver: false, nonReadMessage: 0, unsubscribeMessage: null, unsubscribeImage: null, lastMessage: "my mesage, there are some messages you don't want to hear my friend", messages})
                    }
                })
        
                userDocs.forEach(userDoc => {
        
        
                    if(user.uid == userDoc.id){
        
                        this.currentUser = userDoc.data()
                    }
                })

                userLogin({users: this.users, currentUser: this.currentUser, currentReceiver: this.currentReceiver})
            }
            else{ 

                userLogout()
            }
        }
        catch(error){

            errorHandler(error)
        }
    },

    /* -------------------------------- add message ------------------------------ */
    async addMessage (content){

        const data = {

            content: content,

            createdAt: Date.now(),

            receiver: this.currentReceiver.id,

            sender: this.currentUser.id
        }

        try{

            await addDoc(collection(db, "messages"), data)

            await set(ref(rtdb, "users/" + this.currentUser.id + "/message"), data)

            this.currentReceiver.messages.push(data)

            return {...this.currentReceiver}
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* -------------------------------- event on new message ------------------------------ */
    onMessage(callback){

        this.users.forEach(user => {

            user.unsubscribeMessage = onValue(ref(rtdb, "users/" + user.id + "/message"), (snapshot)=>{

                const data = snapshot.val()

                if(data.receiver == this.currentUser.id){

                    if(user.id == this.currentReceiver.id){

                        user.messages.push(data)

                        this.currentReceiver.lastMessage = data.content

                        callback({users:[...this.users], currentReceiver:{...this.currentReceiver}, sender:user.email})
                    }
                    else{

                        user.messages.push(data)

                        user.nonReadMessages ++

                        user.lastMessage = data.content

                        callback({users:[...this.users], currentReceiver:{...this.currentReceiver}, sender:user.email})
                    }
                }
            })
        })
    },


    /* ------------------------------ event on avatar change ------------------------------ */
    onAvatarChange(callback){

        this.users.forEach(user => {

            user.unsubscribeImage = onValue(ref(rtdb, "users/" + user.id + "/avatar"), (snapshot)=>{

                const data = snapshot.val()

                user.avatar = data.url

                callback({users:[...this.users], currentReceiver:{...this.currentReceiver}})
            })
        })
    },


    /* ------------------------------ update avatar ------------------------------ */
    async updateAvatar(avatar){

        try{

            const currentUserId = this.currentUser.id
        
            const snapshot = await uploadBytes(storageRef(storage, "users/" + currentUserId + "/avatar/avatar_img"), avatar)
        
            const url = await getDownloadURL(snapshot.ref)
        
            await setDoc(doc(db, "users", currentUserId), {
    
                id: currentUserId,
    
                email: this.currentUser.email,
    
                avatar: url
            })

            await set(ref(rtdb, "users/" + currentUserId + "/avatar"), {url})

            this.currentUser.avatar = url

            return {currentUser: {...this.currentUser}}
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* ------------------------------ change receiver ------------------------------ */
    changeReceiver(receiver){

        if(this.currentReceiver != null){

            this.currentReceiver.isCurrentReceiver = false
        }

        this.currentReceiver = this.users.find(user => user.id == receiver)

        this.currentReceiver.isCurrentReceiver = true

        this.currentReceiver.nonReadMessages = 0

        return { users: [...this.users], currentReceiver: {...this.currentReceiver}}
    },


    /* ------------------------------ search user ------------------------------ */
    searchUser(email){

        const users = []

        if(email.trim() != ""){

            this.users.forEach(user => {
    
                if(user.email.includes(email.trim())) users.push(user)
            })
    
            return users
        }
        else{

            return []
        }
    }

    

}


export default chatty





