// Hand-drawn SVG embroidery ornaments (gold zari line-work + pearl dots).

export function Paisley({ className = '', ...rest }) {
  return (
    <svg className={`ornament ornament--paisley ${className}`} viewBox="0 0 100 100" aria-hidden="true" focusable="false" {...rest}>
      <path className="ornament__line" pathLength="1" d="M52 8c26 2 42 30 30 58-9 21-36 30-54 20C12 77 10 56 22 46c10-8 24-4 26 7 2 9-6 15-13 11" />
      <path className="ornament__stitch" d="M52 20c17 3 28 22 20 41-7 15-25 21-38 14" />
      <circle className="ornament__pearl" cx="35" cy="64" r="3" />
      <circle className="ornament__pearl" cx="70" cy="30" r="2.2" />
      <circle className="ornament__pearl" cx="78" cy="48" r="2.2" />
      <circle className="ornament__pearl" cx="72" cy="66" r="2.2" />
      <circle className="ornament__pearl" cx="58" cy="80" r="2.2" />
    </svg>
  );
}

export function Floral({ className = '', ...rest }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg className={`ornament ornament--floral ${className}`} viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" {...rest}>
      {petals.map((a) => (
        <path key={a} className="ornament__line" pathLength="1" transform={`rotate(${a})`} d="M0-8C7-18 7-32 0-42-7-32-7-18 0-8Z" />
      ))}
      {petals.map((a) => (
        <circle key={`p${a}`} className="ornament__pearl" transform={`rotate(${a + 22.5})`} cx="0" cy="-26" r="2.4" />
      ))}
      <circle className="ornament__bead" r="5" />
    </svg>
  );
}
