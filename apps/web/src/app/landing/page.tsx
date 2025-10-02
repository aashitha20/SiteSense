export default function LandingPage() {
  return (
    <div className="h-[85vh] w-full bg-[#f9fafb] relative">
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
      <p className="text-center text-lg text-secondary">Are you a Web-Developer, Freelancer or Student, trying to build a optimized web? SiteSense helps you test the Performance, UX, SEO and Security of your website — all in one place.</p>
      <br />
      <h2 className="text-3xl font-semibold text-center text-primary">Run Anywhere - Your Way</h2>
    </div>
    <div className="flex justify-center space-x-20 relative z-1">
    <div className="flex space-x-8">
        <div className="bg-white rounded-2xl shadow-md transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-1 p-8 w-80 flex flex-col items-center">
            <div className="w-full flex flex-col items-start">
            <h2 className="text-2xl font-semibold mb-2 text-primary text-left w-full">Hosted Websites</h2>
            <p className="text-gray-600 mb-4 text-left w-full">
                Got a website? Drop your URL and get instant insights — no installs, no juggling, just results!
            </p>
            </div>
            <button className="mt-auto px-4 py-2 rounded-lg button-bg text-white font-medium">
            Start Audit
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow-md transition-transform transition-shadow duration-200 hover:shadow-xl hover:-translate-y-1 p-8 w-80 flex flex-col items-center">
            <div className="w-full flex flex-col items-start">
            <h2 className="text-2xl font-semibold mb-2 text-primary text-left w-full">Local Host</h2>
            <p className="text-gray-600 mb-4 text-left w-full">
                Your localhost, tested instantly. One CLI download, one terminal command.
            </p>
            </div>
            <button className="mt-auto px-4 py-2 rounded-lg button-bg text-white font-medium">
            Check Now
            </button>
        </div>
    </div>
    </div>
  </div>
  )
}