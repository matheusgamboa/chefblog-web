import { Button } from './Button';
import { Link } from 'react-router-dom';

export const RecipeCard = ({
    variant = 'grid',
    id = 1,
    slug,
    title,
    category,
    image,
    time,
    difficulty,
    calories,
    rating,
    author,
    tags = []
}) => {
    // Hero Variant (Big Card)
    if (variant === 'hero') {
        return (
            <Link to={`/recipe/${slug || id}`} className="block h-full w-full cursor-pointer">
                <div
                    className="group relative overflow-hidden rounded-lg bg-cover bg-center shadow-2xl transition-all duration-500 hover:shadow-primary/20 h-[500px] md:h-full w-full"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%), url("${image}")` }}
                >
                    <div className="absolute top-6 left-8 flex gap-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="bg-primary text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                        <h3 className="text-white text-3xl lg:text-4xl font-black mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-300">
                            {title}
                        </h3>
                        <div className="flex items-center gap-6 text-white/90">
                            {time && (
                                <div className="flex items-center gap-1.5 font-semibold">
                                    <span className="material-symbols-outlined text-primary">schedule</span> {time}
                                </div>
                            )}
                            {difficulty && (
                                <div className="flex items-center gap-1.5 font-semibold">
                                    <span className="material-symbols-outlined text-primary">restaurant</span> {difficulty}
                                </div>
                            )}
                            {calories && (
                                <div className="flex items-center gap-1.5 font-semibold">
                                    <span className="material-symbols-outlined text-primary">local_fire_department</span> {calories}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Horizontal Card (Destaques menores)
    if (variant === 'horizontal') {
        return (
            <Link to={`/recipe/${slug || id}`} className="block flex-1 min-h-[250px] cursor-pointer">
                <div
                    className="h-full group relative overflow-hidden rounded-lg bg-cover bg-center shadow-xl transition-all duration-500"
                    style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%), url("${image}")` }}
                >
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <h4 className="text-white text-xl font-bold group-hover:translate-y-[-4px] transition-transform">{title}</h4>
                        <p className="text-white/80 text-sm font-medium">{category}</p>
                    </div>
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur text-primary rounded-full size-8 flex items-center justify-center cursor-pointer hover:bg-white transition-colors">
                        <span className="material-symbols-outlined text-lg font-bold">favorite</span>
                    </span>
                </div>
            </Link>
        );
    }

    // Compact Card (Carrossel)
    if (variant === 'compact') {
        return (
            <div className="flex-none w-48 group cursor-pointer">
                <Link to={`/recipe/${slug || id}`} className="block">
                    <div className="relative aspect-square overflow-hidden rounded-[12px] mb-3 shadow-md">
                        <img
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            src={image}
                            alt={title}
                        />
                        <div className="absolute bottom-2 left-2 right-2">
                            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[9px] font-extrabold text-primary flex items-center gap-1 shadow-sm">
                                <span className="material-symbols-outlined text-[12px] fill-1">verified</span>
                                {tags[0] || 'APROVADO'}
                            </div>
                        </div>
                    </div>
                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">{title}</h4>
                    <p className="text-[10px] font-bold text-primary/60 mt-1 uppercase tracking-wider">{category}</p>
                </Link>
            </div>
        );
    }

    // Standard Grid Card
    return (
        <Link to={`/recipe/${slug || id}`} className="block">
            <div className="flex flex-col gap-4 group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        src={image}
                        alt={title}
                    />
                    {tags[0] && (
                        <div className="absolute top-3 left-5 bg-white/90 px-2 py-1 rounded text-[10px] font-black uppercase text-[#181411]">
                            {tags[0]}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">{title}</h3>
                    <div className="flex items-center gap-3 mt-2 text-sm font-medium text-primary/60">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> {time}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">star</span> {rating}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
