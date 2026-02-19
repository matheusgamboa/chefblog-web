import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MainLayout } from '../layouts/MainLayout';
import { RecipeCard } from '../components/ui/RecipeCard';
import { Link } from 'react-router-dom';

export const Ranking = () => {
    const [topRecipes, setTopRecipes] = useState([]);
    const [topChefs, setTopChefs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRankings();
    }, []);

    const fetchRankings = async () => {
        try {
            setLoading(true);

            // Fetch Top 10 Recipes by completions
            const { data: recipes } = await supabase
                .from('recipes')
                .select('*')
                .order('times_completed', { ascending: false })
                .limit(10);

            if (recipes) setTopRecipes(recipes);

            // Fetch Top 10 Chefs by XP
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .order('xp', { ascending: false })
                .limit(10);

            if (profiles) setTopChefs(profiles);

        } catch (error) {
            console.error('Error fetching rankings:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Carregando Hall da Fama...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12">
                <div className="flex flex-col gap-2 mb-12">
                    <span className="text-primary font-bold text-sm uppercase tracking-[0.2em]">O Melhor do BlogChef</span>
                    <h1 className="text-[#181411] text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">Hall da Fama</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Side: Top Recipes */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="material-symbols-outlined text-primary fill-1">restaurant</span>
                            <h2 className="text-2xl font-black text-[#181411]">Receitas Mais Finalizadas</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            {topRecipes.map((recipe, index) => (
                                <div key={recipe.id} className="relative flex items-center gap-6 group">
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 size-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 font-black text-sm z-10 border border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                        {index + 1}
                                    </div>
                                    <Link to={`/recipe/${recipe.slug}`} className="flex-1">
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex h-32 md:h-40">
                                            <div className="w-1/3 h-full">
                                                <img
                                                    src={recipe.image_url}
                                                    alt={recipe.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
                                                <h3 className="text-lg md:text-xl font-bold text-[#181411] group-hover:text-primary transition-colors line-clamp-1">{recipe.title}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md uppercase tracking-wider">
                                                        {recipe.difficulty}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                                                        {recipe.times_completed || 0} finalizações
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Top Chefs */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="material-symbols-outlined text-primary fill-1">military_tech</span>
                            <h2 className="text-2xl font-black text-[#181411]">Top Mestres Cucas</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            {topChefs.map((chef, index) => {
                                const isFirst = index === 0;
                                return (
                                    <div
                                        key={chef.id}
                                        className={`flex items-center gap-6 p-4 rounded-3xl transition-all ${isFirst
                                                ? 'bg-gradient-to-r from-primary/10 to-transparent border-2 border-primary/20 shadow-lg scale-105 mb-4'
                                                : 'bg-white border border-gray-100 hover:border-primary/30 shadow-sm'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center size-8">
                                            {isFirst ? (
                                                <span className="material-symbols-outlined text-yellow-500 text-3xl fill-1">workspace_premium</span>
                                            ) : (
                                                <span className="text-xl font-black text-gray-300">#{index + 1}</span>
                                            )}
                                        </div>

                                        <div className={`relative ${isFirst ? 'size-20' : 'size-14'} flex-shrink-0`}>
                                            <div className={`w-full h-full rounded-full border-4 ${isFirst ? 'border-primary' : 'border-gray-100'} overflow-hidden shadow-md`}>
                                                {chef.avatar_url ? (
                                                    <img src={chef.avatar_url} alt={chef.username} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                                                        {(chef.username || chef.email || '?')[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            {isFirst && (
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap uppercase">
                                                    Mestre Supremo
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col">
                                            <h3 className={`font-black text-[#181411] ${isFirst ? 'text-2xl' : 'text-lg'}`}>
                                                {chef.username || `Chef ${chef.id.toString().substring(0, 4)}`}
                                            </h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-bold text-gray-400">NÍVEL {Math.floor((chef.xp || 0) / 75) + 1}</span>
                                                <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                                                <span className="text-xs font-black text-primary uppercase tracking-widest">{chef.xp || 0} XP ACUMULADO</span>
                                            </div>
                                        </div>

                                        {isFirst && (
                                            <div className="hidden md:flex flex-col items-end px-4">
                                                <span className="material-symbols-outlined text-primary text-4xl animate-pulse">local_fire_department</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
