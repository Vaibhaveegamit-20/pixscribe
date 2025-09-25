import React from 'react'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import GenerateBtn from '../components/GenerateBtn'

const About = () => {
  return (
    <div>
      <Description/>
      <Steps/>
      <Testimonials/>
      <GenerateBtn/>
    </div>
  )
}

export default About
