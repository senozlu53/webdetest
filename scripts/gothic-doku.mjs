// Stil 039 doku, zincir ve kemer üretici: src/gothic/doku.css dosyasını yazar (node scripts/gothic-doku.mjs)
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const enc = (s) => 'url("data:image/svg+xml,' + s.replace(/\s+/g, ' ').replace(/> </g, '><').trim().replace(/%/g, '%25').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/#/g, '%23').replace(/"/g, "'") + '")'
const F = (id, inner) => `<filter id='${id}' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>${inner}</filter>`
const turb = (f, o, seed, t = 'fractalNoise') => `<feTurbulence type='${t}' baseFrequency='${f}' numOctaves='${o}' seed='${seed}' stitchTiles='stitch'/>`
const cm = (v) => `<feColorMatrix values='${v}'/>`

/* paslı demir: koyu demir zemin, turuncu pas lekeleri, oyuk ve çizik */
const pas = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
${F('a', turb('.011 .017', 4, 7) + cm('0 0 0 0 .545 0 0 0 0 .27 0 0 0 0 .075 3 0 0 0 -1.35'))}
${F('b', turb('.9', 2, 2) + cm('0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 5 0 0 0 -3.05'))}
${F('c', turb('.003 .55', 3, 5) + cm('0 0 0 0 .75 0 0 0 0 .75 0 0 0 0 .75 6 0 0 0 -3.55'))}
${F('d', turb('.035', 3, 11) + cm('0 0 0 0 .04 0 0 0 0 .03 0 0 0 0 .03 -2.2 0 0 0 1.5'))}
<rect width='256' height='256' fill='#1a1512'/>
<rect width='256' height='256' filter='url(#d)' opacity='.55'/>
<rect width='256' height='256' filter='url(#a)' opacity='.36'/>
<rect width='256' height='256' filter='url(#c)' opacity='.1'/>
<rect width='256' height='256' filter='url(#b)' opacity='.7'/>
</svg>`

/* eskitilmiş taş duvar: düzensiz kesme taşlar, derz, çatlak */
const rows = [
  { y: 0, h: 52, xs: [0, 70, 138, 224] },
  { y: 52, h: 56, xs: [-40, 34, 118, 182] },
  { y: 108, h: 52, xs: [0, 58, 150, 224] },
]
const tones = ['#18181c', '#1b1b20', '#141418', '#1d1d22', '#17171b', '#1a1a1f']
let tas = `<svg xmlns='http://www.w3.org/2000/svg' width='224' height='160'>
${F('n', turb('.06', 3, 4) + cm('0 0 0 0 .8 0 0 0 0 .8 0 0 0 0 .82 1.6 0 0 0 -.62'))}
${F('m', turb('.012 .02', 3, 9) + cm('0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.6 0 0 0 1.55'))}
<rect width='224' height='160' fill='#060607'/>`
let ti = 0
for (const r of rows) {
  const xs = r.xs
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i]
    const x1 = xs[i + 1]
    for (const off of [0, x1 > 224 ? -224 : 0]) void off
    tas += `<rect x='${x0 + 2}' y='${r.y + 2}' width='${x1 - x0 - 4}' height='${r.h - 4}' rx='3' fill='${tones[ti++ % tones.length]}'/>`
  }
}
tas += `<rect width='224' height='160' filter='url(#n)' opacity='.1'/><rect width='224' height='160' filter='url(#m)' opacity='.5'/>
<path d='M100 6L106 20L99 30L104 46' fill='none' stroke='#050506' stroke-width='1.4'/><path d='M160 112L154 124L161 136' fill='none' stroke='#050506' stroke-width='1.2'/>
</svg>`

/* yırtılmış deri: ince gren, kırışıklık damarları */
const deri = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
${F('g', turb('.75', 2, 3) + cm('0 0 0 0 .8 0 0 0 0 .55 0 0 0 0 .42 1.7 0 0 0 -.72'))}
${F('v', turb('.03 .04', 3, 6, 'turbulence') + cm('0 0 0 0 .02 0 0 0 0 .012 0 0 0 0 .01 -34 0 0 0 3.5'))}
${F('l', turb('.02 .03', 3, 14) + cm('0 0 0 0 .42 0 0 0 0 .25 0 0 0 0 .18 2.6 0 0 0 -1.25'))}
<rect width='200' height='200' fill='#1d1411'/>
<rect width='200' height='200' filter='url(#l)' opacity='.33'/>
<rect width='200' height='200' filter='url(#g)' opacity='.16'/>
<rect width='200' height='200' filter='url(#v)' opacity='.85'/>
</svg>`

