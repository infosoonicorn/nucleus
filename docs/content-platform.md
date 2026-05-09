# Website, CMS, and AI Content Platform

Nucleus must be built as an editable website plus portal, not as hardcoded pages. Public pages, service pages, articles, tools, newsletters, lead magnets, and future client-facing updates should be managed from an authenticated backend editor.

## Research Notes From Comparable Firms

Reviewed public pages from Deloitte, PwC India, KPMG India, EY India, Grant Thornton Bharat, BDO India, and Nangia Andersen to identify recurring website structures, SEO surfaces, and lead magnets.

Observed patterns:

- broad service taxonomies: tax, advisory, assurance, deals/transactions, risk, ESG, startup/private business, transfer pricing, GST/indirect tax, managed services;
- service-detail pages with "how we help", sub-services, partner/contact CTAs, and related insights;
- industry pages for focused SEO and credibility;
- insights libraries with filters by type, service, industry, and topic;
- newsletters, tax alerts, thoughtware, budget updates, podcasts, and webinars;
- tools and lead magnets such as compliance calendars, DPDPA/privacy assessments, tax hubs, downloadable reports, and subscription forms;
- case studies and "real results" stories where permitted;
- people/leadership pages that route visitors to named experts;
- contact, RFP, and newsletter CTAs repeated across service and insight pages.

Source examples:

- Deloitte India Tax lists business tax, indirect tax, international tax, transfer pricing, M&A tax, and tax technology consulting.
- PwC India uses a broad services directory including strategy, deals, GCCs, entrepreneurial/private business, ESG, risk, startups, and tax academy.
- KPMG India groups services around tax and advisory, and runs tax insight/newsletter surfaces.
- EY India groups assurance, consulting, strategy, tax, and transactions.
- Grant Thornton Bharat highlights assessments, compliance calendars, newsletters, podcasts, articles, and reports.
- BDO India runs tax services plus publications/subscription flows.
- Nangia Andersen highlights growth strategy and transaction advisory, tax and regulatory, transfer pricing, GST/foreign trade, risk advisory, ESG, startup solutions, cybersecurity, and newsletters.

## Nucleus Website Sections

Phase 1 public website should support these editable page types:

- Home
- About Nucleus
- Services overview
- Individual service pages
- Industries / client segments
- Startup and founder advisory
- Compliance calendar
- Insights / articles
- Newsletters
- Public tools and calculators
- Downloads / guides
- Events / webinars, later
- Case studies, only when real and approved
- Website-to-LinkedIn distribution
- Team / experts
- Careers
- Job posts
- Life at Nucleus
- Alumni stories
- Contact / consultation request
- Client portal login entry

Initial service taxonomy:

- Investment Banking
- M&A Advisory
- Risk Advisory
- Tax and Regulatory
- Assurance
- Valuations
- Finance Outsourcing
- Corporate Secretarial
- AIF and Fund Management

Supporting content clusters:

- Startup and fund advisory
- CFO and finance operations
- GST, indirect tax, and compliance
- Corporate law and secretarial coordination
- AIF setup and fund management
- Transaction and deal support
- Valuation and financial modelling
- Risk, controls, and process advisory
- Client reporting and MIS

The detailed page map, page promises, service copy, industry routes, team positioning, lead magnets, and CMS-ready fields are maintained in `docs/content-master.md`.

SEO/lead-magnet candidates:

- India compliance calendar
- GST due-date tracker
- TDS/TCS checklist
- Startup compliance checklist
- Funding readiness checklist
- Valuation readiness checklist
- Due diligence document checklist
- Newsletter: weekly tax and compliance update
- Budget/update hub
- DPDPA/privacy readiness checklist, if we offer that advisory
- "Ask Nucleus" public query intake, with human review before response

## CMS Requirement

The backend editor must allow authorised staff to manage:

- pages and page sections;
- service pages;
- article drafts and published articles;
- categories, tags, authors, and industries;
- SEO title, description, canonical URL, OG image, and schema metadata;
- FAQs and FAQ schema content;
- media assets;
- lead magnets and downloadable files;
- newsletter issues;
- public tool copy/configuration;
- contact form routing;
- publish/unpublish state;
- scheduled publishing;
- audit trail of edits.

Editor roles:

- `admin`: full CMS and portal access.
- `editor`: create/edit content, submit for review.
- `reviewer`: approve/publish content.
- `staff`: access internal portal modules.
- `client`: access approved client areas only.

Content states:

- `draft`
- `in_review`
- `approved`
- `scheduled`
- `published`
- `archived`

## Suggested Supabase Tables

Core content:

