export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Lotus/Serenity Symbol */}
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
          <defs>
            <linearGradient id="serenityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Outer petals */}
          <path
            d="M20 8 C12 8, 8 12, 8 20 C8 28, 12 32, 20 32 C28 32, 32 28, 32 20 C32 12, 28 8, 20 8 Z"
            fill="url(#serenityGradient)"
            opacity="0.3"
          />
          {/* Middle petals */}
          <path
            d="M20 12 C15 12, 12 15, 12 20 C12 25, 15 28, 20 28 C25 28, 28 25, 28 20 C28 15, 25 12, 20 12 Z"
            fill="url(#serenityGradient)"
            opacity="0.6"
          />
          {/* Inner circle */}
          <circle cx="20" cy="20" r="6" fill="url(#serenityGradient)" />
          {/* Center dot */}
          <circle cx="20" cy="20" r="2" fill="white" opacity="0.9" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight text-foreground">Inner Serenity</span>
        <span className="text-sm tracking-wider text-primary font-medium">COUNSELLING CENTER</span>
      </div>
    </div>
  )
}
