# Evo Tech Internship — AI Engineering Work

The professional work. Production systems with real constraints: cost, latency, reliability, partial failure. This is where "I think in systems" becomes observable.

**Role:** AI Engineer Intern at Evo Tech Software Solutions (Sept 2025 – present)

**Primary deliverable:** Amazon Listing Analyzer API — a FastAPI platform for AI-powered analysis, optimization, and content generation for Amazon product listings.

**Scale:** 2,000+ lines of core application code, 20+ endpoints, vector database, video generation pipeline, RAG system.

---

## The Core System: Amazon Listing Analyzer API

### What it solves
Amazon sellers need to optimize listings fast — images, titles, descriptions, bullet points, SEO, competitor analysis. Manual review is slow and subjective. This system automates analysis with structured AI recommendations across every dimension of a listing.

### Endpoint map (5 domains, 16+ endpoints)

| Domain | Endpoints | What it does |
|---|---|---|
| Image Analysis | `/analyze_images`, `/compare_images` | Map-reduce concurrent image evaluation |
| Text Analysis | `/analyze_title`, `/analyze_description`, `/analyze_seo`, `/analyze_bullet_points`, `/analyze_reviews`, `/analyze_competitor`, `/analyze_conversion_strategy` | Structured optimization recommendations per component |
| Video Generation | `/generate_promotion_script`, `/generate_video` | Script-to-video pipeline with Sora 2 (15–60s) |
| Semantic Search | `/upsert_data`, `/search_data`, `/retrieve_data`, `/delete_data` | Qdrant + MySQL hybrid vector operations |
| Chat + RAG | `/generate_chat_completions` | Chat completions grounded in listing data |

---

## Architecture Deep Cuts

### Image Analysis — Map-Reduce Pattern

**Problem:** Analyzing 5 product images sequentially takes 240s+. A single hung Vision API call blocks everything.

**Solution:** Concurrent map phase + strategic reduce synthesis.

```
Request (up to 5 images)
    ↓
[Map Phase] — 5 parallel Vision API calls, 30s timeout each, 2 retries
    ├── Image 1: compliance + main image analysis (combined)
    ├── Images 2–5: individual analysis
    └── Failed image → fallback object, "Analysis unavailable" (not a crash)
    ↓
[Reduce Phase] — 3 parallel synthesis calls
    ├── Combined synthesis + 9-image rule check
    ├── Thumbnail analysis (preprocessed Image 1)
    └── Main image analysis (full resolution Image 1)
    ↓
[Cache] — 1hr TTL, MD5 key: ASIN:title:images
    ↓
Response
```

**Result:** 90–120s for 5-image analysis. Sequential would be 240s+. Cache hit: <1ms + 100% token savings.

**The design decision:** Temperature 0.3 throughout — consistency over creativity. Analysis, not imagination.

---

### Vector Database — Qdrant + MySQL Hybrid

**Problem:** Qdrant is fast but expensive at scale. MySQL is cheap but can't do semantic search.

**Solution:** Dual-storage. Qdrant holds embeddings with ASIN-only payloads (~100 bytes/vector). MySQL holds all metadata. Vector search returns ASINs → MySQL fetches the rest.

```
Search query → Qdrant (HNSW, <100ms) → list of ASINs
            → MySQL (5–20ms per 5 ASINs) → enriched full records
```

**Why ASIN-only payloads matter:** 100k listings = ~10MB in Qdrant (vs 500MB+ with full metadata). 50x storage reduction with no meaningful latency cost.

**Key implementation detail:** Point IDs are `hash(asin)` — deterministic. This enables ASIN-based deletion and retrieval across server restarts without a lookup table.

---

### RAG Pipeline — Three Waves of Refinement

**Goal:** Ground chat completions in semantically relevant Amazon listings and reviews.

The RAG pipeline evolved across three engineering waves:

**Wave 1 (Feb 4):** Foundation
- Review intent detection — 26 keywords gate review API calls (~60% reduction in unnecessary calls)
- Simple synthesis fallback when clustering fails

**Wave 2 (Feb 6):** Optimization
- ASIN extraction from user queries (regex: `B[0-9A-Z]{9}`) + injection into system prompt
- `RAG_TOP_N_LISTINGS` raised 5 → 25 (5x richer context, same latency)
- Synthesis prompts refactored to agent-facing structured output (removed conversational phrases)

