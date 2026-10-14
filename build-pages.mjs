import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(), out=path.join(root,'_site');
const allowed=new Set(['.html','.css','.js','.svg','.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.ttf','.txt','.xml','.pdf','.mp4']);
const source=await readFile('server.mjs','utf8');
const moduleSource=source.slice(0,source.indexOf('const server=http.createServer')).replace('path.dirname(fileURLToPath(import.meta.url))',JSON.stringify(root))+'\nexport {kkPages,kkPageHtml,responsiveAuditCss,hreflangTagsForRu};';
const {kkPages,kkPageHtml,responsiveAuditCss,hreflangTagsForRu}=await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64'));
async function copy(dir=''){
  for(const entry of await readdir(path.join(root,dir),{withFileTypes:true})){
    if(entry.name.startsWith('.')||['node_modules','_site','tests'].includes(entry.name))continue;
    const rel=path.join(dir,entry.name), dest=path.join(out,rel);
    if(entry.isDirectory()){await copy(rel);continue;}
    if(entry.name!=='CNAME'&&!allowed.has(path.extname(entry.name)))continue;
    if(['README.md','build-pages.mjs','pages-assistant.js'].includes(entry.name))continue;
    await mkdir(path.dirname(dest),{recursive:true});
    if(path.extname(rel)==='.html'){
      let html=await readFile(path.join(root,rel),'utf8');
      const ruPath=rel==='index.html'?'/':'/'+rel.replaceAll(path.sep,'/').replace(/index\.html$/,'');
      if(kkPages[ruPath])html=html.replace('</head>',hreflangTagsForRu(ruPath)+'</head>');
      html=prepare(html);await writeFile(dest,html);
    }else await copyFile(path.join(root,rel),dest);
  }
}
function prepare(html){
  html=html.replaceAll('AI-КОНСУЛЬТАНТ','ПОМОЩНИК').replaceAll('SCANLINE AI','SCANLINE').replaceAll('Я AI-консультант ScanLine','Я справочный помощник ScanLine').replaceAll('AI-консультанта','помощника').replaceAll('AI-консультант ScanLine','Помощник ScanLine').replaceAll('AI думает…','Подготавливаю ответ…');
  html=html.replace(/fetch\('\/api\/chat',\{method:'POST',headers:\{'Content-Type':'application\/json'\},body:JSON\.stringify\(\{message:q,history:history\.slice\(-6\),lang:document\.documentElement\.lang\}\)\}\)/g,"Promise.resolve({ok:true,json:async()=>window.scanlineAnswer(q,document.documentElement.lang)})");
  if(!html.includes('scanline-responsive-audit'))html=html.replace('</head>',responsiveAuditCss()+'</head>');
  html=html.replaceAll('https://scanline.kz/','https://www.scanline.kz/');
  return html.replace('</head>','<script src="/pages-assistant.js"></script></head>');
}
await mkdir(out,{recursive:true});await copy();
await copyFile('pages-assistant.js',path.join(out,'pages-assistant.js'));
for(const [ruPath,data] of Object.entries(kkPages)){
  const dest=path.join(out,'kk',ruPath,'index.html');
  await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,prepare(kkPageHtml(data,ruPath)));
}
await writeFile(path.join(out,'.nojekyll'),'');
const sitemap=await readFile(path.join(out,'sitemap.xml'),'utf8');
const kkEntries=Object.keys(kkPages).map(p=>'<url><loc>https://www.scanline.kz/kk'+p+'</loc></url>').join('\n');
await writeFile(path.join(out,'sitemap.xml'),sitemap.replace('</urlset>',kkEntries+'\n</urlset>'));
console.log('Static Pages export ready; Kazakh pages:',Object.keys(kkPages).length);
