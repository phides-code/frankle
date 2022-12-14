import styled from 'styled-components';

const Keyboard = () => {
    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '<'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '✔️'],
    ];

    const handleKeyPress = (event: React.MouseEvent<HTMLButtonElement>) => {
        const letter: HTMLButtonElement = event.currentTarget;
        console.log('***: ');
        console.log(letter.value);
    };

    return (
        <Wrapper>
            {keyboardLayout.map((keyBoardRow) => (
                <Row key={keyBoardRow[0]}>
                    {keyBoardRow.map((keyboardKey) => (
                        <Key
                            key={keyboardKey}
                            onClick={handleKeyPress}
                            value={keyboardKey}
                        >
                            {keyboardKey}
                        </Key>
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
    margin-top: 0.4rem;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    align-content: stretch;
    margin-bottom: 0.4rem;
`;

const Key = styled.button`
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    font-size: 1.2rem;
    height: 3rem;
    background: black;
    color: white;
    min-width: 1.8rem;
`;

export default Keyboard;
