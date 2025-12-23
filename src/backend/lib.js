import { auth, db, rtdb, storage } from "./firebase_config.js"

import { collection, getDocs, addDoc } from "firebase/firestore"

import { ref, set, onValue } from "firebase/database"


/* -------------------------- class Message --------------------------- */
class Message{

    constructor({ content, createdAt, senderId, receiverId }){

        this.content = content

        this.createdAt = createdAt

        this.senderId = senderId

        this.receiverId = receiverId
    }
}

/* -------------------------- class User --------------------------- */
class User{

    constructor({ username, profilePicture, userId, messages }){

        this.username = username

        this.profilePicture = profilePicture

        this.userId = userId

        this.messages = messages

        this.isCurrentReceiver = false

        this.nonReadMessages = 0

        this.unsubscribe = null
    }

    getData(){

        return {

            username: this.username,

            profilePicture: this.profilePicture,

            userId: this.userId,

            messages: this.messages

            isCurrentReceiver: this.isCurrentReceiver

            nonReadMessages: this.nonReadMessages

            unsubscribe: this.unsubscribe
        }
    }
}

/* -------------------------- class App --------------------------- */
class App{

    constructor({ users, currentUser, currentReceiver }){

        this.users = users

        this.currentUser = currentUser

        this.currentReceiver = currentReceiver
    }

    async addMessage(content){

        const data = {

            content,

            createdAt: Date.now()

            senderId: currentUser.userId,

            receiverId: currentReceiver.userId
        }

        try{

            await addDoc(collection(db, "messages"), data)

            await set(ref(rtdb, "users/" + currentUser.userId))

            this.currentReceiver.messages.push(new Message(data))

            return new User(this.currentReceiver.getData())
        }

        catch(error){

            return Promise.reject(error)
        }
    }


    listenMessage(callBack){

        this.users.forEach(user => {

            user.unsubscribe = onValue(ref(rtdb, "users/" + userId), (snapshot)=>{

                const data = snapshot.val()

                if(data.receiverId == this.currentUser.userId){

                    if(data.senderId == this.currentReceiver.userId){

                        user.messages.push(new Message(data))

                        callback(null, new User(user.getData()))

                    }
                    else{

                        user.messages.push(new Message(data))

                        user.nonReadMessages ++

                        callBack([...this.users])
                    }
                }
            })
        })
    }

  
    changeReceiver(receiverId){



    }



    async static init(){

        const data = {

            users: [],

            currentUser: null,

            currentReceiver = null
        }

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
    
                        if(messageData.senderId == currentUserId && messageData.receiverId == userId){
    
                            messages.push(new Message(messageData))
                        }
                    })
    
                    data.users.push(new User({ ...userData, messages }))
                }
            })
    
            userDocs.forEach(userDoc => {
    
                const userData = userDoc.data()
    
                const userId = userDoc.id
    
                if(userId == currentUserId){
    
                    data.currentUser = new User( { ...userData, messages: null } )
                }
            })
    
            return new App(data)
        }

        catch(error){

            return Promise.reject(error)
        }
    }
}



