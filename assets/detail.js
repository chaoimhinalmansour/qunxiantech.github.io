/* Audited presentation detail pass. Exact phrase boundaries; original task text retained. */
(()=>{'use strict';let pending=false,working=false,materialRestore=null;const stats={banks:0,tables:0,duplicatePhotos:0},norm=s=>s.replace(/[\s•·]/g,'').replace(/[’‘]/g,"'").toLowerCase();
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
function polish(){if(working||!window.UNLOCK_PLAYER)return;working=true;try{
 const stage=document.querySelector('.stage');if(!stage||stage.classList.contains('scene-stage'))return;
 const key=LESSON.id+':'+UNLOCK_PLAYER.state().current,records=CLASSROOM_DETAIL_BANKS[key]||[];
 const area=stage.querySelector('.ss-body'),count=stage.querySelectorAll('img,svg image').length,refCount=document.querySelectorAll('.reference-pane img,.reference-pane svg image').length;
 if(area&&!area.dataset.refPhotosManual&&!area.dataset.refPhotosChecked&&UNLOCK_PLAYER.state().panel==='photos'&&refCount>0&&count>=refCount){area.dataset.refPhotosChecked='true';UNLOCK_PLAYER.closePanel();stats.duplicatePhotos++;}
 const banks=[...stage.querySelectorAll('.uniform-wordbank,.ss-number-bank,.textbook-word-bank')];
 banks.forEach((bank,i)=>{if(bank.dataset.refined)return;const raw=bank.textContent,r=records.find(r=>norm(r.raw)===norm(raw))||(banks.length===records.length?records[i]:null);if(!r)return;
  bank.dataset.refined='true';bank.dataset.refKind=r.kind;
  if(['navigation','headline','categories','lettered','numbered'].includes(r.kind)){bank.classList.add('ref-original-labels');return;}
  const content=[];if(r.title)content.push(make('strong','ref-bank-title',r.title));
  r.words.forEach((word,j)=>{const item=make('span','ref-bank-item'),index=make('span','ref-bank-index',String(j+1)),copy=make('span','ref-bank-copy',word);index.setAttribute('aria-hidden','true');if(r.given.includes(j)){item.classList.add('ref-bank-given');item.setAttribute('aria-label','Given example '+(j+1)+': '+word);}else item.setAttribute('aria-label','Option '+(j+1)+': '+word);item.append(index,copy);content.push(item);});
  bank.replaceChildren(...content);bank.classList.add('ref-numbered-bank');if(r.kind==='sentence-options')bank.classList.add('ref-sentence-bank');stats.banks++;
 });
 for(const t of stage.querySelectorAll('.ss-body table,.u-aids table,.group-aids table')){
  if(t.dataset.refined||t.rows.length<3)continue;const rows=[...t.rows],n=rows[0].cells.length;if(n!==2&&n!==3)continue;
  const valid=rows.slice(1).every(r=>/^(?:[a-j]|[ivx]+|\d+)[.)]?$/.test(r.cells[0]?.textContent.trim()||''));if(!valid)continue;
  const scores=[1,2].map(c=>rows.slice(1).reduce((s,r)=>s+(r.cells[c]?.textContent.trim().length||0),0)),widths=n===2?['8%','92%']:scores[0]>=scores[1]?['7%','65%','28%']:['7%','28%','65%'];
  let col=t.querySelector('colgroup');if(!col){col=make('colgroup');t.prepend(col);}col.replaceChildren(...widths.map(w=>{const c=make('col');c.style.width=w;return c;}));t.classList.add('ref-label-table');t.dataset.refined='true';stats.tables++;
 }
 // Existing layout engine paginates task content while keeping the established body type size.
 if(stage.querySelector('.ref-numbered-bank:not([data-ref-fit])')){stage.querySelectorAll('.ref-numbered-bank').forEach(n=>n.dataset.refFit='true');window.SCHOOL_TEXTBOOK_COMPLETE?.fit(stage);}


 const contextCopy={
 'B3_LS_U07:114':['SPEAKING TASK','Take part in an interview to find out attitudes about uniforms and dress codes.'],
 'B3_LS_U07:120':['SPEAKING TASK','Take part in an interview to find out attitudes about uniforms and dress codes.'],
 'B3_LS_U07:137':['SPEAKING TASK','Take part in an interview to find out attitudes about uniforms and dress codes.'],
 'B3_LS_U04:115':['DEBATE STATEMENT','Special occasions have become too commercial.']
 }[key];
 if(contextCopy&&!stage.querySelector('.ref-task-context')){const col=stage.querySelector('.ss-body .ss-column');if(col){const item=make('div','ss-item ref-task-context'),label=make('strong','',contextCopy[0]),copy=make('p','',contextCopy[1]);item.append(label,copy);col.prepend(item);}}
 // This discussion refers to the ten original arguments, which must stay visible.
 if(key==='B3_RW_U07:153'&&area&&!area.querySelector('.ref-argument-context')){
  const col=area.querySelector('.ss-column');if(col){const item=make('section','ss-item ref-argument-context'),topic=make('p','ref-argument-topic','The fashion industry is harmful to society and the environment. Do you agree or disagree?'),list=make('ol','ref-argument-list');
  for(const phrase of ['creates new jobs','causes too much waste','encourages child labour','pays overseas workers badly','lets people show their personality','is important to the economy','allows people to change their look','harms the environment','makes children worry about their appearance','brings investment to developing countries'])list.append(make('li','',phrase));
  item.append(topic,list);col.prepend(item);}
 }
 const materialButton=document.querySelector('#material-open');
 if(LESSON.id==='B3_RW_U03'&&[160,166].includes(UNLOCK_PLAYER.state().current)){
  if(!materialRestore)materialRestore=materialButton.onclick;materialButton.hidden=false;materialButton.onclick=()=>UNLOCK_PLAYER.openMaterial([161,162,152]);
 }else if(materialRestore){materialButton.onclick=materialRestore;materialRestore=null;}
 // A presentation prompt has one question view; hidden sample paragraphs must not create empty steps.
 const promptOnly=new Set(['B3_LS_U03:154','B3_LS_U05:148','B3_LS_U07:146','B3_LS_U08:166']);
 if(promptOnly.has(key)){stage.dataset.refSampleNavigation='true';const nav=stage.querySelector('.fmt-section-nav');if(nav){nav.dataset.refPromptNav='true';nav.hidden=!stage.classList.contains('answers-visible')&&!document.querySelector('#app.review-open');for(const button of nav.querySelectorAll('button'))if(!button.dataset.refSampleClick){button.dataset.refSampleClick='true';const handler=button.onclick;button.onclick=()=>{const revealed=stage.classList.contains('answers-visible');if(revealed)stage.classList.remove('answers-visible');handler?.();if(revealed)stage.classList.add('answers-visible');polish();window.CLASSROOM_TOOLS?.sync?.();};}}}else if(stage.dataset.refSampleNavigation)delete stage.dataset.refSampleNavigation;
 updateCues(stage);
}finally{working=false;}}
function updateCues(stage){
 for(const area of stage.querySelectorAll('.ss-body,.dictation-frame,.u-question-copy,.ref-sentence-bank')){
  if(!area.clientHeight)continue;if(!area.innerText.trim()){if(area._refCue)area._refCue.hidden=true;continue;}const scrollable=area.scrollHeight>area.clientHeight+20&&['auto','scroll'].includes(getComputedStyle(area).overflowY);
  let cue=area._refCue;
  if(!scrollable){if(cue)cue.hidden=true;continue;}
  if(!cue||!cue.isConnected){cue=make('span','ref-scroll-cue','More below');cue.setAttribute('aria-hidden','true');stage.append(cue);area._refCue=cue;area.addEventListener('scroll',()=>positionCue(stage,area,cue),{passive:true});}positionCue(stage,area,cue);
 }
}
function positionCue(stage,area,cue){const s=stage.getBoundingClientRect(),r=area.getBoundingClientRect(),z=s.width/1920;cue.hidden=area.scrollTop+area.clientHeight>=area.scrollHeight-8;cue.style.left=((r.right-s.left)/z-165)+'px';cue.style.top=((r.bottom-s.top)/z-38)+'px';}

function labelInvestmentMaterials(){
 if(LESSON.id!=='B3_RW_U08')return;const sel=document.querySelector('#material-select'),res=UNLOCK_PLAYER.classroom.resource();
 if(!sel||!res||res.id!=='article_390de50d3219'||sel.dataset.refArticle==='investment')return;
 const opts=[...sel.options],selected=sel.value;if(opts.length!==11)return;
 const textGroup=make('optgroup'),graphGroup=make('optgroup');textGroup.label='Article paragraphs';graphGroup.label='Graphs';
 const names=['Paragraph 1, first part','Paragraph 1, second part','Paragraph 2, first part','Paragraph 2, second part','Paragraph 3, first part','Paragraph 3, second part','Paragraph 3, third part','Paragraph 4','Gold price, 2014–2023','Car values, chart','Car values, textbook original'];
 opts.forEach((o,i)=>{o.textContent=names[i];(i<8?textGroup:graphGroup).append(o);});sel.replaceChildren(graphGroup,textGroup);sel.value=selected;sel.dataset.refArticle='investment';
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;polish();labelInvestmentMaterials();});}
const timer=setInterval(()=>{if(!window.PLAIN_PRESENTATION_TEXT||!window.CLASSROOM_TOOLS)return;clearInterval(timer);const flush=PLAIN_PRESENTATION_TEXT.flush;PLAIN_PRESENTATION_TEXT.flush=(...args)=>{const result=flush(...args);polish();return result;};document.addEventListener('click',e=>{if(e.target.closest('#material-open')){const area=document.querySelector('.stage .ss-body');if(area)area.dataset.refPhotosManual='true';}},{capture:true});new MutationObserver(schedule).observe(document.querySelector('.stage'),{childList:true,subtree:true,attributes:true,attributeFilter:['class']});document.addEventListener('click',schedule);new MutationObserver(()=>{const s=document.querySelector('#material-select');if(s?.dataset.refArticle&&!s.querySelector('optgroup'))delete s.dataset.refArticle;schedule();}).observe(document.querySelector('#material-select'),{childList:true});polish();window.CLASSROOM_DETAIL_REFINED={polish,stats};},50);
})();