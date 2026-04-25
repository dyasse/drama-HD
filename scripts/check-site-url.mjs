#!/usr/bin/env node
import dns from 'node:dns/promises';
import http from 'node:http';
import https from 'node:https';

const input = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;

if (!input) {
  console.error('Usage: node scripts/check-site-url.mjs <url>');
  console.error('or set NEXT_PUBLIC_SITE_URL.');
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(input);
} catch {
  console.error(`Invalid URL: ${input}`);
  process.exit(1);
}

if (!['https:', 'http:'].includes(parsed.protocol)) {
  console.error(`Unsupported protocol: ${parsed.protocol}`);
  process.exit(1);
}

const host = parsed.hostname;

const addresses = await dns.lookup(host, { all: true }).catch(() => []);

if (addresses.length === 0) {
  console.error(`DNS lookup failed for ${host}.`);
  process.exit(2);
}

console.log(`DNS OK for ${host}: ${addresses.map((item) => item.address).join(', ')}`);

const requestClient = parsed.protocol === 'http:' ? http : https;

let statusCode;
try {
  statusCode = await new Promise((resolve, reject) => {
    const req = requestClient.request(
      {
        method: 'HEAD',
        hostname: parsed.hostname,
        path: parsed.pathname || '/',
        timeout: 10000,
        port: parsed.port ? Number(parsed.port) : parsed.protocol === 'http:' ? 80 : 443,
      },
      (res) => {
        resolve(res.statusCode ?? 0);
        res.resume();
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('Request timed out'));
    });

    req.on('error', (error) => reject(error));
    req.end();
  });
} catch (error) {
  const reason = error?.message || error?.code || String(error);
  console.error(`HTTPS check failed for ${host}: ${reason}`);
  process.exit(4);
}

if (Number(statusCode) >= 200 && Number(statusCode) < 500) {
  console.log(`HTTP OK: ${statusCode}`);
  process.exit(0);
}

console.error(`Unexpected HTTP status: ${statusCode}`);
process.exit(3);
