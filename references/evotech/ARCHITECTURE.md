# Architecture Documentation: Amazon Listing Analyzer

**Last Updated**: 2026-02-10
**Documentation Format**: Grep-friendly service and endpoint architecture
**Scope**: Image Analysis, Video Generation, Input Validation, RAG Integration (Wave 1 & 2 & 3), and Vector Database

---

## Image Analysis (Map-Reduce Pattern for Concurrent Image Evaluation)

This cluster implements a **map-reduce pattern** for concurrent image analysis with graceful degradation on individual failures.

### Pattern Overview

```
Request (5 max images)
    ↓
[Map Phase] → Fetch images (aiohttp) → Validate existence
    ↓
[Individual Analysis] → Parallel analyze_single_image_with_retry (5 concurrent)
    ├─ Image 1: compliance + main_image_analysis (combined call)
    ├─ Image 2: individual analysis
    ├─ Image 3: individual analysis
    ├─ Image 4: individual analysis
    ├─ Image 5: individual analysis
    ├─ [failure] → fallback with "Analysis unavailable"
    ↓
[Reduce Phase] → Synthesize overall analysis (3 parallel calls):
    ├─ Combined synthesis + image stack analysis (1 call)
    ├─ Thumbnail analysis (preprocessed Image 1 as square)
    ├─ Main image analysis (original Image 1, full resolution)
    ↓
[Cache] → Store result (TTLCache 1hr)
    ↓
Response (ImageAnalysisResponse)
```

---

## Endpoint: /analyze_images

**Route**: `POST /ai/api/analyze_images`
**Response Model**: `ImageAnalysisResponse`
**Rate Limit**: 5 requests/minute per IP

### Purpose

Analyze Amazon listing images using map-reduce pattern. Returns individual image assessments plus strategic holistic recommendations synthesized from all images.

### Primary Flow

1. **Cache Check**: MD5 hash of (ASIN + title + image URLs) - 100% token savings on hit
2. **Image Fetching**: Parallel aiohttp requests for up to 5 images
3. **Validation**: Filter invalid/failed images, compute white background compliance baseline
4. **Preprocessing**: First image converted to thumbnail (square, white background)
5. **Map Phase**: Parallel analyze_single_image_with_retry for each image
6. **Error Handling**: Failed images → fallback objects with "Analysis unavailable"
7. **Reduce Phase**: Three parallel synthesis operations
8. **Caching**: Store result in TTLCache for identical requests

### Request Input

```python
class ListingInput(BaseModel):
    asin: str                      # Amazon product identifier
    title: str                     # Product title
    description: str               # Product description
    images: List[str]              # Image URLs (max 5 analyzed)
    brand: Optional[str] = None
    reviews: List[Review] = []
```

### Response Output

```python
class ImageAnalysisResponse(BaseModel):
    main_image_compliance: str
    image_variety_and_sequence: str
    lifestyle_images: str
    infographics_and_callouts: str
    size_and_scale_representation: str
    emotional_appeal_and_storytelling: str
    competitor_benchmarking: str
    actionable_recommendations: str
    thumbnail_analysis: str          # NEW: Preprocessed main image
    main_image_analysis: str         # NEW: Original main image (full res)
    image_stack_analysis: str        # NEW: 9-image rule & storytelling
    individual_images: List[dict]    # Individual image assessments
```

### Called By

- Client applications (direct REST API call)
- Internal: No internal endpoints call this

### Calls

- `fetch_image(url)` - aiohttp image download
- `check_white_background(img)` - PIL compliance check
- `encode_image_to_base64(img)` - Base64 conversion for OpenAI
- `preprocess_thumbnail(img)` - Square conversion (>20% aspect ratio threshold)
- `analyze_single_image_with_retry()` - Map phase (OpenAI Vision API)
- `synthesize_overall_analysis()` - Reduce phase (OpenAI API)
- OpenAI Vision API (gpt-4o-mini): 5 requests max (individual images)
- OpenAI API (gpt-4o-mini): 1 request (synthesis)
- TTLCache: 1-hour response caching

### Error Handling

**Image Fetch Failure**:
- Individual image fails to download → logged as error, fallback analysis returned
- All images fail → HTTP 500 "All images failed to fetch"
- Some images fail → analysis continues with valid images (graceful degradation)

**Analysis Timeout**:
- 30 seconds per image (asyncio.wait_for)
- Retries: 2 attempts on timeout
- After 2 retries → fallback with "Analysis unavailable"
- Logged as warning/error

**Synthesis Failure**:
- If synthesis fails → fallback dict with default messages
- Individual analyses still returned
- Endpoint returns 200 (partial data acceptable)

**Cache Behavior**:
- Cache key collision (same ASIN/title/images) → returns cached result
- Solves: Redundant API calls, token waste
- Risk: Stale data if images updated without title change

### Temperature Settings

- **Map Phase** (analyze_single_image): 0.3
  - Rationale: Balance consistency with creative interpretation
  - Need: Reliable compliance assessment without hallucination

- **Reduce Phase** (synthesize_overall_analysis): 0.3
  - Rationale: Consistency for synthesis (no temperature override in code)
  - Note: Synthesis kwargs explicitly exclude temperature for compatibility

### Data Structures

**Input**:
- `ListingInput`: Title, description, image URLs
- Images as PIL.Image objects (loaded from aiohttp)

**Intermediate**:
- Encoded images: Base64 strings for OpenAI Vision API
- Individual analyses: `List[IndividualImageAnalysis]`
- Thumbnail: Preprocessed PIL.Image (square, white background)

**Output**:
- `ImageAnalysisResponse`: All fields except `individual_images` are strings
- `individual_images`: List of dicts with 6 fields (image_number, image_url, compliance_status, strengths, weaknesses, specific_recommendations, main_image_analysis)

### Notes

- **Timeout Architecture**: Image fetches don't have explicit timeout, but individual analyses have 30s timeout per image
- **Concurrency**: Uses `asyncio.gather(*[...], return_exceptions=True)` for resilience
- **Cache Key**: MD5 hash of "ASIN:title:image1:image2:image3:image4:image5" (first 5 images only)
- **Image Limit**: Hardcoded to 5 images (`listing.images[:5]`), Amazon allows 9
- **Compliance Baseline**: White background check on all valid images (>80% white pixels)
- **Main Image**: Image 1 always receives dual analysis (individual + main image specific)
- **Thumbnail Preprocessing**: Smart aspect ratio detection - only pads if >20% difference from square
- **Cost**: ~1-2 Vision API calls per image ($0.01-0.02/image) + 1 synthesis call
- **Performance**: Target <120s for 5-image analysis (map ~60s, reduce ~20-30s, overhead ~20-30s)

---

## Service: Image Service (src/services/image_service.py)

**Purpose**: Low-level image operations - fetch, validate, encode, preprocess

**Primary Functions**:

- `fetch_image(url) → Optional[Image.Image]`: Async HTTP fetch with aiohttp, 200-status validation, returns PIL.Image or None on failure
- `check_white_background(img) → bool`: RGB pixel analysis, returns True if >80% white pixels (240+ per channel)
- `encode_image_to_base64(img) → str`: PIL JPEG export to BytesIO, base64.b64encode, returns string
- `calculate_aspect_ratio_difference(width, height) → float`: Percentage difference formula: `abs(w-h)/max(w,h)*100`
- `preprocess_thumbnail(img, force_padding=False) → Image.Image`: Smart square conversion with 20% threshold, returns PIL.Image (RGB, square, white-padded if needed)

**Called By**:
- `/analyze_images` endpoint (fetch, check_white_background, encode, preprocess)
- `/compare_images` endpoint (fetch, encode)
- `/generate_promotion_script` endpoint (fetch)
- `/fetch_images` endpoint (fetch)

**Calls**:
- aiohttp: Async HTTP requests
- PIL (Pillow): Image.open(), Image.new(), Image.convert(), Image.paste()
- base64: Standard library encoding

**Error Handling**:
- `fetch_image`: Catches all exceptions, logs to console (print), returns None (no raising)
- `check_white_background`: No error handling (assumes valid PIL.Image input)
- `encode_image_to_base64`: No error handling (assumes valid PIL.Image input)
- `preprocess_thumbnail`: No error handling (assumes valid PIL.Image input)

**Data Structures**:
- Input: URL strings, PIL.Image objects
- Output: PIL.Image objects, base64 strings, booleans

---

## Service: Image Analyzer (src/analyzers/image_analyzer.py)

**Purpose**: Individual image analysis (map phase) with timeout protection and retry logic

**Primary Functions**:

- `analyze_single_image(image_url, analysis_type='complete') → IndividualImageAnalysis`: Core Vision API call for single image
  - Parameters: image_url, analysis_type ('complete' = full analysis, 'quick' = fast track)
  - Calls: encode_image_to_base64(), OpenAI Vision API (gpt-4o-mini, temperature 0.3)
  - Returns: IndividualImageAnalysis dict with compliance_status, strengths, weaknesses, specific_recommendations
  - Error handling: Returns fallback object on error

- `analyze_single_image_with_retry(image_url, analysis_type='complete') → IndividualImageAnalysis`: Timeout + retry wrapper
  - Timeout: 30 seconds per attempt via asyncio.wait_for()
  - Retries: 2 attempts (on timeout or exception)
  - Sleep: 1 second between attempts
  - Returns: IndividualImageAnalysis or fallback object on failure

**Called By**:
- `/analyze_images` endpoint (map phase)
- Called in parallel for each image via asyncio.gather()

**Calls**:
- image_service.encode_image_to_base64()
- OpenAI Vision API (gpt-4o-mini)

**Error Handling**:
- Timeout: Caught via asyncio.TimeoutError, logged, retried
- Exception: Caught, logged, retried
- Final failure: Returns IndividualImageAnalysis with "Analysis unavailable"

**Timeout Behavior**:
- 30 second deadline per image (aggressive for user patience)
- Protects against hung OpenAI Vision API calls
- Fallback on timeout: User receives "Analysis unavailable" for that image
- Example: 5 images, 1 timeout → 4 successful analyses + 1 unavailable

**Data Structures**:
- Output: IndividualImageAnalysis with compliance_status, strengths, weaknesses, specific_recommendations

---

## Service: Image Synthesizer (src/synthesizers/image_synthesizer.py)

**Purpose**: Overall image analysis synthesis (reduce phase) - 3 parallel synthesis operations

**Primary Functions**:

- `synthesize_overall_analysis(individual_analyses, listing) → Dict`: Main synthesis combining all images
  - Input: List[IndividualImageAnalysis], ListingInput
  - Calls: 3 parallel OpenAI API calls via asyncio.gather()
  - Returns: Dict with combined_synthesis_result, image_stack_analysis, thumbnail_analysis, main_image_analysis
  - Timeout: Per OpenAI call (standard 60s or config-driven)

- `synthesize_combined_analysis(individual_analyses, listing) → str`: Synthesize all images + 9-image rule
  - Input: Individual analyses from map phase + listing metadata
  - Output: Strategy recommendations combining all images
  - Temperature: 0.3 (consistency)

- `synthesize_thumbnail_analysis(thumbnail_img, listing) → str`: Analyze preprocessed thumbnail
  - Input: Preprocessed PIL.Image (square), listing metadata
  - Output: Thumbnail-specific feedback (Amazon A+ format fit)
  - Temperature: 0.3

- `synthesize_main_image_analysis(original_img, listing) → str`: Analyze full main image
  - Input: Original PIL.Image (full resolution), listing metadata
  - Output: Main image depth analysis (details, compliance)
  - Temperature: 0.3

**Called By**:
- `/analyze_images` endpoint (reduce phase)

**Calls**:
- OpenAI API (gpt-4o-mini): 3 parallel calls
- image_analyzer for individual analyses

**Error Handling**:
- Individual synthesis call fails → Fallback text returned for that field
- All synthesize calls fail → All fields return fallback text
- Endpoint still returns 200 (partial data acceptable)

**Parallelization**:
- 3 calls executed in parallel via asyncio.gather()
- Reduces total reduce phase time from 60s to ~20-30s

**Data Structures**:
- Output: Dict with 4 string fields (combined, image_stack, thumbnail, main_image)

---

## Endpoint: /compare_images

**Route**: `POST /ai/api/compare_images`
**Rate Limit**: 5 requests/minute per IP

### Purpose

Compare images from two Amazon listings. Return structured competitive analysis with strengths/weaknesses comparison.

### Request Input

```python
class CompareImagesInput(BaseModel):
    listing1: ListingInput
    listing2: ListingInput
```

### Response Output

```python
class CompareImagesResponse(BaseModel):
    listing1_asin: str
    listing2_asin: str
    overall_winner: str            # "Listing 1" | "Listing 2" | "Tied"
    main_image_comparison: str
    image_variety_comparison: str
    emotional_appeal_comparison: str
    tactical_recommendations_for_listing1: str
    tactical_recommendations_for_listing2: str
```

### Called By

- Client applications (direct REST API call)

### Calls

- `/analyze_images` endpoint (analyze both listings)
- OpenAI API: 1 comparison call

### Error Handling

- If either analyze_images fails → HTTP 400 "Could not analyze both listings"
- If comparison synthesis fails → Returns 500

---

## Input Validation & Utilities

### Endpoint: /validate_input

