import { PARTIES } from '../../content/parties'
import { createInitialGameState } from '../../domain/game/state/initialState'
import type { GameState } from '../../domain/game/types/gameState'
import type { PartyId } from '../../domain/party/types'

export function startGame(partyId: PartyId): GameState {
  return createInitialGameState(PARTIES[partyId])
}
