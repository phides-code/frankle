import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import About from './components/About';
import MainGrid from './components/MainGrid';
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Wrapper>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path='/' element={<MainGrid />} />
                    <Route path='/about' element={<About />} />
                </Routes>
            </BrowserRouter>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    max-width: 24rem;
    margin: 0 auto;
`;

export default App;