**Route**: `POST /ai/api/validate_input`
**Purpose**: Validate input structure (ListingInput) before full analysis

**Rate Limit**: 20 requests/minute per IP

**Input**: Raw dict/JSON (not pre-validated)

**Validation Steps**:
1. Check required fields: asin, title, description, images
2. Validate URLs: Each image URL must be HTTP(S) and return 200
3. Validate image download: Fetch image, ensure it's valid format (JPEG/PNG)
4. Count images: Must have 1-5 images

**Response**:
```python
{
    "valid": bool,
    "errors": [str],  # Empty if valid
    "warnings": [str],  # Non-blocking warnings
    "images_validated": int,
    "fields_present": [str]
}
```

**Error Handling**:
- Missing required field → "missing_field_name"
- Invalid URL → "image_url_format_invalid"
- HTTP 404/500 → "image_url_returns_error"
- Invalid image format → "image_format_invalid"
- Returns 400 on validation errors

### Endpoint: /fetch_images

**Route**: `POST /ai/api/fetch_images`
**Purpose**: Utility endpoint for downloading/encoding images to base64

**Rate Limit**: 10 requests/minute per IP

**Input**:
```python
{
    "image_urls": [str]
}
```

**Response**:
```python
{
    "images": [
        {
            "url": str,
            "base64": str,
            "format": "jpeg" | "png",
            "success": bool
        }
    ]
}
```

---

## RAG Integration Architecture (Retrieval-Augmented Generation)

### Overview

RAG enables chat completions to be grounded in semantically similar Amazon listings and reviews. The system uses a nine-layer pipeline with graceful degradation and review intent conditioning:

1. **Layer 0**: Review Intent Detection (condition review fetching on query keywords)
2. **Layer 1**: ASIN Parsing & Explicit Listing Retrieval (extract mentions from user message)
3. **Layer 2**: Vector Search with Debug Capture (semantic similarity search)
4. **Layer 3**: MySQL Data Enrichment (fetch full metadata for found ASINs)
5. **Layer 4**: Explicit Listing Merge (deduplicate, include mentioned products, inject into system prompt if ≤5)
6. **Layer 5**: Integration Mode Dispatch (choose between full or partial synthesis)
7. **Layer 6**: Timeout Handling (graceful degradation on operation timeout)
8. **Layer 7**: Response Injection (format RAG context and prepend to system prompt)

### Configuration

```python
# RAG Feature Flags & Parameters (from config.py)
# NOTE: RAG is now activated SOLELY by presence of rag_config in endpoint payload
# There is no global RAG_ENABLED toggle in config.py (removed in Wave 3)
RAG_SIMILARITY_THRESHOLD: float = 0.3       # Vector search similarity cutoff (0.0-1.0)
RAG_TOP_N_LISTINGS: int = 25                # Max listings to retrieve per search (increased from 5 in Wave 2)
RAG_MIN_CLUSTERS: int = 3                   # Minimum clusters to trigger full synthesis
TIMEOUT_RAG_RETRIEVAL: int = 30             # Vector search timeout (seconds)
TIMEOUT_RAG_SYNTHESIS: int = 60             # Synthesis timeout (seconds)
TIMEOUT_CHAT_COMPLETIONS: int = 120        # Total endpoint timeout (seconds)
```

**Wave 2 Configuration Changes**:
- `RAG_TOP_N_LISTINGS`: Increased from 5 to 25 for richer synthesis context (5x data, same latency via improved MySQL pooling)

**Wave 3 Configuration Changes** (2026-02-10):
- `RAG_ENABLED`: Removed from config.py (global toggle eliminated)
- RAG now activated **per-request** via `rag_config` field in endpoint payload (client controls RAG on/off, no server restart needed)

### Layer 0: Review Intent Detection (NEW - Wave 1 & 2)

**Purpose**: Gate review fetching based on user query intent. Reduces review API calls ~60% when users don't ask about reviews.

**Implementation**:
- Utility: `src/utils/review_intent.py` - `infer_review_intent(query) → bool`
- Keywords: `prompts/rag/review_keywords.txt` (26 keywords)
- Logic: Substring matching of lowercased keywords in user query
- Fallback: Returns `True` if file missing or error (graceful degradation)

**Keyword List** (26 keywords):
```
review, feedback, complaint, quality, reliable, reliability, durability, should i buy,
is it good, customer says, 5-star, 1-star, rating, experience, opinion, what do customers,
people say, user review, helpful, disappointed, satisfied, issues, problems, pros and cons,
worth it, recommend
```

**Integration Points** (main.py):
- Line 1466: `review_intent = infer_review_intent(user_query)` (full mode)
- Line 1517: `review_intent = infer_review_intent(user_query)` (simple synthesis fallback)
- Line 1535: `review_intent = infer_review_intent(user_query)` (partial mode)
- Used to conditionally fetch: `reviews = await fetch_review_context(...) if review_intent else []`

**Impact**: Review fetch calls reduced ~60% without sacrificing quality (reviews only fetched when relevant)

### Endpoint: /generate_chat_completions (Modified)

**Route**: `POST /ai/api/generate_chat_completions`
**Rate Limit**: 15 requests/minute per IP
**Scope**: Previously ~50 lines, now ~283 lines with RAG integration

### Request Input (New Fields)

```python
class ChatCompletionRequest(BaseModel):
    messages: List[Dict[str, str]]           # Conversation history
    image_urls: Optional[List[str]] = None   # Multi-modal images
    streaming: Optional[bool] = False        # SSE streaming support
    rag_config: Optional[RAGConfig] = None   # NEW: RAG settings
    debug: Optional[bool] = False            # NEW: Debug mode (RAG)

class RAGConfig(BaseModel):
    integration_mode: str = "full"           # "full" or "partial"
```

### Response Output (New Fields)

```python
class ChatCompletionResponse(BaseModel):
    message: str                             # LLM response
    tokens_used: int
    model: str
    timestamp: str
    request_id: str
    rag_metadata: Optional[Dict] = None      # NEW: RAG trace data
    debug_top_listings: Optional[List] = None # NEW: Top 10 vector results (if RAG enabled)
```

### Phase 1: Image Processing (main.py:1300-1324)

**Purpose**: Support multi-modal chat by fetching and encoding images.

**Implementation**:
```python
if input_data.image_urls and len(input_data.image_urls) > 0:
    images = []
    for url in input_data.image_urls:
        img = await fetch_image(url)
        b64 = encode_image_to_base64(img)
        images.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
        })

    # Convert last user message to multi-part content
    messages[i]["content"] = [
        {"type": "text", "text": text_content},
        *images
    ]
```

**Error Handling**: Warnings logged for individual image failures; non-blocking (partial images acceptable).

### Phase 2: System Prompt Loading (main.py:1326-1333)

**Purpose**: Load RAG-aware or RAG-free system prompts based on request configuration.

**Logic**:
```python
if input_data.rag_config:
    system_prompt = PromptManager.load('chat_system_prompt_with_rag')
else:
    system_prompt = PromptManager.load('chat_system_prompt_no_rag')

if system_prompt and system_prompt.strip():
    messages.insert(0, {"role": "system", "content": system_prompt})
```

**Key Insight**: RAG is enabled **per-request** via `input_data.rag_config`, not globally. This allows clients to toggle RAG on/off without server restart.

### Phase 3: RAG Integration (main.py:1335-1541)

**Enabled By**: `if input_data.rag_config:` (Line 1340)

#### Layer 1: ASIN Parsing & Explicit Listing Retrieval (Lines 1342-1350)

**Purpose**: Extract explicitly mentioned ASINs from user message and fetch their full records.

```python
mentioned_asins = extract_asins(user_query)  # Parse user message for ASIN patterns
if mentioned_asins:
    explicit_listings = await fetch_explicit_listings(mentioned_asins)
```

**Fallback**: If no ASINs mentioned, `explicit_listings = []` (continues gracefully).

#### Layer 2: Vector Search with Debug Capture & Query Anchoring (Lines 1352-1376, MODIFIED - Wave 3)

**Purpose**: Search for semantically similar listings, with debug mode override. Anchor short/follow-up queries to the most semantically rich prior message.

**Search Query Anchoring** (NEW - Wave 3):
```python
# Extract current message and prior messages
user_query = input_data.messages[-1].content if input_data.messages else ""
_prior_user_msgs = [msg.content for msg in input_data.messages[:-1] if msg.role == "user" and isinstance(msg.content, str)]

# Anchor short messages (<10 words) to the longest prior user message
# Prevents semantic drift from conversational turns like "Yes", "Proceed", "Show those 2"
search_query = (
    max(_prior_user_msgs, key=lambda m: len(m.split()))
    if len(user_query.split()) < 10 and _prior_user_msgs
    else user_query
)
```

**Implementation**:
- `user_query`: Used for ASIN extraction and intent detection (conversational flow)
- `search_query`: Used for vector search only (semantic anchor)
- Guard: `isinstance(msg.content, str)` prevents multimodal messages (content as list) from breaking anchor logic
- Rationale: Follow-up messages like "which one?" or "show more" lack semantic context; reuse the most substantive prior message for search

**Vector Search Execution**:
```python
# Capture top 10 for troubleshooting (regardless of threshold)
debug_top_listings = await search_similar_debug(search_query, top_n=10)

# If debug mode: bypass threshold, use top-N from config
if input_data.debug:
    listings = debug_top_listings[:RAG_TOP_N_LISTINGS]
else:
    listings = await fetch_listing_context(search_query, RAG_SIMILARITY_THRESHOLD, RAG_TOP_N_LISTINGS)
```

**Parameters**:
- `RAG_SIMILARITY_THRESHOLD`: Default 0.3 (permissive, 30% semantic match required)
- `RAG_TOP_N_LISTINGS`: Max results to return (from config)
- `input_data.debug`: If true, bypass threshold filtering (uses top-N regardless)

**Bypassing Threshold** (Two Methods):
1. **Config-level**: Set `RAG_SIMILARITY_THRESHOLD=0.0` in `.env` (affects all requests)
2. **Per-request**: Pass `"debug": true` in payload (client-controlled override)

#### Layer 3: MySQL Data Enrichment (Lines 1364-1398)

**Purpose**: Enrich vector search results with full MySQL records.

```python
asin_list = [l.get("asin") for l in listings]

# Fetch full records from MySQL
mysql_listings = await fetch_listings_by_asins(asin_list)
mysql_reviews = await fetch_reviews_by_asins(asin_list, limit_per_asin=10)

# Merge MySQL data into vector results
mysql_lookup = {listing.get("asin"): listing for listing in mysql_listings}
for i, listing in enumerate(listings):
    if listing.get("asin") in mysql_lookup:
        listings[i] = {**listing, **mysql_lookup[asin]}
```

**Fallback**: If MySQL fetch fails, continues with vector-only results (logged as warning).

**Data Flow**:
```
Vector Search Results → MySQL Lookup → Enriched Listings
```

#### Layer 1 (Updated): ASIN Parsing & System Prompt Injection (MODIFIED - Wave 2)

**Purpose**: Extract explicitly mentioned ASINs and inject into system prompt for product prioritization.

**Process**:
1. Extract explicitly mentioned ASINs: `extract_asins(user_query)` (regex: B[0-9A-Z]{9})
2. Fetch full records: `fetch_explicit_listings(mentioned_asins)`
3. Store for injection: If len(mentioned_asins) ≤ 5, save for system prompt
4. Merge with deduplication: Add explicit listings not found in vector search
5. Inject into system prompt: Prepend "USER-MENTIONED PRODUCTS: {asins}" **before** RAG context

**Code Example** (main.py lines 1342-1410):
```python
# Extract ASINs from user query
mentioned_asins = extract_asins(user_query)
explicit_listings = []
explicit_asins_for_injection = mentioned_asins if len(mentioned_asins) <= 5 else []

if mentioned_asins:
    explicit_listings = await fetch_explicit_listings(mentioned_asins)

# Later: merge with vector results (dedup by ASIN)
if explicit_listings:
    existing_asins = {l.get("asin") for l in listings}
    for explicit_listing in explicit_listings:
        if explicit_listing.get("asin") not in existing_asins:
            listings.append(explicit_listing)

# Inject into system prompt (later, after RAG retrieval)
if explicit_asins_for_injection:
    asins_str = ", ".join(explicit_asins_for_injection)
    asins_context = f"USER-MENTIONED PRODUCTS: {asins_str}\n\n"
    rag_context_text = asins_context + rag_context_text
```

**Impact**: Chat model prioritizes user-referenced products in analysis, even if semantic search finds more similar products.

**Modified Prompt**: `prompts/miscellaneous/chat_system_prompt_with_rag.txt` includes instruction to prioritize user-mentioned products.

#### Layer 4: Explicit Listing Merge (Original)

#### Layer 5: Integration Mode Dispatch (Lines 1408-1526)

**Purpose**: Choose synthesis strategy based on `input_data.rag_config.integration_mode`.

**Two Modes**:

##### Full Mode (Lines 1408-1510)

**Trigger**: `integration_mode == "full"`

**Process**:

1. **Generate embeddings** (Lines 1413-1417):
   ```python
   embeddings = await asyncio.gather(*[
       generate_embedding(f"{l.get('title', '')} {l.get('description', '')}")
       for l in listings
   ])
   ```