**Wave 3 (Feb 10):** Stability
- Per-request RAG activation — removed global `RAG_ENABLED` toggle entirely
- Search query anchoring — short follow-up messages ("which one?", "show more") reuse the most semantically rich prior message for vector search
- Partial mode now injects real listing blocks, not count strings
- Removed dead config variable `VECTOR_SIMILARITY_THRESHOLD`

**Search query anchoring (Wave 3) — the clever bit:**
```python
# Short messages (<10 words) anchor to longest prior user message
search_query = (
    max(prior_user_msgs, key=lambda m: len(m.split()))
    if len(user_query.split()) < 10 and prior_user_msgs
    else user_query
)
```
"Which one?" has no semantic meaning for Qdrant. The system reuses the question that actually contains intent.

---

### Video Generation — Sora 2 Pipeline

**What it does:** Takes a product + duration (15–60s) → generates script → generates video scenes → merges → uploads to S3.

```
Request (product metadata + duration)
    ↓
[Script Generation] — GPT generates scenes count, character name (UGC), voice
    ↓
[Scene Generation] — Kie.ai Sora 2 API (one 15s clip per scene)
    ├── 30s → 2 scenes sequential
    ├── 45s → 3 scenes
    └── 60s → 4 scenes
    ↓
[Context-Aware Model Selection]
    ├── 720p + UGC + persistent character → Sora 2 Pro
    ├── 720p other → Standard Sora 2
    └── 1080p → Always Sora 2 Pro
    ↓
[Scene Merge] — FFmpeg (if duration > 15s)
    ↓
[S3 Upload] → permanent CDN URL
    ↓
Response with timing breakdown (9 timestamp capture points)
```

**Three-layer timeout architecture:**
- Layer 1 (Server): uvicorn `REQUEST_TIMEOUT_SECONDS` = 900s safety net
- Layer 2 (Endpoint): `TIMEOUT_GENERATE_SCRIPT` = 300s
- Layer 3 (Client): configurable per-request timeout (0 = wait forever)

**Graceful degradation:** If scene 3 times out but scenes 1–2 are done, returns 206 Partial Content with completed scenes + timing breakdown. Partial result is better than error.

---

### Lifestyle Image Generation — Two-Phase Efficiency

**Problem:** Generating N lifestyle images the naive way means N separate Vision API calls to analyze the product. Expensive and slow.

**Solution:** One Vision call generates N distinct scenario prompts. N parallel Kie.ai image generation tasks consume those prompts.

```
Phase 1 (once): Product images → OpenAI Vision → N distinct prompts
Phase 2 (parallel): N prompts → N Kie.ai tasks (5s poll intervals) → N images
```

Phase 1 failure is fatal (no prompts = no images). Phase 2 failures are per-image — captured individually, partial results returned.

---

## Engineering Decisions — The Reasoning Layer

| Decision | Why |
|---|---|
| Map-reduce for images | Parallelization cuts 240s → 90-120s; individual timeouts prevent cascades |
| Qdrant ASIN-only payloads | 50x storage reduction; <120ms total search still achievable |
| Per-request RAG activation | No server restart for A/B testing; cleaner configuration |
| Search query anchoring | Short follow-ups have no semantic meaning; reuse context that does |
| 206 Partial Content on timeout | User gets 3/4 scenes + diagnostics vs a 500 error |
| Context-aware model selection | Removes cognitive load from client; system picks optimal |
| gpt-4o-mini for most operations | Fast and cheap; save gpt-4 for where reasoning quality matters |
| Temperature 0.3 for analysis, 0.6 for scripts | Consistency for structured output; flexibility for creative content |

---

## What This Reveals

Jay is not building features. He is designing systems with failure domains.

Every component has an independent failure mode. No single failure blocks everything else. This is observable in the code: `asyncio.gather(..., return_exceptions=True)` everywhere, fallback objects on every image failure, 206 status codes for partial success, timing instrumentation at 9 points so operators know *where* time went.

The iterative wave model (Wave 1 → 2 → 3) is also characteristic — each wave solves a real problem that emerged from the previous version, not a hypothetical future requirement. Review intent detection came from observing that most chat queries don't ask about reviews. Query anchoring came from observing that multi-turn conversations drift semantically. Configuration cleanup came from finding dead variables.

This is how he actually works: build → observe → refine on real friction, not imagined cases.
