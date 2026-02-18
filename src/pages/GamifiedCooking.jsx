import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';

export const GamifiedCooking = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [steps, setSteps] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);

    useEffect(() => {
        fetchSteps();
    }, [slug]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound or notify
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const fetchSteps = async () => {
        try {
            // 1. Fetch Recipe by slug (inclui xp_reward)
            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .select('id, title, xp_reward')
                .eq('slug', slug)
                .single();

            if (recipeError) throw recipeError;
            setRecipe(recipeData);

            // 2. Fetch Steps using the numeric ID
            const { data, error } = await supabase
                .from('steps')
                .select('*')
                .eq('recipe_id', recipeData.id)
                .order('order_index', { ascending: true });

            if (error) throw error;
            setSteps(data || []);
        } catch (error) {
            console.error('Error fetching steps:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            resetTimer(currentStepIndex + 1);
        } else {
            completeRecipe();
        }
    };

    const completeRecipe = async () => {
        if (!user || !recipe) {
            setCompleted(true);
            return;
        }

        const rewardXP = recipe.xp_reward || 50;

        try {
            // 1. Registra receita como concluída
            await supabase.from('completed_recipes').upsert({
                user_id: user.id,
                recipe_id: recipe.id,
                xp_earned: rewardXP,
            }, { onConflict: 'user_id,recipe_id' });

            // 2. Incrementa XP no perfil do usuário
            const { data: profile } = await supabase
                .from('profiles')
                .select('xp, level')
                .eq('id', user.id)
                .single();

            const newXP = (profile?.xp || 0) + rewardXP;
            const newLevel = Math.floor(newXP / 75) + 1;

            await supabase.from('profiles').update({
                xp: newXP,
                level: newLevel,
            }).eq('id', user.id);

            setXpEarned(rewardXP);
        } catch (error) {
            console.error('Erro ao salvar conclusão:', error.message);
        }

        setCompleted(true);
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
            resetTimer(currentStepIndex - 1);
        }
    };

    const resetTimer = (index) => {
        const step = steps[index];
        if (step && step.timer_seconds) {
            setTimeLeft(step.timer_seconds);
            setIsActive(false);
        } else {
            setTimeLeft(null);
            setIsActive(false);
        }
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#221910] text-white">Carregando...</div>;

    if (completed) {
        return (
            <div className="min-h-screen bg-[#221910] text-white flex flex-col items-center justify-center p-6 text-center">
                <span className="material-symbols-outlined text-6xl text-primary mb-4 animate-bounce">emoji_events</span>
                <h1 className="text-4xl font-black mb-2">Parabéns!</h1>
                <p className="text-xl mb-4">Você concluiu esta receita!</p>
                <div className="bg-primary/20 border border-primary/30 rounded-2xl px-8 py-4 mb-8">
                    <p className="text-3xl font-black text-primary">+{xpEarned || recipe?.xp_reward || 50} XP</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => navigate(`/recipe/${slug}`)}>Ver Receita</Button>
                    <Button onClick={() => navigate('/profile')}>Meu Perfil</Button>
                </div>
            </div>
        );
    }

    if (steps.length === 0) return <div className="min-h-screen flex items-center justify-center bg-[#221910] text-white">Nenhum passo encontrado para esta receita.</div>;

    const currentStep = steps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-[#221910] text-white flex flex-col">
            {/* Header / Progress */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" icon="close" onClick={() => navigate(`/recipe/${slug}`)} className="text-white hover:bg-white/10" />
                    <span className="font-bold text-sm tracking-wider">PASSO {currentStepIndex + 1} DE {steps.length}</span>
                    <div className="w-10"></div> {/* Spacer for alignment */}
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
                {currentStep.image_url && (
                    <div className="w-full h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-2xl shadow-black/50">
                        <img src={currentStep.image_url} alt={currentStep.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <h2 className="text-3xl md:text-4xl font-black text-center mb-6">{currentStep.title}</h2>
                <p className="text-lg md:text-xl text-center text-white/80 leading-relaxed mb-8">{currentStep.description}</p>

                {/* Timer Section */}
                {timeLeft !== null && (
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 w-full max-w-sm mb-8 border border-white/10 text-center">
                        <span className="block text-sm font-bold uppercase tracking-widest text-primary mb-2">Timer</span>
                        <div className="text-5xl font-black tabular-nums mb-4">{formatTime(timeLeft)}</div>
                        <Button
                            onClick={toggleTimer}
                            variant={isActive ? 'outline' : 'primary'}
                            className="w-full"
                            icon={isActive ? 'pause' : 'play_arrow'}
                        >
                            {isActive ? 'Pausar' : 'Iniciar'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="p-6 bg-[#221910] border-t border-white/5">
                <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                    <Button
                        variant="secondary"
                        onClick={handlePrevious}
                        disabled={currentStepIndex === 0}
                        className="flex-1"
                    >
                        Anterior
                    </Button>
                    <Button
                        onClick={handleNext}
                        className="flex-[2] py-4 text-lg"
                        icon="arrow_forward"
                    >
                        {currentStepIndex === steps.length - 1 ? 'Concluir' : 'Próximo'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
