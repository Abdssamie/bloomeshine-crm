#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');

const requiredSecrets = [
  'GOTENBERG_API_BASIC_AUTH_USERNAME',
  'GOTENBERG_API_BASIC_AUTH_PASSWORD',
  'DOCUMENSO_API_KEY',
  'DOCUMENSO_WEBHOOK_SECRET',
  'CLOUDFLARE_API_TOKEN',
  'CLOUDFLARE_ACCOUNT_ID',
  'TWENTY_API_KEY',
];

const requiredVariables = [
  'GOTENBERG_URL',
  'DOCUMENSO_URL',
  'TWENTY_API_URL',
];

const parseEnv = (content) => {
  const values = new Map();

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values.set(key, value);
  }

  return values;
};

const ensureGh = () => {
  const result = spawnSync('gh', ['auth', 'status'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(
      'GitHub CLI is not authenticated. Run `gh auth login` first.',
    );
  }
};

const setSecret = (name, value) => {
  const result = spawnSync('gh', ['secret', 'set', name], {
    encoding: 'utf8',
    input: value,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    throw new Error(`Failed to set secret ${name}: ${result.stderr}`);
  }
};

const setVariable = (name, value) => {
  const result = spawnSync('gh', ['variable', 'set', name, '--body', value], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    throw new Error(`Failed to set variable ${name}: ${result.stderr}`);
  }
};

const main = () => {
  const values = parseEnv(readFileSync(envPath, 'utf8'));
  const missing = [...requiredSecrets, ...requiredVariables].filter(
    (name) => !values.get(name),
  );

  if (missing.length > 0) {
    throw new Error(`Missing .env values: ${missing.join(', ')}`);
  }

  ensureGh();

  for (const name of requiredSecrets) {
    setSecret(name, values.get(name));
    console.log(`set secret ${name}`);
  }

  for (const name of requiredVariables) {
    setVariable(name, values.get(name));
    console.log(`set variable ${name}`);
  }
};

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