2. **Cluster embeddings** (Line 1420):
   ```python
   cluster_labels, cluster_count = cluster_vectors(embeddings, RAG_MIN_CLUSTERS)
   ```

3. **Decide if reduce phases should run** (Line 1424):
   ```python
   should_run_reduce = (input_data.debug and cluster_count >= 1) or (cluster_count >= RAG_MIN_CLUSTERS)
   ```
   - Debug mode: Run if ANY clusters exist (cluster_count >= 1)
   - Normal mode: Run only if minimum threshold met (cluster_count >= RAG_MIN_CLUSTERS)

4. **FIRST REDUCE PHASE: Theme Synthesis** (Lines 1436-1451):
   ```python
   try:
       themes = await asyncio.wait_for(
           synthesize_themes(clusters, user_query),
           timeout=TIMEOUT_RAG_SYNTHESIS
       )
   except asyncio.TimeoutError:
       themes = {i: f"Cluster {i}" for i in range(cluster_count)}  # Fallback
   ```
   - Input: Clustered listings + user query
   - Output: Theme dict {cluster_id: theme_description}
   - Timeout: Returns fallback generic theme names
   - Purpose: Identify conceptual themes in product clusters

5. **Fetch Reviews** (Lines 1453-1458):
   ```python
   reviews = await fetch_review_context(asin_list, user_query)
   ```
   - Retrieves semantically relevant reviews for clustered ASINs
   - Graceful fallback: empty list on error

6. **SECOND REDUCE PHASE: Context Synthesis** (Lines 1460-1475):
   ```python
   try:
       synthesis = await asyncio.wait_for(
           synthesize_context(themes, listings, reviews, user_query),
           timeout=TIMEOUT_RAG_SYNTHESIS
       )
   except asyncio.TimeoutError:
       synthesis = f"Found {len(listings)} relevant products..."  # Fallback
   ```
   - Input: Themes + listings + reviews + user query
   - Output: Prose description of market context
   - Purpose: Generate narrative synthesis for system prompt injection

7. **Format and Inject** (Lines 1477-1492):
   ```python
   rag_context_text = format_for_system_prompt(synthesis, len(listings), len(reviews))
   messages[0]["content"] = rag_context_text + "\n" + messages[0]["content"]
   rag_metadata = {
       "status": "full",
       "cluster_count": cluster_count,
       "synthesis_phases": synthesis_phases,
       "themes": themes,
       ...
   }
   ```
   - Prepends formatted context to system prompt
   - Tracks synthesis phase status (success/timeout/failed)

**Stability Status**: **WIP (Work In Progress)** (Wave 3)
- Clustering + multi-phase synthesis pipeline exists but has known latency and clustering threshold issues
- Not recommended for production use yet
- Use `integration_mode="partial"` for stable, shippable RAG (Wave 3)

**Graceful Degradation - Full Mode Fallback** (Lines 1514-1530, NEW - Wave 1 & 2):
```python
else:
    # If clustering insufficient, use simple synthesis path (new fallback)
    logger.info(f"Full mode clustering insufficient ({cluster_count}), using simple synthesis path")
    review_intent = infer_review_intent(user_query)
    reviews = await fetch_review_context(asin_list, user_query) if review_intent else []
    synthesis = await synthesize_simple_context(listings, reviews, user_query)
    rag_context_text = format_for_system_prompt(synthesis, len(listings), len(reviews))

    rag_metadata = {
        "status": "full_insufficient_clusters",
        "listings_count": len(listings),
        "reviews_count": len(reviews),
        "synthesis_strategy": "simple_synthesis",
        "message": synthesis,
        "reason": f"Clustering found {cluster_count} clusters, minimum {RAG_MIN_CLUSTERS} required"
    }
```

### Simple Synthesis Path (NEW - Wave 1)

**Purpose**: Synthesize meaningful context when clustering insufficient (cluster_count < RAG_MIN_CLUSTERS).

**Implementation**:
- Function: `synthesize_simple_context()` in `src/synthesizers/rag_synthesizer.py`
- Prompt: `prompts/rag/rag_simple_synthesis_prompt.txt` (agent-facing)
- Triggered: When `cluster_count < RAG_MIN_CLUSTERS` in full mode
- Process: Call LLM with top-25 listings + (reviews if review_intent=True)
- Timeout: TIMEOUT_RAG_SYNTHESIS (60s)
- Fallback: Simple string on timeout/error
- Impact: Better output vs empty fallback

**Output Format**: Structured 6-point analysis (MARKET_SYNTHESIS: format)
- Problems solved by products
- Key differentiation across listings
- Market gaps identified
- Buyer consensus themes
- Feature pattern analysis
- Market positioning insights

##### Partial Mode (Lines 1511-1526, MODIFIED - Wave 3)

**Trigger**: `integration_mode == "partial"`

**Process** (NEW - Wave 3: Actual listing blocks instead of count-only):
```python
# Fetch reviews conditionally based on intent
review_intent = infer_review_intent(user_query)
reviews = await fetch_review_context(asin_list, user_query) if review_intent else []

# Build actual listing blocks (guard against unenriched data)
listing_blocks = []
for listing in listings:
    title = listing.get('title')
    if title and title != 'N/A':  # Skip unenriched stubs (titles from MySQL are real)
        block = (
            f"ASIN: {listing.get('asin', 'N/A')}\n"
            f"Title: {title}\n"
            f"Brand: {listing.get('brand', 'N/A')}\n"
            f"Price: {listing.get('price', 'N/A')}\n"
            f"Rating: {listing.get('rating', 'N/A')}\n"
            f"Review Count: {listing.get('review_count', 'N/A')}\n"
            f"Description: {listing.get('description', 'N/A')}"
        )
        listing_blocks.append(block)

# Build review blocks (only include non-empty comments)
review_blocks = []
for r in reviews:
    comment = r.get('comment', '').strip()
    if comment:
        review_blocks.append(f"[Rating: {r.get('rating', 'N/A')}★] {comment}")

# Synthesize context with actual data (not just counts)
synthesis_parts = listing_blocks
if review_blocks:
    synthesis_parts = listing_blocks + ["REVIEWS:"] + review_blocks

synthesis = "\n\n".join(synthesis_parts) if synthesis_parts else f"No data found for {asin_list}"
rag_context_text = format_for_system_prompt(synthesis, len(listing_blocks), len(review_blocks))

messages[0]["content"] = rag_context_text + "\n" + messages[0]["content"]
rag_metadata = {
    "status": "partial",
    "listings_count": len(listing_blocks),  # Reflects actual blocks injected
    "reviews_count": len(review_blocks),    # Reflects actual reviews injected
    "synthesis_strategy": "threshold_top_n"
}
```

**Purpose**: Simple threshold + top-N with actual listing/review blocks, no clustering/synthesis overhead. Fast path for clients who want RAG without synthesis latency.

**Guard Against Unenriched Data**:
- Listings without real titles (None or "N/A") are skipped (prevents MySQL-unenriched stubs from polluting context)
- Reviews with empty comments are skipped
- Count fields in `rag_metadata` reflect actual injected data (not raw result counts)

**Stability Status**: **Stable and shippable** (Wave 3)

#### Layer 6: Timeout Handling (Lines 1528-1541)

**Purpose**: Catch RAG operation timeouts and decide response strategy.

```python
except asyncio.TimeoutError:
    logger.warning("RAG integration timed out")
    if not input_data.rag_config or input_data.rag_config.integration_mode == "partial":
        rag_metadata = {"status": "timeout_graceful", ...}
        # Continue with chat completion (graceful degrade)
    else:
        # Full mode: return 206 Partial Content
        return JSONResponse(status_code=206, content={
            "message": "RAG integration timed out",
            "error": "Request partially completed without RAG context",
            "rag_metadata": rag_metadata
        })
```

**Strategy**:
- Partial mode on timeout: Continue chat without RAG (graceful degradation)
- Full mode on timeout: Return 206 Partial Content (client knows RAG incomplete)

### Phase 4: Response Handling (Lines 1543-1576)

**Purpose**: Support both streaming and non-streaming responses, with RAG metadata.

#### Streaming Response (Lines 1544-1560)

**Enabled By**: `if input_data.streaming:`

```python
stream = client.chat.completions.create(
    model="gpt-5-nano",
    messages=messages,
    stream=True
)

async def event_generator():
    for chunk in stream:
        yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"

return StreamingResponse(event_generator(), media_type="text/event-stream")
```

**Format**: Server-Sent Events (SSE) with JSON payloads.

#### Non-Streaming Response (Lines 1561-1576)

```python
response = client.chat.completions.create(
    model="gpt-5-nano",
    messages=messages
)

return ChatCompletionResponse(
    message=response.choices[0].message.content,
    tokens_used=response.usage.total_tokens,
    model=response.model,
    timestamp=datetime.now().isoformat(),
    request_id=str(uuid.uuid4()),
    rag_metadata=rag_metadata,
    debug_top_listings=debug_top_listings if input_data.rag_config else None
)
```

**New Fields**:
- `rag_metadata`: Tracking object with status, counts, phases, synthesis details
- `debug_top_listings`: Top 10 vector search results (if RAG enabled), for troubleshooting

### System Prompts (REFACTORED - Wave 1 & 2)

Three system prompts and three synthesis prompts enable RAG-aware behavior:

**System Prompts** (loaded based on rag_config):
- `prompts/miscellaneous/chat_system_prompt_with_rag.txt` - Loaded when rag_config provided
  - Includes ASIN prioritization instruction (Wave 2)
  - NEW (Wave 3): Added directive "When listings are present in your context, present them directly and immediately — do not ask the user for confirmation before showing data you already have."
- `prompts/miscellaneous/chat_system_prompt_no_rag.txt` - Loaded when rag_config absent (general-purpose chat)

**Synthesis Prompts** (REFACTORED - Wave 2, now agent-facing with structured output format):
- `prompts/rag/rag_theme_synthesis_prompt.txt` - Theme analysis for each cluster (output: THEME_ANALYSIS: with 5 structured points)
- `prompts/rag/rag_context_synthesis_prompt.txt` - Market synthesis combining all themes (output: MARKET_SYNTHESIS: with 6 structured points)
- `prompts/rag/rag_simple_synthesis_prompt.txt` - Fallback synthesis when clustering insufficient (output: MARKET_SYNTHESIS: with 6 structured points)

### Prompt Refactoring (Wave 2)

**Goal**: Make synthesis output agent-facing (structured, no conversational dialogue).

**Changes Applied**:
- `rag_theme_synthesis_prompt.txt` - Agent-facing with "THEME_ANALYSIS:" format
- `rag_context_synthesis_prompt.txt` - Agent-facing with "MARKET_SYNTHESIS:" format
- `rag_simple_synthesis_prompt.txt` - Consistent agent-facing format
- All: Removed "I", "let me", conversational phrases
- All: Added "Structured output only" directive

**Impact**:
- Cleaner, more deterministic LLM output
- Easier parsing and extraction of synthesis results
- More reliable result formatting across multiple invocations

---

## Vector Database & Semantic Search Architecture (Qdrant + MySQL Hybrid)

### Philosophy

**Dual-Storage Model**: Vector embeddings stored in Qdrant (minimal payloads), full metadata stored in MySQL. Vector search returns ASINs, then MySQL is queried for all fields.

**Key Principle**: Qdrant stores minimal payloads (ASIN only), MySQL stores all metadata. This enables scalable semantic search with deterministic data retrieval.

### Configuration

```python
# Qdrant Vector Database
QDRANT_HOST = "localhost"                   # or QDRANT_URL env var
QDRANT_PORT = 6333                          # Standard Qdrant port
QDRANT_COLLECTION_NAME = "amazon_listings"  # Listings collection
QDRANT_REVIEWS_COLLECTION_NAME = "amazon_reviews"  # Reviews collection
QDRANT_API_KEY = None                       # Optional API authentication

# Embeddings
EMBEDDING_MODEL = "text-embedding-3-small"  # OpenAI model

# RAG Similarity Threshold (see RAG Configuration section for details)
RAG_SIMILARITY_THRESHOLD = 0.3              # Default search threshold (0.0-1.0, changed from 0.8 for broader search)

# MySQL (New)
MYSQL_HOST = "localhost"
MYSQL_PORT = 3306
MYSQL_USER = "uce_tools_user"
MYSQL_PASSWORD = ""
MYSQL_DATABASE = "amazon_listings"
```

**Wave 3 Configuration Changes** (2026-02-10):
- `VECTOR_SIMILARITY_THRESHOLD`: Removed from config.py (was dead variable, never used in vector_service.py)
- `RAG_SIMILARITY_THRESHOLD`: Now the sole threshold variable, moved to RAG Configuration section
- `search_similar()` still has hardcoded `threshold: float = 0.3` default in signature, but always overridden by callers via `rag_service.py`

### Endpoint: /ai/api/upsert_data (Unified Upsert)

**Location**: main.py:1155-1184
**Rate Limit**: `RATE_LIMIT_ANALYZE/minute` per IP
**Purpose**: Single endpoint for upserting listings or reviews to vector database.

**Input Model**: `UpsertDataRequest`
```python
{
    "data_type": "listing" | "review",
    "data": {...}  # Dict containing listing/review fields
}
```

**Logic**:
- If `data_type == "listing"`: calls `upsert_listing(input_data.data)`
- If `data_type == "review"`: calls `upsert_review(input_data.data)`
- Else: raises 400 Bad Request with invalid data_type message

