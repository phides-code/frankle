import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Rules from './components/Rules';
import MainGrid from './components/MainGrid';
import Navbar from './components/Navbar';
import HighScores from './components/HighScores';
// import GameOverDialog from './components/GameOverDialog';
// import { useAppSelector } from './app/hooks';
// import { selectGameStatus } from './features/game/gameSlice';

const App = () => {
    // const gameStatus = useAppSelector(selectGameStatus);
    // const gameOver: boolean = gameStatus.gameOver;
    // const gameOver = true;

    return (
        <Wrapper>
            <BrowserRouter>
                <Navbar />

                {/* {gameOver ? (
                    <GameOverDialog />
                ) : ( */}
                <Routes>
                    <Route path='/' element={<MainGrid />} />
                    <Route path='/highscores' element={<HighScores />} />
                    <Route path='/rules' element={<Rules />} />
                </Routes>
                {/* )} */}
            </BrowserRouter>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    max-width: 25rem;
    margin: 0 auto;
`;

export default App;
