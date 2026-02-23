# Nginx - FinDash

Domínio configurado: **findash.seudominio.com**
Upstream da API: **127.0.0.1:3005**

## 1) Usando Nginx nativo (recomendado)

1. Copie o arquivo:

   sudo cp infra/nginx/findash.seudominio.com.conf /etc/nginx/sites-available/findash.seudominio.com

2. Ative o site:

   sudo ln -s /etc/nginx/sites-available/findash.seudominio.com /etc/nginx/sites-enabled/findash.seudominio.com

3. Teste e recarregue:

   sudo nginx -t
   sudo systemctl reload nginx

## 2) Certificado SSL (Let's Encrypt)

Se ainda não existir certificado:

sudo certbot certonly --webroot -w /var/www/certbot -d findash.seudominio.com

Depois recarregue o Nginx:

sudo nginx -t && sudo systemctl reload nginx

## 3) Usando Docker (opcional)

Suba somente o Nginx:

docker compose -f docker-compose.nginx.yml up -d

> Requisito: a API NestJS precisa estar rodando na mesma máquina em `127.0.0.1:3005`.