**Response**:
```python
{
    "success": bool,
    "message": "Listing/Review upserted successfully" | "Failed to upsert..."
}
```

**Error Handling**: Generic HTTPException(400) with error string from underlying service.

---

### Endpoint: /ai/api/search_data (Unified Search)

**Location**: main.py:1187-1216
**Rate Limit**: `RATE_LIMIT_ANALYZE/minute` per IP
**Purpose**: Single endpoint for searching similar listings or reviews.

**Input Model**: `SearchDataRequest`
```python
{
    "data_type": "listing" | "review",
    "query_text": str,
    "top_n": int,
    "threshold": float
}
```

**Logic**:
- If `data_type == "listing"`: calls `search_similar(query_text, top_n, threshold)`
- If `data_type == "review"`: calls `search_reviews(query_text, top_n, threshold)`
- Else: raises 400 Bad Request

**Response**: `SearchDataResponse`
```python
{
    "results": [...],           # Raw results from vector service
    "query": str,               # Original query
    "total_found": int          # Length of results
}
```

---

### Endpoint: GET /ai/api/retrieve_data/{asin} (Unified Retrieve)

**Location**: main.py:1218-1242
**Purpose**: Retrieve listing or review data from vector database.

**Query Parameters**:
- `data_type` (required): "listing" | "review"
- `review_id` (optional): Required if data_type="review"

**Logic**:
- If `data_type == "listing"`: calls `retrieve_by_asin(asin)`, returns 404 if not found
- If `data_type == "review"`: requires `review_id`, calls `retrieve_review_by_id(asin, review_id)`, returns 404 if not found
- Else: raises 400 Bad Request

**Response**: Listing or Review dict, or 404 if not found.

---

### Endpoint: DELETE /ai/api/delete_data/{asin} (Unified Delete)

**Location**: main.py:1244-1272
**Purpose**: Delete listing or review data from vector database.

**Query Parameters**:
- `data_type` (required): "listing" | "review"
- `review_id` (optional): Required if data_type="review"

**Logic**:
- If `data_type == "listing"`: calls `delete_listing_by_id(asin)`, returns success dict
- If `data_type == "review"`: requires `review_id`, calls `delete_review_by_id(asin, review_id)`, returns success dict
- Else: raises 400 Bad Request

**Response**:
```python
{
    "success": bool,
    "message": "Listing/Review deleted successfully" | "Failed to delete..."
}
```

---

## Service: Vector Service (src/services/vector_service.py)

**Purpose**: Qdrant vector database operations - upsert, search, retrieve, delete with minimal ASIN-only payloads

**Architectural Changes from Previous Version**:

### Payload Minimization

**Before**: Stored full listing/review metadata in Qdrant payload
```python
"payload": {
    "id": int(listing_id),
    "listing_id": int(listing_id),
    "asin": asin,
    "title": title,
    "brand": brand
}
```

**After**: Store ONLY ASIN in Qdrant, fetch full data from MySQL
```python
"payload": {
    "asin": asin
}
```

**Why**: Qdrant is expensive for scale; MySQL is cheap for full metadata storage. Vector search returns ASINs only, then MySQL is queried for all fields.

### Point ID Generation

**Before**: Used integer listing_id or review_id directly as Qdrant point ID
```python
"id": int(listing_id),  # Fragile: assumes unique integer IDs
```

**After**: Generate deterministic hash-based point IDs
```python
# For listings:
point_id = abs(hash(asin)) % (2**31)

# For reviews:
point_id = abs(hash(f"{asin}_{review_id}")) % (2**31)
```

**Why**: Enables ASIN-based deletion and retrieval. Hash ensures deterministic IDs across restarts. Composite hash for reviews prevents ID collisions.

### Function Signatures (Breaking Changes)

**`upsert_listing(listing)`**:
- Before: Logged listing_id
- After: Logs ASIN, generates point_id from hash, stores minimal payload
- Breaking change: Must pass `listing["asin"]` (required field)

**`upsert_review(review)`**:
- Before: Required `review["listing_id"]`, used review["id"] as point_id
- After: Requires `review["asin"]` and `review["id"]`, generates composite hash point_id
- Breaking change: Must pass `review["asin"]` (new required field)

**`search_similar(query, top_n=10, threshold=0.3)`**:
- Before: Returned [{asin, score, title}], threshold=0.8
- After: Returns [{asin, score}] only, threshold=0.3 (more permissive)
- Breaking change: No title in response; callers must fetch from MySQL

**`search_similar_debug(query, top_n=10)` (NEW)**:
- Returns top N results without threshold filtering (for troubleshooting)
- Useful for understanding why queries return no results

**`search_reviews(query, top_n=10, threshold=0.3)`**:
- Before: Returned [{id, listing_id, rating, score}], threshold=0.8
- After: Returns [{asin, review_id, score}] only, threshold=0.3
- Breaking change: rating/comment removed; must fetch from MySQL

**`delete_listing_by_id(asin)`** (was `delete_listing_by_id(listing_id)`):
- Before: Took integer listing_id
- After: Takes ASIN string, generates point_id via hash
- Breaking change: Signature changed entirely

**`delete_review_by_id(asin, review_id)`** (was `delete_review_by_id(review_id)`):
- Before: Took only review_id
- After: Takes asin + review_id, generates composite hash point_id
- Breaking change: Signature changed, now requires ASIN

**`retrieve_by_asin(asin)` (MODIFIED)**:
- Before: Returned {asin, title} from Qdrant payload only
- After: Returns {asin, title, description, brand, ...} (full data from MySQL)
- Stage 1: Check if ASIN exists in Qdrant (vector exists)
- Stage 2: Fetch full data from MySQL via `fetch_listings_by_asins()`
- Breaking change: Return value now includes full metadata

**`retrieve_review_by_id(asin, review_id)` (MODIFIED, was `retrieve_review_by_id(review_id)`)**:
- Before: Took only review_id, returned {id, listing_id, rating, comment}
- After: Takes asin + review_id, returns full review data from MySQL
- Stage 1: Check if vector exists in Qdrant
- Stage 2: Fetch full data from MySQL via `fetch_reviews_by_asins()`
- Breaking change: Signature changed, return value now includes full metadata

### Primary Functions

- `upsert_listing(listing) → str`: Upsert listing to Qdrant with ASIN-only payload
  - Generates point_id from hash(asin)
  - Embeds title+description via OpenAI
  - Stores {asin} payload (minimal)
  - Returns success message

- `upsert_review(review) → str`: Upsert review to Qdrant with ASIN-only payload
  - Requires review["asin"] and review["id"]
  - Generates point_id from hash(asin+review_id)
  - Embeds comment via OpenAI
  - Stores {asin} payload (minimal)
  - Returns success message

- `search_similar(query, top_n, threshold) → List[Dict]`: Vector search for listings
  - Embeds query via OpenAI
  - Returns top_n results with score >= threshold
  - Returns [{asin, score}] tuples
  - Graceful degradation: Returns [] on error

- `search_similar_debug(query, top_n) → List[Dict]`: Debug version without threshold filtering
  - Used by RAG for troubleshooting (see why queries return no results)
  - Returns top_n results regardless of threshold

- `search_reviews(query, top_n, threshold) → List[Dict]`: Vector search for reviews
  - Embeds query via OpenAI
  - Returns [{asin, review_id, score}] tuples
  - Graceful degradation: Returns [] on error

- `retrieve_by_asin(asin) → Optional[Dict]`: Fetch full listing data
  - Stage 1: Verify ASIN exists in Qdrant
  - Stage 2: Call `mysql_service.fetch_listings_by_asins([asin])`
  - Returns full listing dict or None

- `retrieve_review_by_id(asin, review_id) → Optional[Dict]`: Fetch full review data
  - Stage 1: Verify review exists in Qdrant
  - Stage 2: Call `mysql_service.fetch_reviews_by_asins([asin])`
  - Returns full review dict or None

- `delete_listing_by_id(asin) → bool`: Delete listing from Qdrant
  - Generates point_id from hash(asin)
  - Deletes from collection
  - Returns success bool

- `delete_review_by_id(asin, review_id) → bool`: Delete review from Qdrant
  - Generates point_id from hash(asin+review_id)
  - Deletes from collection
  - Returns success bool

- `generate_embedding(text) → Optional[List[float]]`: Generate embedding via OpenAI
  - Model: text-embedding-3-small
  - Returns 1536-dim vector or None on error

**Called By**:
- RAG service (fetch_listing_context, fetch_review_context)
- Chat completions endpoint (search_similar_debug)
- Admin scripts (seed_vector_db.py, test_vector_db.py)

**Calls**:
- Qdrant client (search, upsert, delete operations)
- OpenAI API (text-embedding-3-small model)
- MySQL service (retrieve_by_asin, retrieve_review_by_id)

**Error Handling**:
- All operations catch exceptions and log
- Search failures return []
- Retrieve failures return None
- Delete failures return False

---

## Service: MySQL Service (src/services/mysql_service.py)

**Purpose**: Fetch full listing/review metadata from MySQL after vector search returns ASINs

**Architecture**:
- Connection pool singleton (aiomysql, 1-10 connections)
- Lazy initialization on first use
- Graceful degradation: returns empty list if pool unavailable

### Primary Functions

- `get_pool() → Optional[aiomysql.Pool]`: Creates/returns singleton connection pool
  - Initializes on first call
  - Returns None in TEST_MODE
  - Logs errors, returns None if creation fails
  - minsize=1, maxsize=10

- `fetch_listings_by_asins(asins: List[str]) → List[Dict]`: Fetch full listing metadata by ASIN list
  - Query: `SELECT asin, title, description, brand, price, rating, review_count FROM top_listings WHERE asin IN (...)`
  - Returns: List of dicts with complete listing metadata
  - Graceful degradation: Empty list on MySQL error
  - TEST_MODE: Returns mock listings (5 max)

- `fetch_reviews_by_asins(asins: List[str], limit_per_asin=10) → List[Dict]`: Fetch reviews with per-ASIN limit
  - Query: Uses ROW_NUMBER() window function to limit reviews per ASIN
  - Returns: List of review dicts with {asin, review_id, rating, comment, listing_id}
  - Graceful degradation: Empty list on MySQL error
  - TEST_MODE: Returns mock reviews (3 ASINs, 3 reviews per ASIN max)

- `close_pool() → None`: Shutdown connection pool (call on app shutdown)
  - Sets global `_connection_pool = None`
  - Closes all connections
  - Logs completion

