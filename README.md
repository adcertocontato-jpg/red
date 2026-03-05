# Redirect Simples

Servidor de redirecionamento dinâmico. Zero dependências, zero banco de dados.  
Quando o domínio da oferta cair, edite `redirects.json` e faça redeploy — leva menos de 1 minuto.

---

## Como funciona

O arquivo `redirects.json` define os redirects:

```json
{
  "oferta": "https://novodominio.com/pagina-da-oferta",
  "produto2": "https://outrodominio.com/produto"
}
```

Cada chave vira um link no formato:

```
https://seudominio.railway.app/r/oferta
https://seudominio.railway.app/r/produto2
```

Todos os parâmetros UTM e `fbclid` da URL de entrada são **automaticamente repassados** para a URL de destino:

```
/r/oferta?utm_source=facebook&utm_medium=cpc&fbclid=IwAR3...
       ↓
https://novodominio.com/pagina?utm_source=facebook&utm_medium=cpc&fbclid=IwAR3...
```

---

## Parâmetros preservados automaticamente

- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`
- `fbclid` (Facebook Ads)
- `gclid` (Google Ads)
- `ttclid` (TikTok Ads)
- `msclkid` (Microsoft Ads)

---

## Deploy na Railway

### 1. Suba o código para o GitHub

```bash
git init
git add .
git commit -m "primeiro commit"
git remote add origin https://github.com/seu-usuario/redirect-simples.git
git push -u origin main
```

### 2. Crie um projeto na Railway

1. Acesse [railway.app](https://railway.app) e clique em **New Project**
2. Escolha **Deploy from GitHub repo** e selecione o repositório
3. A Railway detecta automaticamente o `package.json` e faz o deploy

### 3. Configure o domínio (opcional)

No painel da Railway, vá em **Settings → Domains** e adicione um domínio customizado.

---

## Como trocar a URL de destino quando o domínio cair

1. Abra o arquivo `redirects.json`
2. Troque a URL de destino:
   ```json
   { "oferta": "https://novodominio.com/pagina" }
   ```
3. Faça commit e push:
   ```bash
   git add redirects.json
   git commit -m "troca de dominio"
   git push
   ```
4. A Railway faz redeploy automático em ~30 segundos.

---

## Rodar localmente

```bash
node server.js
# Servidor na porta 3000
# Teste: http://localhost:3000/r/oferta?utm_source=facebook&fbclid=abc123
```
