/* Local correction: textbook speaking preview, B3 LS U6, source anchor 136. */
(()=>{'use strict';
const VERSION='20261022-speaking-preview-1';
let stage=null,pending=false;
const blank=(kind,label)=>`<span class="speaking-preview-blank speaking-preview-blank--${kind}" role="img" aria-label="${label}"></span>`;
const template=()=>`<div class="speaking-preview-scaffold" aria-label="Introduction to a presentation about a simple invention">
<p class="speaking-preview-intro">I would like to present an invention which has changed the way <span class="speaking-preview-keep">we ${blank('phrase','Complete how the invention has changed our lives')}.</span> It’s a simple invention and we have all used it.</p>
<p class="speaking-preview-name">It’s the ${blank('name','Name the invention')}.</p>
<div class="speaking-preview-definition"><p class="speaking-preview-writing-row"><span>A ${blank('name','Name the invention')} is</span>${blank('sentence','Explain the invention')}<span>.</span></p><p class="speaking-preview-hint">(explain the invention here)</p></div>
<div class="speaking-preview-use"><p class="speaking-preview-writing-row"><span>You can</span>${blank('sentence','Explain how it is used')}<span>.</span></p><p class="speaking-preview-hint">(explain how it is used in general)</p></div>
<p class="speaking-preview-conclusion">First, I am going to talk about ${blank('phrase','Preview the first part of the presentation')}. Then, I will explain how it has improved our lives.</p>
</div>`;
function apply(){
 if(!stage||window.UNLOCK_PLAYER?.state().current!==136)return;
 const header=stage.querySelector(':scope>.ss-header'),body=stage.querySelector(':scope>.ss-body');
 if(!header||!body)return;
 if(body.dataset.speakingPreview!==VERSION){
  body.dataset.speakingPreview=VERSION;body.dataset.layoutOwner='speaking-preview';
  body.className='ss-body speaking-preview-body';body.innerHTML=template();
  stage.classList.remove('visual-raw-flow','visual-original-layout');
  stage.classList.add('speaking-preview-layout');stage.dataset.ssTemplate='textbook-speaking-preview';
 }
 const top=header.offsetTop+header.offsetHeight+28;
 const css=`left:108px;top:${top}px;width:1704px;height:${1010-top}px;`;
 if(body.style.cssText!==css)body.style.cssText=css;
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;apply()})}
function boot(){
 stage=document.querySelector('#app .stage');
 if(!stage||!window.CLASSROOM_INPUT_STANDARDS||!window.CLASSROOM_DETAIL_REFINED){setTimeout(boot,50);return}
 new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length))schedule()}).observe(stage,{childList:true,subtree:true});
 window.addEventListener('resize',schedule);document.fonts?.ready.then(schedule);schedule();
 window.CLASSROOM_SPEAKING_PREVIEW={version:VERSION,refresh:schedule};
}
boot();
})();