**Error Handling**:
- Pool creation failures: Logged, returns None (graceful degradation)
- Query execution failures: Logged, returns empty list (don't break caller)
- Connection acquire failures: Caught in try/except, returns empty list

**Async Pattern**: All functions are async, use `async with pool.acquire()` for connection management

**Dependencies**: aiomysql, config (mysql_config), logging

**Configuration**:
```python
MYSQL_HOST = "localhost"
MYSQL_PORT = 3306
MYSQL_USER = "uce_tools_user"
MYSQL_PASSWORD = ""
MYSQL_DATABASE = "amazon_listings"
```

---

## Service: RAG Service (src/services/rag_service.py)

**Purpose**: RAG orchestration for chat completions. Retrieves relevant listings/reviews from vector search, then enriches with full data from MySQL.

**Architecture**:
- Three-stage pipeline per request:
  1. Vector search (via vector_service)
  2. ASIN extraction + score mapping
  3. MySQL enrichment (fetch full metadata)
- All operations wrapped in `asyncio.wait_for(timeout=TIMEOUT_RAG_RETRIEVAL)`
- Graceful degradation at each stage

### Primary Functions

- `fetch_listing_context(query, threshold=0.3, top_n=5) → List[Dict]`: Semantic search + enrichment for listings
  - Stage 1: Call `vector_service.search_similar(query, top_n, threshold)` → returns [{asin, score}]
  - Stage 2: Extract ASINs, build score_map
  - Stage 3: Call `mysql_service.fetch_listings_by_asins(asins)` → returns full listings
  - Stage 4: Merge similarity scores back into full listings
  - Timeout: TIMEOUT_RAG_RETRIEVAL (default 30s)
  - Graceful degradation: Return vector results if MySQL fails; return [] if vector search fails
  - Returns: List of listings with enriched score field

- `fetch_review_context(asin_list, query, top_n=10, limit_per_asin=10, threshold=0.3) → List[Dict]`: Review search + enrichment
  - Stage 1: Call `vector_service.search_reviews(query, top_n, threshold)` → returns [{asin, review_id, score}]
  - Stage 2: Filter to only reviews for found listings (asin must be in asin_list)
  - Stage 3: Call `mysql_service.fetch_reviews_by_asins(relevant_asins, limit_per_asin)` → returns full reviews
  - Stage 4: Merge similarity scores back into full reviews
  - Timeout: TIMEOUT_RAG_RETRIEVAL (default 30s)
  - Graceful degradation: Return vector results if MySQL fails; return [] if search fails
  - Returns: List of reviews with enriched score field

- `combine_context(listings, reviews) → Dict`: Merge listings and reviews into single context
  - Returns: {listings: [...], reviews: [...], listing_count: int, review_count: int}
  - No timeout, pure data structure

- `fetch_explicit_listings(asins: List[str]) → List[Dict]`: Fetch listings for user-mentioned ASINs
  - Direct call to `mysql_service.fetch_listings_by_asins(asins)`
  - Graceful degradation: Logs warning for missing ASINs, returns partial results
  - Returns: List of full listing metadata

**Error Handling**:
- Timeouts: Caught via `asyncio.TimeoutError`, logs warning, returns []
- MySQL failures: Logged, falls back to vector results (partial data acceptable)
- Empty ASIN lists: Returns [] immediately
- Vector search failures: Logs info, returns []

**Async Pattern**: All functions async, use `asyncio.wait_for()` for timeout protection

**Dependencies**: vector_service.search_similar(), vector_service.search_reviews(), mysql_service.fetch_listings_by_asins(), mysql_service.fetch_reviews_by_asins()

**Configuration**:
```python
RAG_SIMILARITY_THRESHOLD = 0.3              # Threshold for vector search (0.0-1.0)
RAG_TOP_N_LISTINGS = 25                     # Max listings to retrieve per search
TIMEOUT_RAG_RETRIEVAL = 30                  # Vector search + MySQL enrichment timeout
# NOTE: RAG_ENABLED removed in Wave 3 (was global flag, now per-request via rag_config payload)
```

---

## Service: Clustering Service (src/services/clustering_service.py)

**Purpose**: Cluster similar listings/reviews for RAG synthesis. Groups semantically related items and assigns theme labels.

**Architecture**:
- Uses HDBSCAN for robust clustering (noise-tolerant)
- Graceful degradation: If < min_clusters found, returns single cluster
- Two-phase: clustering (HDBSCAN) → theme identification (keyword extraction)

### Primary Functions

- `cluster_vectors(embeddings: List[List[float]], min_clusters=3) → Tuple[List[int], int]`: HDBSCAN clustering
  - Converts embeddings to numpy array (float32)
  - Runs HDBSCAN(min_cluster_size=2, metric='euclidean')
  - Returns: (cluster_labels, cluster_count)
  - Graceful degradation: If clusters < min_clusters, returns all items in cluster 0 (single cluster, count=1)
  - Handles edge cases: Empty embeddings → ([], 0); < 2 embeddings → ([], 0)

- `identify_themes(clusters: Dict[int, List[Dict]], items: List[Dict]) → Dict[int, str]`: Assign theme labels
  - Simple strategy: Extract titles from first 3 items per cluster
  - Returns: {cluster_id: "Cluster N: title1, title2, title3"}
  - Does NOT call LLM (that's done in synthesizer)
  - Graceful degradation: Empty clusters → {}, missing titles → "Item N"

**Error Handling**:
- Clustering failure: Logged, returns ([], 0)
- Theme identification failure: Logged, returns {}
- Invalid embeddings: Handled gracefully (empty/None returns no clusters)

**Dependencies**: hdbscan (HDBSCAN), numpy

**Note**: Clustering is used by synthesizer but NOT required by RAG search. If clustering fails, RAG continues without cluster synthesis.

---

## Utility: ASIN Parser (src/utils/asin_parser.py)

**Purpose**: Extract Amazon ASIN identifiers from text using regex pattern matching

### Primary Function

- `extract_asins(text: str) → List[str]`: Extracts all unique ASINs from input text, maintaining order of first occurrence
  - Pattern: ASIN format is `B` followed by 9 alphanumeric characters (regex: `B[0-9A-Z]{9}`)
  - Deduplication: Preserves order while removing duplicates (set-based tracking)

**Usage Examples**:
```python
from src.utils.asin_parser import extract_asins

extract_asins("What about B0CSXV3GK4?")
# Returns: ['B0CSXV3GK4']

extract_asins("Compare B0CSXV3GK4 and B09LYF2ST7")
# Returns: ['B0CSXV3GK4', 'B09LYF2ST7']

extract_asins("No ASINs here")
# Returns: []
```

**Integration Points**:
- Used in chat completions RAG mode for extracting product references from user messages
- Enables semantic search by ASIN from conversation context

---

## Database Management Scripts

### scripts/utilities/setup_db.sql

**Purpose**: MySQL database initialization for Amazon listings infrastructure

**What It Creates**:
- Database: `amazon_listings`
- User: `uce_tools_user@localhost` (password: `uce_tools_pass_2026`)
- Grants all privileges on `amazon_listings.*`

**Usage**:
```bash
sudo mysql < scripts/utilities/setup_db.sql
```

**Notes**:
- Idempotent (uses `CREATE DATABASE IF NOT EXISTS`, `CREATE USER IF NOT EXISTS`)
- Sets up application user with limited scope (localhost only)
- Includes verification queries

---

### scripts/utilities/reset_mysql_db.py

**Purpose**: Reset MySQL database state for development and testing

**Primary Functions**:
- `drop_tables()`: Asynchronously drop `top_reviews` and `top_listings` tables
- `drop_database()`: Asynchronously drop entire `amazon_listings` database
- `table_cleanup()`: Drop tables while preserving database
- `full_teardown()`: Drop database completely

**CLI Flags**:

| Flag | Behavior |
|------|----------|
| (no flags) | Table cleanup mode: drop tables, preserve database |
| `--full` | Full teardown: drop entire database |

**Usage Examples**:
```bash
# Drop tables only (database preserved)
python scripts/utilities/reset_mysql_db.py

# Full teardown (database dropped)
python scripts/utilities/reset_mysql_db.py --full
```

**Error Handling**:
- Catches MySQL error 1051 (unknown table) as expected for idempotent operations
- Logs warnings for missing tables (not errors - design intent)
- Async/await pattern with aiomysql for non-blocking I/O
- Connection management with explicit `conn.close()`

**Configuration**: Reads from config.py:
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`

**Exit Codes**:
- `0`: Success
- `1`: Error (logged with timestamp and level)

---

### scripts/utilities/seed_listings_reviews_db.py

**Purpose**: Populate MySQL database with Amazon listings and reviews from JSON exports (PHPMyAdmin format support)

**Primary Functions**:
- `create_pool()`: Create aiomysql connection pool (minsize=1, maxsize=5)
- `create_tables(pool)`: Create `top_listings` and `top_reviews` tables if not exist
- `upsert_listings(pool, listings)`: Batch upsert listings (INSERT ... ON DUPLICATE KEY UPDATE)
- `upsert_reviews(pool, reviews, listing_id_to_asin)`: Batch upsert reviews with ASIN enrichment
- `parse_listings_json(json_data)`: Parse PHPMyAdmin export format
- `parse_reviews_json(json_data)`: Parse PHPMyAdmin export format
- `seed_database(listings_path, reviews_path)`: Orchestrate full seeding operation

**Tables Created**:

**top_listings**:
```sql
asin VARCHAR(20) PRIMARY KEY
title TEXT NOT NULL
description LONGTEXT
brand VARCHAR(255)
price DECIMAL(10,2)
rating DECIMAL(3,2)
review_count INT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**top_reviews**:
```sql
id INT AUTO_INCREMENT PRIMARY KEY
asin VARCHAR(20) NOT NULL (FOREIGN KEY)
review_id VARCHAR(50) UNIQUE
listing_id INT
rating INT
comment LONGTEXT
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**CLI Flags**:

| Flag | Required | Value |
|------|----------|-------|
| `--listings` | Yes | Path to listings JSON file |
| `--reviews` | Yes | Path to reviews JSON file |

**Usage**:
```bash
python scripts/utilities/seed_listings_reviews_db.py \
  --listings data/listings.json \
  --reviews data/reviews.json
```

**Input Format Support** (PHPMyAdmin):

Handles multiple JSON structures:
```json
// Format 1: Array of table objects
[
  {
    "name": "amazon_listing_infos",
    "data": [{"asin": "B001", "title": "...", ...}]
  },
  {
    "name": "amazon_listing_reviews",
    "data": [{"id": 1, "asin": "B001", "rating": 5, ...}]
  }
]

// Format 2: Wrapped object
{
  "data": [{"asin": "B001", ...}]
}

// Format 3: Direct array
[{"asin": "B001", ...}]
```

**Upsert Behavior**:
- On duplicate ASIN/review_id: updates all fields, sets `updated_at=CURRENT_TIMESTAMP`
- Transactional: single `await conn.commit()` after all upserts in batch

**ASIN Enrichment**:
- Builds listing_id → ASIN mapping during listing load
- Enriches reviews by injecting ASIN from mapping
- Skips reviews with no mapping (orphan detection)

**Data Validation**:
- File existence check (fails with exit code 1 if missing)
- JSON parse error handling (exits on invalid JSON)
- Field validation (skips items missing required fields)
- Logs first 5 skipped reviews, then shows summary

---

## Seeding Scripts

### scripts/utilities/seed_vector_db.py (Modified)

**Changes from main branch**:

**1. Flexible JSON Parsing** (Enhanced from simple structure):
```python
# OLD: Only handled dict with "data" key
if isinstance(listings_data, dict) and "data" in listings_data:
    listings = listings_data["data"]

# NEW: Full PHPMyAdmin format support
if isinstance(listings_data, list):
    for table in listings_data:
        if isinstance(table, dict) and "data" in table and table.get("name") == "amazon_listing_infos":
            listings = table["data"]
            break
elif isinstance(listings_data, dict) and "data" in listings_data:
    listings = listings_data["data"]
elif isinstance(listings_data, dict):
    listings = [listings_data]
```

**2. Listing ID → ASIN Mapping** (New tracking):
```python
listing_id_to_asin = {}  # Build mapping from listing_id to asin for review enrichment

# ... during listing processing
for listing in listings:
    if listing_id:
        listing_id_to_asin[str(listing_id)] = listing.get("asin")
```

**3. Review ASIN Enrichment** (New architecture):
```python
# OLD: Required listing_id in review
if isinstance(review, dict) and review.get("id") and review.get("listing_id"):
    tasks.append(upsert_review(review))

# NEW: Maps listing_id to ASIN, enriches review
if isinstance(review, dict) and review.get("id") and review.get("comment"):
    listing_id = review.get("listing_id")
    asin = listing_id_to_asin.get(str(listing_id)) if listing_id else None

    if asin:
        review_enriched = review.copy()
        review_enriched["asin"] = asin  # Add ASIN field
        tasks.append(upsert_review(review_enriched))
    else:
        skipped_reviews += 1  # Track orphans
```

**4. Field Requirement Changes**:
- Listings: No longer require `"id"` field (only ASIN and title required)
- Reviews: No longer require `"listing_id"` (mapped from ID internally)

**5. Skip Tracking**:
```python
skipped_reviews = 0
# ... later
if skipped_reviews > 5:
    print(f"  ... and {skipped_reviews - 5} more reviews skipped")
```

**Why These Changes**:
- **ASIN-Only Payload**: Reviews stored with ASIN (not listing_id) for direct vector DB queries
- **Flexible JSON Support**: Handles PHPMyAdmin exports which use table object structure
- **Orphan Detection**: Graceful degradation for reviews without listing_id mapping

---

### scripts/utilities/extract_seed_data.py (Modified)

**Changes**:

**Referential Integrity Validation** (Updated for ASIN model):
```python
# OLD: Checked listing_id referential integrity
valid_listing_ids = set()
for listing in listings:
    valid_listing_ids.add(str(listing["id"]))

# NEW: Check ASIN field
valid_asin_ids = set()
for listing in listings:
    valid_asin_ids.add(str(listing["id"]))

# OLD: Check review.listing_id
listing_id = str(review.get("listing_id", ""))
if listing_id and listing_id not in valid_listing_ids:
    orphans += 1

# NEW: Check review.asin
asin = str(review.get("asin", ""))
if asin and asin not in valid_asin_ids:
    orphans += 1
```

**Impact**: Validation now checks for ASIN-based referential integrity (not listing_id)

---

## Testing Infrastructure

### scripts/testing/utils.py (New Shared Module)

**Purpose**: Centralized testing utilities extracted from monolithic test.py.

**Primary Functions**:

| Function | Purpose |
|----------|---------|
| `wait_for_server(host, port, timeout, poll_interval)` | Poll /health with exponential backoff until server ready |
| `get_key()` | Capture single keypress for TUI navigation (arrow keys, enter, q) |
| `truncate_text(text, max_length)` | Truncate text with ellipsis for display |
| `select_listings_interactive(files, max_selections, allow_multiple)` | TUI-based listing selector with arrow key navigation |
| `save_raw_json_output(result_data, json_filename)` | Save raw API response to JSON file (controlled by INCLUDE_RAW_OUTPUT) |
| `find_generated_videos(exclude_debug, asin)` | Locate generated video files (v1.9.0 structure: generated_videos/{ASIN}/...) |
| `load_test_listings(folder_path, count)` | Load JSON listings with field validation |

**TUI Features** (select_listings_interactive):
- Arrow key navigation (↑ up, ↓ down)
- Space bar for select/deselect
- Enter to confirm
- 'q' to cancel
- Checkbox display: `[✓]` selected, `[ ]` unselected
- Max selections enforcement
- ASIN + truncated title display

**Configuration**:
- `INCLUDE_RAW_OUTPUT`: From environment, controls whether JSON files are saved
- `TEST_MODE`: Checked for mock usage

**Async Utilities**:
- `wait_for_server()`: Uses aiohttp with exponential backoff (0.5s → 5s max)
- TUI functions: Synchronous (blocking stdin) to avoid async complications

---

### scripts/testing/test_chat_completions.py (New Test Module)

**Purpose**: Comprehensive testing for `/ai/api/generate_chat_completions` endpoint with RAG integration.

**Primary Function**:
```python
test_chat_completions(
    num_conversations,
    streaming=False,
    image_urls=None,
    use_rag=False,
    rag_mode="full",
    cli_mode=False,
    debug_rag=False,
    custom_prompt=None
)
```

**CLI Flags**:

| Flag | Type | Default | Purpose |
|------|------|---------|---------
| `--num-conversations N` | int | None | Number of conversations to test |
| `--streaming BOOL` | bool | None | Enable streaming responses (true/false) |
| `--chat-images URLS` | str | None | Comma-separated image URLs (e.g., "url1,url2") |
| `--chat-rag BOOL` | bool | False | Enable RAG (true/false) |
| `--rag-mode MODE` | choice | full | RAG mode: full (context + generation) or partial (generation only) |
| `--rag-debug BOOL` | bool | False | Bypass threshold, use top-N from config (true/false) |
| `--debug BOOL` | bool | False | Alias for --rag-debug (true/false) |
| `--prompt TEXT` | str | None | Custom prompt for headless testing (creates fresh conversation) |

**Operational Modes**:

**1. Interactive (TUI) Mode** (No CLI flags provided):
- Prompts for number of conversations
- Prompts for streaming enable/disable
- Prompts for image URLs
- Prompts for RAG enable/disable
- Conditional prompts for RAG mode and debug mode if RAG enabled
- Uses `select_listings_interactive()` for conversation file selection

**2. CLI Mode** (With CLI flags):
- Random sampling of chat files if multiple conversations specified
- Non-interactive, deterministic
- Useful for CI/CD and automated testing

**3. Headless Mode** (--prompt provided):
- Overrides num_conversations to 1
- Creates single fresh conversation with custom prompt
- Ignores conversation file selection

**Test Output Format** (Text File):

Generated in `results/chat_completions/test_results_{conversation}_{timestamp}.txt`:

```
════════════════════════════════════════════════════════════
📊 TEST METADATA
════════════════════════════════════════════════════════════
Test Date: [timestamp]
Test Number: [N]
Conversation: [name]
Model: [gpt-4o-mini]
Tokens Used: [count]
Response Time: [N.NNs]

════════════════════════════════════════════════════════════
🎯 RAG INTEGRATION STATUS & REDUCE OUTPUTS
════════════════════════════════════════════════════════════
Status: [enabled/disabled]
Listings Found: [N]
Reviews Found: [N]

Themes (Cluster Analysis):
  Cluster 0: [theme text]
  Cluster 1: [theme text]

Context Synthesis:
  [synthesized context from top listings]

Synthesis Message (partial mode):
  [partial synthesis message]

Strategy: [full/partial]

════════════════════════════════════════════════════════════
🔍 DEBUG: TOP 10 VECTOR SEARCH RESULTS
════════════════════════════════════════════════════════════
Total Results: [N]

[1] ASIN: B0CSXV3GK4
    Score: 0.8534
    Title: [product title]
    Description: [first 100 chars]...

════════════════════════════════════════════════════════════
💬 ENDPOINT RESPONSE (LLM Generated)
════════════════════════════════════════════════════════════
[LLM response text]

════════════════════════════════════════════════════════════
📋 RAW JSON RESPONSE
════════════════════════════════════════════════════════════
[Complete JSON response]
```

**RAG Metadata Captured** (from response):
- `status`: RAG operation status
- `listings_count`: Number of listings found in vector search
- `reviews_count`: Number of reviews found in vector search
- `themes`: Cluster analysis results (dict or list)
- `context_synthesis`: Full mode context synthesis text
- `message`: Partial mode synthesis message
- `synthesis_strategy`: "full" or "partial"
- `debug_top_listings`: Top 10 vector search results (score, ASIN, title, description)
- `debug_mode`: Whether RAG debug mode was enabled

**RAG Payload Construction**:
```python
if use_rag:
    payload["rag_config"] = {"integration_mode": rag_mode}  # "full" or "partial"
    if debug_rag:
        payload["debug"] = True  # Bypass threshold
```

**Timeout Configuration**:
- Uses `TIMEOUT_CHAT_COMPLETIONS` from config (includes RAG operations)

**Usage Examples**:

```bash
# Interactive mode (prompts for all options)
python scripts/testing/test_chat_completions.py

# Single conversation with defaults
python scripts/testing/test_chat_completions.py --num-conversations 1

# Chat with RAG in full mode
python scripts/testing/test_chat_completions.py --num-conversations 1 --chat-rag true --rag-mode full

# Chat with RAG in partial mode with debug
python scripts/testing/test_chat_completions.py --num-conversations 1 --chat-rag true --rag-mode partial --rag-debug true

# Chat with image URLs
python scripts/testing/test_chat_completions.py --num-conversations 1 --chat-images "https://example.com/img1.jpg,https://example.com/img2.jpg"

# Headless mode with custom prompt
python scripts/testing/test_chat_completions.py --prompt "Compare these two products B0CSXV3GK4 and B09LYF2ST7"

# Streaming mode
python scripts/testing/test_chat_completions.py --num-conversations 1 --streaming true
```

**API Key Validation**:
- Checks `OPENAI_API_KEY` environment variable
- Attempts model instantiation with small test call
- Exits with error if key invalid (unless `TEST_MODE=true`)
- Logs exception type and traceback for debugging

---

### scripts/testing/test_vector_db.py (Modified)

**Key Changes**:

**1. Shared Utilities Import**:
```python
from utils import load_test_listings
```

Removed local `load_test_listings()` function (now in utils.py).

**2. Review ASIN Field** (Updated test data):
```python
# OLD: Reviews with listing_id only
{"id": 1001, "listing_id": 1, "rating": 5.0, "comment": "..."}

# NEW: Reviews with asin field
{"asin": "B0001", "id": 1001, "rating": 5.0, "comment": "..."}
```

**3. Review Retrieval Signature** (ASIN-indexed):
```python
# OLD: By ID only
result = await retrieve_review_by_id(1001)

# NEW: By ASIN and ID
result = await retrieve_review_by_id("B0001", 1001)

# Validation also checks ASIN
if result.get("asin") != asin:
    logger.error("Returned wrong ASIN")
```

**4. Listing Deletion** (ASIN-indexed):
```python
# OLD: By ID
success = await delete_listing_by_id(9999)

# NEW: By ASIN
success = await delete_listing_by_id("TEST9999")

# Test listing structure updated
test_listing = {"asin": asin, "title": "...", "description": "...", "brand": "..."}
```

**5. Review Deletion** (ASIN + ID):
```python
# OLD: By ID only
success = await delete_review_by_id(9998)

# NEW: By ASIN and ID
success = await delete_review_by_id("TEST9999", 9998)
```

**6. Collection Isolation Test** (Updated):
```python
# Uses ASIN-based identifiers throughout
asin = "TEST8888"
review_id = 8888
test_listing = {"asin": asin, "title": "...", "description": "...", "brand": "..."}
test_review = {"asin": asin, "id": review_id, "rating": 5.0, "comment": "..."}
```

**Impact**: All test cases now validate ASIN-based retrieval and deletion (matching new vector service architecture).

---

## Test Modules (Modularized from test.py)

The monolithic `scripts/testing/test.py` (2471 lines) was refactored into focused modules:

| Module | Lines | Purpose |
|--------|-------|---------
| `test_analysis.py` | ~1700 | Image/title/description/SEO/bullet analysis endpoints |
| `test_video.py` | ~1400 | Video generation endpoint testing |
| `test_collage.py` | ~650 | Image collage generation testing |
| `test_miscellaneous.py` | ~600 | Comparison and utility endpoints |
| `test_chat_completions.py` | ~420 | Chat completions with RAG integration |
| `test_vector_db.py` | ~700 | Vector database operations |

**Architectural Benefit**: Each module focuses on a domain, enabling parallel testing and cleaner dependency management.

---

## Health Check Endpoint

### Endpoint: GET /health

**Location**: main.py:149-152
**Purpose**: Simple readiness check for test/deployment verification.

**Implementation**:
```python
@app.get("/health")
async def health_check():
    """Simple health check for test readiness verification."""
    return {"status": "ok", "ready": True}
```

**Response**: `{"status": "ok", "ready": True}`

**No Rate Limit**: Health checks are not rate-limited.

---

## Server Configuration

### Host Binding Logic (main.py:1580-1583)

**Before**:
```python
uvicorn.run(app, host="127.0.0.1", port=8000)
```

**After**:
```python
host = "0.0.0.0" if TEST_MODE else "127.0.0.1"
uvicorn.run(app, host=host, port=8000)
```

**Purpose**: TEST_MODE aware host binding.

- `TEST_MODE=true`: Bind to `0.0.0.0` (all interfaces, accept external connections for testing)
- `TEST_MODE=false`: Bind to `127.0.0.1` (localhost only, production security)

---

## Cross-Service Dependencies Summary

### Dependency Graph

```
main.py (endpoints)
  ↓
RAG Service
  ├─→ Vector Service
  │   ├─→ Qdrant Client
  │   └─→ MySQL Service
  ├─→ MySQL Service
  ├─→ Clustering Service
  └─→ RAG Synthesizer

Chat Completions
  ├─→ RAG Service (if rag_config provided)
  ├─→ Image Service (if image_urls provided)
  └─→ OpenAI API

Video Generation
  └─→ Video Service
      ├─→ Kie.ai Sora 2 API
      ├─→ FFmpeg (merge)
      └─→ S3 (upload)

Image Analysis
  ├─→ Image Service
  ├─→ Image Analyzer
  ├─→ Image Synthesizer
  └─→ OpenAI API (Vision + GPT-4)

Vector Service
  ├─→ Qdrant Client
  ├─→ MySQL Service
  └─→ OpenAI API (embeddings)
```

### Call Chain: RAG to Vector to MySQL

```
User Query (/generate_chat_completions)
    ↓
RAG Service: fetch_listing_context(query)
    ├─ Stage 1: Vector Service: search_similar(query) → [{asin, score}]
    ├─ Stage 2: Extract ASINs
    ├─ Stage 3: MySQL Service: fetch_listings_by_asins(asins) → [{full listing}]
    ├─ Stage 4: Merge scores into full listings
    └─ Returns: [full listing with score]
    ↓
Clustering Service: cluster_vectors(embeddings)
    ↓
RAG Synthesizer: synthesize_themes(clusters) + synthesize_context(themes, listings, reviews)
    ↓
Inject into chat message (system prompt)
    ↓
OpenAI API: generate response
    ↓
Response with rag_metadata
```

---

## Performance Characteristics

### Image Analysis
- **Speed**: 5-image analysis < 120s (with caching < 10ms on hits)
- **Cache Hit Rate**: 10-30% on repeat listings
- **Cost**: ~$0.15-0.20 per 5-image analysis
- **Reliability**: < 10% timeout rate per image (graceful degradation on failures)

### Chat Completions with RAG
- **Vector Search**: < 100ms (sub-100ms Qdrant HNSW search)
- **MySQL Fetch**: ~5-20ms per 5 ASINs
- **Full RAG Pipeline**: ~300-400ms (vector search + MySQL + synthesis)
- **Within Budget**: TIMEOUT_CHAT_COMPLETIONS = 120s
- **Wave 2 Improvements**:
  - Review API calls reduced ~60% via intent detection (infer_review_intent)
  - RAG context richer with 25 listings vs previous 5 (5x data volume, same latency)
  - Simple synthesis fallback: ~50% faster than full clustering when < RAG_MIN_CLUSTERS
  - Agent-facing prompts: Cleaner output parsing, more reliable results

### Vector Database
- **Qdrant Payload**: ~100 bytes per vector (ASIN only)
- **100k Listings**: ~10MB payload storage (plus embedding storage)
- **Search Performance**: Sub-100ms typical

### MySQL Operations
- **Pool Configuration**: minsize=1, maxsize=10
- **Lazy Initialization**: Pool created only on first use
- **Query Speed**: ~5-20ms per fetch operation

### Video Generation
- **15s video**: ~30-60s generation time
- **30s video**: ~90-120s generation time
- **60s video**: ~240-300s generation time
- **Character Generation** (UGC): ~10-20s additional per video

---

## Lifestyle Image Generation (Kie.ai Nano-Banana / Nano-Banana-Pro)

**Purpose**: Generate 1-6 authentic, natural lifestyle images showing a product being used in real-world scenarios. Emphasizes candid photography, natural lighting, shallow depth of field, and realistic imperfections over cinematic stylization.

**Key Differentiator**: Lifestyle images differ from showcase/cinematic product videos in that they prioritize authenticity and human context—product as hero within natural settings, not artistic interpretation.

### Architecture Pattern

Two-phase concurrent generation:

```
Request (1-6 images)
    ↓
[Phase 1: Prompt Generation]
    └─→ One OpenAI Vision call → N distinct scenario prompts
        (Token-efficient: product images loaded once, not N times)
    ↓
[Phase 2: Image Generation]
    └─→ N concurrent Kie.ai tasks (submit + poll):
        ├─ Submit each prompt to Kie.ai (standard or pro model)
        ├─ Poll for completion (5s intervals, configurable timeout)
        └─ Collect results (success/failed per image)
    ↓
Response (LifestyleImageResponse with per-image results)
```

### Endpoint: POST /ai/api/generate_lifestyle_images

**Route**: `POST /ai/api/generate_lifestyle_images`
**Response Model**: `LifestyleImageResponse`
**Rate Limit**: Configurable per RATE_LIMIT_LIFESTYLE_IMAGES (default: 3/minute per IP)
**Status Codes**:
- `200`: All images generated successfully
- `206`: Partial success (graceful=true) — some images failed, returns best-effort results
- `500`: All images failed or graceful=false with failures
- `400`: Validation error or content policy violation

### Request Input: LifestyleImageInput

**Core Fields**:
```python
class LifestyleImageInput(BaseModel):
    # Listing Data
    asin: Optional[str]                    # Product ASIN for logging
    title: str                             # Product title
    brand: str                             # Product brand
    description: str                       # Product description/bullets
    reviews: Optional[List[Review]]        # Customer reviews (enriches prompts)
    images: List[str]                      # Product image URLs (5 max typically)

    # Generation Parameters
    num_images: int                        # 1-6 images to generate
    model: str                             # 'standard' or 'pro'
    aspect_ratio: str                      # 1:1, 9:16, 16:9, 3:4, 4:3, etc.
    output_format: str                     # 'png' or 'jpeg'/'jpg'
    resolution: Optional[str]              # Pro model only: '1K', '2K', '4K'
    timeout: int                           # Per-image polling timeout (0 = unlimited)
    graceful: bool                         # Return partial on failure (default: True)
```

**Aspect Ratio Support**:
- `LIFESTYLE_ASPECT_RATIO_VALUES` = ["1:1", "9:16", "16:9", "3:4", "4:3", "3:2", "2:3", "5:4", "4:5", "21:9", "auto"]

### Response Output: LifestyleImageResponse

```python
class LifestyleImageResponse(BaseModel):
    status: str                            # 'success', 'partial_success', 'failed'
    asin: Optional[str]                    # Product ASIN
    num_requested: int                     # Total images requested
    num_succeeded: int                     # Successfully generated
    num_failed: int                        # Failed generations
    model_used: str                        # 'standard' or 'pro'
    results: List[LifestyleImageResult]    # Per-image results
    total_generation_time_seconds: float   # Wall-clock time
    error: Optional[str]                   # Top-level error if all failed
```

**Per-Image Result**:
```python
class LifestyleImageResult(BaseModel):
    index: int                             # 0-based image index
    status: str                            # 'success' or 'failed'
    image_url: Optional[str]               # Kie.ai CDN URL
    scenario_prompt: Optional[str]         # OpenAI-generated prompt
    task_id: Optional[str]                 # Kie.ai task ID
    error: Optional[str]                   # Error message if failed
    generation_time_seconds: Optional[float] # Wall-clock time for this image
```

### Service: src/services/lifestyle_image_service.py

**Primary Functions**:

- `_generate_scenario_prompts(title, brand, description, images, num_prompts, reviews) → List[str]`
  - One OpenAI Vision call with product images + context
  - Returns N distinct scenario prompts (e.g., "Lifestyle photo showing product in kitchen setting")
  - Raises `LifestyleImageGenerationError` on unrecoverable failure (no prompts = no images possible)

- `_submit_lifestyle_image_task(prompt, image_urls, use_pro, aspect_ratio, output_format, resolution) → str`
  - Submit single task to Kie.ai createTask endpoint
  - Returns task_id for polling
  - Model Selection:
    - **Standard**: google/nano-banana (text-only, uses image_size field)
    - **Pro**: nano-banana-pro (accepts image_input array up to 8 URLs, uses aspect_ratio + resolution fields)
  - Raises `LifestyleImageGenerationError` on HTTP/API failure

- `_poll_lifestyle_image_task(task_id, timeout) → str`
  - Async polling loop (5s intervals) until completion or timeout
  - States: waiting → queuing → generating → success / fail
  - Returns image URL on success
  - Raises `LifestyleImageGenerationError` on task failure
  - Raises `asyncio.TimeoutError` if timeout exceeded

- `_generate_single_lifestyle_image(index, prompt, image_urls, use_pro, aspect_ratio, output_format, resolution, timeout) → LifestyleImageResult`
  - End-to-end generation for one image: submit + poll + error capture
  - **Never raises**: All exceptions captured and returned as failed LifestyleImageResult
  - Enables graceful degradation (N-1 images succeed, 1 fails, endpoint still returns N results)

- `generate_lifestyle_images(title, brand, description, images, num_images, model, aspect_ratio, output_format, resolution, reviews, asin, per_image_timeout) → List[LifestyleImageResult]`
  - Orchestrates Phase 1 + Phase 2
  - Raises `LifestyleImageGenerationError` **only** if prompt generation fails (unrecoverable)
  - Individual image failures captured, returned as failed results
  - Never raises for individual image timeouts or failures

**Called By**:
- Endpoint: `/ai/api/generate_lifestyle_images` (main.py, line ~1856)

**Calls**:
- OpenAI Vision API (gpt-4o-mini with function calling schema)
- Kie.ai `POST /api/v1/jobs/createTask` (submit)
- Kie.ai `GET /api/v1/jobs/recordInfo` (poll)
- `fetch_image(url)` — aiohttp image download with fallback for Amazon CDN blocks
- `encode_image_to_base64(img)` — PIL image encoding for Vision API

### Prompt Template: prompts/generate/lifestyle_scenario_generation.txt

**Purpose**: Generate N distinct lifestyle scenario prompts from product images + metadata via OpenAI Vision function calling.

**Key Directives**:
1. Each scenario in DIFFERENT real-world context (unique location, activity, person, time)
2. Write as candid photograph (natural lighting, shallow DOF, realistic focus)
3. Include minor imperfections (blurred backgrounds, shadows, realistic clutter)
4. Avoid over-stylization/cinematic language—focus on authenticity
5. 50-80 words per prompt
6. Product appears naturally in use as hero item
7. Emphasize natural, warm lighting and realistic camera focus

**Output Schema** (function calling):
```python
SCHEMAS["lifestyle_scenarios"] = {
    "name": "generate_lifestyle_scenarios",
    "parameters": {
        "type": "object",
        "properties": {
            "scenarios": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "index": {"type": "integer"},
                        "prompt": {"type": "string"}
                    }
                }
            }
        }
    }
}
```

### Model Selection Logic

**Standard Model** (`google/nano-banana`):
- Text-only input (no image_input support)
- Uses `image_size` field (e.g., "1:1", "9:16")
- Cost: Lower
- Use case: Quick generation, text-only conditioning

**Pro Model** (`nano-banana-pro`):
- Accepts text + image inputs (up to 8 URLs)
- Uses `aspect_ratio` + `resolution` fields (e.g., aspect_ratio="1:1", resolution="2K")
- Cost: Higher
- Use case: Context-aware generation with product reference images

**Selection Decision** (automatic in endpoint):
- User specifies `model: "standard"` or `model: "pro"` in request
- Endpoint passes to service as `use_pro` boolean
- Standard model ignores image_urls; Pro model includes them

### Configuration (config.py)

```python
KIE_LIFESTYLE_STANDARD_MODEL = os.getenv("KIE_LIFESTYLE_STANDARD_MODEL", "google/nano-banana")
KIE_LIFESTYLE_PRO_MODEL = os.getenv("KIE_LIFESTYLE_PRO_MODEL", "nano-banana-pro")
RATE_LIMIT_LIFESTYLE_IMAGES = int(os.getenv("RATE_LIMIT_LIFESTYLE_IMAGES", "3"))
TIMEOUT_LIFESTYLE_IMAGE = int(os.getenv("TIMEOUT_LIFESTYLE_IMAGE", "300"))
```

### Error Handling & Graceful Degradation

**Phase 1 Failure** (Prompt Generation):
- If OpenAI Vision call fails → `LifestyleImageGenerationError` raised
- Endpoint returns HTTP 500 (unrecoverable, no prompts = no images)
- Example: API quota exceeded, malformed images, network timeout

**Phase 2 Failure** (Individual Image Generation):
- Submit failure → Captured in LifestyleImageResult, status="failed"
- Poll timeout → Captured in LifestyleImageResult, status="failed"
- Poll failure (Kie.ai task error) → Captured, status="failed"
- Result never raises; endpoint handles gracefully

**Response Codes Based on Outcomes**:
- All succeeded → HTTP 200, status="success"
- Partial succeeded + graceful=true → HTTP 206, status="partial_success"
- Partial succeeded + graceful=false → HTTP 500, status="partial_success"
- All failed + graceful=true → HTTP 200, status="failed" (best-effort)
- All failed + graceful=false → HTTP 500, status="failed" (strict mode)

**Per-Image Timeout**:
- `timeout` parameter in LifestyleImageInput applies to polling (not submit)
- Timeout triggered during `asyncio.wait_for(_poll_lifestyle_image_task(...), timeout)`
- Captured as `asyncio.TimeoutError`, result returned with status="failed", error="Generation timed out"
- No retry logic; timeouts are final

### Data Flow with Example

**Request**:
```json
{
  "asin": "B0123ABCDE",
  "title": "Premium Coffee Mug",
  "brand": "BrewCo",
  "description": "Insulated ceramic mug, 16oz, keeps drinks hot for 6 hours",
  "images": ["https://cdn.amazon.com/image1.jpg", "https://cdn.amazon.com/image2.jpg"],
  "num_images": 3,
  "model": "pro",
  "aspect_ratio": "16:9",
  "resolution": "2K",
  "graceful": true
}
```

**Phase 1 Execution**:
1. PromptManager.load("lifestyle_scenario_generation") → Template string
2. Fetch images via aiohttp (handles Amazon CDN blocks)
3. Encode images to base64
4. Call OpenAI Vision with template + images + function schema
5. Parse function response, extract 3 prompts
6. Example prompt: "A woman sitting at a wooden desk in morning sunlight, holding the coffee mug while reading emails, steam slightly visible, warm office lighting, candid photography style"

**Phase 2 Execution** (concurrent):
1. Submit prompt 1 → task_id_1 (Kie.ai nano-banana-pro)
2. Submit prompt 2 → task_id_2 (Kie.ai nano-banana-pro)
3. Submit prompt 3 → task_id_3 (Kie.ai nano-banana-pro)
4. Poll task_1 (5s intervals until success/fail/timeout)
   - State: waiting → queuing → generating → success
   - Return: https://kie-cdn.example.com/img_abc123.png
5. Poll task_2 (success)
   - Return: https://kie-cdn.example.com/img_def456.png
6. Poll task_3 (timeout after 120s, no completion)
   - Raise asyncio.TimeoutError → capture as failed result

**Response**:
```json
{
  "status": "partial_success",
  "asin": "B0123ABCDE",
  "num_requested": 3,
  "num_succeeded": 2,
  "num_failed": 1,
  "model_used": "pro",
  "results": [
    {
      "index": 0,
      "status": "success",
      "image_url": "https://kie-cdn.example.com/img_abc123.png",
      "scenario_prompt": "A woman sitting at a wooden desk...",
      "task_id": "task_id_1",
      "error": null,
      "generation_time_seconds": 45.2
    },
    {
      "index": 1,
      "status": "success",
      "image_url": "https://kie-cdn.example.com/img_def456.png",
      "scenario_prompt": "A person enjoying the mug in a cozy café...",
      "task_id": "task_id_2",
      "error": null,
      "generation_time_seconds": 38.7
    },
    {
      "index": 2,
      "status": "failed",
      "image_url": null,
      "scenario_prompt": "Family gathered for breakfast...",
      "task_id": "task_id_3",
      "error": "Generation timed out",
      "generation_time_seconds": 120.0
    }
  ],
  "total_generation_time_seconds": 121.5
}
```

HTTP Status: **206 Partial Content** (graceful=true + partial_success)

### Testing

**Test Script**: `scripts/testing/test_lifestyle_images.py`

**CLI Flags**:
- `--images` — Product image URLs (comma-separated, required)
- `--listing` — JSON file with listing data (alt to individual params)
- `--model` — 'standard' or 'pro' (default: 'standard')
- `--aspect-ratio` — Aspect ratio (default: '1:1')
- `--output-format` — 'png' or 'jpeg' (default: 'png')
- `--resolution` — Pro model only: '1K', '2K', '4K' (default: '2K')
- `--no-graceful` — Disable graceful degradation (fail-fast mode)
- `--timeout` — Per-image timeout in seconds (0 = unlimited, default: 0)

**Output Structure**:
```
results/lifestyle_images/{ASIN}_{timestamp}/
├── response.json                # Full API response
├── image_1.png                  # Downloaded images
├── image_2.png
└── metadata.json                # Prompts, task IDs, timing
```

**Example Execution**:
```bash
python scripts/testing/test_lifestyle_images.py \
  --images "https://cdn.amazon.com/img1.jpg,https://cdn.amazon.com/img2.jpg" \
  --title "Premium Coffee Mug" \
  --brand "BrewCo" \
  --model pro \
  --resolution 2K \
  --graceful
