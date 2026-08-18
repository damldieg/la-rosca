import { atom } from 'jotai'
import { chooseEvent } from '@/core/application/game/chooseEvent'
import { getNextEvent } from '@/core/application/game/getNextEvent'
import { startGame } from '@/core/application/game/startGame'
import type { Event, EventChoice } from '@/core/domain/events/types'
import type { GameState } from '@/core/domain/game/types/gameState'
import type { PartyId } from '@/core/domain/party/types'

export type GameSession =
  | { phase: 'start' }
  | { phase: 'selecting_party' }
  | { phase: 'playing'; state: GameState; event: Event }
  | { phase: 'resolved'; state: GameState; previousState: GameState; event: Event; choice: EventChoice }
  | { phase: 'gameover'; state: GameState }

/** Single source of truth for the current game session — never mirrored into component state. */
export const gameSessionAtom = atom<GameSession>({ phase: 'start' })

function toPlayingOrGameOver(state: GameState): GameSession {
  const event = getNextEvent(state)
  return event ? { phase: 'playing', state, event } : { phase: 'gameover', state }
}

export const goToPartySelectionAtom = atom(null, (_get, set) => {
  set(gameSessionAtom, { phase: 'selecting_party' })
})

export const selectPartyAtom = atom(null, (get, set, partyId: PartyId) => {
  const session = get(gameSessionAtom)
  if (session.phase !== 'selecting_party') return // guards against firing twice

  set(gameSessionAtom, toPlayingOrGameOver(startGame(partyId)))
})

export const chooseAtom = atom(null, (get, set, choice: EventChoice) => {
  const session = get(gameSessionAtom)
  if (session.phase !== 'playing') return // guards against a choice firing twice

  const state = chooseEvent(session.state, session.event, choice)
  set(gameSessionAtom, { phase: 'resolved', state, previousState: session.state, event: session.event, choice })
})

export const continueAtom = atom(null, (get, set) => {
  const session = get(gameSessionAtom)
  if (session.phase !== 'resolved') return

  set(gameSessionAtom, toPlayingOrGameOver(session.state))
})
