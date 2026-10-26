/* B3 RW first-week route hygiene.
   This runs after the unit selection runtime. It removes only source pages
   already audited as post-task duplicate fragments; LESSON.pages and all
   resources remain untouched for source lookup and material carriers. */
(()=>{'use strict';
 const lesson=window.LESSON,structure=window.SCHOOL_STRUCTURE?.[window.LESSON?.id];
 if(!lesson||lesson.id!=='B3_RW_U02'||!structure)return;
 /* p166 is a taskless forest-photo repeat after the collocation activity.
    p200–201 and p227 are old word-list/blue-block remnants after complete
    cause-effect tasks. p238–240 repeat the already-complete desertification
    exercise as three detached paragraph fragments. */
 const remove=new Set([166,200,201,227,238,239,240]);
 (window.SCHOOL_EXCLUDED_PAGES ||= new Set()).forEach(()=>{});
 remove.forEach(p=>window.SCHOOL_EXCLUDED_PAGES.add(p));
 const retained=[];
 for(const route of structure.routes){
   const pages=(route.pages||[]).filter(p=>!remove.has(p));
   if(!pages.length)continue;
   retained.push({...route,pages,anchor:remove.has(route.anchor)?pages[0]:route.anchor});
 }
 structure.routes=retained;
 structure.routeMap={};
 retained.forEach((route,index)=>route.pages.forEach(page=>{structure.routeMap[String(page)]=index;}));
 for(const page of remove){delete structure.groupMap[String(page)];delete structure.reviewMap[String(page)];}
 /* player.js builds its selector before this late repair module. Recreate the
    exact route list so its values remain route-array indexes used by goto(). */
 const select=document.querySelector('#page-select');
 if(select){
   const current=window.UNLOCK_PLAYER?.state?.().current;
   select.replaceChildren();let last=null,group=null;
   retained.forEach((route,index)=>{if(route.section!==last){group=document.createElement('optgroup');group.label=route.section||`Book ${lesson.book} ${lesson.course} Unit ${lesson.unit}`;select.append(group);last=route.section;}group.append(new Option(route.label,String(index)));if(route.pages.includes(current))select.value=String(index);});
 }
 const state=window.UNLOCK_PLAYER?.state?.();
 if(state&&remove.has(state.current)){
   const next=retained.find(r=>r.anchor>state.current)||retained.at(-1);
   if(next)window.UNLOCK_PLAYER.goto(next.anchor,false,{exercise:next.number});
 }
 window.B3_RW_ROUTE_HYGIENE={unit:lesson.id,removed:[...remove],version:'20261025-u02-routes-1'};
})();
