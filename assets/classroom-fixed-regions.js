/* Fixed classroom regions and non-reflowing progress chrome. */
(()=>{'use strict';
const VERSION='20261027-grouped-plan-1';const assetBase=new URL('.',document.currentScript.src);let app,stage,head,pending=false,working=false;
const direct=(root,selector)=>[...root.children].find(n=>n.matches?.(selector));
const put=(node,prop,value)=>{if(node&&node.style.getPropertyValue(prop)!==value)node.style.setProperty(prop,value,'important')};
function planOverview(){
 const plan=stage?.querySelector(':scope>.lesson-plan'),list=plan?.querySelector(':scope>.plan-list');if(!list)return;
 const session=window.SCHOOL_LESSON_OPENINGS?.sessions.find(s=>s.id===plan.dataset.session);if(!session)return;
 const english=value=>window.SCHOOL_AUTHORED_A?.english(String(value||''))??String(value||''),same=value=>value.toLowerCase().replace(/[\s.,:;!?]+/g,'');
 const rows=[...list.children].map((li,i)=>{const item=li.querySelector('.plan-item');return{number:i+1,label:session.tasks[i]?.label||'',name:english(item?.querySelector('.plan-text>strong')?.textContent||session.tasks[i]?.label),detail:english(item?.querySelector('.plan-text>span')?.textContent||session.tasks[i]?.detail)}});
 if(!rows.length)return;
 let prefix=0;while(prefix<rows.length&&['词汇讲解','图句匹配','词汇应用','单词听写'].includes(rows[prefix].label))prefix++;
 const skill={听力:'Listening',阅读:'Reading',口语:'Speaking',写作:'Writing'}[session.skill]||'Classroom practice';
 let split=Math.ceil(rows.length/2),titles=['First','Then'];
 if(prefix>=2&&prefix<rows.length){split=prefix;titles=['Vocabulary',skill+' & review'];}
 else if(session.week===1&&rows.length===4&&rows[0].label==='单词听写'&&rows[2].label==='语言练习'){split=2;titles=['Vocabulary & '+(window.LESSON.course==='LS'?'listening':'reading'),'Language & review'];}
 else if(session.week===2&&rows[0].label==='单词听写'){
  const training=rows.findIndex(row=>/^(口语|写作)训练$/.test(row.label));split=training>0?training:2;
  titles=['Vocabulary & review',training>0?skill+' & review':'H3 practice & review'];
 }
 if(split<1||split>=rows.length)split=Math.ceil(rows.length/2);
 const overview=document.createElement('div');overview.className='plan-overview';overview.setAttribute('aria-label','Lesson activities');
 const parts=rows.length===1?[rows]:[rows.slice(0,split),rows.slice(split)];
 parts.forEach((items,part)=>{
  const section=document.createElement('section'),title=document.createElement('h2'),agenda=document.createElement('ol');section.className='plan-overview-group';title.className='plan-overview-group-title';title.textContent=parts.length===1?'Lesson activities':titles[part];agenda.className='plan-overview-list';agenda.start=items[0].number;
  for(const row of items){
   const li=document.createElement('li'),number=document.createElement('span'),copy=document.createElement('div'),name=document.createElement('h3');li.className='plan-overview-item';li.dataset.planSequence=String(row.number);number.className='plan-overview-number';number.textContent=String(row.number).padStart(2,'0');number.setAttribute('aria-hidden','true');copy.className='plan-overview-copy';name.className='plan-overview-name';name.textContent=row.name;copy.append(name);
   if(row.detail&&same(row.detail)!==same(row.name)){const detail=document.createElement('p');detail.className='plan-overview-detail';detail.textContent=row.detail;copy.append(detail);}
   li.append(number,copy);agenda.append(li);
  }
  section.append(title,agenda);overview.append(section);
 });
 list.replaceWith(overview);plan.dataset.planOverview='grouped';
}
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
function apply(){if(working||!app)return;working=true;try{stage=app.querySelector('.stage');if(stage){if(!stage.classList.contains('fixed-classroom-regions'))stage.classList.add('fixed-classroom-regions');stage.dataset.fixedRegions=VERSION;planOverview();anchorStage()}if(!app.classList.contains('ct-fixed-regions'))app.classList.add('ct-fixed-regions');reserveHeader();requestAnimationFrame(audit)}finally{working=false}}
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
