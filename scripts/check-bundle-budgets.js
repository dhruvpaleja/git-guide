import fs from 'node:fs';
import path from 'node:path';

const CONFIG_PATH = path.resolve(process.cwd(), 'docs/execution/bundle-budgets.json');

function toRegex(pattern) {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`);
}

function toKB(bytes) {
  return bytes / 1024;
}

function formatKB(bytes) {
  return toKB(bytes).toFixed(2);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getAssets(distDir) {
  if (!fs.existsSync(distDir)) {
    throw new Error(`Dist directory not found: ${distDir}`);
  }

  return fs
    .readdirSync(distDir)
    .map((name) => {
      const fullPath = path.join(distDir, name);
      const stat = fs.statSync(fullPath);
      return stat.isFile()
        ? { name, sizeBytes: stat.size }
        : null;
    })
    .filter((entry) => entry !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function evaluateRule(rule, assets) {
  const patterns = Array.isArray(rule.patterns) ? rule.patterns : [];
  const regexes = patterns.map(toRegex);

  const matched = assets.filter((asset) => regexes.some((regex) => regex.test(asset.name)));

  if (matched.length === 0) {
    return {
      name: rule.name,
      status: rule.required === false ? 'skip' : 'fail',
      reason: 'No matching assets found',
      actualBytes: 0,
      maxKB: rule.maxKB,
      matchedFiles: [],
    };
  }

  const mode = rule.mode === 'sum' ? 'sum' : 'max';
  const actualBytes = mode === 'sum'
    ? matched.reduce((total, asset) => total + asset.sizeBytes, 0)
    : Math.max(...matched.map((asset) => asset.sizeBytes));

  const pass = toKB(actualBytes) <= rule.maxKB;

  return {
    name: rule.name,
    status: pass ? 'pass' : 'fail',
    reason: pass ? '' : `Exceeded budget (${formatKB(actualBytes)}KB > ${rule.maxKB}KB)`,
    actualBytes,
    maxKB: rule.maxKB,
    matchedFiles: matched.map((asset) => asset.name),
  };
}

function printResults(results) {
  process.stdout.write('\nBundle budget check\n');
  process.stdout.write('-------------------\n');

  for (const result of results) {
    const statusLabel = result.status.toUpperCase().padEnd(4, ' ');
    const sizeLabel = `${formatKB(result.actualBytes)}KB/${result.maxKB}KB`;
    const filesLabel = result.matchedFiles.length > 0 ? result.matchedFiles.join(', ') : 'none';
    process.stdout.write(`${statusLabel} ${result.name}: ${sizeLabel} :: ${filesLabel}\n`);
    if (result.reason) {
      process.stdout.write(`      ${result.reason}\n`);
    }
  }
}

function main() {
  const config = readJson(CONFIG_PATH);
  const distDir = path.resolve(process.cwd(), config.distDir ?? 'dist/assets');
  const assets = getAssets(distDir);
  const results = config.budgets.map((rule) => evaluateRule(rule, assets));

  printResults(results);

  const failed = results.some((result) => result.status === 'fail');
  if (failed) {
    process.exit(1);
  }
}

main();
