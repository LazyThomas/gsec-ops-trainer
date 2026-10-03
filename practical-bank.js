'use strict';
/* GSEC Ops Trainer: 240 original deterministic synthetic practical exercises.
   12 distinct technical workflows x 20 evidence variations. Never executes commands. */
(()=> {
const bank=[];
const pad=n=>String(n).padStart(2,'0');
const ip=(a,b)=>a+'.'+b+'.'+((b*7)%200+10)+'.'+((b*11)%200+20);
const add=(type,i,title,domain,objective,answer,commands,hint,accept=[])=>{
 const id='practice-'+type+'-'+pad(i);
 bank.push({id,title:title+' · Case '+pad(i),domain,objective,answer:String(answer),
 accept:[String(answer),...accept].map(String),hint,commands:[['help',commands.map(x=>x[0]).join('\n')],...commands]});
};
for(let i=1;i<=20;i++){
 const port=8000+i*3, target='10.20.'+i+'.25';
 add('ports',i,'Investigate exposed TCP listeners','SEC401.1 · Network analysis',
 'Find the unusual open TCP application port on '+target+'.',port,
 [['nmap -sT -Pn -n '+target,'PORT STATE SERVICE\n22/tcp open ssh\n443/tcp open https\n'+port+'/tcp open unknown'],['ss -lnt','LISTEN 0.0.0.0:22\nLISTEN 0.0.0.0:443\nLISTEN 0.0.0.0:'+port]],
 'Use the scan output and exclude SSH and HTTPS.');
 const src=ip(203,i), hits=3+i;
 add('logs',i,'Correlate failed login events','SEC401.3 · Log investigations',
 'Identify the source IPv4 address that generated '+hits+' failed SSH logins.',
 src,[['grep "Failed password" /var/log/auth.log',Array.from({length:hits},(_,j)=>'Oct 03 10:'+pad(j)+' sshd: Failed password for user from '+src+' port '+(46000+j)).join('\n')],['tail /var/log/auth.log','Accepted publickey for ops from 192.0.2.20\nFailed password for user from '+src]],'Compare the source after "from".');
 const name='service'+i+'.conf',mode=(i%2===0?'0666':'0777');
 add('permissions',i,'Audit risky Linux permissions','SEC401.6 · Linux administration',
 'Which filename under /etc/training is world-writable?',name,[['ls -l /etc/training','-rw-r--r-- root root secure.conf\n'+(i%2===0?'-rw-rw-rw-':'-rwxrwxrwx')+' root app '+name+'\n-rw-r----- root ops private.conf'],['stat /etc/training/'+name,'Access: ('+mode+')']], 'Check the final three permission bits.');
 const suspicious='temp.audit'+i;
 add('groups',i,'Audit Windows privileged accounts','SEC401.5 · Windows administration',
 'Find the unexpected local Administrators user (account name only).',suspicious,
 [['Get-LocalGroupMember -Group Administrators','Administrator\nTRAINING\\Domain Admins\nTRAINING\\'+suspicious],['Get-LocalUser','Administrator Enabled=True\nGuest Enabled=False\n'+suspicious+' Enabled=True']], 'Inspect local Administrators membership.', ['training\\'+suspicious]);
 const domain='host'+i+'.training.test', resolved='198.51.'+(100+i)+'.'+(20+i);
 add('dns',i,'Validate DNS responses','SEC401.1 · DNS',
 'What A-record address is returned for '+domain+'?',resolved,[['dig '+domain+' A',';; ANSWER SECTION:\n'+domain+'. 180 IN A '+resolved],['nslookup '+domain,'Name: '+domain+'\nAddress: '+resolved]],'Find the value following IN A.');
 const uid=1000+i,username='operator'+i;
 add('identity',i,'Interpret Linux identities','SEC401.2 · Identity and access',
 'Identify the account with UID '+uid+'.',username,
 [['getent passwd','root:x:0:0:root:/root:/bin/bash\n'+username+':x:'+uid+':'+uid+':training:/home/'+username+':/bin/bash'],['id '+username,'uid='+uid+'('+username+') gid='+uid+'('+username+')']], 'Parse the third colon-delimited passwd field.');
 const request=i%2===0?'POST':'GET', path='/report'+i+'.csv';
 add('http',i,'Inspect web request metadata','SEC401.3 · Protocol investigation',
 'Which HTTP request method accessed '+path+'?',request,
 [['tshark -r web'+i+'.pcap -Y http.request','12 192.0.2.12 > 198.51.100.10 HTTP GET /index.html\n33 192.0.2.12 > 198.51.100.10 HTTP '+request+' '+path],
 ['cat requests'+i+'.log','192.0.2.12 "'+request+' '+path+' HTTP/1.1" 200']], 'Read the token immediately before the requested URL.');
 const ttl=180+i*15;
 add('headers',i,'Review HTTP response headers','SEC401.4 · Browser and TLS controls',
 'Report max-age from Strict-Transport-Security on app'+i+'.training.test.',ttl,
 [['curl -I https://app'+i+'.training.test','HTTP/2 200\nstrict-transport-security: max-age='+ttl+'; includeSubDomains\ncontent-type: text/html'],['cat response-headers.txt','Strict-Transport-Security: max-age='+ttl+'; includeSubDomains']], 'Read the numeric max-age parameter.');
 const blocked=40000+i;
 add('firewall',i,'Review host firewall policies','SEC401.4 · Network defenses',
 'Identify the TCP destination port blocked by firewall rule BLOCK-'+i+'.',blocked,
 [['sudo iptables -S','-P INPUT DROP\n-A INPUT -p tcp --dport 22 -j ACCEPT\n-A INPUT -p tcp --dport '+blocked+' -j DROP'],['sudo nft list ruleset','tcp dport '+blocked+' drop']], 'Inspect the DROP rule, not the allow rule.');
 const action=i%3===0?'deny':'allow',identifier='rule-'+pad(i);
 add('acl',i,'Examine network ACL decisions','SEC401.2 · Access controls',
 'What action is applied by '+identifier+'? Enter allow or deny.',action,
 [['cat acl.txt',identifier+' action='+action+' source=10.4.'+i+'.0/24 dest=172.16.10.10 service=https\nrule-default action=deny source=any'],['grep '+identifier+' acl.txt',identifier+' action='+action]], 'Use the specific rule rather than the default.');
 const start=100+i, end=start+5;
 add('process',i,'Identify a listening Linux process','SEC401.6 · Host investigation',
 'What process name owns TCP port '+(9000+i)+'?', 'collector'+i,
 [['sudo ss -lntp','LISTEN 0 128 0.0.0.0:'+(9000+i)+' 0.0.0.0:* users:(("collector'+i+'",pid='+(1000+i)+',fd=3))'],['ps -p '+(1000+i)+' -o comm=','collector'+i]],'Correlate the process name printed beside the listener.');
 const service=i%2?'disabled':'enabled';
 add('service',i,'Inspect Windows service startup','SEC401.5 · Windows security',
 'What is the StartType for the WinRM service in snapshot '+i+'? Enter enabled or disabled.',service,
 [['Get-Service WinRM','Status: '+(service==='enabled'?'Running':'Stopped')+'\nName: WinRM'],['Get-CimInstance Win32_Service -Filter "Name=\'WinRM\'"','Name=WinRM\nStartMode='+(service==='enabled'?'Auto':'Disabled')]],
 'Use StartMode: Auto means enabled and Disabled means disabled.');
}
const seen=new Set(bank.map(x=>x.id));
if(bank.length!==240||seen.size!==240)throw Error('Practical bank validation failed');
window.GSEC_PRACTICAL_BANK=bank;
})();