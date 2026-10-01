const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P={logo:'M5 13l4 4L19 7',home:'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',check:'M20 6 9 17l-5-5',cal:'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',timer:'M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',chart:'M4 20V10M10 20V4M16 20v-8M22 20H2',gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2',plus:'M12 5v14M5 12h14',search:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5',flame:'M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',book:'M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4zM8 20'};
const ic=(n,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
$$('.logo i').forEach(i=>i.innerHTML=ic('logo',16));
$('#feat').innerHTML=[['list','One place for everything','Assignments, exams and notes live together, not across five apps.'],['flame','Know what matters now','The priorities for today sit at the top. Everything else waits.'],['cal','Plan study sessions','Drag sessions across the week and protect your time.'],['chart','See your progress','Streaks and weekly trends keep you consistent.']].map(f=>`<div class="card"><div class="ico">${ic(f[0])}</div><h3>${f[1]}</h3><p class="sm mut">${f[2]}</p></div>`).join('');

const D=o=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+o);return d};
const iso=d=>d.toISOString().slice(0,10),off=s=>Math.round((new Date(s+'T00:00:00')-D(0))/864e5);
const SUB={AI:['Artificial Intelligence','#3446d6'],ML:['Machine Learning','#0f9d8a'],CV:['Computer Vision','#c2822b'],MA:['Mathematics','#8a5fbf']};
const lab=o=>o==0?'Today':o==1?'Tomorrow':o==-1?'Yesterday':o<0?`${-o} days overdue`:D(o).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
let id=20;
let T=[[1,'Complete CNN assignment','CV',0,'High',0],[2,'Review Machine Learning notes','ML',0,'Medium',0],[3,'Prepare AI presentation','AI',1,'High',0],[4,'Solve linear algebra problem set','MA',2,'Medium',0],[5,'Read transformer survey paper','AI',4,'Low',0],[6,'Submit ML lab record','ML',-1,'High',0],[7,'Revise probability formulas','MA',-2,'Medium',0],[8,'Implement image augmentation','CV',-3,'Medium',1],[9,'Watch backpropagation lecture','ML',-1,'Low',1]].map(a=>({id:a[0],n:a[1],s:a[2],d:iso(D(a[3])),p:a[4],done:!!a[5]}));
const mon=(D(0).getDay()+6)%7;
let S=[[1,mon,'09:00','10:30','ML','Backprop deep dive'],[2,mon,'16:00','17:00','MA','Linear algebra drills'],[3,mon+1,'10:00','12:00','CV','CNN architectures'],[4,mon+1,'18:00','19:00','AI','Slide outline'],[5,mon+3,'14:00','15:30','CV','CNN assignment'],[6,mon+3,'19:00','20:00','ML','Notes review'],[7,mon+4,'11:00','12:30','AI','Presentation rehearsal'],[8,mon+5,'10:00','12:00','MA','Probability revision']].map(a=>({id:a[0],day:a[1]-mon+ (0),dx:a[1],s:a[2],e:a[3],sub:a[4],t:a[5]}));
S.forEach(s=>s.day=s.dx);

/* toast / dialog */
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('#toasts').append(t);setTimeout(()=>t.remove(),2800)}
const dlg=$('#dlg');
function modal(html,ok){dlg.innerHTML=html;dlg.showModal();dlg.onclose=null;const f=$('form',dlg);f.onsubmit=e=>{e.preventDefault();if(ok(f)!==false)dlg.close()};$('[data-x]',dlg).onclick=()=>dlg.close();const i=$('input,select',dlg);i&&i.focus()}
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
const subOpts=()=>Object.entries(SUB).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join('');
function confirmD(title,msg,label,fn){modal(`<form method="dialog"><h2 style="font-size:20px">${title}</h2><p class="mut" style="margin-top:8px">${msg}</p><div class="dlgf"><button type="button" class="btn" data-x>Cancel</button><button class="btn pri">${label}</button></div></form>`,()=>{fn()})}

