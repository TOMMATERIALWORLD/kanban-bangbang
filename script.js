const STORAGE_KEY='kanban-bangbang-selected-kit';
const toast=document.getElementById('cartToast');

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