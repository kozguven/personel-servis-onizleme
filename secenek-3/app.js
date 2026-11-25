(function(){
'use strict';
const S=document.body.dataset.sayfa,ic=document.getElementById('ic');
const $=(q,k)=>(k||document).querySelector(q),$$=(q,k)=>[...(k||document).querySelectorAll(q)];
const e=t=>String(t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const kb=t=>t.toLocaleLowerCase('tr');
const yon=s=>s.yon.toLocaleLowerCase('tr');
const sefAd=s=>s.saat+' '+yon(s)+(s.yon==='Giriş'?'i':'ı');
const teks=h=>D.puantaj.filter(p=>p.hat===h);
const bitti=p=>p.durum==='islendi'||p.durum==='gec';
const mob=()=>matchMedia('(max-width:960px)').matches;
const durgun=matchMedia('(prefers-reduced-motion:reduce)').matches;
const hatAra=(h,q)=>kb([h.id,h.ad,h.plaka,h.kod,h.sofor,h.firma.ad].join(' ')).includes(kb(q.trim()));

/* Bu seçeneğin evrak kaydı: yenilenen tarih ve alınan randevu */
const EK='servis-s3-evrak';let ek={};try{ek=JSON.parse(sessionStorage.getItem(EK)||'{}');}catch(_){}
const evDurum=x=>{x.gun=Math.round((new Date(x.bitis)-new Date(D.BUGUN))/864e5);x.durum=x.gun<0?'gecti':x.gun<=30?'yaklasiyor':'gecerli';};
const kotu=a=>a.enKotu=a.evraklar.some(x=>x.durum==='gecti')?'gecti':a.evraklar.some(x=>x.durum==='yaklasiyor')?'yaklasiyor':'gecerli';
function ekUygula(){D.araclar.forEach(a=>{a.evraklar.forEach(x=>{const k=ek[a.plaka+'|'+x.ad];if(k){if(k.bitis){x.bitis=k.bitis;evDurum(x);}x.randevu=!!k.randevu;}});kotu(a);});}
ekUygula();
function ekYaz(a,x,o){ek[a.plaka+'|'+x.ad]=o;try{sessionStorage.setItem(EK,JSON.stringify(ek));}catch(_){}ekUygula();}
const evMetin=x=>x.gun<0?Math.abs(x.gun)+' gün önce bitti':x.gun===0?'bugün bitiyor':x.gun+' gün kaldı';

/* Gezinme */
const G=[['index','Bugün'],['puantaj','Puantaj'],['canli','Canlı'],['araclar','Araçlar'],['hatlar','Hatlar'],['hakedis','Hakediş']];
const cur=k=>k===S?' aria-current="page"':'';
if(S==='firma'){document.body.classList.add('f');$('#ust').innerHTML='<div class="ub firmaub"><b><a href="firma.html">Örnek Metal</a></b><nav aria-label="Gezinme"><a href="#bugun">Bugün</a><a href="#kasim">Kasım</a></nav></div>';}
else{$('#ust').innerHTML='<div class="ub"><b><a href="index.html">Servis Takip</a></b><nav aria-label="Ana gezinme">'+G.map(x=>`<a href="${x[0]}.html"${cur(x[0])}>${x[1]}</a>`).join('')+'</nav><a class="dg k" href="personel.html">Yeni personel</a></div>';
document.body.insertAdjacentHTML('beforeend',`<nav class="alt" aria-label="Alt gezinme"><a href="index.html"${cur('index')}>Bugün</a><a href="puantaj.html"${cur('puantaj')}>Puantaj</a><a class="or" href="personel.html">Yeni personel</a><a href="hatlar.html"${cur('hatlar')}>Hatlar</a><button type="button" id="mn" aria-expanded="false">Ekranlar</button></nav>`);}
document.body.insertAdjacentHTML('beforeend','<button id="ekr" type="button" aria-expanded="false">Ekranlar</button><div id="tost" role="status" aria-live="polite"></div>');
function panel(){const v=$('#panel');const a=!v;[$('#ekr'),$('#mn')].forEach(b=>b&&b.setAttribute('aria-expanded',a));if(v)return v.remove();
const L=S==='firma'?[['index','Yönetici ekranı'],['firma','Fabrika yetkilisi'],['mobil','Şoför uygulaması']]:[...G,['personel','Yeni personel'],['firma','Fabrika yetkilisi'],['mobil','Şoför uygulaması']];
const tum=S==='firma'?[...G.slice(0,5),['hakedis','Ay sonu'],['personel','Yeni personel'],...L.slice(1)]:L;
document.body.insertAdjacentHTML('beforeend','<nav id="panel" aria-label="Ekranlar">'+tum.map(x=>`<a href="${x[0]}.html"${cur(x[0])}>${x[1]}</a>`).join('')+'<a href="../index.html">Bütün seçenekler</a><button type="button">Demoyu başa al</button></nav>');
$('#panel button').onclick=()=>{sessionStorage.removeItem(EK);D.sifirla();};$('#panel a').focus();}
$('#ekr').onclick=panel;if($('#mn'))$('#mn').onclick=panel;
document.addEventListener('keydown',x=>{if(x.key==='Escape'&&$('#panel')){panel();$('#ekr').focus();}});
document.addEventListener('click',x=>{if($('#panel')&&!x.target.closest('#panel,#ekr,#mn'))panel();});
let tz;function tost(t){const k=$('#tost');k.textContent=t;k.classList.add('ac');clearTimeout(tz);tz=setTimeout(()=>k.classList.remove('ac'),5500);}

/* Durak çizgisi */
const bus='<svg viewBox="0 0 44 26" aria-hidden="true"><rect x="2" y="1" width="40" height="19" rx="5" fill="currentColor"/><path d="M6 5h8v6H6zm10 0h8v6h-8zm10 0h8v6h-8zm10 0h4v6h-4z" fill="#fff"/><circle cx="12" cy="21" r="4.5" fill="#2b1a20"/><circle cx="33" cy="21" r="4.5" fill="#2b1a20"/></svg>';
function konum(ts){let i=-1;ts.forEach((p,j)=>{if(p.durum!=='planli'&&p.durum!=='bekliyor')i=j;});return i;}
function rail(ts,min){const n=ts.length,i=konum(ts),ac=ts.findIndex(p=>p.durum==='bekliyor');const p=n>1?Math.max(0,i)/(n-1):0;
const x=ac>=0?Math.max(.12,ac/n):(Math.max(0,i)+.5)/n;
return `<div class="rail${min?' min':''}" style="--n:${n};--p:${p};--x:${x*100}%" role="img" aria-label="${ts.map(q=>sefAd(q.sefer)+': '+D.durumAd[q.durum]).join(', ')}"><div class="dl"></div>${min?'':`<div class="arac">${bus}</div>`}${ts.map(q=>`<div class="nk ${q.durum}"><i></i>${min?q.sefer.saat:`<b>${q.sefer.saat}</b>${q.sefer.yon}<br>${q.gerceklesen||(q.durum==='bekliyor'?'bekliyor':q.durum==='gelmedi'?'gelmedi':'planlı')}`}</div>`).join('')}</div>`;}
const lejant=()=>'<div class="lej" aria-label="İşaretler">'+Object.keys(D.durumAd).map(k=>`<span class="nk ${k}"><i></i>${D.durumAd[k]}</span>`).join('')+'</div>';
let oynuyor=false;
function canlandir(p,kutu,son){
 if(!p.hat.erisim){tost(p.hat.id+' erişimi kapalı, telefondan konum gelmiyor. Önce hat kartından erişimi açın.');return;}
 if(bitti(p)){tost('Bu tek zaten işlendi, iki kez sayılmaz.');return;}
 if(oynuyor)return;oynuyor=true;
 const r=kutu&&$('.rail:not(.min)',kutu),ts=teks(p.hat),j=ts.indexOf(p),n=ts.length;
 const b=kutu&&$('[data-can]',kutu);if(b){b.disabled=true;b.textContent=p.sefer.yon==='Giriş'?'Araç alana giriyor':'Araç alandan çıkıyor';}
 if(r){r.style.setProperty('--x',(j+.5)/n*100+'%');if(n>1)r.style.setProperty('--p',j/(n-1));}
 setTimeout(()=>{oynuyor=false;if(D.tekIsle(p.id,D.SIMDI)){const h=p.hat;tost(`${h.id}: ${sefAd(p.sefer)} ${D.SIMDI}'de kendiliğinden işlendi. `+(h.taseronUcret?`Taşeron +${D.tl(h.taseronUcret)}, `:'Kendi aracımız, ')+`fabrika +${D.tl(h.firmaUcret)}.`);}son&&son();},durgun?0:1700);}
function hatHesap(h){const ts=teks(h),b=ts.filter(bitti).length,n=ts.length,k=!h.taseronUcret;
return `<dl class="tut"><dt>Bugün işlenen</dt><dd>${b} / ${n} tek</dd><dt>Şu ana kadar taşeron</dt><dd>${k?'kendi aracımız':D.tl(b*h.taseronUcret)}</dd><dt>Şu ana kadar fabrika</dt><dd>${D.tl(b*h.firmaUcret)}</dd><dt>Gün tam olursa taşeron</dt><dd>${k?'kendi aracımız':`${n} × ${h.taseronUcret.toLocaleString('tr-TR')} = ${D.tl(n*h.taseronUcret)}`}</dd><dt>Gün tam olursa fabrika</dt><dd>${n} × ${h.firmaUcret.toLocaleString('tr-TR')} = ${D.tl(n*h.firmaUcret)}</dd></dl>`;}
function duzeltForm(p){return `<form data-duz="${p.id}"><label class="al">Ne oldu?<select name="d"><option value="islendi">Sefer yapıldı</option><option value="gelmedi">Araç gelmedi</option></select></label><label class="al" data-st>Gerçek saat<input type="time" name="s" value="${p.gerceklesen||p.sefer.saat}" required></label><label class="al">Gerekçe<input type="text" name="g" placeholder="Örnek: şoförün telefonu kapalıydı" autocomplete="off"></label><p class="hata" role="alert"></p><div class="ds"><button class="dg k">Düzeltmeyi kaydet</button></div></form>`;}
function duzeltBag(kok,son){$$('form[data-duz]',kok).forEach(f=>{f.d.onchange=()=>{$('[data-st]',f).hidden=f.d.value==='gelmedi';f.s.required=f.d.value!=='gelmedi';};
f.onsubmit=x=>{x.preventDefault();const g=f.g.value.trim();if(!g){$('.hata',f).textContent='Gerekçe yazın, düzeltme gerekçesiz kaydedilmez.';f.g.focus();return;}
const p=D.duzelt(f.dataset.duz,f.d.value,f.s.value,g);tost(`${p.hat.id} ${sefAd(p.sefer)} düzeltildi: ${D.durumAd[p.durum]}.`);son();};});}
function evForm(a,x){return `<form data-ev="${a.plaka}|${x.ad}"><label class="al">Yeni bitiş tarihi<input type="date" name="t" min="${D.BUGUN}" required></label><p class="hata" role="alert"></p><div class="ds"><button class="dg k">Tarihi kaydet</button>${x.randevu?'':'<button type="button" class="lk" data-rnd>Randevu alındı</button>'}</div></form>`;}
function evBag(kok,son){$$('form[data-ev]',kok).forEach(f=>{const [pl,ad]=f.dataset.ev.split('|'),a=D.araclar.find(q=>q.plaka===pl),x=a.evraklar.find(q=>q.ad===ad);
f.onsubmit=q=>{q.preventDefault();const v=f.t.value;if(!v||v<D.BUGUN){$('.hata',f).textContent='Bugünden sonraki bir tarih seçin.';return;}ekYaz(a,x,{bitis:v});tost(`${pl} ${ad}: yeni bitiş ${D.tarih(v)}.`);son();};
const r=$('[data-rnd]',f);if(r)r.onclick=()=>{ekYaz(a,x,{...(ek[f.dataset.ev]||{}),randevu:true});tost(`${pl} ${ad}: randevu alındı olarak işaretlendi.`);son();};});}

/* Ana liste + ayrıntı (masaüstünde yan yana, telefonda satırın altında) */
function anaAyrinti(kap,ogeler,satir,ayrinti,bag,ilk){
 let sec=ilk!=null&&ogeler.some(o=>o.id===ilk)?ilk:(mob()?null:(ogeler[0]||{}).id);
 kap.innerHTML=ogeler.length?'<div class="md"><div class="ls">'+ogeler.map(o=>`<button type="button" class="ogr" data-id="${e(o.id)}" aria-expanded="false">${satir(o)}</button>`).join('')+'</div><aside class="dt" aria-live="polite"></aside></div>':'<p class="bos">Aramanıza uyan kayıt yok. Aramayı ya da süzgeci değiştirin.</p>';
 if(!ogeler.length)return;
 const goster=(kay)=>{$$('.dtm',kap).forEach(d=>d.remove());$$('.ogr',kap).forEach(b=>b.setAttribute('aria-expanded',b.dataset.id===sec));const o=ogeler.find(q=>q.id===sec);let k=$('.dt',kap);if(!o){k.innerHTML='';return;}
 if(mob()){k=document.createElement('div');k.className='dtm';$(`.ogr[data-id="${CSS.escape(sec)}"]`,kap).after(k);}
 k.innerHTML=ayrinti(o);bag&&bag(k,o,()=>{const b=$(`.ogr[data-id="${CSS.escape(o.id)}"]`,kap);if(b)b.innerHTML=satir(o);goster();});};
 $$('.ogr',kap).forEach(b=>b.onclick=()=>{sec=mob()&&sec===b.dataset.id?null:b.dataset.id;goster();});goster();
 matchMedia('(max-width:960px)').onchange=()=>kap.isConnected&&goster();}
const opt=(l,v)=>l.map(x=>`<option value="${x[0]}"${x[0]===v?' selected':''}>${x[1]}</option>`).join('');
const firmaOpt=()=>opt([['','Bütün fabrikalar'],...D.firmalar.map(f=>[f.id,f.ad])]);

const sayfa={
index(){
 let acik=null;const gen={};
 const h1=D.hatlar[0],h1p=D.puantaj.find(p=>p.id==='H1-3');
 ic.innerHTML='<section class="durum" id="dr"></section><div class="iki"><section id="isler"></section><div class="yan"><section class="h1k" id="h1k"></section><section id="vr"></section></div></div>';
 const cumle=()=>{const s=D.sayilar();return [`Bugün ${s.islendi+s.gec} tek işlendi, ${s.bekliyor} tek bekliyor.`,`${D.BUGUN_METIN}, saat ${D.SIMDI}. Günün toplamı ${s.toplam} tek. ${s.gelmedi?s.gelmedi+' tekte araç gelmedi, ':''}${s.planli} tekin saati henüz gelmedi.`];};
 function liste(){const ev=[];D.araclar.forEach(a=>a.evraklar.forEach(x=>{if(x.durum!=='gecerli'&&!x.randevu)ev.push({id:'E'+a.plaka+x.ad,a,x});}));ev.sort((m,n)=>m.x.gun-n.x.gun);
 const P=d=>D.puantaj.filter(p=>p.durum===d&&!p.gerekce).map(p=>({id:p.id,p}));
 return [['gelmedi','Gelmeyen tekler','Düzelt',P('gelmedi')],['gec','Geç işlenen tekler','Kontrol et',P('gec')],['evrak','Süresi geçen ve yaklaşan evrak','Tarih yaz',ev],['bekliyor','Aralığı açık tekler','Çizgide gör',P('bekliyor')]];}
 const metin=(k,o)=>k==='evrak'?[`${o.a.plaka}, ${o.x.ad.toLocaleLowerCase('tr')}`,`<span class="rz ${o.x.durum}">${evMetin(o.x)}</span>, ${o.a.sofor}`]:[`${o.p.hat.id} ${o.p.hat.ad}`,k==='gec'?`${sefAd(o.p.sefer)}, <span class="rz gec">${o.p.gerceklesen} saatinde geç işlendi</span>`:`${sefAd(o.p.sefer)}, aralık ${o.p.sefer.bas} ile ${o.p.sefer.bit} arası`];
 const icerik=(k,o)=>{if(k==='gelmedi')return `<p>${o.p.hat.sofor}, ${o.p.hat.arac.tel}. Aralık ${o.p.sefer.bit} saatinde kapandı, kayıt gelmedi.</p>`+duzeltForm(o.p);
 if(k==='gec')return `<p>Aralık ${o.p.sefer.bit} saatinde kapandı, araç ${o.p.gerceklesen} saatinde göründü. Tek sayıldı.</p><form data-gec="${o.p.id}"><label class="al">Neden gecikti?<select name="g">${['Trafik','Araç arızası','Fabrika geç bıraktı','Telefon geç bağlandı'].map(x=>`<option>${x}</option>`).join('')}</select></label><div class="ds"><button class="dg k">Nedeni kaydet</button></div></form>`;
 if(k==='evrak')return `<p>Bitiş tarihi ${D.tarih(o.x.bitis)}, hat ${o.a.hat.id} ${o.a.hat.ad}.</p>`+evForm(o.a,o.x);
 return rail(teks(o.p.hat))+`<div class="ds"><button type="button" class="dg k" data-can="${o.p.id}">${o.p.sefer.yon==='Giriş'?'Aracı alana sok':'Aracı alandan çıkar'}</button><small>Bu düğme demo içindir, gerçekte kendiliğinden olur.</small></div>`;};
 function ciz(odak){
  const c=cumle();$('#dr').innerHTML=`<h1>${c[0]}</h1><p>${c[1]}</p>`;
  const L=liste(),top=L.reduce((a,g)=>a+g[3].length,0);
  $('#isler').innerHTML=`<h2 style="margin-bottom:18px">${top?`İlgilenmeniz gereken ${top} iş var`:'Bugünün işleri bitti'}</h2>`+(top?L.filter(g=>g[3].length).map(([k,ad,ey,o])=>{const g=gen[k]?o:o.slice(0,3);return `<div class="grup" data-g="${k}"><h3>${ad}, ${o.length}</h3>${g.map(q=>{const m=metin(k,q),a=acik===q.id;return `<div class="is" data-is="${e(q.id)}"><div class="sat"><div><p>${m[0]}</p><p class="kck">${m[1]}</p></div><button type="button" class="dg s k" data-ac="${e(q.id)}" aria-expanded="${a}">${a?'Kapat':ey}</button></div>${a?`<div class="ic">${icerik(k,q)}</div>`:''}</div>`;}).join('')}${o.length>3?`<button type="button" class="lk" data-gen="${k}">${gen[k]?'Daha az göster':`Kalan ${o.length-3} işi göster`}</button>`:''}</div>`;}).join(''):'<div class="bos"><h3>Yapılacak iş kalmadı</h3><p>Bütün tekler ve evraklar kontrol edildi. Yeni bir iş çıkınca burada görünür.</p></div>');
  const oc=id=>{const p=D.puantaj.find(q=>q.id===id);return p;};
  $$('[data-ac]').forEach(b=>b.onclick=()=>{const id=b.dataset.ac;acik=acik===id?null:id;ciz();const y=$(`[data-ac="${CSS.escape(id)}"]`);y&&y.focus({preventScroll:true});});
  $$('[data-gen]').forEach(b=>b.onclick=()=>{gen[b.dataset.gen]=!gen[b.dataset.gen];ciz();const y=$(`[data-gen="${b.dataset.gen}"]`);y&&y.focus({preventScroll:true});});
  const son=()=>{acik=null;ciz(true);};
  duzeltBag($('#isler'),son);evBag($('#isler'),son);
  $$('form[data-gec]').forEach(f=>f.onsubmit=x=>{x.preventDefault();const p=oc(f.dataset.gec);D.duzelt(p.id,'gec',p.gerceklesen,f.g.value);tost(`${p.hat.id} ${sefAd(p.sefer)}: neden kaydedildi, tek sayılmaya devam ediyor.`);son();});
  $$('#isler [data-can]').forEach(b=>b.onclick=()=>canlandir(oc(b.dataset.can),b.closest('.ic'),son));
  $('#h1k').innerHTML=`<h2>${h1.id} ${h1.ad}</h2><p class="kck">${h1.plaka}, ${h1.sofor}, ${h1.firma.ad}</p>${rail(teks(h1))}<p><span class="rz ${h1p.durum}">${sefAd(h1p.sefer)}: ${D.durumAd[h1p.durum]}${h1p.gerceklesen?', '+h1p.gerceklesen:''}</span></p>${hatHesap(h1)}<button type="button" class="dg" data-can="1" style="width:100%">Aracı alandan çıkar</button><p class="kck" style="margin-top:8px">Bu düğme demo içindir. Gerçekte araç alandan çıkınca tek kendiliğinden işlenir.</p>`;
  $('#h1k [data-can]').onclick=()=>canlandir(h1p,$('#h1k'),()=>{ciz();$('#h1k [data-can]').focus({preventScroll:true});});
  const v={};D.puantaj.forEach(p=>{const k=p.sefer.saat+' '+yon(p.sefer);(v[k]=v[k]||[]).push(p);});
  $('#vr').innerHTML='<h2>Vardiya saatleri</h2><table class="vrd"><thead><tr><th>Saat</th><th>İşlenen</th><th>Durum</th></tr></thead><tbody>'+Object.keys(v).sort().map(k=>{const o=v[k],b=o.filter(bitti).length,w=o.filter(p=>p.durum==='bekliyor').length,y=o.filter(p=>p.durum==='gelmedi').length,pl=o.filter(p=>p.durum==='planli').length;return `<tr><td><b>${k}</b></td><td>${b} / ${o.length}</td><td>${w?`<span class="rz bekliyor">${w} bekliyor</span>`:y?`<span class="rz gelmedi">${y} gelmedi</span>`:pl?'<span class="rz planli">planlı</span>':'<span class="rz islendi">tamam</span>'}</td></tr>`;}).join('')+'</tbody></table>';
  if(odak){const n=$('[data-ac]');n&&n.focus({preventScroll:true});}
 }
 ciz();
},
puantaj(){
 let sek='gun',f='',d='',q='',sec=null;
 ic.innerHTML='<div class="sk" role="group" aria-label="Görünüm"><button data-s="gun">Bugün</button><button data-s="ay">Kasım, gün gün</button></div><label><span class="kck">Hat, plaka ya da şoför ara</span><input class="buyuk" type="search" id="q"></label><div class="sz"><label>Fabrika<select id="f">'+firmaOpt()+'</select></label><label>Durum<select id="d"></select></label></div><div id="l"></div>';
 const ciz=()=>{const hs=D.hatlar.filter(h=>(!f||h.firma.id===f)&&hatAra(h,q));$$('.sk button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===sek));
 if(sek==='gun'){const g=hs.filter(h=>!d||teks(h).some(p=>p.durum===d));$('#l').innerHTML=`<p class="kck">${g.length} hat gösteriliyor</p>${lejant()}<div id="m"></div>`;
  anaAyrinti($('#m'),g,h=>`<span class="u"><b>${h.id} ${h.ad}</b><span class="kck">${teks(h).filter(bitti).length} / ${h.seferler.length} tek</span></span>${rail(teks(h),1)}`,
  h=>`<h2>${h.id} ${h.ad}</h2><p class="kck">${h.firma.ad}, ${h.plaka}, ${h.sofor}</p>${rail(teks(h))}<ul class="stl">${teks(h).map(p=>`<li><div class="u"><div><b>${sefAd(p.sefer)}</b><br><span class="rz ${p.durum}">${D.durumAd[p.durum]}${p.gerceklesen?' '+p.gerceklesen:''}</span><br><small>Aralık ${p.sefer.bas} ile ${p.sefer.bit} arası${p.gerekce?'<br>Gerekçe: '+e(p.gerekce):''}</small></div>${p.durum==='planli'||p.durum==='bekliyor'?'':`<button type="button" class="dg ${p.durum==='gelmedi'?'':'s '}k" data-d="${p.id}" aria-expanded="false">Düzelt</button>`}</div><div data-y="${p.id}"></div></li>`).join('')}</ul>${hatHesap(h)}`,
  (k,h,yen)=>{sec=h.id;$$('[data-d]',k).forEach(b=>b.onclick=()=>{const y=$(`[data-y="${b.dataset.d}"]`,k),a=!y.innerHTML;y.innerHTML=a?'<div class="ic">'+duzeltForm(D.puantaj.find(p=>p.id===b.dataset.d))+'</div>':'';b.textContent=a?'Kapat':'Düzelt';b.setAttribute('aria-expanded',a);duzeltBag(y,yen);});},sec);
 }else{const g=hs.filter(h=>!d||h.aylik.some(n=>n!=null&&n<h.seferler.length));
  $('#l').innerHTML=`<p style="margin-bottom:12px">1–24 Kasım kapanmış günler. ${g.length} hatta ${g.reduce((a,h)=>a+h.aylikTek,0).toLocaleString('tr-TR')} tek yapıldı. Eksik tekli günler işaretli, pazar günleri sefer yok.</p>`+(g.length?`<div class="tabk" tabindex="0" role="region" aria-label="Kasım puantajı"><table><thead><tr><th>Hat</th>${D.gunler.map(x=>`<th>${x.gun}</th>`).join('')}<th>Toplam</th></tr></thead><tbody>${g.map(h=>`<tr><td><b>${h.id}</b> ${h.ad}</td>${h.aylik.map(n=>n==null?'<td class="pz">–</td>':`<td${n<h.seferler.length?' class="ek"':''}>${n}</td>`).join('')}<td><b>${h.aylikTek}</b></td></tr>`).join('')}</tbody></table></div>`:'<p class="bos">Aramanıza uyan hat yok.</p>');}};
 const dO=()=>{d='';$('#d').innerHTML=sek==='gun'?opt([['','Bütün durumlar'],...Object.entries(D.durumAd)]):opt([['','Bütün hatlar'],['ek','Eksik teki olanlar']]);};
 $$('.sk button').forEach(b=>b.onclick=()=>{sek=b.dataset.s;dO();ciz();});$('#f').onchange=x=>{f=x.target.value;ciz();};$('#d').onchange=x=>{d=x.target.value;ciz();};$('#q').oninput=x=>{q=x.target.value;ciz();};
 dO();ciz();
},
canli(){
 let sec='H1',map,mk={};
 ic.innerHTML='<div class="hgrid"><div><div class="harita" id="hr"></div><p class="kck" style="margin-top:10px">Daireler fabrika alanları. Araç konumları örnektir. Mavi: aralık açık, yeşil: son teki işlendi, gri: seferde olmayan aracın son yeri.</p></div><div><label><span class="kck">Araç seç</span><select id="as"></select></label><div id="ad" style="margin-top:22px" aria-live="polite"></div></div></div>';
 $('#as').innerHTML=D.hatlar.map(h=>`<option value="${h.id}">${h.id} ${h.ad}, ${h.plaka}</option>`).join('');
 const dur=h=>{const ts=teks(h);if(ts.some(p=>p.durum==='bekliyor'))return 'bekliyor';return ts.some(p=>bitti(p)&&D.dk(D.SIMDI)>=D.dk(p.sefer.bas)&&D.dk(D.SIMDI)<=D.dk(p.sefer.bit))?'islendi':'dis';};
 const yer=h=>{const k=h.firma.k,d=dur(h),a=h.no*2.4;if(d==='bekliyor'){const r=h.firma.yari*.55/111000;return [k[0]+Math.cos(a)*r,k[1]+Math.sin(a)*r/.75];}
 const t=h.duraklar[d==='dis'?0:h.duraklar.length-1].k;if(d==='dis')return t;const u=.35;return [k[0]+(t[0]-k[0])*u,k[1]+(t[1]-k[1])*u];};
 const ik=h=>L.divIcon({className:'',iconSize:[44,44],iconAnchor:[17,17],html:`<div class="hm ${dur(h)}${h.id===sec?' secili':''}">${h.no}</div>`});
 const det=()=>{const h=D.hatlar.find(x=>x.id===sec),p=teks(h).find(x=>x.durum==='bekliyor'),sn=teks(h).find(x=>bitti(x)&&D.dk(D.SIMDI)>=D.dk(x.sefer.bas)&&D.dk(D.SIMDI)<=D.dk(x.sefer.bit)),c=p||sn;$('#as').value=sec;
 $('#ad').innerHTML=`<h2>${h.id} ${h.ad}</h2><p>${h.plaka}, ${h.sofor}<br>${h.firma.ad}, alan yarıçapı ${h.firma.yari} m</p>${h.erisim?'':'<p class="hata">Hattın erişimi kapalı, konum gelmiyor.</p>'}${rail(teks(h))}<p style="margin:12px 0">Doluluk ${h.personel} / ${h.kapasite}</p>${c?`<button type="button" class="dg" data-can="1" style="width:100%">${c.sefer.yon==='Giriş'?'Aracı alana sok':'Aracı alandan çıkar'}</button><p class="kck" style="margin-top:8px">Bu düğme demo içindir.</p>`:'<p class="kck">Bu hattın şu an açık aralığı yok.</p>'}`;
 const b=$('#ad [data-can]');if(b)b.onclick=()=>{const h0=h,basla=!bitti(c)&&h.erisim&&!oynuyor;if(basla&&map){const m=mk[h.id],a=yer(h),t=h.duraklar[h.duraklar.length-1].k,hd=[h.firma.k[0]+(t[0]-h.firma.k[0])*.35,h.firma.k[1]+(t[1]-h.firma.k[1])*.35],s=performance.now();map.setView(h.firma.k,14);const ad=z=>{const u=Math.min(1,(z-s)/1600);m.setLatLng([a[0]+(hd[0]-a[0])*u,a[1]+(hd[1]-a[1])*u]);if(u<1)requestAnimationFrame(ad);};if(!durgun)requestAnimationFrame(ad);}
 canlandir(c,$('#ad'),()=>{if(map){mk[h0.id].setLatLng(yer(h0));mk[h0.id].setIcon(ik(h0));}det();});};};
 const secil=(id,git)=>{const o=sec;sec=id;if(map){[o,id].forEach(q=>mk[q].setIcon(ik(D.hatlar.find(h=>h.id===q))));if(git)map.setView(mk[id].getLatLng(),14);}det();};
 if(window.L){map=L.map('hr');map.fitBounds(D.firmalar.map(f=>f.k),{padding:[70,70]});L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıcıları'}).addTo(map);
 D.firmalar.forEach(f=>L.circle(f.k,{radius:f.yari,color:'#6b1830',weight:3,fillColor:'#c3dff0',fillOpacity:.55}).addTo(map).bindTooltip(f.ad+', '+f.yari+' m'));
 D.hatlar.forEach(h=>mk[h.id]=L.marker(yer(h),{icon:ik(h),title:h.id+' '+h.ad,alt:h.id}).addTo(map).on('click',()=>secil(h.id)));}
 else $('#hr').innerHTML='<p style="padding:28px">Harita için internet bağlantısı gerekir. Araçları yandaki listeden seçebilirsiniz.</p>';
 $('#as').onchange=x=>secil(x.target.value,1);det();
},
araclar(){
 let s=new URLSearchParams(location.search).get('s')||'',q='',sec=null;D.araclar.forEach(a=>a.id=a.plaka);
 ic.innerHTML='<label><span class="kck">Plaka, şoför ya da hat ara</span><input class="buyuk" type="search" id="q"></label><div class="sk" style="margin-top:16px" role="group" aria-label="Süzgeç"></div><div id="l"></div>';
 const F=[['','Hepsi',()=>1],['gecti','Süresi geçen',a=>a.evraklar.some(x=>x.durum==='gecti')],['yaklasiyor','Yaklaşan',a=>a.evraklar.some(x=>x.durum==='yaklasiyor')],['bos','Boş yeri olan',a=>a.hat.bos>0],['kendi','Kendi araçlarımız',a=>a.kendi]];
 const satir=a=>{const k=a.evraklar.filter(x=>x.durum===a.enKotu);return `<span class="u"><b>${a.plaka}</b><span class="rz ${a.enKotu}">${a.enKotu==='gecerli'?'Evrak tamam':k[0].ad+', '+evMetin(k[0])}</span></span><span class="kck">${a.hat.id} ${a.hat.ad}, ${a.sofor}</span><span class="dol" style="display:block"><i style="width:${a.doluluk}%"></i></span><span class="kck">${a.personel} / ${a.kapasite} dolu, ${a.hat.bos} boş yer</span>`;};
 const ciz=()=>{$('.sk').innerHTML=F.map(f=>`<button data-s="${f[0]}" aria-pressed="${s===f[0]}">${f[1]}, ${D.araclar.filter(f[2]).length}</button>`).join('');$$('.sk button').forEach(b=>b.onclick=()=>{s=b.dataset.s;ciz();$(`.sk [data-s="${s}"]`).focus();});
 const l=D.araclar.filter(F.find(f=>f[0]===s)[2]).filter(a=>hatAra(a.hat,q));
 anaAyrinti($('#l'),l,satir,a=>`<h2>${a.plaka}</h2><p>${a.sofor}, ${a.tel}<br>${a.kendi?'Kendi aracımız':a.taseron.ad}<br>${a.hat.id} ${a.hat.ad}</p><ul class="stl">${a.evraklar.map((x,i)=>`<li><div class="u"><div><b>${x.ad}</b><br><span class="rz ${x.durum}">${D.tarih(x.bitis)}, ${evMetin(x)}</span>${x.randevu?'<br><small>Randevu alındı</small>':''}</div><button type="button" class="dg ${x.durum==='gecerli'?'s ':''}k" data-i="${i}" aria-expanded="false">Tarih yaz</button></div><div data-y="${i}"></div></li>`).join('')}</ul>`,
 (k,a,yen)=>{sec=a.id;$$('[data-i]',k).forEach(b=>b.onclick=()=>{const y=$(`[data-y="${b.dataset.i}"]`,k),ac=!y.innerHTML;y.innerHTML=ac?'<div class="ic">'+evForm(a,a.evraklar[b.dataset.i])+'</div>':'';b.setAttribute('aria-expanded',ac);b.textContent=ac?'Kapat':'Tarih yaz';evBag(y,()=>ciz());});},sec);};
 $('#q').oninput=x=>{q=x.target.value;ciz();};ciz();
},
personel(){
 let ad='',fi='',adr=-1,sec=0,adim=1,son=null;
 const ozet=()=>{const f=D.firmalar.find(x=>x.id===fi),a=D.ornekAdresler[adr];return `<aside class="oz"><h3>Girdikleriniz</h3><dl class="tut"><dt>Personel</dt><dd>${e(ad)||'henüz yok'}</dd><dt>Fabrika</dt><dd>${f?f.ad:'henüz yok'}</dd><dt>Adres</dt><dd>${a?a.ad:'henüz yok'}</dd></dl><p class="kck">Araçlar durağın adrese uzaklığına göre sıralanır. Uzaklık kuş uçuşudur. Dolu araçlar önerilmez.</p></aside>`;};
 function ciz(){
 const A=['Kim ve nerede çalışıyor','Adresi','Aracı'];
 const ust=`<ol class="adim">${A.map((t,i)=>`<li ${i+1===adim?'aria-current="step"':i+1<adim?'class="ok"':''}>${i+1}. ${t}</li>`).join('')}</ol>`;let g='';
 if(adim===1)g=`<form id="a1" novalidate><label class="al">Adı soyadı<input type="text" id="ad" value="${e(ad)}" autocomplete="off"></label><h3 style="margin:20px 0 10px">Hangi fabrikada çalışacak?</h3>${D.firmalar.map(f=>`<button type="button" class="sec" data-f="${f.id}" aria-pressed="${fi===f.id}"><b>${f.ad}</b>, ${f.ilce}</button>`).join('')}<p class="hata" role="alert"></p><button class="dg" style="margin-top:8px">Adrese geç</button></form>`;
 if(adim===2)g=`<h2>${e(ad)} nerede oturuyor?</h2><p class="kck" style="margin:6px 0 16px">Demoda örnek adresler var, serbest adres arama yok.</p>${D.ornekAdresler.map((a,i)=>`<button type="button" class="sec" data-a="${i}" aria-pressed="${adr===i}">${a.ad}</button>`).join('')}<button class="lk" data-geri>Geri dön</button>`;
 if(adim===3){const o=D.enYakin(D.ornekAdresler[adr].k,fi,3);if(sec>=o.length)sec=0;g=o.length?`<h2 style="margin-bottom:14px">En yakın ${o.length} araç</h2>${o.map((x,i)=>`<button type="button" class="sec" data-o="${i}" aria-pressed="${sec===i}"><b>${x.hat.id} ${x.hat.ad}</b>, ${x.km.toLocaleString('tr-TR',{maximumFractionDigits:1,minimumFractionDigits:1})} km<br>${x.durak.ad}, ${x.durak.saat}<br><span class="kck">${x.hat.plaka}, ${x.hat.bos} boş yer</span></button>`).join('')}<button class="dg" id="onay" style="width:100%;margin-top:6px">${o[sec].hat.id} hattına ata</button><button class="lk" data-geri>Geri dön</button>`:'<p class="bos">Bu fabrikaya giden boş yerli araç yok.</p><button class="lk" data-geri>Geri dön</button>';}
 if(adim===4){const {h,d}=son;const wa=`Merhaba ${ad}, ${h.firma.ad} servisiniz hazır.\n\nDurak: ${d.ad}\nBiniş saati: ${d.saat}\nAraç: ${h.plaka}\nŞoför: ${h.sofor}\n\nLütfen durakta 5 dakika önce olun.`;
 ic.innerHTML=`<div class="bos" style="margin-bottom:30px" tabindex="-1" id="tm"><h2>${e(ad)}, ${h.id} hattına atandı</h2><p>${h.ad} aracında şimdi ${h.personel} / ${h.kapasite} kişi var, ${h.bos} boş yer kaldı.</p></div><div class="iki" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))"><section><h2>Şoföre bildirim önizlemesi</h2><div class="msj b">Yeni personel: ${e(ad)}\n${d.ad}, ${d.saat}\n${h.id} hattında artık ${h.personel} kişi var.</div><p class="kck">${h.sofor} uygulamada böyle görecek. Demoda gönderilmez.</p></section><section><h2>WhatsApp mesajı önizlemesi</h2><div class="msj" id="wa">${e(wa)}</div><button class="dg" id="kp">Mesajı kopyala</button><p class="kck" style="margin-top:8px">Demoda gönderilmez.</p></section></div><button class="lk" id="yn" style="margin-top:20px">Başka personel ekle</button>`;
 $('#kp').onclick=async()=>{try{await navigator.clipboard.writeText(wa);tost('Mesaj kopyalandı.');}catch(_){const r=document.createRange();r.selectNodeContents($('#wa'));const s=getSelection();s.removeAllRanges();s.addRange(r);tost(document.execCommand('copy')?'Mesaj kopyalandı.':'Mesaj seçildi, elle kopyalayabilirsiniz.');}};
 $('#yn').onclick=()=>{ad='';fi='';adr=-1;sec=0;adim=1;ciz();};$('#tm').focus();return;}
 ic.innerHTML=ust+`<div class="sih"><div>${g}</div>${ozet()}</div>`;
 const al=()=>{ad=$('#ad')?$('#ad').value.trim():ad;};
 $$('[data-f]').forEach(b=>b.onclick=()=>{al();fi=b.dataset.f;ciz();$(`[data-f="${fi}"]`).focus();});
 if($('#a1'))$('#a1').onsubmit=x=>{x.preventDefault();al();if(!ad){$('.hata').textContent='Adını soyadını yazın.';$('#ad').focus();return;}if(!fi){$('.hata').textContent='Fabrikayı seçin.';$('[data-f]').focus();return;}adim=2;ciz();$('[data-a]').focus();};
 $$('[data-a]').forEach(b=>b.onclick=()=>{adr=+b.dataset.a;sec=0;adim=3;ciz();const y=$('[data-o]');y&&y.focus();});
 $$('[data-o]').forEach(b=>b.onclick=()=>{sec=+b.dataset.o;ciz();$(`[data-o="${sec}"]`).focus();});
 const ge=$('[data-geri]');if(ge)ge.onclick=()=>{adim--;ciz();};
 if($('#onay'))$('#onay').onclick=()=>{const a=D.ornekAdresler[adr],x=D.enYakin(a.k,fi,3)[sec];if(!D.ata(ad,a.ad,x.hat.id,x.durak.ad)){tost('Bu araçta boş yer kalmadı, başka araç seçin.');ciz();return;}son={h:x.hat,d:x.durak};adim=4;ciz();};
 }ciz();
},
hakedis(){
 let sek='firma',acik=null;const tf=D.hakedis.firma.reduce((a,x)=>a+x.tutar,0),tt=D.hakedis.taseron.reduce((a,x)=>a+x.tutar,0),kn=D.hatlar.filter(h=>!h.taseronUcret);
 const ciz=()=>{const F=sek==='firma',l=D.hakedis[sek];ic.innerHTML=`<p style="margin-bottom:18px">1–24 Kasım kapanmış günlerin hesabı.</p><div class="topl"><div>Fabrikalardan alınacak<b>${D.tl(tf)}</b></div><div>Taşeronlara ödenecek<b>${D.tl(tt)}</b></div><div>Aradaki fark<b>${D.tl(tf-tt)}</b></div></div><div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;margin-bottom:8px"><div class="sk" role="group" aria-label="Hakediş türü" style="margin:0"><button data-s="firma" aria-pressed="${F}">Firma hakedişi</button><button data-s="taseron" aria-pressed="${!F}">Taşeron hakedişi</button></div><button class="dg" id="csv">Excel indir</button></div>
 ${l.map(x=>{const o=F?x.firma:x.taseron,a=acik===o.id;return `<button type="button" class="ogr" data-id="${o.id}" aria-expanded="${a}"><span class="u"><b>${o.ad}</b><b>${D.tl(x.tutar)}</b></span><span class="kck">${x.hatlar.length} hat, ${x.tek.toLocaleString('tr-TR')} tek</span></button>${a?`<div class="tabk" tabindex="0" role="region" aria-label="${o.ad} hat dökümü" style="margin:8px 0 16px"><table><thead><tr><th>Hat</th><th>Tek</th><th>Tek fiyatı</th><th>Tutar</th></tr></thead><tbody>${x.hatlar.map(h=>{const u=F?h.firmaUcret:h.taseronUcret;return `<tr><td><b>${h.id}</b> ${h.ad}</td><td>${h.aylikTek}</td><td>${D.tl(u)}</td><td>${D.tl(u*h.aylikTek)}</td></tr>`;}).join('')}</tbody></table></div>`:''}`;}).join('')}
 <p style="display:flex;justify-content:space-between;padding:16px 12px;font-size:20px"><b>Toplam</b><b>${D.tl(F?tf:tt)}</b></p><p class="kck">${F?'':`Kendi ${kn.length} aracımızın ${kn.reduce((a,h)=>a+h.aylikTek,0)} teki taşeron hakedişine girmez. `}Fark, taşeron ödemesi dışındaki giderleri içermez.</p>`;
 $$('.sk button').forEach(b=>b.onclick=()=>{sek=b.dataset.s;acik=null;ciz();$(`[data-s="${sek}"]`).focus();});
 $$('.ogr').forEach(b=>b.onclick=()=>{acik=acik===b.dataset.id?null:b.dataset.id;ciz();$(`.ogr[data-id="${b.dataset.id}"]`).focus({preventScroll:true});});
 $('#csv').onclick=()=>{const r=[[F?'Fabrika':'Taşeron','Hat','Hat adı','Plaka','Tek','Tek fiyatı','Tutar']];l.forEach(x=>{x.hatlar.forEach(h=>{const u=F?h.firmaUcret:h.taseronUcret;r.push([(F?x.firma:x.taseron).ad,h.id,h.ad,h.plaka,h.aylikTek,u,u*h.aylikTek]);});});r.push(['Toplam','','','',l.reduce((a,x)=>a+x.tek,0),'',F?tf:tt]);
 const b=new Blob(['﻿'+r.map(x=>x.map(v=>/[;"\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':v).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`kasim-2026-${F?'firma':'taseron'}-hakedis.csv`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),2000);tost('Kasım '+(F?'firma':'taşeron')+' hakedişi indirildi.');};};
 ciz();
},
firma(){
 const f=D.firmalar[0],hs=D.hatlar.filter(h=>h.firma===f),ps=D.puantaj.filter(p=>p.hat.firma===f),n=d=>ps.filter(p=>p.durum===d).length;let q='';
 ic.innerHTML=`<section class="durum" id="bugun"><h1>Bugün ${n('islendi')+n('gec')} tek işlendi, ${n('bekliyor')} tek bekliyor.</h1><p>${f.yetkili}, ${D.BUGUN_METIN}, saat ${D.SIMDI}. ${hs.length} hattınızda bugün toplam ${ps.length} tek var. ${n('gelmedi')?n('gelmedi')+' tekte araç gelmedi, ':''}${n('planli')} tekin saati henüz gelmedi.</p></section><label><span class="kck">Hat ya da plaka ara</span><input class="buyuk" type="search" id="q"></label>${lejant()}<div id="l"></div><section id="kasim" style="margin-top:44px"><h2>Kasım puantajı</h2><p style="margin:6px 0 12px">1–24 Kasım kapanmış günler, toplam ${hs.reduce((a,h)=>a+h.aylikTek,0).toLocaleString('tr-TR')} tek. Eksik tekli günler işaretli.</p><div class="tabk" tabindex="0" role="region" aria-label="Kasım puantajı"><table><thead><tr><th>Hat</th>${D.gunler.map(x=>`<th>${x.gun}</th>`).join('')}<th>Toplam</th></tr></thead><tbody>${hs.map(h=>`<tr><td><b>${h.id}</b> ${h.ad}</td>${h.aylik.map(v=>v==null?'<td class="pz">–</td>':`<td${v<h.seferler.length?' class="ek"':''}>${v}</td>`).join('')}<td><b>${h.aylikTek}</b></td></tr>`).join('')}</tbody></table></div></section>`;
 const ciz=()=>anaAyrinti($('#l'),hs.filter(h=>kb(h.id+' '+h.ad+' '+h.plaka).includes(kb(q.trim()))),h=>`<span class="u"><b>${h.id} ${h.ad}</b><span class="kck">${teks(h).filter(bitti).length} / ${h.seferler.length} tek</span></span>${rail(teks(h),1)}`,h=>`<h2>${h.id} ${h.ad}</h2><p class="kck">${h.plaka}, ${h.sofor}</p>${rail(teks(h))}<ul class="stl">${teks(h).map(p=>`<li><div class="u"><b>${sefAd(p.sefer)}</b><span class="rz ${p.durum}">${D.durumAd[p.durum]}${p.gerceklesen?' '+p.gerceklesen:''}</span></div>${p.gerekce?`<small>Gerekçe: ${e(p.gerekce)}</small>`:''}</li>`).join('')}</ul>`);
 $('#q').oninput=x=>{q=x.target.value;ciz();};ciz();
},
hatlar(){
 let q='',sec=null;ic.innerHTML='<label><span class="kck">Hat, kod, plaka ya da şoför ara</span><input class="buyuk" type="search" id="q"></label><p class="kck" id="sy" style="margin:12px 0"></p><div id="l"></div>';
 const ciz=()=>{const l=D.hatlar.filter(h=>hatAra(h,q));$('#sy').textContent=l.length+' hat';
 anaAyrinti($('#l'),l,h=>`<span class="u"><b>${h.id} ${h.ad}</b><span class="rz ${h.erisim?'islendi':'gelmedi'}">${h.erisim?'Erişim açık':'Erişim kapalı'}</span></span><span class="kck">${h.firma.ad}, ${h.plaka}</span>${rail(teks(h),1)}`,
 h=>`<h2>${h.id} ${h.ad}</h2><p class="kck">${h.firma.ad}, ${h.taseronUcret?h.taseron.ad:'kendi aracımız'}</p>${rail(teks(h))}<dl class="tut"><dt>Hat kodu</dt><dd class="kod">${h.kod}</dd><dt>İzinli telefon</dt><dd>${h.arac.tel}</dd><dt>Şoför</dt><dd>${h.sofor}</dd><dt>Erişim</dt><dd class="rz ${h.erisim?'islendi':'gelmedi'}">${h.erisim?'Açık':'Kapalı'}</dd></dl><button type="button" class="dg ${h.erisim?'s':'y'}" data-er style="width:100%">${h.erisim?'Erişimi kapat':'Erişimi aç'}</button><h3 style="margin-top:24px">Tekler ve saat aralıkları</h3><ul class="stl">${h.seferler.map(s=>`<li><div class="u"><b>${sefAd(s)}</b><span>${s.bas} ile ${s.bit} arası</span></div></li>`).join('')}</ul><h3>Fiyatlar</h3><dl class="tut"><dt>Taşeron, tek fiyatı</dt><dd>${h.taseronUcret?D.tl(h.taseronUcret):'kendi aracımız'}</dd><dt>Fabrika, tek fiyatı</dt><dd>${D.tl(h.firmaUcret)}</dd></dl>${hatHesap(h)}`,
 (k,h,yen)=>{sec=h.id;$('[data-er]',k).onclick=()=>{D.erisim(h.id,!h.erisim);tost(h.id+(h.erisim?' erişimi açıldı.':' erişimi kapatıldı. Bu kod ve telefonla giriş yapılamaz.'));yen();const b=$('#l [data-er]');b&&b.focus({preventScroll:true});};},sec);};
 $('#q').oninput=x=>{q=x.target.value;ciz();};ciz();
},
mobil(){
 const h=D.hatlar[0],ts=teks(h),p=ts[2],at=D.atamalar().filter(a=>a.hat==='H1').pop()||{ad:'Zeynep Örnek',durak:h.duraklar[1].ad},dr=h.duraklar.find(x=>x.ad===at.durak)||h.duraklar[1];
 const ev=D.araclar.flatMap(a=>a.evraklar.map(x=>({a,x}))).filter(o=>o.x.durum==='yaklasiyor').sort((a,b)=>a.x.gun-b.x.gun)[0];
 const K=h.duraklar.map(x=>x.k).concat([h.firma.k]),mi=Math.min(...K.map(k=>k[1])),ma=Math.max(...K.map(k=>k[1])),na=Math.min(...K.map(k=>k[0])),nx=Math.max(...K.map(k=>k[0])),xy=k=>[20+(k[1]-mi)/(ma-mi)*200,130-(k[0]-na)/(nx-na)*110];
 const mp=`<svg class="mp" viewBox="0 0 240 150" role="img" aria-label="Güzergâh çizimi"><polyline points="${K.map(k=>xy(k).join()).join(' ')}" fill="none" stroke="#1f5f86" stroke-width="5" stroke-linejoin="round"/>${h.duraklar.map(x=>{const c=xy(x.k),b=x===dr;return `<circle cx="${c[0]}" cy="${c[1]}" r="${b?11:6}" fill="${b?'#6b1830':'#fff'}" stroke="#1f5f86" stroke-width="3"/>`;}).join('')}<rect x="${xy(h.firma.k)[0]-8}" y="${xy(h.firma.k)[1]-8}" width="16" height="16" fill="#4b6428"/></svg>`;
 const T=[
 ['Hat kodu ve izinli telefonla giriş yapılır.',`<h3>Hattına gir</h3><label class="al" style="margin:0">Hat kodu<input type="text" id="mk" value="${h.kod}"></label><label class="al" style="margin:0">Telefon<input type="text" id="mt" value="${h.arac.tel}"></label><p class="hata" id="mh" role="alert"></p><button class="dg" id="mg">Hatta gir</button><p class="it">Kod ve telefonu servis firması verir.</p>`],
 ['Şoför bugünkü seferlerini görür, düğmeye basmaz.',`<h3>Bugünkü seferlerim</h3><p>${h.id} ${h.ad}</p><div>${ts.map(x=>`<div class="ss"><b>${sefAd(x.sefer)}</b><span class="rz ${x.durum}">${D.durumAd[x.durum]}</span></div>`).join('')}</div><p class="it">Seferler kendiliğinden işlenir.</p>`],
 ['Ekran kapalıyken de konum açık kalır.',`<h3>Konum açık</h3><div class="kt"><b>Arka planda çalışıyor</b><p>Sıradaki sefer ${p.sefer.saat} ${yon(p.sefer)}. Aralık ${p.sefer.bas} ile ${p.sefer.bit} arası.</p></div>${mp}<p>Telefonu cebinize koyabilirsiniz.</p><p class="it">Konum yalnız sefer saatlerinde alınır.</p>`],
 ['Araç alandan çıkınca tek kendiliğinden işlenir.',`<h3>Tek işlendi</h3><div class="kt y"><b>${sefAd(p.sefer)}</b><p>${D.SIMDI} saatinde işlendi. Sizin bir şey yapmanız gerekmez.</p></div>${rail(ts.map((x,i)=>i===2?{...x,durum:'islendi',gerceklesen:D.SIMDI}:x),1)}<p>Bugün ${Math.max(3,ts.filter(bitti).length)} / ${ts.length} tek işlendi. Sıradaki sefer ${ts[3].sefer.saat} ${yon(ts[3].sefer)}.</p><p class="it">İkinci kez çıkarsanız yeniden sayılmaz.</p>`],
 ['İnternet kesilince kayıt telefonda saklanır.',`<h3>İnternet yok</h3><div class="kt u"><b>Kayıt saklanıyor</b><p>${p.sefer.saat} ${yon(p.sefer)} kaydı telefonda duruyor. İnternet gelince iletilir.</p></div>${rail(ts,1)}<p>Yola devam edebilirsiniz.</p><p class="it">Sefer saati değişmez.</p>`],
 ['Yeni personel şoföre bildirim olarak gider.',`<h3>Yeni personel</h3><div class="kt"><b>${e(at.ad)}</b><p>${dr.ad}<br>Biniş ${dr.saat}</p></div><p>${h.id} hattında artık ${D.atamalar().some(a=>a.hat==='H1')?h.personel:h.personel+1} kişi var.</p>${mp}<p class="it">Bildirim önizlemesi</p>`],
 ['Evrak süresi dolmadan şoför uyarılır.',`<h3>Evrak uyarısı</h3><p>${ev?ev.a.sofor+', '+ev.a.plaka:''}</p><div class="kt u"><b>${ev?ev.x.ad:'Evrak'}</b><p>${ev?`${D.tarih(ev.x.bitis)} tarihinde bitiyor. ${evMetin(ev.x)}.`:'Yaklaşan evrak yok.'}</p></div><div>${ev?ev.a.evraklar.filter(x=>x!==ev.x).map(x=>`<div class="ss"><span>${x.ad}</span><b>${D.tarih(x.bitis)}</b></div>`).join(''):''}</div><p>Yenilenen evrakı firmanıza iletin.</p><p class="it">Bildirim önizlemesi</p>`],
 ['Personel bağlantıdan durağını ve saatini görür.',`<h3>Servis güzergâhınız</h3>${mp}<div><b style="font-size:20px">${dr.ad}</b><p>Biniş ${dr.saat}<br>Plaka ${h.plaka}<br>${h.firma.ad} varış ${h.seferler[0].saat}</p></div><p class="it">Yeşil kare fabrika, bordo nokta durağınız.</p>`]];
 ic.innerHTML='<p class="yok" style="margin-bottom:26px">Android uygulaması. Şoför puantaj için hiçbir düğmeye basmaz.</p><div class="tels">'+T.map((t,i)=>`<figure class="tel" id="t${i+1}" tabindex="-1"><div class="cr"><div class="db"><span>17:12</span><span>${i===4?'İnternet yok':'4,5G'}</span></div>${t[1]}</div><figcaption>${t[0]}</figcaption></figure>`).join('')+'</div>';
 const nt=x=>x.replace(/\D/g,'');
 $('#mg').onclick=()=>{const k=$('#mk').value.trim(),m=$('#mh');if(!h.erisim)m.textContent='Bu hattın erişimi kapalı. Servis firmasını arayın.';else if(k.toLocaleUpperCase('tr')!==h.kod||nt($('#mt').value)!==nt(h.arac.tel))m.textContent='Kod ya da telefon eşleşmiyor.';else{m.textContent='';tost('Giriş yapıldı, bugünkü seferler açıldı.');$('#t2').scrollIntoView({block:'center'});$('#t2').focus({preventScroll:true});}};
}};
sayfa[S]();
})();
