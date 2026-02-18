import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { AuthModal } from '../components/auth/AuthModal';

const Header = () => {
    const { user, signOut, openLoginModal } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const hideSearch = location.pathname === '/recipes';
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    // Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileMenuOpen && !event.target.closest('.profile-menu-container')) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileMenuOpen]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-md border-b border-solid border-primary/10 px-6 py-4 lg:px-20">
            <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl font-bold">restaurant_menu</span>
                        <h2 className="text-[#181411] text-xl font-extrabold leading-tight tracking-tight">CookMaster</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-[#181411] text-sm font-semibold hover:text-primary transition-colors">Explorar</Link>
                        <a href="#" className="text-[#181411] text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                            Desafios <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">NOVO</span>
                        </a>
                        <a href="#" className="text-[#181411] text-sm font-semibold hover:text-primary transition-colors">Ranking</a>
                        <a href="#" className="text-[#181411] text-sm font-semibold hover:text-primary transition-colors">Favoritos</a>
                    </nav>
                </div>

                <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6">
                    {!hideSearch && (
                        <label className="hidden sm:flex flex-col min-w-40 h-11 max-w-md flex-1">
                            <div className="flex w-full flex-1 items-stretch rounded-full h-full bg-primary/5 border border-primary/10 focus-within:border-primary transition-all">
                                <div className="text-primary flex items-center justify-center pl-4">
                                    <span className="material-symbols-outlined text-xl">search</span>
                                </div>
                                <input
                                    className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 h-full placeholder:text-primary/50 px-3 text-sm font-medium"
                                    placeholder="Buscar receitas..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                        </label>
                    )}

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <button className="flex items-center justify-center rounded-full size-11 bg-white border border-primary/10 text-[#181411] hover:bg-primary/10 transition-all relative">
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2 right-2 size-2 bg-primary rounded-full ring-2 ring-white"></span>
                                </button>
                                <div className="h-10 w-[1px] bg-primary/10 mx-1"></div>
                                <div className="flex items-center gap-3 relative profile-menu-container cursor-pointer" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-11 border-2 border-primary bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div className="hidden md:block">
                                        <p className="text-sm font-bold text-[#181411] leading-none mb-0.5">Olá, Chef!</p>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Nível {Math.floor((user.user_metadata?.xp || 0) / 75) + 1}</p>
                                    </div>

                                    {/* Dropdown Logout */}
                                    <div className={`absolute top-12 right-0 w-56 bg-white rounded-lg shadow-xl py-2 transition-all duration-200 z-50 transform origin-top-right border border-gray-100 ${isProfileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                        <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Conta</p>
                                            <p className="text-sm font-bold text-[#181411] truncate">{user.email}</p>
                                        </div>

                                        <Link to="/profile" className="w-full text-left px-4 py-2.5 text-sm text-[#181411] hover:bg-primary/5 flex items-center gap-3 transition-colors">
                                            <span className="material-symbols-outlined text-[20px] text-primary/60">person</span> Meu Perfil
                                        </Link>
                                        <Link to="/profile?tab=favorites" className="w-full text-left px-4 py-2.5 text-sm text-[#181411] hover:bg-primary/5 flex items-center gap-3 transition-colors">
                                            <span className="material-symbols-outlined text-[20px] text-primary/60">favorite</span> Favoritos
                                        </Link>

                                        <div className="h-px bg-gray-100 my-1 mx-2"></div>

                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                            <span className="material-symbols-outlined text-[20px]">logout</span> Sair
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Button onClick={openLoginModal} variant="outline" className="hidden md:flex">
                                    Entrar
                                </Button>
                                <button onClick={openLoginModal} className="md:hidden p-2 text-[#181411]/60 hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">login</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

const Footer = () => (
    <footer className="px-6 lg:px-20 py-12 border-t border-primary/10 mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2 text-primary opacity-50 grayscale hover:grayscale-0 transition-all">
                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                <h2 className="text-[#181411] text-lg font-extrabold">CookMaster</h2>
            </div>
            <div className="flex gap-10">
                <a href="#" className="text-sm font-semibold text-[#181411]/60 hover:text-primary">Termos</a>
                <a href="#" className="text-sm font-semibold text-[#181411]/60 hover:text-primary">Privacidade</a>
                <a href="#" className="text-sm font-semibold text-[#181411]/60 hover:text-primary">Suporte</a>
            </div>
            <div className="flex gap-4">
                <div className="size-10 rounded-full bg-primary/5 flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-all">
                    <span className="material-symbols-outlined">share</span>
                </div>
            </div>
        </div>
        <p className="text-center text-sm font-medium text-[#181411]/40 mt-12">© 2026 CookMaster. Criando mestres na cozinha.</p>
    </footer>
);

export const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background-light overflow-x-hidden">
            <Header />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Footer />
            <AuthModal />
        </div>
    );
};
