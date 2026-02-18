import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { RecipeCard } from '../components/ui/RecipeCard';

export const Profile = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'completed');

    const [profile, setProfile] = useState(null);
    const [completedRecipes, setCompletedRecipes] = useState([]);
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchUserData();
    }, [user]);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Busca perfil do usuário (xp/level vem daqui)
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            setProfile(profileData);

            // Busca receitas realizadas pelo usuário
            const { data: completed } = await supabase
                .from('completed_recipes')
                .select('*, recipe:recipes(*)')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false });

            setCompletedRecipes(completed?.map(c => c.recipe).filter(Boolean) || []);

            // Busca receitas favoritas
            const { data: favorites } = await supabase
                .from('favorites')
                .select('recipe:recipes(*)')
                .eq('user_id', user.id);

            setFavoriteRecipes(favorites?.map(f => f.recipe).filter(Boolean) || []);

        } catch (error) {
            console.error('Erro ao buscar dados do perfil:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    if (!user) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-lg text-gray-500">Faça login para ver seu perfil.</p>
                </div>
            </MainLayout>
        );
    }

    // Dados de nível
    const xp = profile?.xp || 0;
    const level = profile?.level || Math.floor(xp / 75) + 1;
    const xpForNextLevel = 75;
    const currentXpProgress = xp % 75;
    const progressPercent = (currentXpProgress / xpForNextLevel) * 100;

    const tabs = [
        { id: 'completed', label: 'Receitas Realizadas', icon: 'task_alt', count: completedRecipes.length },
        { id: 'favorites', label: 'Favoritos', icon: 'favorite', count: favoriteRecipes.length },
    ];

    const activeRecipes = activeTab === 'completed' ? completedRecipes : favoriteRecipes;

    return (
        <MainLayout>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-10">

                {/* ── Card do Perfil ── */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-primary/5 mb-10 relative overflow-hidden">
                    {/* Detalhe decorativo */}
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
                        {/* Avatar */}
                        <div className="shrink-0 size-28 lg:size-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-4 border-white ring-4 ring-primary/10 flex items-center justify-center text-primary text-5xl font-black shadow-lg">
                            {user.email[0].toUpperCase()}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-2xl lg:text-3xl font-black text-[#181411] mb-1">
                                {profile?.username || user.email.split('@')[0]}
                            </h1>
                            <p className="text-sm text-[#181411]/50 font-medium mb-5">{user.email}</p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                                <div className="bg-primary/5 px-5 py-3 rounded-2xl border border-primary/10 min-w-[100px] text-center">
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-0.5">Nível</p>
                                    <p className="text-2xl font-black text-[#181411]">{level}</p>
                                </div>
                                <div className="bg-primary/5 px-5 py-3 rounded-2xl border border-primary/10 min-w-[100px] text-center">
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-0.5">XP Total</p>
                                    <p className="text-2xl font-black text-[#181411]">{xp}</p>
                                </div>
                                <div className="bg-primary/5 px-5 py-3 rounded-2xl border border-primary/10 min-w-[100px] text-center">
                                    <p className="text-[9px] font-bold text-primary uppercase tracking-widest mb-0.5">Realizadas</p>
                                    <p className="text-2xl font-black text-[#181411]">{completedRecipes.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* Barra de Progresso */}
                        <div className="w-full lg:w-96 bg-primary/5 p-6 rounded-2xl border border-primary/10 shrink-0 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Próximo Nível</span>
                                <span className="text-[10px] font-bold text-[#181411]">{currentXpProgress}/{xpForNextLevel}</span>
                            </div>
                            <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-primary/5 mb-1.5">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.max(progressPercent, 2)}%` }}
                                ></div>
                            </div>
                            <p className="text-[9px] text-center font-bold text-[#181411]/35 uppercase tracking-tight">
                                Faltam {xpForNextLevel - currentXpProgress} XP para o nível {level + 1}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Abas ── */}
                <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap cursor-pointer
                                ${activeTab === tab.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white text-[#181411]/50 hover:bg-gray-50 border border-gray-100'}`}
                        >
                            <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                            {tab.label}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-100'
                                }`}>{tab.count}</span>
                        </button>
                    ))}
                </div>

                {/* ── Conteúdo ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="aspect-[4/3] bg-gray-100 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : activeRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {activeRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                id={recipe.id}
                                slug={recipe.slug}
                                title={recipe.title}
                                image={recipe.image_url}
                                time={`${recipe.time_minutes} min`}
                                rating={recipe.rating}
                                tags={[recipe.difficulty]}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <span className="material-symbols-outlined text-5xl text-gray-200 block mb-4">
                            {activeTab === 'completed' ? 'task_alt' : 'favorite_border'}
                        </span>
                        <h3 className="text-xl font-bold text-[#181411] mb-2">
                            {activeTab === 'completed'
                                ? 'Nenhuma receita realizada ainda'
                                : 'Sua lista de favoritos está vazia'}
                        </h3>
                        <p className="text-[#181411]/50 mb-6 max-w-md mx-auto">
                            {activeTab === 'completed'
                                ? 'Complete receitas no modo de cozinha gamificado para ganhar XP e subir de nível!'
                                : 'Salve as receitas que você mais gostou para acessá-las rapidamente.'}
                        </p>
                        <Link
                            to="/recipes"
                            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined text-lg">explore</span>
                            Explorar Receitas
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
