/** The Anika Designers circular logo mark. Decorative by default (brand name is always shown beside it). */
export default function Logo({ size = 48, className = '', alt = '' }) {
  return (
    <picture className={`logo-mark ${className}`}>
      <source type="image/webp" srcSet="/assets/logo-96.webp 96w, /assets/logo-128.webp 128w" sizes={`${size}px`} />
      <img src="/assets/logo-96.png" srcSet="/assets/logo-96.png 96w, /assets/logo-128.png 128w" sizes={`${size}px`} width={size} height={size} alt={alt} decoding="async" />
    </picture>
  );
}
