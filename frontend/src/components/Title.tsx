import type { FC } from "react";
import Button from "./ui/Button";

interface Props {
  title: string;
  subtitle: string;
  description: string;
}

const Title: FC<Props> = ({ title, subtitle, description }) => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32 text-center">
      <h1 className="text-5xl md:text-6xl font-semibold mb-4 relative inline-block animate-fade-in-up [animation-delay:200ms]">
        <span className="absolute inset-0 text-white opacity-100 animate-fade-out [animation-delay:1200ms]">
          {title}
        </span>
        <span className="relative z-0 bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent opacity-0 animate-fade-in [animation-delay:1200ms]">
          {title}
        </span>
      </h1>

      <p className="text-lg md:text-2xl text-neutral-100 mb-3 animate-fade-in-up [animation-delay:400ms]">
        {subtitle}
      </p>

      <p className="text-base text-neutral-400 mb-8 animate-fade-in-up [animation-delay:500ms]">
        {description}
      </p>

      <div className="mt-8 flex justify-center gap-4 animate-fade-in-up [animation-delay:700ms]">
        <Button href="#gallery" variant="primary">
          View Gallery
        </Button>
        <Button href="#about" variant="secondary">
          About
        </Button>
      </div>
    </div>
  );
};

export default Title;