/* router */
const NAV=[['dashboard','Dashboard','home'],['tasks','Tasks','check'],['planner','Planner','cal'],['focus','Focus','timer'],['analytics','Progress','chart'],['settings','Settings','gear']];
const nh=NAV.map(n=>`<button class="nl" data-go="${n[0]}" data-nav="${n[0]}">${ic(n[2],20)}${n[1]}</button>`).join('');$('#nav').innerHTML=nh;$('#bnav').innerHTML=nh;
const APP=NAV.map(n=>n[0]);
function go(v){if(!$('#v-'+v))v='landing';location.hash='/'+v}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g){e.preventDefault();go(g.dataset.go)}});
function route(){let v=location.hash.slice(2)||'landing';if(!$('#v-'+v))v='landing';
 if(v!=='focus')document.body.classList.remove('zen');
 $$('.view').forEach(x=>x.classList.remove('on'));$('#v-'+v).classList.add('on');
 $('#shell').classList.toggle('on',APP.includes(v));
 $$('[data-nav]').forEach(b=>{b.classList.toggle('on',b.dataset.nav===v);b.setAttribute('aria-current',b.dataset.nav===v?'page':'false')});
 scrollTo(0,0);document.title='FocusFlow – '+v[0].toUpperCase()+v.slice(1);
 if(APP.includes(v))R[v]();}
addEventListener('hashchange',route);

/* helpers */
const todayT=()=>T.filter(t=>t.d===iso(D(0)));
const pct=()=>{const a=todayT();return a.length?Math.round(a.filter(t=>t.done).length/a.length*100):0};
function taskRow(t){const o=off(t.d),late=o<0&&!t.done;return `<div class="task ${t.done?'done':''}" data-id="${t.id}"><button class="cb" role="checkbox" aria-checked="${t.done}" aria-label="Mark ${t.n} as ${t.done?'not done':'done'}">${ic('check',14)}</button><div class="tx"><div class="nm">${t.n}</div><div class="sm mut"><span class="dot" style="background:${SUB[t.s][1]}"></span>${SUB[t.s][0]} · <span class="${late?'late':''}">${lab(o)}</span></div></div><span class="chip ${t.p=='Medium'?'':t.p}">${t.p}</span></div>`}
document.addEventListener('click',e=>{const c=e.target.closest('.cb');if(!c)return;const t=T.find(x=>x.id==c.closest('.task').dataset.id);t.done=!t.done;if(t.done)toast('Task completed. Nice work!');const v=location.hash.slice(2);setTimeout(()=>R[v](),t.done?350:0);c.setAttribute('aria-checked',t.done);c.closest('.task').classList.toggle('done',t.done)});
const addTask=()=>modal(`<form method="dialog" novalidate><h2 style="font-size:20px">Add task</h2><label for="tn">Task name</label><input id="tn" type="text" placeholder="e.g. Finish lab report"><div class="errm" id="te"></div><label for="ts">Subject</label><select id="ts">${subOpts()}</select><label for="td">Due date</label><input id="td" type="date" value="${iso(D(1))}"><label for="tp">Priority</label><select id="tp"><option>High</option><option selected>Medium</option><option>Low</option></select><div class="dlgf"><button type="button" class="btn" data-x>Cancel</button><button class="btn pri">Add task</button></div></form>`,f=>{const n=$('#tn').value.trim();if(!n){$('#tn').classList.add('err');$('#te').textContent='Give your task a name to add it.';return false}T.unshift({id:++id,n,s:$('#ts').value,d:$('#td').value,p:$('#tp').value,done:false});toast('Task added');R[location.hash.slice(2)]()});
const addSes=()=>modal(`<form method="dialog"><h2 style="font-size:20px">Add study session</h2><label for="sn">Session title</label><input id="sn" type="text" value="Focused study"><label for="ss">Subject</label><select id="ss">${subOpts()}</select><label for="sd">Day</label><select id="sd">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i)=>`<option value="${i}" ${i==mon?'selected':''}>${d}</option>`).join('')}</select><div style="display:flex;gap:10px"><div style="flex:1"><label for="st">Start</label><input id="st" type="time" value="17:00"></div><div style="flex:1"><label for="se">End</label><input id="se" type="time" value="18:00"></div></div><div class="dlgf"><button type="button" class="btn" data-x>Cancel</button><button class="btn pri">Add session</button></div></form>`,()=>{S.push({id:++id,day:+$('#sd').value,s:$('#st').value,e:$('#se').value,sub:$('#ss').value,t:$('#sn').value||'Study session'});toast('Session added');R.planner()});

