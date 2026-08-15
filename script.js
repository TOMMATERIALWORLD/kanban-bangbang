const STORAGE_KEY='kanban-bangbang-selected-kit';
const toast=document.getElementById('cartToast');

const PRODUCT_CATALOG=[
  {name:'コンパクト',size:'900 × 1600 mm',short:'900×1600',price:'¥15,800',frameW:'1600',frameH:'900',ratioClass:'catalog-compact'},
  {name:'スタンダード',size:'1800 × 2800 mm',short:'1800×2800',price:'¥26,800',frameW:'2800',frameH:'1800',ratioClass:'catalog-standard'},
  {name:'ラージ',size:'1800 × 5800 mm',short:'1800×5800',price:'¥47,800',frameW:'5800',frameH:'1800',ratioClass:'catalog-large'}
];

function applyProductCatalog(){
  const style=document.createElement('style');
  style.textContent=`
    .catalog-price{display:flex;align-items:baseline;gap:10px;margin:18px 0 8px}
    .catalog-price strong{font-size:28px;letter-spacing:-.04em}
    .catalog-price span{font-size:10px;color:#777}
    .catalog-price-note{text-align:center;margin:20px 0 0;font-size:11px;color:#777}
    .frame-illust.catalog-compact{width:178px;height:100px}
    .frame-illust.catalog-standard{width:196px;height:126px}
    .frame-illust.catalog-large{width:232px;height:72px}
    @media(max-width:600px){.catalog-price strong{font-size:25px}.frame-illust.catalog-large{width:210px;height:65px}}
  `;
  document.head.appendChild(style);

  const cards=[...document.querySelectorAll('.product-card')];
  cards.slice(0,3).forEach((card,index)=>{
    const item=PRODUCT_CATALOG[index];
    if(!item)return;

    const dim=card.querySelector('.dim');
    if(dim)dim.textContent=item.size;

    const frame=card.querySelector('.frame-illust');
    if(frame){
      frame.classList.remove('frame-s','frame-m','frame-l','catalog-compact','catalog-standard','catalog-large');
      frame.classList.add(item.ratioClass);
      const horizontal=frame.querySelector('span');
      const vertical=frame.querySelector('i');
      if(horizontal)horizontal.textContent=item.frameW;
      if(vertical)vertical.textContent=item.frameH;
    }

    let price=card.querySelector('.catalog-price');
    if(!price){
      price=document.createElement('p');
      price.className='catalog-price';
      const copy=card.querySelector('.product-copy');
      if(copy)card.insertBefore(price,copy);
    }
    price.innerHTML=`<strong>${item.price}</strong><span>税別・送料別途</span>`;

    const btn=card.querySelector('.add-cart');
    if(btn)btn.dataset.name=`${item.name} ${item.short} mm / ${item.price}（税別・送料別途）`;
  });

  const grid=document.querySelector('.product-grid');
  if(grid && !document.querySelector('.catalog-price-note')){
    const note=document.createElement('p');
    note.className='catalog-price-note';
    note.textContent='※表示価格は消費税別です。送料は別途申し受けます。';
    grid.insertAdjacentElement('afterend',note);
  }

  const saved=localStorage.getItem(STORAGE_KEY);
  if(saved && !PRODUCT_CATALOG.some(item=>saved.includes(item.short))){
    localStorage.removeItem(STORAGE_KEY);
  }
}

function showToast(message){
  if(!toast)return;
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(window.__bangbangToastTimer);
  window.__bangbangToastTimer=setTimeout(()=>toast.classList.remove('show'),1800);
}

