/* Fixed classroom regions and non-reflowing progress chrome. */
(()=>{'use strict';
const VERSION='20261023-fixed-1';const assetBase=new URL('.',document.currentScript.src);let app,stage,head,pending=false,working=false;
const direct=(root,selector)=>[...root.children].find(n=>n.matches?.(selector));
const put=(node,prop,value)=>{if(node&&node.style.getPropertyValue(prop)!==value)node.style.setProperty(prop,value,'important')};
function anchorStage(){
 if(!stage)return;const header=direct(stage,'.ss-header,.scene-head'),body=direct(stage,'.ss-body,.scene-body');
 if(header){
  for(const n of [...header.children].filter(n=>n.matches('.a-classroom-meta,.page-source-button'))){
   const source=n.classList.contains('page-source-button');n.className=source?'page-source-button':'a-classroom-meta';stage.insertBefore(n,header);
   n.style.cssText=source?'position:absolute!important;left:1694px!important;right:auto!important;top:36px!important;width:174px!important;height:52px!important;':'position:absolute!important;left:108px!important;right:auto!important;top:1046px!important;width:1704px!important;height:26px!important;';
  }
  for(const n of header.querySelectorAll(':scope>.ss-section.uniform-bank-host')){const text=n.innerText.replace(/\s+/g,' ').trim();n.classList.remove('uniform-bank-host');n.textContent=text;}
  put(header,'left','108px');put(header,'top','8px');put(header,'width','1704px');put(header,'height','300px');
  const slots=[[direct(header,'.ss-section,small'),'0px','32px'],[direct(header,'.ss-title,h1'),'36px','96px'],[direct(header,'.ss-subtitle'),'136px','36px'],[direct(header,'.ss-instruction,.scene-task'),'176px','124px']];
  for(const [node,top,height] of slots){if(!node)continue;put(node,'left','0px');put(node,'right','0px');put(node,'top',top);put(node,'height',height)}
 }
 if(body&&!body.classList.contains('cr-restored-body')){const side=stage.classList.contains('b3ls-repair-side'),steps=stage.classList.contains('w1-has-native-parts');put(body,'left',body.dataset.week1Left||(side?'800px':'108px'));put(body,'top',body.dataset.week1Top||(side?'324px':steps?'362px':'312px'));put(body,'width',body.dataset.week1Width||(side?'1012px':'1704px'));put(body,'height',body.dataset.week1Height||(side?'682px':steps?'648px':'698px'))}
}
function reserveHeader(){
 if(app.classList.contains('ct-persistent-controls'))return;
 head=app.querySelector(':scope>.ct-header');if(!head)return;
 const course=direct(head,'.task-header-course'),current=direct(head,'.task-header-current'),teacher=direct(head,'.task-header-teacher'),brand=head.querySelector('[data-ct-brand]');
 if(!course||!current||!teacher||!brand)return;
 if(brand.parentElement!==head||brand.nextElementSibling!==teacher)head.insertBefore(brand,teacher);
 const needed=course.scrollWidth+current.scrollWidth+brand.scrollWidth+teacher.scrollWidth+60;
 const two=needed>head.clientWidth;if(app.classList.contains('ct-fixed-two-rows')!==two)app.classList.toggle('ct-fixed-two-rows',two);
}
function audit(){
 if(!stage)return;const failures=[];
 const checks=[['section',direct(stage.querySelector(':scope>.ss-header,:scope>.scene-head')||stage,'.ss-section,small')],['title',stage.querySelector(':scope>.ss-header>.ss-title,:scope>.scene-head>h1')],['subtitle',stage.querySelector(':scope>.ss-header>.ss-subtitle,:scope>.scene-head>.ss-subtitle')],['task',stage.querySelector(':scope>.ss-header>.ss-instruction,:scope>.scene-head>.scene-task')]];
 for(const [name,node] of checks){if(!node)continue;const overflow=node.scrollHeight-node.clientHeight>12||node.scrollWidth-node.clientWidth>3;if(node.hasAttribute('data-fixed-region-overflow')!==overflow)node.toggleAttribute('data-fixed-region-overflow',overflow);if(overflow)failures.push(name)}
 if(failures.length)stage.dataset.fixedRegionOverflow=failures.join(',');else delete stage.dataset.fixedRegionOverflow;
 window.dispatchEvent(new CustomEvent('classroom-fixed-regions-audit',{detail:{lesson:window.LESSON?.id||'',page:window.UNLOCK_PLAYER?.state?.().current||'',failures}}));
}
function apply(){if(working||!app)return;working=true;try{stage=app.querySelector('.stage');if(stage){if(!stage.classList.contains('fixed-classroom-regions'))stage.classList.add('fixed-classroom-regions');stage.dataset.fixedRegions=VERSION;anchorStage()}if(!app.classList.contains('ct-fixed-regions'))app.classList.add('ct-fixed-regions');reserveHeader();requestAnimationFrame(audit)}finally{working=false}}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
function loadExceptions(){
 const units=new Set(['B2_LS_U01','B2_LS_U02','B2_LS_U04','B2_RW_U03','B2_RW_U06','B3_LS_U06','B3_RW_U01','B3_RW_U04']);
 if(!units.has(window.LESSON?.id)||window.CLASSROOM_FIXED_EXCEPTION_READY)return;
 window.CLASSROOM_FIXED_EXCEPTION_READY=Promise.all([['link','classroom-fixed-exceptions.css'],['script','classroom-fixed-exceptions.js']].map(([tag,file])=>new Promise((resolve,reject)=>{
  const n=document.createElement(tag);n.dataset.fixedExceptionLoader='true';n.onload=resolve;n.onerror=()=>reject(new Error('Could not load fixed task exceptions: '+file));const url=new URL(file+'?v=20261024-b81a55845c3d4123',assetBase).href;
  if(tag==='link'){n.rel='stylesheet';n.href=url}else{n.src=url;n.async=false}document.head.append(n);
 })));
}
function boot(){app=document.querySelector('#app');if(!app||!window.CLASSROOM_TOOLS||!window.CLASSROOM_TASK_CONTROLS){setTimeout(boot,50);return}apply();new MutationObserver(schedule).observe(app,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','style']});window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);window.CLASSROOM_FIXED_REGIONS={version:VERSION,refresh:schedule,audit:()=>{audit();return stage?.dataset.fixedRegionOverflow||''},geometry:{header:{top:8,height:300,section:[0,32],title:[36,96],subtitle:[136,36],task:[176,124]},body:{top:312,bottom:1010,height:698,partNav:42,partGap:8,partContent:648},footer:{height:48,pagingWidthMax:108,pagingWidthMin:72}}};loadExceptions();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
