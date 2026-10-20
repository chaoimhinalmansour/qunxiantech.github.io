/* Offline classroom resources. Existing caches are preserved across updates. */
'use strict';
const CACHE='unlock-classroom-shell-20261021-context-2',ROOT=new URL('./',self.location.href);
const same=u=>u.origin===ROOT.origin&&u.pathname.startsWith(ROOT.pathname);
function key(request){const u=new URL(typeof request==='string'?request:request.url);u.hash='';if(u.pathname===ROOT.pathname)u.pathname+='index.html';if(u.pathname.endsWith('.html'))u.search='';return u.href;}
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function partial(request,response){if(response.type==='opaque'||response.status!==200)return response;const range=request.headers.get('range');if(!range)return response;const match=/^bytes=(\d*)-(\d*)$/.exec(range);if(!match)return fetch(request);const blob=await response.blob(),size=blob.size;let start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2])),end=match[1]?(match[2]?Number(match[2]):size-1):size-1;end=Math.min(end,size-1);if(start<0||start>=size||end<start)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});const headers=new Headers(response.headers);headers.set('Content-Range',`bytes ${start}-${end}/${size}`);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');return new Response(blob.slice(start,end+1,blob.type),{status:206,headers});}
async function serve(request,event){const url=new URL(request.url),k=key(request);let cache;
// Refresh entry documents from the network. Cached copies remain a fallback on weak connections.
if(request.mode==='navigate'||url.pathname.endsWith('.html')){try{const fresh=await fetch(request,{cache:'no-cache',signal:AbortSignal.timeout(6000)});if(fresh.ok){event.waitUntil(caches.open(CACHE).then(c=>c.put(k,fresh.clone())).catch(()=>{}));return fresh;}}catch(_){}try{const fallback=await caches.match(k);if(fallback)return fallback;}catch(_){}return fetch(request);}
try{cache=await caches.open(CACHE);const hit=await cache.match(k);if(hit)return partial(request,hit);}catch(_){return fetch(request);}
 try{const response=await fetch(request);if(response.status===200&&response.type!=='opaque'&&!request.headers.has('range'))event.waitUntil(cache.put(k,response.clone()).catch(()=>{}));return response;}catch(error){try{const old=await caches.match(k);if(old)return partial(request,old);}catch(_){}throw error;}}
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url);if(r.method==='GET'&&same(u)&&!u.pathname.endsWith('classroom-sw.js'))event.respondWith(serve(r,event));});
