import type { PartyId, PoliticalParty } from '../../domain/party/types'
import { liberal } from './liberal'
import { popular } from './popular'
import { progresista } from './progresista'

export const PARTIES: Record<PartyId, PoliticalParty> = {
  popular,
  liberal,
  progresista,
}

export const partyList: PoliticalParty[] = [popular, liberal, progresista]
