"use client";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      width="60mm"
      height="60mm"
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
    >
      <g id="svgGroup" strokeLinecap="round" fillRule="evenodd" fontSize="9pt" fill="none" style={{ stroke: '#000', strokeWidth: '0.25mm' }}>
        <path d="M 55 30 L 49.643 39.279 L 20.517 25.521 L 47.857 17.628 L 55 30 Z" id="chain" vectorEffect="non-scaling-stroke" fill="#1A1A1A" stroke="#1A1A1A"/>
        <path d="M 42.5 51.651 L 55 30 L 42.5 8.349" id="links" vectorEffect="non-scaling-stroke" stroke="#6B111C"/>
        <path d="M 47.5 51.651 L 60 30 L 47.5 8.349" id="links_outer" vectorEffect="non-scaling-stroke" stroke="#1A1A1A"/>
        <path d="M 5 30 47.857 17.628" id="line1" vectorEffect="non-scaling-stroke" stroke="#6B111C"/>
        <path d="M 49.643 39.279 10.357 20.721" id="line2" vectorEffect="non-scaling-stroke" stroke="#1A1A1A"/>
        <path d="M 30.176 22.932 L 27.588 32.592 L 17.929 35.18 L 10.858 28.109 L 13.446 18.449 L 23.105 15.861 L 30.176 22.932 Z" id="smallHex" vectorEffect="non-scaling-stroke" fill="#6B111C" stroke="#1A1A1A"/>
      </g>
    </svg>
  );
}