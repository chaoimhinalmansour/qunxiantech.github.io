/* B3 RW first-week textbook-context repairs. Loaded after context restoration. */
(()=>{'use strict';
const cases={},circle=['①','②','③','④','⑤','⑥','⑦','⑧'];
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const getTask=id=>(window.SCHOOL_TEXTBOOK_V21?.tasks||{})[id]||{};
function definition(id,page){
 const t=getTask(id),words=t.definitions||String(t.bank||'').split(/\s*·\s*/).filter(Boolean);
 return '<section class="b3rw-source-card b3rw-definitions"><div class="b3rw-source-kicker">TEXTBOOK CONTEXT · Book 3, page '+esc(page)+'</div><h2>Read the definitions</h2><p>'+esc(t.originalInstruction||'Read the definitions and use the original sentences below.')+'</p><ol>'+words.map((v,i)=>'<li><b class="b3rw-circle">'+(circle[i]||i+1)+'</b><span>'+esc(v)+'</span></li>').join('')+'</ol><p class="b3rw-context-note">Definitions, the original bold-word sentences and the response area stay together.</p></section>';
}
function article(d){
 return '<section class="b3rw-source-card b3rw-reader"><div class="b3rw-source-kicker">TEXTBOOK READING · Book 3, pages '+esc(d.page)+'</div><h2>'+esc(d.title)+'</h2><p>'+esc(d.lede)+'</p><div class="b3rw-reader-grid">'+d.labels.map((v,i)=>'<article class="b3rw-paragraph"><b class="b3rw-paragraph-number">'+esc(v[0]||i+1)+'</b><div><h3>'+esc(v[1])+'</h3><p>'+esc(v[2])+'</p></div></article>').join('')+'</div><p class="b3rw-context-note">Use the labelled source context and the current exercise together.</p></section>';
}
function spec(d){return {title:d.section||'READING',answer:true,layoutClass:'b3rw-source-context-layout',html:api=>'<div class="b3rw-repair" data-b3rw-repair="'+esc(d.issue)+'">'+(d.task?definition(d.task,d.page):article(d))+'<section class="b3rw-live-task"><div class="b3rw-live-task-label">YOUR TASK</div>'+(api.originalHTML||'')+'</section></div>'};}
function register(unit,route,d){const s=spec(d);cases[unit+':'+route+':']=s;for(let n=0;n<13;n++)cases[unit+':'+route+':'+n]=s;}
function def(unit,route,issue,task,page,section){register(unit,route,{issue,task,page,section});}
function read(unit,route,issue,page,section,title,lede,labels){register(unit,route,{issue,page,section,title,lede,labels});}
/* Exact definitions are loaded from the verified textbook task registry. */
def('B3_RW_U01',42,'B3RW-U01-001 B3RW-U01-002','B3_RW_U01_G2_E1','18','READING 1');
def('B3_RW_U02',43,'B3RW-U02-001','B3_RW_U02_G2_E1','40','READING 1');
def('B3_RW_U03',62,'B3RW-U03-003 B3RW-U03-004','B3_RW_U03_G5_E1','66','LANGUAGE DEVELOPMENT');
def('B3_RW_U04',40,'B3RW-U04-01 B3RW-U04-02','B3_RW_U04_G3_E1','84','READING 1');
def('B3_RW_U05',41,'B3RW-U05-01','B3_RW_U05_G3_E1','106','READING 1');
def('B3_RW_U05',42,'B3RW-U05-02','B3_RW_U05_G3_E1','106','READING 1');
def('B3_RW_U06',37,'B3RW-U06-U08-VOCAB-DEFINITION-CARRIER','B3_RW_U06_G3_E1','128','READING 1');
def('B3_RW_U08',73,'B3RW-U06-U08-VOCAB-DEFINITION-CARRIER','B3_RW_U08_G3_E1','175','READING 2');
/* Reading carriers make the source relationship explicit. Root's shared reader
   supplies the complete source text and image panel for these labelled cases. */
const A=(u,r,i,p,s,t,l,x)=>read(u,r,i,p,s,t,l,x);
A('B3_RW_U01',43,'B3RW-U01-003','19–20','READING 1','ANIMALS AND HUMANS','Read and listen to the complete essay before answering.',[['1','Complete essay','Reading evidence remains visible while listening.']]);
A('B3_RW_U01',44,'B3RW-U01-004','19–20','READING 1','ANIMALS AND HUMANS','Use the paragraph markers to locate the main ideas.',[['1','Paragraph 1','Introduction and context.'],['2','Paragraph 2','Supporting evidence.'],['3','Paragraph 3','Conclusion.']]);
A('B3_RW_U01',61,'B3RW-U01-008','21–23','READING 2','RED AND GREY SQUIRRELS','Compare the two species using the fact file and questions together.',[['A','Red squirrel','Use habitat and survival evidence.'],['B','Grey squirrel','Compare origin, disease and survival.']]);
A('B3_RW_U01',62,'B3RW-U01-009','22–23','READING 2','RED AND GREY SQUIRRELS','Read and listen with the fact file available.',[['A–D','Fact file','The complete species comparison remains available.']]);
A('B3_RW_U01',63,'B3RW-U01-010','22–23','READING 2','GROUP READING','Each group member reads an assigned text.',[['A','Student A','Main ideas and details.'],['B','Student B','Main ideas and details.'],['C','Student C','Main ideas and details.'],['D','Student D','Main ideas and details.']]);
A('B3_RW_U01',64,'B3RW-U01-011','23','READING 2','GROUP SUMMARY','Use the fact file and group notes to correct the summary.',[['A–D','Shared evidence','Complete the summary from group reading.']]);
A('B3_RW_U02',44,'B3RW-U02-002','41–43','READING 1','OUR CHANGING PLANET','Read and listen to the complete climate-change article.',[['1','Climate change','Article context and evidence.'],['2','Causes and effects','Locate evidence by paragraph.'],['3','Responses','Use the article when discussing solutions.']]);
A('B3_RW_U02',45,'B3RW-U02-003 B3RW-U02-004','41–43','READING 1','OUR CHANGING PLANET','Keep title, glacier context, word notes and paragraph identity together.',[['1','Changing ecosystems','Locate evidence.'],['2','Melting glaciers','Use context and evidence together.'],['3','A solution','Use final paragraph.']]);
A('B3_RW_U02',64,'B3RW-U02-005','45–46','READING 2','THE CAUSES AND EFFECTS OF DEFORESTATION','Read the full essay with forest scene and paragraph markers.',[['1','Causes','Why people cut down trees.'],['2','Effects','Environmental effects.'],['3','Responses','Evaluate solutions.']]);
A('B3_RW_U03',43,'B3RW-U03-001','62','READING 1','WAYS TO GET AROUND','Look at the three city transport contexts before discussing.',[['①','City transport 1','Observe its effect.'],['②','City transport 2','Compare examples.'],['③','City transport 3','Use image context as evidence.']]);
A('B3_RW_U03',44,'B3RW-U03-002','64','READING 1','URBAN TRANSPORT: PROBLEMS AND SOLUTIONS','Read and listen to the complete article.',[['1','Article reading','Article, photographs and paragraph markers.']]);
A('B3_RW_U03',45,'B3RW-U03-006','64–65','READING 1','URBAN TRANSPORT: PROBLEMS AND SOLUTIONS','One complete seven-paragraph article supports all reading tasks.',[['1','Paragraphs 1–2','Opening context.'],['3','Paragraphs 3–5','Details for table task.'],['6','Paragraphs 6–7','Transport solutions.']]);
A('B3_RW_U03',64,'B3RW-U03-005','67','READING 2','SOLVING TRAFFIC CONGESTION','Keep seven paragraphs, transport images and notes together.',[['1','The problem','Congestion effects.'],['2','Solutions','Compare options.'],['3','Evaluation','Use final paragraphs.']]);
A('B3_RW_U03',65,'B3RW-U03-007','68','READING 2','TRAFFIC-CONGESTION SOLUTIONS','Keep full comparison table stable in every step.',[['Table','Solution · What happens? · Advantages · Disadvantages','Complete each row.']]);
A('B3_RW_U04',41,'B3RW-U04-03','86','READING 1','CUSTOMS AND TRADITIONS','Read and listen to the complete article.',[['1','Country sections','Use headings and paragraph labels.']]);
A('B3_RW_U04',42,'B3RW-U04-05','86–87','READING 1','CUSTOMS AND TRADITIONS','Keep paragraph numbers, country headings, images and notes with each task.',[['1','Customs','Identify customs.'],['2','Country evidence','Use relevant section.']]);
A('B3_RW_U04',43,'B3RW-U04-04 B3RW-U04-05','87','READING 1','STUDENT NOTES','Column labels remain visible in every internal step.',[['Table','Custom · Brazil · Japan · Saudi Arabia','Complete notes from country sections.']]);
A('B3_RW_U04',65,'B3RW-U04-06 B3RW-U04-07','93','GRAMMAR FOR WRITING','ADVERBS OF FREQUENCY','Use full 0–100% scale while forming sentences.',[['0–100%','Frequency scale','never · rarely · sometimes · often · usually · always']]);
A('B3_RW_U04',66,'B3RW-U04-08','93','GRAMMAR FOR WRITING','ADVERBS OF FREQUENCY','Keep grammar rule beside the sentence task.',[['Rule','Position','Use rule and scale before writing.']]);
A('B3_RW_U04',38,'B3RW-U04-01','82','WATCH AND LISTEN','WORD BANK','Keep the complete choice set below the fixed title area.',[['①','Choice set','Every option remains readable and selectable.']]);
A('B3_RW_U04',67,'B3RW-U04-01','93','GRAMMAR FOR WRITING','WORD BANK','Keep the complete choice set below the fixed title area.',[['①','Choice set','Every option remains readable and selectable.']]);
A('B3_RW_U04',124,'B3RW-U04-01','96','ACADEMIC WRITING SKILLS','WORD BANK','Keep the complete choice set below the fixed title area.',[['①','Choice set','Every option remains readable and selectable.']]);
A('B3_RW_U05',43,'B3RW-U05-03','107','READING 1','EXERCISE AND SELF-ESTEEM','Read and listen to full magazine article.',[['1','Magazine article','Article and paragraph identity remain available.']]);
A('B3_RW_U05',44,'B3RW-U05-04','107–109','READING 1','EXERCISE AND SELF-ESTEEM','Read magazine article as one complete text.',[['1','Opening','Focus and main idea.'],['2','Evidence','Evidence for questions.'],['3','Conclusion','Final paragraph.']]);
A('B3_RW_U05',47,'B3RW-U05-06','106–112','READING 1','READING MATERIALS','Keep article, table and photograph in the fixed teaching area.',[['Material','Task relationship','Use each with its associated question.']]);
A('B3_RW_U05',63,'B3RW-U05-05','109–112','READING 2','OBESITY: A NEWS REPORT','Paragraph 2 and Paragraph 3 labels stay visible.',[['2','Paragraph 2','Student A reads; Student B notes.'],['3','Paragraph 3','Student B reads; Student A notes.']]);
A('B3_RW_U05',68,'B3RW-U05-07','114','LANGUAGE DEVELOPMENT','ACADEMIC VOCABULARY','Keep table columns stable when changing state.',[['Table','Vocabulary set','Same labelled set in every state.']]);
A('B3_RW_U06',56,'B3RW-U06-U08-UNMARKED-INNER-SPLITS','132','READING 2','DEEPFAKE TECHNOLOGY','Every internal step remains visibly numbered and named.',[['①','Read','Read the source and annotate evidence.'],['②','Respond','Use the same source when responding.']]);
A('B3_RW_U07',41,'B3RW-U06-U08-VOCAB-DEFINITION-CARRIER','150','READING 1','BUYING USED CLOTHING','Keep the original vocabulary sentences and the complete choice set together.',[['①','Vocabulary in context','Use each bold word in its original sentence before answering.']]);
A('B3_RW_U07',62,'B3RW-U07-R62-ARGUMENT-TABLE-SPLIT','156','ACADEMIC WRITING SKILLS','ARGUMENTS FOR AND AGAINST','Keep complete table together.',[['Table','For · Against · Evidence','Claims stay aligned with evidence.']]);
A('B3_RW_U08',67,'B3RW-U06-U08-UNMARKED-INNER-SPLITS','175','READING 1','ECONOMY AND SOCIETY','Every internal step remains visibly numbered.',[['①','Read','Complete source first.'],['②','Respond','Use source context.']]);
A('B3_RW_U08',70,'B3RW-U06-U08-UNMARKED-INNER-SPLITS','176','READING 2','INCOME AND EXPENDITURE','Every internal step remains visibly numbered.',[['①','Read','Article and graph together.'],['②','Respond','Use source evidence.']]);
/* Draft registry deliberately remains inactive.  The former route numbers were
   audit live indexes, not verified player-state anchors; article cards are
   placeholders until exact textbook text and source-image bindings are mapped. */
const refresh=()=>window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
window.B3_RW_WEEK1_REPAIR={version:'20261025-b3rw-draft-inactive',cases,refresh,active:false};
})();

/* Verified Unit 1 source carriers.  These cases use the actual player hashes
   and take every displayed source sentence from LESSON.pages. */
(()=>{'use strict';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function slideText(index){
 const p=(window.LESSON?.pages||[]).find(x=>x.index===index); if(!p)return '';
 const n=document.createElement('div');n.innerHTML=p.html||'';
 let t=(n.textContent||'').replace(/\s+/g,' ').trim();
 const mark=t.indexOf('Paragraph ');if(mark>=0)t=t.slice(mark);
 /* Authored slides append their player controls and next-screen labels to the
    same HTML fragment.  They are not textbook prose. */
 t=t.replace(/\s+Play audio\b[\s\S]*$/i,'').replace(/\s+逐句精听\b[\s\S]*$/,'').trim();
 return t;
}
function task(api){return '<section class="b3rw-exact-task"><div class="b3rw-exact-task-label">YOUR TASK</div>'+(api.originalHTML||'')+'</section>'}
function source(api,text,label){return '<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div><div class="b3rw-exact-text"><p>'+esc(text)+'</p></div></section>'+task(api)+'</div>'}
function article(slides,label){return {answer:true,layoutClass:'b3rw-exact-layout',parts:slides.map((slide,i)=>({title:'Source '+(i+1)+' / '+slides.length,html:api=>source(api,slideText(slide),label)}))}}
function definitions(taskId,label){return {answer:true,layoutClass:'b3rw-exact-layout',html:api=>{const t=(window.SCHOOL_TEXTBOOK_V21?.tasks||{})[taskId]||{};const rows=Array.isArray(t.definitions)?t.definitions:[];return '<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div><div class="b3rw-exact-text"><p>'+esc(t.originalInstruction||'Read the definitions and complete the sentences.')+'</p><ol>'+rows.map((x,i)=>'<li><strong>'+(['①','②','③','④','⑤','⑥','⑦','⑧'][i]||i+1)+'</strong> '+esc(x)+'</li>').join('')+'</ol></div></section>'+task(api)+'</div>'}}}
const exact={
 'B3_RW_U01:28:1':definitions('B3_RW_U01_G2_E1','Book 3 · page 18'),
 'B3_RW_U01:338:':article([31,32,33,34,35,36,37,38],'Book 3 · page 19 · Endangered species'),
 'B3_RW_U01:53:':article([31,32,33,34,35,36,37,38],'Book 3 · pages 19–20 · Endangered species'),
 'B3_RW_U01:339:':article([97,98,99,100,101,102,103],'Book 3 · pages 22–23 · Red and grey squirrels'),
 'B3_RW_U01:95:':article([97,98,99,100,101,102,103],'Book 3 · pages 22–23 · Group reading source'),
 'B3_RW_U01:112:':article([97,98,99,100,101,102,103],'Book 3 · page 23 · Group summary source')
};
Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},exact);
window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261025-b3rw-u01-exact',active:true,verifiedKeys:Object.keys(exact)};
window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Exact reading carriers for the next verified player anchors.  The carrier is
   assembled at runtime from the authored resource parts, rather than from a
   hand-written summary: the source HTML keeps its original bold text, tables
   and images while excluding slide chrome, hidden layers and audio controls. */