- `content_pages`
- `content_sections`
- `content_navigation`
- `content_media_assets`
- `content_authors`
- `content_categories`
- `content_tags`
- `content_page_tags`
- `content_audit_events`

Articles and newsletters:

- `articles`
- `article_sources`
- `article_tags`
- `social_distribution_posts`
- `social_distribution_channels`
- `social_distribution_events`
- `newsletter_issues`
- `newsletter_subscribers`
- `newsletter_events`

Lead magnets and tools:

- `lead_magnets`
- `lead_capture_forms`
- `lead_submissions`
- `leads`
- `lead_activities`
- `lead_consents`
- `lead_tags`
- `lead_tag_links`
- `lead_assignments`
- `lead_notes`
- `lead_magnet_downloads`
- `public_tools`
- `tool_runs`, only if storing user submissions is necessary and consented.

Careers and talent:

- `job_posts`
- `job_departments`
- `job_locations`
- `candidate_profiles`
- `candidate_applications`
- `candidate_consents`
- `candidate_activities`
- `application_notes`
- `application_interviews`
- `application_feedback`
- `talent_community_subscribers`
- `alumni_profiles`
- `alumni_consents`
- `culture_albums`
- `culture_media_assets`

AI workflow:

- `ai_content_jobs`
- `ai_content_drafts`
- `ai_content_sources`
- `ai_content_reviews`
- `ai_content_settings`
- `content_source_feeds`
- `content_source_items`
- `content_topic_rules`
- `content_author_mappings`
- `content_review_assignments`

Social distribution:

- `social_accounts`
- `social_distribution_jobs`
- `social_distribution_events`
- `social_api_tokens`, encrypted/secured outside public client access

M&A partner deal room:

- `deal_opportunities`
- `deal_documents`
- `deal_access_groups`
- `deal_access_grants`
- `deal_partner_profiles`
- `deal_partner_interests`
- `deal_questions`
- `deal_answers`
- `deal_ndas`
- `deal_activity_logs`
- `deal_followups`
- `deal_status_history`

## AI-Assisted Blog and Advisory Desk Workflow

AI may assist with daily article/live-update generation, but publication must remain human-approved. The goal is to keep Nucleus visibly active and useful without becoming a generic news website or publishing unreviewed tax/legal/regulatory advice.

Daily pipeline:

1. Monitor approved source inputs from configured official sources and service-topic rules.
2. Collect source items with URL, title, date, source body/excerpt, source type, and retrieval timestamp.
3. Classify relevance by service line, industry, lifecycle stage, urgency, and audience.
4. Generate draft content: daily update, advisory note, explainer, FAQ update, checklist, weekly digest item, or long-form article.
5. Add SEO title, slug, meta description, FAQs, source notes, suggested CTA, and related lead magnet.
6. Map draft to a partner/author using service-line author mappings.
7. Mark draft as `in_review`, never published automatically.
8. Reviewer edits, approves, rejects, or assigns partner review.
9. Approved content publishes to the website and appears on the relevant service page.
10. CMS creates optional newsletter and LinkedIn distribution drafts.

Approved source categories:

- Income Tax Department
- MCA
- GST/CBIC
- RBI
- SEBI
- IBBI
- ICAI
- DPIIT/startup/MSME/government schemes
- Finance Bill, Union Budget, and major policy announcements

Draft content states:

- `source_collected`
- `draft_generated`
- `needs_editor_review`
- `needs_partner_review`
- `approved`
- `scheduled`
- `published`
- `rejected`
- `archived`

Rules:

- No article should claim legal/tax advice without professional review.
- Every AI-assisted article must store source URLs and retrieval date.
- AI drafts must be visibly reviewed before publishing.
- Use citations/source notes internally for reviewers.
- Do not scrape or republish copyrighted text.
- Do not present generated examples as real client stories.
- Prefer official sources over news/media summaries for regulatory updates.
- Do not publish raw government updates without practical interpretation.
- Use "Prepared by Nucleus Editorial Desk; reviewed by [Partner]" when applicable.
- Do not attribute an opinion to a partner unless they approve it.

## Lead Capture Workflow

Every downloadable report, checklist, template, tool, newsletter signup, and consultation form should write into a central lead repository.

Minimum workflow:

1. Visitor submits a form with consent.
2. Backend creates or updates one lead profile by email.
3. Activity is recorded with source URL, service line, content asset, UTM data, lifecycle stage, and timestamp.
4. Newsletter subscription is created only when consent is present.
5. Lead is tagged by service interest, lifecycle stage, and content topic.
6. Internal team can qualify, assign, add notes, and follow up.
7. Unsubscribe and consent history must be respected.