/* views */
const R={};let loaded=false;
R.dashboard=()=>{const h=new Date().getHours(),g=h<12?'morning':h<17?'afternoon':'evening';const el=$('#v-dashboard');
 const draw=()=>{const tt=todayT(),up=T.filter(t=>!t.done&&off(t.d)>0).sort((a,b)=>a.d>b.d?1:-1).slice(0,3),sc=pct();
 el.innerHTML=`<div class="top"><div><p class="mut">${D(0).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p><h1>Good ${g}, Nivetha 👋</h1><p class="mut">Let's make today count.</p></div><div class="acts"><button class="btn" id="qa">${ic('plus')}Add task</button><button class="btn pri" data-go="focus">${ic('timer')}Start focus session</button></div></div>
 <div class="grid g3" style="margin-bottom:18px"><div class="card"><p class="mut sm">Today's progress</p><div class="big" style="margin:10px 0 14px">${sc}%</div><div class="bar"><b style="width:0" data-w="${sc}"></b></div></div>
 <div class="card"><p class="mut sm">Productivity streak</p><div class="big" style="margin:10px 0 6px;display:flex;align-items:center;gap:8px"><span style="color:var(--acc)">${ic('flame',34)}</span>12</div><p class="sm mut">days. Study 30 more minutes to keep it going.</p></div>
 <div class="card"><p class="mut sm">Focus time today</p><div class="big" style="margin:10px 0 6px">2h 50m</div><p class="sm mut">of your 4h target</p></div></div>
 <div class="grid g2"><div class="grid" style="align-content:start"><div class="card"><h2>Due today <span class="chip">${tt.filter(t=>t.done).length}/${tt.length} done</span></h2>${tt.map(taskRow).join('')||'<div class="empty">Nothing due today. Enjoy the breathing room.</div>'}</div>
 <div class="card"><h2>Upcoming deadlines <a href="#/tasks" class="sm" style="color:var(--acc)">View all</a></h2>${up.map(taskRow).join('')}</div></div>
 <div class="grid" style="align-content:start"><div class="card"><h2>Study sessions today</h2>${S.filter(s=>s.day===mon).sort((a,b)=>a.s>b.s?1:-1).map(s=>`<div class="task"><div class="tx"><div class="nm">${s.t}</div><div class="sm mut"><span class="dot" style="background:${SUB[s.sub][1]}"></span>${SUB[s.sub][0]}</div></div><b class="sm">${s.s}–${s.e}</b></div>`).join('')}</div>
 <div class="card"><h2>Subject progress</h2>${subjProg()}</div></div></div>`;
 $('#qa').onclick=addTask;requestAnimationFrame(()=>setTimeout(()=>$$('[data-w]',el).forEach(b=>b.style.width=b.dataset.w+'%'),60))};
 if(!loaded){el.innerHTML=`<div class="sk" style="width:50%;height:60px"></div><div class="grid g3"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div><div class="sk" style="height:260px"></div>`;setTimeout(()=>{loaded=true;if(location.hash==='#/dashboard')draw()},700)}else draw()};
const subjProg=()=>Object.entries(SUB).map(([k,v])=>{const a=T.filter(t=>t.s===k),p=a.length?Math.round(a.filter(t=>t.done).length/a.length*100):0;const q={AI:62,ML:78,CV:45,MA:55}[k],m=Math.max(p,q);return `<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between" class="sm"><b><span class="dot" style="background:${v[1]}"></span>${v[0]}</b><span class="mut">${m}%</span></div><div class="bar" style="margin-top:6px"><b style="width:${m}%;background:${v[1]}"></b></div></div>`}).join('');

