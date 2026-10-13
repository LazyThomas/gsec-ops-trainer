const GSEC_COMMAND_LESSONS = {
  "1.1": {
    "command": "tcpdump -nn -r capture.pcap 'host 10.0.0.4'",
    "meaning": "-nn disables address and service resolution; -r reads a saved capture; host selects packets involving the address.",
    "expected": "Displays matching packets.",
    "mistake": "A capture filter and a display filter are not interchangeable.",
    "section": "SEC401.1",
    "lab": "1.1",
    "sampleOutput": "12:00:01 IP 10.0.0.4.53000 > 198.51.100.2.443: Flags [S]",
    "outputMeaning": "One captured SYN packet matches the host filter; this alone does not establish a successful connection."
  },
  "1.2": {
    "command": "tshark -r capture.pcap -Y 'tcp.port == 443'",
    "meaning": "-r reads a capture; -Y applies a Wireshark display filter.",
    "expected": "Displays saved TCP packets involving port 443.",
    "mistake": "HTTP/3 can use UDP.",
    "section": "SEC401.1",
    "lab": "1.2",
    "sampleOutput": "1 0.000000 10.0.0.4 → 198.51.100.2 TCP 74 53000 → 443 [SYN]",
    "outputMeaning": "The saved capture contains a TCP SYN destined for port 443."
  },
  "1.3": {
    "command": "zcat flows.log.gz | head -4",
    "meaning": "zcat streams decompressed text to stdout; | pipes it; head -4 shows four lines.",
    "expected": "Displays four log lines.",
    "mistake": "No extracted file is created.",
    "section": "SEC401.1",
    "lab": "1.3",
    "sampleOutput": "2 123456789012 eni-123 10.0.0.4 198.51.100.2 53000 443 6 10 840 1697000000 1697000060 ACCEPT OK",
    "outputMeaning": "A sample VPC Flow Log record shows metadata, including addresses, ports, protocol, counters and action; it is not packet payload."
  },
  "2.1": {
    "command": "john --wordlist=words.txt hashes.txt",
    "meaning": "--wordlist selects candidate words; hashes.txt supplies authorized test hashes.",
    "expected": "Reports matches when found.",
    "mistake": "Hash format must be supported.",
    "section": "SEC401.2",
    "lab": "2.1",
    "sampleOutput": "Loaded 1 password hash (example format)\n0g 0:00:00:01 DONE",
    "outputMeaning": "No password was recovered in this illustrative run; results depend on candidates and hash format."
  },
  "2.2": {
    "command": "grep -n 'CONFIDENTIAL' sample.txt",
    "meaning": "-n prints matching line numbers; the quoted text is the pattern.",
    "expected": "Shows matching lines.",
    "mistake": "A simple pattern cannot replace DLP classification.",
    "section": "SEC401.2",
    "lab": "2.2",
    "sampleOutput": "3:CONFIDENTIAL - internal use only",
    "outputMeaning": "The marker appears on line 3 of the sample text file."
  },
  "2.3": {
    "command": "sha256sum backup.img",
    "meaning": "Computes a SHA-256 digest of the image file.",
    "expected": "Prints digest and filename.",
    "mistake": "Integrity does not guarantee recoverability.",
    "section": "SEC401.2",
    "lab": "2.3",
    "sampleOutput": "a3f5...<abbreviated SHA-256>  backup.img",
    "outputMeaning": "The tool returns a 64-hex-digit SHA-256 digest; this shortened example is not a valid comparison hash."
  },
  "3.1": {
    "command": "nmap -sT -Pn 10.169.5.2",
    "meaning": "-sT uses TCP connect scanning; -Pn skips host discovery; IP is target.",
    "expected": "Reports observed port states.",
    "mistake": "-Pn does not verify that the host is online.",
    "section": "SEC401.3",
    "lab": "3.1",
    "sampleOutput": "Nmap scan report for 10.169.5.2\nPORT    STATE SERVICE\n22/tcp  open  ssh\n80/tcp  closed http",
    "outputMeaning": "In this simulated scan, TCP 22 accepts connections while TCP 80 refuses them; other port states depend on the network."
  },
  "3.2": {
    "command": "file sample.bin",
    "meaning": "file inspects content signatures; sample.bin is the input.",
    "expected": "Shows probable file type.",
    "mistake": "File type does not imply safety.",
    "section": "SEC401.3",
    "lab": "3.2",
    "sampleOutput": "sample.bin: ELF 64-bit LSB executable, x86-64",
    "outputMeaning": "The file signature suggests a Linux ELF executable; it does not establish whether the binary is benign."
  },
  "3.3": {
    "command": "curl -I https://example.test",
    "meaning": "-I requests HTTP response headers.",
    "expected": "Shows headers or an error.",
    "mistake": "HEAD behavior can differ from GET.",
    "section": "SEC401.3",
    "lab": "3.3",
    "sampleOutput": "HTTP/1.1 200 OK\ncontent-type: text/html",
    "outputMeaning": "The server returned an HTTP success status and a content type to a HEAD request."
  },
  "3.4": {
    "command": "grep -i 'failed' auth.log | wc -l",
    "meaning": "-i ignores case; | pipes matches; wc -l counts lines.",
    "expected": "Shows count of matching lines.",
    "mistake": "Line count may differ from event count.",
    "section": "SEC401.3",
    "lab": "3.4",
    "sampleOutput": "12",
    "outputMeaning": "Twelve lines contain the searched term; that is not necessarily twelve unique authentication failures."
  },
  "4.1": {
    "command": "sha256sum evidence.bin",
    "meaning": "Computes SHA-256 digest for comparison.",
    "expected": "Shows digest.",
    "mistake": "Matching hashes alone do not prove authenticity.",
    "section": "SEC401.4",
    "lab": "4.1",
    "sampleOutput": "b7c9...<abbreviated SHA-256>  evidence.bin",
    "outputMeaning": "A shortened illustrative digest; compare the complete 64-character value against a trusted baseline."
  },
  "4.2": {
    "command": "openssl enc -aes-256-cbc -salt -in plain.txt -out cipher.bin",
    "meaning": "enc performs encryption; cipher flag selects AES CBC; -salt enables salting; -in and -out name files.",
    "expected": "Writes encrypted output.",
    "mistake": "CBC alone does not authenticate data.",
    "section": "SEC401.4",
    "lab": "4.2",
    "sampleOutput": "enter AES-256-CBC encryption password:\nVerifying - enter AES-256-CBC encryption password:",
    "outputMeaning": "A password prompt may appear; cipher.bin is written if encryption succeeds. Output varies by OpenSSL version."
  },
  "4.3": {
    "command": "tcpdump -nn -i eth0 'tcp port 443'",
    "meaning": "-nn avoids resolution; -i selects interface; expression limits packets.",
    "expected": "Shows observed matching packets.",
    "mistake": "Wrong interface can hide relevant traffic.",
    "section": "SEC401.4",
    "lab": "4.3",
    "sampleOutput": "12:00:01 IP 10.0.0.4.53000 > 198.51.100.2.443: Flags [S]",
    "outputMeaning": "A SYN was observed on eth0 matching the TCP port 443 capture filter."
  },
  "5.1": {
    "command": "tasklist /FI \"IMAGENAME eq notepad.exe\"",
    "meaning": "/FI filters the Windows process list by image name.",
    "expected": "Shows matching processes.",
    "mistake": "A process name does not establish trust.",
    "section": "SEC401.5",
    "lab": "5.1",
    "sampleOutput": "Image Name                     PID Session Name\nnotepad.exe                   4120 Console",
    "outputMeaning": "A matching notepad.exe process is running with illustrative PID 4120."
  },
  "5.2": {
    "command": "icacls C:\\Data",
    "meaning": "Shows access-control entries for the specified Windows path.",
    "expected": "Prints ACL entries.",
    "mistake": "Group membership affects effective permissions.",
    "section": "SEC401.5",
    "lab": "5.2",
    "sampleOutput": "C:\\Data BUILTIN\\Administrators:(F)\n        BUILTIN\\Users:(RX)",
    "outputMeaning": "Administrators have full control and Users have read/execute in this simplified example."
  },
  "5.3": {
    "command": "secedit /analyze /db security.sdb /cfg baseline.inf",
    "meaning": "/analyze evaluates settings; /db specifies database; /cfg specifies template.",
    "expected": "Records configuration analysis.",
    "mistake": "Analysis is not enforcement.",
    "section": "SEC401.5",
    "lab": "5.3",
    "sampleOutput": "Task is completed successfully.\nSee log file for details.",
    "outputMeaning": "The analysis completed; inspect the security database/results and log for mismatches, rather than treating completion as compliance."
  },
  "5.4": {
    "command": "Get-Process | Where-Object {$_.CPU -gt 10}",
    "meaning": "Pipeline passes process objects; $_ is current object; -gt means greater than.",
    "expected": "Shows processes with over ten cumulative CPU seconds.",
    "mistake": "CPU is not instantaneous utilization.",
    "section": "SEC401.5",
    "lab": "5.4",
    "sampleOutput": "Handles NPM(K) PM(K) WS(K) CPU(s) Id ProcessName\n    210     18 45000 70000  15.20 4120 ExampleApp",
    "outputMeaning": "The example process has accumulated 15.20 seconds of CPU time, not 15.20% utilization."
  },
  "6.1": {
    "command": "chmod 640 report.txt",
    "meaning": "Owner gets read/write; group read; others no access.",
    "expected": "Changes Unix permission bits.",
    "mistake": "ACLs can further affect access.",
    "section": "SEC401.6",
    "lab": "6.1",
    "sampleOutput": "$ ls -l report.txt\n-rw-r----- 1 user group 128 Oct 13 09:00 report.txt",
    "outputMeaning": "Owner can read/write, group can read, and others have no permissions in the displayed mode."
  },
  "6.2": {
    "command": "docker ps -a",
    "meaning": "ps lists containers; -a includes stopped containers.",
    "expected": "Shows containers.",
    "mistake": "Without -a stopped containers are omitted.",
    "section": "SEC401.6",
    "lab": "6.2",
    "sampleOutput": "CONTAINER ID IMAGE       COMMAND    STATUS                 NAMES\nabc123def456 nginx:alpine \"nginx\"   Exited (0) 1 hour ago   web-test",
    "outputMeaning": "The -a flag includes the stopped web-test container."
  },
  "6.3": {
    "command": "journalctl -u ssh --since today",
    "meaning": "-u selects service unit; --since filters time.",
    "expected": "Shows recent unit journal records.",
    "mistake": "Unit name differs by distribution.",
    "section": "SEC401.6",
    "lab": "6.3",
    "sampleOutput": "Oct 13 09:12:00 host sshd[1234]: Accepted publickey for user from 192.0.2.10 port 50200 ssh2",
    "outputMeaning": "A sample SSH authentication success appears in the unit journal; actual unit names vary."
  }
};

