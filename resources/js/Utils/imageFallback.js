/**
 * Generates an SVG data URI placeholder when a game image fails to load or is null.
 */
export const getFallbackImage = (title = 'PlayScore Game') => {
    const cleanTitle = (title || 'PlayScore Game')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    const displayTitle = cleanTitle.length > 25 ? cleanTitle.slice(0, 22) + '...' : cleanTitle;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
  <rect width="100%" height="100%" fill="#131916"/>
  <rect width="100%" height="100%" fill="url(#g)" opacity="0.6"/>
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#22C55E" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0B0F0D" stop-opacity="0.95"/>
    </radialGradient>
  </defs>
  <g transform="translate(300, 340)" text-anchor="middle">
    <rect x="-40" y="-40" width="80" height="80" rx="16" fill="#1F2923" stroke="#22C55E" stroke-width="2"/>
    <path d="M-15,-5 L15,-5 M0,-20 L0,10" stroke="#22C55E" stroke-width="4" stroke-linecap="round"/>
    <text x="0" y="85" fill="#F5F7F5" font-family="system-ui, sans-serif" font-size="26" font-weight="bold">${displayTitle}</text>
    <text x="0" y="118" fill="#22C55E" font-family="system-ui, sans-serif" font-size="14" font-weight="600" letter-spacing="2">PLAYSCORE</text>
  </g>
</svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
