export default function Header() {
  return (
    <header>
      <div className="chinese-watermark" aria-hidden="true">
        <span>叶</span>
        <span>金</span>
        <span>年</span>
      </div>
      <div className="header-content">
        <h1>John Andre S. Yap</h1>
        <p className="tagline">Software Engineer &thinsp;&middot;&thinsp; Systems Architect</p>
        <div className="contact">
          <span>Cebu City, Philippines</span>
          <span className="dot">·</span>
          <a href="mailto:johnandresyap510@gmail.com">johnandresyap510@gmail.com</a>
          <span className="dot">·</span>
          <a href="tel:+639150443019">0915 044 3019</a>
          <span className="dot">·</span>
          <a href="https://github.com/apotato369550" target="_blank" rel="noopener">
            github.com/apotato369550
          </a>
        </div>
      </div>
    </header>
  );
}
