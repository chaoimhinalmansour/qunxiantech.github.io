/* B2 LS U1: typed source roles, complete teaching carriers, and recording identity. */
(()=>{'use strict';
if(window.LESSON?.id!=='B2_LS_U01')return;
const tasks=window.SCHOOL_TEXTBOOK_V21.tasks,ids={audio:'B2_LS_U01_P51_E7',notes:'B2_LS_U01_G6_E8',discussion:'B2_LS_U01_LISTENING1_TEXTBOOK_E10',writing:'B2_LS_U01_LISTENING1_TEXTBOOK_E11'};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const registry=window.CLASSROOM_RESTORE_CASES||={};
const add=(pages,n,s)=>pages.forEach(p=>registry['B2_LS_U01:'+p+':'+n]=s);
const roles=id=>tasks[id].contentRoles;
function noteFragment(x,api){if(typeof x==='string')return esc(x);const given=Object.hasOwn(x,'given'),value=x.given??x.answer;return '<span class="u01-note-gap" data-note-number="'+x.number+'" data-given="'+given+'" style="--note-width:'+Math.max(125,Math.min(505,value.length*18+28))+'px"><sup>('+x.number+')</sup>'+(given?'<span class="u01-note-given">'+esc(value)+'</span>':api.slot(value))+'</span>';}
function notebook(api){return '<article class="u01-student-notes" data-content-role="student-notes" aria-label="Student’s notes about four homes">'+roles(ids.notes).material.groups.map((group,i)=>'<section class="u01-note-group" data-place="'+esc(group.place)+'">'+group.lines.map((line,j)=>{const fragments=line.map(x=>noteFragment(x,api));if(i===1&&j===1)return '<p class="u01-note-fact">'+fragments.slice(0,-1).join('')+'</p><p class="u01-note-fact">years ago.</p>';return '<p class="'+(j===0?'u01-note-place':'u01-note-fact')+'">'+(j===0?'<span class="u01-note-bullet">•</span>':'')+fragments.join('')+'</p>';}).join('')+'</section>').join('')+'</article>';}
add([54,55],8,{answer:true,explanation:false,layoutClass:'u01-followup-task',section:'LISTENING 1',title:'WHILE LISTENING',instruction:tasks[ids.notes].originalInstruction,html:notebook});
function photos(){return '<div class="u01-discussion-photos" data-content-role="photo-set">'+roles(ids.discussion).material.photos.map(p=>'<figure><img src="'+esc(p.src)+'" alt="Home '+p.letter+'"><figcaption>'+p.letter+'</figcaption></figure>').join('')+'</div>';}
function discussion(api){const e=UNLOCK_PLAYER.classroom.graph.exercises.find(e=>e.id===ids.discussion),answers=e?.originalTask?.answers||[];return '<div class="u01-discussion">'+photos()+'<div class="u01-comparison-notes" data-content-role="comparison-notes">'+roles(ids.discussion).examples.map((example,i)=>'<section><h2>'+esc(example.label)+'</h2><p class="u01-source-example" data-content-role="example">'+esc(example.text)+'</p><div class="u01-response-space" data-content-role="response"><span class="u01-answer-caption">Possible answer</span>'+api.value(answers[i]||'')+'</div></section>').join('')+'</div></div>';}
add([180],10,{answer:true,explanation:false,layoutClass:'u01-followup-task',section:'LISTENING 1',title:'DISCUSSION',instruction:tasks[ids.discussion].originalInstruction,html:discussion});
function writing(api){const e=UNLOCK_PLAYER.classroom.graph.exercises.find(e=>e.id===ids.writing),answers=e?.originalTask?.answers||[];return '<article class="u01-writing-sheet" data-content-role="writing-sheet"><div class="u01-writing-context"><span>From your discussion notes</span></div>'+roles(ids.writing).sentenceStarters.map((raw,i)=>{const stem=raw.replace(/\s*…$/,'');const text=(answers[i]||'').startsWith(stem)?answers[i].slice(stem.length).trim():answers[i]||'';return '<section class="u01-writing-band u01-writing-band-'+i+'"><p class="u01-sentence-starter" data-content-role="sentence-starter">'+esc(stem)+'</p><div class="u01-writing-response" data-content-role="response">'+api.value(text)+'</div></section>';}).join('')+'<span class="u01-writing-answer-label">Possible answers</span></article>';}
add([181],11,{answer:true,explanation:false,layoutClass:'u01-followup-task',section:'LISTENING 1',title:'POST-LISTENING',instruction:tasks[ids.writing].originalInstruction,html:writing});
let U,app,scheduled=false;
function apply(){const e=U.classroom.exercise(),p=U.state().current,id=e?.id,own=Object.values(ids).includes(id);const view=own?id===ids.notes?'notes':id===ids.discussion?'discussion':id===ids.writing?'writing':'audio':'';if(app.dataset.u01Followup!==view)app.dataset.u01Followup=view;
 const media=own?roles(id).media:undefined;
 if(media?.length===1){for(const slot of app.querySelectorAll('.task-media .audio-slot,.task-media-bar .audio-slot,#task-media .audio-slot,.audio-slot')){if(slot.closest('.reference-panel,.reader-document'))continue;const label=slot.querySelector(':scope>span');if(label&&label.textContent!==media[0].label.replace(' · ',' '))label.textContent=media[0].label.replace(' · ',' ');const a=slot.querySelector('audio');if(a&&a.getAttribute('aria-label')!==media[0].label.replace(' · ',' '))a.setAttribute('aria-label',media[0].label.replace(' · ',' '));}}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()});}
