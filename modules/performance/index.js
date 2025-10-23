import { auditMultipleEndpoints } from './evaluator.js';
import { validateInput, generateTextSummary } from './utils.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Main entry point for performance and SEO auditing
 * @param {Object} input - Input configuration
 * @param {string[]} input.endpoints - Array of URLs to audit
 * @param {string} [input.outputFile] - Optional output file path
 * @returns {Promise<Object>} Audit results
 */
export async function runAudit(input) {
  // Validate input
  validateInput(input);

  console.log(`Starting audit for ${input.endpoints.length} endpoint(s)...`);
  const startTime = Date.now();

  // Run the audit
  const results = await auditMultipleEndpoints(input.endpoints);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\nAudit completed in ${duration} seconds`);
  console.log(`Overall Performance Score: ${results.summary.overallPerformanceScore} (${results.summary.performanceGrade})`);
  console.log(`Overall SEO Score: ${results.summary.overallSeoScore} (${results.summary.seoGrade})`);
  console.log(`Total Performance Issues: ${results.issues.performance.length}`);
  console.log(`Total SEO Issues: ${results.issues.seo.length}`);

  // Save to file if specified
  if (input.outputFile) {
    const outputPath = path.resolve(input.outputFile);
    await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nResults saved to: ${outputPath}`);
    
    // Also save a text summary
    const textPath = outputPath.replace('.json', '-summary.txt');
    await fs.writeFile(textPath, generateTextSummary(results));
    console.log(`Summary saved to: ${textPath}`);
  }

  return results;
}

/**
 * Load input from JSON file
 * @param {string} filePath - Path to input JSON file
 * @returns {Promise<Object>} Parsed input
 */
export async function loadInputFromFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

export { auditMultipleEndpoints } from './evaluator.js';
