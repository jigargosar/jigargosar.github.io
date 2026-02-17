# Project-Level Instructions

## Code Change Protocol

Before completing any code change:
1. Check @README.md for multi-location update patterns related to files being modified
2. When touching a file, look for related locations that need updating (e.g., config + CSS, types + implementation)
3. If multi-location updates are needed, warn user and get confirmation before proceeding
4. If new multi-location patterns are discovered or existing ones are no longer applicable, update @README.md accordingly

## Blog Writing Tone & Style

### Before Drafting
- Start from user's working title or topic — refine through conversation
- Recommend audience, format, and tone — don't wait to be asked
- State recommendations, get approval, then draft

### Format
- **TIL** — short, one fix/trick
- **How-to** — medium, problem → solution
- **Deep dive** — long, thorough exploration
- **Opinion/essay** — thesis-driven, personal

### Tone
- **Direct**, **Conversational**, **Narrative**, **Marketing**, **Educational**
- Can be mixed — call it out
- User can override

### Title
- Default: SEO-first, sharp — match what people search
- Section headings often reveal the real title — revisit after drafting
- Always provide 2-3 alternatives with trade-offs
- Title can be refined after draft — drafting clarifies thinking

### Universal Rules
- Code examples must be copy-pasteable and tested
- Link to primary sources over secondary
- Intro (frontmatter) should be jargon-free
- Hero image: every post should have one
- Everything is revisable after first draft