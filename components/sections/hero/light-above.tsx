/**
 * Soft "light from above" wash (adapted from the agency template) recoloured
 * with the brand flame palette. Purely decorative.
 */
export function LightAbove({ className }: { className?: string }) {
  return (
    <svg
      width="1424"
      height="651"
      viewBox="0 0 1424 651"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g filter="url(#hero-la-f0)" style={{ mixBlendMode: "plus-lighter" }}>
        <path d="M611.5 51L495 -188H959L849.5 51H611.5Z" fill="#e4183c" fillOpacity="0.18" />
      </g>
      <g filter="url(#hero-la-f1)" style={{ mixBlendMode: "plus-lighter" }}>
        <path d="M611.5 219L495 -188H959L849.5 219H611.5Z" fill="#f7931e" fillOpacity="0.85" />
      </g>
      <g filter="url(#hero-la-f2)" style={{ mixBlendMode: "plus-lighter" }}>
        <path d="M656.49 43L568 -219H829L768.219 43H656.49Z" fill="#ffd200" fillOpacity="0.8" />
      </g>
      <defs>
        <filter
          id="hero-la-f0"
          x="-105"
          y="-788"
          width="1664"
          height="1439"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="300" />
        </filter>
        <filter
          id="hero-la-f1"
          x="95"
          y="-588"
          width="1264"
          height="1207"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="200" />
        </filter>
        <filter
          id="hero-la-f2"
          x="408"
          y="-379"
          width="581"
          height="582"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="80" />
        </filter>
      </defs>
    </svg>
  );
}