(()=>{'use strict';
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function authored(index){return (window.LESSON?.pages||[]).find(p=>p.index===index)}
function slice(index){const p=authored(index);if(!p)return '';const host=document.createElement('div');host.innerHTML=p.html||'';const layers=new Set((p.layers||[]).map(x=>String(x.id)));const title=(p.title||'').split('|').map(x=>x.trim());const body=[...host.querySelectorAll(':scope>.obj')].filter(el=>{const y=parseFloat(el.style.top)||0,txt=(el.textContent||'').replace(/\s+/g,' ').trim();return !layers.has(String(el.dataset.id))&&y>=162&&y<950&&!el.hasAttribute('data-action')&&!el.querySelector('audio,video')&&txt!=='Play audio'&&!title.includes(txt)&&txt!==p.section;});return body.map(el=>{el.removeAttribute('style');el.classList.remove('obj');el.querySelectorAll('[style]').forEach(n=>n.removeAttribute('style'));return '<div class="b3rw-authored-fragment">'+el.innerHTML+'</div>'}).join('')}
function renderedTask(api){return '<section class="b3rw-exact-task"><div class="b3rw-exact-task-label">YOUR TASK</div>'+(api.originalHTML||'')+'</section>'}
function sourcePart(index,label,api){return '<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div>'+slice(index)+'</section>'+renderedTask(api)+'</div>'}
function articleResource(which,label){const r=window.SCHOOL_RELATIONS?.[window.LESSON?.id];const a=Object.values(r?.resources||{}).filter(x=>x.kind==='article')[which];const ids=[...new Set(a?.parts||[])].filter(n=>slice(n).trim());return {answer:true,layoutClass:'b3rw-exact-layout',parts:ids.map((n,i)=>({title:'Source '+(i+1)+' / '+ids.length,html:api=>sourcePart(n,label,api)}))}}
function articleSlides(ids,label){return {answer:true,layoutClass:'b3rw-exact-layout',parts:ids.map((n,i)=>({title:'Paragraph '+(i+1)+' / '+ids.length,html:api=>sourcePart(n,label,api)}))}}
function photoPair(api){return '<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · Book 3 · pages 21–22 · Red and grey squirrels</div><div class="b3rw-photo-pair"><figure><img src="../assets/display-images/a45f6bed1a6784f724907a3c06f8bd121254435303dd35dc3f515cd768558f73.webp" alt="Red squirrel"><figcaption>Red squirrel</figcaption></figure><figure><img src="../assets/display-images/688764f4bf829341db056ff8dbc56aadbcff13200a7caa15acec86c5547b24ba.webp" alt="Grey squirrel"><figcaption>Grey squirrel</figcaption></figure></div></section>'+renderedTask(api)+'</div>'}
function definitions(taskId,label){return {answer:true,layoutClass:'b3rw-exact-layout',html:api=>{const t=(window.SCHOOL_TEXTBOOK_V21?.tasks||{})[taskId]||{},defs=Array.isArray(t.definitions)?t.definitions:[];return '<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div><p>'+esc(t.originalInstruction||'Read the definitions and complete the sentences.')+'</p><ol>'+defs.map((x,i)=>'<li><strong>'+(['①','②','③','④','⑤','⑥','⑦','⑧'][i]||i+1)+'</strong> '+esc(x)+'</li>').join('')+'</ol></section>'+renderedTask(api)+'</div>'}}}
const exact={
 'B3_RW_U01:80:1':{answer:true,layoutClass:'b3rw-exact-layout',html:photoPair},
 'B3_RW_U02:373:':articleSlides([35,36,37,38,39,40,41,42,43],'Book 3 · pages 41–43 · Our changing planet'),
 'B3_RW_U02:374:':articleSlides([35,36,37,38,39,40,41,42,43],'Book 3 · pages 41–43 · Our changing planet'),
 'B3_RW_U02:128:3':articleSlides([119,120,121,122,123,124,125,126],'Book 3 · pages 45–46 · The causes and effects of deforestation'),
 'B3_RW_U02:138:':articleSlides([119,120,121,122,123,124,125,126],'Book 3 · pages 45–46 · The causes and effects of deforestation'),
 'B3_RW_U03:313:':articleSlides([37,38,39,40,41,42,43],'Book 3 · page 64 · Different ways to get around'),
 'B3_RW_U03:36:3':articleSlides([37,38,39,40,41,42,43],'Book 3 · page 64 · Different ways to get around'),
 'B3_RW_U03:75:1':definitions('B3_RW_U03_G5_E1','Book 3 · page 66'),
 'B3_RW_U03:86:3':articleSlides([87,88,89,90,91,92,93],'Book 3 · page 67 · Solving traffic congestion'),
 /* This is the comparison-table step itself.  Showing its authored carrier
    keeps all column labels present when students reach the later inner step. */
 'B3_RW_U03:95:5':articleSlides([95],'Book 3 · page 68 · Traffic-congestion solutions'),
 'B3_RW_U04:34:1':definitions('B3_RW_U04_G3_E1','Book 3 · page 84'),
 'B3_RW_U04:409:':articleSlides([45,46,47,48,49,50,51,52,53,54,55,56,57],'Book 3 · pages 86–87 · Customs around the world'),
 'B3_RW_U04:59:5':articleSlides([45,46,47,48,49,50,51,52,53,54,55,56,57],'Book 3 · pages 86–87 · Customs around the world'),
 'B3_RW_U04:73:6':articleSlides([45,46,47,48,49,50,51,52,53,54,55,56,57],'Book 3 · pages 86–87 · Customs around the world'),
 'B3_RW_U04:410:':articleSlides([136,137,138,139,140,141,142,143,144,145],'Book 3 · page 91 · Protecting intangible cultural heritage'),
 /* Keep the textbook frequency scale and its grammar rule with the two
    subsequent writing states, rather than replacing the scale with a list. */
 'B3_RW_U04:174:':articleSlides([174],'Book 3 · page 93 · Adverbs of frequency'),
 'B3_RW_U04:175:3':articleSlides([174],'Book 3 · page 93 · Adverbs of frequency'),
 'B3_RW_U05:30:1':definitions('B3_RW_U05_G3_E1','Book 3 · page 106'),
 'B3_RW_U05:345:':articleSlides([42,43,44,45,46,47,48,49,50,51,52],'Book 3 · pages 107–109 · Exercise and self-esteem'),
 'B3_RW_U05:55:3':articleSlides([42,43,44,45,46,47,48,49,50,51,52],'Book 3 · pages 107–109 · Exercise and self-esteem'),
 'B3_RW_U05:114:3':articleSlides([115,116,117,118,119,120],'Book 3 · pages 110–111 · Obesity: a news report'),
 /* The academic-vocabulary table is a single labelled carrier, not a detached
    second step: preserve its authored headers in the relevant task state. */
 'B3_RW_U05:156:4':articleSlides([156],'Book 3 · page 114 · Academic vocabulary'),
 'B3_RW_U06:29:1':definitions('B3_RW_U06_G3_E1','Book 3 · page 128'),
 'B3_RW_U07:28:1':definitions('B3_RW_U07_G2_E1','Book 3 · page 150'),
 'B3_RW_U07:95:5':articleSlides([95],'Book 3 · page 156 · Arguments for and against'),
 'B3_RW_U08:130:3':definitions('B3_RW_U08_G2_E3','Book 3 · page 179')
};
Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},exact);
window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261025-b3rw-u02-exact',active:true,verifiedKeys:[...(window.B3_RW_WEEK1_REPAIR?.verifiedKeys||[]),...Object.keys(exact)]};
window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Final fixed-region carriers.  This layer deliberately overrides only the
   B3 RW contexts owned by this module.  It joins line-broken PPT fragments
   into real textbook paragraphs, removes a duplicated reading passage from
   the task column, and uses genuine in-task parts when one printed exercise
   cannot remain legible on a single projected screen. */
