import type { Actor } from '../../domain/actors/types'
import { empresario } from './empresario'
import { fiscal } from './fiscal'
import { jefePartidario } from './jefePartidario'
import { organizacionCivil } from './organizacionCivil'
import { periodista } from './periodista'
import { sindicalista } from './sindicalista'

export const ACTORS: Record<string, Actor> = {
  empresario,
  sindicalista,
  periodista,
  jefePartidario,
  fiscal,
  organizacionCivil,
}

export const actorList: Actor[] = [empresario, sindicalista, periodista, jefePartidario, fiscal, organizacionCivil]
