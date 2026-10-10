 'use strict';
(()=>{
 const U=window.UNLOCK_PLAYER,app=document.querySelector('#app');if(!U||!app)return;
 const workspace=app.querySelector('.workspace'),pane=app.querySelector('.reference-pane'),topbar=app.querySelector('.topbar'),taskbar=app.querySelector('.taskbar'),toolbar=app.querySelector('.toolbar'),tools=app.querySelector('.reference-tools');
 const sidebar=document.createElement('aside');sidebar.id='teacher-sidebar';sidebar.className='teacher-sidebar';sidebar.hidden=true;sidebar.setAttribute('aria-label','课堂操作栏');
 sidebar.innerHTML='<div class="sidebar-heading"><strong>操作栏</strong><button id="sidebar-close" type="button">收起</button></div><section class="sidebar-navigation"><h2>课程导航</h2><div id="sidebar-course"></div><details id="lesson-outline"><summary>章节目录</summary><nav id="sidebar-outline" aria-label="教材章节与题目"></nav></details><div id="sidebar-exercises"></div><div id="sidebar-navigation-buttons"></div></section><section class="sidebar-actions"><h2>当前题操作</h2></section><section class="sidebar-material" hidden><h2>材料与显示</h2></section><section class="sidebar-display"><h2>显示</h2></section><details class="sidebar-source"><summary>来源查阅</summary></details>';
 const handle=document.createElement('button');handle.type='button';handle.id='sidebar-open';handle.className='sidebar-handle';handle.textContent='操作';handle.title='展开操作栏';handle.setAttribute('aria-label','展开操作栏');handle.setAttribute('aria-controls','teacher-sidebar');handle.setAttribute('aria-expanded','false');
 app.append(sidebar,handle);app.classList.add('sidebar-layout');
 const q=s=>app.querySelector(s),section=s=>sidebar.querySelector(s);
 topbar.querySelector('a').textContent='返回课件目录';section('#sidebar-course').append(topbar);
 section('#sidebar-exercises').append(taskbar);
 const nav=q('.nav-buttons'),returnButton=q('#question-return');q('.function-buttons').append(returnButton);section('#sidebar-navigation-buttons').append(nav);q('#back').hidden=true;
 section('.sidebar-actions').append(toolbar);section('.sidebar-material').append(tools);q('#close-material').textContent='关闭材料';
 section('.sidebar-display').append(q('#fullscreen'));section('.sidebar-source').append(q('#source-toggle'));
 const pageSelect=q('#page-select');pageSelect.hidden=true;pageSelect.setAttribute('aria-hidden','true');
 const outline=section('#sidebar-outline'),branches=new Map(),routeButtons=[];
 U.structure.routes.forEach((r,i)=>{const name=r.section||`Book ${U.lesson.book} ${U.lesson.course} Unit ${U.lesson.unit}`;let branch=branches.get(name);if(!branch){branch=document.createElement('details');branch.className='sidebar-chapter';const summary=document.createElement('summary');summary.textContent=name;branch.append(summary);branches.set(name,branch);outline.append(branch)}const b=document.createElement('button');b.type='button';b.className='sidebar-route';b.textContent=r.label;b.dataset.route=String(i);b.onclick=()=>{if(U.questionView.isReview())return;U.goto(r.anchor,true,{exercise:r.number});close(false)};branch.append(b);routeButtons.push(b)});
 const divider=document.createElement('div');divider.id='split-divider';divider.setAttribute('role','separator');divider.setAttribute('aria-label','调整题目与材料宽度');divider.setAttribute('aria-orientation','vertical');divider.setAttribute('aria-valuemin','35');divider.setAttribute('aria-valuemax','70');divider.tabIndex=0;divider.hidden=true;workspace.insertBefore(divider,pane);
 let open=false,originFocus=null;
 function show(){originFocus=document.activeElement;open=true;sidebar.hidden=false;handle.hidden=true;handle.setAttribute('aria-expanded','true');sync();q('#sidebar-close').focus({preventScroll:true})}
 function close(restore=true){if(!open)return;open=false;sidebar.hidden=true;handle.hidden=false;handle.setAttribute('aria-expanded','false');if(sidebar.contains(document.activeElement)){if(restore&&originFocus?.isConnected&&!sidebar.contains(originFocus))originFocus.focus({preventScroll:true});else handle.focus({preventScroll:true})}}
 handle.onclick=show;q('#sidebar-close').onclick=()=>close();
 const autoClose=new Set(['answer-mode','review-mode','question-return','material-open','media-open','sentence-open','close-material','split-view','read-full','prev','next','fullscreen','source-go']);
 sidebar.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&(autoClose.has(b.id)||b.closest('#exercise-tabs')))close(false)});
 q('#source-go').addEventListener('click',()=>close(false));
 tools.addEventListener('change',e=>{if(e.target.matches('select'))close(false)});
 document.addEventListener('pointerdown',e=>{if(open&&!sidebar.contains(e.target)&&!handle.contains(e.target)&&!e.target.closest('dialog'))close(false)},true);
 document.addEventListener('keydown',e=>{if(open&&sidebar.contains(e.target)&&['ArrowLeft','ArrowRight','PageUp','PageDown','r','R'].includes(e.key)&&!e.target.matches('input,textarea,select,[contenteditable]')){e.stopImmediatePropagation();return}if(e.key==='Escape'&&open&&!q('#source-dialog').open){e.preventDefault();e.stopImmediatePropagation();close()}},true);
 document.addEventListener('fullscreenchange',()=>{q('#fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏';close(false)});
 function fit(){window.dispatchEvent(new Event('resize'))}
 function setShare(value){const n=Math.max(35,Math.min(70,Math.round(value)));q('#pane-width').value=String(n);workspace.style.setProperty('--question-share',n+'%');divider.setAttribute('aria-valuenow',String(n));divider.setAttribute('aria-valuetext','题目宽度 '+n+'%');fit()}
 divider.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();divider.setPointerCapture(e.pointerId);divider.dataset.dragging='true'});
 divider.addEventListener('pointermove',e=>{if(divider.dataset.dragging==='true'){const r=workspace.getBoundingClientRect();setShare((e.clientX-r.left)/r.width*100)}});
 const endDrag=()=>{delete divider.dataset.dragging};divider.addEventListener('pointerup',endDrag);divider.addEventListener('lostpointercapture',endDrag);
 divider.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();const old=Number(q('#pane-width').value);setShare(e.key==='Home'?35:e.key==='End'?70:old+(e.key==='ArrowLeft'?-1:1))}});
 q('#pane-width').addEventListener('input',e=>setShare(Number(e.target.value)));
 function setHidden(el,value){if(el.hidden!==value)el.hidden=value}
 function sync(){const state=U.state(),review=U.questionView.isReview(),material=!pane.hidden,parallel=material&&workspace.classList.contains('split');setHidden(section('.sidebar-material'),!material);setHidden(section('.sidebar-navigation'),review);setHidden(section('.sidebar-source'),review);const dividerChanged=divider.hidden!==!parallel;setHidden(divider,!parallel);if(dividerChanged)fit();divider.setAttribute('aria-valuenow',q('#pane-width').value);divider.setAttribute('aria-valuetext','题目宽度 '+q('#pane-width').value+'%');
  setHidden(section('.sidebar-actions'),![...q('.function-buttons').querySelectorAll(':scope>button')].some(b=>!b.hidden));
  const title=section('.sidebar-actions h2'),label=review?(U.questionView.stats().kind==='answer'?'答案':'解析'):'当前题操作';if(title.textContent!==label)title.textContent=label;
  for(let i=0;i<routeButtons.length;i++){const b=routeButtons[i],active=i===state.routeIndex;if(b.classList.contains('active')!==active)b.classList.toggle('active',active);if(active){if(b.getAttribute('aria-current')!=='page')b.setAttribute('aria-current','page')}else if(b.hasAttribute('aria-current'))b.removeAttribute('aria-current')}
  for(const branch of branches.values()){const active=!!branch.querySelector('[aria-current="page"]');if(branch.classList.contains('current-chapter')!==active)branch.classList.toggle('current-chapter',active)}
  // A single resource needs no duplicate selector. Precision owns its track selector beside the audio.
  const select=q('#material-select'),single=select.options.length<=1,precision=!!q('.precision-pane:not([hidden])');select.classList.toggle('sidebar-redundant',single);q('#material-prev').classList.toggle('sidebar-redundant',single);q('#material-next').classList.toggle('sidebar-redundant',single);setHidden(q('.pane-width-label'),true);
 }
 const observer=new MutationObserver(sync);observer.observe(app,{attributes:true,attributeFilter:['class']});observer.observe(pane,{attributes:true,attributeFilter:['hidden']});observer.observe(workspace,{attributes:true,attributeFilter:['class']});observer.observe(q('#exercise-tabs'),{childList:true});observer.observe(q('.function-buttons'),{subtree:true,attributes:true,attributeFilter:['hidden']});observer.observe(tools,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});window.addEventListener('hashchange',sync);window.addEventListener('resize',sync);
 window.SCHOOL_SIDEBAR={show,close,sync,setShare,state:()=>({open,review:U.questionView.isReview(),parallel:!divider.hidden,share:Number(q('#pane-width').value)})};sync();fit();
})();