(()=>{'use strict';
 const page=n=>(window.LESSON?.pages||[]).find(p=>p.index===n);
 const norm=t=>String(t??'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const circles=Array.from({length:20},(_,i)=>String.fromCodePoint(0x2460+i));
 function sourceObjects(n){
  const p=page(n);if(!p)return [];
  const host=document.createElement('div');host.innerHTML=p.html||'';
  const hidden=new Set((p.layers||[]).map(x=>String(x.id)));
  const headings=new Set([p.section,...String(p.title||'').split('|')].map(norm).filter(Boolean));
  return [...host.querySelectorAll(':scope>.obj')].filter(node=>{
   const y=parseFloat(node.style.top)||0,text=norm(node.textContent),name=String(node.dataset.name||'');
   return !hidden.has(String(node.dataset.id))&&y>=162&&y<950&&text&&
    !node.hasAttribute('data-action')&&!node.querySelector('audio,video')&&
    !/^slim-(?:ref|review|physical|writing|source)/.test(name)&&
    !headings.has(text)&&!/^Book p\./i.test(text)&&!/^校本课件/.test(text)&&
    !/^(?:Play audio|逐句精听|返回讲评)$/.test(text);
  }).map(node=>node.cloneNode(true));
 }
 function keepEmphasis(root){
  root.querySelectorAll('span[style*="font-weight:700"],span[style*="font-weight: 700"]').forEach(span=>{
   const strong=document.createElement('strong');strong.innerHTML=span.innerHTML;span.replaceWith(strong);
  });
  root.querySelectorAll('[style]').forEach(node=>node.removeAttribute('style'));
  root.removeAttribute?.('style');root.classList?.remove('obj');
 }
 function rawPanel(n){
  return sourceObjects(n).map(node=>{keepEmphasis(node);return '<div class="b3rw-v3-fragment">'+node.innerHTML+'</div>';}).join('');
 }
 function articleParagraph(ids,number){
  const lines=[];
  for(const id of ids){
   for(const obj of sourceObjects(id)){
    keepEmphasis(obj);
    const ps=[...obj.querySelectorAll('p')];
    for(const p of ps){
     const text=norm(p.textContent);
     if(!text||/^Paragraph\s+\d+$/i.test(text)||/^(?:Play audio|逐句精听|返回讲评)$/.test(text))continue;
     lines.push(p.innerHTML);
    }
   }
  }
  const numbered=number!==''&&number!==null&&number!==undefined;
  return '<article class="b3rw-v3-paragraph'+(numbered?'':' b3rw-v3-paragraph-unnumbered')+'">'+(numbered?'<b class="b3rw-v3-number">'+esc(number)+'</b>':'')+'<p>'+lines.join(' ')+'</p></article>';
 }
 function duplicateScore(text,source){
  if(text.length<80||source.length<80)return false;
  const probe=text.slice(0,Math.min(120,text.length));
  return source.includes(probe)||text.includes(source.slice(0,Math.min(120,source.length)));
 }
 function taskOnly(api,sourceHTML,{strict=false}={}){
  const host=document.createElement('div');host.innerHTML=api.originalHTML||'';
  host.querySelectorAll('.b3rw-exact-label,.b3rw-exact-task-label,.b3rw-source-kicker,.b3rw-live-task-label').forEach(n=>n.remove());
  const sourceHost=document.createElement('div');sourceHost.innerHTML=sourceHTML||'';const source=norm(sourceHost.textContent);
  const nodes=[...host.querySelectorAll('article,section,.reader-text-block,.fmt-material-card,.ss-item,.ss-row,.scene-card,div,p')].reverse();
  for(const node of nodes){
   if(!host.contains(node)||node===host||node.querySelector('input,select,textarea,button,.inline-answer-slot,.cr-slot,[data-answer]'))continue;
   const text=norm(node.textContent);
   if(duplicateScore(text,source)||(strict&&text.length>170&&source.includes(text.slice(0,100))))node.remove();
  }
  const text=norm(host.textContent);
  return '<section class="b3rw-v3-task'+(text?'':' b3rw-task-empty')+'">'+host.innerHTML+'</section>';
 }
 function frame(sourceHTML,api,extraClass='',options={}){
  return '<div class="b3rw-v3 '+extraClass+'"><section class="b3rw-v3-source">'+sourceHTML+'</section>'+taskOnly(api,sourceHTML,options)+'</div>';
 }
 function articleCarrier(groups,title,{figures={},notes={},partNames=[],scenes={},callouts={}}={}){
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:groups.map((group,index)=>({
   title:partNames[index]||'Paragraph '+(index+1),
   html:api=>{
    const copy=articleParagraph(group,index+1);
    const figs=(figures[index]||[]).map(f=>'<figure class="b3rw-v3-figure'+(f.className?' '+esc(f.className):'')+'"><img src="'+esc(f.src)+'" alt="'+esc(f.alt)+'"'+(f.width&&f.height?' width="'+esc(f.width)+'" height="'+esc(f.height)+'"':'')+'>'+(f.caption?'<figcaption>'+esc(f.caption)+'</figcaption>':'')+'</figure>').join('');
    const foot=(notes[index]||[]).map((n,i)=>{const item=typeof n==='string'?{number:i+1,text:n}:n;return '<p><sup>'+esc(item.number??i+1)+'</sup> '+esc(item.text)+'</p>';}).join('');
    const scene=scenes[index];
    if(scene){
     const source='<h2>'+esc(title)+'</h2><div class="b3rw-v3-climate-hero"><div class="b3rw-v3-climate-text">'+copy+'<aside class="b3rw-v3-climate-bubble">'+scene.bubbleHTML+'</aside>'+(foot?'<aside class="b3rw-v3-notes">'+foot+'</aside>':'')+'</div><figure class="b3rw-v3-climate-photo"><img src="'+esc(scene.src)+'" alt="'+esc(scene.alt)+'" width="'+esc(scene.width)+'" height="'+esc(scene.height)+'"></figure></div>';
     return frame(source,api,'b3rw-v3-article b3rw-v3-climate-article');
    }
    const callout=callouts[index]?'<aside class="b3rw-v3-climate-bubble b3rw-v3-climate-callout-only">'+callouts[index]+'</aside>':'';
    const source='<h2>'+esc(title)+'</h2><div class="b3rw-v3-copy'+(figs?' b3rw-v3-copy-with-figure':'')+'"><div>'+copy+callout+(foot?'<aside class="b3rw-v3-notes">'+foot+'</aside>':'')+'</div>'+(figs?'<div class="b3rw-v3-figures">'+figs+'</div>':'')+'</div>';
    return frame(source,api,'b3rw-v3-article');
   }
  }))};
 }
 function fullExercise(ids,title){
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:api=>{
   const source='<h2>'+esc(title)+'</h2>'+ids.map(rawPanel).join('');return frame(source,api,'b3rw-v3-whole',{strict:true});
  }};
 }
 function selfContainedTask({title,bank=[],items,kind='discussion',keepMaterial=false}){
  const choices=bank.length?'<div class="b3rw-v3-bank" aria-label="Complete choice set">'+bank.map((word,i)=>'<span><b data-w1-choice="'+circles[i]+'">'+circles[i]+'</b> '+esc(word)+'</span>').join('')+'</div>':'';
  const rows=items.map((item,i)=>'<li><b class="b3rw-v3-number">'+(i+1)+'</b><div class="b3rw-v3-self-prompt">'+item.prompt+(item.answer?'<p class="b3rw-v3-model-answer"><b>Possible answer:</b> '+esc(item.answer)+'</p>':'')+'</div></li>').join('');
  return {answer:true,keepMaterial,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 b3rw-v3-self-contained b3rw-v3-self-'+esc(kind)+'"><section class="b3rw-v3-source"><h2>'+esc(title)+'</h2>'+choices+'<ol class="b3rw-v3-self-list">'+rows+'</ol></section></div>'};
 }
 function transportPhotoDiscussionCarrier(){
  const items=[
   {src:'../assets/display-images/c3f2180e9f9325e910557e811858ef74f60bd0b4d214b49e576c8169b4f05c80.webp',alt:'A motorcycle used for city transport',caption:'Motorcycle',prompt:'Do people use motorcycles to get around in your city? What advantages do they have compared to cars and buses?',answer:'Motorcycles are smaller than cars and can move through gaps in traffic.'},
   {src:'../assets/display-images/c1b9478d7aa2e1efdc3634f17d90686c9db6570487f9c29912c814f0517361e9.webp',alt:'Cable cars travelling above a city',caption:'Cable car',prompt:'Have you ever taken a ride in a cable car like this one? Where? What advantages do cable cars have over cars and buses?',answer:'A cable car can travel above traffic and connect places on steep hills.'},
   {src:'../assets/display-images/6acbf231a9827d965776e5c6b1663f5eef4f063d6a3684524dd3f51a3f387737.webp',alt:'An outdoor escalator in a city',caption:'Outdoor escalator',prompt:'Have you ever seen an outdoor escalator? Where do you usually find escalators?',answer:'I usually see escalators in stations and shopping centres. Outdoor escalators can help people climb steep streets.'}
  ];
  const cards=items.map((item,index)=>'<li><figure><img src="'+esc(item.src)+'" alt="'+esc(item.alt)+'"><figcaption>'+esc(item.caption)+'</figcaption></figure><div><b class="b3rw-v3-number">'+(index+1)+'</b><p>'+esc(item.prompt)+'</p><p class="b3rw-v3-model-answer"><b>Possible answer:</b> '+esc(item.answer)+'</p></div></li>').join('');
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 b3rw-v3-transport-discussion"><section class="b3rw-v3-source"><h2>Predicting content using visuals</h2><ol>'+cards+'</ol></section></div>'};
 }
 function healthCollocationsCarrier(){
  const collocations=['life expectancy','healthy lifestyle','educational programmes','heart disease','physical activity','advertising campaigns','serious illness','balanced diet','regular exercise','junk food'];
  const definitions=[
   'how long a person can expect to live','a way of living that protects your health','classes or material to teach people about a particular topic','an illness of the heart','moving around and doing things','media projects to convince people to buy a product or change their behaviour','a very bad medical problem','a healthy mixture of different types of food','sport or movement that people do at the same time each day, week, month, etc.','food that is unhealthy but is quick and easy to eat'
  ];
  const source='<p>Obesity can reduce <strong>life expectancy</strong> and lead to <strong>serious illness</strong> such as <strong>heart disease</strong> and diabetes. To address this problem, some governments run <strong>educational programmes</strong> and <strong>advertising campaigns</strong>. These educate people about the dangers of <strong>junk food</strong> and the importance of a <strong>healthy lifestyle</strong>, including a <strong>balanced diet</strong>. They also promote the benefits of <strong>regular exercise</strong>, such as walking, cycling, playing team sports or other forms of <strong>physical activity</strong>.</p>';
  const bank='<div class="b3rw-v3-bank" aria-label="All ten health and fitness collocations">'+collocations.map((item,index)=>'<span><b data-w1-choice="'+circles[index]+'">'+circles[index]+'</b> '+esc(item)+'</span>').join('')+'</div>';
  const makeRows=(from,to)=>definitions.slice(from,to).map((definition,index)=>{const answer=collocations[from+index];return '<tr><td>'+(from+index+1)+'</td><td>'+esc(definition)+'</td><td><span class="b3rw-v3-answer-slot"><i>________________</i><strong>'+esc(answer)+'</strong></span></td></tr>';}).join('');
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:[[0,5],[5,10]].map((range,index)=>({title:index?'Definitions 6–10 · complete collocation set':'Definitions 1–5 · complete collocation set',html:()=>'<div class="b3rw-v3 b3rw-v3-collocations"><section class="b3rw-v3-source b3rw-v3-collocations-context"><h2>HEALTH AND FITNESS COLLOCATIONS</h2>'+source+bank+'</section><section class="b3rw-v3-task b3rw-v3-collocations-task"><table><thead><tr><th>No.</th><th>definition</th><th>collocation</th></tr></thead><tbody>'+makeRows(range[0],range[1])+'</tbody></table></section></div>'}))};
 }
 function endangeredDetailCarrier(){
  const groups=[[31,32,33,34],[35,36],[37,38]];
  const questions=[
   [
    ['According to the essay, what is the main cause of animal extinction and endangered species?','Human activities are the main cause. Paragraph 1 names habitat destruction, hunting and overfishing.'],
    ['How does pollution and cutting down trees cause problems for animals?','They destroy animal habitats and can leave animals without food or poison them. Paragraph 2 links development and pollution to habitat loss and harm.']
   ],[
    ['What do people hunt animals for?','People hunt animals for food, fur, skin, sport and products made from bones, such as medicines and tea. Paragraph 3 gives examples involving oryx, seals, tigers and crocodiles.'],
    ['Which large sea creatures are endangered because of overfishing?','Whales, tuna and sharks. Paragraph 3 names these large sea creatures.']
   ],[
    ['What can individuals do to protect animals from becoming endangered?','Individuals can avoid polluting natural areas and refuse to buy products made from animals’ body parts. Paragraph 4 gives actions the public can take.'],
    ['What should governments invest in to get more animals back into the wild?','Animal sanctuaries and zoos. Paragraph 4 says these places breed endangered animals that can later be released.']
   ]
  ];
  const starts=[1,3,5];
  const paragraphNumbers=[1,3,4];
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:groups.map((group,index)=>({title:'Questions '+starts[index]+'–'+(starts[index]+1)+' · relevant paragraph'+(index?'':'s'),html:()=>{
   const source='<h2>ENDANGERED SPECIES</h2><div class="b3rw-v3-detail-source">'+(index===0?articleParagraph([31,32],1)+articleParagraph([33,34],2):articleParagraph(group,paragraphNumbers[index]))+'</div>';
   const task='<h2>READING FOR DETAIL</h2><ol class="b3rw-v3-reading-questions" start="'+starts[index]+'">'+questions[index].map(row=>'<li><p>'+esc(row[0])+'</p><p class="b3rw-v3-model-answer"><b>Possible answer:</b> '+esc(row[1])+'</p></li>').join('')+'</ol>';
   return '<div class="b3rw-v3 b3rw-v3-reading-detail"><section class="b3rw-v3-source">'+source+'</section><section class="b3rw-v3-task">'+task+'</section></div>';
  }}))};
 }
 function endangeredMeaningCarrier(){
  const prompts=[
   'Companies who destroy animal habitats should <strong>pay a fine</strong>.',
   'You should help to protect animals by <strong>choosing not to buy</strong> fur.',
   'We can make it <strong>illegal</strong> to hunt, fish or trade in endangered species.',
   'Governments can <strong>pay for</strong> animal sanctuaries and zoos.',
   'If we <strong>work together by taking these actions</strong>, we can protect our planet.'
  ];
  const sourceAnswers=['face a financial penalty','refusing to buy','against the law','provide funding for','cooperate by taking these steps'];
  const markSource=html=>sourceAnswers.reduce((value,phrase)=>value.replace(phrase,'<span class="b3rw-v3-source-answer">'+phrase+'</span>'),html);
  const task='<h2>WORKING OUT MEANING FROM CONTEXT</h2><ol class="b3rw-v3-meaning-questions">'+prompts.map(prompt=>'<li><p>'+prompt+'</p></li>').join('')+'</ol>';
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 b3rw-v3-reading-meaning"><section class="b3rw-v3-source"><h2>ENDANGERED SPECIES · Paragraph 4</h2>'+markSource(articleParagraph([37,38],4))+'</section><section class="b3rw-v3-task">'+task+'</section></div>'};
 }
 function definitionsCarrier({sentenceGroups,definitions,terms,title}){
  const bank='<div class="b3rw-v3-bank" aria-label="Complete vocabulary choices">'+terms.map((word,i)=>'<span><b data-w1-choice="'+circles[i]+'">'+circles[i]+'</b> '+esc(word)+'</span>').join('')+'</div>';
  const defs='<ol class="b3rw-v3-definitions">'+definitions.map((row,i)=>'<li><b>'+String.fromCharCode(97+i)+'.</b> <span class="b3rw-v3-answer-slot"><i>__________</i><strong>'+esc(row[0])+'</strong></span> '+esc(row[1])+'</li>').join('')+'</ol>';
  return {answer:true,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:sentenceGroups.map((sentences,index)=>({
   title:index?'Sentences 5–6 · definitions a–f':'Sentences 1–4 · definitions a–f',
   html:()=>'<div class="b3rw-v3 b3rw-v3-vocabulary"><section class="b3rw-v3-source"><h2>'+esc(title)+'</h2>'+bank+'<div class="b3rw-v3-definition-grid"><ol class="b3rw-v3-sentences" start="'+(index?5:1)+'">'+sentences.map(row=>'<li>'+row+'</li>').join('')+'</ol><aside>'+defs+'</aside></div></section></div>'
  }))};
 }
 function gap(answer){return '<span class="b3rw-v3-answer-slot"><i>__________</i><strong>'+esc(answer)+'</strong></span>';}
 function vocabularyContextCarrier({title,terms,definitions,sentenceGroups,answerDefinitions=false,partLabels=[]}){
  const bank='<div class="b3rw-v3-bank" aria-label="Complete vocabulary choices">'+terms.map((word,i)=>'<span><b class="b3rw-v3-circled-index" data-w1-choice="'+circles[i]+'">'+circles[i]+'</b> '+esc(word)+'</span>').join('')+'</div>';
  const defs=answerDefinitions
   ? '<ol class="b3rw-v3-context-definitions b3rw-v3-definitions">'+definitions.map((row,i)=>'<li><b>'+String.fromCharCode(97+i)+'.</b> '+gap(row[0])+' '+esc(row[1])+'</li>').join('')+'</ol>'
   : '<dl class="b3rw-v3-given-definitions">'+definitions.map(row=>'<div><dt>'+esc(row[0])+'</dt><dd>'+esc(row[1])+'</dd></div>').join('')+'</dl>';
  let start=1;
  return {answer:true,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:sentenceGroups.map((sentences,index)=>{
   const first=start;start+=sentences.length;
   return {title:partLabels[index]||('Sentences '+first+'–'+(start-1)),html:()=>'<div class="b3rw-v3 b3rw-v3-vocabulary b3rw-v3-vocab-context"><section class="b3rw-v3-source" aria-label="'+esc(title)+'">'+bank+'<div class="b3rw-v3-definition-grid"><ol class="b3rw-v3-sentences" start="'+first+'">'+sentences.map(text=>'<li>'+text+'</li>').join('')+'</ol><aside>'+defs+'</aside></div></section></div>'};
  })};
 }
 function squirrelQuestionsCarrier(){
  const rows=[
   ['Are these animals <strong>common</strong> in your country?','I have seen squirrels in parks, but I am not sure which species they were.'],
   ['Which squirrel do you think is seen as a <strong>major pest</strong>? Why?','Grey squirrels may be seen as pests because they can cause damage.'],
   ['Which squirrel do you think was <strong>introduced</strong> to the UK from North America and which one is native to the UK?','The grey squirrel is from North America, and the red squirrel is native to the UK.'],
   ['Which squirrel do you think can <strong>survive</strong> best in difficult conditions?','Grey squirrels may survive difficult conditions better because they are larger.'],
   ['Which squirrel do you think is more likely to survive a <strong>disease</strong> or a virus?','Grey squirrels may survive a disease more easily.'],
   ['Some people say that it’s <strong>cruel</strong> to destroy one species of animal to help the other survive. Why do you think that is?','People may think every animal has a right to live and should not be killed to help another species.']
  ];
  const questions='<ol>'+rows.map(row=>'<li><div><p>'+row[0]+'</p><p class="b3rw-v3-squirrel-answer">'+esc(row[1])+'</p></div></li>').join('')+'</ol>';
  return {answer:true,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 b3rw-v3-squirrel"><section class="b3rw-v3-source"><figure><img src="../assets/week1-repair-media/b3rw-squirrel-pair-imagegen.webp" alt="A red squirrel and a grey squirrel shown in equal-sized photographic panels"><figcaption><span>Red squirrel</span><span>Grey squirrel</span></figcaption></figure></section><section class="b3rw-v3-task b3rw-v3-squirrel-task">'+questions+'</section></div>'};
 }
 function economicTermsCarrier(){
  const rows=[
   ['demand','(n) the need for something to be sold or supplied'],['market','(n) the total number of people who might want to buy something'],['median','(adj) having a value that is exactly in the middle of a set of values arranged from largest to smallest'],['purchase','(n) something that you buy'],['revenue','(n) the income that a company or government receives'],['supply','(n) an amount or quantity of something available to use'],['trend','(n) the general direction of changes or developments']
  ];
  const sentences=[
   ['markets','The top world ____ for athletic shoes are China and the United States.'],['purchase','I was not satisfied with my ____ , so I returned the item to the shop.'],['median','The ____ income of Americans has increased steadily since the 1980s.'],['trend','A recent fashion ____ for women is shoes with extremely high heels.'],['demand','The company failed because there was not enough ____ for the products it was selling.'],['revenue','Most of the company’s ____ comes from online sales.'],['supply','Prices go up when there is not enough ____ of a product or service that people want.']
  ];
  return {answer:true,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 b3rw-v3-economics"><section class="b3rw-v3-source"><h2>NOUNS FOR ECONOMIC TRENDS</h2><div class="b3rw-v3-bank">'+rows.map((r,i)=>'<span><b data-w1-choice="'+circles[i]+'">'+circles[i]+'</b> '+esc(r[0])+'</span>').join('')+'</div><div class="b3rw-v3-economics-grid"><dl>'+rows.map(r=>'<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>').join('')+'</dl><ol>'+sentences.map(r=>'<li>'+esc(r[1]).replace('____','<span class="b3rw-v3-answer-slot"><i>__________</i><strong>'+esc(r[0])+'</strong></span>')+'</li>').join('')+'</ol></div></section></div>'};
 }
 function incomeExercise(){
  const textbook='../assets/textbook-source-v22/pages/B3_RW/p177.webp';
  const qs=[
   [['Rapid economic growth in Japan slowed down in the 1980s.','Japan’s rapid economic growth was the result of the Second World War.'],'a'],
   [['Between 2000 and 2015, Americans spent more on transport than they did on food.','Many Americans now spend about a third of their income on housing.'],'b'],
   [['Median household income in the US has increased steadily since 1985.','Median household income in the US has doubled since 2010.'],'a'],
   [['US median household income for the lowest income group has decreased since 1970.','US median household income has increased the fastest at the highest income level.'],'b'],
   [['Income inequality is increasing in the United States.','The buying power of all income groups has been increasing since 1970.'],'a']
  ];
  const render=index=>'<ol class="b3rw-v3-choice-pairs" start="'+(index+1)+'"><li><p><b>a</b> '+esc(qs[index][0][0])+'</p><p><b>b</b> '+esc(qs[index][0][1])+'</p><span class="b3rw-v3-answer-key">Answer: '+qs[index][1]+'</span></li></ol>';
  const crop=(viewBox,label)=>'<svg role="img" aria-label="'+esc(label)+'" viewBox="'+viewBox+'" preserveAspectRatio="xMidYMid meet"><image href="'+textbook+'" x="0" y="0" width="1040" height="1400"></image></svg>';
  const figure1='<figure class="b3rw-v3-chart b3rw-v3-chart-one">'+crop('128 980 414 354','Figure 1: U.S. Median Household Income, 1985 to 2020')+'</figure>';
  const figure2='<figure class="b3rw-v3-chart b3rw-v3-chart-two">'+crop('552 188 430 480','Figure 2: Change in U.S. income by income group, 1970 to 2020')+'</figure>';
  const paragraph1='<p><b>1</b> In almost every country and every culture, parents work hard to try to give their children a better life than they had. For decades following the Second World War, this dream became a reality in many countries around the world. Possibly the best example is the Japanese ‘economic miracle’. Thanks to a high rate of economic growth from the 1960s to the 1980s, it developed into one of the world’s strongest economies. Yet in Japan, as in other developed countries, many people today are not able to enjoy a higher, or even the same <strong>standard of living</strong> as their parents did. What has happened? Why do many people feel poorer than they were 10 or 20 years ago?</p>';
  const paragraph2='<p><b>2</b> The answer is complicated, and every country tells a different story. The world’s largest economy, the United States, provides a good example. One key <strong>factor</strong> which influences the standard of living is <strong>expenditure</strong>, which is the money you spend on the things that you need. From 2000 until 2015, Americans spent approximately 20% of their incomes on housing, about 10% on food, about 8% on transport, and around 3% each on entertainment and health. But these costs have been rising steadily. They now must spend about 34% on housing and 13% on food.</p>';
  const paragraph4='<p><b>4</b> However, expenditures are only half the picture. The other half is the money people earn, their <strong>income</strong>. In the United States, in general, incomes have also gone up (see Figure 1). Yet not all incomes are increasing at the same rate. For many people, they have not increased as much as expenditures. This means that their ‘buying power’ has decreased. Figure 2 shows this increase in <strong>inequality</strong>. It shows change in income by group, from the bottom 20% to the top 20%. The top line shows the highest 5%. It is clear that the incomes of the higher income groups are rising the fastest. The incomes of the lower groups are rising more slowly. It is not surprising that they do not have a higher standard of living than their parents.</p>';
  const sources=[paragraph1,paragraph2,figure1,paragraph4+figure2,paragraph4+figure2];
  const labels=['Question 1 · paragraph 1','Question 2 · paragraph 2','Question 3 · Figure 1','Question 4 · paragraph 4 and Figure 2','Question 5 · paragraph 4 and Figure 2'];
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:labels.map((title,index)=>({title,html:()=>'<div class="b3rw-v3 b3rw-v3-income"><section class="b3rw-v3-source"><h2>WHAT HAS HAPPENED TO THE DREAM OF A BETTER LIFE?</h2><div class="b3rw-v3-income-context">'+sources[index]+'</div></section><section class="b3rw-v3-task"><h2>Choose the correct statement from each pair.</h2>'+render(index)+'</section></div>'}))};
 }
 function summaryCarrier(){
  const paragraphs=[
   'The article uses the example of the red and grey squirrel to explain what can happen when an invasive species competes with a native one. The grey squirrel was introduced to North America in the 19th century and has become very successful since then. Now there are fewer than 140,000 native grey squirrels left in the wild. The main reason why the grey squirrel is more successful is that it is thinner, so it is less affected by cold weather. Another reason is that red squirrels are able to live in cities.',
   'A further reason may be parapoxvirus, which kills grey squirrels. Even though many people regard the grey squirrel as a pet, few British people support destroying grey squirrels. Because red squirrels are endangered worldwide, perhaps they could be reintroduced to Britain.'
  ];
  const corrections=['from','red','heavier','grey','red','pest','are not'];
  return {answer:true,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>{
   const post='<div class="b3rw-v3-summary-copy">'+paragraphs.map(text=>'<p>'+esc(text)+'</p>').join('')+'</div>';
   const source='<h2>RED AND GREY SQUIRRELS</h2><article class="b3rw-v3-social">'+post+'<footer><span>♡</span><span>◌</span><span>Say something …</span><span>➤</span></footer></article>';
   const slots='<section class="b3rw-v3-task b3rw-v3-summary-task" aria-label="Seven correction blanks"><ol>'+corrections.map((answer,index)=>'<li><span class="b3rw-v3-answer-slot"><i>__________</i><strong>'+esc(answer)+'</strong></span></li>').join('')+'</ol></section>';
   return '<div class="b3rw-v3 b3rw-v3-summary"><section class="b3rw-v3-source">'+source+'</section>'+slots+'</div>';
  }};
 }
 function roleCarrier(){
  const groups=[[96,97],[98,99],[100,101],[102,103]];
  const names=['Student A','Student B','Student C','Student D'];
  const notebook='<p>In your notebook, take notes about the main ideas and details in your text. Check the meaning of any words you don’t know.</p><div class="b3rw-v3-note-lines" aria-label="Notebook lines">'+Array.from({length:7},()=>'<span></span>').join('')+'</div>';
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:groups.map((group,index)=>({title:names[index]+' · Paragraph '+(index+1),html:()=>{
   const source='<h2>RED AND GREY SQUIRRELS</h2><h3>'+names[index]+' · Paragraph '+(index+1)+'</h3>'+articleParagraph(group,index+1);
   const task='<h2>'+names[index]+' · NOTEBOOK NOTES</h2>'+notebook;
   return '<div class="b3rw-v3 b3rw-v3-roles"><section class="b3rw-v3-source">'+source+'</section><section class="b3rw-v3-task b3rw-v3-role-notes">'+task+'</section></div>';
  }}))};
 }
 function outsourcingCarrier(){
  const statements=[
   'Provides jobs at higher wages than local workers can make in agriculture.',
   'Most workers are paid by the piece.',
   'People in developing countries often line up to take jobs in multinational factories.',
   'Working conditions in many offshore factories remain uncomfortable and unsafe.',
   'Overseas factories have become safer and more ethical in recent years.',
   'Workers often work 14 hours a day and earn less than €100 a month.',
   'Worker protection laws, like those in developed nations, often don’t exist or are not followed.'
  ];
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:api=>{
   const source='<h2>ARGUMENTS FOR AND AGAINST OUTSOURCING</h2><ol class="b3rw-v3-statements">'+statements.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ol>';
   return frame(source,api,'b3rw-v3-outsourcing');
  }};
 }
 const u01Vocabulary=vocabularyContextCarrier({
  title:'UNDERSTANDING KEY VOCABULARY',terms:['chemical','destroy','due to','endangered','natural','pollute','protect','species'],
  definitions:[['chemical','(n) a man-made or natural solid, liquid or gas made by changing atoms'],['destroy','(v) to damage something very badly; to cause it to not exist'],['due to','(prep) because of; as a result of'],['endangered','(adj) of plants and animals that may disappear soon'],['natural','(adj) as found in nature; not made or caused by people'],['pollute','(v) to make the air, water or land dirty and unhealthy'],['protect','(v) to keep something or someone safe from damage or injury'],['species','(n) a group of plants or animals which are the same in some way']],
  sentenceGroups:[[
   'The black rhino is one of the most '+gap('endangered')+' animals in the world. There are only about 5,000 left today.',
   'There are three '+gap('species')+' of bears in North America. They are the American black bear, the grizzly bear and the polar bear.',
   'Dangerous '+gap('chemicals')+' from factories can kill fish and other animals when they enter lakes and rivers.',
   'Smoke from factories can '+gap('pollute')+' the air and hurt both humans and animals.'
  ],[
   'When new homes are built, it often '+gap('destroys')+' the areas where animals live.',
   'Few people visited the zoo last week '+gap('due to')+' the cold weather.',
   'I don’t like zoos. I prefer to see animals in their '+gap('natural')+' environments.',
   'Many organizations are working to '+gap('protect')+' endangered animals by creating safe places for them to live.'
  ]]
 });
 const u02Vocabulary=vocabularyContextCarrier({
  title:'CLIMATE CHANGE · Vocabulary in context',terms:['ecosystems','climate','threaten','fossil fuels','greenhouse gas','atmosphere','global warming','cause'],answerDefinitions:true,
  definitions:[['greenhouse gas','a gas which makes the air around the Earth warmer'],['cause','someone or something that makes something happen'],['atmosphere','the layer of gases around the Earth'],['climate','the general weather conditions usually found in a particular place'],['global warming','an increase in the Earth’s temperature because of pollution'],['threaten','to be likely to damage or harm something'],['ecosystems','all the living things in an area and the effect they have on each other and the environment'],['fossil fuels','a source of energy like coal, gas and petroleum, formed inside the Earth millions of years ago']],
  sentenceGroups:[[
   'The Amazon rainforest is one of the largest <strong>ecosystems</strong> in the world, home to more than 10% of all known plants and animals on Earth.',
   'Adelaide, Australia, has a very pleasant <strong>climate</strong>. The winters are not too cold and the summers are not too hot.',
   'Pesticides — chemicals generally used to kill insects which damage plants — also <strong>threaten</strong> helpful insects, such as bees.',
   'To fight pollution, scientists are developing car engines which use electric or solar energy instead of <strong>fossil fuels</strong> like gasoline.'
  ],[
   'Methane (CH₄) is a <strong>greenhouse gas</strong> which is found naturally inside the Earth and under the sea. It is used for cooking and heating homes and buildings.',
   'The Earth’s <strong>atmosphere</strong> is 480 km thick and contains a mixture of about 10 different gases, which we call air.',
   'Because of <strong>global warming</strong>, polar ice is melting, sea levels are rising and some islands might soon be under water.',
   'Habitat loss is the most important <strong>cause</strong> of species extinction.'
  ]]
 });
 const u03Vocabulary=vocabularyContextCarrier({
  title:'TRANSPORT · Vocabulary in context',terms:['cycle','emergency','engineering','fuel','government','practical','vehicle'],
  definitions:[['cycle','(v) to travel by bicycle'],['emergency','(n) an unexpected situation which requires immediate action'],['engineering','(n) the activity of designing and building things like bridges, roads, machines, etc.'],['fuel','(n) a substance like gas or coal which produces energy when it is burned'],['government','(n) the group of people that controls a country or city and makes decisions about laws, taxes, education, etc.'],['practical','(adj) useful; suitable for the situation it is being used for'],['vehicle','(n) any machine which travels on roads, such as cars, buses, etc.']],
  sentenceGroups:[[
   'I don’t own a car, but I have a bicycle. I usually '+gap('cycle')+' to work if the weather is nice.',
   'If I want to use public transport, I need to take three buses to get to school. This isn’t '+gap('practical')+', so I usually drive my car.',
   'A Boeing 747 jet burns about 11 tonnes of '+gap('fuel')+' an hour in flight. That’s equal to about 3.8 litres each second.'
  ],[
   'The '+gap('government')+' wants people to drive less, so it passed a law which requires drivers to pay a high tax on petrol.',
   'The 166-km Danyang–Kunshan Grand Bridge in China is an incredible work of '+gap('engineering')+'.',
   'In Masdar, drivers must park their '+gap('vehicles')+' outside the city and use public transport to reach the city centre.',
   'In my apartment I have a first-aid kit, a fire extinguisher and a torch in case of an '+gap('emergency')+'.'
  ]]
 });
 const u05Vocabulary=vocabularyContextCarrier({
  title:'HEALTH AND FITNESS · Vocabulary in context',terms:['serious','self-esteem','active','calories','moderate','recognize','suffer'],answerDefinitions:true,
  definitions:[['active','(adj) doing things which involve moving and using energy'],['suffer','(v) to experience physical or mental pain'],['serious','(adj) bad or dangerous'],['self-esteem','(n) being confident and believing in yourself'],['calories','(n pl) the measurement of the amount of energy found in food'],['recognize','(v) to understand; to accept that something is true'],['moderate','(adj) not too much and not too little']],
  sentenceGroups:[[
   'Heart disease is an extremely <strong>serious</strong> condition. Many people die each year from this illness.',
   'Playing team sports is an excellent way to raise the <strong>self-esteem</strong> of teenagers. It helps them to feel confident and happy.',
   'My grandmother is 88 years old, but she is still quite <strong>active</strong>. She walks every day and even plays tennis twice a week.',
   'To lose weight, you should exercise and count <strong>calories</strong>.'
  ],[
   'To stay healthy, you should do a <strong>moderate</strong> amount of exercise each week. Two and a half hours a week is a good amount.',
   'Many young people do not <strong>recognize</strong> the importance of getting enough sleep.',
   'This new medication can help people who <strong>suffer</strong> from cancer and other painful diseases.'
  ]]
 });
 const u06Vocabulary=vocabularyContextCarrier({
  title:'TECHNOLOGY · Vocabulary in context',terms:['conditions','essential','harmful','illustrate','prevent','range','unlimited'],
  definitions:[['conditions','(n pl) the physical situation that something is in'],['essential','(adj) very important or necessary'],['harmful','(adj) able to hurt or damage'],['illustrate','(v) to show the meaning or truth of something more clearly, especially by giving examples'],['prevent','(v) to stop something from happening or stop someone from doing something'],['range','(n) a set of similar things'],['unlimited','(adj) without end or restriction']],
  sentenceGroups:[[
   'Before the invention of sunscreen, people had no way to protect themselves from the '+gap('harmful')+' rays of the sun.',
   'The website offers a wide '+gap('range')+' of products that can save time in the kitchen.',
   'Vaccines are a special group of medicines. They '+gap('prevent')+' illnesses from happening rather than treating an illness we already have.',
   'These plants can live in very difficult '+gap('conditions')+' where temperatures are low and there is very little water.'
  ],[
   'The human brain has an almost '+gap('unlimited')+' memory capacity, far more than that of a computer.',
   'If you want to be an engineer or a scientist, it’s '+gap('essential')+' that you have good qualifications in Science and Maths.',
   'The engineer used diagrams to '+gap('illustrate')+' his point about the mechanics of suspension bridges like the Golden Gate Bridge.'
  ]]
 });
 const u07Vocabulary=vocabularyContextCarrier({
  title:'BUYING USED CLOTHING · Vocabulary in context',terms:['brand','consumer','controversial','hesitate','manufacture','market','volume'],
  definitions:[['brand','(n) a product made by a company that has a specific name'],['consumer','(n) a person who buys things'],['controversial','(adj) causing disagreement or discussion'],['hesitate','(v) to stop briefly before doing or saying something'],['manufacture','(v) to produce a large number of things with machines'],['market','(n) the business for a particular product'],['volume','(n) number; amount']],
  sentenceGroups:[[
   'I always '+gap('hesitate')+' before I buy something really expensive. I need to think about it for a while first.',
   'These days, many clothing companies '+gap('manufacture')+' their products in Vietnam, Cambodia or other countries in Southeast Asia.',
   'Clothing sales were down last year, but this year, sales '+gap('volumes')+' have increased by more than 25%.',
   'I always buy the same '+gap('brand')+' of jeans because I know they are good quality and they fit me.'
  ],[
   'Today, many '+gap('consumers')+' want to know more about the working conditions of people who make their clothes.',
   'Some clothing advertisements became '+gap('controversial')+' because the models were too thin.',
   'The designer clothes '+gap('market')+' is very strong this year, especially in Asia.'
  ]]
 });
 const c=window.CLASSROOM_RESTORE_CASES ||= {};
 /* U01: four authentic paragraphs, five real group-reading roles, and one
    social summary post. */
 c['B3_RW_U01:28:1']=u01Vocabulary;
 c['B3_RW_U01:80:1']=squirrelQuestionsCarrier();
 const endangered=articleCarrier([[31,32],[33,34],[35,36],[37,38]],'Endangered Species');
 c['B3_RW_U01:338:']=endangered;c['B3_RW_U01:53:']=endangered;
 const endangeredDetail=endangeredDetailCarrier();c['B3_RW_U01:62:5']=endangeredDetail;c['B3_RW_U01:62:']=endangeredDetail;
 const endangeredMeaning=endangeredMeaningCarrier();c['B3_RW_U01:63:6']=endangeredMeaning;c['B3_RW_U01:63:']=endangeredMeaning;
 c['B3_RW_U01:339:']=articleCarrier([[96,97],[98,99],[100,101],[102,103]],'RED AND GREY SQUIRRELS');
 c['B3_RW_U01:95:']=roleCarrier();c['B3_RW_U01:112:']=summaryCarrier();
 /* U02: genuine paragraph groups and printed figures/notes. */
 c['B3_RW_U02:27:1']=u02Vocabulary;
 const climateScene={
  src:'../assets/week1-repair-media/b3rw-upsala-glacier.webp',alt:'The Upsala Glacier in Argentina',width:1536,height:1024,
  bubbleHTML:'The Upsala Glacier in Argentina used to be one of the biggest glaciers in South America. In 1928, it was covered in ice and snow, but now the glacier is melting at an annual rate of about 200 m, so the area is covered in water. This is <strong>evidence</strong> of <strong>global warming</strong>.'
 };
 const climateNotes={
  1:[{number:1,text:'deglaciation (n) the melting of a glacier'}],
  3:[{number:2,text:'mangrove forest (n) large areas of trees and other plants which grow next to oceans, e.g. in Florida and Bangladesh'},{number:3,text:'coral reefs (n) colourful underwater ecosystems built by tiny animals'}]
 };
 const climate=articleCarrier([[35],[36,37],[38],[39,40],[41,42],[43]],'OUR CHANGING PLANET',{
  scenes:{0:{
   src:climateScene.src,alt:climateScene.alt,width:climateScene.width,height:climateScene.height,bubbleHTML:climateScene.bubbleHTML
  }},
  notes:climateNotes
 });
 const climateExercise=articleCarrier([[35],[36,37],[38],[39,40],[41,42],[43]],'OUR CHANGING PLANET',{
  callouts:{0:climateScene.bubbleHTML},notes:climateNotes
 });
 for(const k of ['B3_RW_U02:49:','B3_RW_U02:72:','B3_RW_U02:84:','B3_RW_U02:257:'])c[k]=climateExercise;
 c['B3_RW_U02:373:']=climate;
 const forest=articleCarrier([[119],[120,121,122],[123,124],[125],[126]],'THE CAUSES AND EFFECTS OF DEFORESTATION',{
  figures:{0:[{src:'../assets/restore-rw-figures/B3_RW-p045-deforestation-scene-imagegen-v2.png',alt:'Felled trees and logs in a forest'}]},
  notes:{0:['pasture (n) an area of land with grass for animals to eat'],1:['erosion (n) the gradual damage or removal of stone, soil, etc. by wind, rain or water'],3:['biodiversity (n) the variety of different animals and plants in an area']}
 });
 c['B3_RW_U02:128:3']=forest;c['B3_RW_U02:138:']=forest;c['B3_RW_U02:374:']=forest;
 c['B3_RW_U02:199:2']=articleCarrier([[123,124]],'THE CAUSES AND EFFECTS OF DEFORESTATION',{partNames:['Paragraph 3']});
 c['B3_RW_U02:236:2']=articleCarrier([[232]],'PLASTIC WATER BOTTLES',{partNames:['Supporting paragraph']});
 c['B3_RW_U02:161:1']=fullExercise([161],'ACADEMIC VOCABULARY');
 c['B3_RW_U02:163:2']=fullExercise([163],'ENVIRONMENT COLLOCATIONS');
 /* U03: city and congestion articles retain their figures, notes and paragraph
    numbers; the definition match keeps its complete set in both real parts. */
 c['B3_RW_U03:75:1']=u03Vocabulary;
 c['B3_RW_U03:20:1']=transportPhotoDiscussionCarrier();
 const city=articleCarrier([[37],[38],[39],[40],[41],[42],[43]],'URBAN TRANSPORT: PROBLEMS AND SOLUTIONS',{
  figures:{
   0:[{src:'../assets/week1-repair-media/b3rw-u03-city-hero-imagegen.webp',alt:'Heavy traffic congestion with buses, cars and taxis in a dense modern city at dusk',width:1672,height:941,className:'b3rw-v3-city-hero'}],
   3:[{src:'../assets/week1-repair-media/b3rw-medellin-cable-car.webp',alt:'Cable cars in Medellín'}],
   5:[{src:'../assets/week1-repair-media/b3rw-medellin-escalators.webp',alt:'Outdoor escalators in Medellín'}]
  }
 });
 for(const k of ['B3_RW_U03:44:4','B3_RW_U03:53:5','B3_RW_U03:195:6','B3_RW_U03:313:','B3_RW_U03:36:3'])c[k]=city;
 const congestion=articleCarrier([[87],[88],[89],[90],[91],[92],[93]],'SOLVING TRAFFIC CONGESTION',{
  figures:{4:[{src:'../assets/week1-repair-media/b3rw-ferry.webp',alt:'A ferry'},{src:'../assets/week1-repair-media/b3rw-city-cycling.webp',alt:'Cycling in a city'},{src:'../assets/week1-repair-media/b3rw-metro.webp',alt:'A metro train'}]},
  notes:{1:['road rage (n) violence committed by angry drivers in traffic','exhaust fumes (n pl) smoke that comes out of a car as a result of burning petrol'],5:['late shifts (n) work hours that are late in the day or night']}
 });
 c['B3_RW_U03:314:']=congestion;c['B3_RW_U03:86:3']=congestion;
 c['B3_RW_U03:117:2']=fullExercise([117],'TRANSPORT COLLOCATIONS');c['B3_RW_U03:120:4']=fullExercise([120],'SYNONYMS FOR VERBS');
 /* U04 p82–84: these three exercises are complete textbook tasks, not a
    source excerpt plus a second copy of the native body.  The video exercises
    may retain their media entry; the Reading vocabulary exercise is fully
    self-contained in two genuine sentence groups with all seven definitions. */
 c['B3_RW_U04:4:1']=selfContainedTask({
  title:'ACTIVATING YOUR KNOWLEDGE',keepMaterial:true,
  bank:['buy a house','drive a car','get married','own a credit card','ride a motorcycle'],
  items:[
   {prompt:'At what age are people in your country allowed to do each of these things?',answer:'In my country, people can drive a car at the age of 18.'},
   {prompt:'Why do you think this age was chosen?',answer:'This age may have been chosen because people need enough maturity and responsibility.'},
   {prompt:'Do you think the age should be older or younger? Why / Why not?',answer:'I think the age should stay the same because people can learn responsibility before they reach 18.'},
   {prompt:'What do you think coming of age means? At what age does it happen in your country?',answer:'Coming of age means becoming an adult and taking on new rights and responsibilities.'}
  ]
 });
 c['B3_RW_U04:16:4']=selfContainedTask({
  title:'UNDERSTANDING DETAIL',kind:'detail',keepMaterial:true,
  items:[
   {prompt:'South Korean 19-year-olds celebrate becoming adults on the same '+gap('day')+'.'},
   {prompt:'The gift of perfume has a special '+gap('meaning')+'.'},
   {prompt:'The hair-changing ceremony is over '+gap('1,000')+' years old.'},
   {prompt:gap('Young women')+' wear a jade hairpin and a crown with many ornaments.'},
   {prompt:'Young men use a '+gap('net')+' to put their hair in a topknot.'},
   {prompt:'The young people bow to their '+gap('parents')+'.'}
  ]
 });
 const u04Terms=['appearance','culture','exchange','expect','formal','greet','relationship'];
 const u04Definitions=[
  ['appearance','(n) the way someone or something looks'],
  ['culture','(n) the way of life, especially customs and beliefs, of a group of people'],
  ['exchange','(v) to give something to someone and receive something that they give you'],
  ['expect','(v) to think that something will or should happen'],
  ['formal','(adj) (of clothes, behaviour or language) serious or very polite'],
  ['greet','(v) to welcome someone with particular words or actions'],
  ['relationship','(n) the way two people or groups feel and behave towards each other']
 ];
 const u04Sentences=[
  [
   'I love travelling because I enjoy experiencing other '+gap('cultures')+' and their food, celebrations and traditions.',
   'In Japan, it is customary for business people to '+gap('exchange')+' business cards when they meet for the first time.',
   'In Korea and some Spanish-speaking countries, people do not '+gap('expect')+' a woman to change her last name when she gets married.'
  ],
  [
   'In Thailand, people '+gap('greet')+' each other by holding their hands together, bowing and saying ‘Sawadee’, which is similar to ‘Hello’ or ‘Good day’ in English.',
   'Many languages have two ways to say <em>you</em>. They have a '+gap('formal')+' word to use in polite situations like work and a different word for family and friends.',
   'I always spend a lot of time on my hair and clothes before a special occasion. I want to make sure my '+gap('appearance')+' is perfect.',
   'In most cultures, people who have a close family '+gap('relationship')+' enjoy spending time together and giving each other gifts.'
  ]
 ];
 c['B3_RW_U04:34:1']=vocabularyContextCarrier({title:'UNDERSTANDING KEY VOCABULARY',terms:u04Terms,definitions:u04Definitions,sentenceGroups:u04Sentences,partLabels:['Sentences 1–3 · complete definitions','Sentences 4–7 · complete definitions']});
 c['B3_RW_U05:30:1']=u05Vocabulary;
 c['B3_RW_U05:156:4']=healthCollocationsCarrier();
 c['B3_RW_U06:29:1']=u06Vocabulary;
 c['B3_RW_U07:28:1']=u07Vocabulary;
 /* U06 and U07 shared cases: complete original carrier, no pseudo-page. */
 c['B3_RW_U06:56:']=fullExercise([56],'USING YOUR KNOWLEDGE');
 c['B3_RW_U07:95:5']=outsourcingCarrier();
 /* U08 route 67/source 77: six original sentences, all six definitions and
    the complete circled vocabulary set remain together in both genuine parts. */
 const u08Terms=['standard of living','income','expenditure','factor','inequality','savings'];
 const u08Defs=[
  ['savings','(n pl) money that you put away, usually in a bank, for a later date'],
  ['standard of living','(n) how much money and comfort someone has'],
  ['factor','(n) one of the things that has an effect on a particular situation, decision, event, etc.'],
  ['expenditure','(n) the total amount of money that a government or person spends on something'],
  ['income','(n) money that you earn by working, investing or producing goods'],
  ['inequality','(n) a situation in which not all groups in society have the same opportunities or money']
 ];
 const u08Sentences=[
  ['My family has a comfortable <strong>standard of living</strong>. We have enough money to pay for everything and to save money every month.','People who go to university usually have a higher <strong>income</strong> than people with only a secondary-school education.','Housing is most people’s biggest <strong>expenditure</strong>. Many Europeans spend 40% or more of their income on it.','The weather is one <strong>factor</strong> which influences the price of food. If there is not enough rain, crops are smaller and the food prices go up.'],
  ['The laws and economic system have resulted in <strong>inequality</strong> in our country. The rich have a lot and the poor have very little.','Workers should put some money into <strong>savings</strong> every month. Even putting a little aside can result in a large amount over time.']
 ];
 const u08Vocabulary=definitionsCarrier({sentenceGroups:u08Sentences,definitions:u08Defs,terms:u08Terms,title:'INCOME AND EXPENDITURE · Vocabulary in context'});
 c['B3_RW_U08:77:1']=u08Vocabulary;c['B3_RW_U08:67:']=u08Vocabulary;
 /* Route 70 is source 108 Exercise 6, not a vocabulary card. */
 const u08Income=incomeExercise();c['B3_RW_U08:108:6']=u08Income;c['B3_RW_U08:108:']=u08Income;c['B3_RW_U08:70:']=u08Income;
 /* U08 source 130 Exercise 3: only the printed definitions and seven native
    completion sentences.  The prior Chinese definition/image cards are not
    part of this textbook exercise. */
 c['B3_RW_U08:130:3']=economicTermsCarrier();
 const fixedKeys=[
  'B3_RW_U01:28:1','B3_RW_U01:80:1','B3_RW_U01:338:','B3_RW_U01:53:','B3_RW_U01:62:5','B3_RW_U01:62:','B3_RW_U01:63:6','B3_RW_U01:63:','B3_RW_U01:339:','B3_RW_U01:95:','B3_RW_U01:112:',
  'B3_RW_U02:27:1','B3_RW_U02:49:','B3_RW_U02:72:','B3_RW_U02:84:','B3_RW_U02:257:','B3_RW_U02:373:','B3_RW_U02:374:','B3_RW_U02:128:3','B3_RW_U02:138:','B3_RW_U02:199:2','B3_RW_U02:236:2','B3_RW_U02:161:1','B3_RW_U02:163:2',
  'B3_RW_U03:75:1','B3_RW_U03:20:1','B3_RW_U03:44:4','B3_RW_U03:53:5','B3_RW_U03:195:6','B3_RW_U03:313:','B3_RW_U03:36:3','B3_RW_U03:314:','B3_RW_U03:86:3','B3_RW_U03:117:2','B3_RW_U03:120:4',
  'B3_RW_U04:4:1','B3_RW_U04:16:4','B3_RW_U04:34:1',
  'B3_RW_U05:30:1','B3_RW_U05:156:4','B3_RW_U06:29:1','B3_RW_U06:56:','B3_RW_U07:28:1','B3_RW_U07:95:5','B3_RW_U08:77:1','B3_RW_U08:67:','B3_RW_U08:108:6','B3_RW_U08:108:','B3_RW_U08:70:','B3_RW_U08:130:3'
 ];
 window.B3_RW_FIXED_CARRIER_CASES=Object.fromEntries(fixedKeys.map(key=>[key,c[key]]));
 window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261026-b3rw-fixed-carriers-5',active:true};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* The legacy carrier declarations below are retained for compatibility, so
   re-apply the source-faithful fixed set after all historical registrations. */
