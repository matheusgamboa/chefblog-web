import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { RecipeDetail } from './pages/RecipeDetail';
import { GamifiedCooking } from './pages/GamifiedCooking';
import { AllRecipes } from './pages/AllRecipes';
import { Profile } from './pages/Profile';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<AllRecipes />} />
          <Route path="/recipe/:slug" element={<RecipeDetail />} />
          <Route path="/recipe/:slug/cook" element={<GamifiedCooking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
