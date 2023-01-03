import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch } from '../app/hooks';
import { resetGuessState } from '../features/guess/guessSlice';
import { fetchWord } from '../features/word/wordSlice';
import { resetGameState } from '../features/game/gameSlice';
import { resetLetterKeysState } from '../features/letterKeys/letterKeysSlice';

const Navbar = () => {
    const dispatch = useAppDispatch();
    const resetGame = () => {
        console.log('resetting game');
        dispatch(resetGameState());
        dispatch(resetGuessState());
        dispatch(fetchWord());
        dispatch(resetLetterKeysState());
    };

    return (
        <Wrapper>
            <StyledLink to='/'>Frankle</StyledLink>
            <StyledResetLink to='/' onClick={resetGame}>
                Reset
            </StyledResetLink>
            <StyledLink to='/rules'>Rules</StyledLink>
        </Wrapper>
    );
};

const StyledLink = styled(Link)`
    color: darkgray;
    text-decoration: none;

    &:active {
        color: red;
    }
`;

const StyledResetLink = styled(StyledLink)``;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    margin-bottom: 1rem;
    margin-top: 1rem;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
`;

export default Navbar;