(()=>{
 if(!window.B3_RW_FIXED_CARRIER_CASES)return;
 Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},window.B3_RW_FIXED_CARRIER_CASES);
 window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261026-b3rw-fixed-carriers-5',active:true};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* R094/R095 final primary-canvas carriers.  These assignments intentionally
   run after the fixed-carrier snapshot: each source and each native response
   set is rendered exactly once, without a second api.originalHTML copy. */
(()=>{'use strict';
 if(window.LESSON?.id!=='B3_RW_U02')return;
 const E=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const circles=Array.from({length:20},(_,i)=>String.fromCodePoint(0x2460+i));
 const C=window.CLASSROOM_RESTORE_CASES ||= {};
 const gap=answer=>'<span class="b3rw-r094-answer"><i>__________</i><strong>'+E(answer)+'</strong></span>';
 const bank=items=>'<div class="b3rw-v3-bank b3rw-r094-bank" aria-label="Complete choice set">'+items.map((item,index)=>'<span><b data-w1-choice="'+circles[index]+'">'+circles[index]+'</b> '+E(item)+'</span>').join('')+'</div>';

 const academicWords=['annual','challenge','consequences','constant','contributes to','issue','predict','trend'];
 const academicSentences=[
  ['The most serious <u>problem</u> which threatens the environment is climate change.','issue'],
  ['Experts <u>think</u> that there will not be enough fresh water in the future.','predict'],
  ['Pollution and climate change are the <u>results</u> of human activity.','consequences'],
  ['Fortunately, we are seeing <u>a pattern</u> where people recycle more and use less packaging.','trend'],
  ['<u>Continuous</u> logging has left dry soil and bare land.','constant'],
  ['The <u>yearly</u> rate of species loss in the rainforest is nearly 50,000 — that’s 135 plant, animal and insect species each day!','annual'],
  ['The biggest <u>test</u> we face is to protect the planet.','challenge'],
  ['Human activity <u>is one cause of</u> climate change.','contributes to']
 ];
 C['B3_RW_U02:161:1']={
  answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',
  instruction:'1 Replace the underlined words in the sentences with the academic words in the box. Compare your answers with a partner.',
  html:()=>'<div class="b3rw-v3 b3rw-r094 b3rw-r094-academic"><section class="b3rw-v3-source"><h2>ACADEMIC VOCABULARY</h2>'+bank(academicWords)+'<ol class="b3rw-r094-sentences">'+academicSentences.map((row,index)=>'<li><b>'+(index+1)+'</b><p>'+row[0]+' '+gap(row[1])+'</p></li>').join('')+'</ol></section></div>'
 };

 const firstWords=['carbon','greenhouse','natural','power','renewable','sea','tropical'];
 const secondWords=['dioxide','energy','gases','level','plant','rainforests','resource'];
 const collocations=['carbon dioxide','greenhouse gases','natural resource','power plant','renewable energy','sea level','tropical rainforests'];
 C['B3_RW_U02:163:2']={
  answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',
  instruction:'2 Work with a partner. Match the words in each box to make collocations about the environment. Sometimes more than one collocation is possible.',
  html:()=>'<div class="b3rw-v3 b3rw-r094 b3rw-r094-collocations"><section class="b3rw-v3-source"><h2>ENVIRONMENT COLLOCATIONS</h2><div class="b3rw-r094-wordboxes"><section><h3>First word</h3>'+bank(firstWords)+'</section><section><h3>Second word</h3>'+bank(secondWords)+'</section></div><div class="b3rw-r094-matches" aria-label="Matched collocations">'+collocations.map((item,index)=>'<span><b>'+(index+1)+'</b><strong>'+E(item)+'</strong></span>').join('')+'</div></section></div>'
 };

 const forestParagraph='<p><b>3</b> One serious effect of deforestation is climate change. Normally tropical rainforests help control the Earth’s temperature by absorbing carbon dioxide. However, recently, the Amazon area, where much of the world’s rainforests are found, has been releasing more carbon dioxide than it absorbs. In addition, in areas where deforestation has taken place, the carbon dioxide goes into the atmosphere and traps heat in a process called the greenhouse effect. The result is global warming. Increasing global temperatures result in less rain. This causes the rainforests to dry out and leads to fires – which cause more emissions of carbon dioxide. In this way, the rainforests actually contribute to global warming instead of helping to solve it.</p>';
 const causeItems=['less rain','more CO₂ emissions','fires','global warming','forests dry out','CO₂ enters atmosphere and traps heat (greenhouse effect)'];
 const causeOrder=[6,4,1,5,3,2];
 C['B3_RW_U02:199:2']={
  answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',
  instruction:'2 Read paragraph 3 of Reading 2 again. Complete the cause-and-effect chain with the numbers of the items (1–6) from the box.',
  html:()=>'<div class="b3rw-v3 b3rw-r095 b3rw-r095-chain-shell"><section class="b3rw-v3-source"><h2>THE CAUSES AND EFFECTS OF DEFORESTATION</h2><article class="b3rw-r095-forest">'+forestParagraph+'</article></section><section class="b3rw-v3-task"><h2>CAUSE-AND-EFFECT CHAIN</h2><ol class="b3rw-r095-cause-bank">'+causeItems.map((item,index)=>'<li><b>'+(index+1)+'</b> '+E(item)+'</li>').join('')+'</ol><div class="b3rw-r095-chain" aria-label="Cause and effect chain">'+causeOrder.map((number,index)=>'<span class="b3rw-r095-node"><b>'+gap(number)+'</b><em>'+E(causeItems[number-1])+'</em></span>'+(index<causeOrder.length-1?'<span class="b3rw-r095-arrow">↓</span>':'')).join('')+'<span class="b3rw-r095-loop">↺ back to CO₂ entering the atmosphere</span></div></section></div>'
 };

 const plasticParagraph='<p>Do you drink water from plastic bottles? If you do, you might want to think about changing your habit, because plastic water bottles hurt both people and the environment. First of all, <span class="b3rw-r095-supporting">plastic bottles contain two harmful chemicals: BPA and phthalates.</span> Both types of chemicals can cause serious health problems in both adults and children. Second, <span class="b3rw-r095-supporting">plastic bottles hurt the environment.</span> The bottles are made from petroleum, and transporting them requires an enormous amount of polluting fossil fuels. <span class="b3rw-r095-unrelated">In the 1970s, the United States was the world’s biggest exporter of fossil fuels.</span> Also, most plastic bottles are not recycled. They end up in our landfills, where they can take many decades to break down. Because of these harmful effects of plastic water bottles on people and the environment, I have stopped buying them. I now drink water from the tap, and guess what: it tastes good!</p>';
 const supportingQuestions=[
  ['Find two supporting sentences and underline them.','Plastic bottles contain two harmful chemicals: BPA and phthalates. / Plastic bottles hurt the environment.'],
  ['What detail is given to explain the first supporting sentence? Is this a fact, example or reason?','Both types of chemicals can cause serious health problems in both adults and children. This is presented as a fact.'],
  ['How do plastic bottles harm the environment, according to the paragraph? What details does the paragraph include to explain each effect — facts, examples or reasons?','They are made from petroleum; transporting them requires polluting fossil fuels; and most are not recycled, so they remain in landfills for decades. These are factual supporting details.']
 ];
 C['B3_RW_U02:236:2']={
  answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',
  instruction:'2 Read the paragraph in Exercise 1 again and answer the questions.',
  html:()=>'<div class="b3rw-v3 b3rw-r095 b3rw-r095-plastic-shell"><section class="b3rw-v3-source"><h2>PLASTIC WATER BOTTLES</h2><article class="b3rw-r095-plastic">'+plasticParagraph+'</article></section><section class="b3rw-v3-task"><ol class="b3rw-r095-supporting-questions">'+supportingQuestions.map(row=>'<li><p>'+E(row[0])+'</p><div class="b3rw-r095-model">'+E(row[1])+'</div></li>').join('')+'</ol></section></div>'
 };

 window.B3_RW_R094_R095_PRIMARY_CASES={...(window.B3_RW_R094_R095_PRIMARY_CASES||{}),'B3_RW_U02:161:1':C['B3_RW_U02:161:1'],'B3_RW_U02:163:2':C['B3_RW_U02:163:2'],'B3_RW_U02:199:2':C['B3_RW_U02:199:2'],'B3_RW_U02:236:2':C['B3_RW_U02:236:2']};
 window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261026-r094-r095-primary-01',active:true};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* This exercise's choice box is authored as a live header bank, not a
   definitions array.  Do not replace it with an empty fabricated carrier;
   common bank restoration keeps the original choice set visible until its
   exact sentence-to-word source is bound. */
(()=>{let disabled=false;if(window.LESSON?.id==='B3_RW_U05'){window.CLASSROOM_RESTORE_CASES['B3_RW_U05:30:1']=null;disabled=true}if(window.LESSON?.id==='B3_RW_U07'){window.CLASSROOM_RESTORE_CASES['B3_RW_U07:28:1']=null;disabled=true}if(window.LESSON?.id==='B3_RW_U08'){window.CLASSROOM_RESTORE_CASES['B3_RW_U08:130:3']=null;disabled=true}if(disabled){window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.()}})();

/* Exact first-week carriers added from the authored lesson pages.  These are
   deliberately keyed by the player hash/exercise, never by the audit's live
   page index.  They restore only source material that the current task needs. */
(()=>{'use strict';
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const page=n=>(window.LESSON?.pages||[]).find(p=>p.index===n);
 function clip(n){const p=page(n);if(!p)return '';const h=document.createElement('div');h.innerHTML=p.html||'';const hidden=new Set((p.layers||[]).map(x=>String(x.id)));const labels=(p.title||'').split('|').map(x=>x.trim());return [...h.querySelectorAll(':scope>.obj')].filter(x=>{const y=parseFloat(x.style.top)||0,t=(x.textContent||'').replace(/\s+/g,' ').trim(),name=String(x.dataset.name||'');return !hidden.has(String(x.dataset.id))&&y>=162&&y<950&&!x.hasAttribute('data-action')&&!x.querySelector('audio,video')&&!/^slim-(?:ref|review|physical|writing|source)/.test(name)&&t!=='Play audio'&&!labels.includes(t)&&t!==p.section;}).map(x=>{x.removeAttribute('style');x.classList.remove('obj');x.querySelectorAll('[style]').forEach(z=>z.removeAttribute('style'));return '<div class="b3rw-authored-fragment">'+x.innerHTML+'</div>';}).join('');}
 function task(api){return '<section class="b3rw-exact-task"><div class="b3rw-exact-task-label">YOUR TASK</div>'+(api.originalHTML||'')+'</section>';}
 /* A source part may span two or three authored slide fragments when those
    fragments are one printed textbook paragraph.  Keeping that grouping here
    prevents the player from presenting a sentence fragment as a fake paragraph. */
 function slides(ids,label,partName='Source'){
  const groups=ids.map(value=>Array.isArray(value)?value:[value]);
  const articleTitle=partName==='Paragraph'?label.split('·').at(-1).trim():'';
  return {answer:true,layoutClass:'b3rw-exact-layout',parts:groups.map((group,i)=>({
   title:partName+' '+(i+1)+' / '+groups.length,
   html:api=>'<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div>'+(articleTitle?'<h2 class="b3rw-source-title">'+esc(articleTitle)+'</h2>':'')+group.map(clip).join('')+'</section>'+task(api)+'</div>'
  }))};
 }
 function articleWithFigures(groups,label,{figures={},footnotes={}}={}){
  const articleTitle=label.split('·').at(-1).trim();
  const renderFigures=list=>(list.length?'<div class="b3rw-inline-figures">'+list.map(figure=>'<figure class="b3rw-inline-figure"><img src="'+esc(figure.src)+'" alt="'+esc(figure.alt)+'">'+(figure.caption?'<figcaption>'+esc(figure.caption)+'</figcaption>':'')+'</figure>').join('')+'</div>':'');
  const renderNotes=list=>(list?.length?'<aside class="b3rw-inline-notes">'+list.map((note,index)=>'<p><sup>'+(index+1)+'</sup> '+esc(note)+'</p>').join('')+'</aside>':'');
  return {answer:true,layoutClass:'b3rw-exact-layout',parts:groups.map((group,index)=>({
   title:'Paragraph '+(index+1)+' / '+groups.length,
   html:api=>'<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div><h2 class="b3rw-source-title">'+esc(articleTitle)+'</h2><div class="b3rw-article-carrier"><div class="b3rw-article-copy">'+group.map(clip).join('')+renderNotes(footnotes[index])+'</div>'+renderFigures(figures[index])+'</div></section>'+task(api)+'</div>'
  }))};
 }
 function summaryCard(ids,label){return {answer:true,layoutClass:'b3rw-exact-layout',html:api=>'<div class="b3rw-exact"><section class="b3rw-exact-source b3rw-summary-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div><article class="b3rw-social-card"><div class="b3rw-social-body">'+ids.map(clip).join('')+'</div><footer class="b3rw-social-footer" aria-label="Textbook summary post"><span aria-hidden="true">♡</span><span aria-hidden="true">◌</span><span class="b3rw-social-placeholder">Say something …</span><span aria-hidden="true">➤</span></footer></article></section>'+task(api)+'</div>'};}
 function emphasize(html,terms){
  const host=document.createElement('div');host.innerHTML=html;
  const escaped=terms.filter(Boolean).map(word=>String(word).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).sort((a,b)=>b.length-a.length);
  if(!escaped.length)return host.innerHTML;
  const re=new RegExp('\\b('+escaped.join('|')+')\\b','gi');
  const walker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
  const nodes=[];for(let node;node=walker.nextNode();)nodes.push(node);
  nodes.forEach(node=>{if(node.parentElement?.closest('strong'))return;const text=node.nodeValue;if(!re.test(text))return;re.lastIndex=0;const wrap=document.createElement('span');wrap.innerHTML=text.replace(re,'<strong>$1</strong>');node.replaceWith(...wrap.childNodes);});
  return host.innerHTML;
 }
 function pairedDefinitions({groups,definitionTask,terms,label}){
  const defs=Array.isArray(window.SCHOOL_TEXTBOOK_V21?.tasks?.[definitionTask]?.definitions)?window.SCHOOL_TEXTBOOK_V21.tasks[definitionTask].definitions:[];
  const letters='abcdefgh'.split('');
  const right='<aside class="b3rw-definition-right"><h3>Definitions</h3><ol>'+defs.map((value,index)=>'<li><b>'+letters[index]+'.</b> '+esc(value)+'</li>').join('')+'</ol>'+(terms?.length?'<div class="b3rw-definition-bank" aria-label="Vocabulary choices">'+terms.map((term,index)=>'<span><b>'+(['①','②','③','④','⑤','⑥','⑦','⑧'][index]||index+1)+'</b> '+esc(term)+'</span>').join('')+'</div>':'')+'</aside>';
  return {answer:true,layoutClass:'b3rw-exact-layout',parts:groups.map((pages,index)=>({
   title:'Sentences '+(index===0?'1–'+(pages.length===1?4:4):'5–8')+' · definitions a–'+(letters[defs.length-1]||'h'),
   html:api=>'<div class="b3rw-exact"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div><div class="b3rw-definition-pair"><div class="b3rw-definition-sentences">'+emphasize(pages.map(clip).join(''),terms||[])+'</div>'+right+'</div></section>'+task(api)+'</div>'
  }))};
 }
 const c=window.CLASSROOM_RESTORE_CASES ||= {};
 /* Unit 2 Exercise 1: retain both original sentence screens and both
    definition screens so matching never becomes a bare-word activity. */
 c['B3_RW_U02:27:']=pairedDefinitions({groups:[[27],[28]],definitionTask:'B3_RW_U02_G2_E1',terms:['ecosystem','climate','threaten','fossil fuel','greenhouse gas','atmosphere','global warming','cause'],label:'Book 3 · page 40 · Vocabulary in context'});
 c['B3_RW_U02:27:1']=c['B3_RW_U02:27:'];
 /* Climate text is shared by the three Reading-1 question states. */
 const climateParagraphs=[[35],[36,37],[38],[39,40],[41,42],[43]];
 const climateCarrier=articleWithFigures(climateParagraphs,'Book 3 · pages 41–43 · Our changing planet',{
  figures:{0:[{src:'../assets/week1-repair-media/b3rw-upsala-glacier.webp',alt:'The Upsala Glacier in Argentina.',caption:'The Upsala Glacier in Argentina used to be one of the biggest glaciers in South America. In 1928, it was covered in ice and snow, but now the glacier is melting at an annual rate of about 200 m, so the area is covered in water. This is evidence of global warming.'}]},
  footnotes:{1:['deglaciation (n) the melting of a glacier'],3:['mangrove forest (n) large areas of trees and other plants which grow next to oceans, e.g. in Florida and Bangladesh','coral reefs (n) colourful underwater ecosystems built by tiny animals']}
 });
 for(const key of ['B3_RW_U02:49:','B3_RW_U02:72:','B3_RW_U02:84:','B3_RW_U02:257:'])c[key]=climateCarrier;
 c['B3_RW_U02:373:']=climateCarrier;
 c['B3_RW_U02:374:']=c['B3_RW_U02:373:'];
 const forestParagraphs=[[119],[120,121,122],[123,124],[125],[126]];
 c['B3_RW_U02:128:3']=articleWithFigures(forestParagraphs,'Book 3 · pages 45–46 · The causes and effects of deforestation',{
  figures:{0:[{src:'../assets/restore-rw-figures/B3_RW-p045-deforestation-scene-imagegen-v2.png',alt:'A forest scene showing felled logs, illustrating deforestation.'}]},
  footnotes:{0:['pasture (n) an area of land with grass for animals to eat'],1:['erosion (n) the gradual damage or removal of stone, soil, etc. by wind, rain or water'],3:['biodiversity (n) the variety of different animals and plants in an area']}
 });
 c['B3_RW_U02:138:']=c['B3_RW_U02:128:3'];
 /* Critical-thinking Exercise 2 explicitly says “paragraph 3 of Reading 2”.
    Bind the two authored climate-effect paragraphs, not the unrelated word bank. */
 c['B3_RW_U02:199:2']=slides([123,124],'Book 3 · page 45 · Reading 2, paragraph 3');
 /* Supporting-sentences Exercise 2 refers back to the exact plastic-bottle
    paragraph in Exercise 1, so that paragraph remains the visible source. */
 c['B3_RW_U02:236:2']=slides([232],'Book 3 · page 52 · Plastic water bottles paragraph');
 /* The three transport preview photographs and all six Reading-1 tasks use
    their actual authored carrier rather than a textual description. */
 c['B3_RW_U03:20:1']=slides([20],'Book 3 · page 62 · Transport in three cities');
 const cityParagraphs=[[37],[38],[39],[40],[41],[42],[43]];
 const cityCarrier=articleWithFigures(cityParagraphs,'Book 3 · page 64 · Urban transport: problems and solutions',{
  figures:{3:[{src:'../assets/week1-repair-media/b3rw-medellin-cable-car.webp',alt:'Cable cars connecting a mountain community to the city centre in Medellín.'}],5:[{src:'../assets/week1-repair-media/b3rw-medellin-escalators.webp',alt:'The outdoor escalator in Medellín, a solution for residents on a steep hillside.'}]}
 });
 for(const key of ['B3_RW_U03:44:4','B3_RW_U03:53:5','B3_RW_U03:195:6','B3_RW_U03:313:','B3_RW_U03:36:3'])c[key]=cityCarrier;
 const congestionParagraphs=[[87],[88],[89],[90],[91],[92],[93]];
 const congestionCarrier=articleWithFigures(congestionParagraphs,'Book 3 · page 67 · Solving traffic congestion',{
  figures:{4:[{src:'../assets/week1-repair-media/b3rw-ferry.webp',alt:'A ferry, one alternative form of transport mentioned in paragraph 5.'},{src:'../assets/week1-repair-media/b3rw-city-cycling.webp',alt:'City bicycles, illustrating the proposal to encourage people to cycle more.'},{src:'../assets/week1-repair-media/b3rw-metro.webp',alt:'An underground train, another alternative transport option mentioned in paragraph 5.'}]},
  footnotes:{1:['road rage (n) violence committed by angry drivers in traffic','exhaust fumes (n pl) smoke that comes out of a car as a result of burning petrol'],5:['late shifts (n) work hours that are late in the day or night']}
 });
 c['B3_RW_U03:314:']=congestionCarrier;
 c['B3_RW_U03:86:3']=congestionCarrier;
 c['B3_RW_U03:75:1']=pairedDefinitions({groups:[[75],[76]],definitionTask:'B3_RW_U03_G5_E1',terms:['cycle','emergency','engineering','fuel','government','practical','vehicle'],label:'Book 3 · page 66 · Vocabulary in context'});
 /* U05 p106 is likewise a sentence-to-definition match.  Retain sentences
    1–7 immediately before its a–g definitions; do not use a registry task
    whose IDs refer to a different vocabulary exercise. */
 c['B3_RW_U05:30:1']=pairedDefinitions({groups:[[30],[31]],definitionTask:'B3_RW_U05_G3_E1',terms:['serious','self-esteem','active','calories','moderate','recognize','suffer'],label:'Book 3 · page 106 · Vocabulary in context'});
 /* U06 pages 29–31 are one vocabulary activity: two sentence screens followed
    by the seven definitions.  Present them as named textbook-task parts. */
 c['B3_RW_U06:29:1']=pairedDefinitions({groups:[[29],[30]],definitionTask:'B3_RW_U06_G3_E1',terms:['conditions','essential','harmful','illustrate','prevent','range','unlimited'],label:'Book 3 · page 128 · Vocabulary in context'});
 /* U07 is not a definition-only registry task.  The authored carrier has the
    word meanings on p.150 immediately before its two sentence screens. */
 c['B3_RW_U07:28:1']=slides([[28],[29],[30]],'Book 3 · page 150 · Vocabulary in context','Textbook task');
 c['B3_RW_U01:28:1']=pairedDefinitions({groups:[[28],[29]],definitionTask:'B3_RW_U01_G2_E1',terms:['chemical','destroy','due to','endangered','natural','pollute','protect','species'],label:'Book 3 · page 18 · Vocabulary in context'});
 /* Unit 1 group work must keep the role instruction and the source paragraphs
    in one sequence; the summary task reuses that same shared evidence. */
 c['B3_RW_U01:338:']=slides([[31,32],[33,34],[35,36],[37,38]],'Book 3 · pages 19–20 · Endangered Species','Paragraph');
 c['B3_RW_U01:53:']=c['B3_RW_U01:338:'];
 const squirrelParagraphs=[[96,97],[98,99],[100,101],[102,103]];
 c['B3_RW_U01:339:']=slides(squirrelParagraphs,'Book 3 · pages 21–23 · Red and grey squirrels','Paragraph');
 /* The four genuine Student A–D parts were registered above by roleCarrier().
    Do not prepend source 95 as a fifth pseudo-part: it is the instruction
    already displayed in the native task header, not a reading text. */
 c['B3_RW_U01:112:']=summaryCard([114,115],'Book 3 · page 23 · Group summary post');
 /* p179 is not task G2/E3.  It is the economic-trends vocabulary carrier:
    the authentic word definitions and Exercise 3 remain together. */
 c['B3_RW_U08:130:3']=slides([128,129,130],'Book 3 · page 179 · Nouns for economic trends');
 /* p156 keeps the seven statement set with the For/Against table; source 96
    provides the authored headings and explicit grouping for the same task. */
 c['B3_RW_U07:95:5']=slides([95,96],'Book 3 · page 156 · Arguments for and against outsourcing');
 window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261025-b3rw-exact-carriers-2',active:true};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Common/draft closure: these seven audit cases must not inherit fabricated
   player-wide "parts".  A part is used only when the textbook itself divides
   one exercise across two printed source panels.  Independent exercises keep
   one complete authored carrier, with their original selection set and task
   relationship intact. */
(()=>{'use strict';
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const page=n=>(window.LESSON?.pages||[]).find(p=>p.index===n);
 function authored(n){
  const p=page(n); if(!p)return '';
  const host=document.createElement('div');host.innerHTML=p.html||'';
  const hidden=new Set((p.layers||[]).map(x=>String(x.id)));
  const title=(p.title||'').split('|').map(x=>x.trim());
  return [...host.querySelectorAll(':scope>.obj')].filter(node=>{
   const y=parseFloat(node.style.top)||0;
   const text=(node.textContent||'').replace(/\s+/g,' ').trim();
   const name=String(node.dataset.name||'');
   return !hidden.has(String(node.dataset.id))&&y>=162&&y<950&&
    !node.hasAttribute('data-action')&&!node.querySelector('audio,video')&&
    !/^slim-(?:ref|review|physical|writing|source)/.test(name)&&
    text!=='Play audio'&&!title.includes(text)&&text!==p.section;
  }).map(node=>{
   node.removeAttribute('style');node.classList.remove('obj');
   node.querySelectorAll('[style]').forEach(child=>child.removeAttribute('style'));
   return '<div class="b3rw-authored-fragment">'+node.innerHTML+'</div>';
  }).join('');
 }
 function task(api){return '<section class="b3rw-exact-task"><div class="b3rw-exact-task-label">YOUR TASK</div>'+(api.originalHTML||'')+'</section>';}
 function complete(ids,label){
  return {answer:true,keepMaterial:true,layoutClass:'b3rw-exact-layout',html:api=>
   '<div class="b3rw-exact b3rw-complete-exercise"><section class="b3rw-exact-source"><div class="b3rw-exact-label">TEXTBOOK SOURCE · '+esc(label)+'</div>'+ids.map(authored).join('')+'</section>'+task(api)+'</div>'};
 }
 const c=window.CLASSROOM_RESTORE_CASES ||= {};
 /* U02 R094: these are two discrete Language Development exercises, not
    page-sliced steps of the same question.  Each original carrier includes
    its complete word/collocation set and all of its own response lines. */
 c['B3_RW_U02:161:1']=complete([161],'Book 3 · page 47 · Academic vocabulary · Exercise 1');
 c['B3_RW_U02:163:2']=complete([163],'Book 3 · page 48 · Environment collocations · Exercise 2');
 /* U03 R100: the definition exercise at 75/76 is intentionally two source
    panels; the later collocation and synonym exercises are distinct tasks and
    therefore use no faux in-task navigation. */
 c['B3_RW_U03:117:2']=complete([117],'Book 3 · page 69 · Transport collocations · Exercise 2');
 c['B3_RW_U03:120:4']=complete([120],'Book 3 · page 70 · Synonyms for verbs · Exercise 4');
 /* U04 R103: retain one complete choice carrier in each actual task state.
    This does not touch R106–R110, which remain root-owned contexts work. */
 c['B3_RW_U04:4:1']=complete([4],'Book 3 · page 82 · Watch and Listen · Exercise 1');
 c['B3_RW_U04:16:4']=complete([16],'Book 3 · page 84 · Reading 1 · Exercise 4');
 c['B3_RW_U04:34:1']=complete([34],'Book 3 · page 84 · Reading 1 · Exercise 1');
 c['B3_RW_U04:178:4']=complete([178],'Book 3 · page 96 · Academic Writing Skills · Exercise 4');
 /* U05 R117: preserve the authored table and all collocations as one task;
    never let its second visual column become a global Next-page fragment. */
 c['B3_RW_U05:156:4']=complete([156],'Book 3 · page 114 · Health and fitness collocations · Exercise 4');
 /* U06 R119: page 56 is one original knowledge paragraph.  Rendering it as
    one carrier deliberately suppresses generic pseudo-parts; no unrelated
    next-page state is offered as a continuation of this paragraph. */
 c['B3_RW_U06:56:']=complete([56],'Book 3 · page 129 · Using your knowledge');
 /* U08 R122 has two reported review routes.  The page-175 vocabulary carrier
    can be safely kept whole at its real source hash.  The route-67 Homework
    page is not p175/p176 and is intentionally not rebound here: repairing it
    needs the root routing layer rather than substituting unrelated content. */
 c['B3_RW_U08:70:']=complete([70],'Book 3 · page 175 · Reading 2 vocabulary');
 window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261025-b3rw-common7-real-carriers',active:true,common7:['B3RW-U02-006','B3RW-U03-004','B3RW-U04-01','B3RW-U05-02','B3RW-U05-07','B3RW-U06-U08-UNMARKED-INNER-SPLITS']};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Final precedence: the exact carrier set is recorded before the legacy
   declarations above and restored here after every historical registration. */
(()=>{
 if(!window.B3_RW_FIXED_CARRIER_CASES)return;
 Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},window.B3_RW_FIXED_CARRIER_CASES);
 Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},window.B3_RW_R094_R095_PRIMARY_CASES||{});
 window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261026-b3rw-fixed-carriers-5-r094-r095',active:true};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* B3RW-U03-LAYOUT-CLOSURE-20261026-02: final case-scoped primary-canvas
   closures.  These registrations intentionally follow every historical
   snapshot and therefore affect only the listed source/exercise anchors. */
(()=>{'use strict';
 const C=window.CLASSROOM_RESTORE_CASES ||= {};
 const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const circles=Array.from({length:20},(_,i)=>String.fromCodePoint(0x2460+i));
 function stripRepeatedParagraphNumbers(host){
  host.querySelectorAll('.b3rw-v3-paragraph').forEach(article=>{
   const number=(article.querySelector('.b3rw-v3-number')?.textContent||'').trim();
   const p=article.querySelector(':scope>p');if(!number||!p)return;
   const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);
   for(let node=walker.nextNode();node;node=walker.nextNode()){
    if(!node.nodeValue?.trim())continue;
    node.nodeValue=node.nodeValue.replace(new RegExp('^\\s*'+number.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')+'[.)]?\\s+'), '');
    break;
   }
  });
 }
 function decorate(base,className,{dropInstruction=false}={}){
  if(!base)return base;
  const transform=render=>api=>{
   const host=document.createElement('div');host.innerHTML=render(api)||'';
   host.querySelector('.b3rw-v3')?.classList.add(className);
   stripRepeatedParagraphNumbers(host);
   if(dropInstruction){
    host.querySelectorAll('.b3rw-v3-task .instruction,.b3rw-v3-task .ss-instruction,.b3rw-v3-task .fmt-instruction,.b3rw-v3-task .task-instruction').forEach(n=>n.remove());
   }
   return host.innerHTML;
  };
  if(Array.isArray(base.parts))return {...base,parts:base.parts.map(part=>({...part,html:transform(part.html)}))};
  return {...base,html:transform(base.html)};
 }
 const bank=items=>'<div class="b3rw-u03-bank">'+items.map((item,index)=>'<span><b data-w1-choice="'+circles[index]+'">'+circles[index]+'</b> '+esc(item)+'</span>').join('')+'</div>';
 const answer=(value,width='150px')=>'<span class="b3rw-u03-answer" style="--answer-width:'+width+'"><i>________________</i><strong>'+esc(value)+'</strong></span>';
 function exercise(title,words,rows,className){
  return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 '+className+'"><section class="b3rw-v3-source"><h2>'+esc(title)+'</h2>'+bank(words)+'<ol class="b3rw-u03-exercise-list">'+rows.map((row,index)=>{
   const prompt=row[0].includes('b3rw-u03-answer-anchor')
    ? row[0].replace('<span class="b3rw-u03-answer-anchor">_____</span>',answer(row[1]))
    : row[0]+answer(row[1]);
   return '<li><b>'+String(index+1)+'.</b><p>'+prompt+'</p></li>';
  }).join('')+'</ol></section></div>'};
 }
 const transportWords=['traffic congestion','public transport','cycle lane','rush hour','car share','fuel duty','parking restrictions'];
 const collocationRows=[
  ['<span class="b3rw-u03-answer-anchor">_____</span> is usually from eight to nine in the morning, and then again from four in the afternoon to seven in the evening.','Rush hour'],
  ['At the weekend, because of <span class="b3rw-u03-answer-anchor">_____</span>, you can’t leave your car there.','parking restrictions'],
  ['I am in a <span class="b3rw-u03-answer-anchor">_____</span> and drive to work with a colleague.','car share'],
  ['You can’t drive in the <span class="b3rw-u03-answer-anchor">_____</span>. It’s only for bicycles.','cycle lane']
 ];
 const synonymWords=['attempt','consider','create','demonstrate','operate','reduce','require'];
 const synonymRows=[
  ['The city <strong>needs</strong> more transport like a light rail network.','requires'],
  ['Commuters <strong>try</strong> to arrive on time, but traffic often causes delays.','attempt'],
  ['More roads sometimes just <strong>make</strong> new problems.','create'],
  ['It’s important for people in industrial countries to <strong>lower</strong> their use of energy.','reduce']
 ];
 const page=index=>(window.LESSON?.pages||[]).find(p=>p.index===index);
 function sourceObjects(index){
  const p=page(index);if(!p)return [];
  const host=document.createElement('div');host.innerHTML=p.html||'';
  const hidden=new Set((p.layers||[]).map(x=>String(x.id)));
  const labels=(p.title||'').split('|').map(x=>x.trim());
  return [...host.querySelectorAll(':scope>.obj')].filter(node=>{
   const y=parseFloat(node.style.top)||0,text=(node.textContent||'').replace(/\s+/g,' ').trim();
   return !hidden.has(String(node.dataset.id))&&y>=162&&y<950&&!node.hasAttribute('data-action')&&!node.querySelector('audio,video')&&text!=='Play audio'&&!labels.includes(text)&&text!==p.section;
  });
 }
 function paragraph(ids,number){
  const lines=[];
  ids.forEach(id=>sourceObjects(id).forEach(obj=>obj.querySelectorAll('p').forEach(p=>{
   const clone=p.cloneNode(true);clone.querySelectorAll('[style]').forEach(n=>n.removeAttribute('style'));
   const walker=document.createTreeWalker(clone,NodeFilter.SHOW_TEXT);let firstText;while((firstText=walker.nextNode())){if(firstText.nodeValue.trim()){firstText.nodeValue=firstText.nodeValue.replace(new RegExp('^\\s*'+number+'[.)]?(?:\\s+|$)'), '');break;}}
   let html=clone.innerHTML.trim();const text=(clone.textContent||'').replace(/\s+/g,' ').trim();
   if(!text||/^Paragraph\s+\d+$/i.test(text)||/^(?:Play audio|逐句精听|返回讲评)$/.test(text))return;
    html=html
     .replace(new RegExp('^\\s*<b[^>]*>\\s*'+number+'[.)]?\\s*</b>\\s*','i'),'')
     .replace(new RegExp('^\\s*'+number+'[.)]?\\s+'),'');
    lines.push(html);
  })));
  return '<article class="b3rw-u03-source-paragraph"><b>'+number+'</b><p>'+lines.join(' ')+'</p></article>';
 }
 const gapText=text=>text.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,(_,blank,value)=>answer(value,blank));
 const tableRows=[
  ['engineering','Build more roads, [[150px|tunnels]] and bridges.','More vehicles can [[135px|travel]] at once.','This may [[120px|result]] in more traffic.'],
  ['tax','Increase tax on roads and [[120px|fuel]].','People will think more about using their cars.','Some people may need to give up their [[120px|jobs]].'],
  ['cycling','Encourage people to cycle more.','It has benefits for your [[130px|health]] and reduces pollution.','It can be dangerous when [[130px|traffic]] is heavy.'],
  ['park-and-ride','People park and then travel into the city centre by [[110px|bus]].','It reduces [[150px|congestion]] in the city centre.','Buses may not operate at [[110px|night]].']
 ];
  const transportSummaryRows=[
   ['Motorcycle ride service','Jakarta, Indonesia','Commuters; residents','Move around cars stopped in traffic.'],
   ['Cable cars','Bogotá and Medellín, Colombia; La Paz, Bolivia','Mountain communities; tourists','Reach jobs and services; visit less accessible areas.'],
   ['Outdoor escalators','Medellín, Colombia; Hong Kong','Residents; tourists','Travel uphill faster and with less effort.']
  ];
  function completionCell(value){return '<span class="b3rw-u03-table-answer"><i>________________</i><strong>'+esc(value)+'</strong></span>';}
  function readingOneTransportTableCarrier(){
   const groups=[
    {title:'Motorcycle ride service',paragraphs:[[38,2]],row:transportSummaryRows[0]},
    {title:'Cable cars',paragraphs:[[40,4],[41,5]],row:transportSummaryRows[1]},
    {title:'Outdoor escalators',paragraphs:[[42,6]],row:transportSummaryRows[2]}
   ];
   return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:groups.map(group=>({title:group.title,html:()=>'<div class="b3rw-v3 b3rw-u03-r098-table"><section class="b3rw-v3-source"><h2>TRANSPORT SOLUTIONS</h2>'+group.paragraphs.map(row=>paragraph([row[0]],row[1])).join('')+'</section><section class="b3rw-v3-task"><table class="b3rw-u03-transport-table"><thead><tr><th>Transport</th><th>Where are they?</th><th>Who does this transport help?</th><th>How does it help them?</th></tr></thead><tbody><tr>'+group.row.map(completionCell).map(cell=>'<td>'+cell+'</td>').join('')+'</tr></tbody></table></section></div>'}))};
  }
 function trafficTableCarrier(){
   const groups=[
    {paragraph:[89,3],row:tableRows[0],title:'Engineering'},
    {paragraph:[90,4],row:tableRows[1],title:'Tax'},
    {paragraph:[91,5],row:tableRows[2],title:'Cycling'},
    {paragraph:[92,6],row:tableRows[3],title:'Park-and-ride'}
   ];
   return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:groups.map(group=>({title:group.title,html:()=>'<div class="b3rw-v3 b3rw-u03-r102"><section class="b3rw-v3-source"><h2>SOLVING TRAFFIC CONGESTION</h2>'+paragraph([group.paragraph[0]],group.paragraph[1])+'</section><section class="b3rw-v3-task"><table class="b3rw-u03-solutions-table"><thead><tr><th>Solution</th><th>What happens?</th><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody><tr>'+group.row.map(cell=>'<td>'+gapText(cell)+'</td>').join('')+'</tr></tbody></table></section></div>'}))};
 }
 function knowledgeCarrier(){
  const text='For birds, cities full of tall glass buildings are a problem. Spider’s webs may be the solution. Birds cannot see the glass, so more than a billion of them fly into buildings and die every year. However, they can see spider’s webs and they try to avoid them. So, engineers have used this idea in the invention of a new kind of window.';
  return {answer:false,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',html:()=>'<div class="b3rw-v3 b3rw-u06-r119"><section class="b3rw-v3-source"><h2>USING YOUR KNOWLEDGE</h2><div class="b3rw-u06-knowledge-grid"><p>'+esc(text)+'</p><figure class="b3rw-u06-window" role="img" aria-label="A bird-safe glass window inspired by a spider web"><span class="pane p1"></span><span class="pane p2"></span><span class="pane p3"></span><span class="pane p4"></span><span class="web w1"></span><span class="web w2"></span><span class="web w3"></span><span class="web w4"></span></figure></div></section></div>'};
 }
 const outsourcingStatements=[
  'Provides jobs at higher wages than local workers can make in agriculture.',
  'Most workers are paid by the piece.',
  'People in developing countries often line up to take jobs in multinational factories.',
  'Working conditions in many offshore factories remain uncomfortable and unsafe.',
  'Overseas factories have become safer and more ethical in recent years.',
  'Workers often work 14 hours a day and earn less than €100 a month.',
  'Worker protection laws, like those in developed nations, often don’t exist or are not followed.'
 ];
 const outsourcingSide=['for','against','for','against','for','against','against'];
 function outsourcingTableCarrier(){
  const subsets=[[0,1,2,3],[4,5,6]];
   const markedBank='<div class="b3rw-u03-bank">'+outsourcingStatements.map((item,index)=>'<span class="'+(index===0?'b3rw-u07-given-bank':'')+'"><b data-w1-choice="'+circles[index]+'">'+circles[index]+'</b> '+esc(item)+'</span>').join('')+'</div>';
   const given='<tr class="b3rw-u07-given-row"><td>'+esc(outsourcingStatements[0])+'</td><td></td></tr>';
   return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:subsets.map((subset,index)=>({title:'Classify statements '+(index===0?'2–4':'5–7'),html:()=>'<div class="b3rw-v3 b3rw-u07-r121"><section class="b3rw-v3-source"><h2>ARGUMENTS FOR AND AGAINST OUTSOURCING</h2>'+markedBank+'</section><section class="b3rw-v3-task"><table class="b3rw-u07-outsourcing-table"><thead><tr><th>arguments for outsourcing</th><th>arguments against outsourcing</th></tr></thead><tbody>'+given+subset.filter(i=>i!==0).map(i=>'<tr><td>'+(outsourcingSide[i]==='for'?'<span class="b3rw-u07-classified"><i>________________</i><strong>'+esc(outsourcingStatements[i])+'</strong></span>':'<i class="b3rw-u07-empty-line">________________</i>')+'</td><td>'+(outsourcingSide[i]==='against'?'<span class="b3rw-u07-classified"><i>________________</i><strong>'+esc(outsourcingStatements[i])+'</strong></span>':'<i class="b3rw-u07-empty-line">________________</i>')+'</td></tr>').join('')+'</tbody></table></section></div>'}))};
 }
  function deepfakeVocabularyCarrier(){
   const instruction='You are going to read an article about deepfake technology. Before you read the article, read the sentences below and choose the best definition, a or b, for the word or phrase in bold.';
   const rows=[
    ['It is important to protect your <strong>personal</strong> data, such as your financial and health information.','secret; unknown','belonging to a specific person','b'],
    ['Actors use their voices and the <strong>movement</strong> of their bodies to express emotion.','change of position','location','a'],
    ['The internet helps to <strong>spread</strong> information and ideas around the world.','help people understand something','tell a lot of people about something','b'],
    ['Actors often change their <strong>appearance</strong> so that their fans cannot recognize them.','when someone arrives','how someone looks','b'],
    ['This building does not have good <strong>security</strong>. The doors are unlocked and the windows are open.','protection against threats','sustainability technology','a'],
    ['Actors often lose their <strong>privacy</strong> after they become famous. People want to know all about their lives.','the right to keep your life secret','the right to decide your future','a'],
    ['Experts say <strong>images</strong> are more powerful than words. They are easier to understand and remember.','ideas','pictures','b']
   ];
   const subsets=[[0,1,2,3],[4,5,6]];
   return {answer:true,keepMaterial:false,layoutClass:'b3rw-exact-layout b3rw-v3-layout',parts:subsets.map((subset,index)=>({title:index===0?'Questions 1–4':'Questions 5–7',html:()=>'<div class="b3rw-v3 b3rw-u06-r119-deepfake"><section class="b3rw-v3-source"><h2>UNDERSTANDING KEY VOCABULARY</h2><p class="b3rw-u06-deepfake-instruction">'+instruction+'</p><ol class="b3rw-u06-deepfake-list" start="'+(subset[0]+1)+'">'+subset.map(i=>'<li><p>'+rows[i][0]+'</p><div><span><b>a</b> '+esc(rows[i][1])+'</span><span><b>b</b> '+esc(rows[i][2])+'</span></div><strong class="b3rw-v3-answer-key">Answer: '+rows[i][3]+'</strong></li>').join('')+'</ol></section></div>'}))};
  }
  function incomeDetailCarrier(base){
   if(!base||!Array.isArray(base.parts)||base.parts.length<5)return base;
   const textbook='../assets/textbook-source-v22/pages/B3_RW/p177.webp';
   const paragraph='<p><b>4</b> However, expenditures are only half the picture. The other half is the money people earn, their <strong>income</strong>. In the United States, in general, incomes have also gone up (see Figure 1). Yet not all incomes are increasing at the same rate. For many people, they have not increased as much as expenditures. This means that their ‘buying power’ has decreased. Figure 2 shows this increase in <strong>inequality</strong>. It shows change in income by group, from the bottom 20% to the top 20%. The top line shows the highest 5%. It is clear that the incomes of the higher income groups are rising the fastest. The incomes of the lower groups are rising more slowly. It is not surprising that they do not have a higher standard of living than their parents.</p>';
   const pairs=[
    [['US median household income for the lowest income group has decreased since 1970.','US median household income has increased the fastest at the highest income level.'],'b'],
    [['Income inequality is increasing in the United States.','The buying power of all income groups has been increasing since 1970.'],'a']
   ];
   const chart='<figure class="b3rw-v3-chart b3rw-v3-chart-two"><svg role="img" aria-label="Figure 2: Change in U.S. income by income group, 1970 to 2020" viewBox="557 191 420 485" preserveAspectRatio="xMidYMid meet" style="overflow:hidden"><defs><clipPath id="b3rw-u08-figure2-clip"><rect x="557" y="191" width="420" height="485"></rect></clipPath></defs><g clip-path="url(#b3rw-u08-figure2-clip)"><image href="'+textbook+'" x="0" y="0" width="1040" height="1400"></image></g></svg></figure>';
   const detailParts=pairs.map((pair,index)=>({title:'Question '+(index+4)+' · paragraph 4 and Figure 2',html:()=>'<div class="b3rw-v3 b3rw-u08-r122-detail"><h2>WHAT HAS HAPPENED TO THE DREAM OF A BETTER LIFE?</h2><section class="b3rw-u08-r122-copy">'+paragraph+'</section><section class="b3rw-u08-r122-figure">'+chart+'<ol class="b3rw-v3-choice-pairs" start="'+(index+4)+'"><li><p><b>a</b> '+esc(pair[0][0])+'</p><p><b>b</b> '+esc(pair[0][1])+'</p><span class="b3rw-v3-answer-key">Answer: '+pair[1]+'</span></li></ol></section></div>'}));
   return {...base,keepMaterial:false,parts:[...base.parts.slice(0,3),...detailParts]};
  }
 const repaired={
   'B3_RW_U03:44:4':readingOneTransportTableCarrier(),
  'B3_RW_U03:117:2':exercise('TRANSPORT COLLOCATIONS',transportWords,collocationRows,'b3rw-u03-r100'),
  'B3_RW_U03:120:4':exercise('SYNONYMS FOR VERBS',synonymWords,synonymRows,'b3rw-u03-r100'),
  'B3_RW_U03:86:3':decorate(C['B3_RW_U03:86:3'],'b3rw-u03-r101',{dropInstruction:true}),
  'B3_RW_U03:95:5':trafficTableCarrier(),
  'B3_RW_U03:313:':decorate(C['B3_RW_U03:313:'],'b3rw-u03-reading-card'),
  'B3_RW_U03:314:':decorate(C['B3_RW_U03:314:'],'b3rw-u03-reading-card'),
   'B3_RW_U06:56:':null,
   'B3_RW_U06:98:1':deepfakeVocabularyCarrier(),
  'B3_RW_U07:95:5':outsourcingTableCarrier(),
   'B3_RW_U08:108:6':incomeDetailCarrier(C['B3_RW_U08:108:6']),
   'B3_RW_U08:108:':incomeDetailCarrier(C['B3_RW_U08:108:']||C['B3_RW_U08:108:6'])
 };
 Object.assign(C,repaired);
 window.B3_RW_U03_LAYOUT_CLOSURE_CASES=repaired;
  window.B3_RW_WEEK1_REPAIR={...(window.B3_RW_WEEK1_REPAIR||{}),version:'20261026-b3rw-final-fit-03',active:true};
 window.W1_REPAIR_RUNTIME?.refresh?.();window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();