/* kadife: kan rengine çalan koyu havlı kumaş */
const kadife = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
${F('p', turb('.05 .07', 3, 21) + cm('0 0 0 0 .55 0 0 0 0 .1 0 0 0 0 .1 2.4 0 0 0 -1.05'))}
${F('q', turb('1.1 .9', 1, 8) + cm('0 0 0 0 .9 0 0 0 0 .5 0 0 0 0 .5 1.6 0 0 0 -.75'))}
<rect width='128' height='128' fill='#1c0709'/>
<rect width='128' height='128' filter='url(#p)' opacity='.45'/>
<rect width='128' height='128' filter='url(#q)' opacity='.1'/>
</svg>`

/* zincir: yatay ve dikey şerit (yüz halka + kenar halka) */
function zincir(dikey) {
  const P = 40
  const g = `<defs><linearGradient id='m' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#c4c4c8'/><stop offset='.45' stop-color='#75757b'/><stop offset='1' stop-color='#2b2b30'/></linearGradient>
<linearGradient id='k' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#8e8e93'/><stop offset='.5' stop-color='#4a4a50'/><stop offset='1' stop-color='#1e1e22'/></linearGradient></defs>`
  const halka = `<ellipse cx='10' cy='9' rx='8.6' ry='5.3' fill='none' stroke='url(#m)' stroke-width='3.4'/>
<ellipse cx='10' cy='9' rx='8.6' ry='5.3' fill='none' stroke='#8b4513' stroke-width='3.4' stroke-dasharray='5 27' stroke-dashoffset='-3' opacity='.7'/>
<ellipse cx='10' cy='7.6' rx='7.2' ry='3.6' fill='none' stroke='#e0e0e4' stroke-width='.7' stroke-dasharray='9 40' opacity='.5'/>`
  const bar = `<rect x='13' y='7.4' width='34' height='3.6' rx='1.8' fill='url(#k)'/><rect x='13' y='7.4' width='34' height='1' rx='.5' fill='#b4b4b8' opacity='.55'/><rect x='24' y='7.6' width='7' height='3.2' fill='#8b4513' opacity='.55'/>`
  const inner = `${g}<g>${bar}${halka}</g>`
  return dikey
    ? `<svg xmlns='http://www.w3.org/2000/svg' width='18' height='${P}' viewBox='0 0 18 ${P}'><g transform='translate(18 0) rotate(90)'>${inner.replace(/<defs>.*<\/defs>/s, g)}</g></svg>`
    : `<svg xmlns='http://www.w3.org/2000/svg' width='${P}' height='18' viewBox='0 0 ${P} 18'>${inner}</svg>`
}

/* mızrak çiti: yan yana sivri uçlu mızraklar */
const mizrak = `<svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 22 22'>
<defs><linearGradient id='s' x1='0' x2='1'><stop offset='0' stop-color='#d0d0d4'/><stop offset='.5' stop-color='#6c6c72'/><stop offset='1' stop-color='#26262b'/></linearGradient></defs>
<path d='M11 0.5 L15.6 12 L12.2 12 L12.2 22 L9.8 22 L9.8 12 L6.4 12 Z' fill='url(#s)'/><path d='M11 3 L13.4 10' stroke='#8b4513' stroke-width='.8' opacity='.6' fill='none'/></svg>`

