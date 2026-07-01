export const GkavaLogo = ({ className = "h-10 w-auto" }: { className?: string }) => (
  <svg viewBox="0 0 200 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <text 
      x="0" 
      y="60" 
      fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
      fontSize="65" 
    >
      <tspan fontWeight="900" fill="#1E1B4B" letterSpacing="-2">GK</tspan>
      <tspan fontWeight="700" fill="#4F46E5" letterSpacing="-1">ava</tspan>
    </text>
  </svg>
);
