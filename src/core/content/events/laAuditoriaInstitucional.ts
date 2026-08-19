import type { Event } from '../../domain/events/types'

export const laAuditoriaInstitucional: Event = {
  id: 'la_auditoria_institucional',
  title: 'La auditoría institucional',
  description: 'Podés impulsar una auditoría externa sobre tu propia gestión.',
  conditions: { type: 'careerPath', operator: 'equals', value: 'institucional' },
  choices: [
    {
      id: 'impulsar_la_auditoria',
      text: 'Impulsarla vos mismo',
      relationships: { fiscal: 5 },
      effects: { exposure: -6, structure: -2 },
      durationMonths: 2,
    },
    {
      id: 'dejarlo_para_mas_adelante',
      text: 'Dejarlo para más adelante',
      effects: { popularity: -1 },
      durationMonths: 1,
    },
  ],
}
