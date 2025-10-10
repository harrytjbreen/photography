import type { PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<{
  href: string;
  variant?: "primary" | "secondary";
  className?: string;
}>;

const Button = ({ href, variant = "primary", className = "", children }: ButtonProps) => {
  const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors focus:outline-none md:px-7 md:py-3.5 md:text-base";
  const variantClass =
    variant === "primary"
      ? "text-white shadow-lg backdrop-blur bg-white/10 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/60"
      : "border border-white/20 text-neutral-200/90 hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40";

  return (
    <a href={href} className={`${base} ${variantClass} ${className}`.trim()}>
      {children}
    </a>
  );
};

export default Button;
