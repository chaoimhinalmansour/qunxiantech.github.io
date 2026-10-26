/* B3 Listening & Speaking · week 1 textbook-context repairs (U01-U08).
 * Isolated, idempotent, and route-scoped. Loaded after the standard runtime.
 */
(()=>{'use strict';
const m=location.pathname.match(/B3_LS_U(\d{2})\.html$/i); if(!m)return;
const UNIT=`U${m[1]}`;
const CIRCLED=['','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const currentRoute=()=>String(document.querySelector('#page-select')?.value||document.querySelector('.a-classroom-meta')?.dataset.route||'');
const answerSlot=(answer,label='________')=>`<span class="inline-answer-slot b3ls-repair-slot"><span class="inline-answer-placeholder">${esc(label)}</span><span class="inline-answer-value">${esc(answer)}</span></span>`;
const node=(cls,html)=>{const n=document.createElement('section');n.className=cls;n.dataset.b3lsRepair='1';n.innerHTML=html;return n};
const setData=(el,key,value)=>{if(el&&String(el.dataset?.[key]??'')!==String(value))el.dataset[key]=value};
const setText=(el,value)=>{if(el&&el.textContent!==String(value))el.textContent=String(value)};
const setStyle=(el,key,value,priority='')=>{if(el&&(el.style.getPropertyValue(key)!==String(value)||el.style.getPropertyPriority(key)!==priority))el.style.setProperty(key,value,priority)};
const setDisabled=(el,value)=>{if(el&&el.disabled!==!!value)el.disabled=!!value};
const setHidden=(el,value)=>{if(el&&el.hidden!==!!value)el.hidden=!!value};
const setAttr=(el,key,value)=>{if(el&&el.getAttribute(key)!==String(value))el.setAttribute(key,value)};
const setClass=(el,key,value=true)=>{if(el&&el.classList.contains(key)!==!!value)el.classList.toggle(key,!!value)};
const mainAnswer=answer=>`<span class="b3ls-repair-main-answer" data-answer="${esc(answer)}" aria-label="Answer: ${esc(answer)}"></span>`;
const defs=(title,items,note='')=>`<aside class="b3ls-repair-card" aria-label="${esc(title)}"><h2>${esc(title)}</h2>${note?`<p class="b3ls-repair-note">${esc(note)}</p>`:''}<ol>${items.map((x,i)=>`<li><span class="b3ls-repair-circle">${CIRCLED[i+1]||i+1}</span><p><strong>${esc(x[0])}</strong>${x[1]?` <span>${esc(x[1])}</span>`:''}</p></li>`).join('')}</ol></aside>`;
const PROBLEM_WORDS=['control','figure out','fixed','impact','influence','serious','trouble'];
const PROBLEM_DEFINITIONS=[
 'effect','problems','important or bad','to limit something','unusual or different',
 'to understand or solve a problem by thinking','not able to be changed',
 'to affect how somebody acts or thinks','to remove something'
];
const PROBLEM_ROWS=[
 ['impact','effect'],['trouble','problems'],['serious','important or bad'],['control','to limit something'],
 ['fixed','not able to be changed'],['influence','to affect how somebody acts or thinks'],['figure out','to understand or solve a problem by thinking']
];
const U03_SENTENCE_ROWS=[
 ['Can we do anything to','control','the amount of traffic on our roads?'],
 ['Are the traffic problems so','serious','they often cause you to be late?'],
 ['A badly-parked vehicle can cause real','trouble','for everybody behind it.'],
 ['A crash on a busy road can have a huge','impact','on all of the roads close by.'],
 ['The traffic controllers can','figure out','the best way to keep everything moving.'],
 ['They don’t have to follow the same,','fixed','timings for the lights all day long.'],
 ['What other factors','influence','how well traffic flows?']
];
const U04_DEFINITION_ROWS=[
 ['relating to the government','political (adj)'],['to become rare and then disappear','die out (phr v)'],
 ['something to mark a special day or event','celebration (n)'],['to communicate and do things with somebody or something','interact (v)'],
 ['all the people of about the same age within a society or a family','generation (n)'],['including people who have many different customs and beliefs','multicultural (adj)'],
 ['the day on which an important event happened in a previous year','anniversary (n)'],['relating to a large group of people who live together in an organized way','social (adj)']
];
const U01_MODAL_ROWS=[
 ['You have to love animals to be a vet.','O'],['You mustn’t give human food to animals.','P'],['If you want to work with animals, you could become a vet.','A'],['We must do more as a society to prevent animal cruelty.','O'],
 ['What courses do you need to complete to get a veterinary degree?','O'],['You ought to visit the San Diego Zoo. It has some great animals.','A'],['We should be kind to animals. They have feelings, too.','A'],['It might be a good idea to help out on a farm if you are interested in working with animals.','A']
];
const U02_PREFIX_ROWS=[
 ['Using nuclear power is','responsible. It’s just too dangerous.','ir'],['Of course, the future of hydroponics is','known. But I think it’s going to become very common.','un'],['I','agree that nuclear power is the best kind of energy. Solar power is much safer.','dis'],['Solar power is cheap, clean and','expensive. It costs much less than fossil fuels.','in'],['We are','able to feed the world’s population by traditional farming methods alone. Many people don’t have enough food.','un'],
 ['I don’t think it’s','possible to end world hunger. Hydroponic farming could help.','im'],['That information is','correct. Would you like me to give you the right information?','in'],['One','advantage of wind power is that some people think the wind turbines are ugly.','dis'],['Solar power is cheap, clean and','limited. There will always be enough of it.','un'],['I','approve of using chemicals to grow food. It’s bad for the environment and it’s bad for people’s health.','dis']
];
const U05_PHRASAL_ROWS=[
 ['to get an illness, especially one which is not serious','come down with','Last winter, I came down with four colds. I hope I’m healthier this year!',2,'came down with'],
 ['to stop a habit, often because it is unhealthy','give up','No matter how good their genes are, these children will not be able to enjoy a long and happy life unless they give up crisps, chocolate bars and sugary drinks.',5,'give up'],
 ['to agree to become involved in an organized activity','sign up for','Why don’t you sign up for a yoga class? Yoga is good exercise and it helps you relax.',6,'sign up for'],
 ['to become involved in an activity with other people','join in','Would you like to join in the game? You can be on our team.',7,'join in'],
 ['to compete for a position on a sports team or a part in a play','try out for','Tim is going to try out for the football team. I don’t think he’ll make it, though – he’s not a great player.',4,'try out for'],
 ['to become healthy again after having an illness','get over','It took me a long time to get over the flu. I was ill for two weeks.',8,'get over'],
 ['to start doing a particular job or activity','take up','I want to try something new. Maybe I’ll take up tennis.',3,'take up'],
 ['to eat or drink less of something','cut down on','If you want to lose weight, you should cut down on fatty foods.',1,'cut down on']
];
const U05_WELLBEING_ROWS=[
 ['Does exercising have ',' benefits? For example, can it make you happier and calmer?','emotional'],
 ['What\'s the best way to find new people to go out with and improve your ',' life?','social'],
 ['Would you describe somebody as ‘','’ if they enjoyed talking about literature and philosophy? Why / Why not?','intellectual'],
 ['Which is better for learning a language quickly: hiring a ',' tutor or studying in a class? Why?','personal'],
 ['Which ',' activity is best for helping your body stay strong and healthy?','physical'],
 ['When somebody moves to a new country, how long should it take for them to get used to the ',' differences?','cultural'],
 ['People often think that travelling has ',' benefits, but what do people learn?','educational']
];
const FAST_FASHION_DEFINITIONS=[
 ['convert (v)','to change something into something else'],
 ['collaborate (v)','to work with somebody for a special purpose'],
 ['criticize (v)','to express that you believe something or somebody is bad'],
 ['copyright (n)','the legal right to control the use of a design, an artwork, a piece of music, etc.'],
 ['ethical (adj)','something that meets society’s standards of acceptable and honest behaviour'],
 ['focus on (phr v)','to give a lot of attention to one subject or thing'],
 ['image (n)','a picture or photograph'],
 ['practical (adj)','able to be done or put into action']
];
const FAST_FASHION_BANK=['convert','collaborate','criticize','copyright','ethical','focus on','image','practical'];
const FAST_FASHION_STEPS=[
 {label:'Article: first half',copy:[
  [null,"‘Fast fashion’ is the term used to describe clothing designs that move quickly from fashion shows to clothing stores. Customers can buy the ‘new look’ at an affordable price from a local store, rather than from an expensive designer shop in a big city."],
  [null,`However, the clothing companies are often (1) ${mainAnswer('criticized')} because they produce low-quality items that consumers wear only a few times before throwing away. So there are a number of environmental problems with fast fashion. For example, it isn’t (2) ${mainAnswer('practical')} to recycle all the clothes, which creates a lot of waste.`]
 ]},
 {label:'Article: second half',copy:[
  [null,`Additionally, these companies don’t only (3) ${mainAnswer('focus on')} copying designs from fashion shows. Some companies take (4) ${mainAnswer('images')} they find on the internet and (5) ${mainAnswer('convert')} them into designs, which they sell for a large profit.`],
  [null,`There are both legal and (6) ${mainAnswer('ethical')} issues when fashion companies do this. Firstly, they often pay no attention to (7) ${mainAnswer('copyright')} laws that protect an artist’s work. Secondly, it is very rare for an artist either to (8) ${mainAnswer('collaborate')} with a fast fashion company or to give permission for their designs to be used. As a result, they hardly ever receive any payment for the use of their work.`]
 ]}
];
const MONEY_DEFINITIONS=[
 ['borrow money (v phr)','to take money and promise to pay it back later'],
 ['lose money (v phr)','to have less money than you had before'],
 ['make money (v phr)','to earn money from a job or an investment'],
 ['owe money (v phr)','to have to pay somebody money you borrowed'],
 ['pay a fine (v phr)','to pay money for not obeying a rule or law'],
 ['pay in cash (v phr)','to pay for something with money (not a bank card)'],
 ['invest money (v phr)','to put money into something to try and earn more money'],
 ['raise money (v phr)','to collect money from other people, often for charity'],
 ['save money (v phr)','to keep money for use in the future'],
 ['spend money (v phr)','to give money as a payment for something']
];
const MONEY_QUESTIONS=[
 ['Have you ever ', ' by selling something over the internet?', 'made money'],
 ['Do you prefer to pay by card or to ', '?', 'pay in cash'],
 ['Is it a good idea to ', ' in a new business?', 'invest money'],
 ['Have you ever ', ' for not having the correct ticket for a train or bus?', 'paid a fine'],
 ['Have you ever ', ' by accidentally buying something you didn’t want?', 'lost money'],
 ['Is it better to ', ' from a family member or from a bank?', 'borrow money'],
 ['What are you planning for in the next few years that you might need to ', ' for?', 'save money'],
 ['How long is it acceptable to ', ' to a friend without paying them back?', 'owe money'],
 ['Have you ever done anything to help ', ' for a charity?', 'raise money'],
 ['Do you prefer to ', ' on yourself, or on other people?', 'spend money']
];

const DATA={
 U01:{
  '49':{kind:'definitions',title:'Key vocabulary · definitions',items:[
   ['abuse (n)','violent or unfair treatment of somebody'],['conditions (n pl)','the situation in which somebody lives or works'],['cruel (adj)','not kind'],['issue (n)','a topic or problem which causes concern and discussion'],['protect (v)','to keep safe from danger'],['suffer (v)','to feel pain or unhappiness'],['survive (v)','to continue to live, in spite of danger and difficulty'],['welfare (n)','somebody’s or something’s health and happiness']
  ]},
  '53':{kind:'answerTitle'},'54':{kind:'u01ContrastingDiscussion',mergeParts:true,mainCanvas:true},'83':{kind:'u01ZooAdvice',mergeParts:true,mainCanvas:true}
 },
 U02:{'51':{kind:'blog',mergeParts:true},'56':{kind:'nuclear'},'58':{kind:'u02Prefixes',mergeParts:true,mainCanvas:true}},
 U03:{
  '46':{kind:'wordbank',bank:['avoid','block','cope','crash','extreme','management','measure','primary']},
  '54':{kind:'skill',skill:'rhetorical'},
  '71':{kind:'fullVocabulary'},
  '75':{kind:'problemDefinitions',mergeParts:true},
  '76':{kind:'u03Sentences',mergeParts:true,mainCanvas:true}
 },
 U04:{'51':{kind:'u04Definitions',mergeParts:true,bank:['anniversary','celebration','die out','generation','interact','multicultural','political','social']},'55':{kind:'skill',skill:'causeEffect'},'80':{kind:'grammar',label:'Statement structure'},'81':{kind:'grammar',label:'Question structure'}},
 U05:{
  '79':{kind:'wordbank',bank:['cycling tour','acupuncture','a football club','taekwondo']},
  '82':{kind:'u05Phrasal',mergeParts:true,mainCanvas:true},
  '84':{kind:'u05Wellbeing',mergeParts:true,mainCanvas:true,title:'Adjectives to describe well-being',bank:['cultural','educational','emotional','intellectual','personal','physical','social'],items:[
   ['cultural (adj)','relating to the habits, traditions and beliefs of a society'],['educational (adj)','relating to learning'],['emotional (adj)','relating to feelings'],['intellectual (adj)','relating to your ability to think and understand things, especially complicated ideas'],['personal (adj)','relating to a single person rather than to a group'],['physical (adj)','relating to the body'],['social (adj)','relating to activities in which you meet and spend time with other people']
  ]}
 },
 U06:{'70':{kind:'wordbank'},'72':{kind:'wordbank'}},
 U07:{
  // Runtime route 42 is source 31 (Book p.150); DATA is keyed by runtime route, never source index.
  '42':{kind:'fastFashion',mergeParts:true,mainCanvas:true},
  '68':{kind:'wordbank'},'69':{kind:'wordbank'}
 },
 U08:{
  // Runtime route 76 is source 111 (Book p.177); DATA is keyed by runtime route, never source index.
  '76':{kind:'moneyCollocations',mergeParts:true,mainCanvas:true}
 }
};

const skillHtml={
 rhetorical:`<aside class="b3ls-repair-skill b3ls-repair-skill--rhetorical"><div class="b3ls-repair-ribbon">SKILLS</div><h2>Listening for rhetorical questions</h2><p>Rhetorical questions are an unusual type of question. Their purpose is to bring the listener’s attention to a topic or an idea. The speaker does not expect an answer.</p><div class="b3ls-repair-example"><strong>Regular question</strong><p>A: <em>Is the amount of traffic in our cities worse than ever?</em></p><p>B: Yes, I firmly believe that it is.</p></div><div class="b3ls-repair-example"><strong>Rhetorical question</strong><p>Speaker: <em>Is the amount of traffic in our cities worse than ever?</em> I don’t believe so, but others would disagree.</p></div></aside>`,
 causeEffect:`<aside class="b3ls-repair-skill b3ls-repair-skill--cause"><div class="b3ls-repair-ribbon">SKILLS</div><h2>Identifying cause and effect</h2><p>Listen for <strong>due to</strong>, <strong>the reason for this is</strong> and <strong>because (of)</strong> to identify causes. Use <em>due to</em> and <em>because of</em> before noun phrases.</p><p class="b3ls-repair-example"><em>Due to modern kitchens</em> (cause), people don’t have to spend much time cooking any more (effect).</p><p>Listen for <strong>that’s why</strong> and <strong>this means</strong> to identify effects. These are followed by a clause.</p><p class="b3ls-repair-example">You can find any recipe online (cause). <em>This means that</em> many people don’t need cookbooks (effect).</p></aside>`
};

function circleBanks(scope=document){scope.querySelectorAll('.fmt-header-banks .ref-bank-index').forEach((x,i)=>{const text=(x.textContent||'').trim(),glyph=CIRCLED.indexOf(x.dataset.w1Choice||text),digits=text.match(/\d+/);const n=glyph>0?glyph:(digits?Number(digits[0]):(i%10)+1),circle=CIRCLED[n];if(circle){setData(x,'b3lsCircle',circle);setData(x,'w1Choice',circle);setText(x,circle)}});}
function clean(stage){
 restoreMergedPartNavigation(stage);
 stage.querySelectorAll('[data-b3ls-repair]').forEach(n=>n.remove());
 const body=stage.querySelector('.ss-body[data-b3ls-repair-original-style]');
 if(body){body.setAttribute('style',body.dataset.b3lsRepairOriginalStyle||'');delete body.dataset.b3lsRepairOriginalStyle;delete body.dataset.week1Left;delete body.dataset.week1Top;delete body.dataset.week1Width;delete body.dataset.week1Height}
 ['b3ls-repair-wordbank','b3ls-repair-side','b3ls-repair-blog-page','b3ls-repair-full-page','b3ls-repair-definition-task','b3ls-repair-answer-title','b3ls-repair-grammar','b3ls-repair-nuclear','b3ls-repair-problem-definitions','b3ls-repair-u04-definitions','b3ls-repair-u03-sentences','b3ls-repair-u01-modals','b3ls-repair-u01-discussion','b3ls-repair-u01-zoo-advice','b3ls-repair-u02-prefixes','b3ls-repair-u05-phrasal','b3ls-repair-u05-wellbeing','b3ls-repair-merged-task'].forEach(c=>stage.classList.remove(c));
}
function setSideBody(stage,cfg={}){
 const body=stage.querySelector('.ss-body');if(!body)return;
 if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
 const left=cfg.sideLeft||'800px',width=cfg.sideWidth||'1012px';
 setData(body,'week1Left',left);setData(body,'week1Top','324px');setData(body,'week1Width',width);setData(body,'week1Height','682px');
 [['left',left],['top','324px'],['width',width],['height','682px'],['overflow','visible']].forEach(([k,v])=>setStyle(body,k,v,'important'));
}

function applyWordbank(stage,cfg){
 stage.classList.add('b3ls-repair-wordbank');circleBanks(stage);
 if(!cfg.bank)return;
 if(!stage.querySelector('.fmt-header-banks,.w1-choice-zone,.b3ls-repair-custom-bank')){
  const html=`<div class="b3ls-repair-custom-bank-inner">${cfg.bank.map((w,i)=>`<span><b data-circle="${CIRCLED[i+1]||i+1}"></b>${esc(w)}</span>`).join('')}</div>`;
  stage.append(node('b3ls-repair-custom-bank',html));
 }
 if(stage.querySelector('.b3ls-repair-custom-bank')){
  const body=stage.querySelector('.ss-body');if(!body)return;
  if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
  const top=cfg.bodyTop||'436px',height=cfg.bodyHeight||'566px';
  setData(body,'week1Top',top);setData(body,'week1Height',height);
  setStyle(body,'top',top,'important');setStyle(body,'height',height,'important');setStyle(body,'overflow','visible','important');
 }
}
function applyU04Definitions(stage,cfg){
 setClass(stage,'b3ls-repair-u04-definitions');
 const body=stage.querySelector('.ss-body');
 if(body){
  if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
  setStyle(body,'display','none','important');
 }
 if(stage.querySelector('.b3ls-repair-u04-definition-card')){syncU04AnswerState(stage);return;}
 const bank=cfg.bank.map((word,i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${esc(word)}</span>`).join('');
 const rows=U04_DEFINITION_ROWS.map(([definition,answer],i)=>`<li><span class="b3ls-repair-u04-row-number">${i+1}</span><p>${esc(definition)}</p><span class="b3ls-repair-u04-blank" data-answer="${esc(answer)}" aria-label="Answer: ${esc(answer)}"></span></li>`).join('');
 const html=`<section class="b3ls-repair-u04-definition-card" aria-label="Complete all eight vocabulary definitions"><div class="b3ls-repair-u04-bank" aria-label="Complete eight-word choice bank">${bank}</div><ol class="b3ls-repair-u04-definition-rows" aria-label="Eight original definition rows">${rows}</ol></section>`;
 stage.append(node('b3ls-repair-u04-definition-wrap',html));
 syncU04AnswerState(stage);
}
function isAnswerState(stage){
 const app=document.getElementById('app'),back=document.getElementById('question-return');
 return !!(stage?.classList.contains('answers-visible')||app?.classList.contains('review-open')||(back&&!back.hidden));
}
function syncU04AnswerState(stage){
 const show=isAnswerState(stage);
 stage?.querySelectorAll('.b3ls-repair-u04-blank[data-answer],.b3ls-repair-main-answer[data-answer]').forEach(slot=>{
  const answer=slot.dataset.answer||'';
  setText(slot,show?answer:'');
  setClass(slot,'b3ls-repair-u04-answer-visible',show);
 });
}
function applyU03Sentences(stage){
 setClass(stage,'b3ls-repair-u03-sentences');
 const body=stage.querySelector('.ss-body');
 if(body){
  if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
  setStyle(body,'display','none','important');
 }
 if(stage.querySelector('.b3ls-repair-u03-sentence-card'))return;
 const bank=PROBLEM_WORDS.map((word,i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${esc(word)}</span>`).join('');
 const rows=U03_SENTENCE_ROWS.map(([before,answer,after],i)=>`<li><span class="b3ls-repair-u03-row-number">${i+1}</span><p>${esc(before)} <span class="b3ls-repair-u03-blank" aria-label="Answer: ${esc(answer)}"></span> ${esc(after)}</p></li>`).join('');
 const html=`<section class="b3ls-repair-u03-sentence-card" aria-label="Exercise 3: complete all seven sentences"><div class="b3ls-repair-u03-bank" aria-label="Seven original word choices">${bank}</div><ol class="b3ls-repair-u03-sentence-rows" aria-label="Seven original sentence rows">${rows}</ol></section>`;
 stage.append(node('b3ls-repair-u03-sentence-wrap',html));
}
function applyU01Modals(stage){
 setClass(stage,'b3ls-repair-u01-modals');
 const body=stage.querySelector('.ss-body');
 if(body){if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';setStyle(body,'display','none','important');}
 if(stage.querySelector('.b3ls-repair-u01-modal-card')){syncU04AnswerState(stage);return;}
 const rules=[
  ['have to / have got to / need to / must','obligation: it is necessary'],['don’t have to / don’t need to','choice: it is not necessary'],['mustn’t','prohibition: not allowed'],['should / ought to','advice you are sure about'],['might / could','advice when you are not sure']
 ];
 const html=`<section class="b3ls-repair-u01-modal-card" aria-label="Modals for obligation, prohibition and advice"><aside class="b3ls-repair-u01-modal-reference"><h2>MODALS FOR OBLIGATION, PROHIBITION AND ADVICE</h2><ol>${rules.map((r,i)=>`<li><span>${i+1}</span><p><strong>${esc(r[0])}</strong><br>${esc(r[1])}</p></li>`).join('')}</ol></aside><section class="b3ls-repair-u01-modal-task" aria-label="Exercise 4 original sentences"><div class="b3ls-repair-u01-modal-bank"><b>O</b> obligation <b>P</b> prohibition <b>A</b> advice</div><ol>${U01_MODAL_ROWS.map(([sentence,answer],i)=>`<li><span>${i+1}</span><p>${mainAnswer(answer)} ${esc(sentence)}</p></li>`).join('')}</ol></section></section>`;
 stage.append(node('b3ls-repair-u01-modal-wrap',html));syncU04AnswerState(stage);
}
function applyU01ZooAdvice(stage){
 setClass(stage,'b3ls-repair-u01-zoo-advice');
 const body=stage.querySelector('.ss-body');
 if(body){if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';setStyle(body,'display','none','important');}
 if(stage.querySelector('.b3ls-repair-u01-zoo-card'))return;
 const rules=[
  ['Obligation','have to / have got to / need to / must','Animals have to / have got to / need to / must find food, water and a safe place to live in order to survive.'],
  ['Choice / not necessary','don’t have to / don’t need to','You don’t have to / don’t need to feed the chickens now. I can do it when I get home.'],
  ['Prohibition','mustn’t','Visitors to the zoo mustn’t touch the animals.'],
  ['Advice you are sure about','should / ought to','You should / ought to give some money to that animal rights organization. It does good work.'],
  ['Advice when you are not sure','might / could','It might be a good idea to volunteer at the animal shelter. You could volunteer at the animal shelter.']
 ];
 const reference=rules.map((r,i)=>`<li><span>${i+1}</span><p><strong>${esc(r[0])}: ${esc(r[1])}</strong><br>${esc(r[2])}</p></li>`).join('');
 const task=Array.from({length:7},(_,i)=>`<li><span>${i+1}</span><span class="b3ls-repair-u01-zoo-line" aria-label="Space for group advice ${i+1}"></span></li>`).join('');
 const html=`<section class="b3ls-repair-u01-zoo-card" aria-label="Exercise 6: modals reference and zoo advice list"><aside class="b3ls-repair-u01-zoo-reference"><h2>MODALS FOR OBLIGATION, PROHIBITION AND ADVICE</h2><ol aria-label="Grammar box on page 23">${reference}</ol></aside><section class="b3ls-repair-u01-zoo-task" aria-label="Open advice-list space for Exercise 6"><h2>Zoo advice</h2><ol aria-label="Advice list space">${task}</ol></section></section>`;
 stage.append(node('b3ls-repair-u01-zoo-wrap',html));
}
function applyU01ContrastingDiscussion(stage){
 setClass(stage,'b3ls-repair-u01-discussion');
 const body=stage.querySelector('.ss-body');
 if(body){
  if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
  setStyle(body,'display','none','important');
 }
 if(stage.querySelector('.b3ls-discussion-card'))return;
 const statements=[
  'In the modern world, there is no longer any need to use animals for work. We have developed technology which can replace them.',
  'People often spend too much time and money on improving animal welfare.'
 ];
 const signals=['yet','but','on the contrary','even though','however'];
 const examples=[
  'Animals, like elephants and horses, were used to build amazing structures, like the pyramids in Egypt. Yet/But their hard work and suffering are hardly ever recognized.',
  'Not all animal use is abuse. On the contrary, without humans, these domesticated animals would not have been able to survive.',
  'Even though animals work hard for us, they are often abandoned when they get sick or too old to work.',
  'These animals work long hours and live in difficult conditions. However, they get very little reward.'
 ];
 const rules=[
  'Use even though to connect two contrasting ideas in the same sentence. It is followed by a subject and verb.',
  'Use however and on the contrary followed by a comma to add a contrasting idea in a new sentence.',
  'You can use yet/but to start a new sentence. Do not put a comma after yet/but.'
 ];
 const html=`<section class="b3ls-discussion-card" aria-label="Exercise 10: discussion using contrasting ideas"><header class="b3ls-discussion-header"><h2>DISCUSSION</h2><p><strong>10</strong> Work in a group of three. Discuss your opinions on the statements in Exercise 9. Use language from the Skills box for contrasting ideas.</p></header><div class="b3ls-discussion-grid"><section class="b3ls-discussion-topics" aria-label="Exercise 9 discussion statements"><h3>Statements from Exercise 9</h3><ol>${statements.map((statement,i)=>`<li><b>${CIRCLED[i+1]}</b><p>${esc(statement)}</p></li>`).join('')}</ol><div class="b3ls-discussion-speech" aria-label="Original Exercise 10 speech examples"><p>“In my opinion, replacing working animals with technology isn’t always possible. On the contrary …”</p><p>“Even though animal charities receive huge amounts of money every year …”</p></div></section><aside class="b3ls-discussion-skills" aria-label="Listening for contrasting ideas Skills box"><h3>Listening for contrasting ideas</h3><p>Speakers use certain words and phrases to signal a contrast, or difference, between two ideas. To identify contrasting ideas, listen for these transition words and phrases: <strong>${signals.join(', ')}</strong>.</p><ol class="b3ls-discussion-examples">${examples.map((example,i)=>`<li><b>${i+1}</b><p>${esc(example)}</p></li>`).join('')}</ol><ul class="b3ls-discussion-rules">${rules.map(rule=>`<li>${esc(rule)}</li>`).join('')}</ul></aside></div></section>`;
 stage.append(node('b3ls-discussion-wrap',html));
}
function applyU02Prefixes(stage){
 setClass(stage,'b3ls-repair-u02-prefixes');
 const body=stage.querySelector('.ss-body');
 if(body){if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';setStyle(body,'display','none','important');}
 if(stage.querySelector('.b3ls-repair-u02-prefix-card')){syncU04AnswerState(stage);return;}
 const table=[['un-','unnecessary'],['in-','incorrect'],['ir-','irresponsible'],['dis-','disadvantage'],['im-','impossible']];
 const html=`<section class="b3ls-repair-u02-prefix-card" aria-label="Negative prefixes, reference and Exercise 2"><aside class="b3ls-repair-u02-prefix-reference"><h2>NEGATIVE PREFIXES</h2><table><thead><tr><th>prefix</th><th>example</th></tr></thead><tbody>${table.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table></aside><section class="b3ls-repair-u02-prefix-task" aria-label="Exercise 2 original sentences"><div class="b3ls-repair-u02-prefix-bank">${table.map((r,i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${esc(r[0])}</span>`).join('')}</div><ol>${U02_PREFIX_ROWS.map(([before,after,answer],i)=>`<li><span>${i+1}</span><p>${esc(before)}${mainAnswer(answer)}${esc(after)}</p></li>`).join('')}</ol></section></section>`;
 stage.append(node('b3ls-repair-u02-prefix-wrap',html));syncU04AnswerState(stage);
}
function applyU05Phrasal(stage){
 setClass(stage,'b3ls-repair-u05-phrasal');
 const body=stage.querySelector('.ss-body');
 if(body){if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';setStyle(body,'display','none','important');}
 const step=Math.max(1,Math.min(2,Number(stage.dataset.b3lsPhrasalStep||1)));
 const old=stage.querySelector('.b3ls-repair-u05-phrasal-card');
 if(old?.dataset.b3lsPhrasalStep===String(step)){syncU04AnswerState(stage);return;}
 old?.remove();
 const bank=U05_PHRASAL_ROWS.map(([,answer],i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${esc(answer)}</span>`).join('');
 const offset=(step-1)*4,subset=U05_PHRASAL_ROWS.slice(offset,offset+4);
 const phrase=(sentence,answer)=>esc(sentence).replace(esc(answer),`<strong>${esc(answer)}</strong>`);
 const context=subset.map(([,answer,sentence,sourceNo,sourceForm])=>`<li><span>${sourceNo}</span><p>${phrase(sentence,sourceForm||answer)}</p></li>`).join('');
 const rows=subset.map(([definition,answer],i)=>`<li><span>${offset+i+1}</span><p>${mainAnswer(answer)} ${esc(definition)}</p></li>`).join('');
 const navigation=[1,2].map(n=>`<button type="button" data-b3ls-phrasal-step="${n}" aria-pressed="${n===step}" aria-label="Show definitions ${n===1?'1 to 4':'5 to 8'}">${n===1?'1–4':'5–8'}</button>`).join('');
 const html=`<section class="b3ls-repair-u05-phrasal-card" data-b3ls-phrasal-step="${step}" aria-label="Phrasal verbs: Exercise 1 contexts and Exercise 2 definitions"><header><div><h2>PHRASAL VERBS</h2><p><strong>1</strong> Read the sentences. Underline the phrasal verb in each sentence.</p></div><nav aria-label="Definition groups">${navigation}</nav></header><div class="b3ls-repair-u05-phrasal-grid"><aside class="b3ls-repair-u05-phrasal-reference"><h3>Sentences from Exercise 1</h3><p class="b3ls-repair-u05-context-rule">When you see a phrasal verb that you do not know, try to work out its meaning from the context.</p><ol aria-label="Original Exercise 1 context sentences">${context}</ol></aside><section class="b3ls-repair-u05-phrasal-task" aria-label="Exercise 2: match the complete word bank to definitions"><h3>Phrasal verbs</h3><div class="b3ls-repair-u05-phrasal-bank" aria-label="Complete eight-phrase choice bank">${bank}</div><ol aria-label="Definitions ${offset+1} to ${offset+4}">${rows}</ol></section></div></section>`;
 const wrap=node('b3ls-repair-u05-phrasal-wrap',html);wrap.dataset.b3lsPhrasalStep=String(step);stage.append(wrap);syncU04AnswerState(stage);
}
function applyU05Wellbeing(stage,cfg){
 setClass(stage,'b3ls-repair-u05-wellbeing');
 const body=stage.querySelector('.ss-body');
 if(body){
  if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
  setStyle(body,'display','none','important');
 }
 if(stage.querySelector('.b3ls-repair-u05-wellbeing-card')){syncU04AnswerState(stage);return;}
 const definitions=cfg.items.map(([word,definition],i)=>`<li><span>${i+1}</span><p><strong>${esc(word)}</strong> ${esc(definition)}</p></li>`).join('');
 const bank=cfg.bank.map((word,i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${esc(word)}</span>`).join('');
 const questions=U05_WELLBEING_ROWS.map(([before,after,answer],i)=>`<li><span>${i+1}</span><p>${esc(before)}${mainAnswer(answer)}${esc(after)}</p></li>`).join('');
 const html=`<section class="b3ls-repair-u05-wellbeing-card" aria-label="Exercise 6: seven definitions, word bank and complete questions"><aside class="b3ls-repair-u05-wellbeing-definitions"><h2>ADJECTIVES TO DESCRIBE WELL-BEING</h2><ol aria-label="Seven original definitions">${definitions}</ol></aside><section class="b3ls-repair-u05-wellbeing-task" aria-label="Exercise 6 original questions"><div class="b3ls-repair-u05-wellbeing-bank" aria-label="Complete seven-word choice bank">${bank}</div><ol aria-label="Questions 1 to 7">${questions}</ol></section></section>`;
 stage.append(node('b3ls-repair-u05-wellbeing-wrap',html));
 syncU04AnswerState(stage);
}
function stepButtons(kind,step,labels){return labels.map((label,i)=>`<button type="button" data-b3ls-${kind}-step="${i+1}" aria-pressed="${i+1===step}" aria-label="Show ${esc(label)}">${esc(label)}</button>`).join('')}
function applyFastFashion(stage){
 setClass(stage,'b3ls-repair-fast-fashion');
 const body=stage.querySelector('.ss-body');
 if(body){if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';setStyle(body,'display','none','important');}
 const step=Math.max(1,Math.min(2,Number(stage.dataset.b3lsFastFashionStep||1)));
 const old=stage.querySelector('.b3ls-repair-fast-fashion-card');
 if(old?.dataset.b3lsFastFashionStep===String(step)){syncU04AnswerState(stage);return}
 old?.remove();
 const current=FAST_FASHION_STEPS[step-1];
 const definitions=FAST_FASHION_DEFINITIONS.map(([word,definition],i)=>`<li><span>${CIRCLED[i+1]}</span><p><strong>${esc(word)}</strong> ${esc(definition)}</p></li>`).join('');
 const bank=FAST_FASHION_BANK.map((word,i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${esc(word)}</span>`).join('');
 const article=current.copy.map(([heading,text])=>`<section>${heading?`<h3>${esc(heading)}</h3>`:''}<p>${text}</p></section>`).join('');
 const html=`<section class="b3ls-repair-fast-fashion-card" data-b3ls-fast-fashion-step="${step}" aria-label="Exercise 1: Fast Fashion article, eight original definitions and word bank"><header><div><h2>FAST FASHION</h2><p><strong>1</strong> You are going to listen to a discussion about fast fashion. Before you listen, read the article below to get a general understanding of fast fashion. Then read the definitions and complete the article with the correct form of the words in bold.</p></div><nav aria-label="Article sections">${stepButtons('fast-fashion',step,FAST_FASHION_STEPS.map(x=>x.label))}</nav></header><div class="b3ls-repair-fast-fashion-grid"><aside class="b3ls-repair-fast-fashion-definitions"><h3>Definitions</h3><ol aria-label="All eight original definitions">${definitions}</ol></aside><section class="b3ls-repair-fast-fashion-article"><div class="b3ls-repair-fast-fashion-bank" aria-label="All eight words in bold">${bank}</div><article aria-label="Fast Fashion original article">${article}</article></section></div></section>`;
 const wrap=node('b3ls-repair-fast-fashion-wrap',html);wrap.dataset.b3lsFastFashionStep=String(step);stage.append(wrap);syncU04AnswerState(stage);
}
function applyMoneyCollocations(stage){
 setClass(stage,'b3ls-repair-money-collocations');
 const body=stage.querySelector('.ss-body');
 if(body){if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';setStyle(body,'display','none','important');}
 const step=Math.max(1,Math.min(2,Number(stage.dataset.b3lsMoneyStep||1)));
 const old=stage.querySelector('.b3ls-repair-money-card');
 if(old?.dataset.b3lsMoneyStep===String(step)){syncU04AnswerState(stage);return}
 old?.remove();
 const definitions=MONEY_DEFINITIONS.map(([word,definition],i)=>`<li><span>${CIRCLED[i+1]}</span><p><strong>${esc(word)}</strong> ${esc(definition)}</p></li>`).join('');
 const start=(step-1)*5;
 const questions=MONEY_QUESTIONS.slice(start,start+5).map(([before,after,answer],i)=>`<li><span>${start+i+1}</span><p>${esc(before)}${mainAnswer(answer)}${esc(after)}</p></li>`).join('');
 const html=`<section class="b3ls-repair-money-card" data-b3ls-money-step="${step}" aria-label="Exercise 1: collocations with pay and money"><header><div><h2>COLLOCATIONS WITH <em>PAY</em> AND <em>MONEY</em></h2><p><strong>1</strong> Read the definitions. Complete the questions with the correct form of the words in bold.</p></div><nav aria-label="Question groups">${stepButtons('money',step,['Questions 1–5','Questions 6–10'])}</nav></header><div class="b3ls-repair-money-grid"><aside class="b3ls-repair-money-definitions"><h3>Definitions</h3><ol aria-label="All ten original definitions">${definitions}</ol></aside><section class="b3ls-repair-money-task"><h3>${step===1?'Questions 1–5':'Questions 6–10'}</h3><ol aria-label="Original completion questions">${questions}</ol></section></div></section>`;
 const wrap=node('b3ls-repair-money-wrap',html);wrap.dataset.b3lsMoneyStep=String(step);stage.append(wrap);syncU04AnswerState(stage);
}

function applyDefinitions(stage,cfg){
 stage.classList.add('b3ls-repair-side'); circleBanks(stage);setSideBody(stage,cfg);
 const card=node('b3ls-repair-sidecard',defs(cfg.title,cfg.items,cfg.note??'Read the definitions, then complete the task.'));
 if(cfg.sideCardWidth)setStyle(card,'width',cfg.sideCardWidth,'important');
 stage.append(card);
}
function applySkill(stage,cfg){stage.classList.add('b3ls-repair-side');setSideBody(stage);stage.append(node('b3ls-repair-sidecard',skillHtml[cfg.skill]));}
function applyBlog(stage){
 stage.classList.add('b3ls-repair-blog-page');
 const html=`<article class="b3ls-repair-blog" aria-label="The benefits and risks of wind power blog post"><div class="b3ls-repair-blog-heading"><span>The</span><strong>benefits</strong><span>and</span><strong>risks</strong><span>of</span><strong>wind power</strong></div><div class="b3ls-repair-blog-grid"><div class="b3ls-repair-blog-copy"><p>Many people think wind power has a lot of <b>benefits</b>. First, it’s very clean and it doesn’t <b>pollute</b> the environment. Also, there are very few <b>risks</b> connected to wind power. Unlike coal mines and nuclear power plants, it is unlikely to cause accidents and it never leads to <b>disasters</b>. Most importantly, this source of energy is <b>affordable</b>. It’s much cheaper than fossil fuels.</p><p>However, not everybody thinks that wind power is a good idea. <b>Opponents</b> of wind power argue that the wind turbines can have a negative effect on the environment, and that turbines take up a lot of space. Opponents also say that the wind turbines aren’t a <b>long-term</b> source of energy because, unlike nuclear power plants, the turbines need to be replaced after 10–15 years.</p></div><div class="b3ls-repair-windfarm" role="img" aria-label="An offshore wind farm"></div></div></article>`;
 stage.append(node('b3ls-repair-blog-wrap',html));
}
function ensureNuclear(stage){
 stage.classList.add('b3ls-repair-nuclear');
 const table=stage.querySelector('.ss-body table'); if(!table)return;
 const first=table.rows[0]; if(first&&/For nuclear power/i.test(first.innerText))return;
 const row=table.insertRow(0);row.dataset.b3lsRepair='1';row.className='fmt-table-heading a-table-head';
 ['For nuclear power','Against nuclear power'].forEach(t=>{const c=row.insertCell();c.innerHTML=`<p><strong>${t}</strong></p>`});
}
function fullVocabulary(stage){
 stage.classList.add('b3ls-repair-full-page');
 const sentences=[
  ['Did you','injure','your knee when you fell off your bicycle?'],['Drivers should always have','respect','for pedestrians and stop for them.'],['I got a','fine','for driving through a red light. It was over £50.'],['Some people','break the law','by driving without a licence.'],['We can','prevent','accidents by driving within the speed limit.'],['Many accidents happen when drivers','pass','other cars without checking their mirrors.'],['Many people drive cars to work because it’s more','convenient','to sit comfortably in your own vehicle.'],['Our city has a lot of traffic problems. To','solve','some of them, we’re encouraging people to cycle more.']
 ];
 const d=[['convenient','easy to use or suiting your plans well'],['pass','to go past somebody or something'],['injure','to hurt or cause physical harm'],['respect','polite behaviour towards somebody'],['solve','to find a way to fix a problem'],['fine','money paid as a punishment for not obeying a law'],['prevent','to stop something from happening'],['break the law','to fail to obey the rules of a country, state or city']];
 const html=`<section class="b3ls-repair-fulltask" aria-label="Complete vocabulary task 1 to 8"><div class="b3ls-repair-sentences"><h2>1 Read the sentences (1–8)</h2>${sentences.map((s,i)=>`<p><span>${i+1}</span>${esc(s[0])} <strong>${CIRCLED[i+1]} ${esc(s[1])}</strong> ${esc(s[2])}</p>`).join('')}</div><div class="b3ls-repair-definitions"><h2>2 Match the words to definitions (a–h)</h2>${d.map((x,i)=>`<p><span>${String.fromCharCode(97+i)}</span>${answerSlot(x[0])} ${esc(x[1])}</p>`).join('')}</div></section>`;
 stage.append(node('b3ls-repair-full-wrap',html));
}
function applyGrammar(stage,cfg){
 stage.classList.add('b3ls-repair-grammar');
 const title=stage.querySelector('.ss-title'); if(title&&/SUFFIXES/i.test(title.textContent))title.textContent='PRESENT PERFECT';
 const old=stage.querySelector('.b3ls-repair-grammar-label'); if(!old){const label=node('b3ls-repair-grammar-label',`<strong>PRESENT PERFECT</strong><span>${esc(cfg.label)}</span>`);stage.querySelector('.ss-header')?.append(label)}
}
function applyProblemDefinitions(stage){
 stage.classList.add('b3ls-repair-problem-definitions');
 const body=stage.querySelector('.ss-body');
 if(body){
  if(!body.hasAttribute('data-b3ls-repair-original-style'))body.dataset.b3lsRepairOriginalStyle=body.getAttribute('style')||'';
  setStyle(body,'display','none','important');
 }
 if(stage.querySelector('.b3ls-repair-problem-card')){syncU04AnswerState(stage);return;}
 const rows=PROBLEM_ROWS.map(([word,answer],i)=>`<li><span class="b3ls-repair-row-number">${i+1}</span><strong>${esc(word)}</strong>${i===0?`<span class="b3ls-repair-problem-example" aria-label="Textbook example answer">${esc(answer)}</span>`:mainAnswer(answer)}</li>`).join('');
 const html=`<section class="b3ls-repair-problem-card" aria-label="Exercise 2: complete all seven word-definition rows"><ol class="b3ls-repair-problem-rows" aria-label="Seven original word and answer rows">${rows}</ol><ol class="b3ls-repair-problem-choice-set" aria-label="Nine original definition choices">${PROBLEM_DEFINITIONS.map((d,i)=>`<li><span data-circle="${CIRCLED[i+1]}"></span><p>${esc(d)}</p></li>`).join('')}</ol></section>`;
 stage.append(node('b3ls-repair-problem-wrap',html));
 syncU04AnswerState(stage);
}
function restoreMergedPartNavigation(stage){
 const part=document.querySelector('#part-select');
 if(part?.dataset.b3lsMergeLocked==='1'){
  setHidden(part,part.dataset.b3lsWasHidden==='1');setDisabled(part,part.dataset.b3lsWasDisabled==='1');
  delete part.dataset.b3lsMergeLocked;delete part.dataset.b3lsWasHidden;delete part.dataset.b3lsWasDisabled;
 }
 for(const button of stage?.querySelectorAll?.('.w1-native-parts button[data-value][data-b3ls-merge-locked="1"]')||[]){
  setDisabled(button,button.dataset.b3lsWasDisabled==='1');setHidden(button,button.dataset.b3lsWasHidden==='1');
  button.removeAttribute('aria-hidden');delete button.dataset.b3lsMergeLocked;delete button.dataset.b3lsWasDisabled;delete button.dataset.b3lsWasHidden;
 }
}
function wirePartControls(stage,cfg){
 if(cfg?.mergeParts){
  stage.classList.add('b3ls-repair-merged-task');
  const part=document.querySelector('#part-select');
  if(part&&part.dataset.b3lsMergeLocked!=='1'){
   setData(part,'b3lsWasHidden',part.hidden?'1':'0');setData(part,'b3lsWasDisabled',part.disabled?'1':'0');setData(part,'b3lsMergeLocked','1');setHidden(part,true);setDisabled(part,true);
  }
  for(const button of stage.querySelectorAll('.w1-native-parts button[data-value]')){
   if(button.dataset.b3lsMergeLocked!=='1'){
    setData(button,'b3lsWasHidden',button.hidden?'1':'0');setData(button,'b3lsWasDisabled',button.disabled?'1':'0');setData(button,'b3lsMergeLocked','1');
   }
   setHidden(button,true);setDisabled(button,true);setAttr(button,'aria-hidden','true');
  }
  return;
 }
 for(const button of stage.querySelectorAll('.w1-native-parts button[data-value]')){
  if(button.dataset.b3lsPartWired==='1')continue;
  button.dataset.b3lsPartWired='1';
  button.onclick=()=>{const part=document.querySelector('#part-select');if(!part)return;part.value=button.dataset.value;part.dispatchEvent(new Event('change',{bubbles:true}));window.W1_REPAIR_RUNTIME?.refresh?.();setTimeout(applyStage,180)};
 }
}
function applyStage(){
 const stage=document.querySelector('.stage'); if(!stage)return;
 const route=currentRoute(),cfg=DATA[UNIT]?.[route];
 const player=window.UNLOCK_PLAYER;
 if(cfg?.mainCanvas&&player?.state?.()?.panel==='material'){
  try{player.closePanel?.();player.questionView?.refitLayout?.()}catch{}
 }
 const signature=`${UNIT}:${route}:${cfg?.kind||'none'}`;
 if(stage.dataset.b3lsRepairApplied===signature){
  wirePartControls(stage,cfg);
  if(!cfg){return}
  if(cfg.kind==='grammar'){applyGrammar(stage,cfg);return}
  if(cfg.kind==='nuclear'){ensureNuclear(stage);return}
  if(cfg.kind==='answerTitle'){stage.classList.add('b3ls-repair-answer-title');return}
  if(cfg.kind==='definitionTask'){stage.classList.add('b3ls-repair-definition-task','b3ls-repair-wordbank');circleBanks(stage);return}
  if(cfg.kind==='problemDefinitions'){applyProblemDefinitions(stage);return}
  if(cfg.kind==='u04Definitions'){applyU04Definitions(stage,cfg);return}
  if(cfg.kind==='u03Sentences'){applyU03Sentences(stage);return}
  if(cfg.kind==='u01Modals'){applyU01Modals(stage);return}
  if(cfg.kind==='u01ZooAdvice'){applyU01ZooAdvice(stage);return}
  if(cfg.kind==='u01ContrastingDiscussion'){applyU01ContrastingDiscussion(stage);return}
  if(cfg.kind==='u02Prefixes'){applyU02Prefixes(stage);return}
  if(cfg.kind==='u05Phrasal'){applyU05Phrasal(stage);return}
  if(cfg.kind==='u05Wellbeing'){applyU05Wellbeing(stage,cfg);return}
   if(cfg.kind==='fastFashion'){applyFastFashion(stage);return}
   if(cfg.kind==='moneyCollocations'){applyMoneyCollocations(stage);return}
  if(['definitions','skill'].includes(cfg.kind)&&stage.querySelector('[data-b3ls-repair]')){setSideBody(stage,cfg);circleBanks(stage);return}
  if(['wordbank','wordbankMaterial'].includes(cfg.kind)){applyWordbank(stage,cfg);return}
  if(cfg.kind==='material'){circleBanks(stage);return}
  if(stage.querySelector('[data-b3ls-repair]')){circleBanks(stage);return}
 }
 clean(stage);stage.dataset.b3lsRepairUnit=UNIT;stage.dataset.b3lsRepairRoute=route;stage.dataset.b3lsRepairApplied=signature;
 wirePartControls(stage,cfg);
 if(!cfg)return;
 if(['wordbank','wordbankMaterial'].includes(cfg.kind))applyWordbank(stage,cfg);
 else if(cfg.kind==='u04Definitions')applyU04Definitions(stage,cfg);
 else if(cfg.kind==='u03Sentences')applyU03Sentences(stage);
 else if(cfg.kind==='u01Modals')applyU01Modals(stage);
 else if(cfg.kind==='u01ZooAdvice')applyU01ZooAdvice(stage);
 else if(cfg.kind==='u01ContrastingDiscussion')applyU01ContrastingDiscussion(stage);
 else if(cfg.kind==='u02Prefixes')applyU02Prefixes(stage);
 else if(cfg.kind==='u05Phrasal')applyU05Phrasal(stage);
 else if(cfg.kind==='u05Wellbeing')applyU05Wellbeing(stage,cfg);
  else if(cfg.kind==='fastFashion')applyFastFashion(stage);
  else if(cfg.kind==='moneyCollocations')applyMoneyCollocations(stage);
 else if(cfg.kind==='definitions')applyDefinitions(stage,cfg);
 else if(cfg.kind==='skill')applySkill(stage,cfg);
 else if(cfg.kind==='blog')applyBlog(stage);
 else if(cfg.kind==='fullVocabulary')fullVocabulary(stage);
 else if(cfg.kind==='nuclear')ensureNuclear(stage);
 else if(cfg.kind==='grammar')applyGrammar(stage,cfg);
 else if(cfg.kind==='definitionTask'){stage.classList.add('b3ls-repair-definition-task','b3ls-repair-wordbank');circleBanks(stage)}
 else if(cfg.kind==='problemDefinitions')applyProblemDefinitions(stage);
 else if(cfg.kind==='answerTitle')stage.classList.add('b3ls-repair-answer-title');
}

const customMaterials={
 prefixes:{title:'NEGATIVE PREFIXES · Exercise 1',html:`<article class="b3ls-repair-material"><h2>NEGATIVE PREFIXES</h2><p class="b3ls-repair-material-lead">Use the prefix table from Exercise 1.</p><table><thead><tr><th>prefix</th><th>examples</th></tr></thead><tbody><tr><td>un-</td><td>unnecessary, unknown, unable, unlimited</td></tr><tr><td>in-</td><td>inexpensive, incorrect</td></tr><tr><td>ir-</td><td>irresponsible</td></tr><tr><td>dis-</td><td>disagree, disadvantage, disapprove</td></tr><tr><td>im-</td><td>impossible</td></tr></tbody></table></article>`},
 problems:{title:'TALKING ABOUT PROBLEMS AND SOLUTIONS · Exercise 1',html:`<article class="b3ls-repair-material"><h2>TALKING ABOUT PROBLEMS AND SOLUTIONS</h2><p class="b3ls-repair-material-lead">Use the seven words and phrases from Exercise 1.</p><div class="b3ls-repair-material-bank">${PROBLEM_WORDS.map((w,i)=>`<span><b data-circle="${CIRCLED[i+1]}"></b>${w}</span>`).join('')}</div><div class="b3ls-repair-material-defs"><p><strong>impact</strong> effect</p><p><strong>trouble</strong> problems</p><p><strong>serious</strong> important or bad</p><p><strong>control</strong> to limit something</p><p><strong>fixed</strong> not able to be changed</p><p><strong>influence</strong> to affect how somebody acts or thinks</p><p><strong>figure out</strong> to understand or solve a problem by thinking</p></div></article>`}
};
function setCustomMaterial(kind){
 const pane=document.querySelector('.reference-pane'),stage=document.querySelector('.reference-stage'),select=document.querySelector('#material-select'); if(!pane||pane.hidden||!stage||!select)return;
 const c=customMaterials[kind]; if(!c)return;
 let overlay=pane.querySelector('.b3ls-repair-material-overlay');
 if(!overlay){overlay=document.createElement('section');overlay.className='b3ls-repair-material-overlay';overlay.dataset.b3lsRepair='1';pane.append(overlay)}
 if(overlay.dataset.b3lsRepairMaterial!==kind){overlay.innerHTML=c.html;setData(overlay,'b3lsRepairMaterial',kind)}
 const tools=document.querySelector('.reference-tools');
 if(tools){let title=tools.querySelector('.b3ls-repair-material-titlebar');if(!title){title=document.createElement('strong');title.className='b3ls-repair-material-titlebar';setData(title,'b3lsRepair','1');tools.prepend(title)}setText(title,c.title)}
 setData(pane,'b3lsCustomMaterial',kind);setData(stage,'b3lsRepairMaterial',kind);
 for(const id of ['material-prev','material-next'])setDisabled(document.getElementById(id),true)
}
function clearCustomMaterial(){
 const pane=document.querySelector('.reference-pane');if(!pane)return;
 pane.querySelectorAll('.b3ls-repair-material-overlay').forEach(n=>n.remove());document.querySelectorAll('.b3ls-repair-material-titlebar').forEach(n=>n.remove());delete pane.dataset.b3lsCustomMaterial;
}
function selectModalMaterial(){
 const pane=document.querySelector('.reference-pane'),select=document.querySelector('#material-select');if(!pane||pane.hidden||!select)return;
 const idx=[...select.options].findIndex(o=>/MODALS FOR OBLIGATION/i.test(o.textContent));if(idx<0)return;
 if(select.selectedIndex!==idx){select.selectedIndex=idx;select.dispatchEvent(new Event('change',{bubbles:true}))}
 const sync=()=>{const p=document.getElementById('material-prev'),n=document.getElementById('material-next');setDisabled(p,select.selectedIndex<=0);setDisabled(n,select.selectedIndex>=select.options.length-1)};
 setTimeout(sync,80);sync();
}
function repairMaterial(){
 const cfg=DATA[UNIT]?.[currentRoute()];
 circleBanks(document);
 if(!cfg?.material){clearCustomMaterial();return}
 if(cfg.material==='modals'){clearCustomMaterial();selectModalMaterial()}else setCustomMaterial(cfg.material);
}
document.addEventListener('click',e=>{
 const fastFashionStep=e.target?.closest?.('[data-b3ls-fast-fashion-step]');
 if(fastFashionStep){
  const stage=document.querySelector('.stage');
  if(stage&&DATA[UNIT]?.[currentRoute()]?.kind==='fastFashion'){
   e.preventDefault();e.stopImmediatePropagation();
   const next=Number(fastFashionStep.dataset.b3lsFastFashionStep);
   if(Number.isInteger(next)&&next>=1&&next<=2&&Number(stage.dataset.b3lsFastFashionStep||1)!==next){setData(stage,'b3lsFastFashionStep',next);applyFastFashion(stage)}
   return;
  }
 }
 const moneyStep=e.target?.closest?.('[data-b3ls-money-step]');
 if(moneyStep){
  const stage=document.querySelector('.stage');
  if(stage&&DATA[UNIT]?.[currentRoute()]?.kind==='moneyCollocations'){
   e.preventDefault();e.stopImmediatePropagation();
   const next=Number(moneyStep.dataset.b3lsMoneyStep);
   if(Number.isInteger(next)&&next>=1&&next<=2&&Number(stage.dataset.b3lsMoneyStep||1)!==next){setData(stage,'b3lsMoneyStep',next);applyMoneyCollocations(stage)}
   return;
  }
 }
 const phrasalStep=e.target?.closest?.('[data-b3ls-phrasal-step]');
 if(phrasalStep){
  const stage=document.querySelector('.stage');
  if(stage&&DATA[UNIT]?.[currentRoute()]?.kind==='u05Phrasal'){
   e.preventDefault();e.stopImmediatePropagation();
   const next=Number(phrasalStep.dataset.b3lsPhrasalStep);
   if(Number.isInteger(next)&&next>=1&&next<=2&&Number(stage.dataset.b3lsPhrasalStep||1)!==next){setData(stage,'b3lsPhrasalStep',next);applyU05Phrasal(stage)}
   return;
  }
 }
 const reviewToggle=e.target?.closest?.('#answer-mode,#question-return');
 if(reviewToggle){
  const sync=()=>syncU04AnswerState(document.querySelector('.stage'));
  setTimeout(sync,0);setTimeout(sync,80);
 }
 const partButton=e.target?.closest?.('.w1-native-parts button[data-value]');
 const currentCfg=DATA[UNIT]?.[currentRoute()];
 if(partButton&&currentCfg?.mergeParts){e.preventDefault();e.stopImmediatePropagation();return}
 setTimeout(applyStage,180);
 if(partButton){const part=document.querySelector('#part-select');if(part&&part.value!==partButton.dataset.value){part.value=partButton.dataset.value;part.dispatchEvent(new Event('change',{bubbles:true}))}}
 if(e.target?.id==='material-open'){setTimeout(repairMaterial,40);setTimeout(repairMaterial,180);return}
 const cfg=DATA[UNIT]?.[currentRoute()];if(cfg?.material==='modals'&&(e.target?.id==='material-prev'||e.target?.id==='material-next')){
  const s=document.querySelector('#material-select');if(!s)return;e.preventDefault();e.stopImmediatePropagation();const delta=e.target.id==='material-next'?1:-1;s.selectedIndex=Math.max(0,Math.min(s.options.length-1,s.selectedIndex+delta));s.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(selectModalMaterial,60);
 }
 if(e.target?.id==='close-material'&&cfg?.material&&cfg.material!=='modals'){
  setTimeout(()=>{
   clearCustomMaterial();
   const pane=document.querySelector('.reference-pane'),divider=document.querySelector('.split-divider'),copy=document.querySelector('.split-question-reading');
   if(pane)pane.hidden=true;if(divider)divider.hidden=true;if(copy)copy.hidden=true;
   applyStage();
  },0);
 }
},true);
document.addEventListener('change',e=>{if(e.target?.id==='page-select')setTimeout(applyStage,0)});
let queued=false;const queue=()=>{if(queued)return;queued=true;setTimeout(()=>{queued=false;applyStage();repairMaterial()},30)};
new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden']});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',queue,{once:true});else queue();
})();
