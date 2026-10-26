/* Explanations are available only inside H1, H2 and H3. */
(()=>{'use strict';
function boot(){
 const U=window.UNLOCK_PLAYER,app=document.querySelector('#app');
 if(!U||!app||!window.CLASSROOM_CONTEXT_RESTORATION||!window.W1_REPAIR_RUNTIME){setTimeout(boot,40);return}
 if(window.CLASSROOM_REVIEW_POLICY)return;
 const q=U.questionView,stage=app.querySelector('.stage'),available=q.availability.bind(q),open=q.openReview.bind(q),refresh=q.refresh.bind(q);
 const allowed=()=>{const st=U.state(),route=U.structure.routes[st.routeIndex],page=LESSON.pages[st.current-1];return [route?.section,route?.label,page?.section,page?.title].some(t=>/\bH[123]\b|Homework\s*[123]\b/i.test(t||''));};
 let scheduled=false;
 function apply(){const yes=allowed(),value=String(yes);if(app.dataset.explanationAllowed!==value)app.dataset.explanationAllowed=value;const button=document.getElementById('review-mode');if(!yes&&button&&!button.hidden)button.hidden=true;if(LESSON.id==='B2_LS_U01'){const p=U.state().current,task=[15,17].includes(p)?'seven-statements':[35,36,37,38].includes(p)?'predicting':'';if(app.dataset.manualU01Task!==task)app.dataset.manualU01Task=task;}if(!yes&&(q.stats?.().kind==='explanation'||stage.dataset.feedbackView==='explanation')&&q.isReview())q.closeReview();}
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply()});}
 q.availability=()=>{const a=available();return allowed()?a:{...a,explanation:false}};
 q.openReview=(kind='explanation')=>{if(kind==='explanation'&&!allowed())return false;return open(kind)};
 q.refresh=()=>{const result=refresh();apply();return result};
 app.addEventListener('click',e=>{if(!allowed()&&e.target.closest?.('#review-mode,[data-u-explain],[data-group-explain]')){e.preventDefault();e.stopImmediatePropagation();}},true);
 new MutationObserver(schedule).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
 window.addEventListener('hashchange',schedule);document.addEventListener('click',schedule);
 if(LESSON.id==='B2_LS_U01'){
  const S=U.structure,exercises=U.classroom.graph.exercises;
  const tf=exercises.find(e=>e.id==='B2_LS_U01_G2_E3');if(tf){tf.pages=[15];tf.continuation_instructions=[];}
  const pred=exercises.find(e=>e.id==='B2_LS_U01_G4_E1');
  const instruction='2 You are going to listen to a podcast about homes around the world. Look at the photos. What do you think you will learn about homes?';
  if(pred){pred.number=2;pred.pages=[35];pred.instruction=instruction;pred.canonical=instruction;pred.book_pages=[19];pred.titles=['PREPARING TO LISTEN|PREDICTING CONTENT USING VISUALS'];pred.continuation_instructions=[];pred.original_instructions=[{page:35,text:instruction}];pred.textbook_instruction={printed:19,file_page:17,number:2,text:instruction};pred.feedback=[];}
  for(const [anchor,number,label]of [[15,3,'WHILE WATCHING · UNDERSTANDING MAIN IDEAS'],[35,2,'PREPARING TO LISTEN · PREDICTING CONTENT USING VISUALS']]){const r=S.routes.find(r=>r.anchor===anchor);if(r){r.pages=[anchor];r.number=number;r.label='Ex. '+number+' · '+label;}if(S.pageInfo[String(anchor)]){S.pageInfo[String(anchor)].title=label;S.pageInfo[String(anchor)].question=number;}}
  const id='B2_LS_U01_G4_E1',record={id,kind:'textbook-exercise',title:'Listening 1 · Predicting content using visuals · Exercise 2',description:'教材 p19 第2题，包含完整题干及四张所依据的照片。',pages:[{book:'B2_LS',page:19,width:555.6,height:748.32,file:'assets/textbook-source-v22/pages/B2_LS/p019.webp',boxes:[{kind:'exercise',rect:[57,42,531,104],label:'Exercise 2 · Predicting content using visuals'},{kind:'material',rect:[57,155,531,704],label:'Four photos used by Exercise 2'}]}]};
  SCHOOL_CURRENT_PAGE_SOURCE.records[id]=record;SCHOOL_SOURCE_VIEWER.records.set(id,record);
  for(const n of [35,36,37,38])SCHOOL_CURRENT_PAGE_SOURCE.byPage[String(n)]={exerciseIds:[id]};
  S.routeMap={};S.routes.forEach((r,i)=>r.pages.forEach(p=>S.routeMap[String(p)]=i));
  for(const p of [17,36,37,38]){const route=S.routes.findIndex(r=>r.anchor===(p===17?15:35));S.routeMap[String(p)]=route;SCHOOL_EXCLUDED_PAGES.add(p);}
  window.CLASSROOM_CONTEXT_RESTORATION.refresh();
  const st=U.state();if([15,17,35,36,37,38].includes(st.current)){q.closeReview();U.goto(st.current===17?15:st.current>35?35:st.current,false,{exercise:st.current<18?3:2});}
 }
 window.CLASSROOM_REVIEW_POLICY={version:'20261026-u01-manual-1',allowed,refresh:apply,state:()=>({allowed:allowed(),unit:LESSON.id,current:U.state().current,availability:q.availability()})};
 apply();window.CLASSROOM_TASK_CONTROLS.refresh(true);
}
boot();
})();