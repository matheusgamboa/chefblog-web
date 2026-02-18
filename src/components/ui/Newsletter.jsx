import { Button } from './Button';

export const Newsletter = () => {
    return (
        <section className="mt-20 pb-20">
            <div className="bg-primary rounded-xl p-10 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-[200px]">restaurant</span>
                </div>
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-white text-4xl lg:text-5xl font-black leading-tight mb-6">Domine a cozinha e suba de nível.</h2>
                    <p className="text-white/90 text-lg mb-10 font-medium">Inscreva-se para receber desafios semanais, dicas de chefs profissionais e receitas exclusivas direto no seu e-mail.</p>
                    <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="flex-1 rounded-full h-14 px-6 border-none focus:ring-4 focus:ring-white/20 text-[#181411] font-medium placeholder:text-[#181411]/40"
                            placeholder="Seu melhor e-mail"
                            type="email"
                        />
                        <Button variant="black" size="lg" className="h-14">
                            Começar Jornada
                        </Button>
                    </form>
                </div>
            </div>
        </section>
    );
};
