import {optimizeLocalContent} from './local-services.mjs';
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
  html=optimizeLocalContent(html,ruPath);
  // A single canonical host prevents mixed www/non-www signals in generated pages.
  html = html.replaceAll('https://scanline.kz/', origin + '/');
  const isKazakh = /<html\b[^>]*\blang=["']kk["']/i.test(html);
  const canonicalUrl = origin + (isKazakh ? '/kk' + ruPath : ruPath);
  html = html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, '');
  html = html.replace('</head>', '<link rel="canonical" href="' + canonicalUrl + '"></head>');
  if (alternateTags) {
    html = html.replace(/<link\b[^>]*\bhreflang\s*=\s*["'][^"']*["'][^>]*>/gi, '');
    html = html.replace('</head>', alternateTags.replaceAll('https://scanline.kz/', origin + '/') + '</head>');
  }
  if (ruPath === '/nashi-raboty/' || ruPath.startsWith('/preview/') || ruPath === '/404.html' || ruPath === '/404/') {
    html = html.replace(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi, '');
    html = html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>');
  }
  // Keep structured business contacts consistent with the visible contact panel.
  html = html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (all, open, source, close) => {
    try {
      const data = JSON.parse(source);
      const visit = value => {
        if (!value || typeof value !== 'object') return;
        if (value['@type'] === 'AutoRepair') {
          value.logo = origin + '/assets/logo-scanline.webp';
          const existing = value.contactPoint ? (Array.isArray(value.contactPoint) ? value.contactPoint : [value.contactPoint]) : [];
          if (!existing.some(p => p.telephone === '+77753444409')) existing.push({'@type':'ContactPoint',telephone:'+77753444409',contactType:'customer service',availableLanguage:['ru','kk']});
          value.contactPoint = existing;
        }
        for (const child of Object.values(value)) if (typeof child === 'object') Array.isArray(child) ? child.forEach(visit) : visit(child);
      };
      visit(data);
      return open + JSON.stringify(data).replaceAll('<','\\u003c') + close;
    } catch { return all; }
  });
  if (ruPath === '/obuchenie/' && !html.includes('"@type":"WebPage"')) {
    const name = isKazakh ? 'Автокөлік блоктарымен практикалық оқыту' : 'Практическое обучение работе с блоками авто';
    const schema = {'@context':'https://schema.org','@graph':[
      {'@type':'WebPage','@id':canonicalUrl+'#webpage',url:canonicalUrl,name,inLanguage:isKazakh?'kk-KZ':'ru-KZ',about:{'@id':origin+'/#business'}},
      {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:isKazakh?'Басты бет':'Главная',item:origin+(isKazakh?'/kk/':'/')},{'@type':'ListItem',position:2,name,item:canonicalUrl}]}
    ]};
    html = html.replace('</head>','<script type="application/ld+json">'+JSON.stringify(schema)+'</script></head>');
  }
  return html;
}


