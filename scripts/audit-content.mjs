// Read-only content checks. Run: node scripts/audit-content.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'study-pages');
const source = fs.readFileSync(path.join(dir, 'field-notes-physics.html'), 'utf8');
const data = name => JSON.parse(source.match(new RegExp(`^const ${name} = (.*);$`, 'm'))[1]);
const topics = data('TOPICS'), apps = data('APPS'), alt = data('ALT');
const glossary = data('GLOSSARY'), groups = data('GROUPS'), subjects = data('SUBJECTS');
const ids = new Set(topics.map(t => t.id));
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
check(ids.size === topics.length, 'Duplicate topic IDs');
for (const t of topics) {
  check(groups.some(g => g.id === t.group), `${t.id}: unknown group`);
  check(Array.isArray(apps[t.id]) && apps[t.id].length > 0, `${t.id}: no applications`);
  check(alt[t.id]?.why && alt[t.id]?.qa?.length && alt[t.id]?.sym?.length, `${t.id}: missing alternate explanations`);
  for (const id of t.related) check(ids.has(id), `${t.id}: missing related topic ${id}`);
  if (t.calc) check(t.calc.outLabels.length === t.calc.outUnits.length, `${t.id}: output labels/units mismatch`);
}
for (const g of groups) check(subjects.some(s => s.id === g.subject), `${g.id}: unknown subject`);
for (const g of glossary) for (const id of g.topics || []) check(ids.has(id), `Glossary ${g.term}: missing topic ${id}`);
const referenceRoutes = new Set(['formulas', 'glossary', 'units', 'constants', 'progress', 'map']);
for (const [name, value] of Object.entries({ topics, apps, alt, glossary })) {
  for (const m of JSON.stringify(value).matchAll(/#\/([a-z][a-z0-9-]*)/g)) {
    check(ids.has(m[1]) || referenceRoutes.has(m[1]), `${name}: unknown topic link ${m[1]}`);
  }
}
let scripts = 0;
for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(m[1]) || /application\/(?:json|ld\+json)/.test(m[1])) continue;
    scripts++;
    try { new vm.Script(m[2], { filename: file }); } catch (e) { errors.push(`${file}: ${e.message}`); }
  }
}
const context = vm.createContext({});
const calcSource = source.slice(source.indexOf('const R = String.raw;'), source.indexOf('const byId ='));
const formatSource = source.slice(source.indexOf('const SI ='), source.indexOf('// ── pages'));
vm.runInContext(calcSource + '\n' + formatSource + '\nglobalThis.audit = { CALC, fmt };', context);
const { CALC, fmt } = context.audit;
const defaults = t => Object.fromEntries(t.calc.inputs.map(i => [i.k, Number(i.d)]));
let calculators = 0;
for (const t of topics.filter(t => t.calc)) {
  calculators++;
  try {
    const rows = CALC[t.id](defaults(t));
    check(rows.length === t.calc.outLabels.length, `${t.id}: calculator row count mismatch`);
    for (const row of rows) check(typeof row[1] !== 'number' || Number.isFinite(row[1]), `${t.id}: non-finite default output`);
  } catch (e) { errors.push(`${t.id}: ${e.message}`); }
}
console.log(JSON.stringify({ inventory: { htmlPages: fs.readdirSync(dir).filter(f => f.endsWith('.html')).length,
  topics: topics.length, applications: Object.values(apps).reduce((n, a) => n + a.length, 0),
  alternateExplanations: Object.keys(alt).length, glossaryEntries: glossary.length, calculators, scripts }, errors }, null, 2));
if (errors.length) process.exitCode = 1;