let F={tab:'all',q:'',p:'',s:''};
R.tasks=()=>{const el=$('#v-tasks'),td=iso(D(0));
 const flt=T.filter(t=>{const o=off(t.d);return(F.tab=='all'||(F.tab=='today'&&o==0)||(F.tab=='upcoming'&&o>0&&!t.done)||(F.tab=='completed'&&t.done)||(F.tab=='overdue'&&o<0&&!t.done))&&t.n.toLowerCase().includes(F.q.toLowerCase())&&(!F.p||t.p==F.p)&&(!F.s||t.s==F.s)}).sort((a,b)=>a.done-b.done||(a.d>b.d?1:-1));
 const cnt=k=>T.filter(t=>{const o=off(t.d);return k=='all'||(k=='today'&&o==0)||(k=='upcoming'&&o>0&&!t.done)||(k=='completed'&&t.done)||(k=='overdue'&&o<0&&!t.done)}).length;
 el.innerHTML=`<div class="top"><div><h1>Tasks</h1><p class="mut">${cnt('overdue')?`${cnt('overdue')} overdue. Start with those.`:'Everything is on track.'}</p></div><button class="btn pri" id="at">${ic('plus')}Add task</button></div>
 <div class="pills" role="tablist">${['all','today','upcoming','completed','overdue'].map(k=>`<button role="tab" data-tab="${k}" class="${F.tab==k?'on':''}">${k[0].toUpperCase()+k.slice(1)} ${cnt(k)}</button>`).join('')}</div>
 <div class="tb"><div class="s">${ic('search')}<input type="text" id="fq" placeholder="Search tasks" aria-label="Search tasks" value="${F.q}"></div><select id="fpri" aria-label="Filter by priority"><option value="">All priorities</option>${['High','Medium','Low'].map(p=>`<option ${F.p==p?'selected':''}>${p}</option>`).join('')}</select><select id="fsubj" aria-label="Filter by subject"><option value="">All subjects</option>${Object.entries(SUB).map(([k,v])=>`<option value="${k}" ${F.s==k?'selected':''}>${v[0]}</option>`).join('')}</select></div>
 <div class="card">${flt.map(taskRow).join('')||`<div class="empty">${ic('search',30)}<b>No tasks found</b>Try a different filter, or add a new task.</div>`}</div>`;
 $('#at').onclick=addTask;$$('[data-tab]',el).forEach(b=>b.onclick=()=>{F.tab=b.dataset.tab;R.tasks()});
 $('#fq').oninput=e=>{F.q=e.target.value;const p=e.target.selectionStart;R.tasks();const i=$('#fq');i.focus();i.setSelectionRange(p,p)};$('#fpri').onchange=e=>{F.p=e.target.value;R.tasks()};$('#fsubj').onchange=e=>{F.s=e.target.value;R.tasks()}};

let view='week';
R.planner=()=>{const el=$('#v-planner'),days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],start=D(-mon),show=view=='week'?[0,1,2,3,4,5,6]:[mon];
 el.innerHTML=`<div class="top"><div><h1>Study planner</h1><p class="mut">Drag a session to another day to reschedule it.</p></div><div class="acts"><div class="pills" style="margin:0"><button data-v="day" class="${view=='day'?'on':''}">Day</button><button data-v="week" class="${view=='week'?'on':''}">Week</button></div><button class="btn pri" id="as">${ic('plus')}Add session</button></div></div>
 <div class="week" style="${view=='day'?'grid-template-columns:1fr':''}">${show.map(i=>{const d=new Date(start);d.setDate(d.getDate()+i);const ss=S.filter(s=>s.day===i).sort((a,b)=>a.s>b.s?1:-1);return `<div class="col ${i==mon?'today':''}" data-d="${i}"><h3><span>${days[i]} ${d.getDate()}</span><span class="mut">${ss.length||''}</span></h3>${ss.map(s=>`<div class="ses" draggable="true" data-id="${s.id}" style="--c:${SUB[s.sub][1]}" tabindex="0"><b>${s.t}</b><span class="mut">${s.s}–${s.e}</span><br><span class="mut">${SUB[s.sub][0]}</span></div>`).join('')||'<p class="sm mut">Free day. Drop a session here.</p>'}</div>`}).join('')}</div>`;
 $('#as').onclick=addSes;$$('[data-v]',el).forEach(b=>b.onclick=()=>{view=b.dataset.v;R.planner()});
 let drag;$$('.ses',el).forEach(s=>{s.ondragstart=e=>{drag=+s.dataset.id;s.classList.add('drag');e.dataTransfer.effectAllowed='move'};s.ondragend=()=>s.classList.remove('drag')});
 $$('.col',el).forEach(c=>{c.ondragover=e=>{e.preventDefault();c.classList.add('over')};c.ondragleave=()=>c.classList.remove('over');c.ondrop=e=>{e.preventDefault();const s=S.find(x=>x.id===drag);if(s){s.day=+c.dataset.d;toast('Session moved to '+days[s.day]);R.planner()}}})};

