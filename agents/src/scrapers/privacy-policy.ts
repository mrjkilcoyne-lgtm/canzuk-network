import * as cheerio from 'cheerio';

/**
 * Fetches and extracts plain text from a privacy policy URL.
 * Returns null if the page can't be fetched or parsed.
 * Truncates to maxLength characters to keep LLM context manageable.
 */
export async function fetchPrivacyPolicy(
  url: string,
  maxLength = 15000,
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CANZUK-Intel-Agent/1.0 (Privacy Policy Analyser)',
        'Accept': 'text/html,application/xhtml+xml,text/plain',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type') ?? '';
    const body = await response.text();

    // If it's plain text, return directly
    if (contentType.includes('text/plain')) {
      return body.slice(0, maxLength);
    }

    // Parse HTML and extract text
    const $ = cheerio.load(body);

    // Remove script, style, nav, header, footer elements
    $('script, style, nav, header, footer, iframe, noscript').remove();

    // Try to find the main content area
    const mainContent =
      $('main').text() ||
      $('article').text() ||
      $('[role="main"]').text() ||
      $('body').text();

    // Clean up whitespace
    const cleaned = mainContent
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    return cleaned.slice(0, maxLength) || null;
  } catch {
    return null;
  }
}
