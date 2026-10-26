/* B2 RW first-week carrier repair.  This file deliberately restores only named,
   source-verified learning situations; it does not append textbook thumbnails. */
(()=>{'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slot=(api,v)=>api.slot(v,'word');
/* The native task already supplies its textbook heading and instruction.  A
   restored carrier provides only the missing learning material and one slot. */
const sentenceSlot=(api,sentence,answer)=>{
 const source=esc(sentence);const inline=slot(api,answer);
 /* Preserve the textbook grammar position: replace only the first authored
    blank.  A fallback is retained solely for source sentences without one. */
 return /_{2,}/.test(source)?source.replace(/_{2,}/,inline):`${source} ${inline}`;
};
function sourceLines(pages){
 const out=[]; for(const page of pages){const html=window.LESSON?.pages?.[page-1]?.html||''; const d=new DOMParser().parseFromString(html,'text/html');
  for(const n of d.querySelectorAll('.text,p,li')){const t=(n.textContent||'').replace(/\s+/g,' ').trim();if(t.length>48&&!/^(UNLOCK|Book \d|Page \d)/.test(t)&&!out.includes(t))out.push(t)}
 } return out;
}
function cleanSourceText(value){return String(value??'').replace(/\s+/g,' ').replace(/([A-Za-z])[-‐]\s+([a-z])/g,'$1$2').trim()}
function sourceInlineHTML(node){
 const walk=el=>{if(el.nodeType===Node.TEXT_NODE)return esc(el.nodeValue||'').replace(/\s+/g,' ');if(el.nodeType!==Node.ELEMENT_NODE)return '';
  if(el.tagName==='BR')return ' ';if(el.tagName==='IMG')return `<img src="${esc(el.getAttribute('src')||'')}" alt="${esc(el.getAttribute('alt')||'')}">`;const body=[...el.childNodes].map(walk).join('');
  const weight=String(el.style?.fontWeight||'');const bold=['B','STRONG'].includes(el.tagName)||Number(weight)>=600||/bold/i.test(weight);
  if(el.tagName==='SUP')return `<sup>${body}</sup>`;return bold?`<strong>${body}</strong>`:body;
 };
 const blocks=[...node.querySelectorAll('.text')];const raw=(blocks.length?blocks:[node]).map(block=>{
  const lines=[...block.querySelectorAll('p')];return lines.length?lines.map(walk).join(' '):walk(block);
 }).join(' ');
 return raw.replace(/\s+/g,' ').replace(/([A-Za-z])[-‐]\s+([a-z])/g,'$1$2').trim();
}
function sourceObjectFragments(page){
 const p=window.UNLOCK_PLAYER?.lesson?.pages?.[page-1];if(!p)return [];
 const div=document.createElement('div');div.innerHTML=p.html;
 const layerIds=new Set((p.layers||[]).map(l=>String(l.id)));
 const nodes=[...div.querySelectorAll(':scope > .obj')].filter(el=>{const y=parseFloat(el.style.top);return !el.hidden&&y>=162&&y<950&&!layerIds.has(el.dataset.id)&&!el.hasAttribute('data-action')&&!el.querySelector('audio,video')&&el.textContent.trim()!=='Play audio'&&!String(p.title||'').split('|').includes(el.textContent.trim())&&el.textContent.trim()!==p.section}).sort((a,b)=>parseFloat(a.style.top)-parseFloat(b.style.top)||parseFloat(a.style.left)-parseFloat(b.style.left));
 return nodes.map(el=>{const text=cleanSourceText(el.textContent);const rich=sourceInlineHTML(el);const graphic=!!el.querySelector('img,svg,table');const heading=!graphic&&text.length<92&&(/^[A-Z][A-Z 0-9:–—-]{5,}$/.test(text)||/^(paragraph|introduction|conclusion)\b/i.test(text));const footnote=!graphic&&text.length<190&&/^(\d+|\*)\s*[A-Za-z]/.test(text);return {text,norm:text.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),graphic,heading,footnote,html:graphic?`<figure class="b2rw-reader-graphic">${rich}</figure>`:`${heading?'<h3>':'<p>'}${rich}${heading?'</h3>':'</p>'}`};});
}
function sourceObjectHTML(page){return sourceObjectFragments(page).map(f=>f.html).join('')}
function readerFragments(pages){
 const unique=[];
 for(const page of pages)for(const f of sourceObjectFragments(page)){
  /* A source image often has no meaningful textContent.  It is nevertheless
     part of the textbook carrier (for example the winter swimmer on p108),
     so it must be kept and de-duplicated by its rendered source, before the
     text-only filters below run. */
  if(f.graphic){
   const graphicKey=(f.html.match(/(?:src|href)="([^"]+)/i)||[])[1]||f.html;
   if(!unique.some(x=>x.graphic&&(((x.html.match(/(?:src|href)="([^"]+)/i)||[])[1]||x.html)===graphicKey)))unique.push({...f,page});
   continue;
  }
  /* Keep real article evidence, not page furniture, section headings, or short task prompts. */
  /* In imported textbook pages bold keywords and the first words of a headline can be individual objects. Keep them: dropping them creates false blanks in the article. */
  if(f.text.length<2||/^(reading|read and listen|critical thinking|vocabulary|language development|preparing to read|while reading|post reading)\b/i.test(f.text)||/^(complete|choose|match|look at|read the|answer the)\b/i.test(f.text))continue;
  const seen=unique.find(x=>!x.graphic&&(x.norm===f.norm||x.norm.includes(f.norm)||f.norm.includes(x.norm)));
  if(!seen)unique.push({...f,page}); else if(f.norm.length>seen.norm.length)Object.assign(seen,{...f,page});
 }
 const merged=[];
 for(const f of unique){const previous=merged.at(-1);const continuation=previous&&!previous.graphic&&!previous.heading&&!previous.footnote&&!f.graphic&&!f.heading&&!f.footnote&&!/[.!?…:]$/.test(previous.text)&&!/^\d+\s/.test(f.text);if(continuation){previous.text=cleanSourceText(`${previous.text} ${f.text}`);previous.norm=previous.text.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();previous.html=`<p>${previous.html.replace(/^<p>|<\/p>$/g,'')} ${f.html.replace(/^<p>|<\/p>$/g,'')}</p>`;previous.page=`${previous.page},${f.page}`}else merged.push({...f})}
 return merged;
}
const wordCount=text=>(String(text).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
function splitLongReaderFragment(fragment,limitWords=200){
 /* Do not fragment a normal textbook paragraph.  Only a genuinely long source
    paragraph receives an explicitly marked continuation at a sentence boundary. */
 if(fragment.graphic||fragment.heading||fragment.footnote||wordCount(fragment.text)<=limitWords)return [{...fragment,words:wordCount(fragment.text)}];
 const sentences=fragment.text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)||[fragment.text];const out=[];let current='';
 for(const sentence of sentences){const next=cleanSourceText(`${current} ${sentence}`);if(current&&wordCount(next)>limitWords){out.push({...fragment,text:current,html:`<p>${esc(current)}</p>`,words:wordCount(current),continuation:out.length>0});current=cleanSourceText(sentence)}else current=next}
 if(current)out.push({...fragment,text:current,html:`<p>${esc(current)}</p>`,words:wordCount(current),continuation:out.length>0});return out;
}
function makeReaderParts(title,pages,display={}){
 const fragments=readerFragments(pages).flatMap(fragment=>splitLongReaderFragment(fragment));let previousNumber='';
 for(const f of fragments){const m=f.text.match(/^(\d+)\s+/);const number=m?.[1]||'';f.display=f.html;if(number&&number===previousNumber){const d=new DOMParser().parseFromString(f.html,'text/html');const walker=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT);const first=walker.nextNode();if(first)first.nodeValue=first.nodeValue.replace(/^\s*\d+\s+/,'');f.display=d.body.innerHTML}if(number)previousNumber=number}
 const groups=[];let current=[],words=0;
 for(const f of fragments){
  const next=words+(f.words??wordCount(f.text));
  /* Keep headings/paragraphs/figures intact.  A standard screen is 160–200
     words; only the original long paragraph splitter can create a continuation. */
  if(current.length&&next>205&&!f.graphic){groups.push(current);current=[];words=0}
  current.push(f);words+=f.words??wordCount(f.text);
  if(words>=160){groups.push(current);current=[];words=0}
 }
 if(current.length)groups.push(current);
 return groups.map((group,i)=>{const continued=group.some(f=>f.continuation);const heading=display.title||title;const subtitle=display.subtitle?`<p class="b2rw-reader-subtitle">${esc(display.subtitle)}${continued?' · continued paragraph':''}</p>`:continued?`<p class="b2rw-reader-subtitle">continued paragraph</p>`:'';return {title:`${heading} · ${i+1} / ${groups.length}`,html:()=>`<section class="b2rw-reader" data-source-pages="${group.map(f=>f.page).join(',')}" aria-label="${esc(heading)}"><header><h2>${esc(heading)}</h2>${subtitle}</header><article>${group.map(f=>f.display).join('')}</article></section>`}});
}
const articlePartCache=new Map;
function articleReaderParts(unit,title,expectedPages,display={}){
 const canonicalPages=[...new Set(expectedPages)].filter(page=>Number.isInteger(page));const cacheKey=`${unit}|${title}|${canonicalPages.join(',')}`;if(articlePartCache.has(cacheKey))return articlePartCache.get(cacheKey);
 const parts=makeReaderParts(title,canonicalPages,display);if(parts.length)articlePartCache.set(cacheKey,parts);return parts;
}
function lazyArticleCase(unit,title,expectedPages,display={}){
 /* Keep the lesson's own reader/audio affordance as well as the restored fixed article carrier. */
 const spec={answer:false,keepMaterial:true};
 Object.defineProperty(spec,'parts',{enumerable:true,get(){return articleReaderParts(unit,title,expectedPages,display)}});
 return spec;
}
/* A normal reading task cannot rely on the Material drawer: the learner needs
   the named text before answering.  These cases retain the authored task as a
   final fixed-canvas step after the source-faithful article pages.  We do not
   copy a thumbnail or manufacture a summary; articleReaderParts keeps the
   lesson's ordered source fragments, paragraph numbers, rich emphasis and any
   source figures. */
function nativeTaskPart(title){return {title:`${title} · task`,html:api=>`<section class="b2rw-linked-reading-task" aria-label="${esc(title)} task"><div class="b2rw-linked-reading-task-native">${api?.originalHTML||''}</div></section>`}}
function linkedArticleTaskCase(unit,title,expectedPages,display={}){
 const spec={answer:true,keepMaterial:false};
 Object.defineProperty(spec,'parts',{enumerable:true,get(){return [...articleReaderParts(unit,title,expectedPages,display),nativeTaskPart(title)]}});
 return spec;
}
/* A normal follow-up exercise needs its evidence and its original choice set
   together.  Unlike linkedArticleTaskCase, this helper deliberately repeats
   the untouched authored task on each genuine paragraph group, so learners
   never have to leave the main canvas to recover the question or its choices. */
function sourceTaskCase(title,groups,display={}){
 return {answer:true,keepMaterial:false,parts:groups.map((pages,index)=>({
  title:`${title} · ${index+1} / ${groups.length}`,
  html:api=>{const content=readerFragments(pages).flatMap(fragment=>splitLongReaderFragment(fragment)).map(fragment=>fragment.display||fragment.html).join('');
   return `<section class="b2rw-source-task" data-source-pages="${pages.join(',')}" aria-label="${esc(title)} evidence and exercise"><header><h2>${esc(display.title||title)}</h2>${display.subtitle?`<p class="b2rw-reader-subtitle">${esc(display.subtitle)}</p>`:''}</header><article>${content}</article><section class="b2rw-source-task-native">${api?.originalHTML||''}</section></section>`;
  }
 }))};
}
function sportingNewsTaskCase(groups){
 return {answer:true,keepMaterial:false,parts:groups.map((pages,index)=>({title:groups.length===1?'Website and questions':pages.length===1?`Paragraph ${pages[0]-34}`:`Paragraphs ${pages[0]-34}–${pages.at(-1)-34}`,html:api=>{
  const content=pages.map(sportingSourceContent).join('');
  return `<section class="b2rw-sporting-news b2rw-sporting-task" data-source-pages="${pages.join(',')}" aria-label="Sporting News article and task"><header><p class="b2rw-sporting-nav">SPORTING <b>NEWS</b> <span>HOME &nbsp; ABOUT &nbsp; <strong>NEWS</strong> &nbsp; CONTACT &nbsp; MORE</span></p><h2>FIVE UNUSUAL SPORTS</h2><p class="b2rw-sporting-subtitle">The most unusual sports from around the world</p></header><article>${content}</article><section class="b2rw-source-task-native">${api?.originalHTML||''}</section></section>`;
 }}))};
}
function toughGuyTaskCase(groups){
 return {answer:true,keepMaterial:false,parts:groups.map((pages,index)=>({title:`TOUGH GUY · task ${index+1} / ${groups.length}`,html:api=>{
  const content=readerFragments(pages).flatMap(fragment=>splitLongReaderFragment(fragment)).map(fragment=>fragment.display||fragment.html).join('');
  return `<section class="b2rw-tough-guy-magazine b2rw-tough-guy-task" data-source-pages="${pages.join(',')}" aria-label="Tough Guy article and task"><header><p>SPORTING NEWS · SPECIAL FEATURE</p><h2>TOUGH GUY:</h2><h3>A race to the limit</h3></header><article>${content}</article><section class="b2rw-source-task-native">${api?.originalHTML||''}</section></section>`;
 }}))};
}
function linkedFeatureTaskCase(title,items,sourcePage){
 const source=featureArticle(title,items,sourcePage);
 return {answer:true,keepMaterial:false,parts:[...source.parts,nativeTaskPart(title)]};
}
function homestayGroupTaskCase(){
 return homestayDetailTask();
}
/* The Sahara graph belongs with the comparison activity, not in a Material
   drawer.  The graph is the original authored chart asset; the caption only
   exposes the printed values that the chart and its source paragraph require. */
