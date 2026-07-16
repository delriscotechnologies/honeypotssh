<h1 align="center">HONEYPOTSSH</h1>

<p align="center">
  An SSH honeypot lab for observing brute-force attempts and interactive attacker behavior with Cowrie.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> |
  <a href="#what-you-observe">Evidence</a> |
  <a href="#how-it-works">Architecture</a> |
  <a href="#scope-and-safeguards">Safeguards</a> |
  <a href="index.html">Full Write-Up</a>
</p>

---

HoneypotSSH documents a controlled two-machine lab: Linux Mint runs [Cowrie](https://github.com/delriscotechnologies/cowrie) as a deceptive SSH service, while Kali Linux generates authorized login attempts with Hydra. Del Risco Technologies maintains a native GitHub fork that preserves the upstream Cowrie history, attribution, and update path.

Cowrie accepts connections into an emulated Linux environment and records authentication attempts, commands, session activity, and file transfers. The visitor interacts with the decoy, not with a real shell on the Linux Mint host.

> Run this lab only on systems and networks you own or are explicitly authorized to test. Honeypot logs can contain attempted credentials, source addresses, commands, session recordings, and hostile files; never commit real evidence to a public repository.

## Quick Start

The complete walkthrough is available in the [HTML lab write-up](index.html). The commands below summarize the reviewed Cowrie 3.0.0 installation used by the project.

On the Linux Mint honeypot, install the system dependencies and create a dedicated non-root account:

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv libssl-dev libffi-dev build-essential libpython3-dev authbind
sudo adduser --disabled-password cowrie
sudo -iu cowrie
```

Create a self-contained state directory, install the pinned Cowrie release, and initialize it:

```bash
mkdir ~/my-honeypot
cd ~/my-honeypot
python3 -m venv cowrie-env
source cowrie-env/bin/activate
python -m pip install --upgrade pip
python -m pip install "cowrie==3.0.0"
cowrie init
cowrie start
cowrie status
```

Cowrie listens on `2222/tcp` by default. From the Kali VM, replace the example address with the Linux Mint lab address:

```bash
ssh -p 2222 root@192.168.7.199
```

Follow the live diagnostic log on Linux Mint:

```bash
cd ~/my-honeypot
tail -f var/log/cowrie/cowrie.log
```

## What You Observe

Cowrie turns an SSH connection into evidence without granting access to the host operating system.

| Evidence | What it shows |
| --- | --- |
| Authentication events | Source address and attempted username/password pairs |
| Command events | Commands entered in the emulated shell |
| Session recordings | Connection flow and replayable terminal activity |
| File activity | SFTP, SCP, and attempted downloads |
| JSON events | Structured records for analysis or SIEM ingestion |

The primary files are stored under the Cowrie state directory:

```text
var/log/cowrie/cowrie.log
var/log/cowrie/cowrie.json
var/lib/cowrie/tty/
var/lib/cowrie/downloads/
```

Treat downloaded artifacts as malware. Hash and inspect them only in a separate analysis environment, restrict access to the evidence, redact sensitive values before sharing, and apply an explicit retention period.

## How It Works

```text
Kali Linux
  Hydra / SSH client
          |
          | authorized lab traffic
          v
Linux Mint
  Cowrie on 2222/tcp
          |
          +--> emulated Linux shell
          +--> credential and command events
          +--> JSON and text logs
          +--> TTY session recordings
          +--> transferred-file collection
```

The lab intentionally makes the SSH decoy appear permissive. The security boundary is that Cowrie runs from its own state directory under a dedicated non-root account and the real host does not expose credentials or a production shell to the visitor.

## Optional Port 22 Exposure

Port `22` attracts more representative SSH traffic, but changing it can conflict with the host's real SSH service or lock out an administrator. First move and verify the administrative SSH service, then redirect incoming lab traffic to Cowrie:

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 22 -j REDIRECT --to-port 2222
sudo apt install -y iptables-persistent
sudo netfilter-persistent save
```

Test administrative access before ending the existing session. Keep the honeypot on a dedicated host-only network, VLAN, or cloud subnet with no route to trusted systems.

## Authorized Attack Simulation

Hydra is optional. Use small synthetic lists first so the resulting evidence remains understandable and bounded:

```bash
printf 'admin\nroot\n' > users-lab.txt
printf 'password\n123456\nhoneypot\n' > passwords-lab.txt
hydra -L users-lab.txt -P passwords-lab.txt -t 4 -f ssh://192.168.7.199:2222
```

Delete the synthetic lists after the exercise. Never point Hydra at an address you do not own or have explicit permission to test.

## Scope and Safeguards

- Cowrie runs from a dedicated non-root Linux account.
- The documented dependency is pinned to Cowrie 3.0.0.
- The default lab begins on high port `2222`; port `22` exposure is optional.
- The decoy should be isolated from production networks and administrative services.
- Real credentials must never appear in Cowrie's user database, fake filesystem, or banners.
- Logs, TTY recordings, host keys, and captured files must stay outside the public repository.
- Resource usage, disk growth, log rotation, firewall rules, and evidence retention remain operator responsibilities.
- The HTML write-up is documentation; it does not install or run Cowrie automatically.

Cowrie is an independent BSD-3-Clause project maintained upstream. The Del Risco Technologies repository is a fork; HoneypotSSH is a lab write-up and operator guide, not an official Cowrie distribution.

## References

- [Cowrie documentation](https://docs.cowrie.org/en/stable/)
- [Del Risco Technologies Cowrie fork](https://github.com/delriscotechnologies/cowrie)
- [Upstream Cowrie repository](https://github.com/cowrie/cowrie)
- [Hydra source repository](https://github.com/vanhauser-thc/thc-hydra)
