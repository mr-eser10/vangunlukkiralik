import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Dev server in AI Studio must strictly bind to port 3000
const PORT = 3000;

const DEFAULT_SEO = {
  brandName: 'Van Günlük Kiralık Daire',
  phone: '+905421802372',
  seoTitle: 'Van Günlük Kiralık Daire | Merkezde Konforlu Konaklama',
  seoDescription:
    "Van İpekyolu mevkiinde temiz, güvenli ve konforlu 1+0, 2+1 ve 3+1 günlük kiralık apart daireler. 1.500 TL'den başlayan fiyatlarla WhatsApp'tan bilgi alın.",
  seoKeywords:
    'van günlük kiralık daire, van günlük daire, van ipekyolu günlük kiralık daire, van apart konaklama, van 1+0 daire, van 2+1 daire, van 3+1 daire, van konaklama',
};

const DEFAULT_APARTMENT_IDS = [
  'apt-ipekyolu-101',
  'apt-ipekyolu-102',
  'apt-ipekyolu-201',
  'apt-ipekyolu-202',
  'apt-ipekyolu-301',
  'apt-ipekyolu-302',
];

function getSiteUrl(req: express.Request): string {
  const envUrl = process.env.APP_URL;
  if (envUrl && envUrl !== 'MY_APP_URL') {
    return envUrl.replace(/\/$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string)?.split(',')[0] || req.protocol;
  return `${proto}://${req.get('host')}`.replace(/\/$/, '');
}

function escapeHtmlAttr(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function fetchPublicSupabaseRow(pathWithQuery: string): Promise<any | null> {
  const url = process.env.VITE_SUPABASE_URL?.trim();
  const key = process.env.VITE_SUPABASE_ANON_KEY?.trim();
  if (!url || !key || !url.startsWith('http')) return null;

  try {
    const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${pathWithQuery}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Dynamic robots.txt
app.get('/robots.txt', (req, res) => {
  const siteUrl = getSiteUrl(req);
  res.type('text/plain');
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /#admin\nDisallow: /#yonetim\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  );
});

// Dynamic XML Sitemap (reads public apartment IDs from Supabase if configured)
app.get('/sitemap.xml', async (req, res) => {
  const siteUrl = getSiteUrl(req);
  const today = new Date().toISOString().split('T')[0];

  const rows = await fetchPublicSupabaseRow('apartments?select=id&order=created_at.asc');
  const apartmentIds: string[] =
    Array.isArray(rows) && rows.length > 0
      ? rows.map((r: { id: string }) => r.id)
      : DEFAULT_APARTMENT_IDS;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  apartmentIds.forEach((id) => {
    xml += `  <url>\n    <loc>${siteUrl}/?daire=${encodeURIComponent(id)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.type('application/xml');
  res.send(xml);
});

// Serve frontend with Vite middleware in development or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist'), { index: false }));
    app.get('*', async (req, res) => {
      const distIndexPath = path.join(__dirname, 'dist', 'index.html');
      try {
        let html = fs.readFileSync(distIndexPath, 'utf-8');
        const settingsRows = await fetchPublicSupabaseRow('settings?id=eq.1&select=*');
        const liveSettings = Array.isArray(settingsRows) && settingsRows[0] ? settingsRows[0] : null;

        const siteUrl = getSiteUrl(req);
        const seoTitle = escapeHtmlAttr(liveSettings?.seo_title || DEFAULT_SEO.seoTitle);
        const seoDescription = escapeHtmlAttr(
          liveSettings?.seo_description || DEFAULT_SEO.seoDescription
        );
        const seoKeywords = escapeHtmlAttr(liveSettings?.seo_keywords || DEFAULT_SEO.seoKeywords);
        const logoAbsUrl = `${siteUrl}/assets/aistudio/Van_G_nl_k_Kiral_k_Daire_3D_Logosu_f1b36505.png`;
        const telSanitized = String(liveSettings?.phone || DEFAULT_SEO.phone).replace(
          /[^+\d]/g,
          ''
        );

        html = html
          .replace(/<title>[^<]*<\/title>/, `<title>${seoTitle}</title>`)
          .replace(
            /<meta name="description" content="[^"]*"\s*\/?>/,
            `<meta name="description" content="${seoDescription}" />`
          )
          .replace(
            /<meta name="keywords" content="[^"]*"\s*\/?>/,
            `<meta name="keywords" content="${seoKeywords}" />`
          )
          .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${siteUrl}/" />`)
          .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${siteUrl}/" />`)
          .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${seoTitle}" />`)
          .replace(
            /<meta property="og:description" content="[^"]*"\s*\/?>/,
            `<meta property="og:description" content="${seoDescription}" />`
          )
          .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${logoAbsUrl}" />`)
          .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${seoTitle}" />`)
          .replace(
            /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
            `<meta name="twitter:description" content="${seoDescription}" />`
          )
          .replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${logoAbsUrl}" />`)
          .replace(/\+905421802372/g, telSanitized)
          .replace(
            /https:\/\/ais-pre-uzjqjgdugxf6kxcu6k3axt-636120999406\.europe-west2\.run\.app/g,
            siteUrl
          );

        res.type('text/html').send(html);
      } catch {
        res.sendFile(distIndexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Van Günlük Kiralık Daire server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
