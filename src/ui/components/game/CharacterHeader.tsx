import type { GameState } from '@/core/domain/game/types/gameState'
import { PROTAGONIST_NAME, ROLE_LABELS } from './roleLabels'

export function CharacterHeader({ state }: { state: GameState }) {
  return (
    <header className="text-center">
      <p className="font-serif text-xl font-semibold text-foreground">{PROTAGONIST_NAME}</p>
      <p className="text-sm text-muted-foreground">
        {state.age} años · <span className="text-bordeaux font-medium">{ROLE_LABELS[state.role]}</span>
      </p>
    </header>
  )
}
