<h1 align="center">HONEYPOTSSH</h1>

<p align="center">
  An SSH honeypot lab for observing brute-force attempts and interactive attacker behavior with Cowrie.
</p>

<p align="center">
  <a href="#how-it-works">Architecture</a> |
  <a href="#scope-and-safeguards">Safeguards</a> |
  <a href="https://delriscotechnologies.github.io/honeypotssh/">Full Write-Up</a>
</p>

---

HoneypotSSH documents a controlled two-machine lab: Linux Mint runs [Cowrie](https://github.com/cowrie/cowrie) as a deceptive SSH service, while Kali Linux generates authorized login attempts with Hydra. This repository contains the lab write-up and operator guidance; Cowrie remains an independent upstream dependency.

Cowrie accepts connections into an emulated Linux environment and records authentication attempts, commands, session activity, and file transfers. The visitor interacts with the decoy, not with a real shell on the Linux Mint host.

> Run this lab only on systems and networks you own or are explicitly authorized to test. Honeypot logs can contain attempted credentials, source addresses, commands, session recordings, and hostile files; never commit real evidence to a public repository.

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

## Scope and Safeguards

- Cowrie runs from a dedicated non-root Linux account.
- Cowrie is installed from its official package and is not redistributed in this repository.
- The documented lab uses Cowrie's default high port, `2222/tcp`.
- The decoy should be isolated from production networks and administrative services.
- Real credentials must never appear in Cowrie's user database, fake filesystem, or banners.
- Logs, TTY recordings, host keys, and captured files must stay outside the public repository.
- Resource usage, disk growth, log rotation, firewall rules, and evidence retention remain operator responsibilities.
- The HTML write-up is documentation; it does not install or run Cowrie automatically.

Cowrie is an independent BSD-3-Clause project maintained upstream. HoneypotSSH references Cowrie but does not redistribute its source and is not an official Cowrie distribution.

## References

- [Upstream Cowrie repository](https://github.com/cowrie/cowrie)
