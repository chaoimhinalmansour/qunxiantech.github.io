/* Book 2 Listening & Speaking: source-faithful material restored at point of use. */
(() => {
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slot = (key, answer) => `<span class="inline-answer-slot" data-answer-key="${esc(key)}"><span class="inline-answer-placeholder">&nbsp;</span><span class="inline-answer-value">${esc(answer)}</span></span>`;
  const businessSelector = active => `<div class="cr-b2ls-business-selector" aria-label="Choose one business">${[['art','ART FOR YOU'],['beauty','BEAUTIFUL YOU'],['tea','THE HERBAL TEA SHOP']].map(([k,t],i)=>`<button type="button" aria-pressed="${k===active}" class="${k===active?'is-active':''}" onclick="CLASSROOM_CONTEXT_RESTORATION.part(${i})">${t}</button>`).join('')}</div>`;
  const businessCard = (kind, title, body) => `<article class="cr-b2ls-business-card cr-b2ls-${kind}"><h3>${title}</h3><p>${body}</p></article>`;

  const svgGap=(n,x,y,w,answer)=>`<g class="cr-weather-gap"><text class="cr-weather-gap-number" x="${x-28}" y="${y-18}">${n}</text><line class="cr-weather-gap-line" x1="${x}" y1="${y+6}" x2="${x+w}" y2="${y+6}"/><text class="cr-weather-answer" x="${x+w/2}" y="${y}" text-anchor="middle">${esc(answer)}</text></g>`;
  const sheetSlot=(n,answer)=>`<span class="cr-b2ls-sheet-gap"><span class="cr-b2ls-sheet-number">${['①','②','③','④','⑤'][n-1]}</span>${slot('u04-e9-'+n,answer)}</span>`;
  Object.assign(window.CLASSROOM_RESTORE_CASES ||= {}, {
    'B2_LS_U04:48:7': { hidePartNav:true,
      instruction: '7 Listen to the first part of the discussion about weather and its effects on mood. Complete Sergio’s notes on the ideas map.',
      answer: true,
      html: () => `<section class="cr-b2ls-weather-map" aria-label="Sergio’s weather and mood ideas map"><svg class="cr-b2ls-weather-svg" viewBox="0 0 1704 698" role="img" aria-label="Good weather and bad weather with five numbered gaps"><g fill="none" stroke="#823d96" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M400 176V230M400 314V382M1260 185V230M1260 314V350H1020V382M1260 350H1480V382"/></g><g stroke="#823d96" stroke-width="4" fill="#fff"><ellipse cx="400" cy="96" rx="260" ry="78"/><ellipse cx="1260" cy="96" rx="280" ry="89"/><ellipse cx="400" cy="526" rx="340" ry="144"/><ellipse cx="1020" cy="526" rx="245" ry="144"/><ellipse cx="1480" cy="526" rx="190" ry="144"/></g><g fill="#7b3492"><rect x="230" y="230" width="340" height="84" rx="14"/><rect x="1080" y="230" width="360" height="84" rx="14"/></g><g class="cr-weather-labels" text-anchor="middle"><text x="400" y="110">no link to mood</text><text x="1260" y="59">causes unhappy</text><text x="1260" y="103">people to feel</text><text class="cr-weather-branch" x="400" y="284">good weather</text><text class="cr-weather-branch" x="1260" y="284">bad weather</text><text x="1020" y="450">humid weather</text><text x="1020" y="494">makes it difficult</text><text x="1020" y="596">pay attention.</text><text x="1480" y="450">really hot</text><text x="1480" y="494">weather</text><text x="1480" y="538">makes people</text></g><g class="cr-weather-labels"><text x="200" y="450">in sunny weather</text><text x="200" y="494">people feel less</text><text x="430" y="550">, have</text><text x="200" y="598">more</text><text x="1150" y="550">and</text></g>${svgGap(1,1100,145,320,'more upset / worse')}${svgGap(2,210,548,190,'tired')}${svgGap(3,330,598,240,'energy')}${svgGap(4,870,548,245,'to work')}${svgGap(5,1370,598,220,'sweat')}</svg></section>`
    },
    'B2_LS_U04:51:9': { hidePartNav:true,
      instruction: '9 Listen to the results of the survey. Complete the spreadsheet. Then compare your answers with a partner.',
      answer: true,
      html: () => `<section class="cr-b2ls-weather-sheet" aria-label="Weather survey spreadsheet"><div class="cr-b2ls-sheet-stripe"></div><table><thead><tr><th>Number of people<br><small>(Total = 15)</small></th><th>Weather</th><th>Effect</th></tr></thead><tbody><tr><td>14</td><td>sunny</td><td>better than wet or ${sheetSlot(1,'rainy')}</td></tr><tr><td>${sheetSlot(2,'13')}</td><td>sunshine</td><td>feel they could get a lot done</td></tr><tr><td>12</td><td>good</td><td>did ${sheetSlot(3,'more')}</td></tr><tr><td>${sheetSlot(4,'15')}</td><td>cloudy and dark</td><td>tired</td></tr><tr><td>14</td><td>lots of ${sheetSlot(5,'light')}</td><td>most energy</td></tr></tbody></table></section>`
    },
    'B2_LS_U04:186:10': { hidePartNav:true,
      instruction: '10 Work with a partner and ask the questions. Show interest and ask your partner more questions.',
      answer: false,
      html: () => `<section class="cr-b2ls-weather-discussion" aria-label="Weather discussion"><ol><li>Do people in your country often speak about the weather? Why / Why not?</li><li>What are some ways that people can feel better if the weather makes them feel bad?</li></ol><div class="cr-b2ls-speech">People where I live ...</div><div class="cr-b2ls-speech cr-b2ls-speech-reply">Really? Why? In my country, it’s different.</div></section>`
    },
    'B2_LS_U04:187:11': { hidePartNav:true,
      instruction: '11 Work with a partner. Complete the poster with your own ideas. Then compare answers with another pair. Do they agree?',
      answer: false,
      html: () => `<section class="cr-b2ls-study-poster" aria-label="Weather and studying poster"><header><span class="cr-b2ls-cloud">☁</span><h3>Weather and studying</h3><span class="cr-b2ls-sun">☀</span></header><p>Weather can affect students’ study habits. But students need to study, even in bad weather. Here is a bit of advice on how to study in all types of weather.</p><div class="cr-b2ls-poster-panel"><div class="cr-b2ls-poster-label">If the<br>weather is:</div><div class="cr-b2ls-poster-weather"><span>sunny</span><span>rainy</span><span>quite cold</span><span>very hot</span><span><i class="cr-b2ls-poster-line"></i></span></div><div class="cr-b2ls-poster-label">Try doing<br>this:</div><div class="cr-b2ls-poster-advice"><span>Take breaks outside for more energy.</span><span><i class="cr-b2ls-poster-line"></i></span><span><i class="cr-b2ls-poster-line"></i></span><span><i class="cr-b2ls-poster-line"></i></span><span><i class="cr-b2ls-poster-line"></i></span></div></div></section>`
    },
    'B2_LS_U01:74:1': {
      instruction: '1 Read the travel website. In small groups, check the meaning of the bold words. Use a dictionary to help you.',
      answer: false,
      html: () => `
        <article class="cr-b2ls-travel-site" aria-label="Travel website">
          <nav class="cr-b2ls-site-nav" aria-label="Travel website sections">
            <strong>⌕&nbsp; Plan your trip</strong><span>Places to stay</span><i></i><span>Vancouver City</span><i></i><span>Stanley Park</span>
          </nav>
          <p>The city of Vancouver <b>is located</b> in British Columbia in Western Canada. Vancouver has many things to do. What <b>area</b> of the city do you enjoy the most: the centre or the park? Many people drive cars in the city. Stay away from <b>traffic</b> by taking the bus or train in Vancouver. Plan a visit to Stanley Park. In summer, swim in a <b>lake</b> if you get hot. In the <b>woods</b>, visitors see many birds and other wild animals. Some people sit and relax in a green, sunny <b>field</b>. Come and enjoy Vancouver!</p>
        </article>`
    },
    'B2_LS_U04:83:6': {
      instruction: '6 You are going to listen to a news report about global warming that is closely related to the text below. Read the text. Then look at the ideas (1–5) and circle the main ideas of the text. Compare your answers with a partner.',
      answer: true,
      parts: [
        { title: 'Read the text · 1 of 2', html: () => `<section class="cr-b2ls-ghats-post" aria-label="Western Ghats social-media post"><div class="cr-b2ls-ghats-copy"><p>The Western Ghats is a mountain range in western India, and it’s home to four tropical and subtropical rainforests. The rainforests have a short dry period each year, but typically they get a lot of rain. However, the type of weather in the rainforests is changing quickly and global warming means that nowadays less rain falls. This is changing the rainforests themselves; the environment is <b>becoming</b> damaged and the plants and trees are growing more slowly. The rainforests are home to <b>unusual</b> wildlife,<sup>1</sup> which looks nothing like any other wildlife on Earth, and scientists are still <b>discovering</b> new species.<sup>2</sup></p><p>However, the damage to the rainforests means that some animals which can’t be found anywhere else are <b>disappearing</b> because they’re being killed by the changes in the climate. Many people <b>believe</b> that governments need to save the rainforests so that they’ll still be around in the future. They say it’s important to look after the forests and the animals so that climate change won’t kill them. Researchers will have to look <b>carefully</b> for ways to stop global warming. They’ll need to really watch what is happening, take time to do research and think about whether the possible solutions will help or not.</p></div><div class="cr-b2ls-ghats-notes"><b>1 wildlife</b> (n) animals and birds living in the natural environment<br><b>2 species</b> (n) groups of plants or animals with similar characteristics</div><footer><span>Posted 10:03 am</span><span>♡ 15 &nbsp; ◌</span></footer></section>` },
        { title: 'Choose the main ideas · 2 of 2', html: () => `<ol class="cr-b2ls-main-ideas"><li>how scientists discover new species of animals in the Western Ghats</li><li class="inline-answer-highlight">the negative effects of global warming on some animals</li><li>the effects of climate change on people in India</li><li class="inline-answer-highlight">how rainforests are affected by climate change</li><li class="inline-answer-highlight">why it is important to protect animals that live in the rainforest</li></ol>` }
      ]
    },
    'B2_LS_U06:137:3': {hidePartNav:true,
      instruction: '3 Work with a partner. Choose one of the businesses below. You will discuss this business in the speaking task at the end of this unit.',
      answer: false,
      parts: [
        { title: 'Businesses to choose from · 1 of 3', html: () => `<section class="cr-b2ls-business-focus">${businessSelector('art')}${businessCard('art', 'ART FOR YOU', 'A small art shop just opened in a big city. Art For You is open three days a week and has a website with online sales. The owner puts many popular artists’ work in her shop. The prices are high. People come in to look, but they only buy cheap items. The online sales are low. The owner doesn’t use social media. Also, the website only takes credit cards, with no other way to pay. The owner complains that she isn’t getting enough customers and she’s losing a lot of money quickly. She might have to close the business if she doesn’t sell more art.')}</section>` },
        { title: 'Businesses to choose from · 2 of 3', html: () => `<section class="cr-b2ls-business-focus">${businessSelector('beauty')}${businessCard('beauty', 'BEAUTIFUL YOU', 'A make-up company in a big city has problems selling its product. Beautiful You made a very popular type of make-up. But too many customers tried to order it online and the website stopped working. Now customers complain that they can’t order the make-up easily, so they choose products from other companies. The business is losing money and might have to close if it can’t find a solution.')}</section>` },
        { title: 'Businesses to choose from · 3 of 3', html: () => `<section class="cr-b2ls-business-focus">${businessSelector('tea')}${businessCard('tea', 'THE HERBAL TEA SHOP', 'A herbal tea company in a small town has a shop where people can drink their tea. They don’t sell food or other drinks. Customers come once, but they don’t return. A popular restaurant is next to the tea shop and many people go there instead. If the shop doesn’t get more customers, it will close next month.')}</section>` }
      ]
    },
    'B2_LS_U07:136:1': {
      instruction: '1 Work with a partner. Fill in the ideas map about Sima Najjar on page 163. Write the letter of each phrase below in the bubbles. Use your notes from Exercise 4 in Listening 2 on page 159 to help you.',
      answer: true,
      parts: [
        {
          title: 'Sima Najjar ideas map · branches 1 of 2',
          html: () => `
            <section class="cr-b2ls-map-work" aria-label="Sima Najjar ideas map branches 1 of 2">
              <div class="cr-b2ls-phrase-bank"><span><b>a</b> employs young people</span><span><b>b</b> head of modelling company</span><span><b>c</b> ‘how to’ videos</span><span><b>d</b> worked with female Arab clothing designers</span><span><b>e</b> mother</span><span><b>f</b> viewed by many Saudi Arabian women</span><span><b>g</b> entrepreneur – started online company with videos in Arabic</span></div>
              <div class="cr-b2ls-map cr-b2ls-map-a">
                <svg class="cr-b2ls-map-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#8b3e97" stroke-width="8" stroke-linecap="round"><path d="M500 84V170H140V250M500 170V250M500 170H840V250"/><path d="M140 390V435H140V455M490 390V425H415V455M490 425H565V455M840 390V425H765V455M840 425H915V455M840 250V235"/></g></svg>
                <div class="cr-b2ls-map-root">Sima Najjar</div>
                <div class="cr-b2ls-map-node cr-b2ls-node-company">Company<br>leader</div><div class="cr-b2ls-map-slot cr-b2ls-slot-company">${slot('u7-map-b', 'b')}</div>
                <div class="cr-b2ls-map-node cr-b2ls-node-fashion">Fashion</div><div class="cr-b2ls-map-slot cr-b2ls-slot-fashion-a">${slot('u7-map-a', 'a')}</div><div class="cr-b2ls-map-slot cr-b2ls-slot-fashion-d">${slot('u7-map-d', 'd')}</div>
                <div class="cr-b2ls-map-node cr-b2ls-node-videos">Videos</div><div class="cr-b2ls-map-note cr-b2ls-note-videos">help new<br>mothers have<br>better health</div><div class="cr-b2ls-map-slot cr-b2ls-slot-video-c">${slot('u7-map-c', 'c')}</div><div class="cr-b2ls-map-slot cr-b2ls-slot-video-f">${slot('u7-map-f', 'f')}</div>
              </div>
            </section>`
        },
        {
          title: 'Sima Najjar ideas map · branches 2 of 2',
          html: () => `
            <section class="cr-b2ls-map-work" aria-label="Sima Najjar ideas map branches 2 of 2">
              <div class="cr-b2ls-phrase-bank"><span><b>a</b> employs young people</span><span><b>b</b> head of modelling company</span><span><b>c</b> ‘how to’ videos</span><span><b>d</b> worked with female Arab clothing designers</span><span><b>e</b> mother</span><span><b>f</b> viewed by many Saudi Arabian women</span><span><b>g</b> entrepreneur – started online company with videos in Arabic</span></div>
              <div class="cr-b2ls-map cr-b2ls-map-b">
                <svg class="cr-b2ls-map-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#8b3e97" stroke-width="8" stroke-linecap="round"><path d="M500 84V135H240V180M500 135H830V180"/><path d="M240 320V355H135V385M240 355H425V420M240 355H625V350M830 320V395H780V435M830 395H945V435"/></g></svg>
                <div class="cr-b2ls-map-root">Sima Najjar</div>
                <div class="cr-b2ls-map-node cr-b2ls-node-famous">Why is she<br>famous?</div><div class="cr-b2ls-map-note cr-b2ls-note-howto">‘How-to’ about<br>fashion, food,<br>health, parenting<br>and art</div><div class="cr-b2ls-map-note cr-b2ls-note-views">million video<br>views a month</div><div class="cr-b2ls-map-slot cr-b2ls-slot-famous">${slot('u7-map-g', 'g')}</div>
                <div class="cr-b2ls-map-node cr-b2ls-node-personal">Personal life</div><div class="cr-b2ls-map-note cr-b2ls-note-jordanian">Jordanian</div><div class="cr-b2ls-map-slot cr-b2ls-slot-personal">${slot('u7-map-e', 'e')}</div>
              </div>
            </section>`
        }
      ]
    }
  });

  const rain=window.CLASSROOM_RESTORE_CASES['B2_LS_U04:83:6'],fullRain=rain.parts[0].html,ideas=rain.parts[1].html;
  rain.parts=[0,1].map(i=>({title:i?'The rainforest’s future':'The changing rainforest',html:()=>{const box=document.createElement('div');box.innerHTML=fullRain();const paragraphs=box.querySelectorAll('.cr-b2ls-ghats-copy p');return `<div class="cr-b2ls-reading-work"><section class="cr-b2ls-ghats-post"><div class="cr-b2ls-ghats-copy">${paragraphs[i].outerHTML}</div>${i===0?box.querySelector('.cr-b2ls-ghats-notes').outerHTML:''}${box.querySelector('footer').outerHTML}</section>${ideas()}</div>`;}}));
})();