function boot(){U=window.UNLOCK_PLAYER;app=document.querySelector('#app');if(!U||!window.CLASSROOM_REVIEW_POLICY){setTimeout(boot,40);return;}
 const G=U.classroom.graph,S=U.structure;
 for(const id of Object.values(ids)){const e=G.exercises.find(e=>e.id===id);if(!e)continue;const t=tasks[id];e.contentRoles=t.contentRoles;e.canonical=t.originalInstruction;e.instruction=t.originalInstruction;e.continuation_instructions=[];
  if(e.originalTask)e.originalTask.instruction=t.originalInstruction;
  const keep=new Set(t.contentRoles.media.map(x=>x.resource));e.native_audio=(e.native_audio||[]).filter(x=>keep.has(x));e.precision=(e.precision||[]).filter(x=>keep.has(x));e.resources=(e.resources||[]).filter(x=>!G.resources[x]||G.resources[x].kind!=='audio'||keep.has(x));
 }
 const n=G.exercises.find(e=>e.id===ids.notes);if(n)n.pages=[54];
 const route=S.routes.find(r=>r.anchor===54);if(route)route.pages=[54];for(const group of S.groups)for(const e of group.exercises)if(e.pages[0]===54&&e.number===8)e.pages=[54];
 S.routeMap={};S.routes.forEach((r,i)=>r.pages.forEach(p=>S.routeMap[String(p)]=i));S.routeMap['55']=S.routes.findIndex(r=>r.anchor===54);window.SCHOOL_EXCLUDED_PAGES.add(55);

 new MutationObserver(schedule).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});window.addEventListener('hashchange',schedule);
 const st=U.state();if(Object.values(ids).includes(U.classroom.exercise()?.id)){U.questionView.closeReview();U.goto(st.current===55?54:st.current,false,{exercise:st.exercise});}else window.CLASSROOM_CONTEXT_RESTORATION.refresh();
 window.CLASSROOM_U01_FOLLOWUP={version:'20261026-followup-v1',refresh:apply,roles:()=>Object.fromEntries(Object.values(ids).map(id=>[id,roles(id)]))};apply();window.CLASSROOM_TASK_CONTROLS.refresh(true);
}
boot();
})();
