import { useState } from 'react'
import './App.css'

function App() {
  const [title, setTitle] = useState('Hello Tailwind!')

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-500">{title}</h1>
    </>
  )
}

export default App
