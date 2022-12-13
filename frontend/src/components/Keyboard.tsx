import styled from 'styled-components';

const Keyboard = () => {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '✔️'],
    ];

    return (
        <Wrapper>
            {keyboardLayout.map((keyBoardRow) => (
                <Row key={keyBoardRow[0]}>
                    {keyBoardRow.map((keyboardKey) => (
                        <Key key={keyboardKey}>{keyboardKey}</Key>
                    ))}
                </Row>
            ))}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: stretch;
    align-content: stretch;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: stretch;
    margin-top: 0.4rem;
`;

const Key = styled.button`
    margin-right: 0.4rem;
    font-size: 1.2rem;
    height: 3rem;
    background: black;
    color: white;
`;

export default Keyboard;
