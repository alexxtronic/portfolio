---
title: Lead scoring that sales actually trusts
description: Most lead scores get ignored within a month. Here is how I build scoring with Clay enrichment, an LLM read of the context and a feedback loop, so reps start using the number instead of their gut.
date: 2026-09-30
category: CRM
tags: lead scoring, Clay, HubSpot, sales and marketing alignment, enrichment
---

I have never met a sales team that loved its lead score.

Usually it's a number between 0 and 100 that someone in marketing set up three years ago. It gives points for opening emails and visiting the pricing page. Reps learned long ago that a student who downloads every ebook scores higher than a VP who filled in one form, so they ignore it and sort by "created date" instead.

The fix isn't a smarter formula. It's building a score that sales helped design and can argue with.

## Start with the last fifty deals, not the formula

Before I touch the CRM, I pull the last fifty closed-won deals and the last fifty leads sales rejected. Then I sit with two reps and go through them.

What did the good ones have in common when they first came in? Not when they closed. When they arrived. Company size, industry, the role of the person, what they wrote in the form, how they found us.

This hour is the most valuable part of the project. Reps will tell you things no dashboard shows. "If they mention a deadline in the form, they're real." "Anyone from a university is a waste of time." "Partners always come in through the webinar."

Those sentences become the scoring rules.

## Enrich first, score second

A score is only as good as what it can see, and most inbound leads arrive with an email address and a first name.

This is where Clay earns its place. For each new lead I run an enrichment waterfall: try one data provider for company size and industry, fall back to a second if the first comes up empty, then pull the person's role and seniority. Clay also lets you scrape the company's site or job board for signals, like whether they're hiring for roles your product supports.

Two tips from doing this a lot:

- **Cap your credits per lead.** Enrichment costs money on every record. Run the cheap checks first and only spend on deep enrichment when the lead passes a basic fit test.
- **Write the enriched data back into proper CRM properties**, not a notes field. If it's not a property, you can't score on it, report on it, or route on it.

## Let the model read what rules can't

Firmographic fit is easy to score with rules. Intent is not. Intent hides in the free-text field, the meeting notes, the reply to your first email.

I add one LLM step that reads everything written by or about the lead and returns a short structured answer: a score from 1 to 5 for buying intent, a one-sentence reason, and any red flags. The reason is the important part. A rep will forgive a wrong score if they can see why the system thought it. They won't forgive a mystery number.

The final score is a blend: fit from the rules, intent from the model, and engagement from behavior, weighted by what the deal review told us actually matters.

## Show the score where reps live

If reps have to open a report to see the score, they won't. I put three things on the contact record and in the Slack alert for new hot leads:

1. The score, as a simple tier: A, B, C.
2. The one-line reason from the model.
3. The two or three enriched facts that drove it.

Tiers beat numbers. Nobody can tell you the difference between a 67 and a 72. Everyone knows what an A means.

## Give sales a way to say "wrong"

Every hot-lead alert gets a thumbs up and a thumbs down. Every rejected lead in the CRM needs a rejection reason from a short dropdown. Both feed a simple report I review every two weeks with the sales lead.

This is the bit that builds trust. When a rep flags a bad lead and sees the scoring change a week later because of it, the score stops being marketing's thing and becomes the team's thing.

## What to expect

On a recent project for an optical retail group, this approach pulled in four sources for every score: ad data, the CRM, the data warehouse and Clay enrichment. Within a quarter, bottom-funnel conversion was up and the sales team was getting a big chunk of their week back from researching leads by hand.

The numbers will be different for you. The pattern won't. A score that's explained, visible and correctable gets used. One that isn't gets ignored, no matter how clever the maths is.