function saharaGraphTaskCase(){
 const paragraphTwo=readerFragments([96]).flatMap(fragment=>splitLongReaderFragment(fragment)).map(fragment=>fragment.display||fragment.html).join('');
 /* Exercise 5 needs paragraph 2 and the p103 graph—not a second detached
    copy of the whole article before the matching-halves activity. */
 const graph={title:'Surviving the sea of sand · graph and task',html:api=>`<section class="b2rw-sahara-graph-task" aria-label="Sahara Desert temperature and rainfall graph"><header><h2>Surviving the sea of sand</h2><p>How to stay alive in the Sahara Desert</p></header><article class="b2rw-sahara-required-p2" aria-label="Paragraph 2 required reading evidence">${paragraphTwo}</article><figure><img src="../assets/charts/B2_RW_U04_103_15.png" alt="Sahara Desert temperatures by time of day in degrees Celsius"><figcaption><span><strong>Temperature:</strong> −1 °C at 4 am; 33 °C between 2 pm and 4 pm.</span><span><strong>Annual precipitation:</strong> 70 millimetres.</span></figcaption></figure><section class="b2rw-sahara-questions" aria-label="Exercise 5 match the sentence halves"><ol><li>The coldest time is ${slot(api,'d')}.</li><li>The average amount of rain in a year ${slot(api,'c')}.</li><li>The temperature is 33 °C ${slot(api,'a')}.</li><li>The coldest temperature at night ${slot(api,'b')}.</li></ol><ol class="b2rw-sahara-choices" type="a"><li>between 2 pm and 4 pm.</li><li>is −1 °C.</li><li>is 70 mm.</li><li>at four o’clock in the morning.</li></ol></section></section>`};
 return {answer:true,keepMaterial:false,parts:[graph]};
}
/* The eight Sahara paragraphs are purposefully grouped by reading beat, not
   by the global generic reader budget: two authentic paragraphs at most per
   fixed screen, with a compact repeated source header. */
