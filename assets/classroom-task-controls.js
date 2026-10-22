/* Task operations adapt to the current activity. Existing controls retain their handlers. */
(()=>{'use strict';
const VERSION='20261022-adaptive-2';let api;
function boot(){
 const app=document.querySelector('#app'),head=app?.querySelector('.ct-header'),actions=app?.querySelector('.ct-task-actions'),functions=actions?.querySelector('.function-buttons');
 if(!head||!functions||!window.CLASSROOM_TOOLS)return false;
 const U=window.UNLOCK_PLAYER,stage=app.querySelector('.stage'),course=document.createElement('div'),teacher=document.createElement('div'),dock=document.createElement('div');
 course.className='task-header-course';teacher.className='task-header-teacher';dock.className='task-header-current';dock.setAttribute('aria-label','Current task');
 for(const node of [...head.children]){if(node.matches('[data-ct-nav],.ct-unit,.ct-session'))course.append(node);else if(!node.matches('.ct-header-space'))teacher.append(node);}
 dock.append(actions);head.replaceChildren(course,dock,teacher);app.classList.add('ct-adaptive-controls');
 const extra=document.createElement('div'),toggle=document.createElement('button'),menu=document.createElement('div');extra.className='task-extra';extra.hidden=true;toggle.type='button';toggle.className='task-extra-toggle';toggle.textContent='Task tools';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','current-task-tools');menu.id='current-task-tools';menu.className='task-extra-menu';menu.hidden=true;menu.setAttribute('aria-label','Additional task controls');extra.append(toggle,menu);
 const media=functions.querySelector('.media-bar');functions.insertBefore(extra,media);let frame=null,running=false,last='',lastWidth=0,slots=[],chooser=null,route='',sampleCache=new Map();
 const ids=['answer-mode','question-return','material-open','media-open','sentence-open','review-mode'];
 const button=id=>app.querySelector('#'+id),setText=(el,t)=>{if(el&&el.textContent!==t)el.textContent=t;};
 function closeMenu(focus=false){if(!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');if(focus)toggle.focus();}}
 toggle.onclick=()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden));if(!menu.hidden)menu.querySelector('button:not([hidden])')?.focus();};
 document.addEventListener('pointerdown',e=>{if(!extra.contains(e.target))closeMenu();});
 document.addEventListener('click',e=>{if(menu.contains(e.target)&&e.target.closest('button')){closeMenu();schedule();}});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu(true);e.preventDefault();e.stopImmediatePropagation();}},true);
 function recordings(){
  const next=[...media.querySelectorAll(':scope > .audio-slot')];
  if(next.length===slots.length&&next.every((s,i)=>s===slots[i]))return;
  slots=next;if(slots.length<2){if(chooser)chooser.hidden=true;if(slots[0])slots[0].hidden=false;return;}
  if(!chooser||!media.contains(chooser)){chooser=document.createElement('select');chooser.className='task-recording-select';chooser.setAttribute('aria-label','Choose recording');media.prepend(chooser);}
  chooser.replaceChildren(...slots.map((s,i)=>new Option(s.querySelector('span')?.textContent.trim()||'Recording '+(i+1),String(i))));chooser.hidden=false;slots.forEach((s,i)=>s.hidden=i!==0);
  chooser.onchange=()=>{slots.forEach((s,i)=>{if(i!==Number(chooser.value))s.querySelector('audio')?.pause();s.hidden=i!==Number(chooser.value);});};
 }
 function sampleAnswer(key){
  if(sampleCache.has(key))return sampleCache.get(key);
  const e=U.classroom?.exercise(),correction=window.SCHOOL_ANSWER_CORRECTIONS?.[e?.id];
  let yes=!!correction?.possible;
  if(!yes&&U.questionView.availability().answer){const entries=U.questionView.sourceFeedback?.()||[];yes=entries.some(x=>x.role==='answer'&&/\b(?:possible|sample|model|suggested) answers?\b/i.test(x.text||x.node?.textContent||''));}
  sampleCache.set(key,yes);return yes;
 }
 function eligible(b,review){if(!b||b.hidden||b.style.display==='none')return false;if(b.id==='question-return')return review;if(review&&['answer-mode','review-mode'].includes(b.id))return false;return getComputedStyle(b).display!=='none';}
 function refresh(force=false){
  if(running)return;running=true;
  try{
   for(const status of media.querySelectorAll('.media-load-status')){const retry=status.querySelector('button');if(retry){setText(retry,'Retry');status.title=status.childNodes[0]?.textContent||'Audio is loading';status.setAttribute('aria-label',status.title);}}recordings();const st=U.state(),key=st.current+':'+(st.exercise??''),review=U.questionView.isReview(),local=!!stage.querySelector('.vc-match,.vc-practice,.u-homework,.dictation-frame,.vc-dictation-frame');
   if(route!==key){closeMenu();route=key;}
   app.classList.toggle('task-review-open',review);
   setText(button('answer-mode'),sampleAnswer(key)?'Sample answer':'Answers');setText(button('question-return'),'Questions');button('question-return')?.setAttribute('aria-label','Back to questions');
   const captions={'material-open':'View material','media-open':'Play video','sentence-open':'Listen closely','review-mode':'Explanation'};for(const [id,t]of Object.entries(captions))setText(button(id),t);
   const hasAudio=!media.hidden&&!!media.querySelector('audio'),all=ids.map(button).filter(Boolean),offered=local?[]:all.filter(b=>eligible(b,review));
   const sig=JSON.stringify([key,review,local,hasAudio,slots.length,[...media.querySelectorAll('.media-load-status')].map(n=>!n.hidden),all.map(b=>[b.id,b.hidden,b.style.display,b.textContent]),teacher.querySelector('.ct-session')?.textContent,course.textContent]);
   if(!force&&last===sig&&lastWidth===app.clientWidth)return;last=sig;lastWidth=app.clientWidth;
   closeMenu();for(const b of all)if(b.parentElement!==functions)functions.insertBefore(b,extra);for(const b of all)functions.insertBefore(b,extra);
   extra.hidden=true;menu.hidden=true;actions.hidden=local||(!offered.length&&!hasAudio);if(actions.hidden){const old=app.classList.contains('task-two-rows');app.classList.remove('task-two-rows');if(old)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));return;}
   const widths=offered.reduce((n,b)=>n+b.getBoundingClientRect().width+6,0),audioWidth=hasAudio?media.getBoundingClientRect().width+6:0;
   const available=app.clientWidth-28-24-course.getBoundingClientRect().width-teacher.getBoundingClientRect().width;
   let need=widths+audioWidth,moreWidth=98,overflow=[];
   for(const id of ['review-mode','sentence-open']){if(need<=available)break;const b=offered.find(b=>b.id===id);if(!b)continue;need-=b.getBoundingClientRect().width+6;if(!overflow.length)need+=moreWidth;overflow.push(b);}
   const oldRows=app.classList.contains('task-two-rows'),twoRows=need>available+1;app.classList.toggle('task-two-rows',twoRows);
   if(twoRows){need=widths+audioWidth;overflow=[];for(const id of ['review-mode','sentence-open']){if(need<=app.clientWidth-32)break;const b=offered.find(b=>b.id===id);if(!b)continue;need-=b.getBoundingClientRect().width+6;if(!overflow.length)need+=moreWidth;overflow.push(b);}}
   if(overflow.length){for(const b of overflow.reverse())menu.append(b);extra.hidden=false;}
   if(oldRows!==twoRows)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
  }finally{running=false;}
 }
 function schedule(){if(frame!==null)return;frame=requestAnimationFrame(()=>{frame=null;refresh();});}
 new MutationObserver(list=>{if(list.some(m=>m.type==='attributes'&&(ids.includes(m.target.id)||m.target.classList.contains('media-load-status'))||m.type==='childList'&&media.contains(m.target)))schedule();}).observe(functions,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','style']});
 document.addEventListener('click',schedule);window.addEventListener('hashchange',schedule);window.addEventListener('resize',()=>{lastWidth=0;schedule();});
 api=window.CLASSROOM_TASK_CONTROLS={version:VERSION,refresh,schedule,state:()=>({route,review:U.questionView.isReview(),rows:app.classList.contains('task-two-rows')?2:1,menuOpen:!menu.hidden,extra:[...menu.querySelectorAll('button')].filter(b=>!b.hidden&&b.style.display!=='none').map(b=>b.id),recordings:slots.length})};
 refresh(true);return true;
}
if(!boot()){const timer=setInterval(()=>{if(boot())clearInterval(timer);},30);}
})();
