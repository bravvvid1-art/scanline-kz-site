const origin = 'https://www.scanline.kz';

// The works page is a placeholder until genuine repair cases are published.
export function indexablePaths(paths) {
  return [...new Set(paths)].filter(p => p !== '/nashi-raboty/').sort();
}

export function sitemapUrls(paths) {
  return indexablePaths(paths).flatMap(p => [origin + p, origin + '/kk' + p]);
}

export function buildSitemap(paths) {
  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sitemapUrls(paths).map(url => `  <url><loc>${url}</loc></url>`).join('\n') +
    '\n</urlset>\n';
}

export function normalizeLocalizedSeo(html, alternateTags, ruPath) {
  // A single canonical host prevents mixed www/non-www signals in generated pages.
  html = html.replaceAll('https://scanline.kz/', origin + '/');
  const canonicalUrl = origin + ruPath;
  html = html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '');
  html = html.replace('</head>', '<link rel="canonical" href="' + canonicalUrl + '"></head>');
  if (alternateTags) {
    html = html.replace(/<link\b[^>]*\bhreflang\s*=\s*["'][^"']*["'][^>]*>/gi, '');
    html = html.replace('</head>', alternateTags.replaceAll('https://scanline.kz/', origin + '/') + '</head>');
  }
  if (ruPath === '/nashi-raboty/') {
    html = html.replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '');
    html = html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>');
  }
  return html;
}