const FT={focus:1500,brk:300};let fs={m:'focus',r:1500,run:false,n:2,iv:null};
const fm=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
R.focus=()=>{document.body.classList.add('zen');const el=$('#v-focus'),C=2*Math.PI*150;
 const up=()=>{$('#ft').textContent=fm(fs.r);$('#ff').style.strokeDashoffset=C*(1-(FT[fs.m]-fs.r)/FT[fs.m]);$('#fb').innerHTML=fs.run?'Pause':(fs.r<FT[fs.m]?'Resume':'Start');document.title=fs.run?fm(fs.r)+' · FocusFlow':'FocusFlow – Focus'};
 el.innerHTML=`<div class="fwrap"><div style="text-align:left"><button class="btn" data-go="dashboard">Exit focus</button></div><div class="chip" style="margin-top:24px" id="fmode"></div><h1 style="font-size:28px;margin-top:12px;letter-spacing:-.03em" id="fh"></h1>
 <p class="mut" id="fsub"></p><div class="ring"><svg viewBox="0 0 340 340"><circle class="bg" cx="170" cy="170" r="150"/><circle class="fg" id="ff" cx="170" cy="170" r="150" stroke-dasharray="${C}" stroke-dashoffset="0"/></svg><div class="t" id="ft" aria-live="off"></div></div>
 <div class="acts" style="justify-content:center"><button class="btn pri lg" id="fb" style="min-width:130px;justify-content:center"></button><button class="btn lg" id="fr">Reset</button></div>
 <div class="dots" aria-label="Session progress">${[0,1,2,3].map(i=>`<i class="${i<fs.n?'on':''}"></i>`).join('')}</div><p class="sm mut" id="fmsg"></p><p class="sm mut" style="margin-top:18px">Press Space to start or pause.</p></div>`;
 const lab=()=>{$('#fmode').textContent=fs.m=='focus'?'Session '+(fs.n+1)+' of 4':'Short break';$('#fh').textContent=fs.m=='focus'?'Deep work mode':'Take a breather';$('#fsub').innerHTML=fs.m=='focus'?'Computer Vision · <b>Complete CNN assignment</b>':'Stretch, drink some water, look away from the screen.';$('#fmsg').textContent=fs.m=='focus'?'One thing at a time. You are doing great.':'Your next focus session starts when you are ready.'};
 const tick=()=>{fs.r--;if(fs.r<=0){clearInterval(fs.iv);fs.run=false;if(fs.m=='focus'){fs.n=Math.min(4,fs.n+1);fs.m='brk';toast('Focus session complete. Take a short break.')}else{fs.m='focus';toast('Break over. Ready for the next round?')}fs.r=FT[fs.m];if(location.hash=='#/focus')R.focus();return}up()};
 const tg=()=>{fs.run=!fs.run;clearInterval(fs.iv);if(fs.run)fs.iv=setInterval(tick,1000);up()};
 $('#fb').onclick=tg;$('#fr').onclick=()=>{clearInterval(fs.iv);fs.run=false;fs.r=FT[fs.m];up();toast('Timer reset')};lab();up();
 if(!window._sp){window._sp=1;addEventListener('keydown',e=>{if(e.code==='Space'&&location.hash==='#/focus'&&!e.target.closest('input,select,button,dialog')){e.preventDefault();$('#fb').click()}})}};

R.analytics=()=>{const el=$('#v-analytics'),h=[2.5,3,1.5,4,3.5,2,1],dn=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],mx=4.5,done=T.filter(t=>t.done).length,rate=Math.round(done/T.length*100);
 el.innerHTML=`<div class="top"><div><h1>Progress</h1><p class="mut">This week you studied 17.5 hours, 2 more than last week.</p></div></div>
 <div class="grid g3" style="margin-bottom:18px"><div class="card"><p class="mut sm">Tasks completed</p><div class="big" style="margin-top:10px">${done+14}</div></div><div class="card"><p class="mut sm">Completion rate</p><div class="big" style="margin:10px 0 14px">${Math.max(rate,82)}%</div><div class="bar"><b style="width:${Math.max(rate,82)}%"></b></div></div><div class="card"><p class="mut sm">Productivity streak</p><div class="big" style="margin-top:10px">12 days</div></div></div>
 <div class="grid g2"><div class="card"><h2>Weekly study hours</h2><div class="bars">${h.map((v,i)=>`<div><b>${v}</b><span data-h="${v/mx*100}"></span>${dn[i]}</div>`).join('')}</div></div>
 <div class="card"><h2>Subject-wise progress</h2>${subjProg()}</div></div>
 <div class="card" style="margin-top:18px"><h2>Study consistency <span class="sm mut">Last 14 days</span></h2><div class="heat">${[3,2,3,0,3,2,1,3,3,2,3,3,2,3].map((v,i)=>`<i title="${v?v+'h studied':'No study'}" style="opacity:${v?.18+v*.27:.08}"></i>`).join('')}</div><p class="sm mut" style="margin-top:12px">You studied on 13 of the last 14 days. Darker means more time.</p></div>`;
 setTimeout(()=>$$('[data-h]',el).forEach(b=>b.style.height=b.dataset.h+'%'),80)};

