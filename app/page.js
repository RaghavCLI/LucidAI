import React from 'react'
import Hero from '../components/customs/Hero'
import CosmicBackground from '../components/ui/CosmicBackground'
import FooterMain from '@/components/customs/FooterMain'

function page() {
  return (
    <div className="relative">
      {/* Cosmic Background only on home page */}
      <CosmicBackground />
      
      {/* Hero content with proper z-index */}
      <div className="relative z-10">
        <Hero />
        <FooterMain />
      </div>
    </div>
  )
}

export default page