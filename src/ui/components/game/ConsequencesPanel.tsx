import { ArrowDown, ArrowUp } from 'lucide-react'
import { Button } from '@/ui/components/ui/button'
import type { DecisionEffects, GameState, Ideology } from '@/core/domain/game/types/gameState'
import { formatIdeologyDelta, formatStatDelta } from './statLabels'
import { ROLE_LABELS } from './roleLabels'

const DELTA_KEYS = Object.keys({
  money: 0,
  power: 0,
  popularity: 0,
  corruption: 0,
  impunity: 0,
  structure: 0,
  exposure: 0,
} satisfies Record<keyof DecisionEffects, number>) as (keyof DecisionEffects)[]

const IDEOLOGY_AXES = Object.keys({
  economic: 0,
  social: 0,
  institutional: 0,
} satisfies Record<keyof Ideology, number>) as (keyof Ideology)[]

export function ConsequencesPanel({
  previousState,
  state,
  onContinue,
}: {
  previousState: GameState
  state: GameState
  onContinue: () => void
}) {
  const statDeltas = DELTA_KEYS.map((key) => ({ key, delta: state[key] - previousState[key] })).filter(
    ({ delta }) => delta !== 0,
  )
  const ideologyDeltas = IDEOLOGY_AXES.map((axis) => ({
    axis,
    delta: state.ideology[axis] - previousState.ideology[axis],
  })).filter(({ delta }) => delta !== 0)
  const promoted = state.role !== previousState.role

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Consecuencias</p>

      <ul className="flex flex-col gap-2">
        {statDeltas.map(({ key, delta }) => (
          <li
            key={key}
            className={`flex items-center gap-2 text-sm font-medium ${delta > 0 ? 'text-olive' : 'text-destructive'}`}
          >
            {delta > 0 ? <ArrowUp className="size-4" aria-hidden="true" /> : <ArrowDown className="size-4" aria-hidden="true" />}
            <span>{formatStatDelta(key, delta)}</span>
          </li>
        ))}
        {ideologyDeltas.map(({ axis, delta }) => (
          <li key={axis} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {delta > 0 ? <ArrowUp className="size-4" aria-hidden="true" /> : <ArrowDown className="size-4" aria-hidden="true" />}
            <span>{formatIdeologyDelta(axis, delta)}</span>
          </li>
        ))}
        {statDeltas.length === 0 && ideologyDeltas.length === 0 && (
          <li className="text-sm text-muted-foreground">Sin cambios en tus números.</li>
        )}
      </ul>

      {promoted && (
        <p className="border-gold bg-accent/40 text-bordeaux rounded border border-dashed px-3 py-2 text-sm font-semibold">
          Ascendiste a {ROLE_LABELS[state.role]}
        </p>
      )}

      <Button size="lg" onClick={onContinue} className="self-end">
        Continuar
      </Button>
    </div>
  )
}
