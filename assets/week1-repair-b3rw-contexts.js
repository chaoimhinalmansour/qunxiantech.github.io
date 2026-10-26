/* Approved B3 RW carrier repairs: R106-R110, R114-R116. */
(()=>{'use strict';
const unit=window.LESSON?.id;if(!['B3_RW_U04','B3_RW_U05'].includes(unit))return;
const E=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const media='../assets/week1-repair-media/',R=window.CLASSROOM_RESTORE_CASES ||= {},S=window.SCHOOL_STRUCTURE[unit],G=window.SCHOOL_RELATIONS[unit],L=window.LESSON;
function authored(index){
 const p=L.pages.find(p=>p.index===index);if(!p)return '';
 const host=document.createElement('div');host.innerHTML=p.html;
 const hidden=new Set((p.layers||[]).map(x=>String(x.id)));
 const rows=[...host.querySelectorAll(':scope>.obj')].filter(n=>{const y=parseFloat(n.style.top);return y>=200&&y<950&&!n.hidden&&!hidden.has(n.dataset.id)&&!n.hasAttribute('data-action')&&!n.querySelector('img,audio,video,svg,table')&&!/textbook-(secondary|tertiary)/.test(n.dataset.name||'')});
 const n=rows.sort((a,b)=>b.textContent.length-a.textContent.length)[0];if(!n)return '';
 return [...n.querySelectorAll('.text>p')].map(p=>[...p.childNodes].map(c=>{const t=E(c.textContent);return c.nodeType===1&&c.style.fontWeight==='700'&&/7E398A|126,\s*57,\s*138/i.test(c.getAttribute('style')||'')?'<strong>'+t+'</strong>':t}).join('')).join(' ').replace(/\s+/g,' ').trim();
}
const join=ids=>ids.map(authored).filter(Boolean).join(' ').replace(/–without/g,'– without');
const para=(n,ids,heading='')=>({n,html:join(ids),heading});
function titleHTML(title){const t=E(title||'');return title==='Protecting our intangible cultural heritage'?t.replace('intangible','intangible<sup>1</sup>').replace('heritage','heritage<sup>2</sup>'):t}
function photoFigure(meta,n,material=false){
 const attrs=material?' data-week1-figure="true"':'';
 if(meta.photo==='heritage-pair.webp'){
  const panel=n===4?1:0,alt=panel?'A falconer tending a falcon in the desert':'A Jeju Haenyeo woman with a flotation buoy';
  return '<figure'+attrs+' aria-label="'+alt+'"><div class="b3ctx-heritage-frame panel-'+panel+'"><img src="'+media+meta.photo+'" alt="'+alt+'"></div></figure>';
 }
 return '<figure'+attrs+'><img src="'+media+meta.photo+'" alt="'+E(meta.alt||'')+'"></figure>';
}
function article(id,meta,ps){

 if(meta.title==='Protecting our intangible cultural heritage'&&meta.notes?.length){ps[0].notes=meta.notes;ps.slice(1).forEach(p=>p.notes=[])}
 if(meta.page==='107'&&meta.notes?.length){ps[0].notes=meta.notes;ps.slice(1).forEach(p=>p.notes=[])}
 const r=G.resources[id];if(!r||r.__w1Canonical)return;r.__w1Canonical=true;r.originalParts=[...(r.parts||[])];if(meta.title)r.title=meta.title;r.parts=[];
 ps.forEach((p,i)=>{
  const index=L.pages.length+1,label=(p.heading?p.heading+' · ':'')+'Paragraph '+p.n;
  let html=(i===0&&meta.title?'<h2>'+titleHTML(meta.title)+'</h2>'+(meta.author?'<div class="b3ctx-byline">by '+E(meta.author)+'</div>':''):'')+(p.heading?'<h3>'+E(p.heading)+'</h3>':'')+'<p><b class="b3ctx-source-number">'+p.n+'</b> '+p.html+'</p>';
  const localNotes=p.notes||(i===ps.length-1?meta.notes:[]);if(localNotes?.length)html+='<div class="b3ctx-footnotes">'+localNotes.map((v,j)=>'<p>'+(/^<b>\d/.test(v)?'':'<sup>'+(j+1)+'</sup> ')+v+'</p>').join('')+'</div>';
  const picture=(Array.isArray(meta.photoAt)?meta.photoAt.includes(i):i===meta.photoAt)&&meta.photo?'<div class="obj" data-id="w1-photo" style="left:108px;top:760px;width:1704px;height:180px">'+photoFigure(meta,p.n,true)+'</div>':'';
  L.pages.push({index,section:meta.section,title:label,layers:[],html:'<div class="obj" data-id="w1-source-'+index+'" style="left:108px;top:210px;width:1704px;height:530px"><div class="text b3ctx-canonical-source" style="font-size:34px;line-height:1.35">'+html+'</div></div>'+picture});
  S.pageInfo[String(index)]={section:meta.section,title:label,materialLabel:label,bookPage:meta.page};r.parts.push(index);
 });
}
function own(k,s){R[unit+':'+k]=s}
const tableSlot=answer=>'<span class="b3ctx-answer-pair"><span class="b3ctx-blankline" aria-label="answer blank"></span><span class="inline-answer-value">'+E(answer)+'</span></span>';

function readCarrier(ps,meta){
 return {answer:false,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',parts:ps.map((p,i)=>({title:(p.heading||p.contextHeading?((p.heading||p.contextHeading)+' · '):'')+'Paragraph '+p.n,html:()=>{
 const photo=meta.photo&&(!meta.photoParagraphs||meta.photoParagraphs.includes(p.n));
 const notes=p.notes||((meta.theme==='heritage'||meta.theme==='activity')?(i===0?meta.notes||[]:[]):(i===ps.length-1?meta.notes||[]:[]));
 return '<article class="b3ctx-magazine '+(meta.theme||'')+'"><header><h2>'+titleHTML(meta.title)+'</h2>'+(meta.author?'<span>by '+E(meta.author)+'</span>':'')+'</header><div class="b3ctx-magazine-grid '+(photo||p.annotation?'has-photo':'')+'"><section><h3>'+(p.heading||p.contextHeading?E(p.heading||p.contextHeading)+' · ':'')+'Paragraph '+p.n+'</h3><p>'+p.html+'</p>'+(notes.length?'<aside class="b3ctx-inline-footnotes">'+notes.map((x,j)=>'<p>'+(/^<b>\d/.test(x)?'':'<sup>'+(j+1)+'</sup> ')+x+'</p>').join('')+'</aside>':'')+'</section>'+(p.annotation?'<aside class="b3ctx-annotation">'+p.annotation+'</aside>':'')+(photo?photoFigure(meta,p.n):'')+'</div></article>';
 }}))};
}
function nativeTask(k){own(k,{answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',html:api=>'<div class="b3ctx-native-task">'+api.originalHTML+'</div>'})}


/* Ordinary classroom tasks carry their required source on the primary canvas.
   Material side panels are reserved for video and intensive listening. */
function plain(s){return String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
function excerpt(p,patterns){const sentences=p.html.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)||[p.html];const selected=sentences.filter(v=>patterns.some(pattern=>pattern.test(plain(v))));if(!selected.length)throw Error('Missing original excerpt, paragraph '+p.n);return {...p,html:selected.join(' ').trim(),annotation:''}}
function primarySource(p,heading=''){
 const notes=(p.notes||[]).filter(n=>{const term=plain(n).replace(/^\d+\s*/, '').split(/\s*\(/)[0];return plain(p.html).toLowerCase().includes(term.toLowerCase())});
 return '<article class="b3ctx-primary-source"><h3>'+E(heading||p.heading||p.contextHeading||'')+(heading||p.heading||p.contextHeading?' · ':'')+'Paragraph '+p.n+'</h3><p>'+p.html+'</p>'+(notes.length?'<aside class="b3ctx-primary-notes">'+notes.map(n=>'<p>'+n+'</p>').join('')+'</aside>':'')+'</article>';
}
function primaryQuestions(qs){return '<ol class="b3ctx-primary-questions">'+qs.map(([n,q,a])=>'<li><b>'+n+'</b><div><p>'+q+'</p>'+(a?'<div class="b3ctx-primary-feedback">'+a+'</div>':'')+'</div></li>').join('')+'</ol>'}
function primaryParts(parts){return {answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout b3ctx-primary-layout',parts:parts.map(p=>({title:p.title,answer:p.answer,instruction:p.instruction,html:api=>'<div class="b3ctx-primary-shell"><section>'+p.source()+'</section><section class="b3ctx-primary-task">'+p.task(api)+'</section></div>'}))}}

const bank=xs=>'<div class="b3ctx-bank">'+xs.map((v,i)=>'<span data-w1-choice="'+String.fromCodePoint(0x2460+i)+'"><b>'+String.fromCodePoint(0x2460+i)+'</b> '+E(v)+'</span>').join('')+'</div>';
if(unit==='B3_RW_U04'){
 const customs=[para(1,[45,46]),para(2,[47,48],'BRAZIL'),para(3,[49]),para(4,[50]),para(5,[51],'JAPAN'),para(6,[52,53]),para(7,[54],'SAUDI ARABIA'),para(8,[55,56]),para(9,[57])];
 const boldWords=[['cultures','expect'],['gift'],[],['appearance'],['formal'],['exchanged'],['greet'],['relationships'],[]];
 customs.forEach((p,i)=>{for(const w of boldWords[i])p.html=p.html.replace(new RegExp('\\b'+w+'\\b'),'<strong>'+w+'</strong>')});

 const annotate=(p,term,tag)=>p.html=p.html.replace(term,'<'+tag+'>'+term+'</'+tag.split(' ')[0]+'>');
 annotate(customs[0],'foreign travel has become a multi-billion dollar industry.','u');
 annotate(customs[0],'It is very important for travellers to take the time to learn about the cultures they plan to visit so that they know what to <strong>expect</strong> and how to avoid cultural misunderstandings.','mark');
 annotate(customs[0],'three different cultures every month','u');
 for(const term of ['Brazil','Japan','Saudi Arabia'])annotate(customs[0],term,'span class="b3ctx-circled"');
 customs[0].annotation='Why learn about cultures before travel —<br>• know what to expect<br>• avoid misunderstandings';
 annotate(customs[1],'In general, Brazilian culture is informal. Most Brazilians are very friendly people, so it is important to say hello and goodbye to the people you meet.','mark');
 customs[1].annotation='Brazil —<br>friendly;<br>informal;<br>greetings important';
 const customsNotes={2:['<b>1 suspicious</b> (adj) causing a feeling of distrust or that something is wrong'],6:['<b>2 punctual</b> (adj) on time','<b>3 token of your appreciation</b> (n) an inexpensive gift meant to express thanks or gratitude'],7:['<b>4 hierarchy</b> (n) status; a system for organizing people according to their importance']};
 customs.forEach(p=>p.notes=customsNotes[p.n]||[]);
 for(const [n,word,num] of [[2,'suspicious',1],[6,'punctual',2],[6,'token of your appreciation',3],[7,'hierarchy',4]])customs[n-1].html=customs[n-1].html.replace(word,word+'<sup>'+num+'</sup>');
 article('article_417e274c5aaf',{title:'Customs around the world',author:'Andy Schmidt',section:'READING 1',page:'86',photo:'customs-handshake.webp',photoAt:6,alt:'Two businessmen greet each other in Saudi Arabia.',notes:['<b>suspicious</b> (adj) causing a feeling of distrust or that something is wrong','<b>punctual</b> (adj) on time','<b>token of your appreciation</b> (n) an inexpensive gift meant to express thanks or gratitude','<b>hierarchy</b> (n) status; a system for organizing people according to their importance']},customs);
 article('article_230aa760b51a',{title:'Protecting our intangible cultural heritage',author:'Linda Barker',section:'READING 2',page:'91',photo:'heritage-pair.webp',photoAt:[2,3],alt:'Jeju Haenyeo woman diver and a falconer in the desert.',notes:['<b>intangible</b> (adj) something which exists although you cannot touch it','<b>heritage</b> (n) traditions, languages or buildings belonging to the culture of a particular society which were created in the past and still have importance']},[para(1,[136,137]),para(2,[138,139]),para(3,[140,141]),para(4,[142,143]),para(5,[144,145])]);

 customs.forEach(p=>p.contextHeading=p.n>=7?'SAUDI ARABIA':p.n>=5?'JAPAN':p.n>=2?'BRAZIL':'');
 const customsMeta={title:'Customs around the world',author:'Andy Schmidt',theme:'customs',photo:'customs-handshake.webp',photoParagraphs:[7,8,9],alt:'A greeting in Saudi Arabia',notes:['suspicious (adj) causing a feeling of distrust or that something is wrong','punctual (adj) on time','token of your appreciation (n) an inexpensive gift meant to express thanks or gratitude','hierarchy (n) status; a system for organizing people according to their importance']};
 own('409:',readCarrier(customs,customsMeta));
 const heritage=[para(1,[136,137]),para(2,[138,139]),para(3,[140,141]),para(4,[142,143]),para(5,[144,145])];
 own('410:',readCarrier(heritage,{title:'Protecting our intangible cultural heritage',author:'Linda Barker',theme:'heritage',photo:'heritage-pair.webp',photoParagraphs:[3,4],alt:'Jeju Haenyeo and falconry',notes:['intangible (adj) something which exists although you cannot touch it','heritage (n) traditions, languages or buildings belonging to the culture of a particular society which were created in the past and still have importance']}));
 for(const k of ['59:5','92:7','292:8','146:4','159:6'])nativeTask(k);
 const ans=['kiss','shake hands','shake hands','bowing','oldest or most senior','women','men','house','refuse','token of your appreciation','expected','chocolate, coffee or dates','gift','both hands','immediately read it carefully','start','family','health','well','formally','formal','at least 30 minutes late','early','on time'];
 const rows=[
 ['greeting','Women {1} other women & men. Men {2} with other men.','OK to {3}, but {4} is more traditional.','Greet the {5} person first. Women shake hands with {6}, men with {7}.'],
 ['gifts','Bring a gift to someone’s {8}.','Receiving: Common to {9} before you accept.<br>Giving: Say it is just a {10}.','Not {11} at business meetings. Can bring {12}.'],
 ['business behaviour','Do not bring a {13}.','Hand over your business card with {14}. When you receive a business card, {15}.','Do not {16} with business matters immediately. Ask about people’s {17} or {18}.'],
 ['dress/appearance','Dress {19}.','Dress {20}.','Business dress is {21}.'],['punctuality','Arrive {22}.','Arrive {23}.','Arrive {24}.']];
 const table=(data,api)=>'<table class="b3ctx-table b3ctx-customs"><thead><tr>'+['custom/behaviour','Brazil','Japan','Saudi Arabia'].map(v=>'<th>'+v+'</th>').join('')+'</tr></thead><tbody>'+data.map(row=>'<tr>'+row.map((v,i)=>'<'+(i?'td':'th')+'>'+v.replace(/\{(\d+)\}/g,(_,n)=>'<small>('+n+')</small>'+tableSlot(ans[n-1]))+'</'+(i?'td':'th')+'>').join('')+'</tr>').join('')+'</tbody></table>';
 own('73:6',{section:'READING 1',title:'WHILE READING',instruction:'6 Complete the student’s notes with words and phrases from the article.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',parts:[{title:'Greeting and gifts',html:api=>table(rows.slice(0,2),api)},{title:'Business behaviour',html:api=>table(rows.slice(2,3),api)},{title:'Dress and punctuality',html:api=>table(rows.slice(3),api)}]});
 const freq=()=>'<section class="b3ctx-frequency"><p>You can also use adverbs of frequency to avoid absolute statements, that is sentences that imply something is 100 percent true all the time.</p><div class="b3ctx-scale"><div class="b3ctx-endpoints"><b>0%</b><b>100%</b></div><div class="b3ctx-arrow"></div><div class="b3ctx-scale-words">'+[['never'],['seldom','hardly ever','rarely'],['occasionally','sometimes'],['often'],['usually','almost always','normally','frequently'],['always']].map(xs=>'<div>'+xs.map(x=>'<span>'+x+'</span>').join('')+'</div>').join('')+'</div><p class="b3ctx-position">Adverbs go <b>before the main verb</b>, but <b>after the verb <i>to be</i> or a modal verb</b>.</p><div class="b3ctx-examples"><p>In Tokyo, people <strong>usually</strong> <u>go</u> to work by train or bus.</p><p>Formal dinner parties <u>are</u> <strong>often</strong> difficult to organize.</p></div></section>';
 own('174:',{section:'LANGUAGE DEVELOPMENT',title:'ADVERBS OF FREQUENCY TO AVOID ABSOLUTE STATEMENTS',answer:false,explanation:false,layoutClass:'b3ctx-layout',html:freq});
 own('175:3',{section:'LANGUAGE DEVELOPMENT',title:'ADVERBS OF FREQUENCY TO AVOID ABSOLUTE STATEMENTS',instruction:'3 Work with a partner. Make three statements about people from your own culture. Avoid absolute statements by using adverbs from the grammar box.',answer:true,explanation:false,layoutClass:'b3ctx-layout',html:api=>'<div class="b3ctx-grammar-task">'+freq()+'<section class="b3ctx-three-statements">'+['In my community, families usually meet for important celebrations.','People often greet neighbours when they meet.','Visitors sometimes bring a small gift when they visit a friend.'].map((a,i)=>'<p><b>'+(i+1)+'.</b> '+tableSlot(a)+'</p>').join('')+'</section></div>'});
 const synonyms=[['The business meeting was <b>short</b>, and we went straight to the reception for our overseas visitors.','brief'],['The loss of our cultural heritage is a <b>bad</b> problem.','serious'],['In many cultures, parents and their married children live in <b>different</b> houses.','separate'],['The ICH list has played a very <b>big</b> part in protecting cultural traditions.','huge'],['Some customs and traditions are not <b>clear</b> to people who are visiting a country for the first time.','obvious']];
 own('178:4',{section:'LANGUAGE DEVELOPMENT',title:'SYNONYMS TO AVOID REPETITION',instruction:'4 Replace the words in bold with the synonyms in the box.',answer:true,layoutClass:'b3ctx-layout',html:api=>bank(['brief','huge','obvious','separate','serious'])+'<ol class="b3ctx-synonyms">'+synonyms.map(([q,a])=>'<li>'+q+' '+tableSlot(a)+'</li>').join('')+'</ol>'});

 /* R106: each reading task now has its original paragraphs and complete
    comparison set on the slide, rather than behind a Material button. */
 const customsOptions=['greetings','personal space','giving gifts','business meetings','table manners','giving business cards'];
 const customsTask=()=>'<ol class="b3ctx-primary-options">'+customsOptions.map((v,i)=>'<li'+(i===4?' class="b3ctx-primary-correct"':'')+'><b>'+String.fromCharCode(97+i)+'</b> '+E(v)+'</li>').join('')+'</ol>';
 own('59:5',primaryParts(customs.map(p=>({title:(p.contextHeading?p.contextHeading+' · ':'')+'Paragraph '+p.n,answer:p.n===9,source:()=>primarySource(p),task:customsTask}))));
 const inference=[
  {title:'Brazil · Questions 1–2',p:customs[1],qs:[[1,'In Brazil, why would people probably be suspicious of an expensive gift?','They might think the giver expects a favour or is trying to influence them.'],[2,"Why shouldn’t you move away if Brazilians touch you during conversation?",'Touching may signal friendliness, so moving away could seem unfriendly.']]},
  {title:'Japan · Question 3',p:customs[5],qs:[[3,'Why would Japanese business people want to know your position in a company?','Their behaviour may depend on your status in the company.']]},
  {title:'Saudi Arabia · Question 4',p:customs[6],qs:[[4,'What could be the reason why it is important to greet the oldest person first in Saudi Arabia?','Age may be linked to respect and social importance.']]},
  {title:'Cultural misunderstandings · Question 5',p:customs[0],qs:[[5,'What can be the negative result of a cultural misunderstanding?','Someone may feel offended, and a personal or business relationship may suffer.']]}
 ];
 own('92:7',primaryParts(inference.map(v=>({title:v.title,source:()=>primarySource(v.p),task:()=>primaryQuestions(v.qs)}))));
 const mainIdeas=[
  'Falconry is a cultural practice that has been popular in many countries, but cities are taking over the birds’ habitats.',
  'South Korea has many cultural traditions, and diving on Jeju is one of the most important.',
  'Diving has a long tradition in this country, but young people are not learning this skill.',
  'The ICH was established to protect cultural traditions that are in danger.',
  'The value and fairness of the ICH list is not always clear.',
  'Falconry takes a great deal of practice and discipline, but it is popular around the world.'
 ];
 const ideaTask=(current)=>'<ol class="b3ctx-primary-options b3ctx-heritage-options">'+mainIdeas.map((v,i)=>'<li><b>'+String.fromCharCode(97+i)+'</b><span>'+E(v)+'</span></li>').join('')+'</ol>';
 own('146:4',primaryParts(heritage.slice(1).map(p=>({title:'Paragraph '+p.n,source:()=>primarySource(p).replace('</h3>',' '+tableSlot(['d','c','a','e'][p.n-2])+'</h3>'),task:()=>ideaTask(p.n)}))));
 const trueFalse=[
  {p:heritage[0],title:'Paragraph 1 · Statement 1',qs:[[1,'The Great Barrier Reef is an example of intangible cultural heritage. '+tableSlot('F'),'It is a World Heritage Site, a physical place, not an intangible practice.']]},
  {p:heritage[2],title:'Paragraph 3 · Statements 2–3',qs:[[2,'The women divers of Jeju Island can hold their breath for three minutes. '+tableSlot('F'),'They hold their breath for about one minute per dive.'],[3,'Most younger women are not interested in becoming divers. '+tableSlot('T'),'Younger women have not stepped in to replace the older divers.']]},
  {p:heritage[3],title:'Paragraph 4 · Statements 4–5',qs:[[4,'There is a falcon hospital in the United Arab Emirates. '+tableSlot('T'),"The UAE is home to the world’s first falcon hospital."],[5,'Only a few falcon habitats remain in the world. '+tableSlot('DNS'),'The text says habitats are being lost, but gives no number or proportion remaining.']]}
 ];
 own('159:6',{...primaryParts(trueFalse.map(v=>({title:v.title,source:()=>primarySource(v.p),task:()=>primaryQuestions(v.qs).replace(/<\/p>/g,'</p><span class="b3ctx-correction-line" aria-label="Correction if needed"></span>')}))),section:'READING 2',title:'WHILE READING',instruction:'6 Read the essay again. Write T (true), F (false), or DNS (does not say) next to the statements below. Correct the false statements.'});
 const synthesis=[[1,'Can local customs and practices compete with globalization?',''],[2,'In a globalized world, which customs are most likely to survive and which will probably disappear?',''],[3,'Think of a cultural practice in your country. What can the government do to protect it? Why is it important to protect it?','']];
 own('292:8',{...readCarrier(customs,customsMeta),section:'READING 1',title:'DISCUSSION',instruction:'8 Work with a partner. Discuss the question. Which of the customs in the article surprised you the most?',explanation:false});
 /* R107: five teaching steps.  Every step has three exact source excerpts
    followed by the corresponding original four-column note row. */
 const topics=[
  {title:'Greeting',row:0,sources:[excerpt(customs[1],[/Normally women kiss/]),excerpt(customs[4],[/shake your hand/,/bowing/]),excerpt(customs[6],[/greet the oldest/,/Men may shake hands/,/Men and women/])]},
  {title:'Gifts',row:1,sources:[customs[2],excerpt(customs[5],[/Gifts are often exchanged/,/do the same if you receive/,/token of your appreciation/]),customs[8]]},
  {title:'Business behaviour',row:2,sources:[excerpt(customs[1],[/business meeting/,/expensive gift/]),excerpt(customs[5],[/In a business meeting/,/business card/]),excerpt(customs[7],[/Personal relationships/,/do not start with business/,/Instead, start/])]},
  {title:'Dress and appearance',row:3,sources:[customs[3],excerpt(customs[5],[/dress formally/]),excerpt(customs[7],[/Business dress/,/Men should wear/])]},
  {title:'Punctuality',row:4,sources:[customs[3],excerpt(customs[5],[/punctual/,/arrive early/]),excerpt(customs[7],[/Arrive on time/,/Punctuality/])]}
 ];
 own('73:6',{section:'READING 1',title:'WHILE READING',instruction:'6 Complete the student’s notes with words and phrases from the article.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout b3ctx-primary-layout',parts:topics.map(v=>({title:v.title,html:api=>'<div class="b3ctx-primary-table"><div class="b3ctx-culture-excerpts">'+v.sources.map((p,i)=>primarySource(p,['Brazil','Japan','Saudi Arabia'][i])).join('')+'</div>'+table([rows[v.row]],api)+'</div>'}))});

}
if(unit==='B3_RW_U05'){
 const active=[para(1,[42,43]),para(2,[44,45]),para(3,[46,47]),para(4,[48,49,50]),para(5,[51,52])];
 article('article_bc6f7ace5039',{section:'READING 1',page:'107',photo:'exercise-mountains.webp',photoAt:0,alt:'A runner on a trail in a mountain landscape.',notes:['<b>chronic disease</b> (n) an illness that lasts a long time','<b>diabetes</b> (n) a disease in which the body is not able to use sugar efficiently','<b>stroke</b> (n) a medical condition in which blood cannot reach the brain and the brain becomes damaged','<b>life expectancy</b> (n) the number of years that a person can expect to live']},active);

 own('345:',readCarrier(active,{title:'',theme:'activity',photo:'exercise-mountains.webp',photoParagraphs:[1,5],alt:'A runner in the mountains',notes:['chronic disease (n) an illness that lasts a long time','diabetes (n) a disease in which the body is not able to use sugar efficiently','stroke (n) a medical condition in which blood cannot reach the brain and the brain becomes damaged','life expectancy (n) the number of years that a person can expect to live']}));
 for(const k of ['55:3','68:5','80:6'])nativeTask(k);
 const obesity=[para(1,[108,109]),para(2,[115,116,117]),para(3,[118,119,120])];

 obesity[1].html=obesity[1].html.replace(/<\/?strong>/g,'');
 for(const word of ['portions','balanced diet','nutritional'])obesity[1].html=obesity[1].html.replace(word,'<strong>'+word+'</strong>');
 obesity[2].html=obesity[2].html.replace(/<\/?strong>/g,'').replace('obesity','<strong>obesity</strong>').replace('Such campaigns','Such <strong>campaigns</strong>').replace('junk food','<strong>junk food</strong>');

 obesity.push({n:4,html:'In conclusion, there are strong arguments for (1) __________ and (2) __________ taking increased responsibility for tackling the obesity crisis. In my opinion, both parties have a role to play in dealing with this global problem. Governments should pass new (3) __________ and provide education to encourage people to choose healthier lifestyles. At the same time, individuals have to take more (4) __________ for their meal choices and choose healthier foods and smaller portions. If we really wish to see an end to the problem of (5) __________ in the future, individuals and governments must both take action.'});
 article('article_7ea9ea341e57',{title:'World Health Organization warns about the increase in obesity',section:'READING 2',page:'109–112',photo:'obesity-scale.webp',photoAt:0,alt:'A person in striped socks stands on a bathroom scale.'},obesity);
 own('346:',readCarrier(obesity.slice(0,3),{title:'World Health Organization warns about the increase in obesity',theme:'obesity',photo:'obesity-scale.webp',photoParagraphs:[1],alt:'A person standing on a bathroom scale'}));
 const roles='<div class="b3ctx-roles"><p><b>Student A:</b> Read Paragraph 2 aloud for Student B.</p><p><b>Student B:</b> Take notes on Paragraph 2. Write down main ideas and details, using headings and bullet points. Ask Student A to spell or repeat any words that you don’t understand.</p><p><b>Change roles.</b> Student B reads Paragraph 3 and Student A takes notes.</p></div>';
 own('114:3',{section:'READING 2',title:'WHILE READING',instruction:'3 You will now read two body paragraphs from the news report about the problem of obesity. Work in pairs, A and B.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',parts:obesity.slice(1,3).map(p=>({title:'Paragraph '+p.n+' · Read and take notes',html:api=>'<div class="b3ctx-reading-notes"><article class="b3ctx-obesity"><h2>Paragraph '+p.n+'</h2><p>'+p.html+'</p></article><aside class="b3ctx-notes"><h3>Notes</h3>'+roles+'<div class="b3ctx-writing-lines"></div><div class="inline-answer-value"><b>Possible notes</b><p>'+(p.n===2?'Individuals — control portions; eat a balanced diet; read food labels; exercise.':'Governments — require food information; menu calorie and cholesterol counts; tax high-fat and high-sugar food; educational campaigns.')+'</p></div></aside></div>'}))});
 const details=[['read nutritional information on food packaging','Information can help people make intelligent food choices.','R'],['eat a balanced diet','Healthy diet = 50% fruit and veg; 30% carbs; 15% protein; 5% dairy','E'],['put a tax on foods which are high in fat and sugar','Makes junk food too expensive to buy in large quantities.','R'],['control portion size','Average man needs around 2,500 calories per day. Average woman requires around 2,000.','F'],['do exercise','Exercise burns calories.','R']];
 const detailTable=(api,ex)=>'<table class="b3ctx-table b3ctx-supporting"><thead><tr><th>measures</th><th>supporting detail</th></tr></thead><tbody>'+details.map(([m,d,a],i)=>'<tr><td><b>'+(i+1)+'</b> '+(i===3?E(m):tableSlot(m))+'</td><td>'+E(d)+' '+(i===3?'<b class="b3ctx-given">F</b>':ex===7?tableSlot(a):'<span class="b3ctx-later-blank">______</span>')+'</td></tr>').join('')+'</tbody></table>';
 own('132:6',{section:'READING 2',title:'WHILE READING',instruction:'6 Look at the supporting details in the table below and write the measures from Exercise 5 next to the details which support them.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',html:api=>detailTable(api,6)});
 own('137:7',{section:'READING 2',title:'WHILE READING',instruction:'7 Work with a partner. Which kinds of details does the author use to support the arguments in paragraphs 2 and 3? Write F (fact), E (example) or R (reason) next to the supporting details in the table above.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',html:api=>detailTable(api,7)});

 const photoPage=L.pages.find(p=>p.index===33),photos=[...new Set([...(photoPage?.html||'').matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]))].slice(0,8);
 own('229:7',{section:'READING 1',title:'DISCUSSION',instruction:'7 Work with a partner. Discuss the questions.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',html:api=>'<div class="b3ctx-photo-discussion"><div class="b3ctx-activity-photos">'+photos.map((src,i)=>'<figure><img src="'+E(src)+'" alt="Activity '+String.fromCharCode(97+i)+'"><figcaption>'+String.fromCharCode(97+i)+'</figcaption></figure>').join('')+'</div><ol class="b3ctx-photo-questions"><li>Look at the photos on page 106. Do you do any of these activities?<div class="inline-answer-value"><b>Possible answer:</b> I often walk and cycle. I sometimes go swimming.</div></li><li>Which activities are the best exercise? Which are the most fun?<div class="inline-answer-value"><b>Possible answer:</b> I think swimming is good exercise. I enjoy cycling with friends.</div></li></ol></div>'});


 /* R114: task-specific primary-canvas reading steps. */
 const titleOptions=['Get some exercise and lose weight at the same time!','Walking to improve your health and mood.','Keep fit! It’s easier than you might think.'];
 const titleTask=()=>'<ol class="b3ctx-primary-options">'+titleOptions.map((v,i)=>'<li'+(i===2?' class="b3ctx-primary-correct"':'')+'><b>'+String.fromCharCode(97+i)+'</b> '+E(v)+'</li>').join('')+'</ol>';
 own('55:3',primaryParts(active.map(p=>({title:'Paragraph '+p.n,answer:p.n===5,source:()=>primarySource(p),task:titleTask}))));
 const detailQs=[
  [[1,'Which four medical problems can be avoided with regular exercise?','Heart disease, type 2 diabetes, stroke and some cancers.']],
  [[2,'How much time do some adults spend each day sitting down?','Seven hours or more.']],
  [[3,'What do team sport players share the cost of?','The field or court.'],[4,'When should you book a racquetball court for cheap rates?','At off-peak times.']],
  [[5,'What equipment do you need for running?','A pair of running shoes.'],[6,'Where should you go to exercise and spend time with your family?','The park.']]
 ];
 own('68:5',primaryParts(active.slice(0,4).map((p,i)=>({title:'Paragraph '+p.n+' · '+(i<2?'Question '+(i+1):i===2?'Questions 3–4':'Questions 5–6'),source:()=>primarySource(p),task:()=>primaryQuestions(detailQs[i])}))));
 own('80:6',primaryParts([{title:'Paragraph 1 · Making inferences',source:()=>primarySource(active[0]),task:()=>primaryQuestions([['','How do you think exercise improves self-esteem?','Exercise can improve self-esteem by helping people stay fit, feel stronger and experience a sense of achievement.']])}]));
 /* R115: the earlier measures are completed context for the F/E/R task.
    No article side panel is needed to classify the five supplied details. */
 const primaryDetailTable=(ex)=>'<table class="b3ctx-table b3ctx-supporting"><thead><tr><th>measures</th><th>supporting detail</th></tr></thead><tbody>'+details.map(([m,d,a],i)=>'<tr><td><b>'+(i+1)+'</b> '+(ex===7||i===3?E(m):tableSlot(m))+'</td><td>'+E(d)+' '+(i===3?'<b class="b3ctx-given">F</b>':ex===7?tableSlot(a):'')+'</td></tr>').join('')+'</tbody></table>';
 own('132:6',{section:'READING 2',title:'WHILE READING',instruction:'6 Look at the supporting details in the table below and write the measures from Exercise 5 next to the details which support them.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',html:()=>'<div class="b3ctx-measures-bank"><b>Measures from Exercise 5</b>'+bank(details.map(r=>r[0]))+'</div>'+primaryDetailTable(6)});
 own('137:7',{section:'READING 2',title:'WHILE READING',instruction:'7 Work with a partner. Which kinds of details does the author use to support the arguments in paragraphs 2 and 3? Write F (fact), E (example) or R (reason) next to the supporting details in the table above.',answer:true,keepMaterial:false,singleCanvas:true,layoutClass:'b3ctx-layout',html:()=>primaryDetailTable(7)});
 for(const k of ['114:3','229:7']){R[unit+':'+k].keepMaterial=false;R[unit+':'+k].singleCanvas=true}

}
window.B3_RW_WEEK1_CONTEXTS={version:'20261026-primary-canvas-4',issues:['R106','R107','R108','R109','R110','R114','R115','R116'],canonicalArticles:Object.values(G.resources).filter(r=>r.__w1Canonical).map(r=>({id:r.id,parts:r.parts.length}))};
})();
