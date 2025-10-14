// index.js (Core Endpoint Discovery Module)

/**
 * Project: SiteSense Web Auditor - Crawler Component
 * Purpose: Implements a Breadth-First Search (BFS) to crawl a website and discover
 * internal, canonical HTML endpoints.
 * Output: Returns a structured JavaScript Object (JSON-ready) containing the list of URLs.
 */

// --- Dependencies ---
const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

// --- Configuration Constants ---
const MAX_CRAWL_DEPTH = 2; 
const MAX_PAGES_TO_VISIT = 50; 
const REQUEST_TIMEOUT_MS = 5000;

/**
 * Helper Function: Normalizes and Validates URLs
 * Ensures the URL is absolute, on the same domain, and removes query parameters/anchors.
 * @param {string} href The raw link found on the page.
 * @param {string} baseUrl The base URL of the site being crawled.
 * @returns {string | null} The normalized URL or null if it's invalid/external/static.
 */
function normalizeAndValidateUrl(href, baseUrl) {
    try {
        // 1. Resolve to Absolute URL
        const resolvedUrl = new URL(href, baseUrl);

        // 2. Scope Check: Must be on the same host domain
        const baseHost = new URL(baseUrl).host;
        if (resolvedUrl.host !== baseHost) {
            return null; // Ignore external links
        }

        // 3. Clean up: Remove search query parameters and hash anchors for canonical endpoint
        resolvedUrl.search = '';
        resolvedUrl.hash = '';

        // 4. Filter Static Assets: Only care about HTML endpoints.
        const path = resolvedUrl.pathname.toLowerCase();
        if (path.match(/\.(pdf|zip|png|jpg|gif|css|js|xml)$/)) {
            return null;
        }

        return resolvedUrl.href;
    } catch (e) {
        // Silent failure for unparseable URLs
        return null;
    }
}


/**
 * Core Crawler Function: Discovers all endpoints on a website.
 * Implements a Breadth-First Search (BFS) for systematic exploration.
 * @param {string} startUrl The entry point for the crawl.
 * @param {number} [maxDepth=MAX_CRAWL_DEPTH] The maximum recursion depth.
 * @returns {Promise<Object>} A promise that resolves to the final JSON output object (ready to be written to MongoDB/used by the SEO module).
 */
async function crawlWebsite(startUrl, maxDepth = MAX_CRAWL_DEPTH) {
    const initialUrl = normalizeAndValidateUrl(startUrl, startUrl);
    if (!initialUrl) {
        throw new Error("Invalid or unparseable starting URL provided.");
    }
    
    // State for BFS
    const visitedUrls = new Set();
    const urlsQueue = [{ url: initialUrl, depth: 0 }];
    const discoveredEndpoints = new Set();

    // Start tracking
    visitedUrls.add(initialUrl);
    discoveredEndpoints.add(initialUrl);

    // Main BFS Loop
    while (urlsQueue.length > 0 && visitedUrls.size <= MAX_PAGES_TO_VISIT) {
        const { url: currentUrl, depth: currentDepth } = urlsQueue.shift();

        // Exit Condition Check
        if (currentDepth >= maxDepth) {
            continue; // Stop crawling deeper
        }

        // Fetch the Page
        try {
            // NOTE: Using the initial URL as the hostname check assumes the startUrl is correct.
            const response = await axios.get(currentUrl, { timeout: REQUEST_TIMEOUT_MS });
            
            // Only process HTML content
            const contentType = response.headers['content-type'];
            if (!contentType || !contentType.includes('text/html')) {
                continue;
            }

            // Parse and Extract Links
            const $ = cheerio.load(response.data);
            
            $('a').each((i, element) => {
                const rawHref = $(element).attr('href');
                if (!rawHref) return;

                const nextUrl = normalizeAndValidateUrl(rawHref, currentUrl);

                // Add unique, valid links to the queue
                if (nextUrl && !visitedUrls.has(nextUrl)) {
                    visitedUrls.add(nextUrl);
                    discoveredEndpoints.add(nextUrl);
                    
                    urlsQueue.push({ 
                        url: nextUrl, 
                        depth: currentDepth + 1 
                    });
                }
            });

        } catch (error) {
            // Suppress verbose network errors in the module's core logic. 
            // The calling module (SEO) will handle fatal errors.
        }
    }
    
    // Final Output Generation
    const finalEndpointsArray = Array.from(discoveredEndpoints);

    const jsonOutput = {
        scan_id: `crawl-${Date.now()}`,
        start_url: initialUrl,
        total_endpoints_found: finalEndpointsArray.length,
        timestamp: new Date().toISOString(),
        endpoints: finalEndpointsArray,
        metadata: {
            max_depth_used: maxDepth,
            pages_scanned: visitedUrls.size,
        }
    };
    
    // Returns the JavaScript Object directly for programmatic consumption
    return jsonOutput;
}


// --- Module Export (CRITICAL: Makes crawlWebsite callable by SEO Module) ---
module.exports = {
    crawlWebsite
};