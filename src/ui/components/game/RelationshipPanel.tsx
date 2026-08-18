import { ACTORS } from '@/core/content/actors'
import type { GameState } from '@/core/domain/game/types/gameState'

export function RelationshipPanel({ state }: { state: GameState }) {
  const entries = Object.entries(state.relationships).filter(([, value]) => value !== 0)
  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Red política</p>
      <ul className="flex flex-col gap-1.5">
        {entries.map(([id, value]) => (
          <li key={id} className="flex items-center justify-between text-sm">
            <span className="text-foreground/80">{ACTORS[id]?.name ?? id}</span>
            <span className={value > 0 ? 'font-medium text-olive' : 'font-medium text-destructive'}>
              {value > 0 ? '+' : ''}
              {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
