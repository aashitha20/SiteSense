export default function Home() {
  return (
        <div className="min-h-screen w-full bg-[#f9fafb] relative">
  {/* Diagonal Fade Center Grid Background */}
  <div
    className="absolute inset-0 z-0 opacity-50"
    style={{
      backgroundImage: `
        linear-gradient(to right, #d1d5db 1px, transparent 1px),
        linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
      `,
      backgroundSize: "25px 25px",
      WebkitMaskImage:
         "radial-gradient(ellipse 90% 85% at 50% 50%, #000 30%, transparent 70%)",
      maskImage:
         "radial-gradient(ellipse 90% 85% at 50% 50%, #000 30%, transparent 70%)",
    }}
  />
    <div className="container mx-auto px-4 py-8 relative z-1 space-y-4">
      <h1 className="text-6xl font-bold text-center text-primary">Complete Website Analysis, A Simplified Solution</h1>
      <p className="text-center text-lg text-secondary">Get insights into your website's performance, SEO, and user experience with our comprehensive analysis tool.</p>
    </div>
</div>
  )
}