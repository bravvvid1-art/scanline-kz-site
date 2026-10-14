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
