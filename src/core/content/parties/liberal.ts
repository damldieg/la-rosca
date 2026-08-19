import { MONEY_SCALE } from '../../domain/game/economy'
import type { PoliticalParty } from '../../domain/party/types'

export const liberal: PoliticalParty = {
  id: 'liberal',
  name: 'Frente Liberal Republicano',
  description:
    'Cuadros técnicos, financiamiento privado y buena prensa económica. Le sobra capital y le falta estructura en el barrio.',
  ideology: { economic: 60, social: 10, institutional: 40 },
  startingStats: {
    money: MONEY_SCALE.LIBERAL_STARTING,
    structure: 5,
  },
  preferredStats: ['money'],
  initialRelationships: { empresario: 15, periodista: -10 },
  availableRoles: ['militante', 'referente', 'puntero', 'asesor', 'concejal', 'diputado', 'senador', 'ministro'],
  preferredEventTags: ['económico', 'empresarial'],
}
