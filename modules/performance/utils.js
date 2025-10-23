/**
 * Utility functions for the performance auditor
 */

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
 */
export function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Number of bytes
 * @returns {string} Formatted string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format milliseconds to seconds
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted string
 */
export function formatTime(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Calculate percentage change
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {number} Percentage change
 */
export function percentageChange(oldValue, newValue) {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Get color based on score
 * @param {number} score - Score (0-100)
 * @returns {string} Color name
 */
export function getScoreColor(score) {
  if (score >= 90) return 'green';
  if (score >= 50) return 'orange';
  return 'red';
}

/**
 * Validate input configuration
 * @param {Object} input - Input configuration
 * @throws {Error} If validation fails
 */
export function validateInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input must be an object');
  }

  if (!input.endpoints || !Array.isArray(input.endpoints)) {
    throw new Error('Input must contain an "endpoints" array');
  }

  if (input.endpoints.length === 0) {
    throw new Error('At least one endpoint is required');
  }

  if (input.endpoints.length > 50) {
    throw new Error('Maximum 50 endpoints allowed per audit');
  }

  for (const endpoint of input.endpoints) {
    if (typeof endpoint !== 'string') {
      throw new Error(`Invalid endpoint: ${endpoint} must be a string`);
    }

    if (!isValidUrl(endpoint)) {
      throw new Error(`Invalid URL: ${endpoint}`);
    }
  }

  if (input.outputFile && typeof input.outputFile !== 'string') {
    throw new Error('outputFile must be a string');
  }

  return true;
}

/**
 * Generate a summary report in text format
 * @param {Object} results - Audit results
 * @returns {string} Text summary
 */
export function generateTextSummary(results) {
  const lines = [];
  
  lines.push('='.repeat(60));
  lines.push('SITESENSE PERFORMANCE & SEO AUDIT REPORT');
  lines.push('='.repeat(60));
  lines.push('');
  
  lines.push(`Audit Date: ${new Date(results.summary.timestamp).toLocaleString()}`);
  lines.push(`Pages Audited: ${results.summary.totalPages}`);
  lines.push('');
  
  lines.push('OVERALL SCORES');
  lines.push('-'.repeat(60));
  lines.push(`Performance: ${results.summary.overallPerformanceScore}/100 (Grade: ${results.summary.performanceGrade})`);
  lines.push(`SEO:         ${results.summary.overallSeoScore}/100 (Grade: ${results.summary.seoGrade})`);
  lines.push('');
  
  lines.push('PAGE-BY-PAGE RESULTS');
  lines.push('-'.repeat(60));
  results.pageResults.forEach((page, idx) => {
    lines.push(`${idx + 1}. ${page.url}`);
    lines.push(`   Performance: ${page.performanceScore}/100 | SEO: ${page.seoScore}/100`);
    lines.push(`   FCP: ${formatTime(page.metrics.firstContentfulPaint)} | LCP: ${formatTime(page.metrics.largestContentfulPaint)}`);
    lines.push('');
  });
  
  lines.push('TOP ISSUES');
  lines.push('-'.repeat(60));
  
  const topPerf = results.issues.performance.slice(0, 5);
  if (topPerf.length > 0) {
    lines.push('Performance Issues:');
    topPerf.forEach((issue, idx) => {
      lines.push(`  ${idx + 1}. ${issue.title}`);
      lines.push(`     Impact: ${issue.impact} | Effort: ${issue.effort}`);
      lines.push(`     Affects: ${issue.affectedPages.length} page(s)`);
    });
    lines.push('');
  }
  
  const topSeo = results.issues.seo.slice(0, 5);
  if (topSeo.length > 0) {
    lines.push('SEO Issues:');
    topSeo.forEach((issue, idx) => {
      lines.push(`  ${idx + 1}. ${issue.title}`);
      lines.push(`     Impact: ${issue.impact} | Effort: ${issue.effort}`);
      lines.push(`     Affects: ${issue.affectedPages.length} page(s)`);
    });
    lines.push('');
  }
  
  // Quick wins
  const quickWins = [
    ...results.issues.performance,
    ...results.issues.seo
  ].filter(i => i.impact === 'High' && i.effort === 'Low');
  
  if (quickWins.length > 0) {
    lines.push('QUICK WINS (High Impact, Low Effort)');
    lines.push('-'.repeat(60));
    quickWins.forEach((issue, idx) => {
      lines.push(`  ${idx + 1}. ${issue.title} (${issue.category})`);
    });
    lines.push('');
  }
  
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
