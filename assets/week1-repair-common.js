/* First-week fixed choice zones, visible task steps and paged materials. */
(()=>{'use strict';
const VERSION='20261025-week1-repair-6';let queued=false,busy=false,stage,U,autoReaderKey='';
const txt=n=>(n?.textContent||'').replace(/\s+/g,' ').trim();
const set=(n,p,v)=>{if(n.style.getPropertyValue(p)!==v)n.style.setProperty(p,v,'important')};
const firstWeek=()=>/Week 1/.test(document.querySelector('.a-classroom-meta')?.textContent||'')&&!stage?.querySelector('.u-homework,.group-homework');
function guide(){
 const st=U.state(),k=window.LESSON.id+':'+st.current+':'+(st.exercise??''),s=window.CLASSROOM_RESTORE_CASES?.[k];
 const old=stage.querySelector(':scope>.guided-screen');
 if(!s||!old||stage.querySelector(':scope>.ss-body,:scope>.scene-body'))return;
 if(!s.html&&!s.parts?.length){const tries=Number(old.dataset.w1Waiting||0);if(tries<10){old.dataset.w1Waiting=String(tries+1);setTimeout(schedule,200)}return}
 const header=document.createElement('header');header.className='ss-header';
 const section=document.createElement('div');section.className='ss-section';section.textContent=old.querySelector('small')?.textContent||'READING';
 const title=document.createElement('h1');title.className='ss-title';title.textContent=old.querySelector('h1,h2')?.textContent||'READ AND LISTEN';
 const instruction=document.createElement('div');instruction.className='ss-instruction';instruction.textContent=[...old.querySelectorAll('.guided-instructions p')].map(n=>n.textContent.trim()).join('\n')||old.querySelector('.u-guide-task,.u-task-instruction')?.textContent||'';
 header.append(section,title,instruction);
 const body=document.createElement('div');body.className='ss-body';body.dataset.formatDone='true';body.dataset.formatType='approved-reading-carrier';
 const mediaBar=document.querySelector('#app .media-bar');if(mediaBar)for(const media of old.querySelectorAll('audio,video'))mediaBar.append(media);old.classList.add('w1-replaced-guided');old.hidden=true;stage.append(header,body);
 window.CLASSROOM_CONTEXT_RESTORATION?.refresh();
}
function bank(){
 const h=stage.querySelector(':scope>.ss-header,:scope>.scene-head'),b=stage.querySelector(':scope>.ss-body,:scope>.scene-body');if(!h||!b)return;
 if(b.classList.contains('cr-restored-body')||b.dataset.layoutOwner?.startsWith('week1')){
  for(const host of h.querySelectorAll(':scope>.fmt-header-banks'))set(host,'display','none');
  for(const bank of b.querySelectorAll('.w1ls-bank'))[...bank.children].forEach((item,i)=>{const n=item.querySelector('b');if(n)n.dataset.w1Choice=String.fromCharCode(0x2460+i)});
  return;
 }
 const hosts=[...h.querySelectorAll(':scope>.fmt-header-banks')];const prior=b.querySelector(':scope>.w1-choice-zone');if(prior)for(const group of prior.querySelectorAll('.uniform-wordbank'))for(const [i,n] of [...group.querySelectorAll('.ref-bank-index')].entries())n.dataset.w1Choice=String.fromCharCode(0x2460+i);if(!hosts.length)return;
 let zone=b.querySelector(':scope>.w1-choice-zone'),content=b.querySelector(':scope>.w1-choice-content');
 if(!zone){zone=document.createElement('div');zone.className='w1-choice-zone';content=document.createElement('div');content.className='w1-choice-content';const cs=getComputedStyle(b);content.style.display=cs.display;content.style.gridTemplateColumns=cs.gridTemplateColumns;content.style.gap=cs.gap;while(b.firstChild)content.append(b.firstChild);b.append(zone,content);b.classList.add('w1-choices-with-content')}
 for(const host of hosts){zone.append(host);for(const item of host.querySelectorAll('.ref-bank-item')){const n=item.querySelector('.ref-bank-index');if(n){const v=Number(n.textContent);const label=v>=1&&v<=20?String.fromCharCode(0x2460+v-1):n.textContent;if(n.dataset.w1Choice!==label)n.dataset.w1Choice=label}}}
}
function steps(){
 const part=document.querySelector('#part-select'),b=stage.querySelector(':scope>.ss-body,:scope>.scene-body');let nav=stage.querySelector(':scope>.w1-native-parts');
 const opts=part?[...part.options]:[],custom=!!b?.querySelector('.cr-part-nav,.w1-task-tabs,[data-week1-tabs]');
 const eligible=firstWeek()&&opts.length>1&&!custom&&!stage.classList.contains('ot-layout')&&!b?.classList.contains('cr-restored-body');
 if(!eligible){if(nav)nav.hidden=true;stage.classList.remove('w1-has-native-parts');return}
 if(!nav){nav=document.createElement('nav');nav.className='w1-native-parts';nav.setAttribute('aria-label','Task steps');stage.append(nav)}
 const signature=opts.map(o=>o.value+'|'+o.textContent).join('\n');
 if(nav.dataset.options!==signature){nav.replaceChildren();opts.forEach((o,i)=>{const button=document.createElement('button');button.type='button';button.dataset.value=o.value;button.textContent=(i+1)+' / '+opts.length+' · '+o.textContent.replace(/^\d+\s*\/\s*\d+\s*[·:–-]?\s*/,'');button.onclick=()=>{part.value=o.value;part.dispatchEvent(new Event('change',{bubbles:true}));schedule()};nav.append(button)});nav.dataset.options=signature}
 nav.hidden=false;for(const n of nav.children)n.setAttribute('aria-current',n.dataset.value===part.value?'step':'false');stage.classList.add('w1-has-native-parts');
}
let readerState=null;
function splitTextNode(block){
 const raw=block.textContent||'';if(raw.length<=500)return [block.cloneNode(true)];
 const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT),nodes=[];let node,total=0;while(node=walker.nextNode()){nodes.push({node,start:total,end:total+node.length});total+=node.length}
 const words=[...raw.matchAll(/\S+\s*/g)],parts=[];
 function point(offset){const item=nodes.find(n=>offset<n.end)||nodes[nodes.length-1];return [item.node,Math.max(0,Math.min(item.node.length,offset-item.start))]}
 for(let i=0;i<words.length;i+=60){const from=words[i].index,to=i+60<words.length?words[i+60].index:raw.length,range=document.createRange(),a=point(from),b=point(to);range.setStart(a[0],a[1]);range.setEnd(b[0],b[1]);const copy=block.cloneNode(false);copy.append(range.cloneContents());copy.dataset.textContinuation=i?'true':'false';parts.push(copy)}
 return parts;
}

function openReadableArticle(){
 const st=U.state();if(st.panel!=='material'){autoReaderKey='';return}
 const k=window.LESSON.id+':'+st.current+':'+(st.exercise??'');
 if(autoReaderKey===k)return;
 const r=Object.values(U.classroom?.graph?.resources||{}).find(r=>r.kind==='article'&&r.parts?.includes(st.material));
 if(!r)return;autoReaderKey=k;
 if(!st.reader)U.classroom.openResource(r);
}
function material(){
 const doc=document.querySelector('.reader-document'),pane=document.querySelector('.reference-pane');
 if(!firstWeek()||!doc||doc.hidden||pane?.hidden){readerState=null;return}
 doc.classList.add('w1-paged-reader');const ready=doc.querySelector(':scope>.w1-reader-page');
 if(!ready){
  const units=[];for(const section of [...doc.children]){
   const heading=section.querySelector(':scope>h2')?.cloneNode(true);
   const nodes=[...section.children].filter(n=>n.tagName!=='H2');
   for(const node of nodes){const illustration=node.querySelector('[data-week1-figure]');const figure=illustration?.cloneNode(true);if(figure){figure.removeAttribute('style');figure.className='w1-reader-figure';figure.querySelectorAll('[style]').forEach(n=>n.removeAttribute('style'))}const parts=figure?[figure]:node.matches('.reader-text-block')?splitTextNode(node):[node.cloneNode(true)];for(const item of parts){const unit=document.createElement('section');unit.className='w1-reader-unit';unit.dataset.sourcePage=section.dataset.sourcePage||'';if(heading)unit.append(heading.cloneNode(true));unit.append(item);units.push(unit)}}
  }
  if(!units.length)return;
  const page=document.createElement('article'),nav=document.createElement('nav');page.className='w1-reader-page';nav.className='w1-reader-pages';nav.setAttribute('aria-label','Material pages');doc.replaceChildren(nav,page);
  readerState={doc,page,nav,units,pages:[],index:0,width:0,height:0,media:'',initialSource:String(U.state().material||''),initialPending:true};
  const loadingState=readerState,images=units.flatMap(n=>[...n.querySelectorAll('img')]);
  if(images.length)Promise.all(images.map(im=>im.decode?im.decode().catch(()=>{}):Promise.resolve())).then(()=>{if(readerState===loadingState){loadingState.width=0;schedule()}});
 }else if(readerState?.doc!==doc)return;
 const state=readerState;if(!state)return;const w=doc.clientWidth,h=doc.clientHeight,media=state.units.flatMap(n=>[...n.querySelectorAll('img')]).map(im=>[im.currentSrc||im.src,im.complete,im.naturalWidth,im.naturalHeight].join(':')).join('|');
 if(w!==state.width||h!==state.height||media!==state.media||!state.pages.length){
  state.width=w;state.height=h;state.media=media;state.pages=[];let bucket=[];state.page.replaceChildren();
  for(const item of state.units){const n=item.cloneNode(true);state.page.append(n);if(state.page.scrollHeight>state.page.clientHeight+2&&bucket.length){state.pages.push(bucket);bucket=[item];state.page.replaceChildren(item.cloneNode(true))}else bucket.push(item)}
  if(bucket.length)state.pages.push(bucket);state.index=Math.min(state.index,state.pages.length-1);if(state.initialPending){let target=state.pages.findIndex(bucket=>bucket.some(n=>n.dataset.sourcePage===state.initialSource));if(target<0){const label=U.structure.pageInfo[state.initialSource]?.materialLabel;if(label)target=state.pages.findIndex(bucket=>bucket.some(n=>n.querySelector(':scope>h2')?.textContent.trim()===label.trim()))}if(target>=0)state.index=target;state.initialPending=false}
  paintReader(state);
 }
}
function paintReader(s){const nodes=s.pages[s.index].map(n=>n.cloneNode(true));let previous='';for(const node of nodes){const heading=node.querySelector(':scope>h2');if(heading&&heading.textContent===previous)heading.remove();else if(heading)previous=heading.textContent}s.page.replaceChildren(...nodes);s.nav.replaceChildren();const count=s.pages.length,indices=count>6?[...new Set([0,count-1,s.index-1,s.index,s.index+1].filter(i=>i>=0&&i<count))].sort((a,b)=>a-b):s.pages.map((_,i)=>i);const add=(i,label,disabled=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.disabled=disabled;b.setAttribute('aria-current',label.includes(' / ')&&i===s.index?'page':'false');b.onclick=()=>{s.index=i;paintReader(s)};s.nav.append(b)};if(count>6)add(Math.max(0,s.index-1),'Previous',s.index===0);for(const i of indices)add(i,(i+1)+' / '+count);if(count>6)add(Math.min(count-1,s.index+1),'Next',s.index===count-1);s.doc.classList.add('w1-paged-reader');s.doc.dataset.week1Pages=String(s.pages.length);s.doc.dataset.week1Page=String(s.index+1);s.doc.scrollTop=0}
function geometry(){
 const b=stage.querySelector(':scope>.ss-body,:scope>.scene-body');if(!b)return;
 const native=stage.classList.contains('w1-has-native-parts');if(native){set(b,'top','362px');set(b,'height','648px')}
 const over=[];for(const n of stage.querySelectorAll('.ss-header>.ss-title,.ss-header>.ss-instruction,.w1-choice-zone,.w1-choice-content,.cr-restored-content'))if(n.getClientRects().length&&n.scrollHeight>n.clientHeight+8)over.push(n.className);stage.dataset.week1Overflow=over.join('|');
}
function apply(){if(!stage)return;const eligible=firstWeek(),app=document.querySelector('#app');app.dataset.w1FixedSplit=String(eligible&&!!U.state().panel);if(busy||!eligible)return;busy=true;try{guide();bank();steps();openReadableArticle();material();geometry()}finally{busy=false}}
function schedule(){if(queued)return;queued=true;const run=()=>{if(!queued)return;queued=false;apply()};requestAnimationFrame(run);setTimeout(run,120)}
function boot(){if(!window.CLASSROOM_FIXED_REGIONS||!window.CLASSROOM_TASK_CONTROLS||!window.UNLOCK_PLAYER)return setTimeout(boot,60);U=window.UNLOCK_PLAYER;stage=document.querySelector('#app .stage');new MutationObserver(schedule).observe(document.querySelector('#app'),{childList:true,subtree:true});window.addEventListener('resize',()=>{if(readerState){readerState.width=0;readerState.height=0}schedule()});document.addEventListener('click',schedule);window.addEventListener('hashchange',schedule);document.addEventListener('load',schedule,true);window.W1_REPAIR_RUNTIME={version:VERSION,refresh:()=>{apply();schedule()},audit:()=>({overflow:stage.dataset.week1Overflow||'',materialPages:readerState?.pages.length||0})};schedule()}
boot();
})();