See `docs/content-master.md` for lead status pipeline, lead scoring, fields, service tags, and service-specific lead magnets.

## Careers Workflow

Careers should be managed from the backend editor so HR can publish roles, review applications, manage candidate stages, and keep alumni/culture content fresh.

Minimum workflow:

1. HR creates or updates a job post with role, department, location, qualification, experience, responsibilities, learning exposure, SEO metadata, and status.
2. Candidate applies through the website or joins the talent community.
3. Backend creates or updates one candidate profile by email.
4. Candidate application is linked to a job post, office, role interest, qualification, and source page.
5. HR can move the application through screening, interview, assignment, selected, offered, joined, rejected, or on-hold states.
6. Interview notes, ratings, and feedback are internal-only.
7. Candidate consent for future role updates is stored separately from client lead consent.
8. Alumni and Life at Nucleus media require consent and publication status before appearing publicly.

Candidate-facing content types:

- CA articleship page
- job posts
- Life at Nucleus albums
- alumni stories
- candidate knowledge bank articles
- career guides and downloadable preparation resources

See `docs/content-master.md` for the careers page structure, alumni hero wall, candidate lead magnets, candidate status pipeline, and HR-managed job post model.

## M&A Partner Deal Room Workflow

Phase 3 should include a controlled deal room for the M&A team and approved external partners.

Minimum workflow:

1. Internal M&A team creates a deal opportunity as draft.
2. Deal is reviewed internally before going live.
3. Deal owner assigns allowed partner groups or individual access grants.
4. External partner logs in and sees only permitted deals.
5. Teaser can be visible first; CIM/data room documents require NDA or explicit approval.
6. Partner can express interest, ask questions, request documents, or decline.
7. Internal team tracks activity, document downloads, Q&A, follow-ups, and deal status.
8. All views, downloads, access changes, NDA actions, and status changes are audit logged.

Rules:

- No public indexing.
- No external access without login.
- No sensitive documents without NDA/approval.
- External partners cannot see internal notes or unrelated deals.
- Revoked access must take effect immediately.
- Archived/closed deals should not remain visible unless intentionally retained.

Rules:

- No article should claim legal/tax advice without professional review.
- Every AI-assisted article must store source URLs.
- AI drafts must be visibly reviewed before publishing.
- Use citations/source notes internally for reviewers.
- Do not scrape or republish copyrighted text.
- Do not present generated examples as real client stories.

## Website-to-LinkedIn Distribution Workflow

The website should be the canonical SEO repository. Approved website content can then be distributed to LinkedIn for reach, engagement, hiring, and brand recall.

Preferred implementation:

1. Editor publishes or schedules website content: article, report, job post, career story, alumni profile, tool, or newsletter issue.
2. CMS creates a draft LinkedIn distribution post with hook, short summary, CTA, hashtags, media, and canonical website URL.
3. Reviewer approves the LinkedIn copy.
4. In phase 1, HR/marketing manually posts the approved copy on LinkedIn.
5. LinkedIn post URL is pasted back into CMS and saved against the source content.
6. Later, if LinkedIn API approvals are available, approved posts can be scheduled/published through the API.

Optional RSS direction:

- The website can expose RSS feeds for articles, jobs, newsletters, or careers content.
- LinkedIn can use an organization's RSS feed to help share website content to the Page.
- This is website-to-LinkedIn, not LinkedIn-to-website.

Rules:

- Do not rely on fragile scraping of LinkedIn pages.
- Keep website content canonical and SEO-friendly.
- Do not auto-post every website update to LinkedIn.
- Legal/tax/compliance posts require review before social distribution.
- Hiring posts should link to website job posts and candidate capture.
- Culture posts should link to Life at Nucleus or approved albums/stories.
- Lead magnet posts should link to gated website landing pages.

## Build Implications

Do not hardcode final website content directly into React components once the backend phase begins. Build components as renderers for structured CMS content.

Recommended path:

1. Phase 1 can ship static content quickly.
2. Phase 1.5 adds CMS schema and admin editor shell.
3. Migrate static page content into Supabase-backed CMS tables.
4. Add article editor and review workflow.
5. Add AI draft generator behind admin login.
6. Add newsletter and lead-magnet workflows.
7. Add public calculators/tools.

Verification requirements:

- Browser tests must prove public pages render from CMS data once CMS is active.
- Editor tests must prove draft, review, publish, unpublish, and scheduled states.
- AI tests must prove generated content is draft-only until reviewed.
- Lead capture tests must prove submissions are stored/routed and consent copy is visible.
