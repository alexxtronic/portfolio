---
title: Agentic automation, explained by someone who actually ships it
description: AI agents are the most overused phrase in marketing right now. Here is what the word means in practice, where agents earn their keep, and the one rule I follow before I build any of them.
date: 2026-10-21
category: AI
tags: AI agents, automation, marketing operations, n8n, HubSpot
---

Every vendor deck I've seen this year has the word "agentic" on slide two. Most of them are describing a workflow with an LLM step in the middle. That's fine. It's useful. It's just not what people think they're buying.

I've spent the last couple of years building these systems for marketing and sales teams, from pharma to property portals, and I want to explain what the word means when you're the one wiring it up.

## A workflow follows steps. An agent picks them.

A normal automation is a recipe. When a form comes in, enrich the contact, add it to a list, send an email. Every step is decided in advance by a person.

An agent gets a goal and a set of tools, and decides the order itself. "Work out whether this inbound lead is worth a salesperson's time, and if it is, tell the right rep why." It might look up the company, check the CRM for past deals, read the form answers, and skip the enrichment step entirely because the CRM already had what it needed.

That freedom is the whole point, and it's also the whole risk. A recipe can't surprise you. An agent can.

## Where agents actually earn their keep

The best use cases I've found share three things:

- **The task needs judgment, but not a lot of it.** Sorting, scoring, routing, summarizing, first drafts. The kind of call a sharp junior would get right nine times out of ten.
- **The input is messy.** Free-text form fields, call notes, support tickets, reviews. Rules choke on this. Language models are good at it.
- **A wrong answer is cheap to catch.** If the agent misroutes a lead, a rep notices and moves it. If it misprices a contract, you have a problem.

On one project, the marketing team was spending most of a day each week reading open-text survey responses and tagging them by theme so the brand team could report on sentiment. We replaced that with an agent that reads each response, tags it, flags anything that looks like a complaint worth escalating, and posts a weekly summary into Slack. The humans now spend their time on the escalations and the summary, not on the tagging. That's the shape I look for.

## Where they don't

I steer clients away from agents in three places.

**Anything with legal or regulatory weight.** In pharma especially, a claim has to be approved word for word. An agent can draft, it can check copy against an approved claims library, but it should never publish.

**Anything where the rules are already clear.** If you can write the logic as an if-statement, write the if-statement. It's cheaper, faster, and it never has a creative day.

**Anything nobody owns.** An agent without an owner drifts. Prompts go stale, the CRM fields it reads get renamed, and six months later it's confidently wrong and nobody's looking.

## The rule I follow before building anything

I don't build an agent until a human has done the task by hand, on real data, and written down how they decided.

That sounds slow. It's the fastest thing I do. The notes from that exercise become the agent's instructions, the edge cases become the test set, and the person who did it becomes the owner. Almost every agent I've seen fail in the wild skipped this step and went straight from "wouldn't it be cool if" to a prompt.

## What a sensible first agent looks like

If you're starting from zero, here's what I'd build first:

1. Pick one queue that a person reads every day. Inbound leads, demo requests, partnership emails, whatever.
2. Have the agent read each item and do one thing: classify it, score it, or summarize it. One.
3. Post the result where the team already works, usually Slack or the CRM record, with a one-line reason.
4. Let people correct it with a reaction or a dropdown, and log every correction.
5. Read the corrections every Friday for a month and fix the instructions.

My usual stack for this is n8n for the orchestration, an LLM call for the judgment step, and HubSpot or Salesforce as the system of record. You can do the same in Make or Zapier. The tool matters much less than the loop in step five.

## So is it hype?

The word is hyped. The work isn't. The teams getting real value aren't running autonomous marketing departments. They've taken a few hours of skilled-but-tedious reading off their best people every week and given those hours back to the work that needs a human.

That's not a keynote. It's just good operations, and it compounds.