function buildMailto(kit){
  const subject='看板のバンバン キット相談';
  const body=[
    '看板のバンバンについて相談します。',
    '',
    `希望キット：${kit||'未選択'}`,
    '設置場所：',
    'おおよその設置寸法：W　mm × H　mm',
    'バナー印刷：希望する / 希望しない / 相談したい',
    '',
    'その他：'
  ].join('\n');
  return `mailto:info@materialworld.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function ensureSelectionBar(){
  let bar=document.getElementById('selectionBar');
  if(bar)return bar;
  bar=document.createElement('div');
  bar.id='selectionBar';
  bar.className='selection-bar';
  bar.innerHTML=`
    <div class="selection-bar-inner">
      <div><small>SELECTED KIT</small><strong id="selectedKitName"></strong></div>
      <div class="selection-actions">
        <button type="button" id="clearSelection">選び直す</button>
        <a id="selectedKitContact" href="#contact">この内容で相談する →</a>
      </div>
    </div>`;
  document.body.appendChild(bar);
  bar.querySelector('#clearSelection').addEventListener('click',()=>{
    localStorage.removeItem(STORAGE_KEY);
    bar.classList.remove('show');
    document.querySelectorAll('.product-card').forEach(card=>card.classList.remove('selected'));
    showToast('選択を解除しました');
  });
  return bar;
}

function setSelectedKit(name,scrollToContact=false){
  localStorage.setItem(STORAGE_KEY,name);
  const bar=ensureSelectionBar();
  bar.querySelector('#selectedKitName').textContent=name;
  bar.querySelector('#selectedKitContact').href=buildMailto(name);
  bar.classList.add('show');
  document.querySelectorAll('.product-card').forEach(card=>{
    const btn=card.querySelector('.add-cart');
    card.classList.toggle('selected',btn&&btn.dataset.name===name);
  });
  showToast(`${name} を選択しました`);
  if(scrollToContact){
    setTimeout(()=>document.querySelector('#contact')?.scrollIntoView({behavior:'smooth',block:'center'}),450);
  }
}

function appendBannerDesignFaq(){
  const faqWrap=document.querySelector('#faq .faq-wrap');
  if(!faqWrap || faqWrap.querySelector('[data-faq="banner-design"]'))return;
  const details=document.createElement('details');
  details.dataset.faq='banner-design';
  details.innerHTML='<summary>バナーデザインも頼めますか？</summary><p>バナーデザインの製作からご相談にのることも、もちろん可能です。写真、イラスト、文字、色など、ご希望に応じて別途対応させていただきます。</p>';
  faqWrap.appendChild(details);
}

function applyHighQualityImages(){
  const style=document.createElement('style');
  style.textContent=`
    .hero-media>img,.editorial-gallery img{image-rendering:auto;-ms-interpolation-mode:bicubic}
    .editorial-gallery figure.g-tall{grid-row:span 2}
    .company-info{margin-top:16px;padding-top:14px;border-top:1px solid #e7e7e7;line-height:1.85!important}
    .company-info strong{color:#111;font-size:12px}
    .company-info a{color:#111;text-decoration:none;font-weight:800}
    @media(max-width:600px){.editorial-gallery figure.g-tall{grid-row:span 1}}
  `;
  document.head.appendChild(style);

  const hero=document.querySelector('.hero-media>img');
  if(hero){
    hero.src='assets/hero.jpg';
    hero.alt='看板のバンバン 黄色い保育園バナーの施工例';
    hero.width=1400;
    hero.height=1050;
    hero.decoding='async';
    hero.fetchPriority='high';
  }

  const gallery=document.querySelector('.editorial-gallery');
  if(gallery){
    gallery.innerHTML=`
      <figure class="g-wide"><img src="assets/case-01.jpg" width="1000" height="750" loading="lazy" decoding="async" alt="青い保育園バナーの施工例"><figcaption>保育園 / 自立ボード</figcaption></figure>
      <figure><img src="assets/case-02.jpg" width="1000" height="750" loading="lazy" decoding="async" alt="ピンクの保育園バナーの施工例"><figcaption>保育園 / 塀</figcaption></figure>
      <figure class="gallery-text"><span>REAL INSTALL</span><b>実際の設置場所で、<br>サイズ感まで伝わる。</b></figure>
      <figure class="g-tall"><img src="assets/case-06.jpg" width="1000" height="1333" loading="lazy" decoding="async" alt="KUJIRAI 中古重機告知の黒い大型バナー"><figcaption>KUJIRAI / 中古重機告知</figcaption></figure>
      <figure class="g-tall"><img src="assets/case-07.jpg" width="1000" height="1333" loading="lazy" decoding="async" alt="企業グループの大型バナー施工例"><figcaption>企業サイン / 大型バナー</figcaption></figure>
      <figure class="g-wide"><img src="assets/case-08.jpg" width="1000" height="750" loading="lazy" decoding="async" alt="店舗案内の大型横長バナー施工例"><figcaption>店舗案内 / 大型横長バナー</figcaption></figure>
      <figure class="gallery-text g-wide"><span>CHANGE THE BANNER</span><b>フレームはそのまま。<br>告知だけ、すぐ更新。</b></figure>`;
  }
}

function appendCompanyInfo(){
  const footerGrid=document.querySelector('.footer-grid');
  if(!footerGrid || footerGrid.querySelector('.company-info'))return;
  const info=document.createElement('p');
  info.className='company-info';
  info.innerHTML='<strong>株式会社クジライ</strong><br>〒304-0067 茨城県下妻市下妻乙1212-1<br><a href="tel:0296432622">0296-43-2622</a>';
  const target=footerGrid.children[1] || footerGrid;
  target.appendChild(info);
}

applyProductCatalog();
appendBannerDesignFaq();
applyHighQualityImages();
appendCompanyInfo();

document.querySelectorAll('.add-cart').forEach(btn=>{
  btn.addEventListener('click',()=>setSelectedKit(btn.dataset.name));
});

const savedKit=localStorage.getItem(STORAGE_KEY);
if(savedKit)setSelectedKit(savedKit);

// Contact links automatically include the selected kit when one is chosen.
document.querySelectorAll('a[href^="mailto:info@materialworld.jp"]').forEach(link=>{
  link.addEventListener('click',()=>{
    const kit=localStorage.getItem(STORAGE_KEY);
    if(kit)link.href=buildMailto(kit);
  });
});