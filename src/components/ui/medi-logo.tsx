
import Link from "next/link";

export default function MediLogo() {
  return (
    <Link href="/" className="brand" aria-label="MEDI home">
      <svg
        className="medi-logo"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="mediAnimatedGradient"
            x1="15"
            y1="15"
            x2="85"
            y2="85"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#31B6C5" />
            <stop offset="1" stopColor="#176B91" />
          </linearGradient>
        </defs>

        <style>
          {`
            .medi-draw {
              stroke-dasharray: 260;
              stroke-dashoffset: 260;
              animation: medi-draw-in 1.5s cubic-bezier(.65,0,.35,1) forwards;
            }

            .medi-accent {
              transform-box: fill-box;
              transform-origin: center;
              opacity: 0;
              animation: medi-dot-in .5s ease-out 1.35s forwards;
            }

            .medi-logo-word {
              opacity: 0;
              animation: medi-word-in .7s ease-out 1.05s forwards;
            }

            @keyframes medi-draw-in {
              to {
                stroke-dashoffset: 0;
              }
            }

            @keyframes medi-dot-in {
              0% {
                opacity: 0;
                transform: scale(0);
              }
              70% {
                opacity: 1;
                transform: scale(1.3);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }

            @keyframes medi-word-in {
              from {
                opacity: 0;
                transform: translateY(7px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .medi-draw {
                animation: none;
                stroke-dashoffset: 0;
              }
              .medi-accent,
              .medi-logo-word {
                animation: none;
                opacity: 1;
                transform: none;
              }
            }
              .medi-draw {
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  animation: medi-draw-loop 9s ease-in-out infinite;
}

.medi-accent {
  transform-box: fill-box;
  transform-origin: center;
  opacity: 0;
  animation: medi-dot-loop 9s ease-in-out infinite;
}

.medi-logo-word {
  opacity: 0;
  animation: medi-word-loop 9s ease-in-out infinite;
}

@keyframes medi-draw-loop {
  0% { stroke-dashoffset: 260; }
  16% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; }
}

@keyframes medi-dot-loop {
  0%, 15% {
    opacity: 0;
    transform: scale(0);
  }
  22% {
    opacity: 1;
    transform: scale(1.2);
  }
  28%, 100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes medi-word-loop {
  0%, 12% {
    opacity: 0;
    transform: translateY(7px);
  }
  22% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
          `}
        </style>

        <path
          className="medi-draw"
          d="M17 79V38C17 18 39 12 50 32C61 12 83 18 83 38V79"
          stroke="url(#mediAnimatedGradient)"
          strokeWidth="11"
          strokeLinecap="square"
          strokeLinejoin="round"
        />

        <path
          d="M50 32L57 43"
          stroke="#A9F1F0"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />

        <circle
          className="medi-accent"
          cx="83"
          cy="15"
          r="4.5"
          fill="#C7A77B"
        />
      </svg>

      <span className="brand-word medi-logo-word">
        MEDI<span>.</span>
      </span>
    </Link>
  );
}
