# Bring-your-own-LLM integration — release boundary

## Available now (development branch)
- `lab.html` loads `js/ai-explanation-bridge.js` and displays **Ask My AI Why**.
- User chooses lawn A or B and generates a structured prompt containing allowlisted numeric simulation snapshot fields.
- Missing numeric fields are omitted, **not converted to zero**.
- Shared change-report text is explicitly marked as potentially describing both lawns.
- Prompt identifies illustrative biological activity indices and lack of field validation.
- User reviews/copies prompt into their chosen AI. **Turfarium makes no AI-provider network requests and stores no API credentials.**
- The bridge does not modify simulation values.

## Not yet implemented
- In-app provider authentication, API calls, response streaming, chat history, billing controls, local-model endpoints, or provider-specific SDK adapters.
- Retrieval of verified scientific papers and citations.
- Automatic verification of model answers against the simulation.
- End-to-end browser testing and production release.

## Design for direct provider integrations
1. Add a provider-agnostic server API that accepts only a schema-validated, size-limited explanation request.
2. Use explicit user consent before transferring simulation data; allow inspection/redaction.
3. Keep API secrets server-side (or use user-owned local endpoints); never commit secrets or put provider API keys in browser code.
4. Require allowlisted origins, authentication, rate limits, budgets, request timeouts, and output sanitization.
5. Separate deterministic simulation calculations from generated narrative; no AI write access to state.
6. Preserve provenance, model identity, uncertainty, and a distinction between retrieved evidence and AI inference.
7. Test every provider adapter with the same fixtures; test privacy, failures, cost caps, and malformed output.

## Lightweight static/runtime checks performed
- AI bridge initializes with a mocked DOM.
- Null, undefined and blank snapshot values are omitted rather than emitted as zero.
- AI bridge contains no direct network request API.
- BASE registry evaluates to 88 entries, BASE64 resolves to PNG, and unreviewed states do not map to images.
- Image audit parses as JavaScript.

These are **five local JavaScript smoke checks**, not real browser or end-to-end tests. Draft PR #4 should remain unmerged.
