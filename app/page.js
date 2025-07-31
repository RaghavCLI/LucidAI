import React from 'react'
import Header from '../components/customs/Header'
import Hero from '../components/customs/Hero'
import CosmicBackground from '../components/ui/CosmicBackground'

function page() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Cosmic Background */}
      <CosmicBackground />
    
      {/* Your Content/Components */}
      <div className="relative z-10">
        <Header />
        <Hero />
      </div>
    </div>
  )
}

export default page