const GSEC_COMMAND_DOCS={"ss":"https://man7.org/linux/man-pages/man8/ss.8.html","nmap":"https://nmap.org/book/man.html","tcpdump":"https://www.tcpdump.org/manpages/tcpdump.1.html","dig":"https://bind9.readthedocs.io/en/latest/manpages.html","grep":"https://www.gnu.org/software/grep/manual/grep.html","find":"https://www.gnu.org/software/findutils/manual/html_mono/find.html","stat":"https://www.gnu.org/software/coreutils/manual/html_node/stat-invocation.html","ls":"https://www.gnu.org/software/coreutils/manual/html_node/ls-invocation.html","cat":"https://www.gnu.org/software/coreutils/manual/html_node/cat-invocation.html","sha256sum":"https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html","curl":"https://curl.se/docs/manpage.html","journalctl":"https://www.freedesktop.org/software/systemd/man/latest/journalctl.html","docker":"https://docs.docker.com/reference/cli/docker/","nslookup":"https://bind9.readthedocs.io/en/latest/manpages.html","whoami":"https://www.gnu.org/software/coreutils/manual/html_node/whoami-invocation.html","id":"https://www.gnu.org/software/coreutils/manual/html_node/id-invocation.html","file":"https://man7.org/linux/man-pages/man1/file.1.html","strings":"https://sourceware.org/binutils/docs/binutils/strings.html","openssl":"https://docs.openssl.org/master/man1/openssl/","awk":"https://www.gnu.org/software/gawk/manual/gawk.html","sed":"https://www.gnu.org/software/sed/manual/sed.html","ip":"https://man7.org/linux/man-pages/man8/ip.8.html","chmod":"https://www.gnu.org/software/coreutils/manual/html_node/chmod-invocation.html","chown":"https://www.gnu.org/software/coreutils/manual/html_node/chown-invocation.html","tar":"https://www.gnu.org/software/tar/manual/","zcat":"https://www.gnu.org/software/gzip/manual/gzip.html","gzip":"https://www.gnu.org/software/gzip/manual/gzip.html","netstat":"https://man7.org/linux/man-pages/man8/netstat.8.html","ping":"https://man7.org/linux/man-pages/man8/ping.8.html","traceroute":"https://man7.org/linux/man-pages/man8/traceroute.8.html","systemctl":"https://www.freedesktop.org/software/systemd/man/latest/systemctl.html","powershell":"https://learn.microsoft.com/en-us/powershell/scripting/overview","secedit":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/secedit","wevtutil":"https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/wevtutil","netsh":"https://learn.microsoft.com/en-us/windows-server/networking/technologies/netsh/netsh","get":"https://learn.microsoft.com/en-us/powershell/scripting/overview"};
function gsecCommandReference(command){const first=String(command||'').trim().split(/\s+/)[0].toLowerCase();return GSEC_COMMAND_DOCS[first]||null;}
