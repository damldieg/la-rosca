import type { EventPool } from '../../domain/events/eventPool'
import { clubDelBarrio } from './clubDelBarrio'
import { elEmpresario } from './elEmpresario'
import { elPeriodista } from './elPeriodista'
import { jefeTerritorial } from './jefeTerritorial'
import { laLicitacion } from './laLicitacion'
import { laOportunidad } from './laOportunidad'

export const defaultEventPool: EventPool = [
  clubDelBarrio,
  jefeTerritorial,
  laOportunidad,
  elEmpresario,
  laLicitacion,
  elPeriodista,
]
