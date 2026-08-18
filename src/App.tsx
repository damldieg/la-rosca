import { useAtomValue } from 'jotai'
import { GameOverScreen } from '@/ui/screens/GameOverScreen'
import { GameScreen } from '@/ui/screens/GameScreen'
import { StartScreen } from '@/ui/screens/StartScreen'
import { gameSessionAtom } from '@/ui/state/gameSession'

function App() {
  const session = useAtomValue(gameSessionAtom)

  switch (session.phase) {
    case 'start':
      return <StartScreen />
    case 'playing':
    case 'resolved':
      return <GameScreen />
    case 'gameover':
      return <GameOverScreen />
  }
}

export default App
