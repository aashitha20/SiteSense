import Footer from '@/components/footer';

export default function DashboardPage() {
    return(
        <div className="min-h-screen bg-[#f9fafb] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                        Dashboard
                    </h1>
                    <p className="text-secondary">
                        Monitor and manage all your website scans in one place.
                    </p>
                </div>

                {/* Coming Soon Card */}
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold text-primary mb-4">
                            Dashboard Coming Soon
                        </h2>
                        <p className="text-secondary mb-6">
                            We're working on bringing you comprehensive analytics, historical data, 
                            and detailed insights about your website performance.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a 
                                href="/scanpage"
                                className="button-bg text-tertiary font-semibold py-3 px-6 rounded-lg transition-all"
                            >
                                Start a Scan
                            </a>
                        </div>
                    </div>
                </div>

                {/* Feature Preview Grid */}
                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Historical Data',
                            description: 'Track performance trends over time',
                            icon: '📈',
                        },
                        {
                            title: 'Comparison Tools',
                            description: 'Compare scans side by side',
                            icon: '⚖️',
                        },
                        {
                            title: 'Automated Reports',
                            description: 'Schedule and export detailed reports',
                            icon: '📄',
                        },
                    ].map((feature, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-center opacity-60">
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <h3 className="text-lg font-semibold text-primary mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-secondary text-sm">
                                {feature.description}
                            </p>
                            <p className="text-xs text-secondary mt-3 italic">Coming Soon</p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    ) 
}