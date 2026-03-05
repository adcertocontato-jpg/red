const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const CONFIG_FILE = path.join(__dirname, "redirects.json");

// Parâmetros de rastreamento que devem ser preservados e repassados
const TRACKING_PARAMS = [
  "utm_source", "utm_medium", "utm_campaign",
  "utm_content", "utm_term", "utm_id",
  "fbclid", "gclid", "ttclid", "msclkid",
];

function loadRedirects() {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao ler redirects.json:", e.message);
    return {};
  }
}

function buildFinalUrl(destinationUrl, incomingParams) {
  try {
    const url = new URL(destinationUrl);
    for (const param of TRACKING_PARAMS) {
      if (incomingParams[param]) {
        url.searchParams.set(param, incomingParams[param]);
      }
    }
    return url.toString();
  } catch {
    return destinationUrl;
  }
}

function parseQuery(queryString) {
  const params = {};
  if (!queryString) return params;
  for (const part of queryString.split("&")) {
    const [key, value] = part.split("=");
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || "");
  }
  return params;
}

const server = http.createServer((req, res) => {
  const [pathname, queryString] = (req.url || "/").split("?");

  // Rota: /r/:slug
  const match = pathname.match(/^\/r\/([^/]+)$/);

  if (!match) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Link não encontrado");
    return;
  }

  const slug = match[1];
  const redirects = loadRedirects(); // lê o arquivo a cada request (sem restart necessário)
  const destination = redirects[slug];

  if (!destination) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 - Redirect não encontrado para: " + slug);
    return;
  }

  const incomingParams = parseQuery(queryString);
  const finalUrl = buildFinalUrl(destination, incomingParams);

  // 302 = temporário, sem cache no browser
  res.writeHead(302, { Location: finalUrl });
  res.end();
});

server.listen(PORT, () => {
  console.log(`Redirect server rodando na porta ${PORT}`);
  console.log(`Redirects carregados:`, loadRedirects());
});
