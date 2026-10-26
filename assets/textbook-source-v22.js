'use strict';
(()=>{
 const data=window.SCHOOL_TEXTBOOK_SOURCE,L=window.LESSON,S=window.SCHOOL_STRUCTURE?.[L?.id];
 if(!data||!L||!S)return;
 const siteRoot=new URL('../',document.baseURI),generatedRoot=new URL('../',document.currentScript.src),assetRoot=new URL('assets/textbook-source-v22/',siteRoot),pageData=window.SCHOOL_CURRENT_PAGE_SOURCE,records=new Map(data.tasks.map(t=>[t.id,t]));
 if(!pageData)throw new Error('Current page source bindings missing: '+L.id);
 Object.values(pageData.records).forEach(t=>records.set(t.id,t));
 Object.entries(pageData.nativeRefinements||{}).forEach(([id,refinement])=>{const record=records.get(id);if(record)Object.assign(record,refinement);});
 const graph=window.SCHOOL_RELATIONS[L.id],byPage=new Map();
 window.SCHOOL_SOURCE_EXERCISE_LABEL=e=>{const t=records.get(e.id);return e.source_kind==='existing supplement'?'补充练习':`Ex. ${t?.source_number||e.number}${t?.subitem?' · 子题 '+t.subitem:''}`;};
 data.tasks.forEach(t=>t.html_pages.forEach(p=>{if(!byPage.has(p))byPage.set(p,[]);byPage.get(p).push(t)}));
 for(const r of S.routes){
  const p=L.pages[r.anchor-1];
  if(r.section==='CLASS'&&!['lesson plan','lesson dictation'].includes(p.kind)){
   const root=document.createElement('div');root.innerHTML=p.html;const text=root.textContent,m=text.match(/第([12])周(阅读|写作|听力|口语)/);
   if(!m)r.label='单元封面';
   else{const task=/H1＋H2\s*讲评/.test(text)?'H1 + H2 讲评':/H1\s*课内完成/.test(text)?'H1 课堂练习':/H1\s*讲评/.test(text)?'H1 讲评':/H3\s*(限时|课内)完成/.test(text)?'H3 课堂练习':/H3\s*讲评/.test(text)?'H3 讲评':/课后作业\s*H2/.test(text)?'课后作业 H2':/下一单元预习\s*P1/.test(text)?'下一单元预习 P1':'课堂安排';r.label=`第${m[1]}周${m[2]} · ${task}`;}
  }
  const record=byPage.get(r.anchor)?.find(t=>t.number===r.number);
  if(record?.source_number){const title=r.label.replace(/^Ex\.\s*\d+\s*·\s*/,'');r.label=`Ex. ${record.source_number}${record.subitem?' · 子题 '+record.subitem:''} · ${title}`;}
 }
 function mount(){
  const U=window.UNLOCK_PLAYER,app=document.querySelector('#app');if(!U||!app)return;
  const dialog=app.querySelector('#source-dialog');dialog.classList.add('textbook-source-dialog');
  dialog.setAttribute('aria-label','当前页的实际来源');
  dialog.innerHTML='<div class="source-heading"><h2>Source</h2><button id="source-close" type="button">Close</button></div><select id="source-select" hidden aria-hidden="true" tabindex="-1"></select><p id="source-description"></p><main id="source-body"></main><footer class="source-footer-bar"><button id="source-prev" type="button">上一页</button><span id="source-page-label"></span><button id="source-next" type="button">下一页</button><button id="source-go" type="button">查看整页</button></footer>';
  const select=dialog.querySelector('#source-select'),body=dialog.querySelector('#source-body'),description=dialog.querySelector('#source-description'),pager=dialog.querySelector('#source-page-label'),zoomButton=dialog.querySelector('#source-go'),prev=dialog.querySelector('#source-prev'),next=dialog.querySelector('#source-next');
  let active=null,pageIndex=0,zoom=false;
  function fitSheet(){const svg=body.querySelector('.source-sheet svg');if(!svg||!dialog.open)return;const box=svg.viewBox.baseVal,scale=Math.min(Math.max(1,body.clientWidth-22)/box.width,Math.max(1,body.clientHeight-22)/box.height);svg.style.width=`${box.width*scale}px`;svg.style.height=`${box.height*scale}px`;}
  function fitContext(){const panel=body.querySelector('.source-context-panel');if(!panel||!dialog.open)return;panel.style.transform='none';panel.style.width='1050px';panel.style.position='absolute';panel.style.margin='0';const width=panel.offsetWidth,height=panel.offsetHeight,scale=Math.min(1,(body.clientWidth-24)/width,(body.clientHeight-24)/height);panel.style.transformOrigin='top left';panel.style.left=`${Math.max(0,(body.clientWidth-width*scale)/2)}px`;panel.style.top=`${Math.max(0,(body.clientHeight-height*scale)/2)}px`;panel.style.transform=`scale(${scale})`;}
  function fit(){fitSheet();fitWords();fitContext();}
  function fitWords(){const words=body.querySelector('.source-wordlist');if(!words||!dialog.open)return;const width=1260,height=words.scrollHeight,scale=Math.min((body.clientWidth-20)/width,(body.clientHeight-20)/height);words.style.transform=`translate(${Math.max(0,(body.clientWidth-width*scale)/2)}px,${Math.max(0,(body.clientHeight-height*scale)/2)}px) scale(${scale})`;}
  const openings=window.SCHOOL_LESSON_OPENING?.data.sessions||[],dictations=new Map(openings.map(s=>[s.id,s]));for(const s of openings)if(s.bookVocabularySource)records.set(s.id,s.bookVocabularySource);
  function clear(){body.replaceChildren();body.className='';}
  function text(tag,text,className){const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;}
  function buttons(show){prev.hidden=next.hidden=zoomButton.hidden=!show;pager.hidden=!show;}
  function showWords(s){
   buttons(false);description.textContent=`Book ${L.book} Unit ${L.unit} · 课后${s.skill}听写词表 · 已包含${s.source_parts.length}部分的全部${s.words.length}个词条。`;
   const wrap=document.createElement('div');wrap.className='source-wordlist';wrap.style.cssText='position:absolute;width:1260px;height:auto;transform-origin:top left;left:0;top:0';const half=Math.ceil(s.words.length/2);
   for(let side=0;side<2;side++){const table=document.createElement('table');table.className='source-words-table';const head=document.createElement('tr');['序号','英文','中文释义','词性'].forEach(t=>head.append(text('th',t)));table.append(head);s.words.slice(side*half,(side+1)*half).forEach(w=>{const row=document.createElement('tr');w.forEach(v=>row.append(text('td',v)));table.append(row)});wrap.append(table);}body.append(wrap);
  }
  function showClassroom(t){
   buttons(false);description.textContent=t.description;
   const panel=text('section','','source-context-panel');panel.append(text('h3',t.title),text('p','来源：'+t.origin));
   for(const item of t.items){const row=text('div','','source-context-row');row.append(text('strong',item.label),text('p',item.detail));if(item.media){const video=/\.(mp4|webm)(?:$|#)/i.test(item.media),media=document.createElement(video?'video':'audio');media.controls=true;media.preload='metadata';media.className='source-original-media';media.src=new URL(item.media,document.baseURI).href;media.addEventListener('loadedmetadata',()=>{if(item.start!==undefined)media.currentTime=item.start;fit();},{once:true});if(item.end!==undefined)media.addEventListener('timeupdate',()=>{if(media.currentTime>=item.end&&!media.paused)media.pause();});row.append(media);}panel.append(row);}body.append(panel);
  }
  function showPage(t){
   const p=t.pages[pageIndex];buttons(true);prev.disabled=pageIndex===0;next.disabled=pageIndex===t.pages.length-1;
   pager.textContent=t.kind==='homework'?`${p.homework} worksheet p. ${p.page} / ${p.total} · Source ${pageIndex+1} of ${t.pages.length}`:`Textbook p. ${p.page} · Source ${pageIndex+1} of ${t.pages.length}`;zoomButton.textContent=zoom?'Full page':'Zoom to selection';
   description.textContent=[`Book ${L.book} ${L.course==='LS'?'Listening and Speaking':'Reading and Writing'} Unit ${L.unit}`,t.section,(t.source_number||t.number)?`Exercise ${t.source_number||t.number}${t.subitem?' · Part '+t.subitem:''}`:''].filter(Boolean).join(' · ');
   const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),wrap=document.createElement('div');wrap.className='source-sheet';wrap.dataset.book=p.book;wrap.dataset.page=p.page;wrap.dataset.loaded='false';
   let box=[0,0,p.width,p.height];if(zoom){const rects=p.boxes.map(b=>b.rect);box=[Math.max(0,Math.min(...rects.map(r=>r[0]))-6),Math.max(0,Math.min(...rects.map(r=>r[1]))-3),Math.min(p.width,Math.max(...rects.map(r=>r[2]))+6),Math.min(p.height,Math.max(...rects.map(r=>r[3]))+3)];}
   svg.setAttribute('viewBox',[box[0],box[1],box[2]-box[0],box[3]-box[1]].join(' '));svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.style.overflow='hidden';svg.setAttribute('role','img');svg.setAttribute('aria-label',t.kind==='homework'?`${t.title}，原练习单第${p.page}页，红框为当前题目及所需材料`:`${p.book}教材p.${p.page}，红框分别定位当前题干、小题、段落或图片`);
   const image=document.createElementNS(ns,'image'),originalURL=p.file?new URL(p.file,p.file.startsWith('assets/page-source-v22/')?generatedRoot:siteRoot).href:new URL(`pages/${p.book}/p${String(p.page).padStart(3,'0')}.webp`,assetRoot).href;const textbook=/\/assets\/textbook-source-v22\/pages\/B[23]_(?:LS|RW)\/p\d{3}\.webp(?:[?#]|$)/.test(originalURL),url=textbook?originalURL.replace('/textbook-source-v22/pages/','/textbook-source-hd-v1/pages/'):originalURL;wrap.dataset.sourceResolution=textbook?'hd-4096':'original';image.setAttribute('href',url);image.setAttribute('width',p.width);image.setAttribute('height',p.height);image.setAttribute('preserveAspectRatio','none');svg.append(image);
   p.boxes.forEach(b=>{const r=document.createElementNS(ns,'rect');r.setAttribute('x',b.rect[0]);r.setAttribute('y',b.rect[1]);r.setAttribute('width',b.rect[2]-b.rect[0]);r.setAttribute('height',b.rect[3]-b.rect[1]);r.setAttribute('fill','none');r.setAttribute('stroke','#e52323');r.setAttribute('stroke-width','2');r.setAttribute('vector-effect','non-scaling-stroke');svg.append(r);});
   const loading=text('span','正在加载本页来源…','source-loading');wrap.append(svg,loading);body.append(wrap);
   const preload=new Image();preload.onload=()=>{wrap.dataset.loaded='true';wrap.dataset.imageWidth=String(preload.naturalWidth);wrap.dataset.imageHeight=String(preload.naturalHeight);loading.hidden=true};preload.onerror=()=>{wrap.dataset.loaded='error';loading.textContent='来源图片加载失败，请重新打开本页来源。'};preload.src=url;
  }
  function draw(){clear();if(dictations.has(active)){const s=dictations.get(active);if(s.bookVocabularySource)showPage(s.bookVocabularySource);else showWords(s);}else{const t=records.get(active);if(!t)throw new Error('Source record missing: '+active);if(t.kind==='classroom')showClassroom(t);else if(t.kind==='supplement'){buttons(false);description.textContent=`本题来源：校本补充练习 · ${t.section}`;body.append(text('p',t.instruction,'source-notice'),text('p',t.note,'source-notice'));}else showPage(t);}requestAnimationFrame(fit);}
  function choose(id){if(!dictations.has(id)&&!records.has(id))throw new Error('Source record missing: '+id);active=id;select.replaceChildren(new Option(id,id));select.value=id;pageIndex=0;zoom=false;draw();}
  function resolve(){const current=U.state().current,binding=pageData.byPage[String(current)],e=U.classroom.exercise();if(e&&records.has(e.id))return e.id;if(binding?.dictation)return binding.dictation;if(binding?.record)return binding.record;if(binding?.exerciseIds){const id=binding.exerciseIds.find(id=>records.get(id)?.number===U.state().exercise)||binding.exerciseIds[0];if(records.has(id))return id;}throw new Error('Current page source missing: '+L.id+' page '+current);}
  function open(id){choose(id||resolve());window.SCHOOL_SIDEBAR?.close(false);dialog.showModal();requestAnimationFrame(fit);}
  app.querySelector('#source-toggle').textContent='查看本页来源';app.querySelector('#source-toggle').onclick=()=>open();dialog.querySelector('#source-close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>body.querySelectorAll('audio,video').forEach(m=>m.pause()));
  prev.onclick=()=>{if(pageIndex>0){pageIndex--;draw()}};next.onclick=()=>{if(pageIndex<(records.get(active)?.pages.length||0)-1){pageIndex++;draw()}};zoomButton.onclick=()=>{zoom=!zoom;draw()};
  dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close();}e.stopPropagation();});
  body.addEventListener('click',e=>e.stopPropagation());
  window.addEventListener('keydown',e=>{if(dialog.open&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();dialog.close();}},true);
  window.addEventListener('resize',fit);
  app.querySelector('.topbar a').href=new URL('index.html',siteRoot).href;
  window.SCHOOL_SOURCE_VIEWER={open,close:()=>dialog.close(),choose,resolve,state:()=>({open:dialog.open,id:active,pageIndex,zoom,kind:dictations.has(active)?'dictation':records.get(active)?.kind,loaded:body.querySelector('.source-sheet')?.dataset.loaded,currentPage:U.state().current}),records,data,pageData};
  const initial=(location.hash.match(/source=([A-Za-z0-9_]+)/)||[])[1];if(initial&&records.has(initial))open(initial);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
