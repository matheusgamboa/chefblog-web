import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const AuthModal = () => {
    const { isLoginModalOpen, closeLoginModal, signIn, signUp } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Reset state when modal opens
    useEffect(() => {
        if (isLoginModalOpen) {
            setError('');
            setMessage('');
            setEmail('');
            setPassword('');
            setIsLogin(true);
        }
    }, [isLoginModalOpen]);

    if (!isLoginModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
                closeLoginModal();
            } else {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setMessage('Cadastro realizado! Verifique seu email para confirmar.');
                // Fechar modal automaticamente após 2 segundos no cadastro
                setTimeout(() => {
                    closeLoginModal();
                }, 2000);
            }
        } catch (err) {
            // Translate common Supabase errors if needed
            let errorMessage = err.message;
            if (errorMessage === 'Invalid login credentials') errorMessage = 'Email ou senha incorretos.';
            if (errorMessage === 'User already registered') errorMessage = 'Usuário já cadastrado.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeLoginModal}
            ></div>

            {/* Modal Content */}
            <div className="bg-white rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-20"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="p-8 md:p-10 relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-[#181411] mb-2 font-display">
                            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                        </h2>
                        <p className="text-[#181411]/60 text-sm">
                            {isLogin ? 'Entre para curtir, salvar e gamificar suas receitas.' : 'Junte-se à comunidade CookMaster.'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2">
                            <span className="material-symbols-outlined text-lg mt-0.5">error</span>
                            <span className="flex-1">{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2">
                            <span className="material-symbols-outlined text-lg mt-0.5">check_circle</span>
                            <span className="flex-1">{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-[#181411]/70 mb-1.5 ml-1 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-[#181411]"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-[#181411]/70 mb-1.5 ml-1 uppercase tracking-wider">Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium text-[#181411]"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 text-base justify-center mt-2 shadow-lg shadow-primary/20"
                            icon={loading ? 'progress_activity' : (isLogin ? 'login' : 'person_add')}
                        >
                            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm font-bold text-primary hover:text-primary-dark transition-colors py-2 px-4 rounded-lg hover:bg-primary/5"
                        >
                            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já possui conta? Entre'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