function saharaFourStepReader(){
 const groups=[[94,96],[97,98],[99,100],[101,102]];
 return {answer:false,keepMaterial:true,parts:groups.map((pages,index)=>({title:`Surviving the sea of sand · ${index+1} / 4`,html:()=>{const fragments=readerFragments(pages).flatMap(fragment=>splitLongReaderFragment(fragment));return `<section class="b2rw-reader b2rw-sahara-reader" data-source-pages="${pages.join(',')}" aria-label="Surviving the sea of sand"><header><h2>Surviving the sea of sand</h2><p class="b2rw-reader-subtitle">How to stay alive in the Sahara Desert</p></header><article>${fragments.map(f=>f.display||f.html).join('')}</article></section>`}}))};
}
function sourceContext(title,pages){
 const lines=sourceLines(pages);
 return `<section class="b2rw-source-context" aria-label="${esc(title)}"><div>${lines.map((p,i)=>`<p><b>${i+1}</b> ${esc(p)}</p>`).join('')}</div></section>`;
}
function sourceObjectContext(title,pages){
 const html=pages.map(sourceObjectHTML).filter(Boolean).join('');
 return `<section class="b2rw-source-context" aria-label="${esc(title)}"><div>${html}</div></section>`;
}
const ben=[
 'Ben Underwood was a normal teenage boy. He loved playing basketball, riding his bike, listening to music with his friends and playing video games. But in one way, Ben was different from most other teenagers – he was blind. However, Ben had a special talent. He didn’t have eyes, but he could still “see”.',
 'Ben was born on 26 January 1992. For the first two years of his life, Ben was a happy and healthy baby. He had a normal life, living with his mother and two older brothers in California. However, when Ben was two years old, his life changed. In 1994, he was taken to hospital because he had problems with his eyes. The doctors told his mother that Ben had cancer. After a few months, he had an operation to remove the cancer. The operation was successful, but the doctors had to remove his eyes and Ben became blind.',
 'After his operation, Ben developed an incredible talent. When he was three, he learnt how to “see” buildings with his ears. He listened very carefully and could hear noises bounce off buildings. Then, when Ben was seven, he learnt to “click”. He made clicking noises with his mouth and listened for the noises that bounced back from things. In this way, Ben could “see” where he was and what was around him.',
 'Scientists and doctors were amazed by Ben’s talent. People respected him and he became famous. Sadly, when Ben was 16, his cancer came back. He died soon after. During his life, he taught people that anything is possible. Many people admired him because he inspired them and helped them feel strong.'
];
function benArticle(part=0){return `<section class="b2rw-blog"><header><div class="b2rw-blog-brand">REAL-LIFE<br>SUPERHEROES</div><p><b>About me</b> · My name is Juliet Selby. I write about people that I admire. I write about a different person every week.</p></header><h2>/2023/ · Ben Underwood</h2><article><p><b>${part+1}</b> ${esc(ben[part])}</p></article><footer>¹ cancer: a serious disease that makes people very sick</footer></section>`}
const videoGames=[
 'Do video games affect our children negatively? Today, our children spend more and more time online. Many children spend a lot of their free time playing video games on the internet, on game systems or on their mobile devices. In the UK, 99% of kids aged 8 to 15 play video games every week, and children as young as five play video games regularly. This information tells us that the benefits and dangers of video games must be carefully considered.',
 'For many people, video games are fun and educational. They have bright lights, funny cartoons and exciting stories. Everywhere you look, you can see children playing these video games. They play on buses and trains, in restaurants and even at school. Video games also make you think in a creative way and you have to move your hands and eyes quickly. This can improve the way that a child’s brain works. Video games also make children use their imagination. The player has to do many creative things, like draw, tell stories and build things. Video games are also a good way to teach children about technology because they can learn how computers and other devices work while they play.',
 'However, a recent study suggests that video games can also be bad for children. First, children can download many video games for free. They don’t need money, so they don’t need to ask their parents if they can download the video games. This means that parents often don’t know if their children are playing violent or scary video games. Second, many children spend too much time playing video games on computers, smartphones and tablets and this can lead to health problems – children who spend too much time on the computer and don’t exercise can become overweight. Third, if children spend too much time playing video games instead of doing homework, they can have problems at school and get bad grades. Finally, video games can affect children’s social skills. Playing and working with friends is very important for children and it teaches them how to talk to other people. If children spend too much time playing video games by themselves, they might not learn how to play with their friends.',
 'In conclusion, it seems clear that video games have some advantages and some disadvantages. On the one hand, they are fun and have many educational benefits for children. On the other hand, they can cause problems with children’s health and social skills. It is up to parents to know what video games their children are playing and how much time they spend on them. Parents should also make sure their children get enough exercise and spend time with other children.'
];
function videoGamesCarrier(){return {parts:videoGames.map((text,i)=>({title:`VIDEO GAMES · ${i+1} / 4`,html:()=>`<section class="b2rw-reader" aria-label="VIDEO GAMES"><header><small>READ AND LISTEN · textbook reading</small><h2>VIDEO GAMES</h2></header><article><p class="b2rw-reader-text"><b>${i+1}</b> ${esc(text)}</p></article></section>`})),answer:false}}
function videoGamesFollowUp(exercise){const task=exercise===3
 ?{title:'Work with a partner',body:'Read the essay. Student A: underline the advantages of the hobby. Student B: underline the disadvantages.'}
 :{title:'Work with a partner',body:'Follow the instructions below.',steps:['Read the first paragraph in the essay. Then write questions or comments about the information in the paragraph using the example language below.','Before moving on to the next paragraph, discuss your questions and comments with another pair.','Repeat with the next paragraph.'],example:'Why / What / Where / How ...?'};
 return {parts:videoGames.map((text,i)=>{const fullGuide=i===0;const repeatedGuide=exercise===3?'Student A: underline the advantages. Student B: underline the disadvantages.':'Read this paragraph; then discuss questions or comments about it with another pair.';return {title:`VIDEO GAMES · ${i+1} / 4`,html:()=>`<section class="b2rw-guided-reading" aria-label="VIDEO GAMES · task and paragraph ${i+1}"><header><small>READING 2 · TASK ${exercise}</small><h2>${task.title}</h2><p>${fullGuide?task.body:repeatedGuide}</p>${fullGuide&&task.steps?`<ol>${task.steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol><p class="b2rw-example-language"><b>Example language:</b> ${esc(task.example)}</p>`:''}</header><article><h3>VIDEO GAMES · Paragraph ${i+1}</h3><p><b>${i+1}</b> ${esc(text)}</p></article></section>`}}),answer:false};}
function benReference(){return `<aside class="b2rw-reference"><strong>Ben Underwood · reading map</strong><ol>${ben.map((p,i)=>`<li><b>${i+1}</b> ${esc(p.slice(0,118))}…</li>`).join('')}</ol></aside>`}
const profiles=[
 ['JACK DORSEY','I really admire Jack Dorsey, the former CEO of Twitter (now X). He invented a new kind of social networking site. In 2016 he gave almost one third of his shares in Twitter to his employees. I respect him because he changed the way people use social media all over the world.'],
 ['MARY EVANS','My mum, Mary Evans, is my role model. She worked very hard every day to look after our big family. She always makes time for everyone and listens if I have a problem. I respect her because she makes sure our family has everything we need.'],
 ['ENGLAND WOMEN’S NATIONAL FOOTBALL TEAM','My role models are the Lionesses. In 2022 they won the European Women’s Championship. The team were trained by Sarina Wiegman. They worked hard every day for their dream, so I really admire them.'],
 ['GRETA THUNBERG','Greta Thunberg is a brave young woman from Sweden. In 2018, aged 15, she protested outside the Swedish parliament for climate change. In 2019, four million people went on strike after listening to her speeches. She is brave and never gives up.']
];
function profile(i){const [name,text]=profiles[i];return `<section class="b2rw-profile"><article><h2>${name}</h2><p>${esc(text)}</p></article><aside>Take notes: person · key event · evidence of character</aside></section>`}
function u7Definitions(api){const words=['blind','incredible','inspire','operation','respect','talent'];const ds=['blind — not able to see','incredible — impossible or very difficult to believe; amazing','inspire — make other people want to do something','operation — when doctors cut your body to repair or remove something','respect — have a very good opinion of somebody','talent — a natural ability to do something well'];const qs=['After the ____ on his foot, Alex had to stay in hospital.','It is ____ to think that Liz was homeless only a few years ago.','Julia was ____ when she was born.','Fernanda had a special ____ for the piano.','I really ____ Mahatma Gandhi.','Having more women CEOs will ____ young girls.'];return `<section class="b2rw-definition-task"><aside class="b2rw-choice-bank" aria-label="Word bank">${words.map((w,i)=>`<span><b>${i+1}</b> ${esc(w)}</span>`).join('')}</aside><div>${ds.map((x,i)=>`<p><b>${i+1}</b> ${esc(x)}</p>`).join('')}</div><ol>${qs.map((q,i)=>`<li>${sentenceSlot(api,q,['operation','incredible','blind','talent','respect','inspire'][i])}</li>`).join('')}</ol></section>`}
/* Textbook p158, Exercise 4: preserve the complete two-person conversation
   and both labelled photo roles, rather than leaving Lucy in Material.  The
   two figure classes deliberately give the stylesheet a source-asset hook. */
function peoplePhotoConversation(){return {answer:true,keepMaterial:false,html:api=>{const doc=new DOMParser().parseFromString(api?.originalHTML||'','text/html');const images=[...doc.querySelectorAll('img')].slice(0,2).map(image=>({src:image.getAttribute('src')||'',alt:image.getAttribute('alt')||''}));const photo=(index,role,answer)=>`<figure class="b2rw-person-photo ${role}">${images[index]?.src?`<img src="${esc(images[index].src)}" alt="${esc(images[index].alt||'Source exercise photo')}">`:''}<figcaption><b>${index===0?'a':'b'}</b> ${slot(api,answer)}</figcaption></figure>`;return `<section class="b2rw-people-photo-conversation" aria-label="Adjectives to describe people"><div class="b2rw-people-photo-grid">${photo(0,'b2rw-lucy-photo','Lucy')}${photo(1,'b2rw-rebekah-photo','Rebekah')}</div><section class="b2rw-people-dialogue"><p><b>Susan:</b> Tell me about your two sisters.</p><p><b>Megan:</b> Well, Rebekah is very <strong>confident</strong> and makes new friends easily. She’s always chatting to them on her smartphone. She can be a bit <strong>lazy</strong> and doesn’t help around the house, so I usually do her jobs for her.</p><p><b>Susan:</b> What about your other sister?</p><p><b>Megan:</b> That’s Lucy. She’s very different. Lucy is quite <strong>shy</strong> and finds it hard to talk to people. She’s very <strong>clever</strong>, though – she’s the best in her class at Maths and Science. She’s a very <strong>talented</strong> singer, too. She even writes her own songs.</p></section></section>`}};}
function newYearVocabulary(){const entries=[['crowds of people','large groups of people in one place'],['fireworks','bright, noisy lights in the sky'],['midnight','twelve o’clock at night'],['parties','celebrations where people meet, eat or dance'],['processions','organized groups of people moving through a street']];return `<section class="b2rw-definition-task b2rw-new-year"><aside class="b2rw-choice-bank" aria-label="Word bank">${entries.map(([word],i)=>`<span><b>${i+1}</b> ${esc(word)}</span>`).join('')}</aside><dl>${entries.map(([word,meaning])=>`<div><dt>${esc(word)}</dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl><ol><li>Are each of the things in the box above part of New Year’s celebrations in your country? If yes, what happens exactly?</li><li>What do you know about New Year’s celebrations in other countries?</li></ol></section>`}
function prepositionsOfTimeAndPlace(){return `<section class="b2rw-grammar-card" aria-label="Prepositions of time and place"><div class="b2rw-rule-grid"><article><h3>on</h3><p>Use <b>on</b> with a specific date or day.</p><p class="b2rw-example">The celebrations are <b>on 1 June</b> / <b>on Saturday</b>.</p></article><article><h3>in</h3><p>Use <b>in</b> with a month, year or season and with <b>the morning, the afternoon</b> and <b>the evening</b>.</p><p>Use <b>in</b> with a country, city or town and with a location within a larger area.</p><p class="b2rw-example">The event was <b>in December</b>. I was born <b>in 2001</b>. We visited the museum <b>in the morning</b>. I went to Muscat Nights <b>in Oman</b>.</p></article><article><h3>at</h3><p>Use <b>at</b> with a specific time or with <b>night</b> and <b>the weekend</b>.</p><p>Use <b>at</b> with a single, specific place. Use <b>at</b> with <b>school, college, university, work</b> and <b>home</b>.</p><p class="b2rw-example">We went to a café <b>at lunchtime</b>. I will meet you <b>at the park</b>. I wrote an essay <b>at school</b>.</p></article></div></section>`}
function definitionFillCarrier(title,words,definitions,sentences,answers){return api=>`<section class="b2rw-definition-task b2rw-definition-fill" aria-label="${esc(title)}"><aside class="b2rw-choice-bank" aria-label="Complete word bank">${words.map((word,i)=>`<span><b>${i+1}</b> ${esc(word)}</span>`).join('')}</aside><div class="b2rw-definition-card">${definitions.map((definition,i)=>`<p><b>${i+1}</b> ${esc(definition)}</p>`).join('')}</div><ol>${sentences.map((sentence,i)=>`<li>${sentenceSlot(api,sentence,answers[i])}</li>`).join('')}</ol></section>`}
function homestayDefinitions(){return definitionFillCarrier('Homestay vocabulary',['area','cheap','city centre','expensive','local','noisy','quiet'],['area (n) a region or part of a larger place, like a country or city','cheap (adj) not expensive, or costs less than usual','city centre (n) the main or central part of a city','expensive (adj) costs a lot of money; not cheap','local (adj) relating to a particular area, city or town','noisy (adj) loud; makes a lot of noise','quiet (adj) makes little or no noise'],['My hotel is ______ and calm. It is not in the busy part of the city, so it isn’t loud at night.','Central Park is a nice ______ to visit in New York.','When people visit new cities, it’s a good idea to ask ______ people for the best restaurants. They know the most about their city.','Since the airline was new, it offered ______ flights from Hong Kong to Bangkok. A lot of new customers bought tickets because of the low prices.','In Manchester, we took the bus to the ______. That is where the main tourist sites in the city are located.','It’s getting more ______ to live in big cities, so people who can’t pay the high prices are moving away.','There was a lot of traffic on my street last night. It was too loud to sleep because of all the ______ cars.'],['quiet','area','local','cheap','city centre','expensive','noisy'])}
function megacityDefinitions(){return definitionFillCarrier('Megacity vocabulary',['population','expert','countryside','opportunity','pollution','modern','traffic','capital'],['population (n) the number of people living in a place','expert (n) somebody who has a lot of skill in or knowledge about something','countryside (n) land that is not in towns or cities and may have farms and fields','opportunity (n) a chance to do something','pollution (n) damage caused to water, air and land by harmful materials or waste','modern (adj) designed and made using the most recent ideas and methods','traffic (n) the cars, lorries and other vehicles using a road','capital (n) the most important city in a country or state; where the government is'],['In some modern cities there is a lot of ______ from cars and factory smoke. This is a big problem for the world today.','Living in the ______ is boring. It is better to live in a city or town.','A city is planning a new road. The city does not need to ask an ______ to help them plan the new road.','Studying in another country gives students an ______ to learn about a new culture and speak a new language.','There are lots of ways to reduce heavy ______ in capital cities like Riyadh and London.','Cities that have a ______ of over 10 million people are exciting places to live.'],['pollution','countryside','expert','opportunity','traffic','population'])}
function megacityClassification(api){const bank=['busy trains','good place to study','housing problem','important industries','interesting places to visit','lots of jobs','mix of different people','bad traffic'];const answers={Tokyo:'lots of jobs; bad traffic; busy trains; good place to study',Delhi:'interesting places to visit; mix of different people; housing problem',Cairo:'important industries; good place to study'};return `<section class="b2rw-classification" aria-label="Megacity classification"><aside class="b2rw-choice-bank" aria-label="Complete classification bank">${bank.map((item,i)=>`<span><b>${i+1}</b> ${esc(item)}</span>`).join('')}</aside><table aria-label="Tokyo Delhi Cairo classification table"><tbody>${Object.entries(answers).map(([city,answer])=>`<tr><th scope="row">${city}</th><td aria-label="${city} answer area">${slot(api,answer)}</td></tr>`).join('')}</tbody></table></section>`}
/* This task already has the exact textbook diagram and two authored word
   banks.  Preserve it intact, but constrain only its formerly over-wide
   native layout inside a fixed teaching panel. */
function compoundNounsCarrier(){const bank=['email address','keyboard','laptop','smartphone','touch screen','website'];const answers=['keyboard','smartphone','website','email address','laptop','touch screen'];return {answer:true,keepMaterial:false,html:api=>`<section class="b2rw-compound-nouns" aria-label="Compound nouns device diagram"><aside class="b2rw-choice-bank" aria-label="Compound noun word bank">${bank.map((word,index)=>`<span><b>${index+1}</b> ${esc(word)}</span>`).join('')}</aside><div class="b2rw-compound-diagram">${api?.originalHTML||''}</div><ol class="b2rw-compound-slots">${answers.map((answer,index)=>`<li>${index+1} ${slot(api,answer)}</li>`).join('')}</ol></section>`}}
const opinionSourceSentences=['Video games are ______.','Online shopping is ______.','Social media sites are ______.','Online banking is ______.','Smartphones are ______.','Watching films online is ______.','Targeted adverts are ______.'];
const opinionModelAnswers=['I think that video games are entertaining.','I believe that online shopping is convenient.','It seems to me that social media sites are useful.','In my view, online banking is quick.','I think that smartphones are expensive.','I believe that watching films online is relaxing.','It seems to me that targeted adverts are annoying.'];
const opinionPhrases=['I think that ...','I believe that ...','It seems to me that ...','In my view, ...'];
function opinionsRewriteCarrier(){const groups=[[0,1,2,3],[4,5,6]];return {answer:true,keepMaterial:false,parts:groups.map((group,index)=>({title:`GIVING OPINIONS · ${index+1} / ${groups.length}`,html:api=>`<section class="b2rw-opinion-rewrite" aria-label="Giving opinions rewrite task"><header><h2>GIVING OPINIONS</h2><p><strong>6</strong> Rewrite the sentences in Exercise 5 to show that they are your opinion. Use phrases from the box above.</p></header><aside class="b2rw-opinion-phrases" aria-label="Opinion phrases">${opinionPhrases.map((phrase,i)=>`<span><b>${i+1}</b> ${esc(phrase)}</span>`).join('')}</aside><ol start="${group[0]+1}">${group.map(i=>`<li><p class="b2rw-opinion-source">${esc(opinionSourceSentences[i])}</p><p class="b2rw-opinion-response">${slot(api,opinionModelAnswers[i])}</p></li>`).join('')}</ol></section>`}))};}
function adjectivePhotoMatch(){const photos=sourceObjectFragments(87).filter(fragment=>fragment.graphic).slice(0,3);return `<section class="b2rw-photo-match" aria-label="Adjectives and photos"><aside class="b2rw-choice-bank" aria-label="Complete adjective bank">${['beautiful','boring','cheap','clean','expensive','interesting','noisy','polluted','quiet','ugly'].map((word,i)=>`<span><b>${i+1}</b> ${word}</span>`).join('')}</aside><div class="b2rw-photo-match-grid">${photos.length?photos.map((photo,i)=>`<figure><figcaption>Photo ${i+1}</figcaption>${photo.html}</figure>`).join(''):`<p class="b2rw-source-unavailable">The textbook photos are loading with this task.</p>`}</div></section>`}
function exactDefinitionContext(title,sentences,definitions,answers){return api=>`<section class="b2rw-context-definition" aria-label="${esc(title)}"><div class="b2rw-context-grid"><ol class="b2rw-context-sentences">${sentences.map(sentence=>`<li>${sentence}</li>`).join('')}</ol><ol class="b2rw-context-definitions" type="a">${definitions.map((definition,index)=>`<li>${slot(api,answers[index])} ${esc(definition.replace(/^_{2,}\s*/,''))}</li>`).join('')}</ol></div></section>`}
function internetDefinitions(){return exactDefinitionContext('Internet vocabulary · statements and definitions',[
 'I know what information the websites I use <strong>collect</strong> and remember about me.',
 'I know why internet companies <strong>record</strong> my online activities.',
 'I know how internet companies make money from websites that are <strong>free</strong> for me to use.',
 'I know why I see <strong>adverts</strong> selling the same thing on many different websites.',
 'I know how social media companies find out what my <strong>interests</strong> are, for example, that I like sport or technology.',
 'I know how people can steal my <strong>secret</strong> log-in information, for example, my online username and password.',
 'I know about internet <strong>security</strong>. For example, I know I can delete my browser history to help keep my personal information private.'
 ],[
 '__________ (adj) not known or seen by other people',
 '__________ (n) things you enjoy doing or learning about',
 '__________ (n) pictures, short films, etc. that tell people about things you can buy',
 '__________ (n) the things that are done to keep somebody or something safe',
 '__________ (v) to store sounds, pictures or information on a camera, computer, smartphone or other device so that they can be used in the future',
 '__________ (v) to get things from different places and bring them together',
 '__________ (adj) costing no money'
 ],['secret','interests','adverts','security','record','collect','free'])}
function otherPeopleDefinitions(){return exactDefinitionContext('People vocabulary · sentences and definitions',[
 'My mum thinks I’m too young to <strong>look after</strong> my little sister, so a babysitter comes to my house every day.',
 'The <strong>tournament</strong> was a success because all the games were exciting. There were 48 teams in total.',
 'Aisha runs at least 16 kilometres every morning to <strong>train</strong> for the upcoming race.',
 'Two million people came to the city centre to <strong>protest</strong> against high income tax.',
 'People say Terence Tao is one of the most <strong>intelligent</strong> people in the world. He got a PhD at the age of 20 and became a Maths professor at the age of 24.',
 'Eugene was <strong>brave</strong> when he ran into a burning house to save an elderly woman. He could have died, but he did it anyway.',
 'Many people in the company <strong>went on strike</strong> because of low pay and problems with taking holidays.',
 'William graduated from university and then decided to follow his <strong>dream</strong> of opening a restaurant.'
 ],[
 '__________ (n) something that you really want to do, be or have in the future',
 '__________ (phr v) to care for somebody or something by keeping them healthy or in a good condition',
 '__________ (adj) not showing fear of dangerous or difficult situations',
 '__________ (n) a competition for teams or single players; teams or players keep playing until only one winner is left',
 '__________ (adj) able to learn and understand things easily; clever',
 '__________ (v) to prepare for a job, activity or sport by learning skills or by exercise',
 '__________ (v) to show you disagree with something by shouting and carrying signs',
 '__________ (v) to begin a period of refusing to work because of an argument with an employer'
 ],['dream','look after','brave','tournament','intelligent','train','protest','went on strike'])}
function spaceDefinitions(){return exactDefinitionContext('Space vocabulary · sentences and definitions',[
 'Mariam loves to <strong>explore</strong> new places. Her dream is to go into space.',
 'There were many <strong>advances</strong> in science and medicine during the last century. The speed of change was amazing.',
 'Astronauts have not set foot <strong>beyond</strong> the moon, but one day soon they may go to planets that are farther away.',
 'It is important for an <strong>entrepreneur</strong> to understand that they might lose all of their money if their business fails.',
 'The rocket <strong>crashed</strong> when it was landing. Luckily, the people inside were not hurt.',
 'SpaceX is a <strong>private</strong> company. The government does not run it.',
 'Some people don’t think we should use <strong>public</strong> money, like taxes, to pay for space travel. They think companies should pay for it.'
 ],[
 '__________ (n) somebody who starts their own business',
 '__________ (n) a step in the development or improvement of something',
 '__________ (adj) related to money or services controlled or supplied by a person or company and not by the government',
 '__________ (v) to travel to a new place to learn about it',
 '__________ (prep) on the farther side of; at a farther distance than',
 '__________ (v) to be involved in an accident, especially in a vehicle',
 '__________ (adj) related to money or services controlled or supplied by the government and not by a person or company'
 ],['entrepreneur','advances','private','explore','beyond','crashed','public'])}
/* Textbook p177, Exercise 4.  The questions stay with precisely the paragraph
   that supplies their evidence; the diagram is retained only for Q3, where it
   belongs.  This avoids a tiny five-question list with no readable source. */
function kepler(){
 const source=[
  `<p><b>2</b> It is true that the universe has thousands of solar systems and there are planets similar to Earth. During its nine years in space, the very powerful <strong>Kepler telescope</strong><sup>1</sup> found more than 2,600 planets in orbit around stars.</p>`,
  `<p><b>2</b> A number of scientists think that one of these planets, named <strong>Kepler 22b</strong>, has the right <strong>conditions</strong> – the right atmosphere<sup>2</sup> and temperature – to support life. However, there is no <strong>evidence</strong> that there is life on Kepler 22b.</p>`,
  `<p><b>3</b> Earth has the perfect conditions for life, and it is very unlikely that another planet has exactly the same environment as Earth. A report from <strong>Princeton University</strong> suggests that it is highly unlikely that there is life on other planets. The researchers believe that we don’t have enough scientific evidence to decide if there is life on other planets.</p>`
 ];
 return {answer:true,keepMaterial:false,parts:[
  {title:'Questions 1–2 · evidence',html:api=>`<section class="b2rw-kepler-carrier"><header><small>READING 2 · LIFE ON OTHER PLANETS</small><h2>Evidence from Paragraph 2</h2></header><article>${source[0]}</article><ol start="1"><li>How many solar systems are there in the universe? ${slot(api,'Thousands of solar systems')}</li><li>What is the name of the telescope that discovered new planets? ${slot(api,'Kepler')}</li></ol></section>`},
  {title:'Question 3 · Kepler-22b',html:api=>`<section class="b2rw-kepler-carrier b2rw-kepler-diagram-step"><header><small>READING 2 · LIFE ON OTHER PLANETS</small><h2>Kepler-22b in its solar system</h2></header><div class="b2rw-kepler-grid"><article>${source[1]}</article><figure><img src="../assets/images/week1-repair-b2rw-kepler-22b-system.png" alt="Kepler-22 system, solar system, habitable zone and Kepler-22b labelled in English"></figure></div><ol start="3"><li>What is Kepler 22b? ${slot(api,'A planet')}</li></ol></section>`},
  {title:'Questions 4–5 · report evidence',html:api=>`<section class="b2rw-kepler-carrier"><header><small>READING 2 · LIFE ON OTHER PLANETS</small><h2>Evidence from Paragraph 3</h2></header><article>${source[2]}</article><ol start="4"><li>Which university wrote a report saying that it is unlikely there is life on other planets? ${slot(api,'Princeton University')}</li><li>What does the report say we need before we can know if there is life on other planets? ${slot(api,'Enough scientific evidence')}</li></ol><footer><sup>1</sup><strong>telescope</strong> (n) a piece of equipment, in the shape of a tube, that makes things that are far away look bigger or nearer &nbsp; <sup>2</sup><strong>atmosphere</strong> (n) the layer of gases around a planet</footer></section>`}
 ]};
}
/* Textbook p111.  Exercise 1 is an email vocabulary task, not the later
   Tough Guy feature article. */
function toughGuyEmailCarrier(){return {answer:true,keepMaterial:false,html:api=>`<section class="b2rw-tough-guy-email" aria-label="Tough Guy competition emails"><article class="b2rw-email-card"><dl><dt>To:</dt><dd>Steve</dd><dt>From:</dt><dd>Peter</dd><dt>Date:</dt><dd>12th October 2023</dd><dt>Subject:</dt><dd>Tough Guy competition <strong>course</strong></dd></dl><p>Hi,</p><p>I’ve just got this message from the Tough Guy competition. See the diagram of the course.</p><p>It looks <strong>challenging</strong>!</p><p>I’m not sure I’m <strong>fit</strong> enough and I’m a bit worried about <strong>accidents</strong>. Do you think we have to <strong>climb</strong> anything? Let’s talk next week.</p><p>Best,<br>Peter</p></article><article class="b2rw-email-card b2rw-forwarded-email"><p class="b2rw-forwarded">— — — Forwarded message — — —</p><dl><dt>From:</dt><dd>Tough Guy Competition</dd><dt>Date:</dt><dd>8th October</dd><dt>Subject:</dt><dd>the course of the next Tough Guy competition</dd></dl><p>Dear <strong>Participant</strong>,</p><p>We’re happy to tell you that the course of the next Tough Guy competition is ready. Below is a diagram of the course and a short description.</p><p>We look forward to seeing you there in January.</p><p>Kind regards,<br>The Organizers</p></article><section class="b2rw-email-definitions">${api?.originalHTML||''}</section></section>`};}
/* Textbook p108 is a Sporting News web feature.  Page order is explicit so
   the winter-swimming and dragon-boat items cannot be silently swapped by a
   generic source pool.  Native graphics on these source pages remain inside
   their matching numbered panel. */
function sportingSourceContent(page){
 const fragments=readerFragments([page]).flatMap(fragment=>splitLongReaderFragment(fragment));
 /* The imported p108 slide image includes a courseware footer.  Use the
    approved complete scene in its place, while retaining every original text
    object (including the intentional blank title line) in source order. */
 const scene=page===36?'<figure class="b2rw-sporting-winter-scene"><img src="../assets/week1-repair-media/b2rw-p108-winter-swim-imagegen-v1.webp" alt="People swimming in the Atlantic Ocean in winter at Coney Island, New York City"></figure>':page===37?'<figure class="b2rw-sporting-dragon-scene"><img src="../assets/week1-repair-media/b2rw-p108-dragon-boats-imagegen-v1.webp" alt="Dragon boat racing on the water with a traditional dragon-headed boat"></figure>':'';
 return `${scene}${fragments.filter(fragment=>(page!==36&&page!==37)||!fragment.graphic).map(fragment=>fragment.display||fragment.html).join('')}`;
}
function sportingNewsReader(){
 const entries=[
  [35,'FIVE UNUSUAL SPORTS · 1 / 6',''],
  [36,'FIVE UNUSUAL SPORTS · 2 / 6',''],
  [37,'FIVE UNUSUAL SPORTS · 3 / 6',''],
  [38,'FIVE UNUSUAL SPORTS · 4 / 6',''],
  [39,'FIVE UNUSUAL SPORTS · 5 / 6',''],
  [40,'FIVE UNUSUAL SPORTS · 6 / 6','']
 ];
 return {answer:false,keepMaterial:true,parts:entries.map(([page,_title,heading],index)=>({title:`Paragraph ${index+1}`,html:()=>{const content=sportingSourceContent(page);return `<section class="b2rw-sporting-news" data-source-page="${page}" aria-label="Sporting News: ${heading||'Five unusual sports'}"><header><p class="b2rw-sporting-nav">SPORTING <b>NEWS</b> <span>HOME &nbsp; ABOUT &nbsp; <strong>NEWS</strong> &nbsp; CONTACT &nbsp; MORE</span></p><h2>FIVE UNUSUAL SPORTS</h2><p class="b2rw-sporting-subtitle">The most unusual sports from around the world</p></header><article>${heading?`<h3>${heading}</h3>`:''}${content}</article>${page===40?'<footer><sup>1</sup><strong>bare</strong> (adj) without shoes &nbsp; <sup>2</sup><strong>wrestling</strong> (n) a sport in which two people fight and try to push each other to the ground</footer>':''}</section>`}}))};
}
/* Reading 2 opens as a Tough Guy magazine spread.  Its source panels retain
   their native photos/diagram fragments rather than falling back to a generic
   reader card. */
function toughGuyMagazineReader(){
 const pages=[112,113,114,115];
 return {answer:false,keepMaterial:true,parts:pages.map((page,index)=>({title:`TOUGH GUY · ${index+1} / ${pages.length}`,html:()=>{const content=readerFragments([page]).flatMap(fragment=>splitLongReaderFragment(fragment)).map(fragment=>fragment.display||fragment.html).join('');return `<section class="b2rw-tough-guy-magazine" data-source-page="${page}" aria-label="Tough Guy: A race to the limit"><header><p>SPORTING NEWS · SPECIAL FEATURE</p><h2>TOUGH GUY:</h2><h3>A race to the limit</h3></header><article>${content}</article></section>`}}))};
}
/* Textbook p129 is a complete web quiz, with four questions and four result
   panels.  It is kept as a website procedure rather than flattened prose. */
function worldOfWorkQuiz(){
 const intro=`<section class="b2rw-work-intro"><h2>Are you ready for the <b>WORLD OF WORK?</b></h2><p>Do you know what kind of job you want? Before you <strong>apply</strong> for a job, think about the different types of jobs that people do. There are four main types of jobs:</p><ol><li>jobs with people</li><li>jobs with information</li><li>jobs with things</li><li>jobs with ideas</li></ol><p>What kind of work would be best for you? Take our quiz and find out about the kind of work you would enjoy. For each question, choose the best answer for you: <b>a</b>, <b>b</b>, <b>c</b> or <b>d</b>.</p></section>`;
 const questions=[
  ['What do you like to do in the evenings?',['meet friends or go to a party','stay at home and surf the internet','play sports or practise a hobby like a musical instrument or photography','go to the cinema']],
  ['Which sections of a news website do you look at first?',['advice page or letters to the editor','news','sport','TV, music, books and art']],
  ['What do you like to do at an event?',['meet new people','discuss the latest news','help with the food and drinks','sing songs and tell jokes']],
  ['What do you prefer to do on a day off?',['have coffee with friends','organize your books and cupboards','work in the garden or clean the house','write poetry, make music or draw pictures']]
 ];
 const question=(item,index)=>`<article class="b2rw-work-question"><h3>${index+1} ${item[0]}</h3><ol type="a">${item[1].map(choice=>`<li>□ ${choice}</li>`).join('')}</ol></article>`;
 const results=[
  ['Mostly ‘a’ answers','You are friendly, kind and interested in other people. You would enjoy a job working with children, with <strong>customers</strong> in a shop or on a team with <strong>colleagues</strong>. Possible jobs are: teacher, waiter, police officer.'],
  ['Mostly ‘b’ answers','You are neat, you are good at planning and you like learning new things. You would enjoy a job working with information. Possible jobs are: university professor, computer programmer, librarian.'],
  ['Mostly ‘c’ answers','You are practical, you are good at sports and you like working with your hands. You would enjoy a job working with things. Possible jobs are: construction worker, engineer, farmer.'],
  ['Mostly ‘d’ answers','You are creative, you are good at music and art and you like books. You would enjoy a job working with ideas. Possible jobs are: artist, writer, singer.']
 ];
 const shell=body=>`<section class="b2rw-world-work"><header><p>Home &nbsp; About Us &nbsp; News &nbsp; <strong>Quiz</strong> &nbsp; Contact Us &nbsp; More</p></header>${body}</section>`;
 return {answer:false,keepMaterial:true,parts:[
  {title:'WORLD OF WORK · quiz 1–2',html:()=>shell(`${intro}<div class="b2rw-work-questions">${question(questions[0],0)}${question(questions[1],1)}</div>`)},
  {title:'WORLD OF WORK · quiz 3–4',html:()=>shell(`${intro}<div class="b2rw-work-questions">${question(questions[2],2)}${question(questions[3],3)}</div>`)},
  {title:'WORLD OF WORK · results',html:()=>shell(`<h2>Are you ready for the <b>WORLD OF WORK?</b></h2><p class="b2rw-work-results-note">Check your results and read the advice to find occupations you would like.</p><div class="b2rw-work-results">${results.map(([title,text])=>`<article><h3>${title}</h3><p>${text}</p></article>`).join('')}</div>`)}
 ]};
}
function worldOfWorkCorrection(){
 const intro=`<section class="b2rw-work-intro"><h2>Are you ready for the <b>WORLD OF WORK?</b></h2><p>Before you <strong>apply</strong> for a job, think about the different types of jobs that people do. There are four main types of jobs:</p><ol><li>jobs with people</li><li>jobs with information</li><li>jobs with things</li><li>jobs with ideas</li></ol><p>Check your results and read the advice to find occupations you would like.</p></section>`;
 return {answer:true,keepMaterial:false,html:api=>`<section class="b2rw-world-work b2rw-world-work-correction"><header><p>Home &nbsp; About Us &nbsp; News &nbsp; <strong>Quiz</strong> &nbsp; Contact Us &nbsp; More</p></header><div class="b2rw-work-correction-grid">${intro}<section class="b2rw-world-work-native-task">${api?.originalHTML||''}</section></div></section>`};
}
/* Exercise 5 itself is the quiz procedure.  The outer player already keeps
   the original instruction, so appending the full authored quiz again would
   create a second, overflowing website. */
function worldOfWorkDoQuiz(){const quiz=worldOfWorkQuiz();return {answer:false,keepMaterial:false,parts:quiz.parts};}
/* These three carriers intentionally reconstruct their original print genre
   instead of showing a generic reader card.  Their text is transcribed from
   the corresponding textbook pages; heading, order and reading purpose stay
   visible on every in-task page. */
const homestayListings=[
 {letter:'A',title:'Stay in the mountains',hosts:'The Atal family',scene:'home-a',text:'Our family home is in the north of Nepal, in the Himalayan Mountains, in the village of Manang. The village is small and very quiet. It is a very friendly place. The mountains are extremely beautiful. You can go for long walks and swim in the rivers, but there are no shops, cinemas or cafés.',bold:['quiet']},
 {letter:'B',title:'A house by the sea',hosts:'Kate and Julian Foxton',scene:'home-b',text:'Our two-bedroom house is by the sea in the south-west of England. It is 15 minutes’ drive to the nearest village of Portreath. There are lots of beaches, rivers and forests, and it is very quiet. We spend a lot of time reading books, watching films and going for walks. Our area is great for sports like surfing, kayaking and mountain biking. However, the houses here are expensive, which can be a problem for local people. There are no buses or trains here, so it can be difficult to get around without a car.',bold:['expensive','local']},
 {letter:'C',title:'City holiday',hosts:'Chafic and Asma Halwany',scene:'home-c',text:'Our home is near the historic city centre of Beirut, Lebanon, a large city in the Middle East. There are lots of cafés and restaurants, which are open late at night. We love it here because it’s so friendly and you can always find what you need. Lots of people come here to learn Arabic and French. There are also a lot of jobs and businesses here. However, it can be noisy at night and there is a lot of traffic during the day. The best thing about Beirut is the weather. It is nice all year round; it rains in the winter, but there is no snow.',bold:['noisy']}
];
function boldTerms(text,terms=[]){let out=esc(text);for(const term of terms){const escaped=esc(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');out=out.replace(new RegExp(`\\b${escaped}\\b`,'gi'),match=>`<strong>${match}</strong>`)}return out}
function homestayShell(content){return `<section class="b2rw-homestay-site" aria-label="Homestay Holidays"><header><div class="b2rw-homestay-brand"><span>HOMESTAY</span><b>HOLIDAYS</b><small>A HOME AWAY FROM HOME</small></div><div class="b2rw-homestay-search" aria-label="Places to stay search"><b>Places to stay</b><span>Location</span><span>Check in</span><span>Check out</span><span>Guests</span></div></header>${content}</section>`}
function homestayListingMarkup(entry){return `<article class="b2rw-homestay-listing"><div class="b2rw-homestay-photo ${entry.scene}" role="img" aria-label="${esc(entry.title)} homestay scene"></div><div class="b2rw-homestay-copy"><p class="b2rw-homestay-letter">${entry.letter}</p><h2>${esc(entry.title)}</h2><h3>${esc(entry.hosts)}</h3><p>${boldTerms(entry.text,entry.bold)}</p></div></article>`}
function homestayWebsite(){const intro=`<article class="b2rw-homestay-intro"><h2>A home away from home</h2><p>Homestays are becoming more and more popular, and people around the world are offering their homes as places to stay. Homestays offer <strong>cheap</strong> places to stay and the chance for guests to see the <strong>area</strong> like <strong>local</strong> people. They are very popular with students who want to stay in another country and learn a language. We asked three families who run homestays to tell us about where they live.</p></article>`;return {parts:[{title:'Intro',html:()=>homestayShell(intro)},...homestayListings.map(entry=>({title:entry.letter,html:()=>homestayShell(homestayListingMarkup(entry))}))],answer:false,keepMaterial:true}}
/* Textbook p24, Exercise 5.  Each group works from one complete source card
   and fills the original Questions / Notes grid on the same fixed screen.
   This replaces an article-only preamble plus a detached task and does not
   recreate the old redundant A/B/C selector layer. */
function homestayDetailTask(){
 const answers=[
  ['The Atal family','the north of Nepal, in the Himalayan Mountains, in the village of Manang','the mountains and rivers','go for long walks and swim in the rivers'],
  ['Kate and Julian Foxton','by the sea in the south-west of England, near Portreath','beaches, rivers and forests','read books, watch films, go for walks, surf, kayak and mountain bike'],
  ['Chafic and Asma Halwany','near the historic city centre of Beirut, Lebanon','cafés and restaurants','learn Arabic and French']
 ];
 const questions=['What is the name of the family?','Where is the homestay?','What kind of places are there near the homestay? (e.g., beaches, cinemas, etc.)','What can visitors do in the area?'];
 return {answer:true,keepMaterial:false,parts:homestayListings.map((entry,index)=>({title:`Student ${entry.letter} · ${entry.title}`,html:api=>homestayShell(`${homestayListingMarkup(entry)}<section class="b2rw-homestay-detail-task" aria-label="Exercise 5 questions and notes"><p class="b2rw-homestay-detail-instruction"><strong>5</strong> Work in groups of three students. Read your text, A, B or C. Then write the answers to the questions in the table.</p><table aria-label="Questions and notes"><thead><tr><th>Questions</th><th>Notes</th></tr></thead><tbody>${questions.map((question,q)=>`<tr><th scope="row">${q+1} ${esc(question)}</th><td>${slot(api,answers[index][q])}</td></tr>`).join('')}</tbody></table></section>`).replace('b2rw-homestay-site"','b2rw-homestay-site b2rw-homestay-detail-site"')}))};
}
const celebrations=[
 ['Piñatas','In Mexico, people often have piñatas at their parties. Parents put chocolates and other sweets inside the piñata and hang it on a tree. Children hit the piñata with a stick. It breaks and the sweets fall out onto the ground.'],
 ['Noodles','In China, people celebrate weddings with an eight-course meal, because the word eight in Chinese also means good luck. The last dish of the meal is always noodles. The noodles are long and thin. You have to eat them in one piece – you can’t cut them. In Chinese culture, long noodles are lucky. Long noodles mean you will have a long life.'],
 ['Mother’s Day','Many people around the world honour their mothers on Mother’s Day. In the UK, Mother’s Day is celebrated in March or April. Sons and daughters like to give their mother a day to rest, so they might surprise her by cleaning the house or cooking a nice meal for her. They also give her gifts such as flowers or jewellery. Many families take their mother to a restaurant for lunch or dinner.'],
 ['New Year’s Eve','London celebrates New Year’s Eve in a big way. Thousands of people go to the River Thames, and then, when it is dark outside, fireworks light up the sky and Big Ben, the bell in London’s famous clock tower, chimes at midnight. The next day, people eat a big meal with family and friends, go for a walk or just relax at home.'],
 ['Coming of Age Day','In Japan, people celebrate Coming of Age Day, or Seijin no Hi, on the second Monday in January. On this holiday, Japan congratulates people who have turned or will turn 20 years old between 2 April of the past year and 1 April of the current year. In Japanese culture, this is the age when teenagers become adults and take on responsibilities of being an adult. Young women usually wear a traditional furisode kimono, while young men often wear Western-style suits, and they attend a ceremony in their area. They receive small presents and celebrate with their friends after the ceremony.']
];
const celebrationPictures=[
 'B2_RW-p041-photo-pinatas-original-clean.jpg',
 'B2_RW-p041-photo-noodles-original.jpg',
 'B2_RW-p041-photo-mothers-day-original.jpg',
 'B2_RW-p041-photo-new-years-eve-original.jpg',
 'B2_RW-p041-coming-of-age-restored-imagegen-v1.png'
];
const celebrationTerms=[
 [],['celebrate','eight','good luck','culture','lucky'],['honour','gifts'],['fireworks','chimes'],['take on','traditional','ceremony']
];
const celebrationNotes=[
 '', '', '', '<sup>1</sup> <strong>chimes</strong> (v) makes a clear ringing sound', '<sup>2</sup> <strong>take on</strong> (v) accept responsibility for something &nbsp; <sup>3</sup> <strong>ceremony</strong> (n) a formal event that people go to, often for a holiday or to celebrate somebody or something'
];
/* p041 is a photo-led feature.  Each original section keeps its own full
   image, local subtitle, printed vocabulary and note rather than presenting a
   text-only surrogate before the native E4 task. */
function celebrateFeatureTaskCase(){
 const parts=celebrations.map(([heading,text],index)=>({title:`CELEBRATE! · ${index+1} / ${celebrations.length}`,html:api=>`<section class="b2rw-celebrate-feature b2rw-celebrate-task" data-source-page="41" aria-label="CELEBRATE ${esc(heading)}"><header><h2>CELEBRATE!</h2></header><article><figure><img src="../assets/restore-rw-figures/${celebrationPictures[index]}" alt="${esc(heading)} celebration"><figcaption>${index+1} ${esc(heading)}</figcaption></figure><div class="b2rw-celebrate-copy"><p>${boldTerms(text,celebrationTerms[index])}</p>${celebrationNotes[index]?`<footer>${celebrationNotes[index]}</footer>`:''}</div></article><div class="b2rw-celebrate-native-task">${api?.originalHTML||''}</div></section>`}));
 return {answer:true,keepMaterial:false,parts};
}
/* Exercise 4 asks for three descriptions only: the piñata, noodles and
   fireworks items.  Do not send learners through two unrelated article cards
   before the authored task. */
function celebrateTaskThreeContextCase(){
 const needed=[0,1,3];
 return {answer:true,keepMaterial:false,parts:needed.map((index,order)=>{const [heading,text]=celebrations[index];return {title:`CELEBRATE! · task context ${order+1} / ${needed.length}`,html:api=>`<section class="b2rw-celebrate-feature b2rw-celebrate-task" data-source-page="41" aria-label="CELEBRATE ${esc(heading)}"><header><h2>CELEBRATE!</h2></header><article><figure><img src="../assets/restore-rw-figures/${celebrationPictures[index]}" alt="${esc(heading)} celebration"><figcaption>${esc(heading)}</figcaption></figure><div class="b2rw-celebrate-copy"><p>${boldTerms(text,celebrationTerms[index])}</p>${celebrationNotes[index]?`<footer>${celebrationNotes[index]}</footer>`:''}</div></article><div class="b2rw-celebrate-native-task">${api?.originalHTML||''}</div></section>`}})};
}
const muscatNights=[
 'One of the most important festivals in Oman is Muscat Nights. The festival lasts for about one month and takes place in February every year. During the festival, many activities are available for people to take part in.',
 'Large numbers of people, including local Omanis and visitors to Oman, go to the different events. The events are a celebration of both Omani history and traditions. The events happen in different places across the country. Many businesses show their products for people to look at and buy.',
 'Muscat Nights also includes the very popular six-day Tour of Oman cycle race. Professional cyclists from around the world take part in the race. The race is 1,000 kilometres long, and it takes the cyclists up the beautiful Jabal Al Akhdar – the Green Mountain.',
 'Other highlights of Muscat Nights include the chance to experience different food and music. For example, you can taste traditional types of food at the Oman Food Festival. The Muscat Art Festival also offers Arabic music, concerts and plays, and other entertainment for the whole family. The Festival of Lights is one of the most popular events at Muscat Nights.',
 'Muscat Nights is an international event, with people visiting from countries as far away as Brazil and Cuba. Visitors also arrive from Italy, India, Russia, South Korea, Spain, Tunisia and Türkiye, as well as many other countries. They enjoy the amazing clothes, food and music. Some people just enjoy the mix of different cultures.'
];
function featureArticle(title,items,sourcePage){return {parts:items.map((item,index)=>{const [heading,text]=Array.isArray(item)?item:[null,item];return {title:`${title} · ${index+1} / ${items.length}`,html:()=>`<section class="b2rw-feature-article" data-source-page="${sourcePage}" aria-label="${esc(title)}"><header><h2>${esc(title)}</h2></header><article>${heading?`<h3>${index+1} ${esc(heading)}</h3>`:`<p class="b2rw-feature-number">${index+1}</p>`}<p>${esc(text)}</p></article></section>`}}),answer:false,keepMaterial:true}}
/* Textbook p19 is not a generic sequence of eight paragraphs.  Its opening
   is a city-feature and paragraphs 6–8 are three explicitly comparable city
   records.  Keep the title, definition, population strip and city-to-paragraph
   relationship together in readable fixed-canvas states. */
const megacityIntro=[
 'The number of megacities is growing very quickly. In the 1950s, there were only two megacities in the world.',
 'Today, 12% of the world’s urban¹ <strong>population</strong> lives in megacities. Studies show that there will be 8.5 billion people in the world in 2030. <strong>Experts</strong> say that there will be 40 megacities.',
 'Today, more than 35 cities in the world are megacities. The majority are in Asia, South America and Africa. More and more people around the world are leaving their homes in the <strong>countryside</strong> and moving to the city.',
 'Many megacities have better <strong>opportunities</strong>, such as more jobs and a choice of schools and universities. Megacities are also exciting places to live – there are lots of different people, languages and restaurants, and there are many interesting things to do.',
 'However, megacities have problems, too. The cities are very big and this can cause problems like <strong>pollution</strong> or poor housing².'
];
const megacityCities=[
 ['Tokyo, Japan','37.4 MILLION','Tokyo is an exciting, <strong>modern</strong> city in the east of Japan. There are lots of jobs because most big companies in Japan are in Tokyo. It is also an excellent place to study – 18% of Japan’s universities are in the city. However, Tokyo is very busy and the <strong>traffic</strong> is bad. More than 7.5 million people use the Tokyo Metro every day.'],
 ['Delhi, India','29.4 MILLION','Delhi is in the north of India. It has many beautiful monuments, interesting museums and modern restaurants. There is an exciting mix of different cultures in the city, and there are four official languages: Hindi, Urdu, Punjabi and English. However, there are not enough houses in some parts of Delhi. This means that many people live in large <u>slums</u> in the city.'],
 ['Cairo, Egypt','20.5 MILLION','Cairo is the <strong>capital</strong> of Egypt and is the second-largest city in Africa. Cairo has important car and film industries. The city is the centre of many government offices and has many universities, one of which is over 1,200 years old.']
];
function megacityFeature(){
 const intro={title:'RISE OF THE MEGACITIES · 1 / 4',html:()=>`<section class="b2rw-megacity-feature b2rw-megacity-intro" aria-label="Rise of the Megacities introduction"><header><h2>Rise of the <b>MEGACITIES</b></h2><p class="b2rw-reader-subtitle"><strong>Megacity:</strong> a city with more than 10 million people</p></header><div class="b2rw-megacity-intro-grid"><figure class="b2rw-megacity-skyline"><img src="../assets/week1-repair-media/b2rw-megacity-skyline-imagegen-v1.webp" alt="Night city skyline across water"></figure><div class="b2rw-megacity-intro-copy"><article>${megacityIntro.map((text,index)=>`<p><b>${index+1}</b> ${text}</p>`).join('')}</article><footer><sup>1</sup><strong>urban</strong> (adj) relating to towns and cities &nbsp; <sup>2</sup><strong>housing</strong> (n) places to live, such as apartments or houses</footer></div></div></section>`};
 const cityParts=megacityCities.map(([city,population,text],index)=>({title:`RISE OF THE MEGACITIES · ${index+2} / 4`,html:()=>`<section class="b2rw-megacity-feature b2rw-megacity-city" aria-label="${esc(city)} comparison card"><header><p class="b2rw-context-kicker">RISE OF THE MEGACITIES</p><div class="b2rw-megacity-population"><h2>${esc(city)}</h2><strong>${esc(population)}</strong></div></header><article><p><b>${index+6}</b> ${text}</p></article></section>`}));
 return {parts:[intro,...cityParts],answer:false,keepMaterial:true};
}
const cases={
  'B2_RW_U01:258:':megacityFeature(),
 'B2_RW_U01:259:':homestayWebsite(),
 'B2_RW_U01:33:2':{html:megacityDefinitions(),answer:true},
 'B2_RW_U01:49:4':{html:megacityClassification,answer:true},
 'B2_RW_U01:71:1':{html:homestayDefinitions(),answer:true},
 'B2_RW_U01:87:2':{html:adjectivePhotoMatch,answer:false},
  /* Selected follow-up tasks must carry their required reading situation on
     the main canvas.  Each entry reuses the exact source reader/site above
     and ends with the untouched authored task; it is intentionally separate
     from the Read-and-Listen entry route. */
  'B2_RW_U01:82:5':homestayGroupTaskCase(),
 /* p041 has a five-section CELEBRATE! feature; p044 has the five numbered
    Muscat Nights paragraphs.  The former generic page pools mixed in a
    Diwali preparation task, so neither carrier may derive from that pool. */
 'B2_RW_U02:283:':featureArticle('CELEBRATE!',celebrations,41),
 'B2_RW_U02:284:':featureArticle('MUSCAT NIGHTS',muscatNights,44),
 'B2_RW_U02:84:':{html:prepositionsOfTimeAndPlace,answer:false},
 'B2_RW_U02:48:4':celebrateTaskThreeContextCase(),
 'B2_RW_U03:333:':lazyArticleCase('B2_RW_U03','Internet cookies',[51,52,53,54,55]),
 'B2_RW_U03:334:':videoGamesCarrier(),
 'B2_RW_U03:133:1':compoundNounsCarrier(),
 'B2_RW_U03:137:6':opinionsRewriteCarrier(),
 'B2_RW_U03:34:1':{html:internetDefinitions(),answer:true},
 /* Live classroom anchors for the two Video Games follow-up tasks.  Keeping
    these explicit avoids relying on an old source-anchor mapping. */
 'B2_RW_U03:105:3':videoGamesFollowUp(3),
 'B2_RW_U03:115:5':videoGamesFollowUp(5),
  'B2_RW_U03:60:5':sourceTaskCase('INTERNET COOKIES',[[53]]),
  'B2_RW_U03:72:8':sourceTaskCase('INTERNET COOKIES',[[53],[55]]),
 'B2_RW_U04:29:1':{html:()=>sourceContext('Reading 1 · social-media update and definitions',[29]),answer:false},
 'B2_RW_U04:347:':lazyArticleCase('B2_RW_U04','Weather and climate · Reading 1',[40,41,42,43,44,45]),
 'B2_RW_U04:39:4':{html:()=>sourceContext('Reading 1 · topic sentences a–e',[39]),answer:false},
 'B2_RW_U04:348:':saharaFourStepReader(),
  'B2_RW_U04:67:7':sourceTaskCase('Living in the wettest place on Earth',[[40,41],[42,43],[44,45]],{subtitle:'Reading 1'}),
  'B2_RW_U04:106:4':sourceTaskCase('Surviving the sea of sand',[[94,96],[97,98],[99,100],[101,102]],{subtitle:'How to stay alive in the Sahara Desert'}),
  'B2_RW_U04:117:5':saharaGraphTaskCase(),
 'B2_RW_U02:10:1':{html:newYearVocabulary,answer:false},
 'B2_RW_U05:326:':sportingNewsReader(),
 /* p111 is an empty reading-text bridge; p112–115 are the five source
    paragraphs.  Do not render that bridge as an invented article opening. */
 'B2_RW_U05:327:':toughGuyMagazineReader(),
  'B2_RW_U05:49:4':sportingNewsTaskCase([[36],[37],[38],[39],[40]]),
  'B2_RW_U05:78:7':sportingNewsTaskCase([[35]]),
  'B2_RW_U05:102:1':toughGuyEmailCarrier(),
  'B2_RW_U05:117:5':toughGuyTaskCase([[112],[113]]),
  'B2_RW_U05:118:6':toughGuyTaskCase([[112],[113],[114]]),
 /* p129 is a web-quiz carrier.  The former 42–46 pool started midway through
    answer/result cards.  57–66 restores the source order: site lead-in,
    quiz prompt, all four questions and all four result profiles. */
 'B2_RW_U06:389:':worldOfWorkQuiz(),
 'B2_RW_U06:390:':lazyArticleCase('B2_RW_U06','The story of ChatGPT and OpenAI',[124,125,126,127,128,129,130,131,132,133,134]),
  'B2_RW_U06:56:4':worldOfWorkCorrection(),
  'B2_RW_U06:67:5':worldOfWorkDoQuiz(),
  'B2_RW_U06:135:4':sourceTaskCase('The story of ChatGPT and OpenAI',[[127,128,129]]),
 'B2_RW_U07:27:1':{html:u7Definitions,answer:true},
 'B2_RW_U07:143:4':peoplePhotoConversation(),
 'B2_RW_U07:350:':{parts:ben.map((_,i)=>({title:`Paragraph ${i+1}`,html:()=>benArticle(i)})),answer:false},
 'B2_RW_U07:44:3':{html:api=>`<section class="b2rw-exercise-with-reference">${benReference()}<ol type="a"><li>Ben learnt to “see” again. Paragraph: ${slot(api,'3')}</li><li>Ben was an ordinary boy, but could do something amazing. Paragraph: ${slot(api,'1')}</li><li>Ben became a hero for many people. Paragraph: ${slot(api,'4')}</li><li>Ben became ill and lost his eyes. Paragraph: ${slot(api,'2')}</li></ol></section>`,answer:true},
 'B2_RW_U07:54:4':{html:api=>`<section class="b2rw-exercise-with-reference">${benReference()}<ol><li>Ben liked playing basketball. ${slot(api,'T')}</li><li>Ben was just like other teenagers. ${slot(api,'F')}</li><li>Ben learnt to “see” by touching things. ${slot(api,'F')}</li><li>Ben couldn’t ride a bicycle. ${slot(api,'F')}</li><li>Ben had two older brothers. ${slot(api,'T')}</li><li>Ben liked listening to music. ${slot(api,'T')}</li></ol></section>`,answer:true},
 'B2_RW_U07:77:7':{html:api=>`<section class="b2rw-exercise-with-reference">${benReference()}<ol><li>Who wrote the blog?<br>a a scientist<br>${slot(api,'b a journalist')}</li><li>Why did the author write it?<br>a to teach doctors about cancer<br>${slot(api,'b to tell people Ben’s story')}</li></ol></section>`,answer:true},
 'B2_RW_U07:351:':{parts:profiles.map((_,i)=>({title:`Profile ${i+1}`,html:()=>profile(i)})),answer:false},
 'B2_RW_U07:114:3':{parts:profiles.map((_,i)=>({title:`Profile ${i+1}`,html:()=>profile(i)})),answer:false},
 'B2_RW_U07:107:1':{html:otherPeopleDefinitions(),answer:true},
 'B2_RW_U08:420:':lazyArticleCase('B2_RW_U08','THE RISE OF COMMERCIAL SPACE TRAVEL',[42,43,44,45,46,47,48,49,50,51,52,53,54]),
 'B2_RW_U08:421:':lazyArticleCase('B2_RW_U08','LIFE ON OTHER PLANETS',[135,136,137,138,139,140,141,142,143]),
 'B2_RW_U08:34:1':{html:spaceDefinitions(),answer:true},
 'B2_RW_U08:156:4':kepler()
  ,'B2_RW_U08:61:3':sourceTaskCase('THE RISE OF COMMERCIAL SPACE TRAVEL',[[44,45,46,47],[48,49,50,51],[52,53,54]])
};
Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},cases);
/*
 * These two textbook tasks deliberately point students at one exact starting
 * fragment.  The original resource still contains every article page; only its
 * opening part is selected by initialPart for the task that names that
 * paragraph/introduction; the authored resource order is never changed.
 * The capture listener is needed because the core toolbar closes over its local
 * openResource function; it invokes the public classroom method before that
 * local handler runs.
 */
const materialTargets={
 'B2_RW_U01:52:7':{resource:'article_80d1ce96ca7a',first:54,label:'Paragraph 7 · slums context'},
 'B2_RW_U01:77:3':{resource:'article_2322145a0edd',first:78,label:'Homestay Holidays · introduction'}
};
/* Canonical reading sequences exclude a preparatory vocabulary slide and
   duplicate article fragments, while restoring the Homestay introduction. */
const canonicalMaterialParts={
 'article_80d1ce96ca7a':[41,42,43,44,45],
 'article_2322145a0edd':[78,79,80,81]
};
function targetForCurrent(){const player=window.UNLOCK_PLAYER,lesson=player?.lesson,state=player?.state?.();if(!lesson||!state)return null;return materialTargets[`${lesson.id}:${state.current}:${state.exercise??''}`]||null}
function targetInitialPart(resource,target){
 if(!resource||resource.id!==target?.resource)return resource;
 const parts=canonicalMaterialParts[resource.id]||resource.parts;
 const sourceInfo=window.S?.pageInfo?.[String(target.first)]||window.UNLOCK_PLAYER?.structure?.pageInfo?.[String(target.first)]||{};
 const materialLabel=sourceInfo.materialLabel||target.label;
 /* p54 is an imported duplicate of the canonical Paragraph 7 at p44.  Resolve
    that source-only anchor to its canonical counterpart, never by moving p54
    ahead of the article or inserting another copy of its text. */
 const canonicalByLabel={'Paragraph 7 · slums context':44};
 const initialPart=parts.includes(target.first)?target.first:(canonicalByLabel[materialLabel]||parts[0]);
 return {...resource,parts,initialPart,materialLabel,sourceInitialPart:target.first};
}
function openTargetMaterial(){const player=window.UNLOCK_PLAYER,classroom=player?.classroom,target=targetForCurrent();if(!classroom||!target)return false;const exercise=classroom.exercise?.();const resource=classroom.graph?.resources?.[target.resource];if(!resource||!exercise?.resources?.includes(target.resource))return false;const material=targetInitialPart(resource,target);const list=(exercise.resources||[]).map(id=>id===target.resource?material:classroom.graph.resources[id]).filter(Boolean);classroom.openResource(material,list);return true}
function installTargetMaterialEntry(){
 const player=window.UNLOCK_PLAYER,classroom=player?.classroom;if(!player||!classroom||classroom.__b2rwTargetMaterialInstalled)return false;
 classroom.__b2rwTargetMaterialInstalled=true;
 const original=classroom.openResource.bind(classroom);
 classroom.openResource=(resource,list)=>{const target=targetForCurrent();if(target?.resource===resource?.id)return original(targetInitialPart(resource,target),(list||[]).map(item=>targetInitialPart(item,target)));return original(resource,list)};
 document.addEventListener('click',event=>{if(!event.target.closest('#material-open'))return;if(openTargetMaterial()){event.preventDefault();event.stopImmediatePropagation();}},true);
 return true;
}
if(!installTargetMaterialEntry()){
 let targetInstallAttempts=0;const targetInstallTimer=setInterval(()=>{if(installTargetMaterialEntry()||++targetInstallAttempts>24)clearInterval(targetInstallTimer)},100);
}
/* Page 138 was a second, unprompted copy of Exercise 5 after Exercise 6.
   It is removed from the live navigation only; the authored source remains
   intact and direct links land on the next valid instructional screen. */
const duplicateRouteAnchors={
 B2_RW_U03:new Set([138]),
 /* These five different live anchors all rendered the same p151 blog-intro
    fragment without a question or a reading paragraph before vocabulary. */
 B2_RW_U07:new Set([31,45,55,68,79])
};
function rebuildRouteSelect(structure,currentAnchor){
 const select=document.querySelector('#page-select');if(!select)return;
 const selectedIndex=Math.max(0,structure.routes.findIndex(route=>route.anchor===currentAnchor));
 select.replaceChildren();let activeSection='';let group=null;
 structure.routes.forEach((route,index)=>{
  const section=route.section||'Lesson';
  if(section!==activeSection){activeSection=section;group=document.createElement('optgroup');group.label=section;select.append(group)}
  const option=new Option(route.label||`Page ${index+1}`,String(index));option.dataset.anchor=String(route.anchor);group.append(option);
 });
 select.value=String(selectedIndex);
}
function filterExactDuplicateRoute(){
 const player=window.UNLOCK_PLAYER,lesson=player?.lesson,structure=player?.structure;if(!player||!lesson||!structure?.routes)return false;
 const excluded=duplicateRouteAnchors[lesson.id];if(!excluded||structure.__b2rwDuplicateRoutesFiltered)return true;
 const originalCount=structure.routes.length;
 structure.routes=structure.routes.filter(route=>!excluded.has(route.anchor));
 structure.__b2rwDuplicateRoutesFiltered=true;
 if(structure.routes.length===originalCount)return true;
 structure.routeMap={};structure.routes.forEach((route,index)=>{structure.routeMap[route.anchor]=index});
 const state=player.state?.()||{};
 const current=excluded.has(state.current)
  ?(structure.routes.find(route=>route.anchor>state.current)?.anchor||structure.routes.at(-1)?.anchor)
  :state.current;
 rebuildRouteSelect(structure,current);
 if(current!==state.current&&current!=null)player.goto?.(current,false);
 return true;
}
if(!filterExactDuplicateRoute()){
 let filterAttempts=0;const duplicateFilterTimer=setInterval(()=>{if(filterExactDuplicateRoute()||++filterAttempts>24)clearInterval(duplicateFilterTimer)},100);
}
/* Filtering the visible select is not enough: a saved hash can restore an
   excluded authored alias after boot.  Canonicalize only the exact duplicate
   anchors, before the player renders them; legal neighbouring anchors remain
   untouched. */
const duplicateCanonicalAnchors={B2_RW_U03:{138:136},B2_RW_U07:{31:350,45:350,55:350,68:350,79:350}};
function installDuplicateRouteGuard(){
 const player=window.UNLOCK_PLAYER,lesson=player?.lesson;if(!player||!lesson||player.__b2rwDuplicateGuard)return false;
 const aliases=duplicateCanonicalAnchors[lesson.id];if(!aliases)return true;
 player.__b2rwDuplicateGuard=true;const goto=player.goto?.bind(player);if(typeof goto!=='function')return true;
 player.goto=(anchor,...args)=>goto(aliases[anchor]||anchor,...args);
 const state=player.state?.()||{};const canonical=aliases[state.current];if(canonical!=null)setTimeout(()=>player.goto(canonical,false),0);
 return true;
}
if(!installDuplicateRouteGuard()){
 let guardAttempts=0;const duplicateGuardTimer=setInterval(()=>{if(installDuplicateRouteGuard()||++guardAttempts>24)clearInterval(duplicateGuardTimer)},100);
}
window.WEEK1_REPAIR_B2RW={version:'20261025-source-carriers-7-native-dedupe',cases:Object.keys(cases),materialTargets,duplicateRouteAnchors,status:'precise-carrier-cases-only'};
})();

/* The three p151 follow-up tasks are not article appendices.  Each teaching
 * beat puts only the paragraph(s) needed for that question beside that exact
 * question, preserving the blog genre without a full article plus a second
 * full question list below it. */
(()=>{'use strict';
 const paras=[
  `Ben Underwood was a normal teenage boy. He loved playing basketball, riding his bike, listening to music with his friends and playing video games. But in one way, Ben was different from most other teenagers – he was blind. However, Ben had a special <strong>talent</strong>. He didn’t have eyes, but he could still ‘see’.`,
  `Ben was born on 26 January 1992. For the first two years of his life, Ben was a happy and healthy baby. He had a normal life, living with his mother and two older brothers in California. However, when Ben was two years old, his life changed. In 1994, he was taken to the hospital because he had problems with his eyes. The doctors looked at his eyes and told his mother the bad news – Ben had cancer<sup>1</sup>. After a few months, he had an <strong>operation</strong> to remove the cancer. The operation was successful and Ben was fine. However, the doctors had to remove his eyes and Ben became <strong>blind</strong>.`,
  `After his operation, Ben developed an <strong>incredible</strong> talent like a superhero. When he was three, he learnt how to ‘see’ buildings with his ears. He listened very carefully and he could hear noises bounce off buildings. The noises told him where the buildings were. Then, when Ben was seven, he learnt to ‘click’. He made clicking noises with his mouth and listened for the noises that bounced back from things. In this way, Ben could ‘see’ where he was and what was around him. This is the same way dolphins see things underwater and bats see in the dark.`,
  `Scientists and doctors were amazed by Ben’s talent. There are only a few blind people in the world who can see like Ben. People <strong>respected</strong> him because of this. He became famous. He was on TV and he travelled to different countries and talked to people about his life. Sadly, when Ben was 16, his cancer came back. He died soon after. However, during Ben’s life, he taught people that anything is possible. Many people <strong>admired</strong> him because he <strong>inspired</strong> them and helped them feel strong. When he died in 2009, over 2,000 people went to his funeral.`
 ];
 const julietPortrait='../assets/display-images/8ba5ba350c1858efc066eadeb09f5320c2fc465e29ffc02e27c3f19b34454193.webp';
 const benPortrait='../assets/display-images/f68b4173028fca3725d43eb0b74f249cfed801631c9b2bc496383df89fad7d7e.webp';
 const blog=(content,title='REAL-LIFE SUPERHEROES')=>{const marker='<section class="b2rw-blog-task">';const taskAt=content.indexOf(marker);const context=taskAt<0?content:content.slice(0,taskAt);const task=taskAt<0?'':content.slice(taskAt);return `<section class="b2rw-blog b2rw-task-blog"><header><div class="b2rw-blog-brand">${title}</div><nav class="b2rw-blog-nav" aria-label="Real-Life Superheroes navigation"><span>Top stories</span><span>Newsletter</span><span>Shop</span></nav><div class="b2rw-blog-about"><img class="b2rw-blog-avatar" src="${julietPortrait}" alt="Juliet Selby"><p><b>About me</b> · My name is Juliet Selby. I write about people that I <strong>admire</strong>. I write about a different person every week. Read about the real-life superheroes here!</p></div></header><div class="b2rw-blog-context">${context}</div>${task}</section>`};
 const para=(index)=>`<article><h2>/2023//Ben Underwood</h2><p><b>${index+1}</b> ${paras[index]}</p>${index===1?'<footer><sup>1</sup><strong>cancer</strong> (n) a serious disease that makes people very sick, because cells in the body grow in ways that are not normal or controlled</footer>':''}${index===3?`<figure class="b2rw-blog-ben-photo"><img src="${benPortrait}" alt="Ben Underwood"></figure>`:''}</article>`;
 /* The player exposes answer state through api.slot(), not an api.answer
    boolean.  Reuse its standard inline-answer contract so Question and
    Answers views differ without duplicating or leaking answer text. */
 const answer=(api,value)=>typeof api?.slot==='function'?api.slot(value,'word'):'<span class="inline-answer-placeholder">________</span>';
 const matchStatements=[
  ['a','Ben learnt to “see” again.','3'],
  ['b','Ben was an ordinary boy, but could do something amazing.','1'],
  ['c','Ben became a hero for many people.','4'],
  ['d','Ben became ill and lost his eyes.','2']
 ];
 const matching={answer:true,keepMaterial:false,parts:[0,1,2,3].map(index=>({title:`Paragraph ${index+1} · matching`,html:api=>blog(`${para(index)}<section class="b2rw-blog-task"><ol type="a">${matchStatements.map((item)=>`<li>${item[1]} Paragraph: ${answer(api,item[2])}</li>`).join('')}</ol></section>`)}))};
 const trueFalsePairs=[[[0,'Ben liked playing basketball.','T',''],[0,'Ben was just like other teenagers.','F','Ben was blind / different from other teenagers.']],[[2,'Ben learnt to “see” by touching things.','F','He learnt to “see” by hearing / clicking.'],[0,'Ben couldn’t ride a bicycle.','F','He could ride a bicycle.']],[[1,'Ben had two older brothers.','T',''],[0,'Ben liked listening to music.','T','']]];
 const correction=(api,text)=>text?`<span class="b2rw-correction-writing">Correction: ${answer(api,text)}</span>`:'';
 const trueFalse={answer:true,keepMaterial:false,parts:trueFalsePairs.map((pair,index)=>({title:`True / false · ${index+1} / 3`,html:api=>blog(`${para(pair[0][0])}${pair.some(item=>item[0]!==pair[0][0])?para(pair[1][0]):''}<section class="b2rw-blog-task"><ol start="${index*2+1}">${pair.map(item=>`<li>${item[1]} ${answer(api,item[2])} ${correction(api,item[3])}</li>`).join('')}</ol></section>`)}))};
 const blogQuestions={answer:true,keepMaterial:false,parts:[{title:'Blog questions',html:api=>blog(`${para(0)}<section class="b2rw-blog-task"><ol><li>Who wrote the blog?<ol type="a"><li>a scientist</li><li>a journalist ${answer(api,'b')}</li></ol></li><li>Why did the author write it?<ol type="a"><li>to teach doctors about cancer</li><li>to tell people Ben’s story ${answer(api,'b')}</li></ol></li></ol></section>`)}]};
 const c=window.CLASSROOM_RESTORE_CASES ||= {};
 c['B2_RW_U07:350:']={answer:false,keepMaterial:true,parts:[0,1,2,3].map(index=>({title:`Paragraph ${index+1}`,html:()=>blog(para(index))}))};
 c['B2_RW_U07:44:3']=matching;c['B2_RW_U07:54:4']=trueFalse;c['B2_RW_U07:77:7']=blogQuestions;
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Main-canvas closure for ordinary reading tasks.  These are not video or
 * intensive-listening materials: each task receives the exact source context
 * that its prompt names, followed by its own native question.  The resource
 * side panel is therefore not a prerequisite for reading, discussing or
 * answering. */
(()=>{'use strict';
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const nativeTask=api=>'<section class="b2rw-maincanvas-task">'+(api.originalHTML||'')+'</section>';
 const slums=`Delhi is in the north of India. It has many beautiful monuments, interesting museums and modern restaurants. There is an exciting mix of different cultures in the city, and there are four official languages: Hindi, Urdu, Punjabi and English. However, there are not enough houses in some parts of Delhi. This means that many people live in large <u>slums</u> in the city.`;
 const homestayIntro=`Homestays are becoming more and more popular, and people around the world are offering their homes as places to stay. Homestays offer <strong>cheap</strong> places to stay and the chance for guests to see the <strong>area</strong> like <strong>local</strong> people. They are very popular with students who want to stay in another country and learn a language. We asked three families who run homestays to tell us about where they live.`;
 function slumsCarrier(){return {answer:true,keepMaterial:false,html:api=>'<section class="b2rw-maincanvas-context b2rw-megacity-context"><header><h2>RISE OF THE MEGACITIES</h2><p class="b2rw-context-kicker">Delhi, India · Paragraph 7</p></header><article><p>'+slums+'</p></article>'+nativeTask(api)+'</section>'}}
 function homestayIntroCarrier(){return {answer:true,keepMaterial:false,html:api=>'<section class="b2rw-homestay-site b2rw-maincanvas-context" aria-label="Homestay Holidays introduction"><header><div class="b2rw-homestay-brand"><span>HOMESTAY</span><b>HOLIDAYS</b><small>A HOME AWAY FROM HOME</small></div><div class="b2rw-homestay-search"><b>Places to stay</b><span>Location</span><span>Check in</span><span>Check out</span><span>Guests</span></div></header><article class="b2rw-homestay-intro"><h2>A home away from home</h2><p>'+homestayIntro+'</p></article>'+nativeTask(api)+'</section>'}}
 const ben=[
  `Ben Underwood was a normal teenage boy. He loved playing basketball, riding his bike, listening to music with his friends and playing video games. But in one way, Ben was different from most other teenagers – he was blind. However, Ben had a special <strong>talent</strong>. He didn’t have eyes, but he could still ‘see’.`,
  `Ben was born on 26 January 1992. For the first two years of his life, Ben was a happy and healthy baby. He had a normal life, living with his mother and two older brothers in California. However, when Ben was two years old, his life changed. In 1994, he was taken to the hospital because he had problems with his eyes. The doctors looked at his eyes and told his mother the bad news – Ben had cancer<sup>1</sup>. After a few months, he had an <strong>operation</strong> to remove the cancer. The operation was successful and Ben was fine. However, the doctors had to remove his eyes and Ben became <strong>blind</strong>.`,
  `After his operation, Ben developed an <strong>incredible</strong> talent like a superhero. When he was three, he learnt how to ‘see’ buildings with his ears. He listened very carefully and he could hear noises bounce off buildings. The noises told him where the buildings were. Then, when Ben was seven, he learnt to ‘click’. He made clicking noises with his mouth and listened for the noises that bounced back from things. In this way, Ben could ‘see’ where he was and what was around him. This is the same way dolphins see things underwater and bats see in the dark.`,
  `Scientists and doctors were amazed by Ben’s talent. There are only a few blind people in the world who can see like Ben. People <strong>respected</strong> him because of this. He became famous. He was on TV and he travelled to different countries and talked to people about his life. Sadly, when Ben was 16, his cancer came back. He died soon after. However, during Ben’s life, he taught people that anything is possible. Many people <strong>admired</strong> him because he <strong>inspired</strong> them and helped them feel strong. When he died in 2009, over 2,000 people went to his funeral.`
 ];
 function benTaskCarrier(){return {answer:true,keepMaterial:false,parts:ben.map((text,index)=>({title:'REAL-LIFE SUPERHEROES · '+(index+1)+' / 4',html:api=>'<section class="b2rw-blog b2rw-maincanvas-context"><header><div class="b2rw-blog-brand">REAL-LIFE<br>SUPERHEROES</div><p><b>About me</b> · My name is Juliet Selby. I write about people that I <strong>admire</strong>. I write about a different person every week. Read about the real-life superheroes here!</p></header><h2>/2023//Ben Underwood</h2><article><p><b>'+String(index+1)+'</b> '+text+'</p></article>'+(index===1?'<footer><sup>1</sup><strong>cancer</strong> (n) a serious disease that makes people very sick, because cells in the body grow in ways that are not normal or controlled</footer>':'')+nativeTask(api)+'</section>'}))}}
 const profiles=[
  ['JACK DORSEY',`I really admire Jack Dorsey, the former CEO of Twitter (now X). He invented a new kind of social networking site. Twitter was an <strong>intelligent</strong> way to communicate but it was also easy to use. Twitter became very popular with everyone including students, politicians and teachers. Jack Dorsey is a good role model because he is an excellent business man. He works hard and is very kind. In 2016 he gave almost one third of his shares in Twitter to his employees. I respect him because he changed the way people use social media all over the world.`],
  ['MARY EVANS',`My mum, Mary Evans, is my role model. I have a very big family, with two brothers and three sisters. My mum worked very hard every day to look after us and she was very busy. She always makes time for everyone and she always listens to me if I have a problem. She gives me advice and she is always right. I have a nephew who is sick and has to go to the hospital a lot. My mum often sleeps at the hospital with him. I really respect her because she always looks after my family and makes sure that we have everything we need.`],
  ['ENGLAND WOMEN’S NATIONAL FOOTBALL TEAM',`My role models are the England women’s national football team, the Lionesses. In 2022 they won the European Women’s Championship. The team of eleven young women were <strong>trained</strong> by Sarina Wiegman, and she helped them win the Championship. It was difficult for them because England had not won a major <strong>tournament</strong> since 1966. But in the end, they were the best team. They worked hard every day for their <strong>dream</strong>, so I really admire them.`],
  ['GRETA THUNBERG',`Greta Thunberg is a <strong>brave</strong> young woman from Sweden. In 2018, at the age of 15, she <strong>protested</strong> outside the Swedish parliament for climate change. She has given speeches about climate change around the world in countries like the United States, France, Spain and the United Kingdom. In 2019, 4 million people went <strong>on strike</strong> for climate change after listening to her speeches. In 2019 she was on the cover of <em>Time</em> magazine. Greta is a good role model because she is brave, she never gives up and she tells the truth no matter what.`]
 ];
 function profileTaskCarrier(){return {answer:true,keepMaterial:false,parts:profiles.map(([name,text],index)=>({title:'INCREDIBLE PEOPLE · '+(index+1)+' / 4',html:api=>'<section class="b2rw-profile b2rw-maincanvas-context"><header><h2>INCREDIBLE PEOPLE</h2></header><article><p class="b2rw-profile-number">'+(index+1)+'</p><h3>'+esc(name)+'</h3><p>'+text+'</p></article>'+nativeTask(api)+'</section>'}))}}
 const c=window.CLASSROOM_RESTORE_CASES ||= {};
 c['B2_RW_U01:52:7']=slumsCarrier();
 c['B2_RW_U01:77:3']=homestayIntroCarrier();
 /* Detailed task-specific carriers are registered before this closure.  Keep
    them; this generic fallback is only for builds that do not have them. */
 const benCarrier=benTaskCarrier();
 c['B2_RW_U07:44:3'] ||= benCarrier;c['B2_RW_U07:54:4'] ||= benCarrier;c['B2_RW_U07:77:7'] ||= benCarrier;
 c['B2_RW_U07:114:3']=profileTaskCarrier();
 window.WEEK1_REPAIR_B2RW={...(window.WEEK1_REPAIR_B2RW||{}),version:'20261026-maincanvas-context-1',mainCanvasContexts:['B2_RW_U01:52:7','B2_RW_U01:77:3','B2_RW_U07:44:3','B2_RW_U07:54:4','B2_RW_U07:77:7','B2_RW_U07:114:3']};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Textbook p156 is a social-media feed, not four plain profile paragraphs.
 * Keep every original post, author/likes/footer interaction, and the two
 * printed portraits.  The notes variant retains Exercise 3 in the same step. */
(()=>{'use strict';
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const photos={jack:'../assets/week1-repair-media/b2rw-p156-jack-portrait-restored-imagegen-v1.webp',greta:'../assets/display-images/c9f7c104219d631e95980682e0ab7018f0a8b9dab9d3e44f6a14e0b3a8c7475f.webp'};
 const posts=[
  {title:'JACK DORSEY',author:'Ahmed Aziz',likes:5,photo:photos.jack,cls:'jack',text:'I really admire Jack Dorsey, the former CEO of Twitter (now X). He invented a new kind of social networking site. Twitter was an <strong>intelligent</strong> way to communicate but it was also easy to use. Twitter became very popular with everyone including students, politicians and teachers. Jack Dorsey is a good role model because he is an <strong>excellent</strong> business man. He works hard and is very kind. In 2016 he gave almost one third of his shares in Twitter to his employees. I respect him because he changed the way people use social media all over the world.'},
  {title:'MARY EVANS',author:'Mark Evans',likes:24,text:'My mum, Mary Evans, is my role model. I have a very big family, with two brothers and three sisters. My mum worked very hard every day to look after us, and she was very busy. She always makes time for everyone and she always listens to me if I have a problem. She gives me advice and she is always right. I have a nephew who is sick and has to go to the hospital a lot. My mum often sleeps at the hospital with him. I really respect her because she always looks after my family and makes sure that we have everything we need.'},
  {title:'ENGLAND WOMEN’S NATIONAL FOOTBALL TEAM',author:'Li Chan',likes:1,text:'My role models are the England women’s national football team, the Lionesses. In 2022 they won the European Women’s Championship. The team of eleven young women were <strong>trained</strong> by Sarina Wiegman, and she helped them win the Championship. It was difficult for them because England had not won a major <strong>tournament</strong> since 1966. But in the end, they were the best team. They worked hard every day for their <strong>dream</strong>, so I really admire them.'},
  {title:'GRETA THUNBERG',author:'Jane Kloster',likes:11,photo:photos.greta,cls:'greta',text:'Greta Thunberg is a <strong>brave</strong> young woman from Sweden. In 2018, at the age of 15, she <strong>protested</strong> outside the Swedish parliament for climate change. She has given speeches about climate change around the world in countries like the United States, France, Spain and the United Kingdom. In 2019, 4 million people went <strong>on strike</strong> for climate change after listening to her speeches. In 2019 she was on the cover of <em>Time</em> magazine. Greta is a good role model because she is brave, she never gives up and she tells the truth no matter what.'}
 ];
 const post=(p,i)=>`<article class="b2rw-social-card ${p.photo?'has-photo':''}"><div class="b2rw-social-copy">${p.photo?`<figure class="b2rw-social-photo ${p.cls}"><img src="${p.photo}" alt="${esc(p.title)}"><figcaption>${esc(p.title)}</figcaption></figure>`:''}<section><h2>${esc(p.title)}</h2><p><b class="b2rw-social-number">${i+1}</b>${p.text}</p></section></div><footer><strong>${esc(p.author)}</strong><span>♡ ${p.likes}</span><span>▢</span><span class="b2rw-social-compose">Say something…</span><span>▧ ☺ ➤</span></footer></article>`;
 const notes=api=>`<aside class="b2rw-social-notes"><p><strong>Work in groups of four.</strong> Each student reads a different profile from the text. <strong>Take notes on your text. Write down key information.</strong></p><div class="b2rw-social-lines">${Array.from({length:8},()=>'<span></span>').join('')}</div><div class="b2rw-social-native-task">${api?.originalHTML||''}</div></aside>`;
 const reader={answer:false,keepMaterial:false,parts:posts.map((p,i)=>({title:p.title,html:()=>`<section class="b2rw-social-feed">${post(p,i)}</section>`}))};
 const noteTask={answer:true,keepMaterial:false,parts:posts.map((p,i)=>({title:p.title,html:api=>`<section class="b2rw-social-feed b2rw-social-note-layout">${post(p,i)}${notes(api)}</section>`}))};
 const c=window.CLASSROOM_RESTORE_CASES ||= {};
 c['B2_RW_U07:351:']=reader;
 c['B2_RW_U07:114:3']=noteTask;
 window.WEEK1_REPAIR_B2RW={...(window.WEEK1_REPAIR_B2RW||{}),socialCarrier:{sourcePage:156,reader:'B2_RW_U07:351:',noteTask:'B2_RW_U07:114:3'}};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();
