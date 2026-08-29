<h1 align="center">HONEYPOTSSH</h1>

<p align="center">
  An SSH honeypot lab for observing brute-force attempts and interactive attacker behavior with Cowrie.
</p>

<p align="center">
  <a href="https://delriscotechnologies.github.io/honeypotssh/">Full Write-Up</a>
</p>

---

HoneypotSSH documents a controlled two-machine lab: Linux Mint runs Cowrie as a deceptive SSH service, while Kali Linux generates authorized login attempts with Hydra.

Cowrie records authentication attempts, commands, session activity, and file transfers while the visitor interacts with the decoy environment.

> Run this lab only on systems and networks you own or are explicitly authorized to test. Honeypot logs can contain attempted credentials, source addresses, commands, session recordings, and hostile files.

Cowrie is an independent BSD-3-Clause project maintained upstream. HoneypotSSH references Cowrie but does not redistribute its source and is not an official Cowrie distribution.

## References

- [Upstream Cowrie repository](https://github.com/cowrie/cowrie)
- [Cowrie installation guide](https://docs.cowrie.org/en/latest/INSTALL.html)

