---
title: How to get an LLM to write in your brand voice
description: A tone-of-voice PDF won't make a model sound like you. Examples, banned words and a simple review loop will. The setup I use with clients, step by step.
date: 2026-08-19
category: AI
tags: brand voice, prompting, copywriting, LLM, content operations
---

Every team that starts using AI for copy hits the same wall. The output is fine. It's grammatical, on topic, reasonably structured. And it sounds like nobody.

The usual fix is to paste the brand guidelines into the prompt. "Our voice is bold, warm and human." The model reads that and produces something bold, warm and human in exactly the same way it would for any other brand that described itself as bold, warm and human. Which is every brand.

Here's what actually works.

## Show, don't describe

Models are far better at imitating than at interpreting adjectives. So instead of describing the voice, give it examples.

I build a small library for each client: fifteen to twenty pieces of their best copy, picked by the people who know the brand best. Not the most recent pieces. The ones everyone agrees sound most like them. Social captions, email subject lines, a couple of paragraphs of web copy, ideally a mix.

Then for any task, the prompt includes three to five examples of the same format. Writing a product email? Give it three product emails you loved. The jump in quality from this alone is bigger than anything else on this list.

## Write the "never" list

Every brand voice is defined as much by what it avoids as by what it does. Write those down plainly.

A typical list looks something like this:

- Words we never use: "unlock", "elevate", "seamless", "game-changer", "dive in".
- No exclamation marks in headlines.
- We don't open with a question.
- We say "you", never "users" or "customers".
- No rhetorical lists of three.

Models have favorite words, and most of them are on everyone's banned list for a reason. Naming them explicitly removes most of the "this sounds like AI" feeling in one go.

## Give it the context a writer would get

A good copywriter wouldn't start without a brief. Neither should the model. For each piece I include who it's for, the one thing they should take away, where it will appear and how long it can be. Two or three sentences is enough.

"Write a LinkedIn post about our new feature" gets you a LinkedIn post. "Write for operations managers at mid-size logistics firms who are tired of chasing paperwork; the one takeaway is that the new feature removes the weekly spreadsheet; it will run as a paid post, under 80 words" gets you something you might actually use.

## Review like an editor, then feed it back

The model's first draft is a draft. Someone who knows the brand reads it and edits it. That part doesn't go away.

What most teams miss is the loop. When an editor makes the same fix three times, that fix goes into the instructions. When a draft comes out great, it goes into the example library. After a month the drafts need noticeably less editing, because the system has learned from the people who know best.

## Where I'd draw the line

I'm comfortable using AI-assisted copy for volume work: ad variants, email versions, product descriptions, social adaptations of an approved hero piece. I'm much more careful with anything that defines the brand. The campaign line, the manifesto, the founder's letter. Those should come from a person with something to say. The model can help them edit. It shouldn't be the one talking.

## A starter prompt structure

If you want something to copy, this is the skeleton I start from:

1. Role: who's writing and for which brand.
2. Brief: audience, takeaway, placement, length.
3. Examples: three to five pieces in the same format.
4. Never list: banned words and habits.
5. Output: the exact format you want back, including how many options.

It's not clever. It works because it's how you'd brief a good freelance writer, and a model rewards the same clarity a person does.
