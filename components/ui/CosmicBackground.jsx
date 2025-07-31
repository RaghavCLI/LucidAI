const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-cosmic-deep" />

      {/* Curved planetary atmosphere gradient - positioned at top */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 60% at 50% 0%, 
            hsl(258 90% 66% / 0.6) 0%, 
            hsl(258 70% 45% / 0.4) 30%, 
            hsl(258 45% 25% / 0.2) 60%, 
            transparent 100%)`,
        }}
      />

      {/* Additional glow effect at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2"
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, 
            hsl(258 90% 66% / 0.3) 0%, 
            transparent 70%)`,
        }}
      />
    </div>
  );
};

export default CosmicBackground;
