// Run with: node --test tests/learning-material.test.cjs
// Exercise the real inline calculation/generation functions without browser UI.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const pages = path.join(__dirname, '..', 'study-pages');
const read = name => fs.readFileSync(path.join(pages, name), 'utf8');
const fieldNotes = read('field-notes-physics.html');
const data = name => JSON.parse(fieldNotes.match(new RegExp(`^const ${name} = (.*);$`, 'm'))[1]);

function contextWithUtilities(source) {
  let seed = 4231;
  const seededMath = Object.create(Math);
  seededMath.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
  const context = vm.createContext({ window: {}, Math: seededMath });
  vm.runInContext(`(() => {${source.slice(source.indexOf('const CC = window.CC = {};'),
    source.indexOf('/* ---------- storage'))}globalThis.CC=CC;})()`, context);
  return context;
}

const calculators = vm.runInNewContext(`${fieldNotes.slice(fieldNotes.indexOf('const R = String.raw;'),
  fieldNotes.indexOf('const byId ='))}\nCALC`);

test('Bohr emission requires positive integer levels and a downward transition', () => {
  for (const [ni, nf] of [[2.5, 1.5], [3, 1.5], [0, 1], [2, 2], [1, 2], [NaN, 1]]) {
    assert.match(calculators.bohr({ ni, nf })[0][1], /integer n_i > n_f ≥ 1/);
  }
  const rows = calculators.bohr({ ni: 3, nf: 2 });
  assert.ok(rows[0][1] > 1.88 && rows[0][1] < 1.90, 'Balmer-alpha photon energy');
  assert.ok(rows[1][1] > 650e-9 && rows[1][1] < 660e-9, 'Balmer-alpha wavelength');
});

test('all topic calculator defaults still yield finite numeric outputs', () => {
  const topics = data('TOPICS').filter(t => t.calc);
  assert.equal(topics.length, 141);
  for (const t of topics) {
    const values = Object.fromEntries(t.calc.inputs.map(i => [i.k, Number(i.d)]));
    for (const [, value] of calculators[t.id](values)) {
      if (typeof value === 'number') assert.ok(Number.isFinite(value), t.id);
    }
  }
});

test('power-supply component ratings cover every generated voltage/resistor combination', () => {
  const source = read('Power_Supply_Challenge.html');
  const context = contextWithUtilities(source);
  const start = source.indexOf('PS.make=function');
  const end = source.indexOf('\n};', start) + 3;
  vm.runInContext(`const PS = {TYPES: ${source.match(/PS.TYPES=(.*);/)[1]}};
    const W=2*Math.PI*60; const {fmt,pick,rnd}=CC;
    ${source.slice(start, end)}
    globalThis.makeSupply=PS.make;`, context);
  const seen = new Set();
  for (const type of ['half', 'full', 'bridge']) {
    for (let i = 0; i < 150; i++) {
      const c = context.makeSupply(type, null);
      seen.add(`${type}/${c.vsec}/${c.R1}`);
      const specs = c.specs();
      const resistorWatts = Number(specs.find(s => s.startsWith('R1:')).match(/, ([\d.]+) W/)[1]);
      const diode = specs.find(s => s.includes('silicon rectifier'));
      const reverseRatings = { '1N4001': 50, '1N4002': 100, '1N4003': 200, '1N4004': 400,
        '1N4005': 600, '1N4006': 800, '1N4007': 1000 };
      const reverseVolts = reverseRatings[diode.match(/1N400[1-7]/)[0]];
      // Bound the stress independently of the simulator's waveform calculation.
      const peak = c.vsec * Math.SQRT2;
      const requiredReverseVolts = type === 'bridge' ? peak : 2 * peak;
      assert.ok(reverseVolts >= 1.5 * requiredReverseVolts, `${type}: reverse-voltage margin`);
      assert.ok(resistorWatts >= 1.5 * peak ** 2 / c.R1, `${type}: continuous resistor margin`);
      const simulatedWatts = c.bus.reduce((sum, v) => sum + v ** 2 / c.R1, 0) / c.bus.length;
      assert.ok(simulatedWatts < resistorWatts, `${type}: simulated dissipation`);
    }
  }
  assert.equal(seen.size, 27, 'covered all three topologies, secondary voltages and bleeder resistances');
});

test('generated inverting-amplifier bandwidth answers use noise gain and reject low-gain approximations', () => {
  const source = read('Op_Amp_Challenge.html');
  const context = contextWithUtilities(source);
  // Drawing stubs let the real question generator run without a DOM.
  context.OAK = { fig: new Proxy({}, { get: () => () => '' }) };
  context.window.OAT = {};
  vm.runInContext('CC.m=CC.M=s=>s;', context);
  const start = source.indexOf('const {fmt,pick,rnd,ri,shuffle,eVal,m,M,svg:S,board:B,esc}=CC;');
  const end = source.indexOf('const itemsRun=', start);
  vm.runInContext(`${source.slice(start, end)}\nglobalThis.items=charItems; globalThis.engine=CC;`, context);
  let rejected = 0;
  for (let i = 0; i < 100; i++) {
    for (const item of context.items()) {
      if (!item.prompt.includes('bandwidth of the inverting amplifier')) continue;
      const gbw = Number(item.prompt.match(/product = ([\d.]+) MHz/)[1]) * 1000;
      const ri = Number(item.prompt.match(/Ri = ([\d.]+) kΩ/)[1]);
      const rf = Number(item.prompt.match(/Rf = ([\d.]+) kΩ/)[1]);
      const expected = gbw / (1 + rf / ri);
      const field = item.fields[0];
      const accepts = value => field.check ? field.check(String(value)) : context.engine.close(value, field.value, 0.01);
      assert.ok(Math.abs(field.value / expected - 1) < 1e-12);
      assert.ok(accepts(expected), 'accept correct bandwidth');
      const approximation = gbw * ri / rf;
      if (Math.abs(approximation / expected - 1) > 0.011) {
        assert.equal(accepts(approximation), false, 'reject an answer outside the stated tolerance');
        rejected++;
      }
    }
  }
  assert.ok(rejected > 20, 'exercised cases where signal gain gives a materially wrong answer');
});
