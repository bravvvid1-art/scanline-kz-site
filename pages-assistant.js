// Shared by the browser helper and the server fallback.
function normalizeScanlineQuery(value) {
  let text = String(value || '').normalize('NFKC').toLowerCase().replace(/ё/g, 'е');
  const latin = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
  const russian = 'йцукенгшщзхъфывапролджэячсмитьбюё';
  const layout = text.replace(/[a-z\[\];',.`]/g, c => russian[latin.indexOf(c)] || c);
  const translit = text.replace(/shch|sch|zh|kh|ts|ch|sh|yu|ya|yo|[a-z]/g, c => ({shch:'щ',sch:'щ',zh:'ж',kh:'х',ts:'ц',ch:'ч',sh:'ш',yu:'ю',ya:'я',yo:'е',a:'а',b:'б',v:'в',g:'г',d:'д',e:'е',z:'з',i:'и',j:'й',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',r:'р',s:'с',t:'т',u:'у',f:'ф',h:'х',c:'к',y:'ы',w:'в',x:'кс'}[c] || c));
  return [text, layout, translit].join(' ').replace(/авто\s+электрик/g, 'автоэлектрик').replace(/диогностик|диагнастик/g, 'диагностик');
}
if (typeof window !== 'undefined') window.normalizeScanlineQuery = normalizeScanlineQuery;

window.scanlineAnswer=function(question,lang){
  const kk=String(lang).startsWith('kk'), q=normalizeScanlineQuery(question);
  let answer=kk?'Сұрағыңызды WhatsApp арқылы маманға жіберіңіз. Маркасын, моделін, жылын және белгілерін жазыңыз.':'Напишите специалисту в WhatsApp: укажите марку, модель, год и симптомы. Точную причину неисправности определяем при диагностике.';
  if(/адрес|находит|где|мекенжай|қайда/.test(q))answer=kk?'Алматы, Крылова көшесі 36. Телефон: +7 707 344 44 04.':'Алматы, ул. Крылова 36. Телефон: +7 707 344 44 04.';
  else if(/время|когда|график|подъехать|қашан|уақыт/.test(q))answer=kk?'Күн сайын 10:00–18:00. Алдын ала WhatsApp арқылы жазылыңыз.':'Работаем ежедневно с 10:00 до 18:00. Запишитесь заранее через WhatsApp.';
  else if(/p0300/.test(q))answer=kk?'P0300 — бірнеше цилиндрде жанудың үзілуі анықталған. Код нақты диагноз емес; тексеру қажет.':'P0300 означает обнаруженные случайные или множественные пропуски воспламенения. Возможны разные причины; код не является окончательным диагнозом. Нужна проверка автомобиля.';
  else if(/цен|стоим|баға/.test(q))answer=kk?'Құны жұмыс көлеміне байланысты. WhatsApp арқылы нақтылаңыз.':'Стоимость зависит от автомобиля и объёма работ. Уточните её у специалиста в WhatsApp.';
  return {answer,booking:true};
};
