"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/footer';

interface ScanResult {
    id: string;
    url: string;
    timestamp: Date;
    scanType: string;
    status: 'success' | 'error' | 'scanning';
    results?: {
        performance?: { score: number; metrics: any };
        seo?: { score: number; issues: string[] };
        ux?: { score: number; recommendations: string[] };
        security?: { score: number; vulnerabilities: string[] };
        overall?: number;
    };
}

export default function ScanReportPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [scan, setScan] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load scan from localStorage
        const stored = localStorage.getItem('recentScans');
        if (stored) {
            const scans = JSON.parse(stored);
            const foundScan = scans.find((s: any, index: number) => index.toString() === params.id);
            
            if (foundScan) {
                setScan({
                    ...foundScan,
                    id: params.id,
                    timestamp: new Date(foundScan.timestamp)
                });
            }
        }
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f9fafb] p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-secondary">Loading scan report...</p>
                </div>
            </div>
        );
    }

    if (!scan) {
        return (
            <div className="min-h-screen bg-[#f9fafb] p-6 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-primary mb-4">Scan Not Found</h1>
                    <p className="text-secondary mb-6">The scan report you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/scanpage')}
                        className="button-bg text-tertiary font-semibold py-2 px-6 rounded-lg transition-all"
                    >
                        Go to Scan Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9fafb] p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.back()}
                            className="text-primary hover:text-secondary font-medium mb-2 flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                        <h1 className="text-3xl font-bold text-primary">Scan Report</h1>
                        <p className="text-secondary mt-1">Report ID: {scan.id}</p>
                    </div>
                </div>

                {scan.status === 'success' && scan.results ? (
                    <div className="space-y-4">
                        {/* Overall Score */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Overall Score</CardTitle>
                                <CardDescription>{scan.url}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className={`text-5xl font-bold ${
                                        scan.results.overall! > 70 ? 'text-green-600' :
                                        scan.results.overall! > 30 ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                        {scan.results.overall}
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div 
                                                className={`h-3 rounded-full transition-all ${
                                                    scan.results.overall! > 70 ? 'bg-green-600' :
                                                    scan.results.overall! > 30 ? 'bg-yellow-600' :
                                                    'bg-red-600'
                                                }`}
                                                style={{ width: `${scan.results.overall}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Scanned on {formatTimestamp(scan.timestamp)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Scan Type: <span className="font-medium capitalize">{scan.scanType}</span>
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Performance Results */}
                        {scan.results.performance && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>⚡ Performance</span>
                                        <Badge className={`${
                                            scan.results.performance.score > 70 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : scan.results.performance.score > 30 
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}>
                                            {scan.results.performance.score}/100
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.entries(scan.results.performance.metrics).map(([key, value]) => (
                                            <div key={key} className="flex justify-between text-sm">
                                                <span className="text-gray-600 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                                </span>
                                                <span className="font-medium">{value as string}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* SEO Results */}
                        {scan.results.seo && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>🔍 SEO</span>
                                        <Badge className={`${
                                            scan.results.seo.score > 70 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : scan.results.seo.score > 30 
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}>
                                            {scan.results.seo.score}/100
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {scan.results.seo.issues.map((issue, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <span className="text-yellow-500 mt-0.5">⚠️</span>
                                                <span className="text-gray-700">{issue}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* UX Results */}
                        {scan.results.ux && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>♿ UX & Accessibility</span>
                                        <Badge className={`${
                                            scan.results.ux.score > 70 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : scan.results.ux.score > 30 
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}>
                                            {scan.results.ux.score}/100
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {scan.results.ux.recommendations.map((rec, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <span className="text-blue-500 mt-0.5">💡</span>
                                                <span className="text-gray-700">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Security Results */}
                        {scan.results.security && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>🔒 Security</span>
                                        <Badge className={`${
                                            scan.results.security.score > 70 
                                                ? 'bg-green-600 text-white hover:bg-green-700' 
                                                : scan.results.security.score > 30 
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                        }`}>
                                            {scan.results.security.score}/100
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {scan.results.security.vulnerabilities.map((vuln, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <span className="text-green-500 mt-0.5">✅</span>
                                                <span className="text-gray-700">{vuln}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => router.push('/scanpage')}
                                className="flex-1 button-bg text-tertiary font-semibold py-3 px-6 rounded-lg transition-all"
                            >
                                Scan Another Site
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex-1 bg-white hover:bg-gray-50 text-primary font-semibold py-3 px-6 rounded-lg border-2 border-gray-300 transition-all"
                            >
                                View Dashboard
                            </button>
                        </div>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-secondary">This scan is still in progress or encountered an error.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Footer />
        </div>
    );
}

function formatTimestamp(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
