/**
 * Suluboya filtreleri. Tek bir görünmez SVG'de tanımlanır, sayfadaki bütün çizimler url(#…) ile kullanır.
 * Zincir (her biri suluboyanın bir davranışı):
 *   1 bozma        : düşük frekanslı gürültüyle şeklin kenarını dalgalandırır (pigment düzensiz yayılır)
 *   2 kenar        : şeklin alfası − bulanık alfası = iç kenar bandı; koyu tonda çizilir (pigment kenarda birikir)
 *   3 granülasyon  : yüksek frekanslı gürültü alfayı deler (pigment kâğıdın tanesine oturur)
 *   4 yıkama lekesi: çok düşük frekanslı gürültü alfayı bölgesel açar-koyultur (backrun, eşit olmayan su)
 */
export function Filters() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <filter id="wc-leke" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="3" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="46" xChannelSelector="R" yChannelSelector="G" result="d0" />
          <feGaussianBlur in="d0" stdDeviation="0.9" result="d" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="da" />
          <feGaussianBlur in="da" stdDeviation="9" result="db" />
          <feComposite in="da" in2="db" operator="arithmetic" k2="1.9" k3="-1.9" result="rimA" />
          <feColorMatrix in="d" type="matrix" values="0.62 0 0 0 0  0 0.62 0 0 0  0 0 0.62 0 0  0 0 0 1 0" result="dark" />
          <feComposite in="dark" in2="rimA" operator="in" result="rim" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.1 0 0 0 1.12" result="ga" />
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves="3" seed="21" result="p" />
          <feColorMatrix in="p" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.55" result="pa" />
          <feComposite in="d" in2="ga" operator="in" result="d1" />
          <feComposite in="d1" in2="pa" operator="in" result="d2" />
          <feMerge>
            <feMergeNode in="d2" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        {/* sahne: 460 birimlik manzara panoları */}
        <filter id="wc-sahne" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="9" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="16" xChannelSelector="R" yChannelSelector="G" result="d0" />
          <feGaussianBlur in="d0" stdDeviation="0.5" result="d" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="da" />
          <feGaussianBlur in="da" stdDeviation="3.2" result="db" />
          <feComposite in="da" in2="db" operator="arithmetic" k2="1.9" k3="-1.9" result="rimA" />
          <feColorMatrix in="d" type="matrix" values="0.62 0 0 0 0  0 0.62 0 0 0  0 0 0.62 0 0  0 0 0 1 0" result="dark" />
          <feComposite in="dark" in2="rimA" operator="in" result="rim" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.1 0 0 0 1.12" result="ga" />
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="21" result="p" />
          <feColorMatrix in="p" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.6 0 0 0 1.55" result="pa" />
          <feComposite in="d" in2="ga" operator="in" result="d1" />
          <feComposite in="d1" in2="pa" operator="in" result="d2" />
          <feMerge>
            <feMergeNode in="d2" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        {/* orta boy: karakter ve sahne illüstrasyonları */}
        <filter id="wc-orta" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="5" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="da" />
          <feGaussianBlur in="da" stdDeviation="2.6" result="db" />
          <feComposite in="da" in2="db" operator="arithmetic" k2="2" k3="-2" result="rimA" />
          <feColorMatrix in="d" type="matrix" values="0.6 0 0 0 0  0 0.6 0 0 0  0 0 0.6 0 0  0 0 0 1 0" result="dark" />
          <feComposite in="dark" in2="rimA" operator="in" result="rim" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.9 0 0 0 1.1" result="ga" />
          <feComposite in="d" in2="ga" operator="in" result="d1" />
          <feMerge>
            <feMergeNode in="d1" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        {/* küçük boy: ikonlar (48 birimlik ızgara) */}
        <filter id="wc-ikon" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="4" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="da" />
          <feGaussianBlur in="da" stdDeviation="1.2" result="db" />
          <feComposite in="da" in2="db" operator="arithmetic" k2="2.2" k3="-2.2" result="rimA" />
          <feColorMatrix in="d" type="matrix" values="0.6 0 0 0 0  0 0.6 0 0 0  0 0 0.6 0 0  0 0 0 1 0" result="dark" />
          <feComposite in="dark" in2="rimA" operator="in" result="rim" />
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="8" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.9 0 0 0 1.1" result="ga" />
          <feComposite in="d" in2="ga" operator="in" result="d1" />
          <feMerge>
            <feMergeNode in="d1" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        {/* fırça darbesi: yatay kıl izleri (uçlarda seyrelir) + ıslak kenar */}
        <filter id="wc-firca" x="-10%" y="-40%" width="120%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="5" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.55" numOctaves="2" seed="17" result="s" />
          <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.4 0 0 0 -0.15" result="sa" />
          <feComposite in="d" in2="sa" operator="in" result="d1" />
          <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="da" />
          <feGaussianBlur in="da" stdDeviation="2.2" result="db" />
          <feComposite in="da" in2="db" operator="arithmetic" k2="1.8" k3="-1.8" result="rimA" />
          <feColorMatrix in="d" type="matrix" values="0.6 0 0 0 0  0 0.6 0 0 0  0 0 0.6 0 0  0 0 0 1 0" result="dark" />
          <feComposite in="dark" in2="rimA" operator="in" result="rim" />
          <feMerge>
            <feMergeNode in="d1" />
            <feMergeNode in="rim" />
          </feMerge>
        </filter>
        {/* kuru fırça: aynısı, daha çok kıl boşluğu */}
        <filter id="wc-firca-kuru" x="-10%" y="-40%" width="120%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="11" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="6" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.003 0.5" numOctaves="3" seed="29" result="s" />
          <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5.2 0 0 0 -1.5" result="sa" />
          <feComposite in="d" in2="sa" operator="in" />
        </filter>
        {/* sızıntı: kenarı dalgalı, hafif bulanık (reveal maskesi) */}
        <filter id="wc-sizinti" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="4" seed="7" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="90" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="5" />
        </filter>
        <filter id="wc-maske-kenar" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="4" seed="13" result="k" />
          <feDisplacementMap in="SourceGraphic" in2="k" scale="34" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.4" />
        </filter>
      </defs>
    </svg>
  )
}
