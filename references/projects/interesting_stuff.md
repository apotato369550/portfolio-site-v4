# Interesting Stuff

Projects that reveal character more than skill. Security curiosity. Filipino context. Honest README energy. Things that are just fun.

---

## apotato369550 — The Profile README

This is the most important document on the GitHub. Not because of what it says, but *how*.

**Tone:** Casual, self-aware, lightly irreverent. References "ungodly amounts of Nescafe 3-in-1." Calls himself a "Linux gremlin." Lists "vibe coding" and "local LLM gossip" as genuine activities alongside production AI engineering work.

**Self-presentation oscillation:** Accomplished (DOST-SEI Merit Scholar, AI Engineer Intern, multiple production systems) ↔ irreverent (acknowledges the caffeine dependency, the side tangents, the unfinished projects). No pretension. Just competence with style.

**What it reveals:** The profile is the audience segmentation working in real-time. Gen Z peers see the jokes and the neon. Business contacts see the credentials and the active repos. Family sees the warmth underneath. The same document reads differently to each.

**Aesthetic carry-over:** The neon/vaporwave aesthetic from v3 still bleeds into the profile. v4 is restraint. The profile is still honest about where he came from.

---

## zip-cracker — Password Cracking Tool

**What:** Brute-force ZIP password cracker using a wordlist (rockyou.txt).
**How:** Sequential password attempt against encrypted archive → match found or dictionary exhausted.
**Tech:** Python 3.11.
**Why:** Educational security project. Understanding how password attacks work is how you understand why strong passwords matter.
**Note:** The security curiosity thread starts here. Not destructive intent — genuine interest in how things break.

---

## python-malware-scanner — Hash-Based File Scanner

**What:** Compares file MD5 hashes against a known-malicious hash database (VirusShare).
**How:** File → MD5 hash → dictionary lookup → "danger" or "safe."
**Tech:** Python, MD5, VirusShare database.
**Why:** First Python project after getting comfortable with the language. Picked the most interesting possible use case.
**Note:** Very basic by current standards — it's purely hash matching, no heuristics. But the instinct to go straight to security for a first real project says something.

---

## sysdawg — Read-Only SRE Copilot

**What:** Homelab troubleshooting assistant powered by Mistral 7B. Gathers system diagnostics, sends them to a local LLM, returns advisory text.
**The interesting part:** Deliberately cannot execute commands. Advisory-only. The constraint was the point — a homelab SRE that could act autonomously is a security risk, so it doesn't.
**Why interesting:** The decision to neuter the tool intentionally, to make it *less* capable in a specific direction, reflects a maturity most junior devs don't have. You don't always build the most powerful version of something.

---

## dcism-starship — Vaporwave Multiplayer Territory Game

**What:** Real-time multiplayer territory control game. Vaporwave aesthetic. Server-authoritative state.
**Architecture:** Node.js/Express server, Socket.IO for broadcast, HTML5 Canvas rendering.
**Why interesting:** This is a proper game engine, not a toy. Server-authoritative state, real-time broadcast to N clients, game balance, Canvas rendering. Built for fun but technically serious.
**Note:** The vaporwave thread is consistent — dcism-starship, portfolio-v3, the GitHub profile. It's not a phase, it's an aesthetic sensibility.

---

## javascript-snek-pit — Multiplayer Snake (Honest About the Bugs)

**What:** Multiplayer snake game using Node.js and Socket.IO. Functional. Has known bugs.
**README energy:** Acknowledges the bugs openly. Doesn't pretend it's finished.
**Why interesting:** The honesty is the interesting part. Not "WIP" or "coming soon" — just "here it is, here are its problems, here's what it taught me."
**Tech:** JavaScript, Node.js, Socket.IO.

---

## markdown-dungeon — Collaborative Text Adventure

**What:** A choose-your-own-adventure dungeon game played entirely through GitHub Markdown navigation. Community contributed branches.
**Architecture:** Floor/room directory structure. Markdown hyperlinks as narrative choices. GitHub repo as game engine.
**Why interesting:** Using GitHub's file system as a game engine is genuinely clever. The constraint (everything must be Markdown hyperlinks) shaped the design.
**Note:** Community project — others contributed rooms and branches. Information architecture as game design.

---

## pasta-pot — Grade 7 Creepypasta Site

**What:** Static site displaying horror stories. HTML and CSS. Made in Grade 7.
**Why interesting:** The first project is always revealing. The kid chose to build a horror site. Not a portfolio. Not a calculator. A creepypasta showcase.
**Note:** The aesthetic instinct — darkness, layering, mood — was present before any technical sophistication. That same instinct became the vaporwave portfolio. It's the same person.

---

## all-purpose-calculator — Built for Classmates in One Week

**What:** Multi-purpose Math/Science calculator covering sequences, wave properties, magnetism, optics.
**Context:** Finals prep. Built during a week-long vacation because classmates needed it.
**Why interesting:** The motivation wasn't "learn PHP." The motivation was "my classmates need this for exams, I have a week." The tool was secondary to the people problem.
**Tech:** PHP, HTML, CSS, JavaScript.

---

## first-git-demo — The Very Beginning

**README, verbatim:**
> "This is my first time using git to make changes on github. I'll admit that it's a bit confusing, but I'm sure as hell learning."

That's it. That's the whole README.
**Why interesting:** The candor. Not "Hello World!" Not a template. Just honest frustration and genuine forward motion. The same energy runs through everything after.

---

## python-chatroom-application — Anonymous LAN Chatrooms

**What:** Password-protected LAN chatroom with no message persistence. Fully anonymous, local network only, no logs.
**Architecture:** Host/client model. Socket programming. Passwords for room access. No message storage by design.
**Why interesting:** The "no persistence" constraint was intentional. Learning about LAN networking turned into building a privacy-first tool. The design decisions aren't naive — anonymous, ephemeral, local-only. That's a coherent threat model.
**Tech:** Python, sockets, Local Area Networks.

---

## my-mystnodes-ui — Cryptocurrency Node Management

**What:** Bash CLI for managing multiple Mysterium Network nodes (decentralized VPN network). HTTP requests, JSON parsing, interactive menu.
**Why interesting:** Running crypto nodes as a DeFi experiment is one thing. Building tooling to manage them cleanly because the manual process was annoying is another. Both together say: this person runs experimental infrastructure for fun and then builds proper tooling for it.
**Tech:** Bash, curl, jq, TequilAPI.

---

## scholar-portal — DOST SA USC Org Tool

**What:** Internal platform for DOST SA USC scholars — stipend updates, announcements, event management.
**Context:** Built while serving as Finance Officer of the same organization.
**Why interesting:** Built tooling for an organization he was actively running. Not a side project — operational tooling for real use while juggling classes and an internship.
**Tech:** Next.js, TypeScript, Supabase, Drizzle ORM, better-auth.

---

## super-simple-sortr — 12 Sorting Algorithms

**What:** Educational visualization of 12 sorting algorithms: Bubble, BogoSort, Cocktail Shaker, CombSort, Counting, Heap, Insertion, Selection, Merge, Quick, Shell, Timsort.
**Why interesting:** BogoSort is on the list. BogoSort is the algorithm that randomly shuffles until sorted — worst case infinite. Including it alongside Timsort is either pedagogical (understanding the full spectrum) or deeply funny. Probably both.
**Tech:** Python.
