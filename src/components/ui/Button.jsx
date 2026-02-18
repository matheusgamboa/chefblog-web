import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    icon,
    ...props
}) => {
    const baseStyles = "font-bold rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
        primary: "bg-primary text-white hover:bg-orange-600 shadow-lg shadow-primary/20",
        secondary: "bg-primary/10 text-primary hover:bg-primary/20",
        outline: "bg-white border border-primary/10 text-text-main hover:border-primary",
        ghost: "bg-transparent text-primary hover:bg-primary/5",
        icon: "bg-white border border-primary/10 text-text-main hover:bg-primary/10 size-11 p-0 rounded-full",
        black: "bg-[#181411] text-white hover:bg-black"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-10 py-4 text-lg",
        icon: "size-11" // Specific for icon variant
    };

    return (
        <button
            className={twMerge(
                baseStyles,
                variants[variant],
                variant === 'icon' ? sizes.icon : sizes[size],
                className
            )}
            {...props}
        >
            {children}
            {icon && <span className="material-symbols-outlined">{icon}</span>}
        </button>
    );
};
