/* Fixed two-row classroom toolbar. Availability comes from the current activity, not forced legacy visibility. */
(()=>{'use strict';
const VERSION='20261026-persistent-1',MIN_WIDTH=1280;let api;
function boot(){
 const app=document.querySelector('#app'),head=app?.querySelector('.ct-header'),actions=app?.querySelector('.ct-task-actions'),backend=actions?.querySelector('.function-buttons'),U=window.UNLOCK_PLAYER;
 if(!head||!backend||!U||!window.CLASSROOM_TOOLS)return false;
 if(app.classList.contains('ct-persistent-controls'))return true;
 const stage=app.querySelector('.stage'),media=backend.querySelector('.media-bar'),course=document.createElement('div'),teacher=document.createElement('div'),dock=document.createElement('div'),canvas=document.createElement('div'),legacy=document.createElement('div');
 course.className='task-header-course';teacher.className='task-header-teacher';dock.className='task-header-current';canvas.className='ct-toolbar-canvas';legacy.className='toolbar-legacy-controls';legacy.setAttribute('aria-hidden','true');
 dock.setAttribute('aria-label','本页功能');teacher.setAttribute('aria-label','课堂工具');
 for(const n of [...head.children])if(n.matches('[data-ct-nav],.ct-unit,.ct-session'))course.append(n);
 const brand=head.querySelector('[data-ct-brand]');
 for(const selector of ['.ct-note-switch','[data-ct-zoom]','[data-ct-timer]','[data-ct-resume]','[data-ct-home]']){const n=app.querySelector(selector);if(n)teacher.append(n)}
 const resume=teacher.querySelector('[data-ct-resume]'),switchClass=teacher.querySelector('[data-ct-home]');
 if(resume)resume.textContent='恢复位置';if(switchClass)switchClass.textContent='切换课次';
 for(const n of [...head.children])if(n!==course&&n!==brand&&n!==teacher)legacy.append(n);
 for(const n of app.querySelectorAll('[data-ct-fullscreen],#fullscreen')){n.hidden=true;n.disabled=true}
 const more=app.querySelector('[data-ct-more]');if(more){more.hidden=true;more.disabled=true}
 const morePanel=app.querySelector('.ct-shortcuts');if(morePanel)morePanel.hidden=true;
 backend.classList.add('task-control-backend');backend.setAttribute('aria-hidden','true');
 const group=document.createElement('div');group.className='persistent-function-buttons';group.setAttribute('role','group');group.setAttribute('aria-label','本页功能与音频');
 const proxies={},definitions=[['answer','Answers'],['explanation','Explanation'],['video','Play video'],['material','View material'],['close','Listen closely'],['textbook','Textbook']];
 for(const [key,label]of definitions){const b=document.createElement('button');b.type='button';b.className='toolbar-page-action';b.dataset.toolbarAction=key;b.textContent=label;b.disabled=true;proxies[key]=b;group.append(b)}
 const audioZone=document.createElement('div'),recording=document.createElement('select'),transport=document.createElement('div'),placeholder=document.createElement('div');
 audioZone.className='toolbar-audio-zone';audioZone.setAttribute('role','group');audioZone.setAttribute('aria-label','本页音频');recording.className='toolbar-recording-select task-recording-select';recording.setAttribute('aria-label','本页录音');
 transport.className='toolbar-audio-transport';placeholder.className='toolbar-audio-placeholder';placeholder.setAttribute('aria-hidden','true');placeholder.innerHTML='<span class="toolbar-play-symbol">▶</span><span class="toolbar-empty-time">--:-- / --:--</span><span class="toolbar-empty-progress"></span><span class="toolbar-empty-volume">◖</span>';
 if(media)transport.append(media);transport.append(placeholder);audioZone.append(recording,transport);group.append(audioZone);actions.append(group);dock.append(actions);
 canvas.append(course);if(brand)canvas.append(brand);canvas.append(teacher,dock,legacy);head.replaceChildren(canvas);
 app.classList.add('ct-adaptive-controls','ct-fixed-regions','ct-fixed-two-rows','ct-persistent-controls');
 let frame=null,running=false,lastWidth=0,route='',slots=[],selection=0,recordSignature='',currentAvailability={},layoutState=null,sampleCache=new Map();
 const original=id=>app.querySelector('#'+id),q=()=>U.questionView;
 const setText=(n,t)=>{if(n&&n.textContent!==t)n.textContent=t};
 const setDisabled=(n,off)=>{if(n.disabled!==off)n.disabled=off;const value=String(off);if(n.getAttribute('aria-disabled')!==value)n.setAttribute('aria-disabled',value)};
 function originalOffered(id){const b=original(id);return !!b&&!b.hidden&&!b.disabled&&b.style.display!=='none'&&getComputedStyle(b).display!=='none'}
 function sourceAvailable(){const v=window.SCHOOL_SOURCE_VIEWER;if(!v)return false;try{v.resolve();return true}catch{return false}}
 function availability(){
  const a=q()?.availability?.()||{},review=!!q()?.isReview?.();
  return{answer:review||a.answer===true,explanation:a.explanation===true&&app.dataset.explanationAllowed==='true',video:originalOffered('media-open'),material:originalOffered('material-open'),close:originalOffered('sentence-open'),textbook:sourceAvailable(),review};
 }
 function sampleAnswer(key,available){
  if(!available)return false;if(sampleCache.has(key))return sampleCache.get(key);
  const e=U.classroom?.exercise?.(),correction=window.SCHOOL_ANSWER_CORRECTIONS?.[e?.id];let yes=!!correction?.possible;
  if(!yes){const entries=q()?.sourceFeedback?.()||[];yes=entries.some(x=>x.role==='answer'&&/\b(?:possible|sample|model|suggested) answers?\b/i.test(x.text||x.node?.textContent||''))}
  sampleCache.set(key,yes);return yes;
 }
 function click(key){
  const a=availability();if(!a[key])return;
  if(key==='answer'){if(a.review)q().closeReview();else q().openReview('answer')}
  else if(key==='explanation'){if(q().isReview())q().closeReview();q().openReview('explanation')}
  else if(key==='textbook'){const v=window.SCHOOL_SOURCE_VIEWER;if(v.state?.().open)v.close();else v.open()}
  else original({video:'media-open',material:'material-open',close:'sentence-open'}[key])?.click();
  schedule();
 }
 for(const [key,b]of Object.entries(proxies))b.onclick=()=>click(key);
 function audioSlots(){if(!media)return[];return [...media.querySelectorAll('audio')].map(a=>({audio:a,node:a.closest('.audio-slot')||a,label:(a.getAttribute('aria-label')||a.closest('.audio-slot')?.querySelector(':scope>span')?.textContent||'').replace(/\s+/g,' ').trim()}))}
 function recordings(key){
  const next=audioSlots(),changed=next.length!==slots.length||next.some((x,i)=>x.audio!==slots[i]?.audio);slots=next;
  if(route!==key)selection=0;selection=Math.min(selection,Math.max(0,slots.length-1));
  const have=!!media&&!media.hidden&&slots.length>0,labels=slots.map((x,i)=>x.label||(slots.length===1?'本页录音':'本页录音 '+(i+1))),signature=JSON.stringify([have,labels]);
  if(recordSignature!==signature){recordSignature=signature;recording.replaceChildren(...(have?labels.map((label,i)=>new Option(label,String(i))):[new Option('本页无独立音频','')]));}
  if(recording.value!==String(selection)&&have)recording.value=String(selection);
  recording.disabled=!have||slots.length<2;recording.dataset.available=String(have);recording.dataset.single=String(have&&slots.length===1);recording.title=have?(slots.length>1?'选择本页录音':labels[selection]):'本页没有独立录音；听写或视频使用对应播放入口';
  audioZone.dataset.available=String(have);placeholder.hidden=have;
  if(changed||have)slots.forEach((x,i)=>{if(x.node.hidden!==(i!==selection))x.node.hidden=i!==selection});
  for(const status of media?.querySelectorAll('.media-load-status')||[]){const retry=status.querySelector('button');if(retry){setText(retry,'Retry');status.title=status.childNodes[0]?.textContent||'Audio is loading'}}
  return have;
 }
 recording.onchange=()=>{selection=Number(recording.value);slots.forEach((x,i)=>{if(i!==selection)x.audio.pause();x.node.hidden=i!==selection});schedule()};
 function resize(){
  const width=app.clientWidth||innerWidth,design=Math.max(MIN_WIDTH,width),scale=Math.min(1,width/MIN_WIDTH),height=88*scale;
  if(canvas.style.width!==design+'px')canvas.style.width=design+'px';
  const transform='scale('+scale+')';if(canvas.style.transform!==transform)canvas.style.transform=transform;
  if(app.style.getPropertyValue('--ct-header-height')!==height+'px')app.style.setProperty('--ct-header-height',height+'px','important');
  const recordingWidth=Math.max(150,Math.min(280,(design-804)*.32));if(canvas.style.getPropertyValue('--toolbar-recording-width')!==recordingWidth+'px')canvas.style.setProperty('--toolbar-recording-width',recordingWidth+'px');
  if(lastWidth!==width){lastWidth=width;requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')))}
  layoutState={width,design,scale,height};return layoutState;
 }
 function refresh(){
  if(running)return;running=true;try{
   const st=U.state(),key=st.current+':'+(st.exercise??''),a=availability();currentAvailability=a;
   setText(proxies.answer,a.review?'Questions':sampleAnswer(key,a.answer)?'Sample answer':'Answers');
   for(const [name,b]of Object.entries(proxies)){setDisabled(b,!a[name]);const pressed=name==='answer'&&a.review||name==='explanation'&&(q()?.stats?.().kind==='explanation'||stage.dataset.feedbackView==='explanation'||stage.classList.contains('ss-explanation'));if(b.getAttribute('aria-pressed')!==String(pressed))b.setAttribute('aria-pressed',String(pressed))}
   proxies.answer.title=a.review?'返回本题题面':a.answer?'显示本题答案':'本页无答案';proxies.explanation.title=a.explanation?'查看本题解析':'解析仅在 H1–H3 中可用';proxies.video.title=a.video?'播放本页视频':'本页无配套视频';proxies.material.title=a.material?'查看本页配套材料':'本页无需单独打开材料';proxies.close.title=a.close?'打开本页精听':'本页无配套精听';proxies.textbook.title=a.textbook?'查看本页教材来源':'本页无教材来源';
   recordings(key);route=key;if(resume)setDisabled(resume,!window.CLASSROOM_TOOLS.canResume?.());
   if(actions.hidden)actions.hidden=false;resize();
  }finally{running=false}
 }
 function schedule(){if(frame!==null)return;frame=requestAnimationFrame(()=>{frame=null;refresh()})}
 new MutationObserver(schedule).observe(backend,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','style','disabled']});
 if(media)new MutationObserver(schedule).observe(media,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','src','aria-label']});
 new MutationObserver(schedule).observe(stage,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
 new MutationObserver(schedule).observe(actions,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('click',schedule);window.addEventListener('hashchange',schedule);window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);
 api=window.CLASSROOM_TASK_CONTROLS={version:VERSION,refresh,schedule,state:()=>({route,review:!!q()?.isReview?.(),rows:2,menuOpen:false,extra:[],recordings:slots.length,availability:{...currentAvailability},selectedRecording:selection,layout:{...layoutState}})};
 refresh();return true;
}
if(!boot()){const timer=setInterval(()=>{if(boot())clearInterval(timer)},30)}
})();
