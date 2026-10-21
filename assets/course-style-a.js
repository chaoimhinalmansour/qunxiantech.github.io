'use strict';
(()=>{
 const initialEntry=!location.hash,root=document.documentElement,homeURL=new URL('../index.html',document.currentScript.src).href;
 root.dataset.courseTheme='a';
 const colors={ink:'ink',muted:'muted',accent:'accent',answer:'answer'};
 let entered=!initialEntry,entry=null,ctxRef=null;
 function dictation(stage){const view=stage.querySelector('.lesson-dictation');if(!view)return;const rows=Math.max(...[...view.querySelectorAll('tbody')].map(b=>b.rows.length));view.dataset.density=rows>15?'dense':rows>12?'compact':'regular';view.style.setProperty('--a-row',Math.min(62,Math.floor(704/(rows+1)))+'px');}
 function imageFrames(stage){
  const page=window.UNLOCK_PLAYER?.state().current;if(!window.SCHOOL_VOCABULARY_SCOPE?.data.pages[String(page)]?.primary)return;
  for(const img of stage.querySelectorAll(':scope>.obj img')){
   const frame=img.closest('.obj');if(frame&&!frame.querySelector('table,.text,audio,video')){frame.dataset.aImageFrame='true';for(const n of stage.querySelectorAll(':scope>.obj[data-name="textbook-image-placeholder"]'))if(['left','top','width','height'].every(k=>Math.abs(parseFloat(n.style[k])-parseFloat(frame.style[k]))<2))n.dataset.aPhotoOutline='true';}
  }
 }
 function additionalPolish(stage){
  if(!stage.classList.contains('a-additional'))return;
  for(const bank of stage.querySelectorAll('.uniform-wordbank:not(.a-additional-bank)')){
   const words=bank.textContent.split(/[①-⑳]/).map(w=>w.trim()).filter(Boolean);if(!words.length)continue;
   bank.classList.add('a-additional-bank');bank.replaceChildren();words.forEach((w,i)=>{const option=document.createElement('span'),number=document.createElement('span');option.className='a-bank-option';number.className='a-bank-number';number.textContent=String(i+1)+'.';option.append(number,document.createTextNode(' '+w));bank.append(option);});
  }
  const current=window.UNLOCK_PLAYER?.state().current??ctxRef?.state().current;
  const raw=document.createElement('div');raw.innerHTML=LESSON.pages[current-1].html;
  const locationText=raw.textContent.match(/Book p\.\s*([\d,–-]+)/i)?.[1];
  let label=stage.querySelector('.a-additional-label');if(!label){label=document.createElement('div');label.className='a-additional-label';stage.append(label);}
  label.textContent='Additional practice'+(locationText?'　教材 p. '+locationText:'');
  for(const row of stage.querySelectorAll('.ss-body .fmt-judgement')){
   const node=row.closest('.ss-node'),source=[...raw.children].find(n=>n.dataset.id===node?.dataset.id),content=row.querySelector('.ss-numbered-content'),slot=row.querySelector('.inline-answer-slot');
   if(!source||!content||!slot)continue;const original=source.textContent.trim().replace(/^\s*\d+[.)]?\s+/,''),parts=original.split(/_{2,}/);if(parts.length!==2)continue;
   const placeholder=slot.querySelector('.inline-answer-placeholder');if(placeholder)placeholder.textContent=original.match(/_{2,}/)[0];
   content.replaceChildren(document.createTextNode(parts[0]),slot,document.createTextNode(parts[1]));row.querySelector('.fmt-judgement-key')?.remove();row.classList.remove('fmt-judgement');
  }
  for(const slot of stage.querySelectorAll('.ss-body .inline-answer-slot'))slot.style.setProperty('margin-inline','0.12em','important');
 }
 function additional(stage,ctx){
  const state=ctx.state(),page=window.LESSON?.pages[state.current-1];
  if(state.raw||!page||!/Additional practice/i.test(page.html)||stage.querySelector('.a-additional-label'))return false;
  if(stage.querySelector('.ss-body')){stage.classList.add('a-additional');return false;}
  const text=n=>n.textContent.trim(),plain=n=>text(n).replace(/\s+/g,' '),top=n=>parseFloat(n.style.top)||0;
  const nodes=[...stage.children].filter(n=>n.classList.contains('obj')&&!n.hidden&&!n.classList.contains('layer')&&!n.classList.contains('source-page-footer')&&!n.classList.contains('source-footer'));
  const instruction=nodes.find(n=>/^(?:Additional practice[.:]?\s*)?Complete\b/i.test(plain(n)));
  if(!instruction)return false;
  const body=nodes.filter(n=>n!==instruction&&top(n)>=200&&!/^Additional practice$/i.test(plain(n))&&!/textbook-(secondary|tertiary)/.test(n.dataset.name||''));
  const firstNumbered=body.findIndex(n=>/^\d+[.)]?\s+/.test(plain(n)));
  const bankNode=body.find((n,i)=>i<firstNumbered&&!n.querySelector('table,img,svg')&&!/[.!?]/.test(plain(n)));
  const rawBank=bankNode?text(bankNode):'';
  let words=rawBank.split(/[①-⑳]/.test(rawBank)?/[①-⑳]/:/\s{2,}|\s*[·•]\s*/).map(s=>s.trim()).filter(Boolean);
  if(!words.length){const m=plain(instruction).match(/\bwith\s+(.+?)\.?$/i);if(m&&!/\bwords?|\bsentences?|\barticle\b|\bbox\b|\bglossary\b/.test(m[1]))words=m[1].replace(/\.$/,'').split(/,\s*|\s+or\s+/).map(s=>s.trim()).filter(Boolean);}
  const make=(tag,cls,value)=>{const n=document.createElement(tag);n.className=cls;if(value)n.textContent=value;return n;};
  const head=make('header','ss-header'),titles=(page.title||'').split('|');
  if(titles[0]?.trim()===page.section?.trim()&&/WATCH AND LISTEN/i.test(page.section)&&/GLOSSARY/i.test(titles[1]||''))titles[0]='PREPARING TO WATCH';
  head.append(make('div','ss-section',page.section),make('h1','ss-title',titles[0]),make('div','ss-subtitle',titles[1]||''),make('div','ss-instruction',plain(instruction).replace(/^Additional practice[.:]?\s*/i,'')));
  if(words.length){const bank=make('div','uniform-wordbank a-additional-bank');words.forEach((w,i)=>{const option=make('span','a-bank-option');option.append(make('span','a-bank-number',String(i+1)+'.'),document.createTextNode(' '+w));bank.append(option);});head.append(bank);}
  const area=make('div','ss-body'),column=make('div','ss-column');area.append(column);
  for(const node of body.filter(n=>n!==bankNode)){
   const group=make('div','ss-item');node.classList.add('ss-node');node.style.cssText='';
   for(const n of node.querySelectorAll('.text,p,span')){n.style.fontSize='';n.style.lineHeight='';if(n.classList.contains('text')){n.style.padding='0';n.style.justifyContent='flex-start';}if(n.tagName==='P'){n.style.whiteSpace='normal';n.style.margin='0';}}
   for(const p of node.querySelectorAll('.text>p')){
    const lead=p.textContent.match(/^\s*(\d+[.)]?)\s+/);if(!lead)continue;
    const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);let pos=0,start=null,offset=0;
    while(walker.nextNode()){if(pos+walker.currentNode.length>=lead[0].length){start=walker.currentNode;offset=lead[0].length-pos;break;}pos+=walker.currentNode.length;}
    if(start){const range=document.createRange();range.setStart(start,offset);range.setEnd(p,p.childNodes.length);const content=make('span','ss-numbered-content');content.append(range.extractContents());p.replaceChildren(make('span','ss-numbered-number',lead[1]),content);p.classList.add('ss-numbered-row');}
   }
   group.append(node);column.append(group);
  }
  const source=stage.querySelector('.page-source-button');stage.replaceChildren(head,area,make('div','a-additional-label','Additional practice'));if(source)stage.append(source);
  stage.classList.add('ss-layout','format-standard','a-additional');stage.dataset.screenTemplate='additional-practice';
  area.style.top=Math.max(300,head.offsetTop+head.offsetHeight+36)+'px';area.style.height=(1010-parseFloat(area.style.top))+'px';
  return true;
 }

 function standardHeader(stage){
  const head=stage.querySelector('.ss-header');if(!head)return;
  const labels=[...head.children].filter(n=>n.classList.contains('ss-section'));
  const title=head.querySelector(':scope>.ss-title');
  if(title)for(const label of labels)if(label.textContent.trim().toLowerCase()===title.textContent.trim().toLowerCase())label.hidden=true;
  if(!title&&labels.length===1)labels[0].classList.replace('ss-section','ss-title');
  for(const node of head.querySelectorAll(':scope>.ss-subtitle'))if(!node.textContent.trim())node.hidden=true;
  if(labels.length>1&&!head.querySelector(':scope>.ss-title')){
   labels[1].classList.replace('ss-section','ss-title');
  }
  for(const node of head.querySelectorAll(':scope>.ss-subtitle')){
   if(/^Possible answers?\b/i.test(node.textContent.trim()))node.classList.replace('ss-subtitle','a-header-feedback');
  }
  if(!head.querySelector(':scope>.ss-section,:scope>.ss-title')){
   const remaining=[...head.querySelectorAll(':scope>.ss-subtitle')].filter(n=>n.textContent.trim());
   if(remaining.length===1)remaining[0].classList.replace('ss-subtitle','ss-title');
  }
  const area=stage.querySelector('.ss-body');if(area){const top=Math.max(220,head.offsetTop+head.offsetHeight+28);area.style.top=top+'px';area.style.height=(1010-top)+'px';}
  const scale=stage.getBoundingClientRect().width/1920;
  if(scale>0)for(const graphic of stage.querySelectorAll('.ss-item.ss-graphic-item'))if(!graphic.dataset.stableGraphicHeight){const height=graphic.getBoundingClientRect().height/scale;if(height>0){graphic.style.minHeight=height+'px';graphic.dataset.stableGraphicHeight='true';}}

 }


 function classroomContext(stage){
  const U=window.UNLOCK_PLAYER,state=ctxRef?.state()||U?.state(),S=ctxRef?.structure||U?.structure,lesson=window.LESSON;
  if(!state||!S?.routes?.length||!lesson)return;
  stage.dataset.aUnit=lesson.id;stage.dataset.aPage=String(state.current);
  const routes=S.routes,sessions=window.SCHOOL_LESSON_OPENING?.data.sessions||window.SCHOOL_LESSON_OPENINGS?.sessions||[];
  let index=U?.state().current===state.current?U.state().routeIndex:S.routeMap[String(state.current)];
  if(!Number.isInteger(index)||!routes[index])index=routes.findIndex(r=>r.anchor===state.current||r.pages?.includes(state.current));
  if(index<0)index=0;
  let session=sessions[0];
  for(const item of sessions){const start=routes.findIndex(r=>r.anchor===item.plan);if(start>=0&&start<=index)session=item;}
  let footer=stage.querySelector(':scope>.a-classroom-meta');
  if(!footer){footer=document.createElement('footer');footer.className='a-classroom-meta';footer.setAttribute('aria-label','课程信息');for(const cls of ['a-meta-unit','a-meta-session','a-meta-page']){const span=document.createElement('span');span.className=cls;footer.append(span);}stage.append(footer);}
  const parts=['UNLOCK',`Book ${lesson.book}`,lesson.course==='LS'?'LS 听说':'RW 读写',`Unit ${lesson.unit}`];footer.querySelector('.a-meta-unit').replaceChildren(...parts.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
  footer.querySelector('.a-meta-session').textContent=session?`第${session.week}周 ${session.skill}`:'单元导学';
  footer.querySelector('.a-meta-page').textContent=`课件第 ${index+1} 页，共 ${routes.length} 页`;
  footer.dataset.unit=lesson.id;footer.dataset.session=session?.id||'';footer.dataset.route=String(index);
 }

 function skin(stage){
  classroomContext(stage);
  standardHeader(stage);
  imageFrames(stage);additionalPolish(stage);
  dictation(stage);
  const page=window.UNLOCK_PLAYER?.state().current,scope=window.SCHOOL_VOCABULARY_SCOPE?.data.pages[String(page)];
  stage.toggleAttribute('data-a-vocabulary',!!scope?.primary);
  for(const table of stage.querySelectorAll('table:not(.dictation-table)')){const row=table.rows[0];if(row&&(table.dataset.formatHeader==='true'||[...row.cells].some(c=>c.tagName==='TH'||c.style.backgroundColor&&!/255, 255, 255|transparent/.test(c.style.backgroundColor))))row.classList.add('a-table-head');}
  for(const n of stage.querySelectorAll('[style]')){
   if(n.dataset.courseColor||!n.style.color||n.closest('.page-source-viewer,.lesson-source-intro'))continue;
   const values=n.style.color.match(/[\d.]+/g)?.map(Number);if(!values||values.length<3)continue;
   const [r,g,b]=values;let role='';
   if(Math.max(r,g,b)<145)role=colors.ink;
   else if(r>150&&g<70&&b<90)role=colors.answer;
   else if((r>g*1.4&&b>g*1.2)||(r>160&&g>65&&g<135&&b<100))role=colors.accent;
   else if(g>r*1.25&&g>b*1.05)role=colors.muted;
   else if(Math.max(r,g,b)-Math.min(r,g,b)<45)role=Math.max(r,g,b)>90?colors.muted:colors.ink;
   if(role)n.dataset.courseColor=role;
  }
  if(scope?.primary)for(const obj of stage.querySelectorAll(':scope>.obj'))if(parseFloat(obj.style.top)<80&&!obj.querySelector('button,img,svg')&&obj.textContent.trim().length<100)for(const n of obj.querySelectorAll('.text span'))if(parseFloat(getComputedStyle(n).fontSize)<=32)n.dataset.courseColor='accent';
  for(const b of stage.querySelectorAll('.vocabulary-mosaic'))if(!b.dataset.courseLabel){b.textContent='点击查看中文释义';b.dataset.courseLabel='true';}
  if(entered&&window.UNLOCK_PLAYER&&!window.UNLOCK_PLAYER.state().raw){try{localStorage.setItem('unlock-classroom-last',JSON.stringify({unit:LESSON.id,page:UNLOCK_PLAYER.state().current}));}catch(_){}}
 }
 const original=window.createSchoolQuestionView;
 if(original)window.createSchoolQuestionView=ctx=>{ctxRef=ctx;const view=original(ctx);return {...view,renderQuestion(e){ctx.stage.classList.remove('a-additional');return view.renderQuestion(e);},prepareInline(){const r=view.prepareInline();if(additional(ctx.stage,ctx)){view.refresh();}skin(ctx.stage);return r;},refresh(){view.refresh();skin(ctx.stage);},openReview(kind){const r=view.openReview(kind);skin(ctx.stage);return r;},closeReview(){const r=view.closeReview();skin(ctx.stage);return r;}};};
 function launch(){
  const U=window.UNLOCK_PLAYER,catalog=window.COURSE_CATALOG_A||[],unit=catalog.find(u=>u.id===window.LESSON?.id);if(!U||!unit)return;
  const app=document.getElementById('app');
  function openLesson(page){entered=true;for(const n of app.children)if(n!==entry)n.inert=false;if(entry)entry.hidden=true;U.goto(page,false);const stage=document.querySelector('.stage');skin(stage);stage.setAttribute('tabindex','-1');stage.focus({preventScroll:true});}
  function unitHome(){if(U.questionView.isReview())U.questionView.closeReview();U.closePanel();if(!entry){entry=document.createElement('section');entry.className='unit-welcome';entry.setAttribute('aria-labelledby','unit-welcome-title');app.append(entry);const course=unit.course==='LS'?'Listening and Speaking':'Reading and Writing';entry.innerHTML=`<header class="unit-top"><a class="a-wordmark" href="${homeURL}">UNLOCK<span>课堂课件</span></a><a href="${homeURL}#book=${unit.book}&course=${unit.course}">返回课程首页</a></header><main class="unit-main"><p class="unit-eyebrow">Book ${unit.book} · ${course}</p><div class="unit-hero"><div><p class="unit-number">Unit ${String(unit.unit).padStart(2,'0')}</p><h1 id="unit-welcome-title">${unit.displayTheme}</h1><p class="unit-chinese">${unit.chineseTheme}</p></div><p class="unit-intro">选择本节课，<br>从课堂计划开始。</p></div><div class="unit-session-grid">${unit.sessions.map((s,i)=>`<button class="unit-session" data-lesson="${s.plan}"><span class="session-week">第 ${s.week} 周</span><h2>${s.skill}</h2><p>${s.tasks.slice(0,3).map(t=>t.label).join('、')}</p><span class="session-enter">进入本节课 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></span></button>`).join('')}</div><p class="unit-footnote">教材来源、听写音频与练习讲评均可在课堂中直接打开。</p></main>`;entry.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(Number(b.dataset.lesson)));}
   for(const n of app.children)if(n!==entry)n.inert=true;entry.hidden=false;const title=entry.querySelector('h1');title.tabIndex=-1;title.focus({preventScroll:true});
  }
  const sidebar=document.querySelector('.teacher-sidebar'),group=document.createElement('section'),button=document.createElement('button');button.className='unit-home-button';button.type='button';button.textContent='本单元课次';button.onclick=unitHome;group.append(button);sidebar?.append(group);
  document.addEventListener('keydown',e=>{if(entry&&!entry.hidden&&(['ArrowLeft','ArrowRight','PageUp','PageDown'].includes(e.key)||e.key===' '&&!e.target.closest('button,a,input'))){e.preventDefault();e.stopImmediatePropagation();}},true);
  if(initialEntry)unitHome();else skin(document.querySelector('.stage'));
  window.SCHOOL_STYLE_A={skin,header:standardHeader,unitHome,openLesson,version:'20261018-a',unit};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',launch);else launch();
})();
