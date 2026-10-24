/* User-approved merged materials: omit only their redundant classroom routes. */
(()=>{'use strict';
 const byUnit={B2_RW_U05:{172:{page:171,exercise:2},175:{page:174,exercise:4}},B3_LS_U06:{136:{page:135,exercise:2}}},unit=window.LESSON?.id,aliases=byUnit[unit];
 if(!aliases)return;
 const structure=window.SCHOOL_STRUCTURE?.[unit];if(!structure)return;
 const omitted=Object.keys(aliases).map(Number),pages=new Set(omitted);
 structure.routes=structure.routes.filter(route=>!pages.has(route.anchor));
 structure.routeMap={};structure.routes.forEach((route,index)=>route.pages.forEach(page=>{structure.routeMap[String(page)]=index}));
 window.SCHOOL_EXCLUDED_PAGES ||= new Set();for(const page of omitted)window.SCHOOL_EXCLUDED_PAGES.add(page);
 function redirectHash(){const params=new URLSearchParams(location.hash.slice(1)),alias=aliases[Number(params.get('page'))];if(!alias)return;params.set('page',String(alias.page));params.set('exercise',String(alias.exercise));history.replaceState(history.state,'','#'+params.toString())}
 function redirectSavedPosition(){const player=window.UNLOCK_PLAYER;if(!player)return;const go=player.goto.bind(player);player.goto=(page,remember=true,options={})=>{const alias=aliases[Number(page)];return alias?go(alias.page,remember,{...options,exercise:alias.exercise}):go(page,remember,options)}}
 redirectHash();window.addEventListener('hashchange',redirectHash,true);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',redirectSavedPosition,{once:true});else redirectSavedPosition();
 window.CLASSROOM_RESTORED_ROUTE_SCOPE={version:'20261024-map175-dedup-2',unit,omitted,aliases};
})();
