import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
    return (
        <Wrapper>
            <StyledLink to='/'>Frankle</StyledLink>
            <StyledLink to='/about'>About</StyledLink>
        </Wrapper>
    );
};

const StyledLink = styled(Link)`
    color: black;
    text-decoration: none;

    &:active {
        color: blue;
    }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
    margin-bottom: 1rem;
`;

export default Navbar;
