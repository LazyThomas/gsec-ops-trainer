'use strict';
/* Original, offline, simulated hands-on security workbench.
 * All commands use a fixed allowlist and prerecorded synthetic outputs.
 * This is not a shell, VM, terminal emulator, or GIAC exam replica. */
(()=> {
const KEY='gsec_cyber_practice_v1';
const tasks=[
 {id:'net-01',domain:'Network discovery',title:'Identify an exposed service',objective:'Determine the TCP port serving HTTP on host 10.40.7.25.',answer:'8080',accept:['8080','tcp/8080'],hint:'Try nmap -sT -Pn -n 10.40.7.25 or ss -lnt.',commands:[
 ['help','Available: nmap -sT -Pn -n 10.40.7.25; ss -lnt; cat /etc/services'],
 ['nmap -sT -Pn -n 10.40.7.25','Nmap scan report for 10.40.7.25\nPORT     STATE SERVICE\n22/tcp   open  ssh\n8080/tcp open  http-proxy\n8443/tcp open  https-alt\nHost is up.'],
 ['ss -lnt','State  Local Address:Port\nLISTEN 0.0.0.0:22\nLISTEN 0.0.0.0:8080\nLISTEN 0.0.0.0:8443'],
 ['cat /etc/services','http 80/tcp\nhttps 443/tcp\nhttp-alt 8080/tcp']]},
 {id:'dns-02',domain:'DNS investigation',title:'Trace a suspicious DNS answer',objective:'Provide the IPv4 address returned for updates.training.test.',answer:'198.51.100.44',accept:['198.51.100.44'],hint:'Ask the resolver with dig or nslookup.',commands:[
 ['help','Available: dig updates.training.test A; nslookup updates.training.test; cat /etc/resolv.conf'],
 ['dig updates.training.test A',';; ANSWER SECTION:\nupdates.training.test. 300 IN A 198.51.100.44\n;; SERVER: 10.40.7.53#53'],
 ['nslookup updates.training.test','Server: 10.40.7.53\nName: updates.training.test\nAddress: 198.51.100.44'],
 ['cat /etc/resolv.conf','nameserver 10.40.7.53\nsearch training.test']]},
 {id:'linux-03',domain:'Linux hardening',title:'Find the world-writable file',objective:'Name the world-writable file in /srv/app (filename only).',answer:'settings.ini',accept:['settings.ini'],hint:'Inspect permission bits; the final three positions are permissions for others.',commands:[
 ['help','Available: ls -la /srv/app; stat /srv/app/settings.ini; stat /srv/app/service.conf'],
 ['ls -la /srv/app','-rw-r--r-- 1 root root  625 service.conf\n-rw-rw-rw- 1 root app  241 settings.ini\n-rwxr-x--- 1 root app  913 run.sh'],
 ['stat /srv/app/settings.ini','File: settings.ini\nAccess: (0666/-rw-rw-rw-) Uid: root Gid: app'],
 ['stat /srv/app/service.conf','File: service.conf\nAccess: (0644/-rw-r--r--) Uid: root Gid: root']]},
 {id:'log-04',domain:'Log analysis',title:'Investigate failed SSH logins',objective:'Identify the source IP responsible for the repeated failed SSH password attempts.',answer:'203.0.113.77',accept:['203.0.113.77'],hint:'Read auth.log or filter the failed password lines.',commands:[
 ['help','Available: cat /var/log/auth.log; grep "Failed password" /var/log/auth.log; grep "Accepted" /var/log/auth.log'],
 ['cat /var/log/auth.log','Oct 03 09:11 sshd: Failed password for admin from 203.0.113.77 port 51801 ssh2\nOct 03 09:12 sshd: Failed password for admin from 203.0.113.77 port 51802 ssh2\nOct 03 09:13 sshd: Failed password for root from 203.0.113.77 port 51803 ssh2\nOct 03 09:15 sshd: Accepted publickey for ops from 192.0.2.31 port 49118 ssh2'],
 ['grep "Failed password" /var/log/auth.log','3 matching entries:\n203.0.113.77 admin\n203.0.113.77 admin\n203.0.113.77 root'],
 ['grep "Accepted" /var/log/auth.log','192.0.2.31 ops publickey']]},
 {id:'win-05',domain:'Windows auditing',title:'Inspect privileged group membership',objective:'Name the unexpected local Administrators member (account name only).',answer:'temp.support',accept:['temp.support','training\\temp.support'],hint:'Inspect the local Administrators group in PowerShell.',commands:[
 ['help','Available: Get-LocalGroupMember -Group Administrators; whoami /groups; Get-LocalUser'],
 ['get-localgroupmember -group administrators','ObjectClass Name\n----------- ----\nUser        TRAINING\\Administrator\nGroup       TRAINING\\Domain Admins\nUser        TRAINING\\temp.support'],
 ['whoami /groups','BUILTIN\\Users\nNT AUTHORITY\\Authenticated Users'],
 ['get-localuser','Administrator Enabled=True\nGuest Enabled=False\ntemp.support Enabled=True']]},
 {id:'hash-06',domain:'Integrity verification',title:'Calculate a file checksum',objective:'Provide the first eight hexadecimal characters of the suspicious file SHA-256.',answer:'9f2c8a41',accept:['9f2c8a41'],hint:'Use Get-FileHash or sha256sum. Report exactly the requested prefix.',commands:[
 ['help','Available: Get-FileHash C:\\Evidence\\sample.bin -Algorithm SHA256; sha256sum sample.bin; dir C:\\Evidence'],
 ['get-filehash c:\\evidence\\sample.bin -algorithm sha256','Algorithm : SHA256\nHash      : 9F2C8A41D7B660EF119A2C4B09E6720D5116A8CFE59D88342591B1A040ECDD37\nPath      : C:\\Evidence\\sample.bin'],
 ['sha256sum sample.bin','9f2c8a41d7b660ef119a2c4b09e6720d5116a8cfe59d88342591b1a040ecdd37  sample.bin'],
 ['dir c:\\evidence','sample.bin  8192 bytes']]},
 {id:'pcap-07',domain:'Packet analysis',title:'Inspect plaintext web traffic',objective:'Identify the HTTP request method used to retrieve /backup.zip.',answer:'GET',accept:['get'],hint:'Filter HTTP requests and examine the request line.',commands:[
 ['help','Available: tshark -r sample.pcap -Y http.request; tshark -r sample.pcap -Y dns; capinfos sample.pcap'],
 ['tshark -r sample.pcap -y http.request','12 192.0.2.12 -> 198.51.100.15 HTTP GET /index.html HTTP/1.1\n36 192.0.2.12 -> 198.51.100.15 HTTP GET /backup.zip HTTP/1.1'],
 ['tshark -r sample.pcap -y dns','2 DNS Standard query A site.training.test\n3 DNS response A 198.51.100.15'],
 ['capinfos sample.pcap','File name: sample.pcap\nNumber of packets: 58\nCapture duration: 8.2 seconds']]},
 {id:'firewall-08',domain:'Host firewall',title:'Review an unintended exposure',objective:'Identify the source CIDR allowed to reach TCP 3389 by the overly broad rule.',answer:'0.0.0.0/0',accept:['0.0.0.0/0'],hint:'Check inbound Windows firewall rules and inspect RemoteAddress.',commands:[
 ['help','Available: Get-NetFirewallRule -Direction Inbound; Get-NetFirewallAddressFilter -AssociatedNetFirewallRule RDP-Legacy; netstat -ano'],
 ['get-netfirewallrule -direction inbound','DisplayName: RDP-Legacy | Enabled: True | Action: Allow | Protocol: TCP | LocalPort: 3389\nDisplayName: SSH-Admin | Enabled: True | Action: Allow | Protocol: TCP | LocalPort: 22'],
 ['get-netfirewalladdressfilter -associatednetfirewallrule rdp-legacy','RemoteAddress : 0.0.0.0/0'],
 ['netstat -ano','TCP 0.0.0.0:3389 0.0.0.0:0 LISTENING 1016']]}
];
tasks.push(...(window.GSEC_PRACTICAL_BANK||[]));
let current=null,attempts=0,usedHint=false,usedReveal=false,history=[];
const $=id=>document.getElementById(id);
const style=document.createElement('style');
style.textContent='.cl-entry{margin-bottom:18px;border-color:#597e9d}.cl-workbench{margin-top:20px}.cl-terminal{height:260px;overflow:auto;background:#070e15;border:1px solid #587087;border-radius:10px;padding:15px;color:#e4f6e9;font:15px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;overflow-wrap:anywhere}.cl-workbench input{width:100%;font:16px ui-monospace,monospace}.cl-workbench label{display:block;margin:16px 0 7px}.cl-actions{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}.cl-progress{margin-bottom:16px}.cl-feedback{white-space:pre-wrap;line-height:1.5;margin:10px 0;color:#ecf2f8}.cl-task button{min-width:120px}.cl-workbench h2{margin:12px 0}';
document.head.append(style);
function store(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}}
function persist(id,passed){const x=store();const old=x[id]||{tries:0,passed:false};x[id]={tries:old.tries+1,passed:old.passed||passed};try{localStorage.setItem(KEY,JSON.stringify(x))}catch{}}
function element(tag,txt,cls){const x=document.createElement(tag);if(txt!==undefined)x.textContent=txt;if(cls)x.className=cls;return x}
function output(msg){const t=$('clTerminal');t.textContent+=msg+'\n';t.scrollTop=t.scrollHeight}
function normalize(s){return s.trim().replace(/\s+/g,' ').toLowerCase()}
function exec(){if(!current)return;const input=$('clCommand');const cmd=normalize(input.value);input.value='';if(!cmd)return;if(cmd.length>220){output('Input too long.');return}
 history.push(cmd);history=history.slice(-30);output('student@training:~$ '+cmd);
 if(cmd==='clear'){ $('clTerminal').textContent='';return}
 const found=current.commands.find(x=>normalize(x[0])===cmd);
 output(found?found[1]:'Command not available in this simulation. Enter help for supported commands.');input.focus()}
function start(id){current=tasks.find(x=>x.id===id);if(!current)return;attempts=0;usedHint=false;usedReveal=false;history=[];$('clWorkbench').classList.remove('hidden');
 $('clTitle').textContent=current.title;$('clDomain').textContent=current.domain;$('clObjective').textContent=current.objective;
 $('clTerminal').textContent='Offline synthetic exercise · Not a real shell or virtual machine.\nType help for available commands.\n';
 $('clCommand').value='';$('clAnswer').value='';$('clFeedback').textContent='';$('clHint').textContent='';$('clNext').classList.add('hidden');$('clAdvance').classList.remove('hidden');$('clReveal').disabled=false;$('clReveal').textContent='Show answer';$('clSolution').textContent='';$('clAnswer').disabled=false;$('clCheck').disabled=false;
 $('clWorkbench').scrollIntoView({behavior:'smooth',block:'start'});$('clCommand').focus()}
function submit(){if(!current)return;const given=normalize($('clAnswer').value);if(!given){$('clFeedback').textContent='Enter a finding first.';return}
 attempts++;$('clAdvance').classList.remove('hidden');const ok=current.accept.some(x=>normalize(x)===given);persist(current.id,ok&&!usedReveal);
 if(ok){$('clFeedback').textContent=(usedReveal?'REVIEW COMPLETE — answer was revealed; no pass credit. ':'PASS — verified finding. ')+(usedHint?'Hint used. ':'')+'Attempts: '+attempts+'.';$('clCheck').disabled=true;$('clAnswer').disabled=true;$('clNext').classList.remove('hidden')}
 else $('clFeedback').textContent='Not verified. Review the output and try again. Attempts: '+attempts+'.';
 renderTasks()}
function revealAnswer(){if(!current)return;usedReveal=true;const evidence=current.commands.find(c=>normalize(c[0])!=='help')||current.commands[0];const lines=String(evidence[1]).split('\n');const matching=lines.find(line=>line.toLowerCase().includes(String(current.answer).toLowerCase()))||lines[0];$('clSolution').textContent='CORRECT ANSWER: '+current.answer+'\n\nSTEP 1 — Understand the objective\n'+current.objective+'\n\nSTEP 2 — Run an investigation command\n'+evidence[0]+'\nThis command retrieves the relevant synthetic '+current.domain.toLowerCase()+' evidence. Commands execute only inside the simulator.\n\nSTEP 3 — Read the evidence\n'+matching+'\nLocate the value requested by the objective; distinguish it from unrelated output.\n\nSTEP 4 — Verify the finding\nSubmit '+current.answer+'. Answer-revealed attempts do not earn pass credit. Repeat independently to qualify.';$('clReveal').textContent='Answer shown';$('clReveal').disabled=true;}
function renderTasks(){const wrap=$('clTasks');wrap.replaceChildren();const p=store(),passed=tasks.filter(t=>p[t.id]?.passed).length;
 $('clProgress').textContent=passed+' / '+tasks.length+' practical challenges passed on this device';
 tasks.forEach(t=>{const card=element('article',undefined,'card cl-task');card.append(element('span',t.domain,'eyebrow'),element('h3',t.title),element('p',t.objective));
 const btn=element('button',p[t.id]?.passed?'Repeat passed challenge':'Launch challenge','primary');btn.onclick=()=>start(t.id);card.append(btn);wrap.append(card)})}
function init(){const labs=$('labs');if(!labs||$('clEntry'))return;
 const entry=element('div',undefined,'card cl-entry');entry.id='clEntry';
 entry.append(element('div','PRACTICAL / HANDS-ON','eyebrow'),element('h2','CyberLive-style practice'),element('p','Perform investigations in a simulated command workbench. Original challenges, synthetic evidence, and exact-answer validation. No real commands execute and this is not an official GIAC lab.'));
 const p=element('p',undefined,'tiny muted');p.id='clProgress';entry.append(p);
 const grid=element('div',undefined,'modes');grid.id='clTasks';entry.append(grid);
 const wb=element('div',undefined,'card cl-workbench hidden');wb.id='clWorkbench';
 const domain=element('span',undefined,'eyebrow');domain.id='clDomain';const title=element('h2');title.id='clTitle';const obj=element('p');obj.id='clObjective';wb.append(domain,title,obj);
 const terminal=element('div',undefined,'cl-terminal');terminal.id='clTerminal';terminal.setAttribute('role','log');terminal.setAttribute('aria-live','polite');wb.append(terminal);
 const lbl=element('label','Simulated command (try help)');lbl.htmlFor='clCommand';const cmd=element('input');cmd.id='clCommand';cmd.autocomplete='off';cmd.spellcheck=false;wb.append(lbl,cmd);
 const run=element('button','Run command');run.className='primary';run.onclick=exec;const hint=element('button','Show hint');const reveal=element('button','Show answer');reveal.id='clReveal';reveal.disabled=true;reveal.onclick=revealAnswer;const advance=element('button','Next lab');advance.id='clAdvance';advance.classList.add('hidden');advance.onclick=()=>{const index=tasks.findIndex(t=>t.id===current?.id);start(tasks[(index+1)%tasks.length].id)};const next=element('button','Return to challenges');next.id='clNext';next.classList.add('hidden');next.onclick=()=>{wb.classList.add('hidden');entry.scrollIntoView({behavior:'smooth'})};
 const hintText=element('p');hintText.id='clHint';hint.onclick=()=>{usedHint=true;hintText.textContent=current?.hint||''};
 const actions=element('div',undefined,'cl-actions');actions.append(run,hint,reveal,advance,next);wb.append(actions,hintText);const solution=element('p');solution.id='clSolution';solution.setAttribute('role','status');wb.append(solution);
 const answerLabel=element('label','Verified finding (type the requested answer)');answerLabel.htmlFor='clAnswer';const answer=element('input');answer.id='clAnswer';answer.autocomplete='off';answer.spellcheck=false;const check=element('button','Check finding','primary');check.id='clCheck';check.onclick=submit;const fb=element('p');fb.id='clFeedback';fb.setAttribute('role','status');
 wb.append(answerLabel,answer,check,fb);cmd.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();exec()}});answer.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();submit()}});
 labs.insertBefore(entry,$('missionList'));labs.insertBefore(wb,$('missionList'));renderTasks();
 const desc=labs.querySelector('.section-heading + p');if(desc)desc.textContent='Practical simulated investigations first. Original guided multiple-choice missions remain below for review.';
 const guided=element('h2','Legacy guided missions');guided.style.marginTop='30px';labs.insertBefore(guided,$('missionList'));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();