import { createContext, useContext } from 'react'
import { TILT, type Projection } from './iso'

type Ctx = { projection: Projection; tilt: number; setProjection: (p: Projection) => void }

export const ProjectionContext = createContext<Ctx>({ projection: 'gercek', tilt: TILT.gercek, setProjection: () => {} })
export const useProjection = () => useContext(ProjectionContext)
