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

test('power-supply component ratings cover every generated voltage/regulator combination', () => {
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
    for (let i = 0; i < 200; i++) {
      const c = context.makeSupply(type, null);
      seen.add(`${type}/${c.vsec}/${c.vreg}`);
      const specs = c.specs();
      // The original's sheet: 50 V PIV diodes, a 4700 µF 25 V capacitor and a 4.7 kΩ bleeder.
      const reverseVolts = Number(specs.find(s => s.startsWith('Diodes:')).match(/(\d+) V PIV/)[1]);
      const capVolts = Number(specs.find(s => s.startsWith('Capacitor C1:')).match(/@ (\d+) V/)[1]);
      // Bound the stress independently of the simulator's waveform calculation.
      const peak = c.vsec * Math.SQRT2;
      const requiredReverseVolts = type === 'bridge' ? peak : 2 * peak;
      assert.ok(reverseVolts >= 1.25 * requiredReverseVolts, `${type}: reverse-voltage margin`);
      assert.ok(capVolts >= 1.25 * peak, `${type}: capacitor voltage margin`);
      assert.equal(c.R1, 4700);
      assert.ok(peak ** 2 / c.R1 < 0.125, `${type}: bleeder within half a 1/4 W rating`);
      const out = c.out.reduce((a, v) => a + v, 0) / c.out.length;
      assert.ok(Math.abs(out - c.vreg) < 0.05, `${type}: a working supply regulates`);
    }
  }
  assert.equal(seen.size, 48, 'covered all three topologies, secondary voltages and regulators');
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

test('binding energy rejects impossible masses and noninteger nucleon counts', () => {
  for (const v of [{ Z: 2, N: 2, M: 5 }, { Z: 2.5, N: 2, M: 4 }, { Z: 2, N: 1.5, M: 4 }, { Z: 2, N: 2, M: 2 }]) {
    assert.throws(() => calculators.binding(v));
  }
  const energy = calculators.binding({ Z: 2, N: 2, M: 4.00260325413 })[1][1];
  assert.ok(Math.abs(energy - 28.296) < 0.01, 'helium-4 measured binding energy is about 28.296 MeV');
});

test('linear regulator rejects impossible output and large ripple, accepts a feasible design', () => {
  const v = { Vrms: 12, f: 60, C: 0.0022, I: 0.5, Vout: 5 };
  assert.throws(() => calculators.powersupplies({ ...v, Vout: 20 }), /Cannot regulate/);
  assert.throws(() => calculators.powersupplies({ ...v, C: 1e-6 }), /Ripple/);
  assert.throws(() => calculators.powersupplies({ ...v, f: 0 }));
  const rows = calculators.powersupplies(v);
  assert.ok(rows[2][1] >= v.Vout + 2);
  assert.ok(rows[3][1] > 0 && rows[3][1] < 100);
});

test('passive meter designs respect movement limits, including no-extension cases', () => {
  const v = { Ig: 0.001, Rg: 50, I: 1, V: 10 };
  const rows = calculators.meters(v);
  // Full-scale current divides into movement and shunt; each has the same voltage.
  assert.ok(Math.abs((v.I - v.Ig) * rows[0][1] - v.Ig * v.Rg) < 1e-12);
  assert.equal(rows[1][1], 9950);
  assert.throws(() => calculators.meters({ ...v, I: 0.0005 }));
  assert.throws(() => calculators.meters({ ...v, V: 0.01 }));
  const bare = calculators.meters({ ...v, I: v.Ig, V: v.Ig * v.Rg });
  assert.match(bare[0][1], /no shunt/);
  assert.equal(bare[1][1], 0);
});

test('discrete calculator inputs reject fractions rather than silently rounding', () => {
  for (const [id, input] of [
    ['quantumnumbers', { Z: 26.5 }], ['schrodinger', { m: 9.109e-31, L: 1e-9, n: 1.5 }],
    ['fission', { m: 1, A: 235.5, Ef: 200 }], ['standing', { L: 1, v: 300, n: 2.5 }],
    ['binary', { n: 8.5 }], ['combinational', { n: 8.5 }], ['adcdac', { n: 10.5 }],
    ['counters', { n: 8, N: 10.5 }], ['flipflops', { n: 15.5 }]
  ]) assert.throws(() => calculators[id](input), undefined, id);
});

test('zero vectors have no direction or mutual angle, including cancellation roundoff', () => {
  assert.match(calculators.products({ ax: 0, ay: 0, az: 0, bx: 1, by: 0, bz: 0 })[5][1], /undefined/);
  assert.equal(calculators.products({ ax: 1, ay: 0, az: 0, bx: 0, by: 1, bz: 0 })[5][1], 90);
  const zero = calculators.vectors({ A: 1, tA: 0, B: 1, tB: 180 });
  assert.equal(zero[2][1], 0);
  assert.match(zero[3][1], /undefined/);
});

test('practice uses isotope tuples, shows mass precision, and generates valid constrained inputs', () => {
  const ctx = vm.createContext({});
  const calc = fieldNotes.slice(fieldNotes.indexOf('const R = String.raw;'), fieldNotes.indexOf('const byId ='));
  const format = fieldNotes.slice(fieldNotes.indexOf('const SI ='), fieldNotes.indexOf('// ── pages'));
  const practice = fieldNotes.slice(fieldNotes.indexOf('const PRACTICE_ISOTOPES ='), fieldNotes.indexOf('function practiceCard'));
  vm.runInContext(`${calc}\n${format}\n${practice}\nglobalThis.helpers={practiceValues,makePractice,practiceValue};`, ctx);
  const { practiceValues, makePractice, practiceValue } = ctx.helpers;
  for (const t of data('TOPICS').filter(t => t.calc)) {
    for (let i = 0; i < 25; i++) {
      const p = makePractice(t);
      assert.ok(p && Number.isFinite(p.ans), `${t.id}: usable practice problem`);
      if (t.id === 'binding') {
        const eb = calculators.binding(p.v)[1][1];
        assert.ok(eb > 0 && eb / (p.v.Z + p.v.N) < 9, 'bound isotope with plausible binding per nucleon');
        assert.equal(Number(practiceValue(t, 'M', p.v.M)), p.v.M, 'displayed mass retains all supplied digits');
      }
      if (t.id === 'powersupplies') assert.ok(calculators.powersupplies(p.v)[3][1] < 100);
      if (t.id === 'bohr') assert.ok(Number.isInteger(p.v.ni) && Number.isInteger(p.v.nf) && p.v.ni > p.v.nf);
      if (t.id === 'statics') assert.ok(p.v.x <= p.v.L);
      if (t.id === 'kepler') assert.ok(p.v.rp <= p.v.ra);
    }
  }
  assert.ok(practiceValues(data('TOPICS').find(t => t.id === 'binding')).M > 0);
});

test('inverse transimpedance question grades the signed current into the node', () => {
  const source = read('Op_Amp_Challenge.html');
  const context = contextWithUtilities(source);
  context.OAK = { fig: new Proxy({}, { get: () => () => '' }) };
  context.window.OAT = {};
  vm.runInContext('CC.m=CC.M=s=>s;', context);
  const start = source.indexOf('const {fmt,pick,rnd,ri,shuffle,eVal,m,M,svg:S,board:B,esc}=CC;');
  const end = source.indexOf('const itemsRun=', start);
  vm.runInContext(`${source.slice(start, end)}\nglobalThis.simple=simpleItems;`, context);
  for (let i = 0; i < 50; i++) {
    const item = context.simple().find(x => x.prompt.includes('signed input current'));
    const rf = Number(item.prompt.match(/Rf = ([\d.]+) kΩ/)[1]) * 1000;
    const vo = Number(item.prompt.match(/output voltage is ([\d.]+) V/)[1]);
    const field = item.fields[0];
    assert.ok(Math.abs(field.value + vo / rf * 1e6) < 1e-9);
    assert.ok(!field.signFree, 'sign is graded');
    assert.equal(context.CC.close(-field.value, field.value, 0.01), false);
  }
});
