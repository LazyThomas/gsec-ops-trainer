'use strict';
const KEY='gsec_ops_trainer_v03';
const $=id=>document.getElementById(id);
let QUESTIONS=[],LABS=[],SECTIONS={},ALL=[],BYID=new Map(),state,selected=null,confidence=0,libraryLimit=30,ready=false;
const blank=()=>({version:3,xp:0,attempts:0,correct:0,streak:0,bestStreak:0,mistakes:[],confidentWrong:[],domains:{},confidence:{},labStats:{},notes:{},session:null,lastResult:null});
function notice(text){$('notice').textContent=text;$('notice').classList.remove('hidden');}
function clean(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('Invalid progress object');
 const out=blank();
 for(const k of ['xp','attempts','correct','streak','bestStreak']){if(raw[k]!==undefined&&(!Number.isFinite(raw[k])||raw[k]<0))throw Error('Invalid '+k);out[k]=raw[k]||0;}
 for(const k of ['mistakes','confidentWrong']){if(raw[k]!==undefined&&!Array.isArray(raw[k]))throw Error('Invalid '+k);out[k]=[...new Set((raw[k]||[]).filter(id=>BYID.has(id)))];}
 for(const [key,val] of Object.entries(raw.domains||{})){if(!val||!Number.isFinite(val.a)||!Number.isFinite(val.c)||val.a<0||val.c<0||val.c>val.a)throw Error('Invalid domain stats');if(!['__proto__','constructor','prototype'].includes(key))Object.defineProperty(out.domains,key,{value:{a:val.a,c:val.c},enumerable:true,writable:true,configurable:true});}
 for(const [key,val] of Object.entries(raw.notes||{}))if(BYID.has(Number(key))||BYID.has(key))out.notes[key]=String(val).slice(0,500);
 for(const [key,val] of Object.entries(raw.confidence||{}))if([1,2,3].includes(val)&&!['__proto__','constructor','prototype'].includes(key))out.confidence[key]=val;
 for(const lab of LABS){const v=(raw.labStats||{})[lab.lab];if(v&&Number.isFinite(v.best))out.labStats[lab.lab]={best:Math.max(0,Math.min(100,v.best)),last:Number.isFinite(v.last)?Math.max(0,Math.min(100,v.last)):0};}
 if(raw.session){const s=raw.session;
  if(!Array.isArray(s.ids)||!s.ids.length||s.ids.length>150||s.ids.some(id=>!BYID.has(id))||new Set(s.ids).size!==s.ids.length)throw Error('Invalid saved session questions');
  if(!Number.isInteger(s.index)||s.index<0||s.index>=s.ids.length||!Array.isArray(s.orders)||s.orders.length!==s.ids.length)throw Error('Invalid session position');
  if(s.orders.some(o=>!Array.isArray(o)||o.length!==4||new Set(o).size!==4||o.some(i=>!Number.isInteger(i)||i<0||i>3)))throw Error('Invalid answer order');
  if(!Array.isArray(s.responses)||s.responses.length!==s.ids.length||s.responses.some(r=>r!==null&&(!r||!Number.isInteger(r.choice)||r.choice<0||r.choice>3||![1,2,3].includes(r.confidence))))throw Error('Invalid saved answers');
  if(!['section','rapid','weak','mistakes','confident','exam','timed','boss','mission'].includes(s.mode)||!Array.isArray(s.flags)||s.flags.some(i=>!Number.isInteger(i)||i<0||i>=s.ids.length))throw Error('Invalid session mode');
  if(s.mode==='timed'&&(!Number.isFinite(s.deadline)||s.ids.length!==106))throw Error('Invalid exam deadline');
  if(typeof s.label!=='string'||!Number.isFinite(s.xp)||s.xp<0)throw Error('Invalid session summary');
  if(s.mode==='mission'&&!LABS.some(l=>l.lab===s.lab))throw Error('Invalid mission');
  out.session={...s,label:s.label.slice(0,200)};
 }
 return out;
}
function load(){
 try{let raw=localStorage.getItem(KEY);if(raw)return clean(JSON.parse(raw));
  raw=localStorage.getItem('gsec_ops_trainer_v02')||localStorage.getItem('gsec_ops_trainer_v01');
  if(raw){notice('Your earlier progress was copied to v0.3. The original saved progress remains untouched.');return clean(JSON.parse(raw));}
 }catch(e){notice('Saved progress could not be read. A fresh session is available; the unreadable storage has not been overwritten. Export any accessible backup before resetting.');storageBlocked=true;}
 return blank();
}
let storageBlocked=false;
function save(){if(storageBlocked)return;try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){notice('Device storage is unavailable or full. Progress currently lives only in this tab. Export it before closing.');}}
function shuffle(items){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function weighted(pool,n){return pool.map(q=>{const d=state.domains[q.domain];const w=d&&d.a>=2&&d.c/d.a<.8?3:1;return {q,key:-Math.log(Math.max(Number.MIN_VALUE,Math.random()))/w};}).sort((a,b)=>a.key-b.key).slice(0,n).map(x=>x.q);}
function balanced(n){const result=[];const secs=shuffle(Object.keys(SECTIONS));secs.forEach((sec,i)=>result.push(...shuffle(QUESTIONS.filter(q=>q.section===sec)).slice(0,Math.floor(n/6)+(i<n%6?1:0))));return shuffle(result);}
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function clear(id){$(id).replaceChildren();return $(id);}
function show(id){for(const s of ['home','labs','library','game','result'])$(s).classList.toggle('hidden',s!==id);window.scrollTo(0,0);}
function stat(box,label,value){const d=el('div',undefined,'stat');d.append(el('span',label,'muted tiny'),el('strong',String(value)));box.append(d);}
function table(container,headers,rows){const t=el('table');const head=el('thead');const tr=el('tr');headers.forEach(h=>tr.append(el('th',h)));head.append(tr);const body=el('tbody');for(const row of rows){const r=el('tr');row.forEach(v=>r.append(el('td',String(v))));body.append(r);}t.append(head,body);container.append(t);}
function dashboard(){
 const box=clear('stats');stat(box,'TOTAL XP',state.xp);stat(box,'ACCURACY',state.attempts?Math.round(state.correct/state.attempts*100)+'%':'—');stat(box,'ANSWER STREAK',state.streak);stat(box,'LABS PASSED',Object.values(state.labStats).filter(s=>s.best>=75).length+' / '+LABS.length);
 const rows=Object.keys(SECTIONS).map(sec=>{const qs=QUESTIONS.filter(q=>q.section===sec);return [sec+' · '+SECTIONS[sec],qs.length,qs.filter(q=>state.mistakes.includes(q.id)).length];});table(clear('coverage'),['Section','Questions','Saved misses'],rows);
 table(clear('domains'),['Domain','Attempts','Accuracy'],Object.entries(state.domains).sort((a,b)=>a[0].localeCompare(b[0])).map(([d,s])=>[d,s.a,s.a?Math.round(s.c/s.a*100)+'%':'—']));
 const s=state.session;$('resumeCard').classList.toggle('hidden',!s);if(s){$('resumeTitle').textContent=s.label;$('resumeInfo').textContent=s.responses.filter(Boolean).length+' / '+s.ids.length+' answered'+(s.mode==='timed'?' · timer continues':'');}
}
function home(){show('home');dashboard();}
function start(mode,lab=null){
 if(!ready)return;
 let pool=QUESTIONS,count=25,label='',picked=null;
 if(mode==='section'){pool=QUESTIONS.filter(q=>q.section===$('sectionSelect').value);count=40;label=$('sectionSelect').value+' section drill';}
 if(mode==='rapid'){const type=$('rapidType').value;pool=QUESTIONS.filter(q=>['port','command','acronym'].includes(q.kind)&&(type==='all'||q.kind===type));label='Rapid fire · '+(type==='all'?'all recall drills':type);}
 if(mode==='weak'){picked=weighted(pool,25);label='Weak-area drill';}
 if(mode==='mistakes'||mode==='confident'){pool=ALL.filter(q=>(mode==='mistakes'?state.mistakes:state.confidentWrong).includes(q.id));count=30;label=mode==='mistakes'?'Mistake review':'Confident-wrong drill';}
 if(mode==='boss'){pool=QUESTIONS.filter(q=>q.kind==='scenario');label='Scenario challenge';}
 if(mode==='exam'||mode==='timed'){count=mode==='timed'?106:50;picked=balanced(count);label=mode==='timed'?'106-question timed exam':'50-question mixed exam';}
 if(mode==='mission'){pool=lab.steps;count=pool.length;label='Lab '+lab.lab+' · '+lab.title;picked=[...pool];}
 if(!pool.length){notice('No questions are saved for this drill yet. Complete some practice first.');return;}
 if(state.session&&!confirm('Replace the saved session? Its unfinished answers will be discarded. Recorded study progress remains.'))return;
 const qs=picked||shuffle(pool).slice(0,count);
 state.session={mode,label,lab:lab?.lab||null,ids:qs.map(q=>q.id),orders:qs.map(()=>shuffle([0,1,2,3])),responses:qs.map(()=>null),flags:[],index:0,started:Date.now(),deadline:mode==='timed'?Date.now()+4*60*60*1000:null,xp:0};save();renderQuestion();
}
function isExam(){return ['exam','timed'].includes(state.session?.mode);}
function renderQuestion(){
 const s=state.session;if(!s)return home();if(s.mode==='timed'&&Date.now()>=s.deadline)return finish(true);
 show('game');const q=BYID.get(s.ids[s.index]);const response=s.responses[s.index];selected=response?.choice??null;confidence=response?.confidence||0;
 $('modeLabel').textContent=s.label;$('position').textContent='Question '+(s.index+1)+' of '+s.ids.length;$('progress').value=s.responses.filter(Boolean).length/s.ids.length*100;
 const meta=clear('qmeta');[q.section,q.domain,q.kind].forEach(t=>meta.append(el('span',t,'badge')));$('question').textContent=q.q;
 $('feedback').classList.add('hidden');$('notePanel').classList.add('hidden');$('answerButton').disabled=!!response&&!isExam();$('answerButton').textContent=response&&isExam()?'Update answer':'Submit answer';
 document.querySelectorAll('[name=confidence]').forEach(r=>{r.checked=Number(r.value)===confidence;r.disabled=!!response&&!isExam();});
 const box=clear('choices');s.orders[s.index].forEach((original,i)=>{const b=el('button',String.fromCharCode(65+i)+'. '+q.choices[original],'choice');b.setAttribute('aria-pressed',String(selected===original));if(selected===original)b.classList.add('selected');b.disabled=!!response&&!isExam();b.onclick=()=>{selected=original;box.querySelectorAll('button').forEach((button,j)=>{button.classList.toggle('selected',s.orders[s.index][j]===original);button.setAttribute('aria-pressed',String(s.orders[s.index][j]===original));});};box.append(b);});
 if(response&&!isExam())feedback(q,response);
 $('nextButton').textContent=s.index===s.ids.length-1?(isExam()?'Review / submit':'Finish session'):'Next';$('nextButton').disabled=!isExam()&&!response;
 $('prevButton').classList.toggle('hidden',!isExam());$('prevButton').disabled=s.index===0;
 $('flagButton').classList.toggle('hidden',!isExam());$('flagButton').textContent=s.flags.includes(s.index)?'⚑ Flagged':'Flag for review';
 $('examNav').classList.toggle('hidden',!isExam());if(isExam())renderNav();tick();$('question').focus({preventScroll:true});
}
function renderNav(){const s=state.session;const box=clear('questionNav');s.ids.forEach((id,i)=>{const b=el('button',String(i+1)+(s.flags.includes(i)?' ⚑':''),(s.responses[i]?'done ':'')+(i===s.index?'current':''));b.setAttribute('aria-label','Question '+(i+1)+(s.responses[i]?', answered':', unanswered')+(s.flags.includes(i)?', flagged':''));b.onclick=()=>{s.index=i;save();renderQuestion();};box.append(b);});}
function record(q,r){const ok=r?.choice===q.answer;const n=r?.confidence||0;state.attempts++;const d=state.domains[q.domain]||(state.domains[q.domain]={a:0,c:0});d.a++;
 if(ok){state.correct++;d.c++;state.streak++;state.bestStreak=Math.max(state.bestStreak,state.streak);const gain=10+(state.streak>=5?5:0);state.xp+=gain;state.session.xp+=gain;state.mistakes=state.mistakes.filter(id=>id!==q.id);state.confidentWrong=state.confidentWrong.filter(id=>id!==q.id);}
 else{state.streak=0;if(!state.mistakes.includes(q.id))state.mistakes.push(q.id);if(n===3&&!state.confidentWrong.includes(q.id))state.confidentWrong.push(q.id);}
 if(n)state.confidence[q.id]=n;
}
function submitAnswer(){const s=state.session;if(!s)return;if(s.mode==='timed'&&Date.now()>=s.deadline)return finish(true);if(s.responses[s.index]&&!isExam())return;
 confidence=Number(document.querySelector('[name=confidence]:checked')?.value)||0;
 if(selected===null||!confidence){notice('Select an answer and your confidence before submitting.');return;}
 const r={choice:selected,confidence};s.responses[s.index]=r;if(!isExam())record(BYID.get(s.ids[s.index]),r);save();$('notice').classList.add('hidden');renderQuestion();
}
function feedback(q,r){const ok=r.choice===q.answer;const f=$('feedback');f.textContent=(ok?'Correct.':'Incorrect. Correct answer: '+q.choices[q.answer])+ '\n\n'+q.why+'\n\nIndex cue: '+q.indexCues.join(' · ')+'\nBook-section cue: '+q.bookCue.section+' · '+q.bookCue.topic+' (verify in your edition)';f.className='feedback'+(ok?'':' bad');
 document.querySelectorAll('#choices button').forEach((b,i)=>{const c=state.session.orders[state.session.index][i];b.classList.toggle('correct',c===q.answer);b.classList.toggle('wrong',c===r.choice&&!ok);});$('notePanel').classList.remove('hidden');$('indexNote').value=state.notes[q.id]||'';$('noteStatus').textContent='';
}
function next(){const s=state.session;if(!s)return;if(!isExam()&&!s.responses[s.index])return;if(s.index===s.ids.length-1){if(isExam()){$('examNav').scrollIntoView({behavior:'smooth'});return;}return finish();}s.index++;save();renderQuestion();}
function finish(expired=false){
 const s=state.session;if(!s)return;
 if(isExam()&&!expired){const left=s.responses.filter(r=>!r).length;if(!confirm('Submit exam now? '+left+' unanswered questions will count as incorrect.'))return;}
 if(isExam())s.ids.forEach((id,i)=>record(BYID.get(id),s.responses[i]));
 const correct=s.ids.filter((id,i)=>s.responses[i]?.choice===BYID.get(id).answer).length;
 const pct=Math.round(correct/s.ids.length*100);
 if(s.lab){const old=state.labStats[s.lab]||{best:0};state.labStats[s.lab]={best:Math.max(old.best,pct),last:pct};}
 state.lastResult={...s,correct,pct,expired};state.session=null;save();renderResult(state.lastResult);
}
function reviewCard(q,r,showResponse=true){const card=el('article',undefined,'card review-item');card.append(el('span',q.section+' · '+q.domain,'eyebrow'),el('h3',q.q));if(showResponse)card.append(el('p',r?'Your answer: '+q.choices[r.choice]:'Unanswered',r?.choice===q.answer?'correct-text':'wrong-text'));card.append(el('p','Correct: '+q.choices[q.answer],'correct-text'),el('p',q.why),el('p','Index cue: '+q.indexCues.join(' · '),'muted tiny'),el('p','Book-section cue: '+q.bookCue.section+' · '+q.bookCue.topic+'. Edition/page: add your own.','muted tiny'));
 const label=el('label','Your book page / index note','tiny');const input=el('input');input.value=state.notes[q.id]||'';input.maxLength=500;input.setAttribute('aria-label','Index note for question '+q.id);const b=el('button','Save note');b.onclick=()=>{state.notes[q.id]=input.value;save();b.textContent='Saved';};card.append(label,input,b);return card;}
function renderResult(r){show('result');const box=clear('resultStats');stat(box,'SCORE',r.pct+'%');stat(box,'CORRECT',r.correct+' / '+r.ids.length);stat(box,'XP EARNED',r.xp);stat(box,'UNANSWERED',r.responses.filter(x=>!x).length);$('resultNote').textContent=(r.expired?'Time expired. ':'')+(r.lab?(r.pct>=75?'Lab practice passed. ':'Repeat this mission after review. '):'Review misses and strengthen weak topics. ')+'This is an independent practice score, not a prediction of GIAC results. Current public GSEC specifications list 106 questions and four hours; confirm the rules for your own attempt. Balanced section sampling here is a training choice, not an official exam weighting.';const review=clear('review');r.ids.forEach((id,i)=>review.append(reviewCard(BYID.get(id),r.responses[i])));dashboard();}
function tick(){const s=state?.session;if(s?.mode==='timed'){const remaining=s.deadline-Date.now();if(remaining<=0){finish(true);return;}const secs=Math.ceil(remaining/1000);$('timer').textContent=[Math.floor(secs/3600),Math.floor(secs/60)%60,secs%60].map(n=>String(n).padStart(2,'0')).join(':');}else $('timer').textContent='';}
function missions(){show('labs');const box=clear('missionList');LABS.forEach(l=>{const c=el('article',undefined,'card');c.append(el('span',l.section,'eyebrow'),el('h3',l.title),el('p',l.steps.length+' steps · Best: '+(state.labStats[l.lab]?.best||0)+'%'));const b=el('button','Start mission');b.onclick=()=>start('mission',l);c.append(b);box.append(c);});}
function library(){show('library');const term=$('search').value.trim().toLowerCase(),sec=$('librarySection').value;const hits=ALL.filter(q=>(sec==='all'||q.section===sec)&&[q.q,q.domain,...q.indexCues,...q.choices].join(' ').toLowerCase().includes(term));$('searchCount').textContent=hits.length+' matches · showing '+Math.min(libraryLimit,hits.length)+'. Answers are visible here for reference.';const box=clear('searchResults');hits.slice(0,libraryLimit).forEach(q=>box.append(reviewCard(q,null,false)));$('moreResults').classList.toggle('hidden',hits.length<=libraryLimit);}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=el('a');const url=URL.createObjectURL(blob);a.href=url;a.download='gsec_ops_trainer_v03_progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function importData(event){const file=event.target.files[0];if(!file)return;try{if(file.size>5000000)throw Error('File is too large');const incoming=clean(JSON.parse(await file.text()));if(!confirm('Replace v0.3 progress and the saved session with this backup? Export your current progress first if needed.'))return;state=incoming;storageBlocked=false;save();home();notice('Progress imported.');tick();}catch(e){notice('Import rejected: '+e.message+'. Existing progress was kept.');}finally{event.target.value='';}}
async function offline(){if(!('serviceWorker' in navigator)){$('offlineStatus').textContent='Offline installation unavailable in this browser';return;}try{const reg=await navigator.serviceWorker.register('./service-worker.js');await navigator.serviceWorker.ready;$('offlineStatus').textContent='Ready for offline use';let refreshed=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!refreshed){refreshed=true;notice('An app update is ready. Save your session and reload to use the latest build.');}});reg.update().catch(()=>{});}catch(e){$('offlineStatus').textContent='Offline setup failed; online practice available';}}
async function boot(){try{
 [QUESTIONS,LABS,SECTIONS]=await Promise.all(['questions','labs','sections'].map(async name=>{const r=await fetch('./data/'+name+'.json');if(!r.ok)throw Error('Could not load '+name);return r.json();}));
 ALL=[...QUESTIONS,...LABS.flatMap(l=>l.steps)];BYID=new Map(ALL.map(q=>[q.id,q]));state=load();ready=true;
 $('questionCount').textContent=QUESTIONS.length;$('labCount').textContent=LABS.length+' missions · '+LABS.flatMap(l=>l.steps).length+' lab steps';
 for(const [key,name] of Object.entries(SECTIONS)){for(const target of ['sectionSelect','librarySection']){const o=el('option',key+' · '+name);o.value=key;$(target).append(o);}}
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(b.dataset.mode));document.querySelectorAll('.homeButton').forEach(b=>b.onclick=home);$('homeLink').onclick=e=>{e.preventDefault();home();};
 $('labsButton').onclick=missions;$('browseButton').onclick=library;$('resumeButton').onclick=renderQuestion;$('leaveButton').onclick=()=>{save();home();};$('answerButton').onclick=submitAnswer;$('nextButton').onclick=next;
 $('prevButton').onclick=()=>{if(state.session.index>0){state.session.index--;save();renderQuestion();}};
 $('flagButton').onclick=()=>{const s=state.session;s.flags=s.flags.includes(s.index)?s.flags.filter(i=>i!==s.index):[...s.flags,s.index];save();renderQuestion();};$('finishButton').onclick=()=>finish();
 $('saveNoteButton').onclick=()=>{const q=BYID.get(state.session.ids[state.session.index]);state.notes[q.id]=$('indexNote').value;save();$('noteStatus').textContent='Saved';};
 $('exportButton').onclick=exportData;$('importFile').onchange=importData;$('resetButton').onclick=()=>{if(confirm('Reset v0.3 progress, notes, and the saved session? Older-version backups remain.')){state=blank();storageBlocked=false;save();home();}};
 $('search').oninput=()=>{libraryLimit=30;library();};$('librarySection').onchange=()=>{libraryLimit=30;library();};$('moreResults').onclick=()=>{libraryLimit+=30;library();};
 window.addEventListener('online',()=>offline());document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});home();save();tick();setInterval(tick,1000);offline();
}catch(e){notice('The trainer could not start: '+e.message+'. Serve the complete folder over HTTP or HTTPS and reload.');}}
boot();
