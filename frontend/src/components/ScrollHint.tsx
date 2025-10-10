const ScrollHint = () => {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-neutral-400/80 opacity-0 animate-fade-in-up [animation-delay:1200ms] motion-reduce:animate-none motion-reduce:opacity-100">
      <span className="block text-2xs tracking-extra-wide">Scroll</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="mx-auto mt-1 h-6 w-6 animate-bounce-600 motion-reduce:animate-none"
        aria-hidden
      >
        <path d="M12 16a1 1 0 0 1-.7-.29l-6-6a1 1 0 1 1 1.4-1.42L12 13.59l5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6A1 1 0 0 1 12 16Z" />
      </svg>
    </div>
  );
};

export default ScrollHint;
