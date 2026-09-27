import kristal from '../assets/kristal.glb?url'
import ucak from '../assets/ucak.glb?url'
import kaya from '../assets/kaya.glb?url'
import agac from '../assets/agac.glb?url'

/** GLB modelleri: scripts/lowpoly-glb.mjs üretir */
export const MODELS = {
  kristal: { name: 'Kristal', file: 'kristal.glb', url: kristal, tris: 32, scale: 1.25, y: 0.25 },
  ucak: { name: 'Kağıt uçak', file: 'ucak.glb', url: ucak, tris: 5, scale: 1.35, y: 0.35 },
  kaya: { name: 'Kaya', file: 'kaya.glb', url: kaya, tris: 80, scale: 1.25, y: 0.1 },
  agac: { name: 'Ağaç', file: 'agac.glb', url: agac, tris: 54, scale: 1.05, y: 0.3 },
} as const
export type ModelId = keyof typeof MODELS
