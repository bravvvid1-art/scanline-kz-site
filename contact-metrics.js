(() => {
  const recent = new Map();
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const channel = /^tel:/i.test(href) ? 'phone' : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href) ? 'whatsapp' : null;
    if (!channel) return;
    const now = Date.now();
    if (now - (recent.get(channel) || 0) < 1500) return;
    recent.set(channel, now);
    const data = { id: crypto.randomUUID(), channel, page: location.pathname, lang: document.documentElement.lang.startsWith('kk') ? 'kk' : 'ru' };
    // Keep the outgoing action immediate, including when the page unloads.
    fetch('/api/contact-event', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true}).catch(() => {});
  });
})();
