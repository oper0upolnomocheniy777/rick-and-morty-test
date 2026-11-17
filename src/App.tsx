import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CharactersPage from './pages/CharactersPage/CharactersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CharactersPage />} />
      </Routes>
    </BrowserRouter>
  );
}