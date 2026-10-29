"""Dump Delphi binary DFM (TPF0) resources from a PE file as readable text.
Usage: python3 -I dfm.py prog.exe outdir   (needs wrestool)"""
import struct, subprocess, sys, os, re

class P:
    def __init__(s, b): s.b, s.i = b, 0
    def u8(s): v = s.b[s.i]; s.i += 1; return v
    def i32(s): v = struct.unpack_from('<i', s.b, s.i)[0]; s.i += 4; return v
    def sstr(s):
        n = s.u8(); v = s.b[s.i:s.i+n].decode('cp1252', 'replace'); s.i += n; return v
    def value(s):
        t = s.u8()
        if t == 0: return None
        if t == 1:
            items = []
            while s.b[s.i] != 0: items.append(s.value())
            s.i += 1; return items
        if t == 2: v = struct.unpack_from('<b', s.b, s.i)[0]; s.i += 1; return v
        if t == 3: v = struct.unpack_from('<h', s.b, s.i)[0]; s.i += 2; return v
        if t == 4: return s.i32()
        if t == 5: s.i += 10; return '<ext>'
        if t in (6, 7): return s.sstr()
        if t == 8: return False
        if t == 9: return True
        if t == 10: n = s.i32(); s.i += n; return f'<binary {n}>'
        if t == 11:
            items = []
            while True:
                x = s.sstr()
                if not x: break
                items.append(x)
            return '[' + ','.join(items) + ']'
        if t == 12: n = s.i32(); v = s.b[s.i:s.i+n].decode('cp1252', 'replace'); s.i += n; return v
        if t == 13: return 'nil'
        if t == 14:
            coll = []
            while s.b[s.i] != 0:
                if s.b[s.i] in (2, 3, 4): s.value()
                assert s.u8() == 1
                props = []
                while s.b[s.i] != 0:
                    k = s.sstr(); props.append(f'{k}={s.value()!r}')
                s.i += 1; coll.append('{' + ', '.join(props) + '}')
            s.i += 1; return coll
        if t == 15: s.i += 4; return '<single>'
        if t in (16, 17, 19): s.i += 8; return '<8b>'
        if t == 18: n = s.i32(); v = s.b[s.i:s.i+n*2].decode('utf-16-le', 'replace'); s.i += n*2; return v
        if t == 20: n = s.i32(); v = s.b[s.i:s.i+n].decode('utf-8', 'replace'); s.i += n; return v
        raise ValueError('type %d at %d' % (t, s.i))
    def obj(s, out, ind=0):
        if s.b[s.i] & 0xF0 == 0xF0:
            f = s.u8()
            if f & 2: s.value()
        cls = s.sstr(); name = s.sstr()
        out.append('  ' * ind + f'object {name}: {cls}')
        while s.b[s.i] != 0:
            k = s.sstr(); v = s.value()
            if isinstance(v, list):
                if k.endswith('Strings') or k.endswith('Items.Strings'):
                    out.append('  ' * (ind+1) + f'{k} =')
                    out.extend('  ' * (ind+2) + '| ' + str(x) for x in v)
                    continue
                v = '(' + ' | '.join(str(x) for x in v) + ')'
            out.append('  ' * (ind+1) + f'{k} = {v}')
        s.i += 1
        while s.b[s.i] != 0: s.obj(out, ind+1)
        s.i += 1

def main(exe, outdir):
    os.makedirs(outdir, exist_ok=True)
    lst = subprocess.run(['wrestool', '-l', exe], capture_output=True, text=True).stdout
    for name in re.findall(r"--type=10 --name='([^']+)'", lst):
        data = subprocess.run(['wrestool', '-x', '--raw', '--type=10', '--name=' + name, exe], capture_output=True).stdout
        if not data.startswith(b'TPF0'): continue
        p = P(data); p.i = 4; out = []
        try: p.obj(out)
        except Exception as e: out.append(f'!! parse stopped: {e!r}')
        open(os.path.join(outdir, name + '.txt'), 'w').write('\n'.join(out))
        print(name, len(out), 'ERR' if out[-1].startswith('!!') else '')

main(sys.argv[1], sys.argv[2])
