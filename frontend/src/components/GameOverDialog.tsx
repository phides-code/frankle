import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { resetGameState, selectGameStatus } from '../features/game/gameSlice';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import { resetGuessState } from '../features/guess/guessSlice';
import { resetLetterKeysState } from '../features/letterKeys/letterKeysSlice';

const GameOverDialog = () => {
    const dispatch = useAppDispatch();
    const gameStatus = useAppSelector(selectGameStatus);
    const wordObject = useAppSelector(selectWord);

    const wordArray = wordObject.wordObject.data.split('');
    const gameWon: boolean = gameStatus.gameResult === 'win';

    const resetGame = () => {
        console.log('resetting game');
        dispatch(resetGameState());
        dispatch(resetGuessState());
        dispatch(fetchWord());
        dispatch(resetLetterKeysState());
    };

    const WinMessage = () => {
        return (
            <div
                style={{
                    color: 'green',
                }}
            >
                Well done!
            </div>
        );
    };

    const LossMessage = () => {
        return (
            <div
                style={{
                    color: 'red',
                }}
            >
                ... Better luck next time.
            </div>
        );
    };

    return (
        <Wrapper>
            {/* <GuessRowWrapper>
                {wordArray.map((letter) => {
                    return (
                        <StyledLetterBox
                            key={Math.floor(Math.random() * 99999999)}
                            style={{
                                transition: 'background-color 1s, color 1s',
                            }}
                        >
                            {letter}
                        </StyledLetterBox>
                    );
                })}
            </GuessRowWrapper> */}
            {/* {gameWon ? <WinMessage /> : <LossMessage />} */}
            <StyledPlayAgainDiv>
                <PlayAgainButton
                    onClick={() => {
                        resetGame();
                    }}
                >
                    Play Again
                </PlayAgainButton>
            </StyledPlayAgainDiv>
        </Wrapper>
    );
};

const StyledPlayAgainDiv = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    /* align-content: stretch; */
    /* margin: auto 0; */
`;

const PlayAgainButton = styled.button``;

const Wrapper = styled.div`
    border: 2px solid orange;
    height: 10.5rem;
`;

// const GuessRowWrapper = styled.div`
//     display: flex;
//     flex-direction: row;
//     height: 100%;
// `;

// const StyledLetterBox = styled.div`
//     background: green;
//     color: white;
//     border: 2px solid darkgray;
//     margin: 0.4rem;
//     min-height: 4rem;
//     width: 100%;
//     display: flex;
//     flex-direction: row;
//     flex-wrap: nowrap;
//     justify-content: center;
//     align-items: center;
//     align-content: stretch;
//     font-size: xx-large;
// `;

export default GameOverDialog;
