/* Exact-route reflow repairs for native tasks exposed by the fixed classroom regions. */
(()=>{'use strict';
const VERSION='20261023-fixed-exceptions-1';
const ROUTES=new Map([
  ['B2_LS_U04:91:7','b2-ls-u04-91-7'],
  ['B2_LS_U01:159:','b2-ls-u01-159'],
  ['B2_LS_U02:141:7','b2-ls-u02-141-7'],
  ['B2_RW_U03:184:','b2-rw-u03-184'],
  ['B2_RW_U06:185:6','b2-rw-u06-185-6'],
  ['B3_LS_U06:137:3','b3-ls-u06-137-3'],
  ['B3_RW_U01:166:4','b3-rw-u01-166-4'],
  ['B3_RW_U01:173:','b3-rw-u01-173'],
  ['B3_RW_U04:174:','b3-rw-u04-174']
]);
let queued=false,working=false;
function route(){
  const state=window.UNLOCK_PLAYER?.state?.();
  const unit=window.LESSON?.id||'';
  return {state,unit,key:state?`${unit}:${state.current}:${state.exercise??''}`:''};
}
function moveDialogueTurn(stage){
  const columns=stage.querySelectorAll('.context-dialogue-column');
  if(columns.length!==2||columns[0].children.length!==6||columns[1].children.length!==5)return;
  const turn=columns[0].lastElementChild;
  if(!/what about listening to the talk on poetry instead/i.test(turn?.textContent||''))return;
  columns[1].insertBefore(turn,columns[1].firstElementChild);
  stage.dataset.fixedExceptionDialogueBalanced='true';
}
function restoreWordOrder(stage){
  const body=stage.querySelector(':scope>.ss-body');
  const header=stage.querySelector(':scope>.ss-header');
  if(!body||!header||body.querySelector('.visual-original-canvas'))return;
  const comparison=body.querySelector('.textbook-shark-comparison');
  const questions=body.querySelector('.textbook-shark-questions');
  const table=comparison?.querySelector('table');
  const intro=[...header.children].find(n=>/^In English sentences,/.test((n.textContent||'').trim()));
  if(!table||!intro||!questions)return;

  const meta=header.querySelector(':scope>.a-classroom-meta');
  const source=header.querySelector(':scope>.page-source-button');
  if(meta){
    if(meta.className!=='a-classroom-meta')meta.className='a-classroom-meta';
    stage.insertBefore(meta,header);
    meta.style.cssText='position:absolute!important;left:108px!important;right:auto!important;top:1046px!important;width:1704px!important;height:26px!important;';
  }
  if(source){
    if(source.className!=='page-source-button')source.className='page-source-button';
    stage.insertBefore(source,header);
    source.style.cssText='position:absolute!important;left:1694px!important;right:auto!important;top:36px!important;width:174px!important;height:52px!important;';
  }

  const section=[...header.children].find(n=>/GRAMMAR FOR WRITING/.test(n.textContent||''));
  const title=[...header.children].find(n=>/^WORD ORDER$/.test((n.textContent||'').trim()));
  if(section){
    if(!section.classList.contains('ss-section'))section.className='obj ss-node ss-section';
    section.dataset.fixedWordOrderRole='section';
    section.style.setProperty('top','0px','important');
    section.style.setProperty('height','32px','important');
  }
  if(title){
    title.dataset.fixedWordOrderRole='title';
    title.style.setProperty('top','36px','important');
    title.style.setProperty('height','96px','important');
  }

  intro.dataset.fixedWordOrderRole='intro';
  intro.style.cssText='left:0;top:0;width:1704px;height:auto;';
  intro.dataset.visualOriginal='[0,0,1704,183.24]';
  const text=intro.querySelector('.text');
  if(text){
    const spans=[...text.querySelectorAll('span')];
    if(spans.length){
      const p=document.createElement('p');
      p.style.cssText='text-align:left;line-height:1.12;margin:0;';
      spans.forEach((span,index)=>{
        span.style.fontSize='42px';
        span.style.fontWeight='400';
        span.style.color='#192B3B';
        if(index)p.append(' ');
        p.append(span);
      });
      text.replaceChildren(p);
    }
  }

  table.classList.remove('textbook-shark-table');
  table.style.cssText='width:100%;height:100%;table-layout:fixed;border-collapse:collapse;';
  table.dataset.fullGrid='true';
  const tableNode=document.createElement('div');
  tableNode.className='obj fixed-word-order-table';
  tableNode.style.cssText='left:0;top:192.24px;width:1704px;height:auto;';
  tableNode.dataset.visualOriginal='[0,192.24,1704,232.5]';
  tableNode.append(table);

  const canvas=document.createElement('div');
  canvas.className='visual-original-canvas fixed-word-order-canvas';
  canvas.style.height='316.24px';
  canvas.append(intro,tableNode);

  const stash=document.createElement('div');
  stash.className='fixed-word-order-stash';
  stash.hidden=true;
  stash.setAttribute('aria-hidden','true');
  if(comparison)stash.append(comparison);
  stash.append(questions);

  body.dataset.layoutOwner='visual-preserved';
  body.dataset.fixedWordOrderBody='true';
  body.replaceChildren(canvas,stash);
  stage.dataset.fixedExceptionWordOrderRestored='true';
}
function apply(){
  if(working)return;
  working=true;
  try{
    const {state,key}=route();
    const stage=document.querySelector('.stage');
    if(!stage||!state)return;
    const marker=ROUTES.get(key)||'';
    if(marker)stage.dataset.fixedException=marker;
    else stage.removeAttribute('data-fixed-exception');
    if(marker==='b2-ls-u02-141-7')moveDialogueTurn(stage);
    if(marker==='b3-ls-u06-137-3'&&stage.classList.contains('speaking-preview-layout'))stage.classList.remove('speaking-preview-layout');
    if(marker==='b3-rw-u01-173')restoreWordOrder(stage);
  }finally{working=false;}
}
function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;apply();});
}
const observer=new MutationObserver(schedule);
observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
addEventListener('hashchange',schedule);
addEventListener('popstate',schedule);
addEventListener('load',schedule,{once:true});
schedule();
window.CLASSROOM_FIXED_EXCEPTIONS={version:VERSION,apply,state:()=>route()};
})();
