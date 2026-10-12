'use strict';
// The response area exists before reveal. Returning to the question restores the same live nodes.
window.SCHOOL_ORIGINAL_TASKS=(()=>{
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function paragraph(host,text){text.split('\n').forEach(line=>host.append(el('p','',line)));}
 function response(host,text,label=false){if(!text)return;const n=el('div','ot-answer');if(label)n.append(el('div','ot-answer-label','Possible answer'));paragraph(n,text);host.append(n);}
 function item(host,text,answer){const row=el('div','ot-row'),match=text.match(/^(\d+|[ab])\s+/),body=el('div','ot-content');row.dataset.originalItem=text;if(match){row.append(el('div','ot-number',match[1]));text=text.slice(match[0].length);}else row.classList.add('ot-unnumbered');
  const frame=answer&&text.includes('...')?text.split('...'):null,escape=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),completed=frame&&new RegExp('^'+frame.map(escape).join('(.+?)')+'$').exec(answer);
  if(completed){const p=el('p');frame.forEach((part,i)=>{p.append(document.createTextNode(part));if(i<frame.length-1){const slot=el('span','ot-slot');slot.append(el('span','ot-placeholder','...'),el('span','ot-answer',completed[i+1]));p.append(slot);}});body.append(p);}
  else if(text.includes('________')&&answer){const parts=text.split('________');paragraph(body,parts[0]);const p=body.lastElementChild,slot=el('span','ot-slot');slot.append(el('span','ot-placeholder','________'),el('span','ot-answer',answer));p.append(slot,document.createTextNode(parts.slice(1).join('________')));}
  else{paragraph(body,text);response(body,answer);}
  row.append(body);host.append(row);
 }
 function prepare(stage,e){const d=e.originalTask;stage.replaceChildren();stage.classList.add('ss-layout','ot-layout');stage.classList.remove('ss-explanation','ss-note-outline');const head=el('div','ss-header'),area=el('div','ss-body ot-body');head.append(el('div','ss-section',e.section),el('div','ss-title',d.title||'POST-'+(e.section.startsWith('READING')?'READING':'LISTENING')),el('div','ss-instruction',e.canonical));stage.append(head,area);if(d.bank){const bank=el('div','ot-aid ot-bank');paragraph(bank,d.bank);area.append(bank);}if(d.aid){const aid=el('div','ot-aid');paragraph(aid,d.aid);area.append(aid);}
  if(d.photos.length){const gallery=el('div','ot-gallery');gallery.dataset.count=d.photos.length;gallery.style.setProperty('--photos',Math.min(4,d.photos.length));for(const p of d.photos){const f=el('figure'),im=el('img');im.src=p.src;im.alt=p.label||'Original textbook photo';im.decoding='async';im.loading='eager';f.append(im);if(p.label&&!p.embeddedLabel)f.append(el('figcaption','',p.label));gallery.append(f);}area.append(gallery);}
  const rows=el('div','ot-rows');if(d.items.length>=4&&!d.items.some(t=>t.length>240))rows.classList.add('ot-two-columns');if(d.items.some(t=>t.startsWith('Student ')))rows.classList.add('ot-two-columns');
  if(d.poster){rows.classList.remove('ot-two-columns');rows.classList.add('ot-poster');const table=el('table');const header=el('tr');header.append(el('th','','If the weather is:'),el('th','','Try doing this:'));table.append(header);d.items.forEach((t,i)=>{const r=el('tr'),q=el('td','',t),a=el('td');if(i===0)paragraph(a,d.answers[i]);else response(a,d.answers[i],false);r.append(q,a);table.append(r);});rows.append(table);}
  else if(d.items.length)d.items.forEach((t,i)=>item(rows,t,d.answers[i]));else{const n=el('div','ot-model');response(n,d.answers.join('\n'));rows.append(n);}area.append(rows);
  if(d.possible)head.append(el('div','ot-answer ot-answer-label','Possible answers'));
  if(d.bold)for(const phrase of d.bold){for(const p of rows.querySelectorAll('p')){const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const t=walker.currentNode,at=t.textContent.indexOf(phrase);if(at<0)continue;const range=document.createRange();range.setStart(t,at);range.setEnd(t,at+phrase.length);const b=el('strong');b.append(range.extractContents());range.insertNode(b);break;}}}
  const footer=el('div','ot-footer','Book p. '+e.book_pages.join(', '));stage.append(footer);stage.dataset.screenTemplate='original-textbook-task';stage.dataset.projectionSelection='complete-original-exercise';stage.dataset.completeExercise=e.id;stage.dataset.questionHeight='1080';stage.dataset.inlinePrepared=e.id;
  return d.answers.filter(Boolean).map((text,i)=>({placement:d.items[i]?.includes('________')?'blank':'associated',text,anchor:String(i+1),source:{method:'original textbook task; model response',exercise:e.id}}));
 }
 function explanations(e){const node=el('div','obj');node.append(el('div','text',e.originalTask.explanation));return [{node,role:'explanation',page:e.pages[0],shape:'original-explanation',labels:['解析']}];}
 return {prepare,explanations};
})();
