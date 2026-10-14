import { readFile } from 'node:fs/promises';
const translations=JSON.parse(await readFile(new URL('./kk-translations.json',import.meta.url),'utf8'));
const extra=JSON.parse(await readFile(new URL('./kk-extra-translations.json',import.meta.url),'utf8'));
Object.assign(translations,extra);
Object.assign(translations,{
  'Нужна ли предварительная запись?':'Алдын ала жазылу қажет пе?',
  'Желательно. Сообщите марку, модель, год и симптомы, чтобы согласовать время диагностики.':'Алдын ала жазылған дұрыс. Диагностика уақытын келісу үшін маркасын, моделін, жылын және белгілерін хабарлаңыз.',
  'Коды ошибок и текущие параметры':'Қате кодтары және ағымдағы параметрлер',
  'Питание и электрические цепи':'Қорек және электр тізбектері',
  'Связь между электронными блоками':'Электрондық блоктар арасындағы байланыс',
  'Проводку, разъемы и дополнительные подключения':'Сымдар, қосқыштар және қосымша қосылыстар',
  'горит Check Engine или другой индикатор':'Check Engine немесе басқа индикатор жанып тұр',
  'машина не заводится или запускается нестабильно':'көлік оталмайды немесе тұрақсыз іске қосылады',
  'ошибки появляются после ремонта':'жөндеуден кейін қателер пайда болады',
  'электронные функции работают периодически':'электрондық функциялар үзіліспен жұмыс істейді',
  'быстро разряжается аккумулятор':'аккумулятор тез отырады',
  'Все китайские автомобили':'Барлық қытай автокөліктері',
  'Утечка тока':'Токтың ағып кетуі',
  'Автоэлектрика и компьютерная диагностика ScanLine в Алматы':'Алматыдағы ScanLine автоэлектрикасы және компьютерлік диагностикасы',
  'Специалисты ScanLine':'ScanLine мамандары',
  'Предыдущие специалисты':'Алдыңғы мамандар',
  'Следующие специалисты':'Келесі мамандар',
  'Карточки специалистов. Можно листать вбок.':'Мамандар карточкалары. Жанға қарай айналдыруға болады.',
  'Связаться с мастером Аюбом в WhatsApp':'Аюбқа WhatsApp арқылы жазу',
  'Аюб — специалист ScanLine':'Аюб — ScanLine маманы',
  'Связаться с мастером Владимиром в WhatsApp':'Владимирге WhatsApp арқылы жазу',
  'Владимир — специалист ScanLine':'Владимир — ScanLine маманы',
  'Компьютерная диагностика автомобиля в ScanLine Алматы':'Алматыдағы ScanLine-да автокөлікті компьютерлік диагностикалау',
  'Диагностика китайских автомобилей в ScanLine Алматы':'Алматыдағы ScanLine-да қытай автокөліктерін диагностикалау',
  'Прошивка и кодирование автомобиля в ScanLine Алматы':'Алматыдағы ScanLine-да автокөлікті бағдарламалау және кодтау',
  'Установка автосигнализации в ScanLine Алматы':'Алматыдағы ScanLine-да автосигнализация орнату',
  'Установка GPS-маяка в ScanLine Алматы':'Алматыдағы ScanLine-да GPS-маяк орнату',
  'Ремонт автоэлектрики в ScanLine Алматы':'Алматыдағы ScanLine-да автоэлектриканы жөндеу',
  'Предыдущий специалист':'Алдыңғы маман',
  'Следующий специалист':'Келесі маман',
  'Карусель специалистов':'Мамандар карточкалары',
  'Связаться с Владимиром в WhatsApp':'Владимирге WhatsApp арқылы жазу',
  'Связаться с Аюбом в WhatsApp':'Аюбқа WhatsApp арқылы жазу',
  'Связаться с ScanLine в WhatsApp':'ScanLine-ға WhatsApp арқылы жазу',
  'ScanLine Алматы — запись на диагностику':'ScanLine Алматы — диагностикаға жазылу',
  'Стоимость размещения специалиста':'Маман карточкасын орналастыру құны',
  'Например, Арман':'Мысалы, Арман',
  'Автоэлектрик, диагност, установщик...':'Автоэлектрик, диагност, орнатушы...',
  'Сколько лет работаете, с какими авто и услугами работаете, чем сильны':'Тәжірибеңіз қанша жыл, қандай көліктермен және қызметтермен жұмыс істейсіз, артықшылығыңыз қандай?',
  'Открыть AI-консультанта':'Кеңесшіні ашу',
  'AI-консультант ScanLine':'ScanLine кеңесшісі',
  'Закрыть':'Жабу',
  'Напишите вопрос или код ошибки…':'Сұрағыңызды немесе қате кодын жазыңыз…',
  'Ваш вопрос':'Сұрағыңыз',
  'Отправить':'Жіберу',
  'Владимир — автоэлектронщик-диагност ScanLine в Алматы':'Владимир — Алматыдағы ScanLine автоэлектроника диагносты'
});
const norm=s=>s.trim().replace(/\s+/g,' ');
const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode=s=>s.replace(/&(amp|lt|gt|quot|apos|nbsp);/g,(_,n)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' '})[n]).replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n)));
export function translate(s){
  const key=norm(s);
  if(translations[key]!==undefined)return translations[key];
  let m;
  if((m=key.match(/^Диагностика (.+) в Алматы$/)))return m[1]+' диагностикасы Алматыда';
  if((m=key.match(/^Какие неисправности (.+) вы диагностируете\?$/)))return m[1]+' бойынша қандай ақауларды диагностикалайсыздар?';
  if((m=key.match(/^Можно ли сразу назвать точную причину ошибки (.+)\?$/)))return m[1]+' қатесінің нақты себебін бірден айтуға бола ма?';
  return key;
}
export function translationKnown(s){return Object.hasOwn(translations,norm(s))||translate(s)!==norm(s);}
export function localizeRussianHtml(html,data,ruPath,paths){
  const kkPath='/kk'+ruPath;
  html=html.replace(/<html\b([^>]*)lang="ru"/i,'<html$1lang="kk"');
  html=html.replace(/<title>[^]*?<\/title>/i,'<title>'+escape(data.title)+'</title>');
  html=html.replace(/(<meta\b[^>]*name="description"[^>]*content=")[^"]*(")/i,'$1'+escape(data.description)+'$2');
  html=html.replace(/(<link\b[^>]*rel="canonical"[^>]*href=")[^"]*(")/i,'$1https://www.scanline.kz'+kkPath+'$2');
  html=html.replace(/<meta\b[^>]*http-equiv="content-language"[^>]*>/gi,'');
  html=html.replace(/(<meta\b[^>]*property="og:locale"[^>]*content=")[^"]*(")/gi,'$1kk_KZ$2');
  html=html.replace(/(<meta\b[^>]*property="og:title"[^>]*content=")[^"]*(")/gi,'$1'+escape(data.title)+'$2');
  html=html.replace(/(<meta\b[^>]*property="og:description"[^>]*content=")[^"]*(")/gi,'$1'+escape(data.description)+'$2');
  html=html.replace(/(<meta\b[^>]*property="og:url"[^>]*content=")[^"]*(")/gi,'$1https://www.scanline.kz'+kkPath+'$2');
  html=html.replace(/(<script\b[^>]*type="application\/ld\+json"[^>]*>)([^]*?)(<\/script>)/gi,(_,start,json,end)=>{
    const schema=JSON.parse(json);
    function localize(value,key=''){
      if(Array.isArray(value))return value.map(v=>localize(v,key));
      if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v,k)]));
      if(typeof value!=='string')return value;
      if(key==='inLanguage')return 'kk-KZ';
      if(['name','description','streetAddress'].includes(key))return translate(value);
      if(['url','item'].includes(key)&&/^https:\/\/(?:www\.)?scanline\.kz\//.test(value)){
        const url=new URL(value);if(paths.includes(url.pathname))return 'https://www.scanline.kz/kk'+url.pathname+url.hash;
      }
      return value;
    }
    return start+JSON.stringify(localize(schema))+end;
  });
  const tokens=html.split(/(<script\b[^>]*>[^]*?<\/script>|<style\b[^>]*>[^]*?<\/style>|<!--[^]*?-->|<[^>]+>)/gi);
  html=tokens.map(token=>{
    if(token.startsWith('<')){
      if(!/^<(script|style)\b/i.test(token))token=token.replace(/\b(src|poster|href)="([^"#]+)"/g,(all,attr,url)=>{
        if(/^<a\b/i.test(token)&&attr==='href')return all;
        if(/^(?:[a-z]+:|\/\/|\/)/i.test(url))return all;
        const absolute=new URL(url,'https://www.scanline.kz'+ruPath);return attr+'="'+absolute.pathname+absolute.search+absolute.hash+'"';
      });
      if(/^<a\b/i.test(token))token=token.replace(/href="([^"#]+)"/i,(all,href)=>{
        let url;try{url=new URL(href,'https://www.scanline.kz'+ruPath)}catch{return all}
        if(!['www.scanline.kz','scanline.kz'].includes(url.hostname))return all;
        const p=url.pathname.endsWith('/')?url.pathname:url.pathname+'/';
        return paths.includes(p)?'href="/kk'+p+url.search.replace(/([?&])lang=ru(&|$)/,'$1lang=kk$2')+url.hash+'"':all;
      });
      if(!/^<(script|style)\b/i.test(token))token=token.replace(/\b(alt|placeholder|aria-label)="([^"]*)"/g,(_,attr,text)=>attr+'="'+escape(translate(decode(text)))+'"');
      return token;
    }
    const trimmed=token.trim();
    return trimmed?token.replace(trimmed,escape(translate(decode(trimmed)))):token;
  }).join('');
  html=html.replace('<h3>ЖӨНДЕУ<br>АВТОЭЛЕКТРИКА</h3>','<h3>АВТОЭЛЕКТРИКАНЫ<br>ЖӨНДЕУ</h3>');
  // Only font fallback differs: Impact lacks reliable Kazakh glyphs. All layout CSS is shared.
  html=html.replace('</head>','<style id="kazakh-glyph-fallback">@font-face{font-family:ScanLineCondensed;src:url(/assets/roboto-condensed-700.ttf) format("truetype");font-style:normal;font-weight:700;font-display:swap}html[lang="kk"] h1,html[lang="kk"] h2,html[lang="kk"] h3{font-family:ScanLineCondensed,Arial,sans-serif!important;font-weight:700;letter-spacing:normal}html[lang="kk"] .cta,html[lang="kk"] .top-btn{font-weight:700}html[lang="kk"] .head-contact{flex-shrink:0}html[lang="kk"] .phone{white-space:nowrap}@media(max-width:1500px){html[lang="kk"] .header{flex-wrap:wrap}html[lang="kk"] .header>.nav{order:20;width:100%;flex-basis:100%;gap:18px;overflow:auto;white-space:nowrap}}</style></head>');
  if(!/\/lang\.css/.test(html))html=html.replace('</head>','<link rel="stylesheet" href="/lang.css"></head>');
  if(!/\/lang\.js/.test(html))html=html.replace('</head>','<script defer src="/lang.js?v=20261014-shared-layout"></script></head>');
  html=html.replace(/\/lang\.js\?v=[^"'<> ]+/g,'/lang.js?v=20261014-shared-layout');
  return html;
}
