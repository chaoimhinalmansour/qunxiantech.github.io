/* Normalize presentation copy without touching source data, media paths or form answers. */
(()=>{'use strict';
const skip='script,style,code,pre,textarea,[contenteditable="true"],.plain-ui-icon';
const cn=/[\u3400-\u9fff]/;
const paths={right:'M4 12h15m-6-6 6 6-6 6',left:'M20 12H5m6-6-6 6 6 6',down:'M12 4v15m-6-6 6 6 6-6',up:'M12 20V5m-6 6 6-6 6 6',check:'m5 12 4 4L19 6',cross:'m6 6 12 12M18 6 6 18'};
let changes=0,working=false;const pending=new Set(),reviewFits=new WeakMap();
const taskCopy={
 '单词听写':'Vocabulary dictation','序号':'No.','英文':'English','中文释义':'Chinese meaning','词性':'Part of speech',
 '开始阅读':'READ AND LISTEN','开始听力':'LISTENING PRACTICE',
 '1. 跟随课文音频扫读，圈出生词。':'1. Read along with the audio. Circle unfamiliar words.',
 '2. 音频结束后，再自己阅读一遍。':'2. Read the text again on your own.',
 '3. 完成自主阅读后，进入练习。':'3. When you finish reading, continue to the exercises.',
 '第一遍：跟随音频与同步 Script 理解材料。':'First listening: follow the audio and transcript.',
 '第二遍：隐藏 Script，再听一遍。':'Second listening: hide the transcript and listen again.',
 '准备就绪后，由老师开始播放。':'Listen when your teacher starts the audio.',
 '音频已结束，请自主阅读。':'Now read the text on your own.',
 '音频已结束，请自主阅读，再进入练习。':'Read the text on your own, then continue to the exercises.',
 '第一遍已结束，Script 已隐藏。':'The first listening is complete. The transcript is hidden.',
 '第一遍已结束，Script 已隐藏。请开始第二遍。':'The transcript is hidden. Listen for a second time.',
 '第二遍已结束，可以进入练习。':'The second listening is complete. Continue to the exercises.',
 '跟随音频扫读，并圈出生词。':'Read along with the audio. Circle unfamiliar words.',
 '第一遍：跟随同步 Script。':'First listening: follow the transcript.',
 '第二遍：集中听音频。':'Second listening: focus on the audio.',
 '请点击音频播放键开始。':'Select Play to start the audio.',
 '已切换录音，请开始第一遍。':'The recording has changed. Start the first listening.',
 '播放第一遍':'First listening','播放第二遍':'Second listening','隐藏 Script':'Hide transcript','显示 Script':'Show transcript','进入练习':'Continue to exercises',
 '播放听写':'Play dictation','暂停听写':'Pause','继续听写':'Resume','重新播放':'Play again','从头播放':'Restart',
 '音频播放失败，请重试':'Audio could not play. Please try again.','本轮听写已播放完毕':'Dictation complete.',
 '英文读两遍，词间停顿 1.5 秒':'Each word twice, with a 1.5-second pause.',
 '查看原练习单原文':'View passage','原练习单原文':'Original passage','选项':'Options','下一题':'Answers','本组答案已全部展示':'Answers shown'
};
function taskText(node){const value=node.textContent.trim();let next=taskCopy[value];
 if(!next&&node.closest('.lesson-dictation')){next=value.replace(/^教材书后 Vocabulary 共 (\d+) 个词条，写出英文、中文释义和词性$/,'$1 words from the Vocabulary list. Write the English word, Chinese meaning and part of speech.').replace(/^第 (\d+) \/ (\d+) 个词条(，已暂停)?$/,'Word $1 of $2$3').replace('，已暂停',' (paused)');}
 if(!next&&node.matches('[data-group-progress]'))next=value.replace(/^已揭晓 (\d+) \/ (\d+)$/,'$1 of $2 answers shown').replace(/^已显示 (\d+) 题，共 (\d+) 题$/,'$1 of $2 answers shown');
 if(!next&&node.matches('.guided-page-number'))next=value.replace(/^教材 p\./,'Book p.');
 if(!next&&node.matches('[data-track] option'))next=value.replace(/^教材录音 /,'Recording '); if(!next&&node.matches('[data-group-audio] option'))next='Recording '+(value.match(/^[A-Z]?\d+/)?.[0]||value.split(/[，,]/)[0]);
 if(next&&next!==value){if(node.tagName==='OPTION'&&!node.hasAttribute('value'))node.setAttribute('value',node.value);node.textContent=next;}
}
function studentTasks(){const stage=document.querySelector('.stage');if(!stage)return;
 const dictation=stage.querySelector('.lesson-dictation');if(dictation){dictation.querySelectorAll('h1,.opening-note,thead th,[data-dictation-play]>span,[data-dictation-restart],[data-dictation-status]').forEach(taskText);const context=dictation.querySelector('.opening-context>span');if(context){const s=SCHOOL_LESSON_OPENING.data.sessions.find(s=>s.id===dictation.dataset.session),skills={'听力':'Listening','口语':'Speaking','阅读':'Reading','写作':'Writing'};const text='Week '+s.week+' '+(skills[s.skill]||s.skill);if(context.textContent!==text)context.textContent=text;}}
 const guided=stage.querySelector('.guided-screen');if(guided)guided.querySelectorAll('h1,.guided-instructions p,.guided-status,.guided-actions button,.guided-page-number,[data-track] option').forEach(taskText);
 const hw=stage.querySelector('.full-homework');if(!hw)return;
 hw.querySelectorAll('[data-group-material],[data-hw-material],[data-group-next],[data-group-progress],.group-choice-bank>span:first-child,[data-group-audio] option').forEach(taskText);
 if(hw.classList.contains('group-homework')&&!hw.dataset.plainHomework){hw.dataset.plainHomework='true';const group=window.SCHOOL_LESSON_DESIGN?.groups.get(window.UNLOCK_PLAYER?.state().current);if(group){const first=group.questions[0],last=group.questions.at(-1),types={fill:'Sentence completion',heading:'Matching headings',match:'Matching',multi:'Multiple answers',single:'Multiple choice',summary:'Summary completion',tfng:'True, false or not given'};hw.querySelector('.hw-group').textContent='Questions '+first.number+(first.number===last.number?'':' to '+last.number)+'    '+types[first.type];}const button=hw.querySelector('[data-group-next]'),original=button?.onclick;if(button&&original)button.onclick=()=>{for(let i=0;i<25&&!button.disabled;i++)original();flush();};
  for(const table of hw.querySelectorAll('.group-aids table'))if([...table.rows].every(r=>r.cells.length===2&&r.cells[0].textContent.trim().length<7))table.classList.add('plain-heading-list');
  const panel=hw.querySelector('.hw-fit');if(panel){for(let size=34;size>=26;size--){panel.style.setProperty('--plain-hw-font',size+'px');if(panel.scrollHeight<=panel.clientHeight+1&&panel.scrollWidth<=panel.clientWidth+1)break;}}
 }
}
const prose={
'依据：In my opinion, + clause':'依据：In my opinion 后用逗号隔开，再接完整句子。',
'依据：Why + did + subject + base verb':'依据：Why 后依次使用 did、主语和动词原形。',
'依据：did not + like':'依据：did not 后接动词原形 like。',
'依据：did not + open':'依据：did not 后接动词原形 open。',
'依据：does not + have; much traffic':'依据：does not 后接动词原形 have，much 修饰不可数名词 traffic。',
'解析：Be careful 后用 not to + 动词原形表达提醒不要做某事，spend 的宾语是 all the money。':'解析：Be careful 后用 not to，后接动词原形，提醒对方不要做某事。spend 的宾语是 all the money。',
'解析：I + enjoy + walking 构成 enjoy doing，on cool days 作时间状语，不能写 enjoy to walk。':'解析：主语 I 后接 enjoy walking，使用 enjoy doing 结构。on cool days 作时间状语，不能写 enjoy to walk。',
'解析：On the other hand 作转折连接语，后面加逗号，主干是 the screen + is + quite small，quite 修饰形容词 small。':'解析：On the other hand 作转折连接语，后面加逗号。句子主干是 the screen is quite small，quite 修饰形容词 small。',
'解析：Why 引导建议式疑问句，结构是 Why + do + we + not + 动词原形 try。do 已承担时态，try 保持原形，the food event 是宾语。':'解析：Why 引导建议式疑问句，后面依次使用 do、we、not 和动词原形 try。do 已承担时态，try 保持原形，the food event 是宾语。',
'解析：be able to 的结构是 is able to + 动词原形 send，She 是单数第三人称，所以 be 用 is。a text 作 send 的宾语。':'解析：is able to 后接动词原形 send。She 是单数第三人称，所以 be 用 is。a text 作 send 的宾语。',
'解析：make + 宾语与形容词构成使役结构：makes typing easier。typing 是动名词作宾语，easier 作宾语补足语说明结果。':'解析：make 后接宾语和形容词，构成使役结构 makes typing easier。typing 是动名词作宾语，easier 作宾语补足语说明结果。',
'解析：need 后接 to + 动词原形，find out 是固定短语“查明”，the opening times 是要查明的信息。':'解析：need 后接 to，再接动词原形。find out 是固定短语“查明”，the opening times 是要查明的信息。',
'解析：used to 标记过去只在餐厅见面，Now + have begun 标记当前改变，cooking at home 与 everyone brings one dish 说明新做法，末句给个人评价。before、now、opinion 三部分缺一不可。':'解析：used to 标记过去只在餐厅见面，Now 后使用 have begun 标记当前改变。cooking at home 与 everyone brings one dish 说明新做法，末句给个人评价。before、now、opinion 三部分缺一不可。',
'解析：want 后接 to + 动词原形 attract，customers 是可数复数，more 修饰其数量。':'解析：want 后接 to，再接动词原形 attract。customers 是可数复数，more 修饰其数量。',
'解析：would like 后接 to + 动词，专有地名 Green Lake 两个词均大写。':'解析：would like 后接 to，再接动词原形。专有地名 Green Lake 两个词均大写。',
'解析：主语 A touch screen 为单数，所以 help 加 -s，helps 后用宾语 users + 动词原形 choose，构成 help somebody do something。':'解析：主语 A touch screen 为单数，所以 help 加 -s。helps 后接宾语 users，再接动词原形 choose，构成 help somebody do something。',
'解析：建议句使用虚拟结构 If I were you, I would + 动词原形，compare 后接 the prices。逗号分隔条件从句和主句。':'解析：建议句使用 If I were you, I would 这一虚拟结构，would 后接动词原形 compare，再接宾语 the prices。逗号分隔条件从句和主句。',
'解析：指定主语 My brother 后接情态结构 cannot + 动词原形 find，再接宾语 the charger。cannot 后不能写 finds 或 to find。':'解析：指定主语 My brother 后接 cannot，再接动词原形 find 和宾语 the charger。cannot 后不能写 finds 或 to find。',
'解析：正确语序是主语 The model + 被动结构 is made + 材料介词 of cardboard。be made of 用于成品仍可看出原材料的情况，不能写成 The model of is made cardboard，也不能漏掉 is 或 of。':'解析：主语 The model 后依次使用被动结构 is made 和表示材料的介词短语 of cardboard。be made of 用于成品仍可看出原材料的情况，不能写成 The model of is made cardboard，也不能漏掉 is 或 of。',
'解析：正确语序是复数主语 The practice data + 原形动词 show + 宾语 an increase + 介词短语 in sales。data 在本句按复数处理，因此不用 shows，固定搭配是 an increase in sales。':'解析：复数主语 The practice data 后依次使用原形动词 show、宾语 an increase 和介词短语 in sales。data 在本句按复数处理，因此不用 shows，固定搭配是 an increase in sales。',
'解析：第一条件句 If + 一般现在时 finish，主句 will watch，逗号分隔前置条件从句。':'解析：这是第一条件句，If 引导的从句使用一般现在时 finish，主句使用 will watch。逗号分隔前置条件从句和主句。',
'解析：结构是 It is + adjective + to-infinitive，listen to 为固定搭配，后接 other people。两个 to 的功能分别是不定式标记和介词。':'解析：It is 后依次使用形容词和 to 不定式。listen to 为固定搭配，后接 other people。两个 to 的功能分别是不定式标记和介词。',
'解析：过去时否定用 did not + 动词原形，不能写 did not liked。':'解析：过去时否定用 did not，后接动词原形，不能写 did not liked。',
'解析：这是询问时间的特殊疑问句：When + does + 主语 the festival + 动词原形 start。用了助动词 does 后，start 不能再加 -s。':'解析：这是询问时间的特殊疑问句。When 后依次使用助动词 does、主语 the festival 和动词原形 start。用了助动词 does 后，start 不能再加 -s。'
};
function clean(value){let s=String(value).replace(/(^|\n)\s*[•·]\s*/g,'$1');
 const leading=s.match(/^\s*/)[0],trailing=s.match(/\s*$/)[0];if(prose[s.trim()])s=leading+prose[s.trim()]+trailing;
 s=s.replace(/(12 Use your notes from Exercise 11\. Write four sentences about your group's ideas to make workers happier\.)\s+We asreed[\s\S]*/g,'$1');
 s=s.replace(/(11 Write four sentences about what your group discussed\.)\s+Two people in m�[\s\S]*/g,'$1');
 s=s.replace(/教材来源\s*[，·]\s*p\./g,'教材来源 p.');
 s=s.replace(/课件第\s*(\d+)\s*\/\s*(\d+)\s*页/g,'课件第 $1 页，共 $2 页');
 s=s.replace(/图句匹配\s*(\d+)\s*\/\s*(\d+)/g,'图句匹配第 $1 组，共 $2 组');
 s=s.replace(/Additional practice\s*(\d+)\s*\/\s*(\d+)/g,'Additional practice $1 of $2');
 s=s.replace(/已配对\s*(\d+)\s*\/\s*(\d+)/g,'已配对 $1 组，共 $2 组');
 s=s.replace(/已揭晓\s*(\d+)\s*\/\s*(\d+)/g,'已显示 $1 题，共 $2 题');
 s=s.replace(/第\s*(\d+)\s*\/\s*(\d+)\s*个词条/g,'正在播放第 $1 个词条，共 $2 个');
 s=s.replace(/\bH([123])\s*[+＋/]\s*H([123])\b/g,'H$1 与 H$2');
 if(cn.test(s)){
  s=s.replace(/\s*[·•]\s*/g,'，').replace(/；/g,'，').replace(/\s*[|｜]\s*/g,'，');
  s=s.replace(/([\u3400-\u9fff])\s*\/\s*(?=[\u3400-\u9fff])/g,'$1、');
  s=s.replace(/([\u3400-\u9fff])\s*\+\s*(?=[\u3400-\u9fff])/g,'$1与');
  s=s.replace(/([\u3400-\u9fff])\s*[—–]\s*(?=[\u3400-\u9fff])/g,'$1，');
  s=s.replace(/LS\s*\/\s*RW/g,'LS 和 RW');
 }else{s=s.replace(/\s*[·•]\s*/g,' ').replace(/\s+[|｜]\s+/g,', ').replace(/\s*—\s*/g,', ').replace(/([0-9A-Z])–([0-9A-Z])/g,'$1 to $2');}
 s=s.replace(/[①-⑳]/g,c=>String(c.charCodeAt(0)-0x2460+1)+'.');
 s=s.replace(/[「」]/g,c=>c==='「'?'“':'”');
 if(!/[★☆]\s*=/.test(s))s=s.replace(/(^|\n)\s*[★☆◆◇▪▸➤]+\s*/g,'$1');
 s=s.replace(/■\s*/g,'');
 if(prose[s.trim()])s=leading+prose[s.trim()]+trailing;
 return s;
}
function icon(kind){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS(svg.namespaceURI,'path');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('class','plain-ui-icon');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.dataset.kind=kind;path.setAttribute('d',paths[kind]);svg.append(path);return svg;}
function textNode(node){const el=node.parentElement;if(!el||el.closest(skip))return;
 let value=clean(node.nodeValue);
 if(el.matches('#unit-page-label,#source-page-label')||el.closest('[data-intro-pager]'))if(/^\s*\d+\s*\/\s*\d+\s*$/.test(value))value=value.replace(/(\d+)\s*\/\s*(\d+)/,'第 $1 页，共 $2 页');
 if(/^(?:\s*)[•·]\s*/.test(value))value=value.replace(/^(\s*)[•·]\s*/,'$1');
 if(el.closest('button,a')&&/[→←↓↑]\s*$/.test(value)&&value.trim().length>1)value=value.replace(/\s*[→←↓↑]\s*$/,'');
 const symbols=/[→←⇒⇢➜➔↓↑✓✔✗✘]|^[\s]*×[\s]*$/g;
 if(symbols.test(value)){
  symbols.lastIndex=0;const fragment=document.createDocumentFragment();let at=0;for(const match of value.matchAll(symbols)){if(match.index>at)fragment.append(document.createTextNode(value.slice(at,match.index)));const c=match[0].trim();fragment.append(icon(/[✓✔]/.test(c)?'check':/[✗✘×]/.test(c)?'cross':c==='←'?'left':c==='↓'?'down':c==='↑'?'up':'right'));at=match.index+match[0].length;}if(at<value.length)fragment.append(document.createTextNode(value.slice(at)));node.replaceWith(fragment);changes++;
 }else if(value!==node.nodeValue){if(el.tagName==='OPTION'&&!el.hasAttribute('value'))el.setAttribute('value',el.value);node.nodeValue=value;changes++;}
}
function polish(root){if(!root||root.nodeType===3){if(root?.isConnected)textNode(root);return;}if(root.nodeType!==1||root.matches(skip))return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(textNode);
 const elements=[root,...root.querySelectorAll('[aria-label],[title],[placeholder]')];for(const el of elements){if(el.closest(skip))continue;for(const attr of ['aria-label','title','placeholder'])if(el.hasAttribute(attr)){const before=el.getAttribute(attr),after=clean(before).replace(/[→←⇒⇢➜➔↓↑]/g,'');if(before!==after)el.setAttribute(attr,after);}}
}
function fitReview(){const U=window.UNLOCK_PLAYER,stage=document.querySelector('.stage'),area=stage?.querySelector(':scope>.ss-body'),review=U?.questionView.isReview();if(stage){stage.classList.toggle('plain-review-gallery',!!review&&location.pathname.endsWith('/B3_LS_U06.html')&&U.state().current===202);stage.classList.toggle('plain-review-outline',!!review&&location.pathname.endsWith('/B3_RW_U05.html')&&U.state().current===202);}if(stage&&!review){stage.classList.remove('plain-fit-review');stage.querySelectorAll(':scope>.plain-review-pages').forEach(n=>n.remove());}if(!area||!window.SCHOOL_SINGLE_SCREEN?.layout)return;
 const previous=reviewFits.get(area);if(!U?.questionView.isReview()){stage.classList.remove('plain-fit-review');if(previous){area.style.cssText=previous.style;area.replaceChildren(...previous.columns.map(c=>c.node));for(const c of previous.columns)c.node.replaceChildren(...c.children);reviewFits.delete(area);}return;}if(previous)return;
 const sr=stage.getBoundingClientRect(),scale=sr.width/1920,children=[...area.querySelectorAll(':scope>.ss-column>.ss-item,:scope>.ss-item')];if(!children.length)return;const end=()=>Math.max(...children.map(n=>(n.getBoundingClientRect().bottom-sr.top)/scale));if(end()<=1034)return;
 const old={style:area.style.cssText,columns:[...area.children].map(node=>({node,children:[...node.children]}))};reviewFits.set(area,old);const header=stage.querySelector(':scope>.ss-header'),items=header?[...header.children].filter(n=>n.textContent.trim()&&n.getClientRects().length):[],top=items.length?Math.ceil(Math.max(...items.map(n=>(n.getBoundingClientRect().bottom-sr.top)/scale)))+28:48;
 area.style.top=top+'px';area.style.height=(1032-top)+'px';stage.classList.add('plain-fit-review');for(const font of [36,34,32]){area.style.setProperty('--plain-review-font',font+'px');SCHOOL_SINGLE_SCREEN.layout(area,children);if(end()<=1034)return;}
 // Long reference panels keep a readable size and expose every part through local pages.
 area.style.height=(970-top)+'px';area.style.gridTemplateColumns='repeat(2,minmax(0,1fr))';area.replaceChildren();const measuring=document.createElement('div');measuring.className='ss-column';area.append(measuring);const groups=[];
 for(const child of children){const tables=[...child.querySelectorAll('table')];if(tables.length===1&&child.querySelector('.ss-node')?.textContent.trim()===tables[0].textContent.trim()&&tables[0].rows.length>2){const rows=[...tables[0].rows],header=rows.shift();for(const row of rows){const g=document.createElement('div'),n=document.createElement('div'),table=tables[0].cloneNode(false);g.className='ss-item';n.className='ss-node';table.append(header.cloneNode(true),row.cloneNode(true));n.append(table);g.append(n);groups.push(g);}}else groups.push(child);}
 function splitLong(group){measuring.append(group);if(group.offsetHeight<=area.clientHeight||group.querySelector('table,img')||group.textContent.length<200)return[group];const copy=group.cloneNode(true),value=copy.textContent,mid=value.lastIndexOf(' ',Math.floor(value.length/2));if(mid<1)return[group];const walk=document.createTreeWalker(copy,NodeFilter.SHOW_TEXT);let at=0,node;while(walk.nextNode()){if(at+walk.currentNode.length>=mid){node=walk.currentNode;break;}at+=walk.currentNode.length;}if(!node)return[group];const range=document.createRange();range.setStart(copy,0);range.setEnd(node,mid-at);const left=copy.cloneNode(false);left.append(range.extractContents());return [...splitLong(left),...splitLong(copy)];}
 const parts=groups.flatMap(splitLong),columns=[[]];let height=0;for(const group of parts){measuring.append(group);const size=group.offsetHeight;if(height&&height+20+size>area.clientHeight){columns.push([]);height=0;}columns.at(-1).push(group);height+=size+(height?20:0);}
 const pages=Array.from({length:Math.ceil(columns.length/2)},(_,i)=>columns.slice(i*2,i*2+2));let page=0;const nav=document.createElement('div');nav.className='plain-review-pages';const prev=document.createElement('button'),label=document.createElement('span'),next=document.createElement('button');prev.type=next.type='button';prev.textContent='上一页';next.textContent='下一页';nav.append(prev,label,next);stage.append(nav);old.nav=nav;
 const show=()=>{area.replaceChildren(...pages[page].map(groups=>{const column=document.createElement('div');column.className='ss-column';column.append(...groups);return column;}));label.textContent='解析第 '+(page+1)+' 页，共 '+pages.length+' 页';prev.disabled=page===0;next.disabled=page===pages.length-1;};prev.onclick=()=>{page--;show();};next.onclick=()=>{page++;show();};show();
}
function flush(root=document.documentElement){if(working)return;working=true;try{studentTasks();polish(root);fitReview();}finally{working=false;}}
const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')pending.add(r.target);else if(r.type==='attributes')pending.add(r.target);else for(const n of r.addedNodes)if(n.nodeType===1||n.nodeType===3)pending.add(n);}const roots=[...pending];pending.clear();for(const root of roots)if(root.isConnected)flush(root);});
observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder']});flush();
window.PLAIN_PRESENTATION_TEXT={clean,flush,stats:()=>({changes}),version:'20261019'};
})();
