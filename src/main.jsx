import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './frontend/App.jsx'

class coord{
  constructor({x, y}){
    this.x = x
    this.y = y
  }

  getx(){
    return this.x
  }

  gety(){
    return this.y
  }

  setx(x){
    this.x = x 
  }

  sety(y){
    this.y = y
  }
}

const x=14, y=23

const data = { x }

window.c = new coord({...data, y})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