/* kemer karnişi: küçük sivri kemer dizisi (üst bilgi alt kenarı) */
const kemerdizi = `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='12' viewBox='0 0 28 12'>
<path d='M0 0H28V12H0Z' fill='#0a0a0c'/><path d='M4 12V7.500 Q4 3.500 14 0.500 Q24 3.500 24 7.500 V12' fill='none' stroke='#5c0606' stroke-width='1.6'/><path d='M0 12V0' stroke='#5c0606' stroke-width='1' opacity='.5'/></svg>`

/* sivri kemer profili: kemer yarıçapı r = ρ·G (G = genişlik), tepe y_a; n(u) = y/y_a */
const rho = 0.85
const ya = Math.sqrt(rho * rho - (0.5 - rho) ** 2)
const n = (u) => {
  const x = u / 2
  return Math.sqrt(Math.max(0, rho * rho - (x - rho) ** 2)) / ya
}
const us = [0, 0.012, 0.03, 0.06, 0.1, 0.15, 0.22, 0.3, 0.4, 0.5, 0.62, 0.74, 0.86, 0.94, 1]
const fmt = (v) => +v.toFixed(4)
const sol = us.map((u) => ({ x: fmt((u / 2) * 100), f: fmt(1 - n(u)) }))
const sag = [...sol]
  .reverse()
  .slice(1)
  .map((p) => ({ x: fmt(100 - p.x), f: p.f }))
const pts = [...sol, ...sag]
const poly = (dy) => pts.map((p) => `${p.x}% calc(var(--k) * ${p.f}${dy ? ` + ${dy}` : ''})`).join(', ')
const svgYol = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${fmt(p.f * 100)}`).join(' ')

// yırtık alt kenar: sabit tohumlu düzensiz dişler (px cinsinden)
let sd = 7
const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647
const yirtik = []
for (let x = 100; x >= 0; x -= 3 + rnd() * 5) yirtik.push(`${fmt(Math.max(0, x))}% calc(100% - ${Math.round(rnd() * 11)}px)`)
if (!yirtik[yirtik.length - 1].startsWith('0%')) yirtik.push('0% calc(100% - 4px)')
const polyY = (dy) => pts.map((p) => `${p.x}% calc(var(--k) * ${p.f}${dy ? ` + ${dy}` : ''})`).join(', ')

const css = `/* Bu dosya üretilmiştir (doku, zincir ve kemer profili). Elle düzenlemeyin. */
:root {
  --doku-pas: ${enc(pas)};
  --doku-tas: ${enc(tas)};
  --doku-deri: ${enc(deri)};
  --doku-kadife: ${enc(kadife)};
  --zincir-h: ${enc(zincir(false))};
  --zincir-d: ${enc(zincir(true))};
  --mizrak-cit: ${enc(mizrak)};
  --kemer-dizi: ${enc(kemerdizi)};
}
/* kemer çokgenleri --k ve --bk değişkenlerini kullanır; değişkenler kartın kendisinde çözülür */
.gk {
  /* sivri kemer: yükseklik --k, profil r = ${rho}·genişlik. Dış çizgi ve iç çizgi (kenarlık kalınlığı kadar aşağıda) */
  --kemer-dis: polygon(${poly()}, 100% 100%, 0 100%);
  --kemer-ic: polygon(${poly('var(--bk)')}, 100% 100%, 0 100%);
  /* yırtık deri: aynı kemer, alt kenar düzensiz kopuk */
  --kemer-dis-y: polygon(${polyY()}, ${yirtik.join(', ')});
  --kemer-ic-y: polygon(${polyY('var(--bk)')}, ${yirtik.join(', ')});
}
`
writeFileSync(fileURLToPath(new URL('../src/gothic/doku.css', import.meta.url)), css)
console.log('src/gothic/doku.css yazıldı', css.length, 'bayt')
console.log('KEMER_YOL', svgYol)
