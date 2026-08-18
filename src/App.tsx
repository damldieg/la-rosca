import { useAtomValue } from 'jotai'
import { GameOverScreen } from '@/screens/GameOverScreen'
import { GameScreen } from '@/screens/GameScreen'
import { StartScreen } from '@/screens/StartScreen'
import { gameSessionAtom } from '@/store/gameSession'

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
