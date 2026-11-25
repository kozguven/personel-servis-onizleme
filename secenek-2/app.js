(function(){
const $=(s,k)=>(k||document).querySelector(s),$$=(s,k)=>[...(k||document).querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const S=document.body.dataset.sayfa,Q=new URLSearchParams(location.search),now=D.dk(D.SIMDI);
const azHareket=matchMedia('(prefers-reduced-motion: reduce)').matches,mobil=()=>innerWidth<=820;
const hatB=id=>D.hatlar.find(h=>h.id===id),pu=h=>D.puantaj.filter(p=>p.hat===h),tamam=p=>p.durum==='islendi'||p.durum==='gec',islenen=h=>pu(h).filter(tamam).length;
const roz=h=>`<span class="hat${h.erisim?'':' kapali'}">${h.id}</span>`;
const durum=p=>`<span class="d ${p.durum}">${D.durumAd[p.durum]}${p.gerceklesen?' '+p.gerceklesen:''}</span>`;
const ara=(h,q)=>!q||(h.id+' '+h.ad+' '+h.plaka+' '+h.sofor).toLocaleLowerCase('tr').includes(q.toLocaleLowerCase('tr'));
const opt=(v,t,s)=>`<option value="${v}"${s===v?' selected':''}>${t}</option>`;
const firmaOpt=s=>opt('','Bütün fabrikalar',s)+D.firmalar.map(f=>opt(f.id,f.ad,s)).join('');

/* ---- gezinme ---- */
const ik={bugun:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',puantaj:'<path d="M4 5h16v15H4zM4 10h16M8 3v4M16 3v4M8 15l2 2 5-4"/>',canli:'<circle cx="12" cy="10" r="3"/><path d="M12 21c5-5 7-8 7-11a7 7 0 0 0-14 0c0 3 2 6 7 11z"/>',araclar:'<path d="M3 6h14l4 5v6H3zM3 11h18M10 6v5"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',personel:'<circle cx="10" cy="8" r="4"/><path d="M3 21c0-5 3-7 7-7s7 2 7 7M19 7v6M16 10h6"/>',hakedis:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6"/>',hatlar:'<circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7c0 9 12 2 12 10"/>',firma:'<path d="M3 21V9l6 4V9l6 4V4h6v17z"/>',mobil:'<path d="M7 2h10v20H7zM11 18h2"/>',diger:'<path d="M4 6h16M4 12h16M4 18h16"/>'};
const svg=k=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ik[k]}</svg>`;
const ek=[['index','bugun','Bugün'],['puantaj','puantaj','Puantaj'],['canli','canli','Canlı'],['araclar','araclar','Araçlar'],['personel','personel','Personel'],['hakedis','hakedis','Hakediş'],['hatlar','hatlar','Hatlar'],['firma','firma','Fabrika'],['mobil','mobil','Şoför']];
const uzun={firma:'Fabrika yetkilisi ekranı',mobil:'Şoför ve personel ekranları',index:'Bugün, harita',canli:'Canlı takip'};
if(S!=='firma'){const n=document.createElement('nav');n.className='gez';n.setAttribute('aria-label','Ana gezinme');
n.innerHTML='<a class="marka" href="index.html">Servis Masası</a>'+ek.map(([f,i,t],j)=>`<a class="g${j>1&&![2,4].includes(j)?' ikincil':''}" href="${f}.html"${f===S?' aria-current="page"':''}>${svg(i)}${t}</a>`).join('')+`<button type="button" class="alt">${svg('diger')}Diğer</button>`;document.body.prepend(n);$('.alt',n).onclick=x=>{x.stopPropagation();menu(eul.hidden);};}
const e=document.createElement('div');e.className='ekranlar';e.innerHTML=`<ul hidden>${ek.map(([f,,t])=>`<li><a href="${f}.html">${uzun[f]||t}</a></li>`).join('')}<li><a href="../index.html">Diğer tasarımlar</a></li><li><button type="button" data-sifir>Demoyu başa al</button></li></ul><button type="button" aria-expanded="false">Ekranlar</button>`;document.body.append(e);
const eb=$('button[aria-expanded]',e),eul=$('ul',e);const menu=a=>{eul.hidden=!a;eb.setAttribute('aria-expanded',a)};
eb.onclick=()=>menu(eul.hidden);$('[data-sifir]',e).onclick=()=>D.sifirla();
document.addEventListener('click',x=>{if(!e.contains(x.target))menu(false)});document.addEventListener('keydown',x=>{if(x.key==='Escape')menu(false)});
$$('.son').forEach(x=>x.textContent='Örnek verilerle hazırlanmış ön tasarım, Webizmo');
const panel=$('.panel');if(panel){const t=document.createElement('button');t.type='button';t.className='tut';t.setAttribute('aria-expanded','false');t.textContent='Listeyi büyüt';panel.prepend(t);t.onclick=()=>{const a=panel.classList.toggle('acik');t.setAttribute('aria-expanded',a);t.textContent=a?'Haritaya dön':'Listeyi büyüt';};}
const paneliKapat=()=>{if(panel&&panel.classList.contains('acik'))$('.tut').click()};
let dlg;function dialog(html){if(!dlg){dlg=document.createElement('dialog');document.body.append(dlg);dlg.addEventListener('click',x=>{if(x.target===dlg||x.target.closest('[data-kapat]'))dlg.close()});}dlg.innerHTML=html;dlg.showModal();return dlg;}

/* ---- araç konumu (örnek) ---- */
const yolu=h=>[...h.duraklar.map(d=>d.k),h.firma.k];
function yolda(h,u){const y=yolu(h),L=[0];for(let i=1;i<y.length;i++)L[i]=L[i-1]+D.km(y[i-1],y[i]);const t=u*L[L.length-1];let i=1;while(i<y.length-1&&L[i]<t)i++;const q=Math.max(0,Math.min(1,(t-L[i-1])/(L[i]-L[i-1]||1)));return{k:[y[i-1][0]+(y[i][0]-y[i-1][0])*q,y[i-1][1]+(y[i][1]-y[i-1][1])*q],a:aci(y[i-1],y[i])};}
function aci(a,b){return Math.atan2((b[1]-a[1])*Math.cos(a[0]*Math.PI/180),b[0]-a[0])*180/Math.PI;}
function konum(h){const ps=pu(h),sr=ps.some(p=>p.durum==='gelmedi'),f=h.firma;
 const bek=ps.find(p=>p.durum==='bekliyor'),son=ps.filter(p=>tamam(p)&&p.sefer.yon==='Çıkış'&&now-D.dk(p.gerceklesen)<=55&&now>=D.dk(p.gerceklesen)).pop(),gel=ps.find(p=>p.durum==='planli'&&D.dk(p.sefer.saat)-now<=75);
 const g=h.no*2.4,ic=()=>{const r=h.id==='H1'?0:f.yari*.64,g=(h.no-1)/5*1.1;return{k:[f.k[0]+r*Math.cos(g)/111000,f.k[1]+r*Math.sin(g)/84000],a:0}};
 let o;
 if(bek&&bek.sefer.yon==='Çıkış')o={...ic(),d:'alanda',m:'Fabrika alanında, çıkış bekleniyor'};
 else if(bek)o={...yolda(h,.86),d:'yolda',m:'Fabrikaya yaklaşıyor'};
 else if(son){const u=Math.min(.95,Math.max(.055,(now-D.dk(son.gerceklesen))/58));const y=yolda(h,1-u);o={k:y.k,a:y.a+180,d:'yolda',m:'Fabrikadan çıktı, dönüşte'};}
 else if(gel&&gel.sefer.yon==='Çıkış'&&D.dk(gel.sefer.saat)-now<=35)o={...ic(),d:'alanda',m:'Fabrika alanında, sonraki çıkışı bekliyor'};
 else if(gel){o={...yolda(h,Math.max(.05,1-(D.dk(gel.sefer.saat)-now)/75)),d:'yolda',m:'Servise çıktı, fabrikaya gidiyor'};}
 else{const b=h.duraklar[0].k,r=.004+.006*((h.no*3%7)/7);o={k:[b[0]+r*Math.cos(g),b[1]+r*Math.sin(g)*1.3],a:0,d:'park',m:'Şu an seferde değil'};}
 o.sorun=sr;return o;}

/* ---- harita ---- */
function harita(el,o){o=o||{};if(!window.L){el.innerHTML='<p style="padding:20px">Harita yüklenemedi. İnternet bağlantısını kontrol edip sayfayı yenileyin.</p>';return null;}
 const m=L.map(el,Object.assign({zoomControl:false,attributionControl:false,zoomSnap:.25},o));
 L.control.attribution({position:'bottomleft',prefix:false}).addTo(m);
 if(o.zoomControl!==false&&!o.sade)L.control.zoom({position:S==='index'||S==='hatlar'?'topleft':'topright',zoomInTitle:'Yaklaştır',zoomOutTitle:'Uzaklaştır'}).addTo(m);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları'}).addTo(m);return m;}
function alanCiz(m,f,o){return L.circle(f.k,Object.assign({radius:f.yari,color:'#0B5563',weight:2,fillColor:'#0B5563',fillOpacity:.16},o||{})).addTo(m);}
function okSvg(k){const c=k.sorun?'#C93A12':k.d==='yolda'?'#0B5563':'#fff',s=k.sorun?'#fff':k.d==='yolda'?'#fff':'#0B5563';
 return k.d==='yolda'?`<svg class="ok" width="40" height="40" viewBox="0 0 40 40" style="transform:rotate(${k.a.toFixed(0)}deg)"><path d="M20 2 27.5 10a12 12 0 1 1-15 0z" fill="${c}" stroke="${s}" stroke-width="2"/></svg>`:`<svg class="ok" width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="12.5" fill="${c}" stroke="${s}" stroke-width="2.5"/></svg>`;}
function ikon(h,k,kucuk){return kucuk?L.divIcon({className:'',iconSize:[26,26],html:`<div class="mk"><span class="nokta ${k.d}${k.sorun?' sorun':''}"></span></div>`}):L.divIcon({className:'',iconSize:[40,40],html:`<div class="mk ${k.d}${k.sorun?' sorun':''}">${okSvg(k)}<b>${h.no}</b></div>`});}
function popup(h,k){const ps=pu(h),son=ps.filter(tamam).pop();return `<p><span class="hat">${h.id}</span> <b>${h.ad}</b></p><p>${h.plaka}, ${h.sofor}</p><p>${k.m}</p><p>Bugün ${islenen(h)} / ${ps.length} tek işlendi${son?', son '+son.gerceklesen:''}</p><p>${h.personel} personel, ${h.kapasite} kişilik</p>${S==='firma'?'':`<a class="dugme" href="canli.html?hat=${h.id}">Aracı takip et</a>`}`;}
function filo(m,hatlar,o){o=o||{};const K={},M={};let plakalar=[];const katman=L.layerGroup().addTo(m);
 function ciz(){katman.clearLayers();const z=m.getZoom(),yak=z>=14,dar=z<10.6,dolu=[];
  if(o.levha!==false)[...new Set(hatlar.map(h=>h.firma))].forEach(f=>{const n=hatlar.filter(h=>h.firma===f&&K[h.id].d==='alanda').length,p=m.latLngToLayerPoint(f.k);let dy=8+f.yari/(156543*Math.cos(f.k[0]*Math.PI/180)/2**z);const sol=dar&&f.id==='F2'?-34:0;if(f.id==='F2'&&!dar)dy=-dy-50;
   L.marker(f.k,{keyboard:true,zIndexOffset:1500,title:f.ad+' alanına yaklaş',icon:L.divIcon({className:'',iconSize:[0,0],html:`<div class="levha" style="margin:${dy.toFixed(0)}px 0 0 ${sol}px">${dar?f.ad.replace('Örnek ','')+' '+n:f.ad+`<small>${n?n+' araç alanda':'Alanda araç yok'}</small>`}</div>`})}).on('click',()=>m.setView(f.k,15)).addTo(katman);dolu.push([p.x+sol-(dar?50:70),p.y+dy-8,p.x+sol+(dar?50:70),p.y+dy+(dar?28:48)]);});
  const sira={yolda:1,alanda:0,park:2};
  hatlar.slice().sort((a,b)=>(a.id===o.one?-1:b.id===o.one?1:0)||(K[b.id].sorun-K[a.id].sorun)||sira[K[a.id].d]-sira[K[b.id].d]).forEach(h=>{const k=K[h.id];if(k.d==='alanda'&&!yak&&h.id!==o.hep&&o.levha!==false)return;if(dar&&k.d==='park'&&!k.sorun&&h.id!==o.one)return;
   const p=m.latLngToLayerPoint(k.k),cak=dolu.some(q=>p.x>q[0]-13&&p.x<q[2]+13&&p.y>q[1]-13&&p.y<q[3]+13);
   let kck=h.id!==o.one&&(cak||(k.d==='park'&&z<13&&!k.sorun));
   if(o.sonuk&&h.id!==o.one)kck=true;
   if(!kck)dolu.push([p.x-13,p.y-13,p.x+13,p.y+13]);
   M[h.id]=L.marker(k.k,{icon:ikon(h,k,kck),title:h.id+' '+h.ad,alt:h.id+' '+h.ad+', '+k.m,zIndexOffset:h.id===o.one?2000:kck?0:500,opacity:o.sonuk&&h.id!==o.one?.75:1}).addTo(katman);
   M[h.id].on('click',()=>{if(o.sec)o.sec(h);else goster(h)});});}
 function goster(h){L.popup({offset:[0,-12],maxWidth:270}).setLatLng(K[h.id].k).setContent(popup(h,K[h.id])).openOn(m);}
 function yenile(){hatlar.forEach(h=>K[h.id]=konum(h));ciz();}
 hatlar.forEach(h=>K[h.id]=konum(h));m.on('zoomend',ciz);if(m._loaded)ciz();
 return{K,M,o,ciz,yenile,goster};}
const sinir=hs=>L.latLngBounds(hs.flatMap(h=>[h.firma.k,konum(h).k]));
function rotaCiz(g,h,o){o=o||{};L.polyline(yolu(h),{color:'#fff',weight:8,opacity:.9}).addTo(g);L.polyline(yolu(h),{color:o.renk||'#0B5563',weight:4.5,dashArray:o.kesik||null}).addTo(g);
 if(o.durak!==false)h.duraklar.forEach(d=>L.circleMarker(d.k,{radius:7,color:'#0B5563',weight:3,fillColor:'#fff',fillOpacity:1}).bindTooltip(d.saat+' '+d.ad).addTo(g));}

/* ==== BUGÜN ==== */
if(S==='index'){
 let yeni=null,yakin=null,acikSaat=null;const acik={F1:true};
 const m=harita($('#harita')),hepsi=D.hatlar;let fl=null;
 const turu=()=>{m.fitBounds(mobil()?L.latLngBounds(D.firmalar.map(f=>f.k)):sinir(D.hatlar),{paddingTopLeft:[mobil()?40:20,mobil()?150:20],paddingBottomRight:[mobil()?40:200,mobil()?45:30],maxZoom:12})};
 if(m){D.firmalar.forEach(f=>alanCiz(m,f));turu();fl=filo(m,hepsi,{one:'H1x'});$('#tumu').onclick=turu;}
 function ozet(){const s=D.sayilar(),ev=D.araclar.flatMap(a=>a.evraklar),c=x=>D.araclar.filter(a=>a.evraklar.some(v=>v.durum===x)).length;
  $('#ozet').innerHTML=`<div class="sayac"><strong>${s.islendi+s.gec}</strong><span>/ ${s.toplam} tek işlendi</span></div><div class="dagilim"><span>${s.bekliyor} aralık açık</span><span>${s.planli} planlı</span><span>${s.gec} geç işlendi</span></div>`;
  const kap=D.hatlar.filter(h=>!h.erisim).length;
  $('#isler').innerHTML=[['puantaj.html?durum=gelmedi','Gelmeyen tek',s.gelmedi],['araclar.html?suz=gecti','Evrak süresi geçen araç',c('gecti')],['araclar.html?suz=yaklasiyor','30 günde evrakı biten araç',c('yaklasiyor'),1],...(kap?[['hatlar.html','Erişimi kapalı hat',kap,1]]:[])].filter(x=>x[2]).map(x=>`<li><a href="${x[0]}" class="${x[3]?'normal':''}">${x[1]}<b>${x[2]}</b></a></li>`).join('');}
 const yakinMi=p=>p.durum==='bekliyor'||p.durum==='gelmedi'||(tamam(p)&&now-D.dk(p.gerceklesen)<=30&&now>=D.dk(p.gerceklesen))||(p.durum==='planli'&&D.dk(p.sefer.saat)-now<=60);
 const sr={gelmedi:0,bekliyor:1,gec:2,islendi:2,planli:3};
 const satir=p=>`<button type="button" class="satir${yeni===p.id?' yeni':''}" data-p="${p.id}">${roz(p.hat)}<span class="orta">${p.hat.ad}<small>${p.sefer.saat} ${p.sefer.yon.toLocaleLowerCase('tr')}, ${p.hat.plaka}</small></span>${durum(p)}</button>`;
 function liste(){$('#simdiListe').innerHTML=D.firmalar.map(f=>{const ps=D.puantaj.filter(p=>p.hat.firma===f&&yakinMi(p)).sort((a,b)=>(b.hat.id==='H1')-(a.hat.id==='H1')||sr[a.durum]-sr[b.durum]),n=x=>ps.filter(p=>p.durum===x).length;
  return `<details class="fab" data-f="${f.id}"${acik[f.id]?' open':''}><summary>${f.ad}<span class="ozet">${n('bekliyor')} açık${n('gelmedi')?`, <b class="d gelmedi">${n('gelmedi')} gelmedi</b>`:''}</span></summary>${ps.map(satir).join('')||'<p class="kucuk" style="padding:10px 12px">Şu saatlerde tek yok.</p>'}</details>`}).join('');
  $$('details.fab').forEach(d=>d.ontoggle=()=>acik[d.dataset.f]=d.open);}
 document.addEventListener('click',x=>{const b=x.target.closest('[data-p]');if(!b||!m)return;const h=D.puantaj.find(p=>p.id===b.dataset.p).hat;paneliKapat();m.setView(fl.K[h.id].k,fl.K[h.id].d==='alanda'?15:13,{animate:!azHareket});fl.goster(h);});
 function serit(){let mx=1;const bins={};D.puantaj.forEach(p=>{const b=Math.floor(D.dk(p.sefer.saat)/15);(bins[b]=bins[b]||[]).push(p);mx=Math.max(mx,bins[b].length)});
  let h='';for(let s=6;s<22;s++){let c='',t=0;for(let q=0;q<4;q++){const a=bins[s*4+q]||[];t+=a.length;const n=k=>a.filter(p=>k.includes(p.durum)).length,u=(k,l)=>{const v=n(l);return v?`<u class="${k}" style="height:${Math.max(2,v/mx*56*(mobil()?.75:1)).toFixed(1)}px"></u>`:''};c+=`<i>${u('islendi',['islendi','gec'])}${u('bekliyor',['bekliyor'])}${u('planli',['planli'])}${u('gelmedi',['gelmedi'])}</i>`;}
   h+=`<button type="button" data-s="${s}" aria-expanded="${acikSaat===s}" aria-label="${String(s).padStart(2,'0')}:00 saatindeki ${t} tek"><span class="cub">${c}</span><em>${String(s).padStart(2,'0')}:00</em></button>`;}
  $('#saatler').innerHTML=h+`<div class="simdi" style="left:${((now-360)/960*100).toFixed(2)}%"><span>${D.SIMDI}</span></div>`;}
 function saatPanel(){const el=$('#saatPanel');if(acikSaat===null){el.hidden=true;return;}const ps=D.puantaj.filter(p=>Math.floor(D.dk(p.sefer.saat)/60)===acikSaat).sort((a,b)=>D.dk(a.sefer.saat)-D.dk(b.sefer.saat));el.hidden=false;
  el.innerHTML=`<div class="kafa"><h2>${String(acikSaat).padStart(2,'0')}:00 ile ${String(acikSaat).padStart(2,'0')}:59 arası, ${ps.length} tek</h2><button type="button" class="dugme ikinci" data-kapat>Kapat</button></div><div class="liste">${ps.map(satir).join('')||'<p>Bu saatte planlı tek yok.</p>'}</div>`;$('[data-kapat]',el).onclick=()=>{acikSaat=null;saatPanel();serit();};}
 $('#saatler').onclick=x=>{const b=x.target.closest('[data-s]');if(!b)return;const s=+b.dataset.s;acikSaat=acikSaat===s?null:s;saatPanel();const yer=$('.kaydir').scrollLeft;serit();$('.kaydir').scrollLeft=yer;$(`[data-s="${s}"]`).focus();};
 const h1=hatB('H1'),tek=D.puantaj.find(p=>p.id==='H1-3');
 function kart(mesaj){const n=islenen(h1),t=h1.seferler.length;$('#demoDurum').innerHTML=mesaj||(tamam(tek)?`17:05 çıkışı ${tek.gerceklesen} saatinde işlendi.`:`17:05 çıkışı, ${D.durumAd[tek.durum].toLocaleLowerCase('tr')} (${tek.sefer.bas} ile ${tek.sefer.bit} arası). Araç fabrika alanında.`);
  $('#h1Hesap').innerHTML=`<dt>Bugün işlenen</dt><dd>${n} / ${t} tek</dd><dt>Taşeron, ${n} × ${D.tl(h1.taseronUcret)}</dt><dd>${D.tl(n*h1.taseronUcret)}</dd><dt>Fabrika, ${n} × ${D.tl(h1.firmaUcret)}</dt><dd>${D.tl(n*h1.firmaUcret)}</dd><dt>Gün sonu taşeron, ${t} × ${D.tl(h1.taseronUcret)}</dt><dd>${D.tl(t*h1.taseronUcret)}</dd><dt>Gün sonu fabrika, ${t} × ${D.tl(h1.firmaUcret)}</dt><dd>${D.tl(t*h1.firmaUcret)}</dd>`;}
 function isle(){if(D.tekIsle('H1-3','17:12')){yeni='H1-3';acik.F1=true;ozet();liste();serit();if(acikSaat!==null)saatPanel();kart('Araç alan sınırını geçti. 17:05 çıkışı 17:12 saatinde kendiliğinden işlendi.');const r=$('#simdiListe [data-p="H1-3"]');if(r&&!mobil())panel.scrollTo({top:r.offsetTop-panel.offsetTop-200,behavior:azHareket?'auto':'smooth'});return true;}return false;}
 let calisiyor=false;
 $('#cikar').onclick=()=>{if(calisiyor)return;
  if(tamam(tek)){kart('Bu tek zaten işlendi, iki kez sayılmaz.');return;}
  if(!m){isle();return;}
  calisiyor=true;$('#cikar').disabled=true;m.closePopup();kart('Araç fabrikadan hareket ediyor.');acikSaat=null;saatPanel();serit();paneliKapat();
  const f=h1.firma,hedef=yolda(h1,1-.055),k=fl.K.H1,bas=f.k.slice();
  fl.o.one='H1';fl.o.hep='H1';
  const bz=mobil()?14.5:15,pr=m.project(L.latLng((bas[0]*.6+hedef.k[0]*.4),(bas[1]*.6+hedef.k[1]*.4)),bz);if(mobil())pr.y-=55;
  m.setView(m.unproject(pr,bz),bz,{animate:!azHareket});
  setTimeout(()=>{k.k=bas;k.a=aci(bas,hedef.k);k.d='yolda';fl.ciz();let gecti=false,t0=null;const sure=azHareket?600:7000;
   const bitir=()=>{calisiyor=false;$('#cikar').disabled=false;fl.yenile();};
   function kare(t){t0=t0===null?t:t0;let u=Math.min(1,(t-t0)/sure);if(azHareket)u=u<.5?0:1;const g=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;k.k=[bas[0]+(hedef.k[0]-bas[0])*g,bas[1]+(hedef.k[1]-bas[1])*g];fl.M.H1.setLatLng(k.k);
    window.__mesafe=D.km(k.k,f.k)*1000;
    if(!gecti&&window.__mesafe>f.yari){gecti=true;isle();L.circle(f.k,{radius:f.yari,color:'#0B5563',weight:6,fill:false}).addTo(m);}
    if(u<1)requestAnimationFrame(kare);else bitir();}
   requestAnimationFrame(kare);},azHareket?50:1200);};
 ozet();liste();serit();kart();
 const kd=$('.kaydir');kd.scrollLeft=(now-360)/960*kd.scrollWidth-kd.clientWidth/2;
}

/* ==== CANLI ==== */
if(S==='canli'){let sec=hatB(Q.get('hat'))||hatB('H1'),g=null,fl=null;const m=harita($('#harita'));
 if(m){g=L.layerGroup().addTo(m);m.setView(sec.firma.k,12);D.firmalar.forEach(f=>alanCiz(m,f));}
 function goster(){history.replaceState(null,'','canli.html?hat='+sec.id);const k=konum(sec),a=sec.arac;
  if(m){g.clearLayers();rotaCiz(g,sec);if(!fl)fl=filo(m,D.hatlar,{one:sec.id,hep:sec.id,sonuk:true,sec:h=>{sec=h;goster();}});fl.o.one=fl.o.hep=sec.id;m.fitBounds(L.latLngBounds([...yolu(sec),k.k]),{paddingTopLeft:[40,40],paddingBottomRight:[70,mobil()?70:130],maxZoom:14});fl.yenile();}
  $('#odak').innerHTML=`<div class="iki" style="align-items:center">${roz(sec)}<h2>${sec.ad}</h2></div><p class="uyari">${k.m}</p><dl class="bilgi"><dt>Araç</dt><dd>${sec.plaka}</dd><dt>Şoför</dt><dd>${sec.sofor}</dd><dt>Fabrika</dt><dd>${sec.firma.ad}</dd><dt>Doluluk</dt><dd>${a.personel} / ${a.kapasite} kişi</dd><dt>Çalışan</dt><dd>${a.kendi?'Kendi aracımız':a.taseron.ad}</dd></dl><h3>Bugünkü tekler</h3><div class="tekler" style="margin:8px 0 18px">${pu(sec).map(tekChip).join('')}</div><h3>Güzergâh ve duraklar</h3><ol class="duraklar">${sec.duraklar.map(d=>`<li><b>${d.saat}</b>${d.ad}</li>`).join('')}<li><b>${sec.seferler[0].saat}</b>${sec.firma.ad}</li></ol>`;
  listele();panel.scrollTop=0;}
 function listele(){const q=$('#ara').value;$('#hatListe').innerHTML=D.hatlar.filter(h=>ara(h,q)).map(h=>`<button type="button" class="satir${h===sec?' secili':''}" data-h="${h.id}">${roz(h)}<span class="orta">${h.ad}<small>${h.plaka}, ${konum(h).m.toLocaleLowerCase('tr')}</small></span></button>`).join('')||'<p>Eşleşen hat yok. Plaka, hat numarası ya da şoför adıyla arayın.</p>';}
 $('#ara').oninput=listele;$('#hatListe').onclick=x=>{const b=x.target.closest('[data-h]');if(b){sec=hatB(b.dataset.h);goster();paneliKapat();}};
 $('#degis').onclick=()=>$('#hatSec').scrollIntoView({behavior:azHareket?'auto':'smooth'});
 goster();}
function tekChip(p){return `<span class="tek ${p.durum}"><b>${p.sefer.saat} ${p.sefer.yon}</b>${D.durumAd[p.durum]}${p.gerceklesen?' '+p.gerceklesen:''}${p.gerekce?'<br>Elle düzeltildi':''}</span>`;}

/* ==== PUANTAJ ==== */
if(S==='puantaj'){let gorunum='gun';const f=$('#firma'),d=$('#durum'),a=$('#ara');f.innerHTML=firmaOpt(Q.get('firma')||'');d.innerHTML=opt('','Bütün durumlar')+Object.entries(D.durumAd).map(([k,v])=>opt(k,v,Q.get('durum')||'')).join('');
 const sec=()=>D.hatlar.filter(h=>(!f.value||h.firma.id===f.value)&&ara(h,a.value));
 function ciz(){$$('[data-g]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===gorunum));$('#durumL').hidden=gorunum==='ay';
  if(gorunum==='gun'){const hs=sec().filter(h=>!d.value||pu(h).some(p=>p.durum===d.value));const ps=hs.flatMap(pu);
   $('#aciklama').textContent=`${hs.length} hat, ${ps.filter(tamam).length} / ${ps.length} tek işlendi.`+(D.sayilar().gelmedi?' Gelmeyen teke tıklayıp gerekçeyle düzeltebilirsiniz.':'');
   $('#icerik').innerHTML=hs.length?`<table class="kat"><thead><tr><th>Hat</th><th>Fabrika, araç</th><th>Tekler</th><th class="sag">İşlenen</th><th class="sag">Taşeron</th><th class="sag">Fabrika</th></tr></thead><tbody>${hs.map(h=>{const n=islenen(h);return `<tr><td class="tam"><span class="iki" style="align-items:center;flex-wrap:nowrap">${roz(h)}<b>${h.ad}</b></span></td><td class="tam">${h.firma.ad}, <span style="white-space:nowrap">${h.plaka}</span></td><td class="tam"><div class="tekler">${pu(h).map(p=>{let s=p.durum==='gelmedi'?`<button type="button" class="tek gelmedi" data-duz="${p.id}"><b>${p.sefer.saat} ${p.sefer.yon}</b>Gelmedi, düzelt</button>`:tekChip(p);return d.value&&p.durum!==d.value?s.replace('class="tek','class="tek sonuk'):s}).join('')}</div></td><td class="sag" data-b="İşlenen">${n} / ${h.seferler.length}</td><td class="sag" data-b="Taşeron">${h.arac.kendi?'Kendi aracımız':D.tl(n*h.taseronUcret)}</td><td class="sag" data-b="Fabrika">${D.tl(n*h.firmaUcret)}</td></tr>`}).join('')}</tbody></table>`:'<p style="padding:20px;margin:0">Bu süzgece uyan tek yok. Durumu “Bütün durumlar” yapın.</p>';
  }else{const hs=sec();$('#aciklama').textContent=`Kasım 2026, 1–24 Kasım kapanmış günler. ${hs.length} hat, ${hs.reduce((t,h)=>t+h.aylikTek,0).toLocaleString('tr-TR')} tek. Eksik günler turuncu, pazarlar boş.`;$('#icerik').innerHTML=aylikTablo(hs);}}
 function duz(p){const w=dialog(`<h2>${p.hat.id} ${p.hat.ad}</h2><p>${p.sefer.saat} ${p.sefer.yon.toLocaleLowerCase('tr')}, aralık ${p.sefer.bas} ile ${p.sefer.bit} arası. Konum kaydı gelmedi.</p><form><label class="secim"><input type="radio" name="y" value="islendi" checked> Sefer yapıldı, teki işle</label><label class="secim"><input type="radio" name="y" value="gelmedi"> Sefer yapılmadı, gelmedi kalsın</label><label id="sl">Gerçekleşen saat<input type="time" name="s" value="${p.sefer.saat}" required></label><label>Gerekçe<textarea name="g" rows="2" required placeholder="Örnek: Şoförün telefonu kapandı, yetkili teyit etti"></textarea></label><div class="iki"><button class="dugme">Düzeltmeyi kaydet</button><button type="button" class="dugme ikinci" data-kapat>Vazgeç</button></div></form>`);
  const fm=$('form',w);fm.onchange=()=>{const n=fm.y.value==='gelmedi';$('#sl',w).hidden=n;fm.s.required=!n};
  fm.onsubmit=x=>{x.preventDefault();const g=fm.g.value.trim();if(!g){fm.g.value='';fm.g.reportValidity();return;}const r=D.duzelt(p.id,fm.y.value,fm.s.value,g);w.close();ciz();$('#sonuc').hidden=false;$('#sonuc').textContent=`${p.hat.id} ${p.sefer.saat} ${p.sefer.yon.toLocaleLowerCase('tr')}: ${D.durumAd[r.durum].toLocaleLowerCase('tr')}${r.gerceklesen?' '+r.gerceklesen:''}. Gerekçe: ${g}`;};}
 $('#icerik').onclick=x=>{const b=x.target.closest('[data-duz]');if(b)duz(D.puantaj.find(p=>p.id===b.dataset.duz));};
 [f,d].forEach(x=>x.onchange=ciz);a.oninput=ciz;$$('[data-g]').forEach(b=>b.onclick=()=>{gorunum=b.dataset.g;ciz();});ciz();}
function aylikTablo(hs){return `<table class="aylik"><thead><tr><th>Hat</th>${D.gunler.map(g=>`<th class="${g.pazar?'pz':''}">${g.gun}</th>`).join('')}<th>Toplam</th></tr></thead><tbody>${hs.map(h=>`<tr><td><span class="hat">${h.id}</span> ${h.bolge}</td>${h.aylik.map(v=>v===null?'<td class="pz">-</td>':`<td class="${v<h.seferler.length?'eksik':''}">${v}</td>`).join('')}<td><b>${h.aylikTek}</b></td></tr>`).join('')}<tr><td><b>Toplam</b></td>${D.gunler.map((g,i)=>g.pazar?'<td class="pz">-</td>':`<td><b>${hs.reduce((t,h)=>t+(h.aylik[i]||0),0)}</b></td>`).join('')}<td><b>${hs.reduce((t,h)=>t+h.aylikTek,0).toLocaleString('tr-TR')}</b></td></tr></tbody></table>`;}

/* ==== ARAÇLAR ==== */
if(S==='araclar'){let s=Q.get('suz')||'';const f=$('#firma'),a=$('#ara');f.innerHTML=firmaOpt('');
 const uyar=(x,v)=>!v||(v==='kendi'?x.kendi:v==='bos'?x.hat.bos>0:x.evraklar.some(y=>y.durum===v));
 function ciz(){const tas=[['','Hepsi'],['gecti','Süresi geçen'],['yaklasiyor','30 günde biten'],['bos','Boş yeri olan'],['kendi','Kendi araçlarımız']];$('#suz').innerHTML=tas.map(([k,t])=>`<button type="button" data-s="${k}" aria-pressed="${s===k}">${t} (${D.araclar.filter(x=>uyar(x,k)).length})</button>`).join('');
  const l=D.araclar.filter(x=>uyar(x,s)&&(!f.value||x.hat.firma.id===f.value)&&ara(x.hat,a.value));
  $('#icerik').innerHTML=l.length?`<table class="kat"><thead><tr><th>Araç</th><th>Hat</th><th>Doluluk</th>${D.araclar[0].evraklar.map(v=>`<th>${v.ad}</th>`).join('')}</tr></thead><tbody>${l.map(x=>`<tr class="tikla" data-a="${x.plaka}"><td class="tam"><button type="button" class="duzbtn">${x.plaka}</button> <span class="kucuk">${x.kendi?'Kendi aracımız':x.taseron.ad}</span></td><td data-b="Hat"><span>${roz(x.hat)} ${x.hat.ad}</span></td><td data-b="Doluluk"><span>${x.personel} / ${x.kapasite} kişi<span class="bar"><i style="width:${x.doluluk}%"></i></span></span></td>${x.evraklar.map(v=>`<td class="ev ${v.durum}" data-b="${v.ad}">${D.tarih(v.bitis)}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'<p style="padding:20px;margin:0">Bu süzgece uyan araç yok. “Hepsi” düğmesiyle listeyi geri getirin.</p>';}
 $('#suz').onclick=x=>{const b=x.target.closest('[data-s]');if(b){s=b.dataset.s;ciz();}};f.onchange=ciz;a.oninput=ciz;
 $('#icerik').onclick=e=>{const r=e.target.closest('[data-a]');if(!r)return;const x=D.araclar.find(y=>y.plaka===r.dataset.a);dialog(`<h2>${x.plaka}</h2><dl class="bilgi"><dt>Hat</dt><dd>${x.hat.id} ${x.hat.ad}</dd><dt>Şoför</dt><dd>${x.sofor}</dd><dt>Telefon</dt><dd>${x.tel}</dd><dt>Çalışan</dt><dd>${x.kendi?'Kendi aracımız':x.taseron.ad}</dd><dt>Doluluk</dt><dd>${x.personel} / ${x.kapasite} (%${x.doluluk}), ${x.hat.bos} boş</dd></dl><h3>Evraklar</h3><table style="margin:8px 0 16px"><tbody>${x.evraklar.map(v=>`<tr><td>${v.ad}</td><td>${D.tarih(v.bitis)}</td><td class="ev ${v.durum}">${v.gun<0?Math.abs(v.gun)+' gün geçti':v.gun+' gün kaldı'}</td></tr>`).join('')}</tbody></table><div class="iki"><a class="dugme" href="canli.html?hat=${x.hat.id}">Haritada göster</a><button type="button" class="dugme ikinci" data-kapat>Kapat</button></div>`);};ciz();}

/* ==== PERSONEL ==== */
if(S==='personel'){const m=harita($('#harita')),fr=$('#fabrika'),ad=$('#ad'),ar=$('#adres');fr.innerHTML=D.firmalar.map(f=>opt(f.id,f.ad+', '+f.ilce)).join('');ar.innerHTML=D.ornekAdresler.map((x,i)=>opt(String(i),x.ad)).join('');let g,on=[],sec=0,bitti=false;
 if(m){g=L.layerGroup().addTo(m);m.setView(D.firmalar[0].k,11);D.firmalar.forEach(f=>alanCiz(m,f));}
 function cizHarita(){if(!m)return;g.clearLayers();const A=D.ornekAdresler[+ar.value];on.map((o,i)=>[o,i]).sort((a,b)=>(a[1]===sec)-(b[1]===sec)).forEach(([o,i])=>{rotaCiz(g,o.hat,{renk:i===sec?'#0B5563':'#5F8593',kesik:i===sec?null:'9 7',durak:i===sec});L.polyline([A.k,o.durak.k],{color:'#12303A',weight:2,dashArray:'3 5',opacity:i===sec?1:.4}).addTo(g);L.marker(o.durak.k,{icon:L.divIcon({className:'',iconSize:[46,28],iconAnchor:[23,34],html:`<span class="hat">${o.hat.id}</span>`}),title:o.hat.id+' önerisini seç',zIndexOffset:i===sec?500:0}).on('click',()=>{if(!bitti){sec=i;cizListe();cizHarita();}}).addTo(g);});
  const p=L.marker(A.k,{title:A.ad,zIndexOffset:900,icon:L.divIcon({className:'',iconSize:[22,22],iconAnchor:[11,26],html:'<div class="igne"></div>'})}).addTo(g);p.bindTooltip(A.ad,{permanent:true,direction:'top',offset:[0,-28]});
  const f=D.firmalar.find(x=>x.id===fr.value);m.fitBounds(L.latLngBounds([A.k,f.k,...on.flatMap(o=>yolu(o.hat))]),{paddingTopLeft:[40,60],paddingBottomRight:[40,40]});}
 function cizListe(){$('#oneriler').innerHTML=on.map((o,i)=>`<div class="oneri${i===sec?' secili':''}"><div class="bas">${roz(o.hat)}${o.hat.ad}</div><p>${o.durak.ad}, ${o.durak.saat}<br>Adrese ${o.km.toLocaleString('tr-TR',{maximumFractionDigits:1})} km (kuş uçuşu), ${o.hat.bos} boş yer, ${o.hat.plaka}</p>${i===sec?`<button type="button" class="dugme" data-onay="${i}">${o.hat.id} aracına ata</button>`:`<button type="button" class="dugme ikinci" data-sec="${i}">Haritada göster</button>`}</div>`).join('')||'<p>Bu fabrikanın hatlarında boş yer yok.</p>';}
 function bul(){bitti=false;$('#sonuc').hidden=true;$('#form').hidden=false;on=D.enYakin(D.ornekAdresler[+ar.value].k,fr.value,3);sec=0;cizListe();cizHarita();atamalar();}
 function atamalar(){const a=D.atamalar();$('#atamalar').innerHTML=a.length?'<h3>Bu demoda atananlar</h3>'+a.map(x=>`<p>${esc(x.ad)}: ${x.hat}, ${x.durak}</p>`).join(''):'';}
 $('#oneriler').onclick=x=>{const b=x.target.closest('button');if(!b)return;if(b.dataset.sec){sec=+b.dataset.sec;cizListe();cizHarita();return;}
  const isim=ad.value.trim();if(!isim){ad.setCustomValidity('Önce personelin adını yazın');ad.reportValidity();return;}
  const o=on[+b.dataset.onay],h=o.hat,A=D.ornekAdresler[+ar.value];if(!D.ata(isim,A.ad,h.id,o.durak.ad)){bul();return;}bitti=true;
  const w=`Merhaba ${isim},\n${h.firma.ad} servisiniz: ${h.id} ${h.ad}\nDurağınız: ${o.durak.ad}\nBiniş saati: ${o.durak.saat}\nAraç: ${h.plaka}\nŞoför: ${h.sofor}, ${h.arac.tel}\nLütfen durakta 5 dakika önce hazır olun.`;
  $('#form').hidden=true;$('#sonuc').hidden=false;$('#sonuc').innerHTML=`<p class="uyari"><b>${esc(isim)} ${h.id} aracına atandı.</b> Araçta ${h.personel} / ${h.kapasite} kişi oldu.</p><h3>Şoföre giden bildirimin önizlemesi</h3><div class="onizleme"><b>Yeni personel: ${esc(isim)}</b>\n${o.durak.ad}, ${o.durak.saat}\nAdres: ${A.ad}</div><h3>Personele WhatsApp mesajı önizlemesi</h3><div class="onizleme" id="wm">${esc(w)}</div><p class="kucuk">Demoda mesaj ve bildirim gönderilmez.</p><div class="iki"><button type="button" class="dugme" id="kopya">Mesajı kopyala</button><button type="button" class="dugme ikinci" id="yeniP">Başka personel ekle</button></div>`;
  $('#kopya').onclick=async()=>{let ok=false;try{await navigator.clipboard.writeText(w);ok=true;}catch(e){const t=document.createElement('textarea');t.value=w;document.body.append(t);t.select();ok=document.execCommand('copy');t.remove();}$('#kopya').textContent=ok?'Mesaj kopyalandı':'Kopyalanamadı, metni seçin';};
  $('#yeniP').onclick=()=>{ad.value='';bul();};panel.scrollTop=0;if(mobil()&&!panel.classList.contains('acik'))$('.tut').click();atamalar();};
 ad.oninput=()=>ad.setCustomValidity('');fr.onchange=ar.onchange=bul;$('#form').onsubmit=x=>{x.preventDefault();const b=$('[data-onay]');if(b)b.click();};bul();}

/* ==== HATLAR ==== */
if(S==='hatlar'){const m=harita($('#harita'));let sec=null,g,fl;if(m){g=L.layerGroup().addTo(m);m.fitBounds(sinir(D.hatlar),{padding:[30,30]});}
 function listele(){const q=$('#ara').value;$('#hatListe').innerHTML=D.hatlar.filter(h=>ara(h,q)||h.kod.toLocaleLowerCase('tr').includes(q.toLocaleLowerCase('tr'))).map(h=>`<button type="button" class="satir" data-h="${h.id}">${roz(h)}<span class="orta">${h.ad}<small>${h.kod}, günde ${h.seferler.length} tek</small></span>${h.erisim?'':'<span class="d gelmedi">Erişim kapalı</span>'}</button>`).join('')||'<p>Eşleşen hat yok.</p>';}
 function detay(h){sec=h;$('#liste').hidden=true;$('#detay').hidden=false;const n=h.seferler.length,k=h.arac.kendi;
  $('#detay').innerHTML=`<button type="button" class="dugme ikinci" id="geri">Hat listesi</button><div class="iki" style="align-items:center;margin:16px 0 6px">${roz(h)}<h2>${h.ad}</h2></div><dl class="bilgi"><dt>Fabrika</dt><dd>${h.firma.ad}</dd><dt>Hat kodu</dt><dd>${h.kod}</dd><dt>İzinli telefon</dt><dd>${h.arac.tel}</dd><dt>Araç, şoför</dt><dd>${h.plaka}, ${h.sofor}</dd></dl><div class="uyari${h.erisim?'':' kotu'}"><b>${h.erisim?'Erişim açık.':'Erişim kapalı.'}</b> ${h.erisim?'Bu kod yalnız izinli telefonda çalışır.':'Bu hatla şoför ekranına girilemez.'}</div><button type="button" class="dugme${h.erisim?' tehlike':''}" id="erisim">${h.erisim?'Erişimi kapat':'Erişimi aç'}</button><h3 style="margin:22px 0 6px">Tekler ve saat aralıkları</h3><table><thead><tr><th>Saat</th><th>Yön</th><th>Aralık</th></tr></thead><tbody>${h.seferler.map(s=>`<tr><td><b>${s.saat}</b></td><td>${s.yon}</td><td>${s.bas} ile ${s.bit}</td></tr>`).join('')}</tbody></table><h3 style="margin:22px 0 6px">Günlük hesap, ${n} tek</h3><dl class="bilgi"><dt>Taşeron</dt><dd>${k?'Kendi aracımız':`${n} × ${D.tl(h.taseronUcret)} = ${D.tl(n*h.taseronUcret)}`}</dd><dt>Fabrika</dt><dd>${n} × ${D.tl(h.firmaUcret)} = ${D.tl(n*h.firmaUcret)}</dd></dl>`;
  $('#geri').onclick=()=>{sec=null;$('#detay').hidden=true;$('#liste').hidden=false;$('#yariKart').hidden=true;listele();};
  $('#erisim').onclick=()=>{D.erisim(h.id,!h.erisim);const t=panel.scrollTop;detay(h);panel.scrollTop=t;$('#erisim').focus();};
  panel.scrollTop=0;$('#yariKart').hidden=false;const r=$('#yari');r.value=h.firma.yari;$('#yariAd').textContent=h.firma.ad+' alanı';
  if(m){g.clearLayers();fl&&m.off('zoomend',fl.ciz);alanCiz(g,h.firma,{weight:1,dashArray:'5 5',fill:false});const c=alanCiz(g,h.firma);m.setView(h.firma.k,15,{animate:false});if(mobil())m.panBy([0,-60],{animate:false});const ik=D.hatlar.filter(x=>x.firma===h.firma&&konum(x).d==='alanda');
   ik.forEach(x=>L.marker(konum(x).k,{icon:ikon(x,konum(x)),title:x.id}).on('click',()=>detay(x)).addTo(g));
   const yaz=()=>{c.setRadius(+r.value);const n=ik.filter(x=>D.km(konum(x).k,h.firma.k)*1000<=+r.value).length;$('#yariDeger').textContent=r.value+' m'+(+r.value===h.firma.yari?', kayıtlı değer':', önizleme');$('#yariSay').textContent=`Bu alanda ${n} araç var.`;};r.oninput=yaz;yaz();}}
 if(m)D.firmalar.forEach(f=>{alanCiz(g,f);L.marker(f.k,{title:f.ad,icon:L.divIcon({className:'',iconSize:[0,0],html:`<div class="levha">${f.ad}</div>`})}).on('click',()=>detay(D.hatlar.find(h=>h.firma===f))).addTo(g);});
 $('#ara').oninput=listele;$('#hatListe').onclick=x=>{const b=x.target.closest('[data-h]');if(b)detay(hatB(b.dataset.h));};listele();if(Q.get('hat')&&hatB(Q.get('hat')))detay(hatB(Q.get('hat')));}

/* ==== HAKEDİŞ ==== */
if(S==='hakedis'){let t='firma';const F=D.hakedis.firma.reduce((a,x)=>a+x.tutar,0),T=D.hakedis.taseron.reduce((a,x)=>a+x.tutar,0);
 $('#toplam').innerHTML=`<div><span>Fabrikalardan</span><b>${D.tl(F)}</b></div><div><span>Taşeronlara</span><b>${D.tl(T)}</b></div><div><span>Fark</span><b>${D.tl(F-T)}</b></div>`;
 const u=h=>t==='firma'?h.firmaUcret:h.taseronUcret;
 function ciz(){$$('[data-t]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===t));$('#not').textContent=t==='taseron'?'6 kendi aracımız taşeron hakedişine girmez.':'Kendi araçlarımızın yaptığı tekler fabrika hakedişine girer.';
  $('#icerik').innerHTML=D.hakedis[t].map(x=>`<details class="hk"><summary><span>${(x.firma||x.taseron).ad}</span><span class="gizle">${x.hatlar.length} hat</span><span class="gizle">${x.tek.toLocaleString('tr-TR')} tek</span><span class="sag">${D.tl(x.tutar)}</span></summary><div class="tabloKap"><table><thead><tr><th>Hat</th><th class="sag">Tek</th><th class="sag">Tek ücreti</th><th class="sag">Tutar</th></tr></thead><tbody>${x.hatlar.map(h=>`<tr><td>${roz(h)} ${h.ad}</td><td class="sag">${h.aylikTek}</td><td class="sag">${D.tl(u(h))}</td><td class="sag">${D.tl(h.aylikTek*u(h))}</td></tr>`).join('')}</tbody></table></div></details>`).join('');}
 $$('[data-t]').forEach(b=>b.onclick=()=>{t=b.dataset.t;ciz();});
 $('#csv').onclick=()=>{const s=[[t==='firma'?'Fabrika':'Taşeron','Hat','Hat adı','Plaka','Tek','Tek ücreti','Tutar'],...D.hakedis[t].flatMap(x=>x.hatlar.map(h=>[(x.firma||x.taseron).ad,h.id,h.ad,h.plaka,h.aylikTek,u(h),h.aylikTek*u(h)])),['Toplam','','','',D.hakedis[t].reduce((a,x)=>a+x.tek,0),'',D.hakedis[t].reduce((a,x)=>a+x.tutar,0)]];
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['﻿'+s.map(r=>r.join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}));a.download=`hakedis-${t==='firma'?'fabrika':'taseron'}-kasim-2026.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000);$('#csvDurum').textContent=a.download+' indirildi.';};ciz();}

/* ==== FİRMA ==== */
if(S==='firma'){const f=D.firmalar[0],hs=D.hatlar.filter(h=>h.firma===f);const m=harita($('#harita'),{scrollWheelZoom:false});if(m){alanCiz(m,f);m.fitBounds(sinir(hs),{padding:[30,30]});filo(m,hs);}
 $('#kim').textContent=`${f.yetkili}, ${f.ad}`;
 function ciz(){const ay=location.hash==='#aylik';$$('.firmaUst .sekme a').forEach(a=>a.toggleAttribute('aria-current',(a.hash==='#aylik')===ay));const ps=hs.flatMap(pu);
  $('#baslik').textContent=ay?'Kasım puantajı':'Bugünkü puantaj';$('#aciklama').textContent=ay?`1–24 Kasım kapanmış günler, ${hs.reduce((t,h)=>t+h.aylikTek,0).toLocaleString('tr-TR')} tek. Eksik günler turuncu.`:`${D.BUGUN_METIN}, ${D.SIMDI}. ${ps.filter(tamam).length} / ${ps.length} tek işlendi.`;
  $('#icerik').innerHTML=ay?aylikTablo(hs):`<table class="kat"><thead><tr><th>Hat</th><th>Araç</th><th>Tekler</th><th class="sag">İşlenen</th></tr></thead><tbody>${hs.map(h=>`<tr><td class="tam"><span class="hat">${h.id}</span>&nbsp; <b>${h.ad}</b></td><td data-b="Araç">${h.plaka}</td><td class="tam"><div class="tekler">${pu(h).map(p=>tekChip(p).replace('<br>Elle düzeltildi','')).join('')}</div></td><td class="sag" data-b="İşlenen">${islenen(h)} / ${h.seferler.length}</td></tr>`).join('')}</tbody></table>`;}
 addEventListener('hashchange',ciz);ciz();}

/* ==== MOBİL ==== */
if(S==='mobil'){const h=hatB('H1'),ps=pu(h),a=h.arac,ev=D.araclar.find(x=>x.enKotu==='yaklasiyor'),v=ev.evraklar.find(y=>y.durum==='yaklasiyor'),at=D.atamalar().slice(-1)[0],ah=at?hatB(at.hat):h,du=at?(ah.duraklar.find(d=>d.ad===at.durak)||ah.duraklar[0]):h.duraklar[1],pad=at?at.ad:'Zehra Tunç';
 const tl=(ic,c,saat)=>`<figure><div class="tlf"><div class="cubuk"><span>${saat||D.SIMDI}</span><span>4G</span></div><div class="ic">${ic}</div></div><figcaption>${c}</figcaption></figure>`;
 const bas=`<div class="iki" style="align-items:center;flex-wrap:nowrap">${roz(h)}<b>${h.ad}</b></div>`;
 $('#telefonlar').innerHTML=[
 tl(`<h3>Şoför girişi</h3><form class="form" id="giris" novalidate><label>Hat kodu<input name="k" value="${h.kod}" autocomplete="off"></label><label>Telefon<input name="t" value="${a.tel}" inputmode="tel" autocomplete="off"></label><button class="dugme">Giriş yap</button></form><div class="dolu" id="girisSonuc" role="status">Kod ve telefon firmanız tarafından verilir.</div>`,'Şoför, hattın kodu ve izinli telefonuyla girer. Deneyebilirsiniz.','06:20'),
 tl(`${bas}<h3>Bugünkü seferlerim</h3>${ps.map(p=>`<div class="sefer"><span><b>${p.sefer.saat}</b> ${p.sefer.yon}</span>${durum(p)}</div>`).join('')}`,'Şoför günün beş tekini ve durumunu görür.'),
 tl(`${bas}<div class="konum">Konum açık<br>Ekran kapalıyken de çalışıyor</div><p>Telefonu cebinize koyabilirsiniz. Alana girişiniz ve çıkışınız kendiliğinden işlenir.</p><div class="dolu"><b>Sıradaki tek</b><br>17:05 çıkış<br>${h.firma.ad}</div>`,'Konum arka planda çalışır, şoför hiçbir puantaj düğmesine basmaz.','17:04'),
 tl(`${bas}<p style="margin-top:34px">Tek işlendi</p><div class="buyuk">17:12</div><h3>17:05 çıkışı</h3><p>${h.firma.ad} alanından çıktınız.</p><div class="dolu">Sizin yapmanız gereken bir şey yok. Sıradaki tek 20:45 giriş.</div>`,'Araç alan sınırını geçince şoföre bilgi ekranı gelir.'),
 tl(`${bas}<div class="dolu kotu"><h3>İnternet yok</h3><p>Kayıt telefonda saklanıyor.</p></div><div class="sefer"><span><b>17:12</b> Çıkış</span><span class="d">Gönderilecek</span></div><p>Bağlantı gelince kayıt kendi saatiyle gönderilir. Seferinize devam edin.</p>`,'İnternet kesilse de giriş ve çıkış saati kaybolmaz.','17:13').replace('<span>4G</span>','<span>Bağlantı yok</span>'),
 tl(`<div class="iki" style="align-items:center;flex-wrap:nowrap">${roz(ah)}<b>${ah.ad}</b></div><div class="dolu"><p>Yeni personel</p><h3>${esc(pad)}</h3><p><br><b>${du.saat}</b><br>${du.ad}</p></div><p>Yarından itibaren bu durakta binecek.</p><p>Araçta ${ah.personel} / ${ah.kapasite} kişi var.</p>`,'Yeni personel atanınca şoföre gelen bildirimin önizlemesi.'),
 tl(`<div class="iki" style="align-items:center;flex-wrap:nowrap">${roz(ev.hat)}<b>${ev.plaka}</b></div><div class="dolu kotu"><h3>${v.ad}</h3><div class="buyuk">${v.gun} gün</div><p>Bitiş tarihi ${D.tarih(v.bitis)}</p></div><p>Yenilenen evrakı firmanıza iletin. Yeni tarih girilince uyarı kalkar.</p>`,'Evrak süresi yaklaşınca şoför de uyarı görür.'),
 tl(`<h3>Servis güzergâhınız</h3><div class="tlfHarita" id="th"></div><div><div class="buyuk">${du.saat}</div><b>${du.ad}</b></div><p>${ah.plaka}, ${ah.sofor}</p><p>${ah.firma.ad} servisi</p>`,'Personele gönderilecek bağlantıda açılan güzergâh sayfası.')].join('');
 $('#giris').onsubmit=x=>{x.preventDefault();const fm=x.target,rk=s=>s.replace(/\D/g,''),hh=D.hatlar.find(y=>y.kod===fm.k.value.trim().toLocaleUpperCase('tr')),o=$('#girisSonuc');let kotu=true,s;if(!hh)s='Bu hat kodu bulunamadı. Kodu kontrol edin.';else if(rk(hh.arac.tel)!==rk(fm.t.value))s='Bu telefon bu hat için izinli değil. Firmanızı arayın.';else if(!hh.erisim)s='Bu hattın erişimi yönetici tarafından kapatıldı.';else{kotu=false;s=`Hoş geldiniz ${hh.sofor}. ${hh.id} ${hh.ad}`;}o.textContent=s;o.classList.toggle('kotu',kotu);};
 const m=harita($('#th'),{dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,boxZoom:false,keyboard:false,sade:true});if(m){m.fitBounds(L.latLngBounds(yolu(ah)),{padding:[24,24]});rotaCiz(m,ah);L.circleMarker(du.k,{radius:9,color:'#fff',weight:3,fillColor:'#12303A',fillOpacity:1}).addTo(m);}
 $('#yazdir').onclick=()=>print();}
})();