```

### Design Decisions

**One OpenAI Call vs N Parallel Vision Calls**:
- Token cost: 1 call with N images vs N calls with 1 image = significant savings
- Example: 5 images analyzed via function calling in 1 call is ~30-40% cheaper than 5 parallel calls
- Tradeoff: Sequential prompt generation (15-20s) vs faster Phase 2 parallelization

**Standard vs Pro Model Routing**:
- Automatic based on user request (no server-side override)
- Standard: Low latency, text-only, cost-optimized
- Pro: High quality, context-aware (sees product images), feature-rich (resolution, aspect_ratio)
- Selection transparent to client—endpoint returns which model was used

**Graceful Degradation Over Fail-Fast**:
- Partial results (4/6 images) more valuable than zero
- User gets immediate feedback (which images succeeded, why 1-2 failed)
- Timing data included to diagnose bottlenecks (Phase 1 slow? Phase 2 timeout?)
- Exception: Phase 1 failure is unrecoverable (no prompts = cannot proceed)

**Per-Image Timeout with No Retry**:
- Polling has finite deadline; timeouts are final
- Retry logic would double total wait time (not acceptable for interactive requests)
- Timeout triggering = individual image degradation, not cascade failure
- Per-image timeout allows fine-grained SLA (e.g., timeout=60 for mobile, timeout=300 for desktop)

**Polling Interval (5 seconds)**:
- Kie.ai typical generation: 30-90s
- 5s interval = ~6-18 polls (reasonable overhead)
- Faster polls (1s) add noise; slower polls (10s+) delay user feedback
- Configurable in code (`KIE_LIFESTYLE_POLL_INTERVAL`) if needed per deployment

### Performance Baseline

- **Phase 1 (Prompts)**: ~15-20s (OpenAI Vision call with images)
- **Phase 2 Per Image**: ~40-90s (submit + poll until completion)
- **Total for 3 Images**: ~15-20s + (max of 3 × 40-90s) = ~55-110s
- **Total for 6 Images**: ~15-20s + (max of 6 × 40-90s) = ~95-150s
- **Character Quality**: Standard model typically adequate for authentic lifestyle photography; Pro model recommended for specific brand guidance

### Notes

- **Authenticity Over Perfection**: Prompts explicitly ask for minor imperfections, shallow DOF, realistic clutter. This is intentional—cinematic perfection looks unnatural for lifestyle content.
- **Image URL Handling**: Standard model doesn't send images to Kie.ai (text-only); Pro model sends up to 8 URLs. Standard is faster, Pro is more context-aware.
- **TEST_MODE Support**: When enabled, mocks all OpenAI and Kie.ai calls (zero cost), returns plausible mock results for development/testing.
- **ASIN Logging**: Optional ASIN field used for file organization in test scripts and future analytics tracking.
- **Output Format Quirk**: Standard model accepts 'jpeg', Pro model requires 'jpg' (validator enforces per-model differences).

---

## Caching Strategy

### Image Analysis Response Cache
- **Key**: MD5(ASIN:title:image1:image2:image3:image4:image5)
- **TTL**: 1 hour
- **Max Entries**: 100 (LRU eviction)
- **Token Savings**: ~2-3k tokens per hit (100% savings vs re-analysis)
- **Hit Rate Target**: 10-30%

### No Vector Search Result Caching
- **Reason**: Query patterns too diverse (user-generated queries)
- **Alternative**: Let clients implement caching if needed

---

## Testing Modes

### TEST_MODE=true
- **Vector Service**: Returns mock search results (no Qdrant calls)
- **MySQL Service**: Returns mock listings/reviews (no database calls)
- **OpenAI API**: Returns mock embeddings/completions (no API calls)
- **Cost**: Zero (all mocks)
- **Use Case**: Development, CI/CD testing, quick iteration

### TEST_MODE=false
- **Vector Service**: Real Qdrant queries
- **MySQL Service**: Real database queries
- **OpenAI API**: Real API calls
- **Cost**: Per-operation (embeddings $0.02/1M tokens, GPT calls $0.01-0.10 per call)
- **Use Case**: Production, integration testing, quality assurance

---

## Future Considerations

### Vector Database
1. **Hybrid Search**: Combine semantic + keyword filtering (reduce false positives)
2. **Batch Operations**: Parallel ASIN fetching from MySQL (asyncio.gather for multiple ASINs)
3. **Vector Metadata Expansion**: Store additional fields in Qdrant payload (optional)
4. **Caching**: Cache MySQL fetches for 1 hour (reduce database load)

### RAG Integration
1. **RAG Synthesis**: Cluster results and synthesize per cluster (reduce token usage)
2. **Context Token Budget**: Limit injected context to max_context_tokens (avoid exceeding message limits)
3. **Streaming RAG**: Stream synthesis results as they become available
4. **A/B Testing**: Framework for testing different RAG strategies (full vs partial vs off)

### Chat Completions
1. **Function Calling**: Enable structured responses (JSON mode)
2. **Multi-Modal**: Support voice input/output (transcription + TTS)
3. **Long Context**: Support Claude with 200k context window for longer conversations

### Video Generation
1. **Parallel Scene Generation**: Generate 2-4 scenes in parallel (currently sequential)
2. **Advanced Merge Strategies**: Ken Burns effect, scene transitions beyond crossfades
3. **Character Consistency**: Fine-tune character generation for better realism
4. **Music Integration**: Auto-generate background music based on product/style

---

## Grep-Friendly Index

### Endpoints
- `/health` - Health check (new)
- `/ai/api/analyze_images` - Image analysis map-reduce
- `/ai/api/compare_images` - Competitive image analysis
- `/ai/api/validate_input` - Input validation
- `/ai/api/fetch_images` - Image fetching utility
- `/ai/api/generate_chat_completions` - Chat with RAG (modified)
- `/ai/api/upsert_data` - Unified vector upsert (new)
- `/ai/api/search_data` - Unified vector search (new)
- `/ai/api/retrieve_data/{asin}` - Unified vector retrieve (new)
- `/ai/api/delete_data/{asin}` - Unified vector delete (new)
- `/ai/api/generate_video` - Multi-scene video generation
- `/ai/api/generate_lifestyle_images` - Lifestyle image generation (1-6 images, nano-banana/pro)

### Services
- `src/services/image_service.py` - Low-level image operations
- `src/analyzers/image_analyzer.py` - Individual image analysis (map phase)
- `src/synthesizers/image_synthesizer.py` - Synthesis (reduce phase)
- `src/services/vector_service.py` - Qdrant operations (ASIN-only payloads)
- `src/services/mysql_service.py` - MySQL metadata retrieval
- `src/services/rag_service.py` - RAG orchestration
- `src/services/clustering_service.py` - Vector clustering (HDBSCAN)
- `src/services/video_service.py` - Video generation (Kie.ai Sora 2)
- `src/services/lifestyle_image_service.py` - Lifestyle image generation (Kie.ai nano-banana/pro)
- `src/synthesizers/rag_synthesizer.py` - RAG synthesis (themes, context, simple synthesis - Wave 2)

### Utilities
- `src/utils/asin_parser.py` - ASIN extraction from text
- `src/utils/review_intent.py` - Review intent detection (NEW - Wave 1)

### Database Scripts
- `scripts/utilities/setup_db.sql` - MySQL initialization
- `scripts/utilities/reset_mysql_db.py` - MySQL teardown
- `scripts/utilities/seed_listings_reviews_db.py` - MySQL seeding
- `scripts/utilities/seed_vector_db.py` - Qdrant seeding (with ASIN enrichment)
- `scripts/utilities/extract_seed_data.py` - Data validation
- `prompts/rag/review_keywords.txt` - 26 keywords for review intent detection (NEW - Wave 1)

### Testing
- `scripts/testing/utils.py` - Shared test utilities
- `scripts/testing/test_chat_completions.py` - Chat + RAG testing (RAG phase tracking: lines 185-202)
- `scripts/testing/test_vector_db.py` - Vector DB testing (ASIN-indexed)
- `scripts/testing/test_analysis.py` - Image analysis testing
- `scripts/testing/test_video.py` - Video generation testing
- `scripts/testing/test_collage.py` - Collage generation testing
- `scripts/testing/test_miscellaneous.py` - Comparison endpoints testing
- `scripts/testing/test_chat_agent.py` - Chat agent integration testing (RAG phase tracking: lines 236-253)
- `scripts/testing/test_lifestyle_images.py` - Lifestyle image generation testing

### Configuration
- `OPENAI_API_KEY` - OpenAI authentication
- `OPENAI_MODEL` - Default model (gpt-4o-mini)
- `TEST_MODE` - Mock vs real APIs
- `QDRANT_HOST` / `QDRANT_PORT` - Qdrant connection
- `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_USER` / `MYSQL_DATABASE` - MySQL connection
- `RAG_SIMILARITY_THRESHOLD` / `RAG_TOP_N_LISTINGS` - RAG parameters (Wave 3: `RAG_ENABLED` removed)
- `REQUEST_TIMEOUT_SECONDS` - Server timeout ceiling
- `TIMEOUT_CHAT_COMPLETIONS` - Chat endpoint timeout
- `TIMEOUT_RAG_SYNTHESIS` - Synthesis operation timeout
- `KIE_LIFESTYLE_STANDARD_MODEL` - Standard lifestyle model (default: google/nano-banana)
- `KIE_LIFESTYLE_PRO_MODEL` - Pro lifestyle model (default: nano-banana-pro)
- `RATE_LIMIT_LIFESTYLE_IMAGES` - Rate limit per IP per minute (default: 3)
- `TIMEOUT_LIFESTYLE_IMAGE` - Per-image polling timeout in seconds (default: 300)

---

## Wave 1 & 2 Improvements (2026-02-04 through 2026-02-06)

### Wave 1 (2026-02-04): Foundation
**Key Enhancements**:
1. Review Conditioning: ~60% reduction in review API calls via keyword-based intent detection
2. Simple Synthesis Path: Fallback when clustering insufficient (new `synthesize_simple_context()`)
3. Test Instrumentation: Phase tracking infrastructure in test_chat_completions.py

**Files Created/Modified**:
- `src/utils/review_intent.py` - NEW file for review intent detection
- `prompts/rag/review_keywords.txt` - NEW file with 26 keywords
- `prompts/rag/rag_simple_synthesis_prompt.txt` - NEW agent-facing prompt
- `src/synthesizers/rag_synthesizer.py` - New `synthesize_simple_context()` function
- `main.py` - Review conditioning integration (conditional review fetching)
- `scripts/testing/test_chat_completions.py` - Phase tracking (lines 185-202)

### Wave 2 (2026-02-06): Refinement & Optimization
**Key Enhancements**:
1. ASIN Sharpening: User-mentioned products injected into system prompt (≤5 ASINs)
2. Prompt Refactoring: All RAG synthesis prompts now agent-facing with structured output
3. Config Enhancement: `RAG_TOP_N_LISTINGS` increased from 5 → 25 for richer context
4. Test Instrumentation: Phase tracking in test_chat_agent.py

**Files Modified**:
- `config.py` - RAG_TOP_N_LISTINGS increased to 25
- `main.py` - ASIN parsing + system prompt injection, simple synthesis fallback refinement
- `prompts/rag/rag_theme_synthesis_prompt.txt` - Refactored to agent-facing
- `prompts/rag/rag_context_synthesis_prompt.txt` - Refactored to agent-facing
- `prompts/miscellaneous/chat_system_prompt_with_rag.txt` - Added ASIN prioritization instruction
- `scripts/testing/test_chat_agent.py` - Phase tracking (lines 236-253)

### Wave 3 (2026-02-10): Stability & Cleanup
**Key Enhancements**:
1. RAG Per-Request Activation: Removed global `RAG_ENABLED` toggle from config.py (RAG now activated solely via `rag_config` payload field)
2. Search Query Anchoring: Short/follow-up messages reuse most semantically rich prior message for vector search (prevents conversational drift)
3. Partial Mode Listing Blocks: Actual listing data instead of count-only strings (guards against unenriched MySQL stubs)
4. Configuration Cleanup: Removed dead `VECTOR_SIMILARITY_THRESHOLD` variable
5. Stability Marking: Full mode marked as WIP (not production-ready), Partial mode marked as stable/shippable
6. Prompt Enhancement: `chat_system_prompt_with_rag.txt` updated with directive to present listings immediately

**Files Modified**:
- `config.py` - Removed `RAG_ENABLED` global toggle
- `config.py` - Removed dead `VECTOR_SIMILARITY_THRESHOLD` variable
- `main.py` (Lines 1369-1376) - Added search_query anchoring logic for follow-up messages
- `main.py` (Partial Mode) - Changed synthesis from count-only to actual listing/review blocks
- `prompts/miscellaneous/chat_system_prompt_with_rag.txt` - Added directive for immediate data presentation

**Impact**:
- RAG mode determined entirely by client request (no server restart needed for on/off)
- Partial mode is now the recommended production path (stable, predictable, no clustering overhead)
- Full mode remains experimental (WIP) due to latency and clustering threshold issues
- Better semantic quality for follow-up conversations (query anchoring prevents conversational drift)
- LLM context now includes real listing data in partial mode (not just counts)

---

**Last Updated**: 2026-02-10
**Branch**: 02-04-2026-rag-refinement
**Documentation Status**: Wave 1, 2 & 3 RAG improvements documented (review conditioning, simple synthesis, ASIN sharpening, prompt refactoring, configuration optimization, search anchoring, partial mode stability)
