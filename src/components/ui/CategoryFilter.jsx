import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const CategoryFilter = ({ onCategoryChange, activeCategory: controlledActiveCategory }) => {
    const [categories, setCategories] = useState([]);
    const [internalActiveCategory, setInternalActiveCategory] = useState("Populares");
    const navigate = useNavigate();

    const activeCategory = controlledActiveCategory || internalActiveCategory;

    useEffect(() => {
        getCategories();
    }, []);

    async function getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*');

            if (error) throw error;

            if (data) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error.message);
        }
    }

    const handleCategoryClick = (categoryName) => {
        if (onCategoryChange) {
            onCategoryChange(categoryName);
        } else {
            setInternalActiveCategory(categoryName);
            // Se estiver na home, redireciona para receitas com a categoria na URL
            const categoryParam = categoryName === 'Populares' ? '' : categoryName;
            navigate(`/recipes${categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ''}`);
        }
    };

    const displayCategories = [
        { name: 'Populares', icon: 'trending_up' },
        ...(categories.length > 0 ? categories.filter(c => c.name !== 'Populares') : [
            { name: 'Italiana', icon: 'local_pizza' },
            { name: 'Fitness', icon: 'fitness_center' },
            { name: 'Sobremesas', icon: 'cake' },
            { name: 'Vegetariana', icon: 'eco' }
        ])
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pt-4 pb-6 px-6 -mx-6 mb-6 lg:mx-0 lg:px-1 hide-scrollbar -mt-4 scroll-smooth">
            {displayCategories.map((category) => (
                <button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer
            ${activeCategory === category.name
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                            : 'bg-white text-[#181411]/60 hover:bg-white/80 hover:text-primary border border-primary/5'
                        }`}
                >
                    <span className="material-symbols-outlined">{category.icon}</span>
                    {category.name}
                </button>
            ))}
        </div>
    );
};
