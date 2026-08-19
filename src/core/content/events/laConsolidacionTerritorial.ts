import type { Event } from '../../domain/events/types'

/** referente -> puntero, the second and last pre-puntero promotion of Fase 7.5's early career. */
export const laConsolidacionTerritorial: Event = {
  id: 'la_consolidacion_territorial',
  title: 'La consolidación territorial',
  description: 'El armado te ofrece manejar tu propia estructura: ser puntero de tu zona.',
  // No age gate — same reasoning as elReferente.ts. Also deliberately not
  // gated on la_red_de_contactos's flag: that event requires role='militante',
  // so under real weighted random selection el_referente can fire first and
  // permanently close the flag's only eligibility window — a real soft-lock
  // this avoids by only requiring the role itself is reached.
  conditions: { type: 'role', operator: 'equals', value: 'referente' },
  // repeatable — same reasoning as elReferente.ts: a oneShot/milestone event
  // whose decline choice was picked would vanish forever with nothing else
  // eligible at the referente tier to fall back on.
  lifecycle: { type: 'repeatable' },
  weightModifiers: [{ conditions: { type: 'careerPath', operator: 'equals', value: 'territorial' }, modifier: 15 }],
  choices: [
    {
      id: 'aceptar_la_estructura',
      text: 'Aceptar manejar tu propia estructura',
      role: 'puntero',
      effects: { power: 10, structure: 5 },
      durationMonths: 4,
    },
    {
      id: 'seguir_como_referente',
      text: 'Seguir construyendo antes de dar el salto',
      effects: { structure: 3 },
      durationMonths: 2,
    },
  ],
}
