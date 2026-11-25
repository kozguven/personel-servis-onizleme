/* Ortak örnek veri + hesap. Firma, kişi ve plakalar kurgusaldır. window.D */
(function(){
let s=20261125;const rnd=()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296},pick=a=>a[Math.floor(rnd()*a.length)],ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
const firmalar=[
{id:'F1',ad:'Örnek Metal',ilce:'Sancaktepe',k:[41.0035,29.2300],yari:220,yetkili:'Selin Arı'},
{id:'F2',ad:'Örnek Plastik',ilce:'Dudullu OSB',k:[41.0085,29.1620],yari:260,yetkili:'Cem Uslu'},
{id:'F3',ad:'Örnek Gıda',ilce:'Sultanbeyli',k:[40.9625,29.2800],yari:200,yetkili:'Derya Kaya'},
{id:'F4',ad:'Örnek Tekstil',ilce:'Tuzla',k:[40.8620,29.3380],yari:240,yetkili:'Murat Ak'},
{id:'F5',ad:'Örnek Elektronik',ilce:'Kurtköy',k:[40.9080,29.3000],yari:220,yetkili:'Ebru Tan'}];
const bolge={'Beykoz':[41.1250,29.1000],'Çekmeköy':[41.0400,29.1780],'Ümraniye':[41.0240,29.1000],'Üsküdar':[41.0230,29.0250],'Ataşehir':[40.9920,29.1270],'Kadıköy':[40.9880,29.0400],'Maltepe':[40.9400,29.1400],'Kartal':[40.9050,29.1950],'Pendik':[40.8800,29.2400],'Samandıra':[40.9830,29.2200],'Sarıgazi':[41.0100,29.2080],'Yenidoğan':[41.0160,29.2560],'Taşdelen':[41.0270,29.2300],'Gebze':[40.8020,29.4300],'Çayırova':[40.8250,29.3800],'Darıca':[40.7750,29.3800],'Aydos':[40.9450,29.2400],'Uğurmumcu':[40.9350,29.2080]};
const bn=Object.keys(bolge),yer=['Muhtarlık','Eczane önü','Pazar yeri','Cami önü','Park girişi','Okul durağı','Market önü','Köprü altı'];
const ad=['Ahmet','Mehmet','Hasan','Yusuf','İsmail','Kadir','Orhan','Serkan','Halil','Recep','Tuncay','Veysel','Bülent','Erdal','Cihan'],sy=['Demir','Yıldız','Koç','Arslan','Şahin','Çetin','Polat','Güneş','Bulut','Kurt','Taş','Özkan','Aydın','Kılıç'];
const taseronlar=['Kendi aracımız','Yol Turizm','Marmara Servis','Ada Taşıma','Tepe Turizm','Deniz Servis','Umut Taşıma','Güven Turizm'].map((a,i)=>({id:'T'+i,ad:a}));
const set={ // saat, yön. Müşterinin örneği: A
A:[['06:45','Giriş'],['07:05','Çıkış'],['17:05','Çıkış'],['20:45','Giriş'],['21:05','Çıkış']],
B:[['07:45','Giriş'],['18:05','Çıkış']],
C:[['06:45','Giriş'],['07:05','Çıkış'],['14:45','Giriş'],['15:05','Çıkış']],
D:[['07:45','Giriş'],['17:35','Çıkış'],['19:45','Giriş'],['20:05','Çıkış']]};
const dk=t=>+t.slice(0,2)*60+ +t.slice(3),saat=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const SIMDI='17:12',BUGUN='2026-11-25',BUGUN_METIN='25 Kasım 2026 Çarşamba';
const evrakAd=['Muayene','Trafik sigortası','Koltuk sigortası','Psikoteknik','Şoför kartı'];
const gunFark=t=>Math.round((new Date(t)-new Date(BUGUN))/864e5);
const hatlar=[],araclar=[];
for(let i=0;i<80;i++){
 const f=firmalar[i===0?0:i%5];let b=i===0?'Beykoz':bn[(Math.floor(i/5)*5+(i%5)*3)%bn.length];
 const kap=i===0?27:pick([16,19,27,27,46]),tas=i<3||(i>=40&&i<43)?taseronlar[0]:taseronlar[1+i%7];
 if(i===0){} const T=i===0?taseronlar[2]:tas;
 const key=i===0?'A':pick(['A','B','B','C','D','B']);
 const p0=bolge[b],n=ri(4,6),duraklar=[];
 for(let j=0;j<n;j++){const u=j/n;const dk0=[p0[0]+(f.k[0]-p0[0])*u+(rnd()-.5)*.008,p0[1]+(f.k[1]-p0[1])*u+(rnd()-.5)*.008],yk=bn.slice().sort((x,y)=>Math.hypot(bolge[x][0]-dk0[0],bolge[x][1]-dk0[1])-Math.hypot(bolge[y][0]-dk0[0],bolge[y][1]-dk0[1]))[0];duraklar.push({ad:(j===0?b:yk)+' '+yer[(i+j)%yer.length],k:dk0,saat:saat(dk(set[key][0][0])-8-(n-j)*7)});}
 const personel=i===0?24:Math.min(kap,Math.round(kap*(.55+rnd()*.47)));
 const tf=i===0?1000:kap>30?1350:kap>20?ri(19,21)*50:ri(16,18)*50,ff=i===0?1150:tf+ri(2,4)*50;
 const seferler=set[key].map(([t,y],j)=>({no:j+1,saat:t,yon:y,bas:saat(dk(t)-(y==='Giriş'?20:8)),bit:saat(dk(t)+(y==='Giriş'?8:25))}));
 const plaka='34 ÖRN '+String(101+i);
 hatlar.push({id:'H'+(i+1),no:i+1,ad:b+' '+f.ilce.replace(' OSB',''),bolge:b,firma:f,duraklar,seferler,taseron:T,taseronUcret:tf,firmaUcret:ff,plaka,kod:b.slice(0,3).toLocaleUpperCase('tr')+'-'+(1000+ (i*317)%9000),erisim:true,personel,kapasite:kap,bos:kap-personel});
 const ev=evrakAd.map((e,j)=>{let g=ri(35,340);if((i*5+j)%41===7)g=ri(2,14);if((i*5+j)%41===19)g=ri(15,30);if((i*5+j)%131===5)g=-ri(1,6);const d=new Date(BUGUN);d.setDate(d.getDate()+g);const t=d.toISOString().slice(0,10);return{ad:e,bitis:t,gun:gunFark(t),durum:g<0?'gecti':g<=30?'yaklasiyor':'gecerli'};});
 araclar.push({plaka,hat:hatlar[i],kapasite:kap,personel,doluluk:Math.round(personel/kap*100),taseron:T,kendi:T.id==='T0',sofor:pick(ad)+' '+pick(sy),tel:'0500 000 '+String(10+i).padStart(2,'0')+' 0'+(i%10),evraklar:ev,enKotu:ev.some(x=>x.durum==='gecti')?'gecti':ev.some(x=>x.durum==='yaklasiyor')?'yaklasiyor':'gecerli'});
 hatlar[i].sofor=araclar[i].sofor;hatlar[i].arac=araclar[i];
}
// Kendi araç sayısı tam 6
// hat 1 taşeron olduğundan bir araç daha kendi yapılır
(()=>{let c=araclar.filter(a=>a.kendi).length;for(let i=50;c<6&&i<80;i++){const a=araclar[i];if(!a.kendi){a.taseron=taseronlar[0];a.hat.taseron=taseronlar[0];a.kendi=true;c++;}}
araclar.filter(a=>a.kendi).forEach(a=>a.hat.taseronUcret=0);})();
// Bugünün puantajı. durum: islendi | gec | gelmedi | bekliyor (aralık açık) | planli
const puantaj=[];
hatlar.forEach((h,i)=>h.seferler.forEach(x=>{const m=dk(x.saat),now=dk(SIMDI);let d,o=null;
 if(now<dk(x.bas))d='planli';else{const r=rnd();
  if(now<=dk(x.bit)){if(i===0||r<.45)d='bekliyor';else{d='islendi';o=saat(Math.min(now,dk(x.bas)+ri(1,6)));}}
  else if(i>0&&r<.018)d='gelmedi';else if(i>0&&r<.05){d='gec';o=saat(dk(x.bit)+ri(2,11));}else{d='islendi';o=i===0?x.saat:saat(m+(x.yon==='Giriş'?-ri(0,9):ri(0,6)));}}
 puantaj.push({id:h.id+'-'+x.no,hat:h,sefer:x,durum:d,gerceklesen:o});}));
// Kasım gün gün tek sayısı (Pazar yok; bugün henüz tamamlanmadı, 1..24 tamamlanmış)
const gunler=[];for(let g=1;g<=24;g++){const w=new Date(Date.UTC(2026,10,g)).getUTCDay();gunler.push({gun:g,pazar:w===0});}
hatlar.forEach(h=>{h.aylik=gunler.map(g=>g.pazar?null:Math.max(0,h.seferler.length-(h.no>1&&rnd()<.025?1:0)));h.aylikTek=h.aylik.reduce((a,b)=>a+(b||0),0);});
const hakedis={firma:firmalar.map(f=>{const hs=hatlar.filter(h=>h.firma===f);return{firma:f,hatlar:hs,tek:hs.reduce((a,h)=>a+h.aylikTek,0),tutar:hs.reduce((a,h)=>a+h.aylikTek*h.firmaUcret,0)};}),
taseron:taseronlar.slice(1).map(t=>{const hs=hatlar.filter(h=>h.taseron===t);return{taseron:t,hatlar:hs,tek:hs.reduce((a,h)=>a+h.aylikTek,0),tutar:hs.reduce((a,h)=>a+h.aylikTek*h.taseronUcret,0)};})};
const R=Math.PI/180,km=(a,b)=>{const x=(b[1]-a[1])*R*Math.cos((a[0]+b[0])/2*R),y=(b[0]-a[0])*R;return Math.sqrt(x*x+y*y)*6371;};
const ornekAdresler=[{ad:'Beykoz, Kavacık Mah.',k:[41.0930,29.0960]},{ad:'Ataşehir, Barbaros Mah.',k:[40.9970,29.1200]},{ad:'Pendik, Kavakpınar Mah.',k:[40.9080,29.2550]},{ad:'Çekmeköy, Mimar Sinan Mah.',k:[41.0360,29.1820]},{ad:'Kartal, Uğurmumcu Mah.',k:[40.9340,29.2050]}];
// Seçilen firmaya giden, boş yeri olan hatlardan adrese en yakın durağa göre ilk n (kuş uçuşu km)
function enYakin(k,firmaId,n){return hatlar.filter(h=>h.bos>0&&(!firmaId||h.firma.id===firmaId)).map(h=>{let e=null;h.duraklar.forEach(d=>{const m=km(k,d.k);if(!e||m<e.km)e={durak:d,km:m};});return{hat:h,durak:e.durak,km:e.km};}).sort((a,b)=>a.km-b.km).slice(0,n||3);}
const tl=n=>Math.round(n).toLocaleString('tr-TR')+' ₺';
const tarih=t=>t.split('-').reverse().join('.');
const durumAd={islendi:'İşlendi',gec:'Geç işlendi',gelmedi:'Gelmedi',bekliyor:'Aralık açık',planli:'Planlı'};
const sayilar=()=>{const o={islendi:0,gec:0,gelmedi:0,bekliyor:0,planli:0};puantaj.forEach(p=>o[p.durum]++);o.toplam=puantaj.length;return o;};
// Bugünkü puantajı tarayıcı sekmesinde sakla (ekranlar arası tutarlılık)
const KEY='servis-demo-v1-'+(location.pathname.match(/secenek-\d/)||[''])[0];
let kayit={p:{},atama:[],erisim:{},mesaj:[]};try{kayit=Object.assign(kayit,JSON.parse(sessionStorage.getItem(KEY)||'{}'));}catch(e){}
const yaz=()=>{try{sessionStorage.setItem(KEY,JSON.stringify(kayit));}catch(e){}};
puantaj.forEach(p=>{if(kayit.p[p.id])Object.assign(p,kayit.p[p.id]);});
const uygulaAtama=a=>{const h=hatlar.find(x=>x.id===a.hat);if(!h||h.bos<1)return false;h.personel++;h.bos--;h.arac.personel++;h.arac.doluluk=Math.round(h.arac.personel/h.arac.kapasite*100);return true;};
kayit.atama.forEach(uygulaAtama);hatlar.forEach(h=>{if(h.id in kayit.erisim)h.erisim=kayit.erisim[h.id];});
// Araç alana girdi/çıktı simülasyonu. Aynı tek ikinci kez işlenmez -> false döner.
function tekIsle(id,saatMetni){const p=puantaj.find(x=>x.id===id);if(!p||p.durum==='islendi'||p.durum==='gec')return false;const o={durum:'islendi',gerceklesen:saatMetni||SIMDI};Object.assign(p,o);kayit.p[id]=o;yaz();return p;}
// Gerekçeli elle düzeltme; yeniDurum: islendi | gelmedi
function duzelt(id,yeniDurum,saatMetni,gerekce){const p=puantaj.find(x=>x.id===id);if(!p||!gerekce)return false;const o={durum:yeniDurum,gerceklesen:yeniDurum==='gelmedi'?null:saatMetni,gerekce};Object.assign(p,o);kayit.p[id]=o;yaz();return p;}
function ata(personelAd,adresAd,hatId,durakAd){const a={ad:personelAd,adres:adresAd,hat:hatId,durak:durakAd};if(!uygulaAtama(a))return false;kayit.atama.push(a);yaz();return a;}
function erisim(hatId,acik){const h=hatlar.find(x=>x.id===hatId);h.erisim=acik;kayit.erisim[hatId]=acik;yaz();}
function sifirla(){sessionStorage.removeItem(KEY);location.reload();}
window.D={SIMDI,BUGUN,BUGUN_METIN,firmalar,taseronlar,hatlar,araclar,puantaj,gunler,hakedis,ornekAdresler,enYakin,tekIsle,duzelt,ata,erisim,sifirla,sayilar,tl,tarih,dk,saat,km,durumAd,atamalar:()=>kayit.atama};
})();
