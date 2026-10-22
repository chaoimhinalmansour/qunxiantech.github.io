/* Consistent teaching references and blank fields; content and existing reveal controls are preserved. */
(()=>{'use strict';
const VERSION='20261022-visual-4',SELECTOR='.inline-answer-slot,.scene-blank,.ot-slot,.group-answer',structured='.ss-definition-content,.scene-def-answer,.ss-key-content,.ss-judgement-mark,.fmt-judgement-key,.fmt-end-key,.textbook-shark-question,.textbook-turn-workspace,.fmt-blank-row,.fmt-tree-leaf,.fmt-cycle-node,.fmt-chain-node,.scene-map-art,.scene-map-leaves,.scene-idea-leaf',prefix='.fmt-prefix-word,.fmt-prefix-slot,.fmt-prefix-complete';
let pending=false,stage=null,working=false;const refitted=new WeakSet();
const compact=t=>(t||'').replace(/\s+/g,' ').trim();
const measure=document.createElement('canvas').getContext('2d');
function classify(answer,node){const t=compact(answer),words=t.split(/\s+/).length;if(/^[a-z]$/i.test(t))return'letter';if(/^(?:true|false|not given|yes|no|does not say|dns|ng|t|f)$/i.test(t))return'choice';if(/^[\d.,%+−–-]+$/.test(t)&&t.length<=8)return'number';if(!t)return'word';if(words>6)return'sentence';const cs=getComputedStyle(node);measure.font='700 36px '+cs.fontFamily;const needed=measure.measureText(t).width/36+.4,min=words===1?0:words<=3?1:2,bands=[['word',6.5],['short',9],['phrase',14],['longphrase',22]];return bands.find((b,i)=>i>=min&&b[1]>=needed)?.[0]||'sentence';}
function slot(node){
 if(node.closest(prefix))return;
 const value=node.querySelector(':scope>.inline-answer-value,:scope>.scene-answer,:scope>.ot-answer,:scope>.group-value'),text=value?.textContent||'',kind=classify(text,node),cell=node.closest('td,th,.ss-numbered-content,.ss-numbered-row'),outside=cell?.cloneNode(true);if(outside)outside.querySelectorAll('.inline-answer-slot,.scene-blank,.ot-slot,.group-answer').forEach(n=>n.remove());const type=cell&&(!compact(outside.textContent)||/^(?:\d{1,2}|[a-z])[.)]?$/.test(compact(outside.textContent)))?(cell.matches('td,th')?'cell':'field'):node.closest(structured)?'field':node.classList.contains('fmt-line-only')||kind==='sentence'?'line':'inline';
 if(node.dataset.blankStandard===VERSION&&node.dataset.blankKind===kind&&node.dataset.blankContext===type)return;
 node.dataset.blankStandard=VERSION;node.dataset.blankKind=kind;node.dataset.blankContext=type;
 if(type==='inline'&&!node.parentElement.classList.contains('input-blank-tail')){
  const previous=node.previousSibling,next=node.nextSibling,lead=previous?.nodeType===3?previous.nodeValue.match(/\b(a|an|the|to|of|in|on|at|by|for|from|with|one)[ \t\u00a0]*$/i):null,punct=next?.nodeType===3?next.nodeValue.match(/^\s*([,.;:!?])/):null;
  if(lead||punct){const tail=document.createElement('span');tail.className='input-blank-tail';node.before(tail);if(lead){previous.nodeValue=previous.nodeValue.slice(0,lead.index);tail.append(document.createTextNode(lead[1]+' '));}tail.append(node);if(punct){tail.append(document.createTextNode(punct[1]));next.nodeValue=next.nodeValue.slice(punct[0].length);}}
  else{if(previous?.nodeType===3)previous.nodeValue=previous.nodeValue.replace(/[ \t]+$/,' ');if(next?.nodeType===3)next.nodeValue=next.nodeValue.replace(/^[ \t]+/,' ');}
 }

}
function numberBanks(root){
 for(const bank of root.querySelectorAll('.context-phrase-bank,.uniform-wordbank')){
  if(bank.dataset.inputNumbered||bank.classList.contains('ref-numbered-bank')||bank.classList.contains('ref-original-labels'))continue;
  const items=[...bank.children].filter(n=>n.tagName==='SPAN');if(items.length<2||items.some(n=>n.querySelector('.ref-bank-index,.input-bank-number,b,i')||/^[①-⑳]/.test(compact(n.textContent))))continue;
  const labels=items.map(n=>compact(n.textContent).match(/^([a-z]|\d+)[.)]?\s+\S/i)?.[1]);if(labels.every(Boolean)&&new Set(labels).size===labels.length)continue;
  bank.dataset.inputNumbered='true';bank.classList.add('input-numbered-bank');
  items.forEach((item,i)=>{const marker=document.createElement('span'),copy=document.createElement('span');marker.className='input-bank-number';marker.textContent=String(i+1);marker.setAttribute('aria-hidden','true');copy.className='input-bank-copy';copy.append(...item.childNodes);item.classList.add('input-bank-item');item.append(marker,copy);});
 }
}
function rawBlanks(root){
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(walk.nextNode()){const n=walk.currentNode;if(/_{2,}/.test(n.nodeValue)&&!n.parentElement.closest(SELECTOR+','+prefix+',.std-raw-blank,button,input,textarea,svg,script,style,.ss-header,.ss-instruction,.hw-instruction,.u-task-instruction,.inline-feedback,.inline-answer-value,.inline-correction-value,.inline-table-answer,.u-answer,.u-explanation,[class*="wordbank"],[class*="word-bank"]'))nodes.push(n);}
 for(const node of nodes){const s=node.nodeValue,fragment=document.createDocumentFragment();let at=0;for(const match of s.matchAll(/_{2,}/g)){fragment.append(document.createTextNode(s.slice(at,match.index)));const field=document.createElement('span');field.className='std-raw-blank';const copy=document.createElement('span');copy.className='input-raw-copy';copy.textContent=match[0];field.append(copy);field.dataset.blankKind='word';const cell=node.parentElement.closest('td,th'),cellCopy=cell?.cloneNode(true);if(cellCopy)cellCopy.querySelectorAll('.inline-answer-slot,.scene-blank,.ot-slot,.group-answer').forEach(n=>n.remove());const cellRest=cellCopy?compact(cellCopy.textContent.replace(/_+/g,'')):null,soloCell=cellRest!==null&&(!cellRest||/^(?:\d{1,2}|[a-z])[.)]?$/.test(cellRest));field.dataset.blankContext=soloCell?(cellRest?'numbered-cell':'field'):node.parentElement.closest(structured)?'field':match[0].length>=24&&!s.replace(/[_\s.?!]/g,'').trim()?'line':'inline';fragment.append(field);at=match.index+match[0].length;}fragment.append(document.createTextNode(s.slice(at)));node.replaceWith(fragment);}
}
function prepare(root,raw=false){if(!root)return;if(root.matches?.(SELECTOR))slot(root);root.querySelectorAll?.(SELECTOR).forEach(slot);numberBanks(root);if(raw)rawBlanks(root);}
function joinFormChains(root){for(const cell of root.querySelectorAll('td,th')){const ps=[...cell.querySelectorAll('p')];for(let i=0;i+4<ps.length;i++){if(compact(ps[i+1].textContent)!=='→'||compact(ps[i+3].textContent)!=='→'||!compact(ps[i].textContent)||!compact(ps[i+2].textContent)||!compact(ps[i+4].textContent))continue;for(const p of ps.slice(i+1,i+5)){ps[i].append(document.createTextNode(' '),...p.childNodes);p.remove();}ps[i].classList.add('visual-form-chain');i+=4;}}}
function normalizeRaw(stage){
 if(!stage.querySelector(':scope>.visual-raw-body'))stage.classList.remove('visual-raw-flow');if(!stage.querySelector(':scope>.visual-original-body'))stage.classList.remove('visual-original-layout');
 if(stage.querySelector(':scope>.ss-header')||window.UNLOCK_PLAYER?.state().raw||stage.querySelector('.scene-shell,.u-homework,.lesson-plan,.lesson-transition,.lesson-dictation,.vc-match,.guided-screen,.group-homework'))return false;
 const nodes=[...stage.children].filter(n=>n.matches('.obj')&&!n.hidden&&!/footer/.test(n.className)&&parseFloat(n.style.top)<1000&&(compact(n.textContent)||n.querySelector('img,svg,table')));
 const headNodes=nodes.filter(n=>parseFloat(n.style.top)<165&&!n.querySelector('img,svg,table,button'));
 const title=headNodes.find(n=>[...n.querySelectorAll('[style]')].some(t=>parseFloat(t.style.fontSize)>=40));
 const section=headNodes.find(n=>n!==title&&compact(n.textContent).length<110);
 const bodyNodes=nodes.filter(n=>!headNodes.includes(n));
 if(!title||!section||!bodyNodes.length)return false;
 const illustrated=bodyNodes.some(n=>n.querySelector('img,svg,table,button,audio,video'))||stage.querySelector(':scope>.obj:has(img),:scope>.obj:has(svg)');
 if(illustrated){
  const all=[...stage.children].filter(n=>n.matches('.obj')&&!n.hidden&&!/footer/.test(n.className)&&parseFloat(n.style.top)<1000&&!headNodes.includes(n));if(!all.length)return false;
  const header=document.createElement('header'),body=document.createElement('div'),canvas=document.createElement('div');header.className='ss-header';body.className='ss-body visual-original-body';body.dataset.layoutOwner='visual-preserved';canvas.className='visual-original-canvas';
  for(const [node,role]of [[section,'ss-section'],[title,'ss-title']]){node.classList.add('ss-node',role);node.style.cssText='';header.append(node);}
  for(const node of headNodes.filter(n=>n!==title&&n!==section)){node.classList.add('ss-node','ss-subtitle');node.style.cssText='';header.append(node);}
  all.forEach(joinFormChains);const minY=Math.min(...all.map(n=>parseFloat(n.style.top)||0));let bottom=0;
  for(const node of all){const left=(parseFloat(node.style.left)||0)-108,top=(parseFloat(node.style.top)||0)-minY;node.style.left=left+'px';node.style.top=top+'px';bottom=Math.max(bottom,top+(parseFloat(node.style.height)||0));const text=node.querySelector(':scope>.text');if(text){let previous=null;for(const p of [...text.querySelectorAll(':scope>p')]){if(previous&&!/[.!?:;]$/.test(compact(previous.textContent))&&/^[a-z]/.test(compact(p.textContent))){previous.append(document.createTextNode(' '),...p.childNodes);p.remove();}else previous=p;}}canvas.append(node);}
  canvas.style.height=bottom+'px';body.append(canvas);stage.classList.add('ss-layout','visual-original-layout');stage.append(header,body);const top=header.offsetTop+header.offsetHeight+28;body.style.setProperty('top',top+'px','important');body.style.setProperty('height',(1010-top)+'px','important');stage.dataset.screenTemplate='standard-illustrated-material';return true;
 }

 const header=document.createElement('header'),body=document.createElement('div');header.className='ss-header';body.className='ss-body visual-raw-body';
 for(const [node,role]of [[section,'ss-section'],[title,'ss-title']]){node.classList.add('ss-node',role);node.style.cssText='';header.append(node);}
 for(const node of headNodes.filter(n=>n!==title&&n!==section)){node.classList.add('ss-node','ss-subtitle');node.style.cssText='';header.append(node);}
 const groups=[];for(const node of bodyNodes){node.style.cssText='';node.classList.add('ss-node');const text=node.querySelector(':scope>.text'),lines=text&&[...text.querySelectorAll(':scope>p')];if(lines?.length>1){const paragraph=document.createElement('p');for(const line of lines){if(paragraph.childNodes.length)paragraph.append(document.createTextNode(' '));paragraph.append(...line.childNodes);}text.replaceChildren(paragraph);}const group=document.createElement('section');group.className='ss-item';group.append(node);groups.push(group);}
 stage.classList.add('ss-layout','visual-raw-flow');stage.append(header,body);const top=header.offsetTop+header.offsetHeight+28;body.style.top=top+'px';body.style.height=(1010-top)+'px';window.SCHOOL_SINGLE_SCREEN?.layout(body,groups);stage.dataset.screenTemplate='standard-material-continuation';return true;
}
function fitPreserved(stage){
 const body=stage.querySelector(':scope>.visual-original-body'),canvas=body?.querySelector(':scope>.visual-original-canvas');if(!canvas)return;const height=body.clientHeight-8,width=body.clientWidth;let bottom=0;
 for(const node of canvas.children){
  if(!node.dataset.visualOriginal)node.dataset.visualOriginal=JSON.stringify([parseFloat(node.style.left)||0,parseFloat(node.style.top)||0,parseFloat(node.style.width)||node.offsetWidth,parseFloat(node.style.height)||node.offsetHeight]);
  const [x,y,w,h]=JSON.parse(node.dataset.visualOriginal),graphic=!!node.querySelector('img,svg'),factor=graphic?Math.min(1,width/w,height/h):1;
  node.style.width=Math.min(width,w*factor)+'px';if(graphic)node.style.height=h*factor+'px';else if(node.querySelector('.text,table'))node.style.height='auto';
  const actualHeight=node.offsetHeight,actualWidth=node.offsetWidth;node.style.left=Math.max(0,Math.min(x,width-actualWidth))+'px';node.style.top=Math.max(0,Math.min(y,height-actualHeight))+'px';bottom=Math.max(bottom,parseFloat(node.style.top)+actualHeight);
 }
  const textGroups=[];for(const node of [...canvas.children].filter(n=>n.querySelector('.text')&&!n.querySelector('img,svg,table')&&/[a-zA-Z\u4e00-\u9fff]/.test(n.textContent))){const [x,y,w]=JSON.parse(node.dataset.visualOriginal),group=textGroups.find(g=>Math.abs(g.x-x)<10&&Math.abs(g.w-w)<Math.min(g.w,w)*.2);if(group)group.nodes.push(node);else textGroups.push({x,w,nodes:[node]});}
 for(const group of textGroups){const nodes=group.nodes.sort((a,b)=>JSON.parse(a.dataset.visualOriginal)[1]-JSON.parse(b.dataset.visualOriginal)[1]);let next=height+24;for(let i=nodes.length-1;i>=0;i--){const n=nodes[i],y=JSON.parse(n.dataset.visualOriginal)[1],top=Math.min(y,next-24-n.offsetHeight);n.style.top=Math.max(0,top)+'px';next=top;}if(next<0){let top=0;for(const n of nodes){n.style.top=top+'px';top+=n.offsetHeight+24;}}}
 bottom=Math.max(0,...[...canvas.children].map(n=>(parseFloat(n.style.top)||0)+n.offsetHeight));canvas.style.height=bottom+'px';
}
function apply(){if(working||!stage)return;working=true;try{normalizeRaw(stage);prepare(stage,true);fitPreserved(stage);const body=stage.querySelector(':scope>.ss-body');if(body&&!body.dataset.layoutOwner&&!body.dataset.formatType&&!refitted.has(body)&&body.scrollHeight>body.clientHeight+3&&!window.UNLOCK_PLAYER?.questionView.isReview()){refitted.add(body);window.UNLOCK_PLAYER?.questionView.refitLayout?.();}}finally{working=false;}}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply();});}
window.CLASSROOM_INPUT_STANDARDS={version:VERSION,prepare,slot,apply,schedule};
const timer=setInterval(()=>{if(!window.CLASSROOM_DETAIL_REFINED||!window.UNLOCK_PLAYER)return;clearInterval(timer);stage=document.querySelector('.stage');new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length))schedule();}).observe(stage,{childList:true,subtree:true});window.addEventListener('resize',schedule);apply();},50);
})();
