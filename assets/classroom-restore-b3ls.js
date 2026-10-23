/* Context restoration cases: Book 3 Listening & Speaking U05/U06. */
(()=>{'use strict';
const escape=(api,text)=>api&&api.escape?api.escape(text):String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slot=(api,answer,label)=>api&&api.slot?api.slot(answer,label):"<span class='inline-answer-slot'><span class='inline-answer-placeholder'>"+escape(api,label)+"</span><span class='inline-answer-value'>"+escape(api,answer)+"</span></span>";
const presentation="Do you have problems focusing on your work? Are you under a lot of stress? Do you want to get more exercise while trying something new and exciting? If so, it’s time to take up taekwondo! Taekwondo is great exercise. And as we all know, exercise improves your health. Taekwondo also has mental benefits — it has been shown to improve your concentration. In addition, it makes you feel good about yourself. This martial art was developed in Korea, and is now popular around the world. Whether you are looking for physical well-being, increased confidence or a life with less stress, Black Belt taekwondo club has it all. Sign up now for a free introductory class, starting on January 15th.";
const blank=(kind,label)=>"<span class='cr-b3ls-preview-blank cr-b3ls-preview-blank--"+kind+"' role='img' aria-label='"+label+"'></span>";
function scriptAndOrder(api,start=0){
 const items=[['specific information about the place, time, etc.','4'],['background information about the programme','3'],['rhetorical questions about the problems, to attract the listeners’ attention','1'],['introduction of the solution','2']];
 return `<div class="cr-b3ls cr-b3ls-problem-solution"><section class="cr-b3ls-script-paper"><h2>Script for presentation</h2><p>${escape(api,presentation)}</p></section><section class="cr-b3ls-ordering"><ol style="counter-reset:order ${start}">${items.slice(start,start+2).map(v=>`<li><span>${v[0]}</span>${slot(api,v[1],'__')}</li>`).join('')}</ol></section></div>`;
}
function previewWithRoles(){
 return "<div class='cr-b3ls cr-b3ls-preview-with-roles' aria-label='Partner role task and presentation preview'>"+
 "<div class='cr-b3ls-roles'><p><strong>Student A:</strong> give an introduction to a presentation about the paperclip.</p><p><strong>Student B:</strong> give an introduction to a presentation about the ballpoint pen.</p></div>"+
 "<section class='cr-b3ls-preview-paper' aria-label='Preview of an introduction to a presentation'>"+
 "<p class='cr-b3ls-preview-intro'>I would like to present an invention which has changed the way <span class='cr-b3ls-preview-keep'>we "+blank("phrase","Complete how the invention has changed our lives")+".</span> It’s a simple invention and we have all used it.</p>"+
 "<p>It’s the "+blank("name","Name the invention")+".</p>"+
 "<div class='cr-b3ls-preview-row'><span>A "+blank("name","Name the invention")+" is</span>"+blank("sentence","Explain the invention")+"<span>.</span></div><p class='cr-b3ls-preview-hint'>(explain the invention here)</p>"+
 "<div class='cr-b3ls-preview-row'><span>You can</span>"+blank("sentence","Explain how it is used")+"<span>.</span></div><p class='cr-b3ls-preview-hint'>(explain how it is used in general)</p>"+
 "<p>First, I am going to talk about "+blank("phrase","Preview the first part of the presentation")+". Then, I will explain how it has improved our lives.</p></section></div>";
}
Object.assign(window.CLASSROOM_RESTORE_CASES ||= {},{
 "B3_LS_U05:126:2":{title:"PROBLEM-SOLUTION ORGANIZATION",instruction:"2 What is the organization of the presentation? Number the information.",parts:[{title:"Information 1–2",html:api=>scriptAndOrder(api,0)},{title:"Information 3–4",html:api=>scriptAndOrder(api,2)}],answer:true,layoutClass:"cr-b3ls-problem-solution-layout"},
 "B3_LS_U06:135:2":{title:"PREVIEWING A TOPIC",instruction:"2 Work with a partner. Practise giving an introduction about a simple invention. Use the preview below to organize your ideas.",html:previewWithRoles,answer:false,layoutClass:"cr-b3ls-preview-with-roles-layout"}
});
})();
