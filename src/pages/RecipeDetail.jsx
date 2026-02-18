import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const RecipeDetail = () => {
    const { slug } = useParams();
    const { user } = useAuth();
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchRecipeDetails();
        }
    }, [slug]);

    const fetchRecipeDetails = async () => {
        try {
            setLoading(true);

            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .select('*')
                .eq('slug', slug)
                .single();

            if (recipeError) throw recipeError;
            setRecipe(recipeData);

            const { data: ingredientsData, error: ingredientsError } = await supabase
                .from('ingredients')
                .select('*')
                .eq('recipe_id', recipeData.id);

            if (ingredientsError) throw ingredientsError;
            setIngredients(ingredientsData);

            // Verifica se já é favorito
            if (user) {
                const { data: favData } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('recipe_id', recipeData.id)
                    .maybeSingle();
                setIsFavorite(!!favData);
            }

        } catch (error) {
            console.error('Error fetching details:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!user || !recipe || favLoading) return;
        setFavLoading(true);

        try {
            if (isFavorite) {
                await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('recipe_id', recipe.id);
                setIsFavorite(false);
            } else {
                await supabase
                    .from('favorites')
                    .insert({ user_id: user.id, recipe_id: recipe.id });
                setIsFavorite(true);
            }
        } catch (error) {
            console.error('Erro ao atualizar favorito:', error.message);
        } finally {
            setFavLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </MainLayout>
        )
    }

    if (!recipe) {
        return (
            <MainLayout>
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <h2 className="text-2xl font-bold">Receita não encontrada 😕</h2>
                    <Button onClick={() => window.history.back()}>Voltar</Button>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            {/* Hero Header with Image as Background */}
            <div className="relative h-[400px] lg:h-[500px] w-full">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${recipe.image_url}")` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>

                <div className="relative h-full max-w-[1440px] mx-auto px-6 lg:px-20 flex flex-col justify-end pb-12 text-white">
                    <Link to="/" className="absolute top-8 left-6 lg:left-20 bg-white/20 backdrop-blur-md size-10 flex items-center justify-center rounded-full hover:bg-white/30 transition-colors">
                        <span className="material-symbols-outlined text-white text-xl">arrow_back</span>
                    </Link>

                    <div className="flex gap-3 mb-4">
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center justify-center h-8">Receita do Dia</span>
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center justify-center gap-1 h-8">
                            <span className="material-symbols-outlined text-[16px]">payments</span> +{recipe.xp_reward || 0} XP
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight max-w-3xl">{recipe.title}</h1>

                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <span className="material-symbols-outlined text-primary text-2xl">schedule</span> {recipe.time_minutes} min
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <span className="material-symbols-outlined text-primary text-2xl">restaurant</span> {recipe.difficulty}
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <span className="material-symbols-outlined text-primary text-2xl">local_fire_department</span> {recipe.calories} kcal
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg">
                            <span className="material-symbols-outlined text-yellow-400 text-2xl">star</span> {recipe.rating}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8 flex flex-col gap-12">

                    {/* Description */}
                    <section>
                        <h2 className="text-2xl font-black text-[#181411] mb-4">Sobre a Receita</h2>
                        <p className="text-lg text-[#181411]/70 leading-relaxed font-medium">
                            {recipe.description}
                        </p>
                    </section>

                    {/* Ingredients */}
                    <section>
                        <h2 className="text-2xl font-black text-[#181411] mb-6 flex items-center gap-2">
                            Ingredientes <span className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">{ingredients.length} itens</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ingredients.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-primary/5 shadow-sm hover:border-primary/20 transition-all">
                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">{item.icon || 'circle'}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#181411]">{item.name}</p>
                                        <p className="text-sm text-primary font-bold">{item.amount}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Sidebar / Actions */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border border-primary/10 text-center">
                        <h3 className="text-xl font-black mb-2">Pronto para cozinhar?</h3>
                        <p className="text-[#181411]/60 text-sm mb-6">Siga o passo a passo gamificado e ganhe XP!</p>

                        <Link to={`/recipe/${slug}/cook`} className="cursor-pointer">
                            <Button size="lg" className="w-full shadow-primary/30 shadow-xl mb-4 py-6 text-xl cursor-pointer">
                                Começar Receita  <span className="material-symbols-outlined">play_circle</span>
                            </Button>
                        </Link>

                        <button
                            onClick={toggleFavorite}
                            disabled={favLoading || !user}
                            className={`w-full py-6 text-xl font-bold rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer
                                ${isFavorite
                                    ? 'bg-white border-2 border-primary text-primary hover:bg-primary/5'
                                    : 'bg-white border-2 border-gray-200 text-[#181411] hover:border-primary/40'}`}
                        >
                            {isFavorite ? 'Nos Favoritos' : 'Adicionar aos Favoritos'}
                            <span className={`material-symbols-outlined ${isFavorite ? 'text-primary' : 'text-gray-400'}`}>
                                {isFavorite ? 'favorite' : 'favorite_border'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
