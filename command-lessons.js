const GSEC_COMMAND_LESSONS = {
  "1.1": {
    "command": "tcpdump -nn -r capture.pcap 'host 10.0.0.4'",
    "meaning": "-nn disables address and service resolution; -r reads a saved capture; host selects packets involving the address.",
    "expected": "Displays matching packets.",
    "mistake": "A capture filter and a display filter are not interchangeable."
  },
  "1.2": {
    "command": "tshark -r capture.pcap -Y 'tcp.port == 443'",
    "meaning": "-r reads a capture; -Y applies a Wireshark display filter.",
    "expected": "Displays saved TCP packets involving port 443.",
    "mistake": "HTTP/3 can use UDP."
  },
  "1.3": {
    "command": "zcat flows.log.gz | head -4",
    "meaning": "zcat streams decompressed text to stdout; | pipes it; head -4 shows four lines.",
    "expected": "Displays four log lines.",
    "mistake": "No extracted file is created."
  },
  "2.1": {
    "command": "john --wordlist=words.txt hashes.txt",
    "meaning": "--wordlist selects candidate words; hashes.txt supplies authorized test hashes.",
    "expected": "Reports matches when found.",
    "mistake": "Hash format must be supported."
  },
  "2.2": {
    "command": "grep -n 'CONFIDENTIAL' sample.txt",
    "meaning": "-n prints matching line numbers; the quoted text is the pattern.",
    "expected": "Shows matching lines.",
    "mistake": "A simple pattern cannot replace DLP classification."
  },
  "2.3": {
    "command": "sha256sum backup.img",
    "meaning": "Computes a SHA-256 digest of the image file.",
    "expected": "Prints digest and filename.",
    "mistake": "Integrity does not guarantee recoverability."
  },
  "3.1": {
    "command": "nmap -sT -Pn 10.169.5.2",
    "meaning": "-sT uses TCP connect scanning; -Pn skips host discovery; IP is target.",
    "expected": "Reports observed port states.",
    "mistake": "-Pn does not verify that the host is online."
  },
  "3.2": {
    "command": "file sample.bin",
    "meaning": "file inspects content signatures; sample.bin is the input.",
    "expected": "Shows probable file type.",
    "mistake": "File type does not imply safety."
  },
  "3.3": {
    "command": "curl -I https://example.test",
    "meaning": "-I requests HTTP response headers.",
    "expected": "Shows headers or an error.",
    "mistake": "HEAD behavior can differ from GET."
  },
  "3.4": {
    "command": "grep -i 'failed' auth.log | wc -l",
    "meaning": "-i ignores case; | pipes matches; wc -l counts lines.",
    "expected": "Shows count of matching lines.",
    "mistake": "Line count may differ from event count."
  },
  "4.1": {
    "command": "sha256sum evidence.bin",
    "meaning": "Computes SHA-256 digest for comparison.",
    "expected": "Shows digest.",
    "mistake": "Matching hashes alone do not prove authenticity."
  },
  "4.2": {
    "command": "openssl enc -aes-256-cbc -salt -in plain.txt -out cipher.bin",
    "meaning": "enc performs encryption; cipher flag selects AES CBC; -salt enables salting; -in and -out name files.",
    "expected": "Writes encrypted output.",
    "mistake": "CBC alone does not authenticate data."
  },
  "4.3": {
    "command": "tcpdump -nn -i eth0 'tcp port 443'",
    "meaning": "-nn avoids resolution; -i selects interface; expression limits packets.",
    "expected": "Shows observed matching packets.",
    "mistake": "Wrong interface can hide relevant traffic."
  },
  "5.1": {
    "command": "tasklist /FI \"IMAGENAME eq notepad.exe\"",
    "meaning": "/FI filters the Windows process list by image name.",
    "expected": "Shows matching processes.",
    "mistake": "A process name does not establish trust."
  },
  "5.2": {
    "command": "icacls C:\\Data",
    "meaning": "Shows access-control entries for the specified Windows path.",
    "expected": "Prints ACL entries.",
    "mistake": "Group membership affects effective permissions."
  },
  "5.3": {
    "command": "secedit /analyze /db security.sdb /cfg baseline.inf",
    "meaning": "/analyze evaluates settings; /db specifies database; /cfg specifies template.",
    "expected": "Records configuration analysis.",
    "mistake": "Analysis is not enforcement."
  },
  "5.4": {
    "command": "Get-Process | Where-Object {$_.CPU -gt 10}",
    "meaning": "Pipeline passes process objects; $_ is current object; -gt means greater than.",
    "expected": "Shows processes with over ten cumulative CPU seconds.",
    "mistake": "CPU is not instantaneous utilization."
  },
  "6.1": {
    "command": "chmod 640 report.txt",
    "meaning": "Owner gets read/write; group read; others no access.",
    "expected": "Changes Unix permission bits.",
    "mistake": "ACLs can further affect access."
  },
  "6.2": {
    "command": "docker ps -a",
    "meaning": "ps lists containers; -a includes stopped containers.",
    "expected": "Shows containers.",
    "mistake": "Without -a stopped containers are omitted."
  },
  "6.3": {
    "command": "journalctl -u ssh --since today",
    "meaning": "-u selects service unit; --since filters time.",
    "expected": "Shows recent unit journal records.",
    "mistake": "Unit name differs by distribution."
  }
};
