import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/Button'

function App() {
  const [title, setTitle] = useState('Hello Tailwind!')

  return (
    <>
      <h1 className="text-3xl font-bold text-blue-500">{title}</h1>
    </>
  )
}

export default App
