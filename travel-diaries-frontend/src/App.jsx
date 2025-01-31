import { useState } from 'react'
import LandingPageSection from './LandingPage/LandingPageSection'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandingPageSection/>
    </>
  )
}

export default App
