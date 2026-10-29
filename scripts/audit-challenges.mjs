// Headless source/model checks, not a browser or a proof of answer-key correctness.
// Run: node scripts/audit-challenges.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../study-pages');
const results = [];
let seed = 20261028;
const math = Object.create(Math);
math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('_Challenge.html'))) {
  const context = vm.createContext({ Math: math, document: { addEventListener() {},
    createElement() { return { style: {}, appendChild() {}, setAttribute() {} }; },
    head: { appendChild() {} }, documentElement: { style: {}, dataset: {} } },
    navigator: {}, location: { protocol: 'file:' }, addEventListener() {}, setTimeout() {} });
  context.window = context;
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(m[1])) continue;
    vm.runInContext(m[2], context, { filename: file, timeout: 10000 });
    if (context.CC && !context.auditConfig) context.CC.App.init = config => { context.auditConfig = config; };
  }
  const modules = context.auditConfig.groups.flatMap(g => g.items);
  let runs = 0, answers = 0;
  const errors = [];
  let moduleId;
  const inspect = item => {
    for (const field of item.items || item.fields || []) {
      answers++;
      if (typeof field.value === 'number' && !Number.isFinite(field.value)) errors.push(`${moduleId}: non-finite numeric answer`);
      if (field.choices && !field.choices[field.answer] && field.choices[field.answer] !== '') errors.push(`${moduleId}: invalid choice index ${field.answer}`);
    }
  };
  context.CC.worksheet = (_root, _session, sheet) => inspect(sheet);
  const inspectSet = (_root, _session, spec) => {
    if (spec.gen) for (let k = 0; k < (spec.count || 10); k++) inspect(spec.gen(k));
    else if (spec.list) for (const item of typeof spec.list === 'function' ? spec.list() : spec.list) inspect(item);
  };
  context.CC.problemSet = inspectSet;
  if (context.DCK) context.DCK.weightedSet = inspectSet;
  const tested = [];
  for (const module of modules) {
    // Only invoke callbacks using these data runners; custom DOM activities require a browser.
    if (!/(?:CC\.(?:worksheet|problemSet)|K\.weightedSet)\(/.test(String(module.run))) continue;
    moduleId = module.id;
    tested.push(module.id);
    for (let i = 0; i < 100; i++) { module.run({}, {}); runs++; }
  }
  const result = { file, modules: modules.length, sampledModules: tested, runs, answers, errors: [...new Set(errors)] };
  if (context.PSK) {
    result.componentChecks = {};
    for (const type of ['half', 'full', 'bridge']) {
      let underratedBleeder = 0, underratedDiode = 0;
      for (let i = 0; i < 1000; i++) {
        const c = context.PSK.make(type);
        const specs = c.specs();
        const rating = Number(specs.find(s => s.startsWith('Diodes:')).match(/(\d+) V PIV/)[1]);
        // Check conservative stress bounds (25% margin on the diodes, a 1/4 W bleeder at half rating).
        if ((c.vsec * Math.SQRT2) ** 2 / c.R1 > 0.125) underratedBleeder++;
        if (rating < 1.25 * c.vsec * Math.SQRT2 * (type === 'bridge' ? 1 : 2)) underratedDiode++;
      }
      result.componentChecks[type] = { samples: 1000, underratedBleeder, underratedDiode };
      if (underratedBleeder || underratedDiode) result.errors.push(`${type}: component ratings lack margin`);
    }
  }
  results.push(result);
}
console.log(JSON.stringify(results, null, 2));
if (results.some(r => r.errors.length)) process.exitCode = 1;
