'use strict';
(()=>{
 const assetRoot=new URL('./',document.currentScript.src),D=window.VOCABULARY_CYCLE_V23,L=window.LESSON,S=window.SCHOOL_STRUCTURE?.[L?.id];if(!D||!S)return;
 for(const c of D.cards)if(c.image.includes('vocabulary-cycle-v23/images/'))c.image=new URL(c.image.split('../assets/')[1],assetRoot).href;
 const sessions=window.SCHOOL_LESSON_OPENING.data.sessions,first=sessions[0],esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cards=new Map(D.cards.map(c=>[c.id,c])),screens=new Map(),pageSources=window.SCHOOL_CURRENT_PAGE_SOURCE,scope=window.SCHOOL_VOCABULARY_SCOPE.data.pages,original=S.routes.slice();
 const words=new Set(D.cards.map(c=>c.word.toLowerCase().replace(/[^a-z0-9]/g,'')));
 function sourceRecord(ids,title){const pages=[];for(const id of ids)for(const pg of cards.get(id).source){const old=pages.find(p=>p.file===pg.file);if(old)old.boxes.push(...structuredClone(pg.boxes));else pages.push(structuredClone(pg));}return{kind:'textbook-vocabulary-list',title,description:'教材书后 Vocabulary 确定本页词汇范围。红框定位当前词条，例句、配图与练习为校本词汇教学内容。',pages};}
 function add(type,payload,label,ids){const index=L.pages.length+1,record={...sourceRecord(ids,label),id:'v23_'+index};pageSources.records[record.id]=record;pageSources.byPage[String(index)]={record:record.id};const page={index,section:'VOCABULARY',kind:'vocabulary cycle '+type,title:label,html:'',controls:[],layers:[]};L.pages.push(page);S.pageInfo[String(index)]={question:null,section:page.section,title:label,old:null};screens.set(index,{type,...payload});return{anchor:index,pages:[index],section:'词汇学习',label,kind:'content',number:null,group:null};}
 const core=D.cards.map(c=>add('card',{card:c},'词汇讲解 · '+c.word,[c.id]));
 const matches=D.matches.map((g,i)=>add('match',{group:g,number:i+1,total:D.matches.length},'图句匹配 · '+(i+1)+' / '+D.matches.length,g.cards));
 const practice=D.practice.map((g,i)=>add('practice',{group:g,number:i+1,total:D.practice.length},'词汇应用 · '+(i+1)+' / '+D.practice.length,g.cards));
 const rawCards=new Set(D.rawCards),glossaryPages=new Set(D.glossary.map(c=>c.page));
 for(const c of D.glossary){screens.set(c.page,{type:'card',card:{...c,glossary:true}});const id='page_'+c.page;pageSources.records[id]={...c.source,id};pageSources.byPage[String(c.page)]={record:id};}
 // Keep auxiliary Glossary cards immediately before their actual textbook section.
 const removedAdditional=new Set(D.oldAdditional.filter(n=>{const text=L.pages[n-1].html,entries=D.cards.filter(c=>text.toLowerCase().includes(c.word.toLowerCase()));return entries.length>0&&!D.glossary.some(c=>text.toLowerCase().includes(c.word.toLowerCase()));}));
 S.routes=S.routes.filter(r=>!r.pages.some(n=>rawCards.has(n))&&!removedAdditional.has(r.anchor));
 for(const card of D.glossary){const route={anchor:card.page,pages:[card.page],section:card.section,label:'Glossary · '+card.word,kind:'content',number:null,group:null};let at=S.routes.findIndex(r=>r.section===card.section&&r.anchor>card.page);if(at<0)at=S.routes.findIndex(r=>r.anchor>card.page&&r.anchor<=D.sessions[3].dictation);if(at<0)at=S.routes.length;S.routes.splice(at,0,route);window.SCHOOL_EXCLUDED_PAGES.delete(card.page);}
 const at=S.routes.findIndex(r=>r.anchor===first.plan);S.routes.splice(at+1,0,...core,...matches,...practice);
 function plan(s){const keep=s.tasks.filter(t=>!['词汇讲解','图句匹配','词汇应用'].includes(t.label));for(const t of keep){if(rawCards.has(t.go)||removedAdditional.has(t.go)){const section=L.pages[t.go-1].section,candidate=S.routes.find(r=>r.section===section&&!glossaryPages.has(r.anchor));if(candidate)t.go=candidate.anchor;}}
 s.tasks=s===first?[{label:'词汇讲解',detail:'书后 Vocabulary 全部 '+D.cards.length+' 个词项',go:core[0].anchor},{label:'图句匹配',detail:'读例句，指认图片，每页 5 组',go:matches[0].anchor},{label:'词汇应用',detail:'完成全部核心词汇的 Additional practice',go:practice[0].anchor},...keep]:keep;
 s.vocabularyPages=s===first?core.map(r=>r.anchor):[];s.vocabularyWords=s===first?D.cards.map(c=>c.word):[];
 const p=L.pages[s.plan-1];p.html=`<section class="lesson-opening lesson-plan" data-session="${s.id}" style="--plan-rows:${s.tasks.length}"><header class="opening-header"><div class="opening-context">Book ${L.book} Unit ${L.unit}<span>第${s.week}周 ${s.skill}</span></div><h1>本节课计划</h1></header><ol class="plan-list">${s.tasks.map((t,i)=>`<li><button class="plan-item" data-action='${JSON.stringify({go:t.go})}'><span class="plan-number">${String(i+1).padStart(2,'0')}</span><span class="plan-text"><strong>${esc(t.label)}</strong><span>${esc(t.detail)}</span></span><span class="plan-arrow" aria-hidden="true">进入</span></button></li>`).join('')}</ol></section>`;}
 sessions.forEach(plan);S.routeMap={};S.routes.forEach((r,i)=>r.pages.forEach(p=>S.routeMap[String(p)]=i));
 function syncSources(){const viewer=window.SCHOOL_SOURCE_VIEWER;if(viewer)Object.entries(pageSources.records).filter(([k])=>k.startsWith('v23_')||D.glossary.some(c=>k==='page_'+c.page)).forEach(([id,r])=>viewer.records.set(id,r));}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncSources,{once:true});else syncSources();
 const photoFocus={"38886eb675a19fd94521b16ad116da94869a2e530234548289918b8f7f86fcd9.webp":65,"479b974cefbf9a608ecbf249827aeb703942be4cb75889b110731111bd2b18c2.webp":65,"35dd6ea788b3996b921613daabc83d69ac89cbdd5e48f04af0c13557a3f5f342.webp":65,"1b9e9beb2384a8f2f8e7eb58c95da3aaaa31c181cc7754c15b16017cf7d29745.webp":65};
 function photoStyle(c){return '--vc-photo-x:'+(photoFocus[c.image.split('/').pop()]||50)+'%';}
 const sourceButton='<button type="button" class="vc-source" data-vc-source>教材来源</button>';
 function mark(c){let html=esc(c.example);for(const target of c.answerParts||[c.answer]){const token=esc(target),i=html.toLowerCase().indexOf(token.toLowerCase());if(i>=0)html=html.slice(0,i)+'<b>'+html.slice(i,i+token.length)+'</b>'+html.slice(i+token.length);}return html;}
 function head(title,note,extra=''){return`<header class="vc-head"><small>VOCABULARY</small><h1>${title}</h1><p>${note}</p>${extra}</header>${sourceButton}`;}
 function cardHTML(c){return`<section class="vcycle vc-card">${head('Vocabulary in context','Book '+L.book+' Unit '+L.unit)}<div class="vc-card-word${c.word.length>20?' vc-long':''}">${esc(c.word)}</div><div class="vc-pos">${esc(c.pos)}</div><button type="button" class="vc-cn" data-vc-cn><span class="vc-cn-hint">点击查看中文释义</span><span class="vc-cn-value">${esc(c.cn)}</span></button><div class="vc-definition"><h2>DEFINITION</h2><p>${esc(c.definition)}</p></div><div class="vc-example"><h2>EXAMPLE</h2><p>${mark(c)}</p></div><img class="vc-card-photo" src="${c.image}" style="${photoStyle(c)}" alt="词汇情境配图"></section>`;}
 function matchHTML(q){const g=q.group,list=g.cards.map(id=>cards.get(id)),letters='ABCDE';return`<section class="vcycle vc-match">${head('Read. Look. Match.','Match sentences 1–5 with pictures A–E.')}<div class="vc-workspace"><div class="vc-sentences">${list.map((c,i)=>`<button type="button" class="vc-sentence" data-vc-row="${i}" aria-label="句子 ${i+1}"><span class="vc-num">${i+1}</span><span class="vc-copy">${mark(c)}</span><span class="vc-pair-response"><span class="vc-answer"></span><span class="vc-pair-result" role="status"></span></span></button>`).join('')}</div><div class="vc-pictures">${g.order.map((i,j)=>`<button type="button" class="vc-picture" data-vc-picture="${j}" aria-label="图片 ${letters[j]}"><img src="${list[i].image}" style="${photoStyle(list[i])}" alt=""><span class="vc-letter">${letters[j]}</span><span class="vc-pair"></span></button>`).join('')}</div></div><footer class="vc-footer"><div class="vc-footer-label"><span>图句匹配 ${q.number} / ${q.total}</span><span class="vc-match-help">可先选句子或图片</span></div><div><span data-vc-progress aria-live="polite">已配对 0 / 5</span><button type="button" data-vc-reset>重置</button><button type="button" class="vc-primary" data-vc-check disabled>检查</button><button type="button" data-vc-answer>答案</button></div></footer></section>`;}
 const textMeasure=document.createElement('canvas').getContext('2d');textMeasure.font='600 34px Arial';
 function cloze(c){let html=esc(c.example);for(const answer of c.answerParts||[c.answer]){const token=esc(answer),i=html.toLowerCase().indexOf(token.toLowerCase());if(i<0)throw Error('Cloze answer missing: '+c.word);const width=Math.max(130,Math.ceil(textMeasure.measureText(answer).width)+30);html=html.slice(0,i)+`<span class="vc-slot" style="width:${width}px"><span class="vc-blank">________</span><span class="vc-fill">${html.slice(i,i+token.length)}</span></span>`+html.slice(i+token.length);}return html;}
 function optionOrder(q){if(q.type==='match')return q.group.order;const order=q.group.cards.map((_,i)=>i);if(order.length>1)order.push(order.shift());return order;}
 function practiceHTML(q){const list=q.group.cards.map(id=>cards.get(id)),order=optionOrder({...q,type:'practice'});return`<section class="vcycle vc-practice">${head('Use the words.','Match each sentence with a word in the box. Use the correct form.')}<div class="vc-bank">${order.map((i,j)=>`<button type="button" class="vc-option" data-vc-option="${j}" aria-label="选项 ${'ABCDE'[j]} ${esc(list[i].word)}"><em>${'ABCDE'[j]}</em><span>${esc(list[i].word)}</span><span class="vc-option-pair"></span></button>`).join('')}</div><div class="vc-practice-rows">${list.map((c,i)=>`<button type="button" class="vc-practice-row" data-vc-row="${i}" aria-label="句子 ${i+1}"><span class="vc-num">${i+1}</span><span class="vc-practice-copy">${cloze(c)}</span><span class="vc-pair-response"><span class="vc-answer"></span><span class="vc-pair-result" role="status"></span></span></button>`).join('')}</div><footer class="vc-footer"><div class="vc-footer-label"><span>Additional practice ${q.number} of ${q.total}</span><span class="vc-match-help">可先选句子或词语</span></div><div><span data-vc-progress aria-live="polite">已配对 0 组，共 ${list.length} 组</span><button type="button" data-vc-reset>重置</button><button type="button" class="vc-primary" data-vc-check disabled>检查</button><button type="button" data-vc-answer>答案</button></div></footer></section>`;}
 for(const [index,q]of screens)L.pages[index-1].html=q.type==='card'?cardHTML(q.card):q.type==='match'?matchHTML(q):practiceHTML(q);
 const previous=window.createSchoolQuestionView;
 window.createSchoolQuestionView=ctx=>{
  const base=previous(ctx),stage=ctx.stage,app=ctx.app;
  let current=null,revealed=new Set(),active=-1,pendingOption=-1,reviewing=false,pairs=new Map(),checked=false,answerShown=false;
  const letters='ABCDE',palette=[['#3565c7','#edf3ff'],['#087b69','#eaf7f2'],['#915086','#f8eef7'],['#986613','#fff6e8'],['#6654b2','#f1effb']];
  const get=()=>screens.get(ctx.state().current),controls={answer:app.querySelector('#answer-mode'),explanation:app.querySelector('#review-mode'),back:app.querySelector('#question-return'),label:app.querySelector('#feedback-view-label')};
  function tint(node,index){const p=palette[index];node.style.setProperty('--vc-pair-color',p?.[0]||'#dce2ea');node.style.setProperty('--vc-pair-bg',p?.[1]||'#fff');}
  function isCorrect(i){const q=get();return pairs.has(i)&&optionOrder(q)[pairs.get(i)]===i;}
  function paint(){
   const q=get();if(!q)return;
   if(q.type==='match'||q.type==='practice'){
    stage.querySelectorAll('[data-vc-row]').forEach((node,i)=>{
     const paired=pairs.has(i),selected=i===active,showResult=checked&&!answerShown&&paired;
     tint(node,i);node.classList.toggle('vc-paired',paired);node.classList.toggle('vc-selected',selected);node.classList.toggle('vc-checked-correct',showResult&&isCorrect(i));node.classList.toggle('vc-checked-incorrect',showResult&&!isCorrect(i));
     node.setAttribute('aria-pressed',String(selected));node.setAttribute('aria-disabled',String(answerShown));
     node.querySelector('.vc-answer').textContent=paired?letters[pairs.get(i)]:'';
     const result=node.querySelector('.vc-pair-result');result.textContent=showResult?(isCorrect(i)?'✓':'×'):'';result.setAttribute('aria-label',showResult?(isCorrect(i)?'配对正确':'配对需调整'):'');
    });
    stage.querySelectorAll('[data-vc-picture],[data-vc-option]').forEach(node=>{
     const pos=Number(node.dataset.vcPicture??node.dataset.vcOption),entry=[...pairs].find(([,picture])=>picture===pos),i=entry?.[0];
     const selected=pos===pendingOption;tint(node,i??(selected?0:undefined));node.classList.toggle('vc-paired',!!entry);node.classList.toggle('vc-selected',selected);node.setAttribute('aria-pressed',String(selected));node.setAttribute('aria-disabled',String(answerShown));node.setAttribute('aria-label',(q.type==='match'?'图片 ':'选项 ')+letters[pos]+(q.type==='practice'?' '+cards.get(q.group.cards[optionOrder(q)[pos]]).word:'')+(entry?'，已配第 '+(i+1)+' 句':''));node.querySelector('.vc-pair,.vc-option-pair').textContent=entry?String(i+1):'';
    });
    const progress=stage.querySelector('[data-vc-progress]'),checkButton=stage.querySelector('[data-vc-check]');
    if(answerShown)progress.textContent='答案已显示';
    else if(checked){const correct=[...pairs.keys()].filter(isCorrect).length;progress.textContent=correct===q.group.cards.length?correct+' 组配对正确':correct+' 组正确，'+(q.group.cards.length-correct)+' 组需调整';}
    else progress.textContent='已配对 '+pairs.size+' 组，共 '+q.group.cards.length+' 组';
    checkButton.disabled=pairs.size!==q.group.cards.length||answerShown;
    if(q.type==='practice')stage.querySelectorAll('.vc-practice-row').forEach(n=>n.classList.toggle('vc-revealed',answerShown));
    return;
   }
   stage.querySelectorAll('.vc-practice-row').forEach((n,i)=>n.classList.toggle('vc-revealed',revealed.has(i)));
   const total=q.group?.cards.length||0,p=stage.querySelector('[data-vc-progress]'),button=stage.querySelector('[data-vc-next]');
   if(p)p.textContent='已揭晓 '+revealed.size+' / '+total;
   if(button){button.disabled=revealed.size===total;button.textContent=button.disabled?'已全部揭晓':'揭晓下一题';}
  }
  function pair(sentence,option){for(const [i,picture]of pairs)if(picture===option&&i!==sentence)pairs.delete(i);pairs.set(sentence,option);checked=false;active=-1;pendingOption=-1;paint();}
  function selectSentence(i){if(!['match','practice'].includes(get()?.type)||answerShown||i<0||i>=get().group.cards.length)return;if(pendingOption>=0){pair(i,pendingOption);return;}active=active===i?-1:i;paint();}
  function selectPicture(pos){
   if(!['match','practice'].includes(get()?.type)||answerShown||pos<0||pos>=get().group.cards.length)return;
   if(active>=0){pair(active,pos);return;}
   pendingOption=pendingOption===pos?-1:pos;paint();
  }
  function check(){if(!['match','practice'].includes(get()?.type)||pairs.size!==get().group.cards.length||answerShown)return;checked=true;active=-1;pendingOption=-1;paint();}
  function answer(){const q=get();if(!['match','practice'].includes(q?.type))return;pairs=new Map(q.group.cards.map((_,i)=>[i,optionOrder(q).indexOf(i)]));if(q.type==='practice')revealed=new Set(q.group.cards.map((_,i)=>i));answerShown=true;checked=false;active=-1;pendingOption=-1;paint();}
  function next(){answer();}
  function reset(){revealed.clear();pairs.clear();checked=false;answerShown=false;active=-1;pendingOption=-1;paint();}
  function bind(){
   stage.querySelector('[data-vc-source]').onclick=()=>window.SCHOOL_SOURCE_VIEWER.open();
   stage.querySelector('[data-vc-cn]')?.addEventListener('click',e=>e.currentTarget.classList.toggle('vc-shown'));
   stage.querySelector('[data-vc-next]')?.addEventListener('click',next);stage.querySelector('[data-vc-reset]')?.addEventListener('click',reset);
   stage.querySelector('[data-vc-check]')?.addEventListener('click',check);stage.querySelector('[data-vc-answer]')?.addEventListener('click',answer);
   stage.querySelectorAll('[data-vc-row]').forEach((n,i)=>n.onclick=()=>selectSentence(i));stage.querySelectorAll('[data-vc-picture],[data-vc-option]').forEach(n=>n.onclick=()=>selectPicture(Number(n.dataset.vcPicture??n.dataset.vcOption)));
  }
  function refresh(){if(!get())return base.refresh();controls.answer.hidden=get().type==='card';controls.explanation.hidden=true;controls.back.hidden=!reviewing;controls.label.hidden=!reviewing;controls.label.textContent='答案';controls.answer.onclick=()=>api.openReview('answer');controls.back.onclick=()=>api.closeReview();app.querySelector('#feedback-controls').hidden=true;app.querySelector('#part-select').hidden=true;}
  const api={...base,
   prepareInline(){const q=get();if(!q){current=null;reviewing=false;stage.classList.remove('vc-stage');return base.prepareInline();}if(current!==ctx.state().current){current=ctx.state().current;revealed=new Set();pairs=new Map();active=-1;pendingOption=-1;checked=false;answerShown=false;reviewing=false;}stage.classList.add('vc-stage');base.setQuestionHeight(1080);bind();paint();refresh();return{answer:q.type!=='card',explanation:false};},
   refresh,availability:()=>get()?{answer:get().type!=='card',explanation:false}:base.availability(),
   openReview(kind){if(!get())return base.openReview(kind);if(kind!=='answer'||get().type==='card')return;reviewing=true;answer();app.classList.add('review-open');stage.dataset.feedbackView='answer';paint();refresh();},
   closeReview(){if(!get())return base.closeReview();reviewing=false;app.classList.remove('review-open');delete stage.dataset.feedbackView;reset();refresh();},
   isReview:()=>get()?reviewing:base.isReview()
  };
  window.VOCABULARY_CYCLE_PLAYER={next,reset,selectSentence,selectPicture,selectOption:selectPicture,check,answer,state:()=>({page:ctx.state().current,type:get()?.type,revealed:[...revealed],pairs:[...pairs].map(([sentence,picture])=>({sentence:sentence+1,picture:letters[picture]})),selected:active<0?null:active+1,selectedOption:pendingOption<0?null:letters[pendingOption],checked,answerShown,results:checked?[...pairs.keys()].sort().map(i=>({sentence:i+1,correct:isCorrect(i)})):[]})};
  return api;
 };
 window.VOCABULARY_CYCLE_MODEL={data:D,screens,core:core.map(r=>r.anchor),matches:matches.map(r=>r.anchor),practice:practice.map(r=>r.anchor),glossary:[...glossaryPages],removedAdditional:[...removedAdditional]};
})();
