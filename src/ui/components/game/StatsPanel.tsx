import { Progress } from '@/ui/components/ui/progress'
import type { GameState } from '@/core/domain/game/types/gameState'
import { cn } from '@/ui/lib/utils'
import { formatMoney } from './statLabels'

const BOUNDED_STATS: { key: keyof GameState; label: string; barClassName: string }[] = [
  { key: 'power', label: 'Poder', barClassName: '[&>[data-slot=progress-indicator]]:bg-navy' },
  { key: 'popularity', label: 'Popularidad', barClassName: '[&>[data-slot=progress-indicator]]:bg-bordeaux' },
  { key: 'corruption', label: 'Corrupción', barClassName: '[&>[data-slot=progress-indicator]]:bg-destructive' },
  { key: 'structure', label: 'Estructura', barClassName: '[&>[data-slot=progress-indicator]]:bg-olive' },
]

export function StatsPanel({ state }: { state: GameState }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-5">
      <div className="flex flex-col gap-1">
        <span className="text-xs tracking-wide text-muted-foreground uppercase">Dinero</span>
        <span className="text-gold font-serif text-lg font-semibold">{formatMoney(state.money)}</span>
      </div>

      {BOUNDED_STATS.map(({ key, label, barClassName }) => (
        <div key={key} className="flex flex-col gap-1">
          <span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span>
          <span className="text-sm font-medium text-foreground">{state[key] as number}</span>
          <Progress value={state[key] as number} className={cn('h-1.5', barClassName)} />
        </div>
      ))}
    </div>
  )
}
