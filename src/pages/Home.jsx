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
    const [loading, setLoading] = useState(true);
    const tipsContainerRef = useRef(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            setLoading(true);
            // Fetch Featured Recipes (is_featured = true)
            const { data: featured, error: featuredError } = await supabase
                .from('recipes')
                .select('*')
                .eq('is_featured', true)
                .limit(3);

            if (featured) {
                setFeaturedRecipes(featured);
            }

            // Fetch Trending Recipes (ordered by rating desc)
            const { data: trending, error: trendingError } = await supabase
                .from('recipes')
                .select('*')
                .order('rating', { ascending: false })
                .limit(4);

            if (trending) {
                setTrendingRecipes(trending);
            }

            // Fetch Popular Recipes (different from trending, ordered by total_reviews or rating)
            const { data: popular, error: popularError } = await supabase
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

                {/* Influencer Section - Static for MVP */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full overflow-hidden border-2 border-primary ring-4 ring-primary/10">
                                <img alt="Chef Virginia" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCwaOEvJhqMAVghjm5wcjQ_nwtLEDvzVsWdAyohCcTJmMtpN1mrfOX7Dd7-tVaDJDMNgr85MXfld5lMgUqmK1suGOnB8wF5n0yT-4bH-1njXTdKLIVWjz1Z4kGLk-yX4DoIg3tW_cxbBVcgzV7Yj9jl4YAr0O1752WIIDjWGrco5in9SJCt1FVt94tuhhrSQbI-pPQH6qzcpdFrcluWQrL72Ky6ugPTnJpYTJu0lLxmdE6tr23EsIWs7d5r9_LJxZiQ4uOfnyUPBAR" />
                            </div>
                            <div>
                                <h2 className="text-[#181411] text-xl font-extrabold flex items-center gap-2">
                                    Dicas da Virginia <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">Influencer Choice</span>
                                </h2>
                                <p className="text-sm font-medium text-[#181411]/60">Pratos que eu consumo no meu dia a dia</p>
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
                        <RecipeCard variant="compact" id={4} title="Suco Rosa Energizante" category="Consumo Diário" image="https://lh3.googleusercontent.com/aida-public/AB6AXuBjDtSRWok8Vcb25vRH-lQYGaCh6RZJ48VUikCi0gR2q3Y9UfdwEZzy4DHoc5YwM3bI_nGbpjduqNxqf9LhyJBIVUFljmIKXJ-d8ZF6_lBi-IMelOnK_cu7xVR5LbLf5s3U4pYZdwduAFC5OHe6htQjTncurusfIct9hcs-9bw1BXV1y9wcmYhnj2aNxgizGl4IADCL8cpi1cBFq11KjS1rDWTwjQ5wRhyCXiXVlME0pH4ojolocfzw9jvJCBwYjudz48duNkcilQQP" tags={['APROVADO']} />
                        <RecipeCard variant="compact" id={5} title="Bowl de Frutas" category="Pós Treino" image="https://lh3.googleusercontent.com/aida-public/AB6AXuAt-HjfADcIkPDrRfbHc8xizgsL_MGtMOBn1SfW1Nxxlwz7uuJF9FBqpQdf19yKdvDYFMM0t9i7TyouwJNJO_wXqzA7OBL9Yf0fO2yQWiAxp99on_bVr9U_QFncEyGdX_H8igGdlHbYumLXc_APPDRZYOSb4chJZqVw1OWmN4UIqAbCU3LMbiU-bFKIX44w00sm20dZLTdHgT_Wd2xR8pggpfTA75lJOBIXFOVqOKXJBhgZ9mZ2vaza2RNtOiy4a0afYLuMhnFDLDM4" tags={['DICA']} />
                        <RecipeCard variant="compact" id={6} title="Sopa Detox" category="Jantar Leve" image="https://lh3.googleusercontent.com/aida-public/AB6AXuAYAfGdgDOx8dks64ypCom89HaIqZR1UXZBtbmbCq0st-LuXTMiPdNWRMIxSGlE96rkAgb8maudeDhthMGuN3G4YNbQyi1ppBxm9a7LJYZigeSE81gpEOkHSh-qp_-We9l9SRPvXqTl0Qu_EVNKXwcxxcqbRHeB5GfsHudkZBUbNEqbFUzsJnEecD8siNO2hNAc4-walMuBDJY8R7FIY2s7fpsq1_T9_GYXqirZ94LOGsj5i_cA3bbIj4A3f_XozYcmElGCpa9SvA0E" tags={['LEVE']} />
                        <RecipeCard variant="compact" id={7} title="Salada Fit" category="Almoço Rápido" image="https://lh3.googleusercontent.com/aida-public/AB6AXuDffqGqTh7h1CknzG2SHcQTOSih-6RAroyUNNLe9rxSczoGFkKioxUmXRqCd9wlgR7RQT44vkZ6e19RTod5e81jtbFeznv6lNNOYPm2r5uAZ5r_1r7rijebVs0dPzHkHEn0GYLaK0E66RC19rsPc6a3OYdZqxIz7x0tAaMZH7xudxCQ3oSfG72Hc9CfLUzxeJvNT60jZc8VE4WhHsTGLfVBgQFgxvKwG0kXnF8Fj3FwEnrlCQGI44fffeWXiiTyafPkc3obzUkZZ4K5" tags={['FIT']} />
                        <RecipeCard variant="compact" id={8} title="Salmão Gergelim" category="Premium" image="https://lh3.googleusercontent.com/aida-public/AB6AXuBnoOh6B3NShAujBPFpO-VtbXXatnotLr4Ih6y4V1pbWO8eO_nFwlMx2sjg3ccPxq20zbgr7ul1jnvmVemqDGGm0jH8vww-pixNtP6x9kGq36wzNSUbMua2dH5ODpXZQi6YJZDRd7ejCHZWLrlGgrCsYXj-QzGfyA3TxgAI4XaZCNuimtAaMhjL1g1fnSO22WzMpe6JZlzXHYIiyL4M-Ixt-atT6iJ0RudsP4I5w-dS9QLGXbuLHgwbWnX8JD9eRF6nxmI6SGWSDGI_" tags={['TOP']} />
                    </div>
                </div>

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
                            [1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>)
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
                            <p className="text-gray-500 col-span-4">Carregando receitas populares...</p>
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
                            [1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-gray-200 animate-pulse rounded-2xl"></div>)
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
                            <p className="text-gray-500">Carregando tendências...</p>
                        )}
                    </div>
                </div>

                {/* Newsletter */}
                <Newsletter />
            </div>
        </MainLayout>
    );
};
