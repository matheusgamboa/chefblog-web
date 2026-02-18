import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { RecipeCard } from '../components/ui/RecipeCard';
import { CategoryFilter } from '../components/ui/CategoryFilter';
import { supabase } from '../lib/supabase';

export const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const initialSearch = searchParams.get('search') || '';
    const initialCategory = searchParams.get('category') || 'Populares';

    const [search, setSearch] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllRecipes();
    }, []);

    // Sincroniza o estado local com a URL quando ela muda (vinda do header ou da Home)
    useEffect(() => {
        const queryParam = searchParams.get('search') || '';
        const categoryParam = searchParams.get('category') || 'Populares';

        if (queryParam !== search) setSearch(queryParam);
        if (categoryParam !== selectedCategory) setSelectedCategory(categoryParam);
    }, [searchParams]);

    // Atualiza a URL quando o usuário altera filtros localmente
    useEffect(() => {
        const params = {};
        if (search) params.search = search;
        if (selectedCategory && selectedCategory !== 'Populares') params.category = selectedCategory;

        setSearchParams(params, { replace: true });
    }, [search, selectedCategory]);

    useEffect(() => {
        let result = recipes;

        // Filtro por Categoria (buscando na coluna 'category' ou similar do banco)
        if (selectedCategory && selectedCategory !== 'Populares') {
            result = result.filter(r =>
                (r.category && r.category.toLowerCase() === selectedCategory.toLowerCase()) ||
                (r.tags && r.tags.includes(selectedCategory))
            );
        }

        // Filtro por Busca de Texto
        if (search.trim() !== '') {
            const query = search.toLowerCase();
            result = result.filter(r =>
                r.title.toLowerCase().includes(query) ||
                (r.description && r.description.toLowerCase().includes(query)) ||
                (r.difficulty && r.difficulty.toLowerCase().includes(query))
            );
        }

        setFilteredRecipes(result);
    }, [search, selectedCategory, recipes]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const fetchAllRecipes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('recipes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecipes(data || []);
        } catch (error) {
            console.error('Erro ao buscar receitas:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
                {/* Header */}
                <div className="mb-10">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="size-10 rounded-full bg-gray-100 hover:bg-gray-200 text-[#181411] flex items-center justify-center transition-all cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-xl font-bold">arrow_back</span>
                        </button>
                    </div>
                    <h1 className="text-[#181411] text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">Todas as Receitas</h1>
                    <p className="text-[#181411]/60 text-lg max-w-2xl mb-8">Encontre a receita perfeita para qualquer ocasião. Use os filtros para buscar por categoria, nome ou dificuldade.</p>

                    <CategoryFilter
                        activeCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                {/* Search Bar */}
                <div className="mb-10">
                    <div className="relative max-w-2xl">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
                            <span className="material-symbols-outlined text-2xl">search</span>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar receitas por nome, descrição ou dificuldade..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border-2 border-primary/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-base font-medium text-[#181411] shadow-sm placeholder:text-[#181411]/40"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        )}
                    </div>
                    {search && (
                        <p className="text-sm text-[#181411]/50 mt-3 ml-1">
                            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'receita encontrada' : 'receitas encontradas'} para "<span className="font-bold text-primary">{search}</span>"
                        </p>
                    )}
                </div>

                {/* Recipe Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                            <div key={n} className="h-72 bg-gray-100 animate-pulse rounded-2xl"></div>
                        ))}
                    </div>
                ) : filteredRecipes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredRecipes.map(recipe => (
                            <RecipeCard
                                key={recipe.id}
                                id={recipe.id}
                                slug={recipe.slug}
                                title={recipe.title}
                                image={recipe.image_url}
                                time={`${recipe.time_minutes} min`}
                                rating={recipe.rating}
                                tags={[recipe.difficulty]}
                                calories={recipe.calories ? `${recipe.calories} kcal` : undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">search_off</span>
                        <h3 className="text-xl font-bold text-[#181411] mb-2">Nenhuma receita encontrada</h3>
                        <p className="text-[#181411]/60 max-w-md">Tente buscar por outro termo ou explore nossas categorias.</p>
                        {search && (
                            <button onClick={() => setSearch('')} className="mt-4 text-primary font-bold text-sm hover:underline cursor-pointer">
                                Limpar busca
                            </button>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
