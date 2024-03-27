import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { resetGameState, selectGameStatus } from '../features/game/gameSlice';
import { fetchWord, selectWord } from '../features/word/wordSlice';
import { resetGuessState } from '../features/guess/guessSlice';
import { resetLetterKeysState } from '../features/letterKeys/letterKeysSlice';
import {
    addHighScore,
    fetchHighScores,
    HighScore,
    selectHighScores,
} from '../features/highScores/highScoresSlice';
import { selectTimeStatus } from '../features/time/timeSlice';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_HIGHSCORES } from '../constants';

const GameOverDialog = () => {
    const dispatch = useAppDispatch();
    const gameStatus = useAppSelector(selectGameStatus);
    const highScoresState = useAppSelector(selectHighScores);
    const timeStatus = useAppSelector(selectTimeStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const gameWon: boolean = gameStatus.gameResult === 'win';
    const thisTime = timeStatus.endTime - timeStatus.startTime;
    const highScores = highScoresState.highScores.data as HighScore[];
    const timeToBeat = highScores.at(-1)?.wintime as number;
    const newHighScore: boolean =
        (thisTime < timeToBeat || highScores.length < MAX_HIGHSCORES) &&
        gameWon;

    const resetGame = () => {
        console.log('resetting game');
        dispatch(resetGameState());
        dispatch(resetGuessState());
        dispatch(fetchWord());
        dispatch(resetLetterKeysState());
    };

    const NewHighScoreDialog = () => {
        const navigate = useNavigate();
        const [name, setName] = useState('');
        const wordState = useAppSelector(selectWord);
        const word = wordState.wordObject.data as string;

        const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
            const inputName = event.currentTarget.value;

            if (inputName.length <= 10) {
                setName(inputName);
            }
        };

        const handleSubmit = async () => {
            setIsSubmitting(true);

            await dispatch(
                addHighScore({
                    playername: name,
                    wintime: thisTime,
                    word: word,
                })
            );
            await dispatch(fetchHighScores());

            resetGame();
            navigate('/besttimes');
        };

        return (
            <HighScoreWrapper>
                <NewHighScoreMessage>
                    A new high score! Enter your name, initials, or handle:
                </NewHighScoreMessage>

                <StyledInput
                    type='text'
                    disabled={isSubmitting}
                    onChange={(event) => {
                        handleChange(event);
                    }}
                />
                <ButtonWrapper>
                    <ContinueButton
                        disabled={isSubmitting || name.length === 0}
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        {isSubmitting ? '...' : 'Continue'}
                    </ContinueButton>
                </ButtonWrapper>
            </HighScoreWrapper>
        );
    };

    return (
        <Wrapper>
            {newHighScore ? (
                <NewHighScoreDialog />
            ) : (
                <ButtonWrapper>
                    <PlayAgainButton
                        onClick={() => {
                            resetGame();
                        }}
                    >
                        Play again
                    </PlayAgainButton>
                </ButtonWrapper>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div``;
const HighScoreWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StyledInput = styled.input`
    display: flex;
    border: 2px solid darkgrey;
    margin-top: 0.4rem;
    min-height: 1.5rem;
    max-width: 6rem;
    background-color: black;
    color: darkgrey;
    border-radius: 5px;
`;

const ButtonWrapper = styled.div`
    height: 7.4rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const NewHighScoreMessage = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 0.3rem;
    color: green;
`;

const BigButton = styled.button`
    padding: 1rem 2rem;
    border: 1px solid darkgrey;
    background: none;
    color: darkgrey;
    border-radius: 5px;
    font-size: larger;
`;

const PlayAgainButton = styled(BigButton)``;
const ContinueButton = styled(BigButton)`
    min-width: 8.4rem;
`;

export default GameOverDialog;
