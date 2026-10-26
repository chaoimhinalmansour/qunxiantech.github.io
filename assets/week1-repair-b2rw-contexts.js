(function () {
  'use strict';

  const VERSION = '20261025-b2rw-contexts-aux7-live';
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
  const slot = (api, answer, label) => api.slot(answer, label || 'word');
  const source = (page) => `../assets/textbook-source-v22/pages/B2_RW/p${String(page).padStart(3, '0')}.webp`;

  const weatherWords = ['almost', 'cover', 'dangerous', 'lasted', 'lightning', 'thunder', 'huge'];
  const weatherDefinitions = [
    ['almost', '(adv) nearly but not exactly'],
    ['cover', '(v) to lie on the surface of something'],
    ['dangerous', '(adj) able to harm or hurt somebody or something'],
    ['lasted', '(v) continued for a period of time'],
    ['lightning', '(n) a flash of bright light in the sky during a storm'],
    ['thunder', '(n) the sudden loud noise that comes after a flash of bright light in the sky during a storm'],
    ['huge', '(adj) very big']
  ];

  function weatherVocabulary(api) {
    const answerOpen = !!api.answer;
    const definitions = weatherDefinitions.map(([answer, definition], index) => `
      <li><span class="ctx-number">${index + 1}</span>${slot(api, answer, `definition-${index + 1}`)} <span>${esc(definition)}</span></li>`).join('');
    return `
      <div class="b2rw-context b2rw-weather-context ${answerOpen ? 'is-answer' : ''}">
        <section class="ctx-social-card" aria-label="Friend's social-media weather update">
          <div class="ctx-weather-photo"><img src="../assets/week1-repair-media/b2rw-scotland-storm.webp" alt="A stormy Scottish road with heavy rain and lightning"></div>
          <div class="ctx-social-copy">
            <p>Hey everyone,</p>
            <p>Studying in Scotland is amazing. The weather is very different from home, though. Last night there was a <strong>huge</strong> storm! The rain <strong>lasted</strong> for eight hours. The <strong>thunder</strong> was so loud it scared the dog, and the <strong>lightning</strong>, though scary, was beautiful when it flashed in the sky. I didn’t get to sleep until <strong>almost</strong> 4 am!</p>
            <p>I’m sure water will <strong>cover</strong> many of the local roads this morning, which means that driving might be <strong>dangerous</strong>. We’ll need to be careful on the way to school.</p>
            <div class="ctx-social-meta">3 Likes &nbsp; · &nbsp; Comments &nbsp; · &nbsp; Share</div>
          </div>
        </section>
        <section class="ctx-definition-panel" aria-label="Definitions 1 to 7">
          <div class="ctx-bank" aria-label="Complete seven-word choice set">${weatherWords.map((word, i) => `<span><b data-ctx-choice="${String.fromCodePoint(0x2460 + i)}"></b>${esc(word)}</span>`).join('')}</div>
          <ol class="ctx-definition-list">${definitions}</ol>
        </section>
      </div>`;
  }

  const topicOptions = [
    ['a', 'Summer monsoons are not a new phenomenon, but experts are worried.'],
    ['b', 'Heavy monsoon rains can cause landslides.'],
    ['c', 'Some people in the town of Mawsynram, in Meghalaya, prepare for the rain by covering their homes with dried grass.'],
    ['d', 'People can spend a lot of time indoors during the monsoon, but life does not stop.'],
    ['e', 'The monsoon storms can leave people in the dark.']
  ];
  const topicAnswers = [['2', 'c'], ['3', 'e'], ['4', 'b'], ['5', 'd'], ['6', 'a']];

  function topicSentenceTask(api) {
    return `
      <div class="b2rw-context b2rw-topic-context">
        <section class="ctx-option-panel" aria-label="All five topic sentence choices">
          <h3>Topic sentences a–e</h3>
          <ol class="ctx-alpha-list">
            ${topicOptions.map(([letter, text]) => `<li><b>${letter}</b><span>${esc(text)}</span></li>`).join('')}
          </ol>
        </section>
        <section class="ctx-match-panel" aria-label="Paragraphs 2 to 6">
          <h3>Complete paragraphs 2–6</h3>
          <div class="ctx-match-grid">
            ${topicAnswers.map(([paragraph, answer]) => `<div><span>Paragraph ${paragraph}</span>${slot(api, answer, `paragraph-${paragraph}`)}</div>`).join('')}
          </div>
          <p class="ctx-reading-link">Read the text quickly and choose from the complete set a–e.</p>
        </section>
      </div>`;
  }


  function monsoonParagraph(page) {
    const p=window.LESSON.pages.find(x=>x.index===page),host=document.createElement('div');
    host.innerHTML=p.html;
    const hidden=new Set((p.layers||[]).map(x=>String(x.id)));
    const candidates=[...host.querySelectorAll(':scope>.obj')].filter(n=>{
      const y=parseFloat(n.style.top);return y>=200&&y<940&&!n.hidden&&!hidden.has(n.dataset.id)&&!n.hasAttribute('data-action')&&!n.querySelector('img,audio,video,table,svg');
    });
    const body=candidates.sort((a,b)=>b.textContent.length-a.textContent.length)[0];
    return [...body.querySelectorAll('.text>p')].map(line=>[...line.childNodes].map(n=>n.nodeType===1&&n.style.fontWeight==='700'?'<strong>'+esc(n.textContent)+'</strong>':esc(n.textContent)).join('')).join(' ');
  }
  function topicParagraphTask(api,number,answer) {
    return '<div class="b2rw-context b2rw-topic-context"><section class="ctx-option-panel" aria-label="All five topic sentence choices"><h3>Topic sentences a–e</h3><ol class="ctx-alpha-list">'+topicOptions.map(([letter,text])=>'<li><b>'+letter+'</b><span>'+esc(text)+'</span></li>').join('')+'</ol></section><article class="ctx-match-panel ctx-monsoon-paragraph"><h3>Paragraph '+number+'</h3><p class="ctx-topic-answer">'+slot(api,topicOptions.find(x=>x[0]===answer)[1],'sentence')+'</p><p>'+monsoonParagraph(39+number)+'</p></article></div>';
  }

  const graphInstruction = 'Work with a partner. Take turns to choose a graph (1–4) and describe it to your partner. Use words and phrases from Exercises 1 and 2. Your partner must guess which graph you described.';

  /* Exact p091 chart rectangles in the 1040×1400 source page.  SVG viewBox
     crops preserve the original printed data without recreating any values. */
  const graphBoxes = {
    1: [132, 395, 650, 202], 2: [132, 602, 650, 202],
    3: [132, 809, 650, 202], 4: [132, 1017, 650, 205]
  };
  function rainfallGraph(number, label) {
    const [x, y, width, height] = graphBoxes[number];
    return `<figure class="ctx-rainfall-figure" aria-label="${esc(label)}"><svg viewBox="${x} ${y} ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img"><image href="${source(91)}" x="0" y="0" width="1040" height="1400" /></svg><figcaption>Graph ${number}</figcaption></figure>`;
  }

  function graphOverview() {
    return `
      <div class="b2rw-context b2rw-graph-context graph-overview">
        <section class="ctx-rainfall-overview" aria-label="Four complete rainfall graphs from the textbook">
          ${[1, 2, 3, 4].map((number) => rainfallGraph(number, `Rainfall graph ${number} of 4`)).join('')}
        </section>
      </div>`;
  }

  function graphFocus(number) {
    return `
      <div class="b2rw-context b2rw-graph-context graph-focus">
        <section class="ctx-rainfall-focus" aria-label="Rainfall graph ${number} of 4">
          ${rainfallGraph(number, `Rainfall graph ${number} of 4`)}
        </section>
        <div class="ctx-sequence" aria-label="Four graph sequence">${[1, 2, 3, 4].map((n) => `<span class="${n === number ? 'active' : ''}">${n}</span>`).join('')}</div>
      </div>`;
  }

  const movementWords = ['over', 'under', 'past', 'around', 'across', 'through', 'along'];
  const movementAnswers = ['along', 'past', 'over', 'through', 'under', 'through', 'across', 'around'];

  const sportsWords = [
    ['ancient', '(adj) from a long time ago; very old'],
    ['compete', '(v) to take part in a race or competition; to try to be more successful than somebody else'],
    ['competition', '(n) an organized event in which people try to win a prize by being the best'],
    ['strange', '(adj) not familiar; difficult to understand; different'],
    ['swimming', '(n) a sport where people move through water by moving their body'],
    ['take place', '(phr v) to happen'],
    ['throw', '(v) to send something through the air, pushing it out of your hand']
  ];
  const sportsSentences = [
    ['The football match will ', ' tomorrow at 2 pm in the stadium.'],
    ['Thousands of people from all over the world ', ' in the New York City Marathon every year.'],
    ['Boxing is a(n) ', ' sport; it was popular in Rome thousands of years ago.'],
    ['The first cricket game I ever saw was ', ' because I didn’t understand the rules. Once I learnt more about the sport, I became a big fan.'],
    ['In baseball, players must be able to ', ' the ball a long distance directly to another player.'],
    ['The best tennis players from each secondary school will play in a(n) ', ' to see who is the best player in the city.'],
    ['Because Elsa grew up near the sea, her favourite sport was ', '. She was in the water nearly every day during the summer.']
  ];
  const sportsAnswers = ['take place', 'compete', 'ancient', 'strange', 'throw', 'competition', 'swimming'];
  function sportsVocabulary(api) {
    const definitions = sportsWords.map(([word, definition]) => `<p><strong>${esc(word)}</strong> ${esc(definition)}</p>`).join('');
    const sentences = sportsSentences.map(([start, end], index) => `<p><span class="ctx-number">${index + 1}</span>${esc(start)}${slot(api, sportsAnswers[index], `sports-${index + 1}`)}${esc(end)}</p>`).join('');
    return `<div class="b2rw-context b2rw-sports-context"><section class="ctx-sports-definitions" aria-label="All seven original vocabulary definitions">${definitions}</section><section class="ctx-sports-sentences" aria-label="All seven original sentence completions">${sentences}</section></div>`;
  }

  function temperatureTask(api) {
    const words = ['high', 'low', 'maximum', 'minimum'];
    const lines = [
      ['The ', ' temperature is 32 °C, in July.'],
      ['The ', ' temperature is 3 °C, in December.'],
      ['In July there are ', ' temperatures.'],
      ['In December, there are ', ' temperatures.']
    ];
    return `<div class="b2rw-context b2rw-temperature-context"><section class="ctx-temperature-chart"><svg class="ctx-native-diagram" viewBox="246 183 550 425" role="img" aria-label="Two complete temperature graphs A and B"><defs><clipPath id="ctx-temperature-mask"><rect x="246" y="183" width="550" height="425"/></clipPath></defs><image clip-path="url(#ctx-temperature-mask)" href="${source(90)}" width="1040" height="1400"/></svg></section><section class="ctx-temperature-task"><div class="ctx-bank" aria-label="Complete four-word choice set">${words.map((word, index) => `<span><b data-ctx-choice="${String.fromCodePoint(0x2460 + index)}"></b>${word}</span>`).join('')}</div><div class="ctx-temperature-lines">${lines.map(([start, end], index) => `<p><span class="ctx-number">${index + 1}</span>${esc(start)}${slot(api, words[[2, 3, 0, 1][index]], `temperature-${index + 1}`)}${esc(end)}</p>`).join('')}</div></section></div>`;
  }

  function movementContinuation(api) {
    const sentences = [
      ['It is easy to get to my house. First, walk ', ' the High Street.'],
      ['Go ', ' the bank and ', ' the bridge.'],
      ['Then walk ', ' the park and ', ' the next bridge.'],
      ['Go ', ' the tunnel – watch out for cars – and walk ', ' the road.'],
      ['Walk ', ' the lake. My house is at the end of the road. It’s the pink one!']
    ];
    let answerIndex = 0;
    const lines = sentences.map((parts, row) => {
      const rendered = parts.map((part, index) => {
        if (index === parts.length - 1) return esc(part);
        const answer = movementAnswers[answerIndex++];
        return `${esc(part)}<sup class="ctx-blank-number">(${answerIndex})</sup>${slot(api, answer, `movement-${answerIndex}`)}`;
      }).join('');
      return `<p><span class="ctx-number">${row + 1}</span>${rendered}</p>`;
    }).join('');
    return `
      <div class="b2rw-context b2rw-movement-context">
        <section class="ctx-map-panel">
          <div class="ctx-map-crop" role="img" aria-label="Route map from Exercise 2"><svg class="ctx-native-diagram" viewBox="103 188 916 551" role="img" aria-label="Complete route map from Start here to the pink house"><defs><clipPath id="ctx-map-mask"><rect x="103" y="188" width="916" height="551"/></clipPath></defs><image clip-path="url(#ctx-map-mask)" href="${source(115)}" width="1040" height="1400"/></svg></div>
          <div class="ctx-bank" aria-label="Complete seven-preposition choice set">${movementWords.map((word, i) => `<span><b data-ctx-choice="${String.fromCodePoint(0x2460 + i)}"></b>${esc(word)}</span>`).join('')}</div>
        </section>
        <section class="ctx-route-copy" aria-label="Exercise 2 paragraph linked to the map">
          ${lines}
        </section>
      </div>`;
  }

  const cases = {
    'B2_RW_U04:29:1': {
      section: 'READING 1',
      title: 'PREPARING TO READ',
      subtitle: 'UNDERSTANDING KEY VOCABULARY',
      instruction: '1 You are going to read a text about weather. Before you read, look at your friend’s update on social media. Then match the bold words to the definitions below (1–7).',
      html: weatherVocabulary,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U04:39:4': {
      section: 'READING 1',
      title: 'WHILE READING',
      subtitle: 'READING FOR MAIN IDEAS',
      instruction: '4 Read the topic sentences (a–e). Then read the text quickly. Complete the paragraphs (2–6) with the correct topic sentence.',
      html: topicSentenceTask,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U04:141:4': {
      section: 'LANGUAGE DEVELOPMENT',
      title: 'DESCRIBING A GRAPH',
      instruction: `4 ${graphInstruction}`,
      html: graphOverview,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U04:142:': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(1), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:142:4': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(1), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:143:': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(2), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:143:4': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(2), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:144:': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(3), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:144:4': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(3), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:145:': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(4), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U04:145:4': { section: 'LANGUAGE DEVELOPMENT', title: 'DESCRIBING A GRAPH', instruction: `4 ${graphInstruction}`, html: () => graphFocus(4), layoutClass: 'b2rw-context-stage' },
    'B2_RW_U05:138:': {
      section: 'LANGUAGE DEVELOPMENT',
      title: 'PREPOSITIONS OF MOVEMENT',
      instruction: '2 Look at the map. Use the prepositions from Exercise 1 to complete the paragraph. You may need to use some prepositions more than once.',
      html: movementContinuation,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U05:138:2': {
      section: 'LANGUAGE DEVELOPMENT',
      title: 'PREPOSITIONS OF MOVEMENT',
      instruction: '2 Look at the map. Use the prepositions from Exercise 1 to complete the paragraph. You may need to use some prepositions more than once.',
      html: movementContinuation,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U05:29:1': {
      section: 'READING 1',
      title: 'PREPARING TO READ',
      subtitle: 'UNDERSTANDING KEY VOCABULARY',
      instruction: '1 Read the definitions. Complete the sentences with the bold words.',
      html: sportsVocabulary,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U05:137:2': {
      section: 'LANGUAGE DEVELOPMENT',
      title: 'PREPOSITIONS OF MOVEMENT',
      instruction: '2 Look at the map. Use the prepositions from Exercise 1 to complete the paragraph. You may need to use some prepositions more than once.',
      html: movementContinuation,
      layoutClass: 'b2rw-context-stage'
    },
    'B2_RW_U04:131:1': {
      section: 'LANGUAGE DEVELOPMENT',
      title: 'COLLOCATIONS WITH TEMPERATURE',
      instruction: '1 Look at the graphs (A and B). Complete the sentences (1–4) with words from the box.',
      html: temperatureTask,
      layoutClass: 'b2rw-context-stage'
    }
  };


  cases['B2_RW_U04:29:1'].answer=true;
  cases['B2_RW_U04:29:1'].keepMaterial=true;
  cases['B2_RW_U04:39:4'].answer=true;
  cases['B2_RW_U04:39:4'].keepMaterial=true;
  cases['B2_RW_U04:39:4'].parts=topicAnswers.map(([number,answer])=>({
    title:'Paragraph '+number,
    html:api=>topicParagraphTask(api,Number(number),answer)
  }));
  cases['B2_RW_U04:131:1'].answer=true;
  cases['B2_RW_U04:131:1'].keepMaterial=true;
  cases['B2_RW_U05:29:1'].answer=true;
  cases['B2_RW_U05:29:1'].keepMaterial=true;
  cases['B2_RW_U05:137:2'].answer=true;
  cases['B2_RW_U05:137:2'].keepMaterial=true;
  cases['B2_RW_U05:138:'].answer=true;
  cases['B2_RW_U05:138:'].keepMaterial=true;
  cases['B2_RW_U05:138:2'].answer=true;
  cases['B2_RW_U05:138:2'].keepMaterial=true;
  Object.assign(window.CLASSROOM_RESTORE_CASES ||= {}, cases);
  window.WEEK1_REPAIR_B2RW_CONTEXTS = {
    version: VERSION,
    cases: Object.keys(cases),
    sharedFixChecks: {
      'B2_RW_U04:131:1': { issue: 'R043', expectedChoices: ['high', 'low', 'maximum', 'minimum'] },
      'B2_RW_U05:29:1': { issue: 'R045', expectedChoices: ['ancient', 'compete', 'competition', 'strange', 'swimming', 'take place', 'throw'] },
      'B2_RW_U05:137:2': { issue: 'R047', expectedChoices: movementWords }
    }
  };

  window.CLASSROOM_CONTEXT_RESTORATION?.refresh?.();
})();

/* Both authored fragments now form one complete map task; keep old links valid. */
(()=>{if(window.LESSON?.id!=='B2_RW_U05')return;const S=window.SCHOOL_STRUCTURE?.B2_RW_U05;if(!S||S.__w1MapTaskMerged)return;S.__w1MapTaskMerged=true;
S.routes.splice(0,S.routes.length,...S.routes.filter(r=>r.anchor!==138));S.assignmentRedirect['138']=137;S.routeMap={};S.routes.forEach((r,i)=>{for(const page of r.pages||[r.anchor])S.routeMap[String(page)]=i});
const select=document.querySelector('#page-select');if(select){select.replaceChildren();let section='',group;S.routes.forEach((r,i)=>{if(section!==r.section){section=r.section;group=document.createElement('optgroup');group.label=section||'Unit 5';select.append(group)}const option=document.createElement('option');option.value=String(i);option.textContent=r.label;group.append(option)})}
})();
