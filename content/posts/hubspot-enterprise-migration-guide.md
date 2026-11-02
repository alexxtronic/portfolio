---
title: How I migrate a CRM to HubSpot Enterprise without losing a record
description: CRM migrations go wrong in predictable ways. The audit, data design, staged import and cutover plan I use, written as the playbook I wish I'd had the first time.
date: 2026-05-27
category: CRM
tags: HubSpot, CRM migration, data quality, marketing operations, RevOps
---

The first CRM migration I worked on went badly. Not catastrophically, but badly enough. A few thousand contacts lost their deal history, a set of workflows quietly stopped firing, and sales spent weeks rebuilding views they'd had before. Nobody was fired. Everyone was annoyed.

Since then I've led several migrations into HubSpot Enterprise, the largest with tens of thousands of contacts, and I've got the process down to something calm and repeatable. Here it is.

## Phase one: audit everything, change nothing

Before moving a single record, write down what exists. Every object, every property, every workflow, every integration, every report people actually use.

That last part matters. Ask each team to show you the five views and reports they open every week. Those are the things that must work on day one. Everything else can wait.

The audit usually reveals that a good third of the old system is dead. Properties nobody has filled in for years, workflows for campaigns that ended long ago, duplicate fields created by three different admins. Don't migrate any of it.

## Phase two: design for how you want to work

The most common mistake is rebuilding the old CRM in HubSpot, field for field. You end up paying for a new system and keeping all the old problems.

Instead, sit down with sales, marketing and whoever handles customers after the sale, and agree on:

- **Lifecycle stages.** What does each one mean, exactly, and who moves a record from one to the next?
- **Required properties.** The handful of fields every record must have to be useful.
- **Ownership.** Who owns a contact, a company and a deal, and what happens when someone leaves.
- **Naming.** One convention for properties, lists and workflows, written down.

Then map every old field to a new one, or explicitly to "not migrating". The mapping sheet becomes the single source of truth for the project.

## Phase three: clean before you move

Moving dirty data into a new system just makes it expensive dirty data. Before import, I deduplicate contacts and companies, standardize country and industry values, fix obviously broken emails and decide what to do with records that have had no activity in years.

Archiving old records instead of migrating them is often the right call. It also lowers your HubSpot bill, since pricing is tied to marketing contacts.

## Phase four: import in stages

I never import everything at once. My approach is 10, 100, 1,000, then everything.

Import ten records and check every single field, association and timeline event by hand. Then a hundred, and spot-check. Then a thousand, and run reports comparing counts between old and new. Only when the numbers match do the rest go in.

Associations deserve extra paranoia. Contacts to companies, contacts to deals, deals to companies. This is where migrations quietly lose history, and it's why I import objects in a fixed order: companies, then contacts, then deals, then activities.

## Phase five: cutover and the first two weeks

Pick a cutover date with a quiet week behind it, not before a big launch. Freeze changes in the old system the day before. Run the final import. Switch integrations over. Then keep the old system read-only for at least a month, because someone will need to check something.

For the first two weeks, I hold a short daily check-in with one person from each team. Most problems surface in the first three days, and they're almost always small: a missing view, a property someone relied on, a workflow that needs a tweak.

## The short version

- Audit what's used, not just what exists.
- Design the system you want, not a copy of the one you had.
- Clean before you move.
- Import in stages and check associations obsessively.
- Keep the old system read-only for a month.

None of this is glamorous. All of it is cheaper than fixing a broken CRM after launch.
