import { useSetAtom } from 'jotai'
import { partyList } from '@/core/content/parties'
import type { PoliticalParty } from '@/core/domain/party/types'
import { Button } from '@/ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/ui/card'
import { OrnamentDivider } from '@/ui/components/game/OrnamentDivider'
import { selectPartyAtom } from '@/ui/state/gameSession'

export function PartySelectScreen() {
  const selectParty = useSetAtom(selectPartyAtom)

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-bold text-primary sm:text-4xl">Elegí tu partido</h1>
        <OrnamentDivider className="mx-auto mt-3 w-40" />
        <p className="text-foreground/80 mt-3 text-base">Cada partido cambia con qué te vas a encontrar.</p>
      </div>

      <div className="flex flex-col gap-4">
        {partyList.map((party) => (
          <PartyCard key={party.id} party={party} onSelect={() => selectParty(party.id)} />
        ))}
      </div>
    </main>
  )
}

function PartyCard({ party, onSelect }: { party: PoliticalParty; onSelect: () => void }) {
  return (
    <Card className="border-t-4 border-t-bordeaux">
      <CardHeader>
        <CardTitle className="font-serif text-lg">{party.name}</CardTitle>
        <CardDescription className="text-base text-foreground/80">{party.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="lg" className="w-full" onClick={onSelect}>
          Jugar con {party.name}
        </Button>
      </CardContent>
    </Card>
  )
}
