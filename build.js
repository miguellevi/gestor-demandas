#!/usr/bin/env node
/**
 * build.js — executado pelo Vercel antes do deploy
 *
 * Lê as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY
 * e as injeta diretamente no index.html, substituindo os placeholders.
 * Assim o frontend nunca precisa chamar /api/config.
 */

const fs   = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL      || '';
const key = process.env.SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.error('⚠️  SUPABASE_URL ou SUPABASE_ANON_KEY não definidos.');
  console.error('   Configure as variáveis de ambiente no painel do Vercel.');
  console.error('   O sistema ainda funcionará via modal de configuração manual.');
}

const htmlPath = path.join(__dirname, 'public', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Substitui os placeholders pelas credenciais reais
html = html.replace('SUPABASE_URL_PLACEHOLDER', url.replace(/'/g, "\\'"));
html = html.replace('SUPABASE_KEY_PLACEHOLDER', key.replace(/'/g, "\\'"));

fs.writeFileSync(htmlPath, html, 'utf8');

console.log('✅ Build concluído!');
console.log('   SUPABASE_URL  :', url ? url.substring(0, 30) + '...' : '(não definido)');
console.log('   SUPABASE_KEY  :', key ? key.substring(0, 20) + '...' : '(não definido)');
