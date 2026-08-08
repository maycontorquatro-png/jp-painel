/* JP Embalagens — Service Worker (v2.27.3)
 * Estratégia NETWORK-FIRST: com internet, SEMPRE busca a versão mais nova na rede
 * (nunca serve código velho). Só cai no cache quando está OFFLINE. Assim resolve o
 * PWA preso em versão antiga no iPhone E ganha funcionamento offline do app.
 *
 * Só intercepta requisições do PRÓPRIO site (mesma origem). Firebase, SDK do
 * Google, APIs externas, etc. passam direto, sem o SW tocar.
 *
 * Botão de pânico: "🧹 Atualizar app" no painel do operador desregistra o SW e
 * limpa tudo. Bump no CACHE abaixo força a troca do SW em todos os aparelhos.
 */
const CACHE = 'jp-v2.28.1';

self.addEventListener('install', (e) => {
  // assume o controle imediatamente, sem esperar fechar as abas antigas
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // apaga caches de versões anteriores
    try {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    } catch (_) {}
    try { await self.clients.claim(); } catch (_) {}
  })());
});

// permite que a página mande o SW se atualizar na hora (opcional)
self.addEventListener('message', (e) => {
  if (e && e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return; // não mexe em POST/PUT (Firebase etc.)
  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return; // só o próprio site

  e.respondWith((async () => {
    try {
      // NETWORK-FIRST: sempre tenta a rede primeiro (código sempre fresco)
      const fresh = await fetch(req);
      // guarda uma cópia pro modo offline
      try { const c = await caches.open(CACHE); await c.put(req, fresh.clone()); } catch (_) {}
      return fresh;
    } catch (err) {
      // sem internet → usa a última cópia salva
      const cached = await caches.match(req);
      if (cached) return cached;
      throw err; // sem rede e sem cache: erro normal (igual a não ter SW)
    }
  })());
});
