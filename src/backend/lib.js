import { auth, db, rtdb, storage } from "./firebase_config.js"

import { collection, getDocs, addDoc, getDoc, doc, setDoc } from "firebase/firestore"

import { ref, set, onValue } from "firebase/database"

import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"


const chatty = {

    users: [],

    currentUser: null,

    currentReceiver: null,


    /* -------------------------------- signup ------------------------------ */
    async signup(email, password){

        try{

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            return userCredential
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* -------------------------------- initialize app ------------------------------ */
    async initApp(){

        try{

            const currentUserId = auth.currentUser.uid
    
            const userDocs = await getDocs(collection(db, "users"))
    
            const messageDocs = await getDocs(collection(db, "messages"))

            userDocs.forEach(userDoc => {
    
                const userData = userDoc.data()
    
                const userId = userDoc.id
    
                if(userId != currentUserId){
    
                    const messages = []
    
                    messageDocs.forEach(messageDoc => {
    
                        const messageData = messageDoc.data()                    
    
                        if((messageData.senderId == currentUserId && messageData.receiverId == userId) || (messageData.senderId == userId && messageData.receiverId == currentUserId)){
    
                            messages.push(messageData)
                        }
                    })
    
                    this.users.push({...userData, isCurrentReceiver: false, nonReadMessage: 0, unsubscribeMessage: null, unsubscribeImage: null, messages})
                }
            })
    
            userDocs.forEach(userDoc => {
    
                const userData = userDoc.data()
    
                const userId = userDoc.id
    
                if(userId == currentUserId){
    
                    this.currentUser = userData
                }
            })
    
            return {isActivated: true, users: this.users, currentUser: this.currentUser, currentReceiver: this.currentReceiver}
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* -------------------------------- login ------------------------------ */
    async login(email, password){

        try{

            const userCredential = await signInWithEmailAndPassword(auth, email, password)

            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))

            if(userDoc.exists()){

                const data = await this.initApp()

                return data
            }
            else{

                return { isActivated: false}
            }
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* -------------------------------- activation ------------------------------ */
    async activation(username, profilePictureFile){

        try{
            
            const currentUserId = auth.currentUser.uid
    
            const snapshot = await uploadBytes(storageRef(storage, "images/" + currentUserId + "/pic"), profilePictureFile)
    
            const url = await getDownloadURL(snapshot.ref)
    
            await setDoc(doc(db, "users", currentUserId), {
    
                userId: currentUserId,
    
                username: username,
    
                profilePicture: url
            })

            const data = await this.initApp()

            return data
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* -------------------------------- add message ------------------------------ */
    async addMessage (content){

        const data = {

            content: content,

            createdAt: Date.now(),

            receiverId: this.currentReceiver.userId
        }

        try{

            await addDoc(collection(db, "messages"), data)

            await set(ref(rtdb, "users/" + this.currentUser.userId + "/message"), data)

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

            user.unsubscribeMessage = onValue(ref(rtdb, "users/" + user.userId + "/message"), (snapshot)=>{

                const data = snapshot.val()

                if(data.receiverId == this.currentUser.userId){

                    if(user.userId == this.currentReceiver.userId){

                        user.messages.push(data)

                        callback({users:[...this.users], currentReceiver:{...this.currentReceiver}, sender:user.username })
                    }
                    else{

                        user.messages.push(data)

                        user.nonReadMessages ++

                        callback({users:[...this.users], currentReceiver:{...this.currentReceiver}, sender:user.username})
                    }
                }
            })
        })
    },


    /* ------------------------------ event on picture profile change ------------------------------ */
    onImage(callback){

        this.users.forEach(user => {

            user.unsubscribeImage = onValue(ref(rtdb, "users/" + user.userId + "/image"), (snapshot)=>{

                const data = snapshot.val()

                user.profilePicture = data.url

                callback({users:[...this.users], currentReceiver:{...this.currentReceiver}})
            })
        })
    },


    /* ------------------------------ update profile picture ------------------------------ */
    async updateProfilePicture(profilePictureFile){

        try{

            const currentUserId = this.currentUser.userId
        
            const snapshot = await uploadBytes(storageRef(storage, "images/" + currentUserId + "/pic"), profilePictureFile)
        
            const url = await getDownloadURL(snapshot.ref)
        
            await setDoc(doc(db, "users", currentUserId), {
    
                userId: currentUserId,
    
                username: this.currentUser.username,
    
                profilePicture: url
            })

            await set(ref(rtdb, "users/" + currentUserId + "/image"), {url})

            this.currentUser.profilePicture = url

            return {currentUser: {...this.currentUser}}
        }
        catch(error){

            return Promise.reject(error)
        }
    },


    /* ------------------------------ change receiver ------------------------------ */
    changeReceiver(receiverId){

        if(this.currentReceiver != null){

            this.currentReceiver.isCurrentReceiver = false
        }

        this.currentReceiver = this.users.find(user => user.userId == receiverId)

        this.currentReceiver.isCurrentReceiver = true

        this.currentReceiver.nonReadMessages = 0

        return { users: [...this.users], currentReceiver: {...this.currentReceiver}}
    },


    /* ------------------------------ search user ------------------------------ */
    searchUser(username){

        const users = []

        if(username.trim() != ""){

            this.users.forEach(user => {
    
                if(user.username.includes(username.trim())) users.push(user)
            })
    
            return users
        }
        else{

            return []
        }
    }

    

}


export default chatty





