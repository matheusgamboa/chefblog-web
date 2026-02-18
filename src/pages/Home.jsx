import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/Button';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { RecipeCard } from '../components/ui/RecipeCard';
import { Newsletter } from '../components/ui/Newsletter';
import { supabase } from '../lib/supabase';

export const Home = () => {
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [influencer, setInfluencer] = useState(null);
    const [influencerRecipes, setInfluencerRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const tipsContainerRef = useRef(null);

    useEffect(() => {
        fetchRecipes();
        fetchInfluencer();
    }, []);

    const fetchInfluencer = async () => {
        try {
            // Fetch influencer of the week
            const { data: influencerData } = await supabase
                .from('influencers')
                .select('*')
                .eq('is_of_the_week', true)
                .single();

            if (influencerData) {
                setInfluencer(influencerData);

                // Fetch influencer recipes with linked recipe details
                const { data: recipes } = await supabase
                    .from('influencer_recipes')
                    .select(`
                        id,
                        tag,
                        subtitle,
                        recipes (*)
                    `)
                    .eq('influencer_id', influencerData.id);

                if (recipes) {
                    setInfluencerRecipes(recipes);
                }
            }
        } catch (error) {
            console.error('Error fetching influencer:', error.message);
        }
    };

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            // Fetch Featured Recipes (is_featured = true)
            const { data: featured } = await supabase
                .from('recipes')
                .select('*')
                .eq('is_featured', true)
                .limit(3);

            if (featured) {
                setFeaturedRecipes(featured);
            }

            // Fetch Trending Recipes (ordered by rating desc)
            const { data: trending } = await supabase
                .from('recipes')
                .select('*')
                .order('rating', { ascending: false })
                .limit(4);

            if (trending) {
                setTrendingRecipes(trending);
            }

            // Fetch Popular Recipes
            const { data: popular } = await supabase
                .from('recipes')
                .select('*')
                .order('rating', { ascending: false })
                .range(4, 11);

            if (popular) {
                setPopularRecipes(popular);
            }

        } catch (error) {
            console.error('Error fetching recipes:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const scrollTips = (direction) => {
        if (tipsContainerRef.current) {
            const scrollAmount = 300;
            tipsContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <MainLayout>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
                {/* Categories */}
                <CategoryFilter />

                {/* Hero Section */}
                <div className="flex flex-col gap-8 mb-16">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-primary font-bold text-sm uppercase tracking-[0.2em]">Curadoria do Chef</span>
                            <h1 className="text-[#181411] text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">Receitas em Destaque</h1>
                        </div>
                        <Button
                            variant="secondary"
                            icon="trending_flat"
                            onClick={() => window.location.href = '/recipes'}
                        >
                            Ver todas as receitas
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:h-[600px]">
                        <div className="md:col-span-8 h-[500px] md:h-auto">
                            {loading ? (
                                <div className="w-full h-full bg-gray-200 animate-pulse rounded-3xl"></div>
                            ) : featuredRecipes.length > 0 ? (
                                <RecipeCard
                                    variant="hero"
                                    id={featuredRecipes[0].id}
                                    slug={featuredRecipes[0].slug}
                                    title={featuredRecipes[0].title}
                                    image={featuredRecipes[0].image_url}
                                    tags={['Receita do Dia', '+50 XP']}
                                    time={`${featuredRecipes[0].time_minutes} min`}
                                    difficulty={featuredRecipes[0].difficulty}
                                    calories={`${featuredRecipes[0].calories} kcal`}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
                                    Nenhuma receita em destaque
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-4 flex flex-col gap-6 h-full">
                            {loading ? (
                                <>
                                    <div className="flex-1 bg-gray-200 animate-pulse rounded-3xl"></div>
                                    <div className="flex-1 bg-gray-200 animate-pulse rounded-3xl"></div>
                                </>
                            ) : (
                                <>
                                    {featuredRecipes.slice(1, 3).map((recipe) => (
                                        <RecipeCard
                                            key={recipe.id}
                                            variant="horizontal"
                                            id={recipe.id}
                                            slug={recipe.slug}
                                            title={recipe.title}
                                            category={recipe.description ? recipe.description.substring(0, 30) + '...' : "Destaque do chef"}
                                            image={recipe.image_url}
                                        />
                                    ))}
                                    {/* Fallback if less than 3 featured recipes */}
                                    {featuredRecipes.length < 2 && (
                                        <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                            Vago
                                        </div>
                                    )}
                                    {featuredRecipes.length < 3 && featuredRecipes.length >= 1 && (
                                        <div className="flex-1 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                            Vago
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Influencer Section - Dynamic */}
                {influencer && (
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <a
                                    href={influencer.social_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-12 rounded-full overflow-hidden border-2 border-primary ring-4 ring-primary/10 hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <img alt={influencer.name} className="w-full h-full object-cover" src={influencer.avatar_url} />
                                </a>
                                <div>
                                    <h2 className="text-[#181411] text-xl font-extrabold flex items-center gap-2">
                                        {influencer.name} <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">Influencer Choice</span>
                                    </h2>
                                    <p className="text-sm font-medium text-[#181411]/60">{influencer.bio}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="icon" icon="chevron_left" size="icon" onClick={() => scrollTips('left')} />
                                <Button variant="icon" icon="chevron_right" size="icon" onClick={() => scrollTips('right')} />
                            </div>
                        </div>

                        <div
                            ref={tipsContainerRef}
                            className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth"
                        >
                            {influencerRecipes.map((item) => (
                                <RecipeCard
                                    key={item.id}
                                    variant="compact"
                                    id={item.recipes.id}
                                    slug={item.recipes.slug}
                                    title={item.recipes.title}
                                    category={item.subtitle}
                                    image={item.recipes.image_url}
                                    tags={[item.tag]}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Recipes Section */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[#181411] text-2xl font-extrabold flex items-center gap-3">
                            Receitas Populares <span className="material-symbols-outlined text-primary fill-1">local_fire_department</span>
                        </h2>
                        <Link to="/recipes" className="text-primary font-bold text-sm hover:underline">Ver todas</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />)
                        ) : popularRecipes.length > 0 ? (
                            popularRecipes.slice(0, 4).map(recipe => (
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
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-4">Nenhuma receita popular encontrada.</p>
                        )}
                    </div>
                </div>

                {/* Trends Section */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[#181411] text-2xl font-extrabold flex items-center gap-3">
                            Tendências da Semana <span className="material-symbols-outlined text-primary fill-1">bolt</span>
                        </h2>
                        <Link to="/recipes" className="text-primary font-bold text-sm hover:underline">Ver todas</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            [1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl" />)
                        ) : trendingRecipes.length > 0 ? (
                            trendingRecipes.map(recipe => (
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
                            ))
                        ) : (
                            <p className="text-gray-500">Nenhuma tendência encontrada.</p>
                        )}
                    </div>
                </div>

                {/* Newsletter */}
                <Newsletter />
            </div>
        </MainLayout>
    );
};
