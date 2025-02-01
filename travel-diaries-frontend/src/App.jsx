import { useState } from 'react'
// import HeroSection from './assets/LandingPage/Parts/HeroSection'
import LandingPageSection from './assets/LandingPage/LandingPageSection'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LandingPageSection/>
    </>
  )
}

export default App
