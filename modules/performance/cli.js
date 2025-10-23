#!/usr/bin/env node

import { runAudit, loadInputFromFile } from './index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);

function printUsage() {
  console.log(`
SiteSense Performance & SEO Auditor

Usage:
  node cli.js <input-file.json> [options]
  node cli.js --urls <url1> <url2> ... [options]

Options:
  -o, --output <file>     Save results to JSON file
  -h, --help              Show this help message

Examples:
  # Audit from input file
  node cli.js input.json -o results.json

  # Audit specific URLs
  node cli.js --urls https://example.com https://example.com/about -o results.json

Input JSON format:
  {
    "endpoints": [
      "https://example.com",
      "https://example.com/about",
      "https://example.com/contact"
    ],
    "outputFile": "results.json" (optional)
  }
`);
}

async function main() {
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printUsage();
    process.exit(0);
  }

  try {
    let input = {};

    // Check if using --urls flag
    const urlsIndex = args.findIndex(arg => arg === '--urls');
    if (urlsIndex !== -1) {
      const urls = [];
      for (let i = urlsIndex + 1; i < args.length; i++) {
        if (args[i].startsWith('-')) break;
        urls.push(args[i]);
      }
      input.endpoints = urls;
    } else {
      // Load from file
      const inputFile = args[0];
      input = await loadInputFromFile(inputFile);
    }

    // Check for output flag
    const outputIndex = args.findIndex(arg => arg === '-o' || arg === '--output');
    if (outputIndex !== -1 && args[outputIndex + 1]) {
      input.outputFile = args[outputIndex + 1];
    }

    // Run the audit
    const results = await runAudit(input);

    // Print summary
    console.log('\n=== AUDIT SUMMARY ===');
    console.log(`Total Pages Audited: ${results.summary.totalPages}`);
    console.log(`Performance Score: ${results.summary.overallPerformanceScore}/100 (${results.summary.performanceGrade})`);
    console.log(`SEO Score: ${results.summary.overallSeoScore}/100 (${results.summary.seoGrade})`);
    
    console.log('\n=== TOP ISSUES ===');
    console.log('\nPerformance Issues:');
    results.issues.performance.slice(0, 5).forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.title}`);
      console.log(`     Impact: ${issue.impact} | Effort: ${issue.effort} | Affects ${issue.affectedPages.length} page(s)`);
    });

    console.log('\nSEO Issues:');
    results.issues.seo.slice(0, 5).forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.title}`);
      console.log(`     Impact: ${issue.impact} | Effort: ${issue.effort} | Affects ${issue.affectedPages.length} page(s)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