R.settings=()=>{const el=$('#v-settings'),th=document.documentElement.dataset.theme;
 el.innerHTML=`<div class="top"><div><h1>Settings</h1><p class="mut">Make FocusFlow fit how you study.</p></div></div>
 <div class="grid g21" style="align-items:start"><div class="card"><h2>Profile</h2><label for="pn">Full name</label><input id="pn" type="text" value="M. Nivetha"><label for="pe2">Email</label><input id="pe2" type="email" value="nivetha@college.edu"><label for="pc">Course</label><input id="pc" type="text" value="B.Tech, AI and Machine Learning"><div class="dlgf" style="justify-content:flex-start"><button class="btn pri" id="sv">Save changes</button></div></div>
 <div class="grid"><div class="card"><h2>Study goals</h2><label for="gt" style="margin-top:0">Daily study target: <b id="gv">4</b> hours</label><input id="gt" type="range" min="1" max="10" value="4" step="0.5"><label for="th">Theme</label><select id="th"><option value="light" ${th=='light'?'selected':''}>Light</option><option value="dark" ${th=='dark'?'selected':''}>Dark</option></select></div>
 <div class="card"><h2>Notifications</h2>${[['Deadline reminders',1],['Daily study reminder',1],['Weekly progress summary',0]].map(n=>`<div class="tg"><span id="n${n[0].length}">${n[0]}</span><button class="sw" role="switch" aria-checked="${!!n[1]}" aria-labelledby="n${n[0].length}"></button></div>`).join('')}</div>
 <div class="card"><h2>Account</h2><button class="btn bad" id="lo">Log out</button></div></div></div>`;
 $$('.sw',el).forEach(s=>s.onclick=()=>s.setAttribute('aria-checked',s.getAttribute('aria-checked')!='true'));
 $('#gt').oninput=e=>$('#gv').textContent=e.target.value;$('#th').onchange=e=>document.documentElement.dataset.theme=e.target.value;
 $('#sv').onclick=()=>toast('Changes saved');$('#lo').onclick=()=>confirmD('Log out of FocusFlow?','Your tasks and sessions are saved. You can log back in anytime.','Log out',()=>{go('login');toast('Logged out')})};

/* auth */
let mode='in';$$('.tabs button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;$$('.tabs button').forEach(x=>x.classList.toggle('on',x==b));$('#nmf').hidden=mode=='in'});
$('#af').onsubmit=e=>{e.preventDefault();const em=$('#ae'),pw=$('#ap');let bad=0;
 [[em,'#ee',/^\S+@\S+\.\S+$/.test(em.value),'Enter a valid email, like you@college.edu.'],[pw,'#pe',pw.value.length>=8,'Use at least 8 characters.']].forEach(([i,m,ok,t])=>{i.classList.toggle('err',!ok);$(m).textContent=ok?'':t;if(!ok)bad=1});
 if(bad)return;const b=$('#ab');b.innerHTML='<span class="sp"></span>Signing in';b.disabled=true;setTimeout(()=>{b.textContent='Continue';b.disabled=false;go('dashboard');toast('Welcome back, Nivetha')},800)};
$('#gg').onclick=()=>{go('dashboard');toast('Signed in with Google')};
$('#fp').onclick=e=>{e.preventDefault();modal(`<form method="dialog"><h2 style="font-size:20px">Reset password</h2><p class="mut" style="margin:8px 0">We'll email you a link to set a new password.</p><label for="re">Email</label><input id="re" type="email"><div class="dlgf"><button type="button" class="btn" data-x>Cancel</button><button class="btn pri">Send reset link</button></div></form>`,()=>toast('Reset link sent. Check your inbox.'))};
route();
