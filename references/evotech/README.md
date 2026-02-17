# Amazon Listing Analyzer API

## Current Status & Features (v1.14.0)

**Status**: All critical bugs resolved. System is production-ready with full character persistence, multi-scene support, end-to-end timing instrumentation, and context-aware Sora 2 model selection.

**Key Features:**
- Multi-duration video generation (15s, 30s, 45s, 60s) with character persistence
- UGC vs Showcase style support for tailored video generation
- Face detection filtering for content policy compliance
- Comprehensive debug logging for all operations
- **Context-aware Sora 2 model selection**: UGC with persistent character + 720p uses Pro; others follow resolution rule
- **Three-layer timeout architecture** with graceful degradation (206 Partial Content status)
- **End-to-end timing instrumentation** with 9 timestamp capture points
- Character ID reuse for consistent UGC videos across batches

See [`CHANGELOG.md`](CHANGELOG.md) for complete version history and resolved issues.

### Version Overview:
- **v1.14.0**: Three-layer timeout architecture and end-to-end timing instrumentation
- **v1.13.0**: Character generation and async fixes
- **v1.11.0**: Voiceover audio cutoff fix and CLI enhancements
- **v1.10.0**: Voiceover quality improvements
- **v1.9.0**: Detailed scenes workflow and face detection
- **v1.8.0**: Scene generation with voiceover and overlays
- **v1.7.0**: Sequential video generation with smart collages

### Core Features
- **Map-Reduce Image Analysis**: Individual image analysis (Map) + strategic synthesis (Reduce)
- **16 Analysis/Comparison/Video Endpoints**: Comprehensive listing evaluation and video generation
- **Review Cross-Referencing**: Validates if products deliver on listing promises
- **Priority-Ordered Suggestions**: Most critical issues surfaced first
- **Error Resilience**: Graceful degradation, retry logic, partial results on failures
- **GPT-5 Compatible**: Automatic temperature handling across model versions

## Project Overview

This API provides comprehensive AI-powered analysis of Amazon product listings using OpenAI's GPT models with a sophisticated two-phase map-reduce architecture. It evaluates various components of product listings including titles, descriptions, bullet points, images, reviews, SEO effectiveness, competitor positioning, and conversion strategies.

**Key Features:**
- **Two-Phase Analysis**: Individual image analysis (Map) followed by strategic synthesis (Reduce)
- **Error Resilience**: Retry logic, timeouts, and graceful degradation for maximum reliability
- **Concurrent Processing**: Parallel analysis with proper error handling and logging
- **Comprehensive Coverage**: Full listing analysis with comparison capabilities

**Tech Stack:**
- **FastAPI** - Modern async web framework with automatic API docs
- **OpenAI API** - GPT-4 Vision and GPT-3.5/4/5 for AI analysis
- **Pydantic** - Data validation and schema enforcement
- **aiohttp** - Async HTTP requests for concurrent image fetching
- **Pillow** - Image preprocessing and manipulation
- **slowapi** - Per-IP rate limiting
- **cachetools** - In-memory response caching

## Quick Start

Get the API running in 5 minutes:

**1. Install dependencies**:
```bash
pip install -r requirements.txt
```

**2. Configure environment**:
```bash
cp .env.example .env
# Edit .env and set OPENAI_API_KEY
```

**3. Start the server**:
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**4. Access the API**:
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

For full setup with databases (MySQL, Qdrant) and RAG features, see **Setup Instructions** below.

## Setup Instructions

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Required Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional Configuration
TEST_MODE=false                    # Set to "true" for mock responses (no API costs)
OPENAI_MODEL=gpt-4o-mini           # Text analysis model (Options: gpt-3.5-turbo, gpt-4, gpt-4o-mini, gpt-5)
VISION_MODEL=gpt-4o-mini           # Vision model for face detection and frame analysis
API_ROUTE=/ai/api                  # Base path for all endpoints

# Rate Limiting (requests per minute, per IP)
RATE_LIMIT_IMAGES=5                # Image analysis endpoints
RATE_LIMIT_ANALYZE=20              # Text analysis endpoints
RATE_LIMIT_COMPARE=10              # Comparison endpoints
RATE_LIMIT_CHAT=15                 # Chat completions endpoint

# Kie.ai Video Generation (Sora 2 Image-to-Video with Resolution-Based Model Selection)
KIE_API_KEY=your_kie_api_key_here
KIE_MODEL=sora-2-image-to-video    # 720p model (Pro: sora-2-pro-image-to-video for 1080p)
KIE_ASPECT_RATIO=landscape         # Options: landscape, portrait
KIE_N_FRAMES=10                    # Options: 10 (10s), 15 (15s)
KIE_TIMEOUT=600                    # Video generation timeout in seconds
VIDEO_OUTPUT_DIR=generated_videos  # Directory for generated videos
VIDEO_DURATION=15                  # Default duration: 15, 30, 45, or 60 seconds
VIDEO_RESOLUTION=1080p             # Default resolution: 720p or 1080p (auto-selects Pro model for 1080p)

# Kie.ai Lifestyle Image Generation (Nano-Banana / Nano-Banana-Pro)
KIE_LIFESTYLE_STANDARD_MODEL=google/nano-banana       # Standard model (text-only scenario prompts)
KIE_LIFESTYLE_PRO_MODEL=nano-banana-pro               # Pro model (image-aware scenario prompts)
RATE_LIMIT_LIFESTYLE_IMAGES=3                         # Lifestyle image endpoint rate limit (per IP/minute)
TIMEOUT_LIFESTYLE_IMAGE=300                           # Per-image polling timeout in seconds

# Timeout Configuration (Three-Layer Architecture)
REQUEST_TIMEOUT_SECONDS=900        # Layer 1: Server timeout (uvicorn safety net, 15 minutes)
TIMEOUT_GENERATE_SCRIPT=300        # Layer 2: Endpoint timeout for script generation (5 minutes)

# Vector Database (Qdrant) Configuration
QDRANT_HOST=localhost              # Qdrant server hostname
QDRANT_PORT=6333                   # Qdrant server port
QDRANT_COLLECTION_NAME=amazon_listings       # Listings vector collection
QDRANT_REVIEWS_COLLECTION_NAME=amazon_reviews # Reviews vector collection

# MySQL Configuration
MYSQL_HOST=localhost               # MySQL server hostname
MYSQL_PORT=3306                    # MySQL server port
MYSQL_USER=uce_tools_user          # MySQL user
MYSQL_PASSWORD=uce_tools_pass_2026 # MySQL password
MYSQL_DATABASE=amazon_listings     # MySQL database name

# RAG (Retrieval-Augmented Generation) Configuration
RAG_SIMILARITY_THRESHOLD=0.3       # Vector search similarity threshold (0.0-1.0)
RAG_TOP_N_LISTINGS=25              # Max listings to retrieve per search (increased for richer synthesis)
RAG_MIN_CLUSTERS=3                 # Minimum clusters to trigger full synthesis
RAG_SYNTHESIS_MODEL=gpt-4o-mini    # Dedicated model for RAG synthesis
TIMEOUT_RAG_RETRIEVAL=30           # Vector search timeout (seconds)
TIMEOUT_RAG_SYNTHESIS=60           # RAG synthesis timeout (seconds)
TIMEOUT_CHAT_COMPLETIONS=120       # Total chat completions endpoint timeout (seconds)
```

**Configuration Details:**

| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | *Required* | - |
| `TEST_MODE` | Use mock responses (no API calls) | `false` | `true`, `false` |
| `OPENAI_MODEL` | Model for text analysis and synthesis | `gpt-4o-mini` | `gpt-3.5-turbo`, `gpt-4`, `gpt-4o-mini`, `gpt-5` |
| `VISION_MODEL` | Model for face detection and frame analysis | `gpt-4o-mini` | `gpt-3.5-turbo`, `gpt-4`, `gpt-4o-mini`, `gpt-5` |
| `API_ROUTE` | Base path for all API endpoints | `/ai/api` | Any valid path |
| `RATE_LIMIT_IMAGES` | Image endpoint rate limit (per IP/minute) | `5` | Integer |
| `RATE_LIMIT_ANALYZE` | Analysis endpoint rate limit (per IP/minute) | `20` | Integer |
| `RATE_LIMIT_COMPARE` | Comparison endpoint rate limit (per IP/minute) | `10` | Integer |
| `RATE_LIMIT_CHAT` | Chat completions endpoint rate limit (per IP/minute) | `15` | Integer |
| `KIE_API_KEY` | Kie.ai API key (for video generation) | *Required* | Get from https://kie.ai/api-key |
| `KIE_MODEL` | Kie.ai model (legacy, not used) | `sora-2-image-to-video` | Ignored (context-aware selection active) |
| `KIE_ASPECT_RATIO` | Video aspect ratio | `landscape` | `landscape`, `portrait` |
| `KIE_N_FRAMES` | Video duration in seconds | `10` | `10`, `15` |
| `KIE_TIMEOUT` | Video generation timeout (seconds) | `600` | Integer |
| `VIDEO_OUTPUT_DIR` | Directory for generated videos | `generated_videos` | Any valid path |
| `VIDEO_DURATION` | Default video duration (seconds) | `15` | `15`, `30`, `45`, `60` |
| `VIDEO_RESOLUTION` | Default video resolution | `1080p` | `720p`, `1080p` (model auto-selected based on context) |
| `KIE_LIFESTYLE_STANDARD_MODEL` | Lifestyle standard model (text prompts) | `google/nano-banana` | String |
| `KIE_LIFESTYLE_PRO_MODEL` | Lifestyle pro model (image-aware prompts) | `nano-banana-pro` | String |
| `RATE_LIMIT_LIFESTYLE_IMAGES` | Lifestyle image endpoint rate limit (per IP/minute) | `3` | Integer |
| `TIMEOUT_LIFESTYLE_IMAGE` | Per-image polling timeout (seconds) | `300` | Integer (seconds) |
| `REQUEST_TIMEOUT_SECONDS` | Server timeout (uvicorn safety net) | `900` | Integer (seconds) |
| `TIMEOUT_GENERATE_SCRIPT` | Endpoint timeout for script generation | `300` | Integer (seconds) |
| `ENABLE_FACE_DETECTION_FOR_PRODUCTS` | Filter faces from product images | `true` | `true`, `false` |
| `CROSSFADE_DURATION` | Scene transition duration (seconds) | `0.5` | `0.1` - `2.0` |
| `FRAMES_PER_SCENE` | Frames extracted per scene | `6` | `1` - `10` |
| `COLLAGE_QUALITY` | JPEG quality for collages | `90` | `50` - `100` |
| `QDRANT_HOST` | Qdrant server hostname | `localhost` | Hostname or IP |
| `QDRANT_PORT` | Qdrant server port | `6333` | Integer port |
| `QDRANT_COLLECTION_NAME` | Listings collection name | `amazon_listings` | String |
| `QDRANT_REVIEWS_COLLECTION_NAME` | Reviews collection name | `amazon_reviews` | String |
| `MYSQL_HOST` | MySQL server hostname | `localhost` | Hostname or IP |
| `MYSQL_PORT` | MySQL server port | `3306` | Integer port |
| `MYSQL_USER` | MySQL username | `uce_tools_user` | String |
| `MYSQL_PASSWORD` | MySQL password | `uce_tools_pass_2026` | String |
| `MYSQL_DATABASE` | MySQL database name | `amazon_listings` | String |
| `RAG_SIMILARITY_THRESHOLD` | Vector search similarity threshold | `0.3` | `0.0` - `1.0` |
| `RAG_TOP_N_LISTINGS` | Max listings per search | `25` | Integer (increased for richer synthesis) |
| `RAG_MIN_CLUSTERS` | Min clusters for full synthesis | `3` | Integer |
| `RAG_SYNTHESIS_MODEL` | Model for RAG synthesis | `gpt-4o-mini` | `gpt-4o-mini`, `gpt-4`, etc. |
| `TIMEOUT_RAG_RETRIEVAL` | RAG retrieval timeout (seconds) | `30` | Integer |
| `TIMEOUT_RAG_SYNTHESIS` | RAG synthesis timeout (seconds) | `60` | Integer |
| `TIMEOUT_CHAT_COMPLETIONS` | Chat endpoint timeout (seconds) | `120` | Integer |

**Note:** Model compatibility is automatic - temperature parameters are included for GPT-3.5/GPT-4/GPT-4o-mini and omitted for GPT-5. VISION_MODEL can be set independently to optimize cost and performance for vision tasks. RAG is enabled per-request via `rag_config` parameter (no server-level toggle needed).

### Installation

**Requirements:**
- Python 3.12 or higher
- pip (Python package manager)

**Steps:**

1. **Clone the repository** (or download the source code)

2. **Create and activate a virtual environment:**
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate (Windows)
   venv\Scripts\activate

   # Activate (Unix/Mac/Linux)
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   # Upgrade pip first (recommended)
   python -m pip install --upgrade pip

   # Install all dependencies
   pip install -r requirements.txt
   ```

**Troubleshooting:**
- **Build errors** with `greenlet` or `pydantic_core`: Ensure Python 3.12+ is installed
- **Encoding errors** on Windows: Ensure your terminal supports UTF-8
- **Import errors**: Verify virtual environment is activated before running the server

### MySQL Database Setup

The system uses MySQL to store full listing and review metadata. Follow these steps to initialize the database:

**1. Start MySQL Service**

```bash
# On Linux/Mac with Homebrew
brew services start mysql

# On Linux with systemd
sudo systemctl start mysql

# On Windows
# MySQL service starts automatically if installed
```

**2. Initialize Database Schema**

```bash
# Run the initialization script (uses sudo for MySQL access)
sudo mysql < scripts/utilities/setup_db.sql
```

This script creates:
- Database: `amazon_listings`
- User: `uce_tools_user@localhost` with password `uce_tools_pass_2026`
- Necessary tables for listings and reviews

**3. Verify MySQL Connection**

```bash
mysql -u uce_tools_user -p amazon_listings -e "SELECT 1;"
# Enter password: uce_tools_pass_2026
```

Expected output: `1` (indicates successful connection)

### Utility Scripts - How to Use

The `/scripts/utilities/` folder contains essential database management and initialization tools. Use these to set up, seed, reset, and manage the MySQL and Qdrant databases.

#### 1. setup_db.sql — MySQL Database Initialization

**Purpose**: Creates the MySQL database, user, and grants privileges for the application.

**Usage**:
```bash
sudo mysql < scripts/utilities/setup_db.sql
```

**What it does**:
- Creates database: `amazon_listings`
- Creates user: `uce_tools_user@localhost` (password: `uce_tools_pass_2026`)
- Grants full privileges on the database
- Ready for table creation via seeding scripts

**One-time setup** (run before any seeding).

---

#### 2. seed_mysql_db.py — Populate MySQL with Listings and Reviews

**Purpose**: Seeds MySQL `top_listings` and `top_reviews` tables from JSON files.

**Supports two data formats**:
- **ProductScraper JSON**: Raw scraper output with nested reviews in listings (structure: `visited_links[].data`)
- **PHPMyAdmin Export**: Exported table structure (flat arrays with ASIN linking)

**Usage with single files**:
```bash
# Seed listings only
python scripts/utilities/seed_mysql_db.py --listings data/sample_seed_data/amazon_listings.json

# Seed listings and reviews together
python scripts/utilities/seed_mysql_db.py \
  --listings data/sample_seed_data/amazon_listings.json \
  --reviews data/sample_seed_data/amazon_listing_reviews.json
```

**Usage with folders** (scans recursively for all .json files):
```bash
# Seed all ProductScraper files from a directory
python scripts/utilities/seed_mysql_db.py --listings data/seed_data/

# Combine ProductScraper listings with separate PHPMyAdmin reviews
python scripts/utilities/seed_mysql_db.py \
  --listings data/seed_data/ \
  --reviews data/sample_seed_data/amazon_listing_reviews.json
```

**Output**:
- `top_listings` table: ASIN (primary key), title, description, brand, price, rating, review_count
- `top_reviews` table: review_id, ASIN (foreign key), rating, comment, timestamp

**Data source options**:
- `data/seed_data/`: ProductScraper format (raw scraper output with nested reviews)
- `data/sample_seed_data/`: PHPMyAdmin export format (amazon_listings.json, amazon_listing_reviews.json)

---

#### 3. seed_vector_db.py — Populate Qdrant with Embeddings

**Purpose**: Generates semantic embeddings and seeds Qdrant collections for vector search.

**Requirements**:
- MySQL must be populated first (via `seed_mysql_db.py`)
- Qdrant server running (`docker run -p 6333:6333 qdrant/qdrant:latest`)
- OpenAI API key configured (for embedding generation)

**Usage with single files**:
```bash
# Seed from sample data
python scripts/utilities/seed_vector_db.py \
  --listings data/sample_seed_data/amazon_listings.json \
  --reviews data/sample_seed_data/amazon_listing_reviews.json
```

**Usage with folders**:
```bash
# Seed all ProductScraper files
python scripts/utilities/seed_vector_db.py --listings data/seed_data/

# Combine multiple sources
python scripts/utilities/seed_vector_db.py \
  --listings data/seed_data/ \
  --reviews data/sample_seed_data/amazon_listing_reviews.json
```

**Output**:
- Creates/updates Qdrant collections:
  - `amazon_listings`: Vector embeddings of product titles + descriptions
  - `amazon_reviews`: Vector embeddings of review comments
- Stores ASIN-only payloads in Qdrant (minimal storage)
- Full metadata retrieved from MySQL on search

**Cost**: ~$0.02 per 1M tokens (one-time embedding generation)

---

#### 4. reset_mysql_db.py — Drop MySQL Tables or Database

**Purpose**: Clean up MySQL data for development/testing.

**Usage — Drop tables only** (preserve database):
```bash
python scripts/utilities/reset_mysql_db.py
```

This deletes `top_listings` and `top_reviews` tables but keeps the database intact. Safe for repeated reseeding.

**Usage — Full teardown** (drop entire database):
```bash
python scripts/utilities/reset_mysql_db.py --full
```

Drops the entire `amazon_listings` database. Requires re-running `setup_db.sql` to recreate.

---

#### 5. reset_vector_dbs.py — Reset Qdrant Collections

**Purpose**: Clears Qdrant vector collections for fresh seeding.

**Usage**:
```bash
python scripts/utilities/reset_vector_dbs.py
```

Deletes both collections:
- `amazon_listings`
- `amazon_reviews`

Run before reseeding with `seed_vector_db.py`.

---

#### 6. initialize_vector_db.py — Create Qdrant Collections

**Purpose**: Initializes empty Qdrant collections (used by seeding scripts internally).

**Usage**:
```bash
python scripts/utilities/initialize_vector_db.py
```

**Typical workflow**: Not usually called directly; `seed_vector_db.py` calls this automatically. Use if collections need to be recreated without re-embedding data.

---

#### Data Source Options

Two main sources for seed data (both supported):

| Source | Format | Location | Use Case |
|--------|--------|----------|----------|
| **ProductScraper** | Raw scraper output, nested reviews in listings | `data/seed_data/ProductScraper_*.json` | Fresh product scraping results |
| **PHPMyAdmin Export** | Flat structure, ASIN-linked reviews | `data/sample_seed_data/amazon_listings.json`, `amazon_listing_reviews.json` | Pre-curated listings/reviews |

Both formats are automatically detected and handled by `seed_mysql_db.py` and `seed_vector_db.py`.

---

### Qdrant Vector Database Setup

The system uses Qdrant for semantic vector search of listings and reviews. Follow these steps to set up Qdrant:

**1. Start Qdrant Server**

Using Docker (recommended):

```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest
```

Qdrant will be available at `http://localhost:6333`

**2. Seed Vector Database**

After MySQL is populated, seed the vector database:

```bash
# Seed Qdrant with embeddings from MySQL data
python scripts/utilities/seed_vector_db.py \
  --listings data/listings.json \
  --reviews data/reviews.json
```

This script:
- Generates semantic embeddings for listing titles and descriptions
- Creates two Qdrant collections:
  - `amazon_listings`: Searchable product listings
  - `amazon_reviews`: Searchable customer reviews
- Stores minimal ASIN-only payloads (full data lives in MySQL)
- Enriches reviews with ASIN for proper linking

**3. Verify Vector Database**

```bash
# Test vector search with a sample query
python scripts/testing/test_vector_db.py --num-listings 1
```

### Running the API

Start the server with uvicorn:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000
```

The API will be available at:
- **API Base**: `http://localhost:8000{API_ROUTE}` (default: `http://localhost:8000/ai/api`)
- **Interactive Docs**: `http://localhost:8000/docs` (Swagger UI)
- **Alternative Docs**: `http://localhost:8000/redoc` (ReDoc)

**Production Deployment:**
```bash
# With auto-reload disabled and multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### RAG Integration (Retrieval-Augmented Generation)

RAG (Retrieval-Augmented Generation) grounds chat completions in semantically similar Amazon listings and reviews from your database. This provides concrete product context for better, data-driven responses.

#### How RAG Works

1. User asks a question in chat
2. System extracts mentioned ASINs from the query (regex: `B[0-9A-Z]{9}`)
3. Vector search finds semantically similar products in Qdrant (COSINE distance)
4. MySQL retrieves full metadata for matching products (title, description, brand, rating, etc.)
5. Optionally fetches reviews for context (intelligent intent detection)
6. Results are synthesized and injected into the system prompt
7. Chat model generates response with product-specific context

#### RAG Modes: Partial (Stable) vs Full (WIP)

**PARTIAL MODE** — Production-Ready

- **Status**: Stable and shippable
- **Process**: Simple threshold-based filtering + top-N retrieval
- **Speed**: <100ms vector search + <500ms MySQL enrichment
- **Cost**: Minimal (no synthesis overhead)
- **Use case**: User queries that need basic product context
- **Configuration**: `integration_mode: "partial"`

**FULL MODE** — Work in Progress

- **Status**: Experimental; use with caution in production
- **Process**: Clustering (HDBSCAN) + multi-phase synthesis with theme generation
- **Speed**: 30-60s (includes synthesis latency)
- **Cost**: Higher (synthesis = 2-3 extra API calls per request)
- **Use case**: Complex queries needing thematic product grouping and analysis
- **Configuration**: `integration_mode: "full"`
- **Known limitations**: Synthesis can timeout on large datasets; clustering may fail if insufficient data

#### Enabling RAG

RAG is **enabled per-request** (no server restart needed) by including the `rag_config` parameter in the request:

```bash
curl -X POST http://localhost:8000/ai/api/generate_chat_completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "What products are similar to B0CSXV3GK4?"}],
    "rag_config": {
      "integration_mode": "partial",
      "top_n": 5,
      "threshold": 0.3
    }
  }'
```

**Omitting `rag_config`**: Chat completions run without RAG (pure language model, no product context).

#### Testing RAG

```bash
# Interactive chat testing (choose endpoints interactively)
python scripts/testing/test_chat_completions.py

# Test RAG in partial mode (recommended for stability)
python scripts/testing/test_chat_completions.py \
  --num-conversations 1 \
  --chat-rag true \
  --rag-mode partial

# Test RAG in full mode (experimental)
python scripts/testing/test_chat_completions.py \
  --num-conversations 1 \
  --chat-rag true \
  --rag-mode full

# Debug mode (bypass threshold, get all results)
python scripts/testing/test_chat_completions.py \
  --num-conversations 1 \
  --chat-rag true \
  --debug true

# Headless mode with custom query
python scripts/testing/test_chat_completions.py --prompt "Compare products B0CSXV3GK4 and B09LYF2ST7"
```

**Response Metadata**:

With RAG enabled, responses include `rag_metadata`:

```json
{
  "message": "...",
  "rag_metadata": {
    "status": "full",
    "listings_count": 5,
    "reviews_count": 12,
    "cluster_count": 2,
    "themes": {
      "0": "Premium Wireless Headphones",
      "1": "Budget Audio Solutions"
    }
  },
  "debug_top_listings": [
    {
      "asin": "B0CSXV3GK4",
      "score": 0.85,
      "title": "Premium Wireless Headphones",
      "description": "..."
    }
  ]
}
```

### Three-Layer Timeout Architecture

The API implements a **three-layer timeout system** to handle long-running video generation operations gracefully:

**Layer 1 (Server-Level)**: `REQUEST_TIMEOUT_SECONDS` environment variable
- uvicorn safety net (default: 900s / 15 minutes)
- Prevents indefinite connections to the server
- Applies to all requests uniformly
- Set via environment: `REQUEST_TIMEOUT_SECONDS=900 uvicorn main:app`

**Layer 2 (Endpoint-Level)**: Endpoint-specific timeout constants in `config.py`
- Controls how long each endpoint waits before graceful degradation
- Examples:
  - `TIMEOUT_GENERATE_SCRIPT=300` (5 min for script generation)
  - `TIMEOUT_ANALYZE_IMAGES=240` (4 min for image analysis)
- Built into FastAPI request processing

**Layer 3 (Client-Level)**: `timeout` parameter in `/generate_video` request
- Client specifies how long to wait for video generation
- `0` = no timeout, operation continues until completion
- Positive integer = max seconds to wait
- If exceeded, returns **206 Partial Content** with progress made so far
- Useful for testing long-duration videos (30-60s) without blocking indefinitely

**Example Server Startup with Timeout Configuration:**
```bash
# Set server timeout to 20 minutes for very long videos
REQUEST_TIMEOUT_SECONDS=1200 uvicorn main:app --host 0.0.0.0 --port 8000
```

**Graceful Degradation Behavior (v1.14.0)**:

When timeout is exceeded:

**With `graceful=true` (default)**:
- Returns **206 Partial Content** HTTP status
- Response includes: all completed `scene_paths`, `timing` data, `timing_summary`
- `s3_url` and `s3_key` are null (final merge/upload didn't complete)
- Clients can use partial video (individual scene files) or retry with longer timeout
```json
{
  "status": "partial_success",
  "message": "Video generation timed out. Partial results may be available.",
  "s3_url": null,
  "scene_paths": ["generated_videos/B0BHJJ9Y77_scene1.mp4", "generated_videos/B0BHJJ9Y77_scene2.mp4"],
  "num_scenes": 2,
  "error": "Video generation timed out after 60 seconds",
  "timing_summary": {
    "script_generation_duration": 6.21,
    "scene_generation_duration": 65.32,
    "merge_duration": 0.0,
    "s3_upload_duration": 0.0,
    "total_duration": 71.53
  }
}
```

**With `graceful=false`**:
- Returns **500 Server Error** HTTP status
- No partial results - transaction fails completely
- Useful for strict requirements where partial video is not acceptable
```json
{
  "detail": "Video generation timed out after 60 seconds"
}
```

This approach lets you:
- Test long-duration videos without waiting hours (`graceful=true`)
- Get partial results instead of failures (`graceful=true`)
- Diagnose performance bottlenecks using timing data
- Choose strict or permissive behavior based on use case

## API Endpoints

The API is organized into clusters of related functionality. All endpoints use FastAPI's automatic validation and include rate limiting via `slowapi` (per-IP enforcement).

### Image Analysis (Map-Reduce Pattern)

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/analyze_images` | `ListingInput` | `ImageAnalysisResponse` | 5/minute | **Map-Reduce Image Analysis**: Individual image analysis in parallel (Map phase) + strategic synthesis (Reduce phase) combining main image, image stack, and holistic recommendations. Caches results for 1 hour using MD5 hash of listing content. |
| POST | `{API_ROUTE}/compare_images` | `ComparisonInput` | `ComparisonResult` | 5/minute | Competitive image strategy comparison with strengths, gaps, and action items. Single API call with manual message construction. |

**Caching Note**: The `/analyze_images` endpoint uses a 1-hour TTL cache (max 100 entries) with key = MD5(ASIN:title:image_urls). Cache hits return instantly (< 1ms) with 100% token savings. Cache misses take 90-120s (typical: 60-90s map phase + 10-30s reduce phase).

### Input Validation & Utilities

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/validate_input` | `ListingInput` | JSON object with valid, errors | No limit | Validates listing input structure (ASIN, title, images non-empty). No API calls, pure Python validation. |
| POST | `/fetch_images` | `ListingInput` | JSON object with total_images, fetched | No limit | Tests whether image URLs are accessible. Parallel fetch validation without downloading full content. |

### Validation & Script Generation

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/validate_rufus` | `RufusValidationInput` | `RufusValidationResponse` | 20/minute | **Concurrent batch validation** of Rufus Q&A answer quality. Validates 1-50 question-answer pairs in parallel using temperature 0.2 for deterministic evaluation. |
| POST | `{API_ROUTE}/generate_promotion_script` | `PromotionScriptInput` | `PromotionScriptResponse` | 20/minute | **Style-aware video script generation** for UGC or Showcase styles. Generates 1-4 detailed scenes with voiceover, camera directions, and text overlays. Uses temperature 0.6 for creative storytelling. Optional character name passthrough for brand consistency. |

### Video Generation

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/generate_video` | `VideoGenerationInput` | `VideoGenerationResponse` | 2/minute | **Multi-scene video generation** using Kie.ai Sora 2 Image-to-Video API. Supports 15-60 second videos (auto-split into 15s scenes). Includes three-layer timeout architecture, graceful degradation (206 Partial Content on timeout), automatic S3 upload, and end-to-end timing instrumentation with 9 timestamp capture points. |

### Lifestyle Image Generation

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/generate_lifestyle_images` | `LifestyleImageInput` | `LifestyleImageResponse` | 3/minute | **Generate 1-6 lifestyle product images** using Kie.ai nano-banana models. Accepts standard (text-only) or Pro (image-aware) model. Two-phase generation: OpenAI Vision generates N scenario prompts from product context (one call), then N concurrent Kie.ai generations create lifestyle images. Returns partial results on failure (graceful=true, 206 Partial Content). Supports TEST_MODE for mock generation without API costs. |

### Chat Completions

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/generate_chat_completions` | `ChatCompletionInput` | `ChatCompletionResponse` | 15/minute | General-purpose chat completions using gpt-5-nano. Returns AI response message with token usage metadata and request tracking (request_id, timestamp). Accepts conversation history as messages array (system/user/assistant roles). Auto-loads system prompt from `prompts/miscellaneous/chat_system_prompt.txt`. |

**Example Request:**
```json
{
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ]
}
```

**Example Response:**
```json
{
  "message": "The capital of France is Paris.",
  "tokens_used": 42,
  "model": "gpt-5-nano",
  "timestamp": "2026-01-17T14:32:15.123456",
  "request_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Test Data & CLI Usage:**

The testing suite includes chat completions support for testing conversation-based workflows:

```bash
# Interactive chat completions test (prompts for selection)
python scripts/testing/test.py

# CLI mode (test N chat conversations)
python scripts/testing/test.py --chat-conversations 2
```

**Test Data Location:** `data/chat_completions_data/` (contains `.json` files with conversation message arrays)

**Test Results:** `results/chat_completions/` (organized with timestamp-based filenames)

**System Prompt:** Automatically loaded from `prompts/miscellaneous/chat_system_prompt.txt` (can be customized for different use cases)

### Vector Database & Semantic Search

Semantic search on Amazon listings and reviews via Qdrant vector database with MySQL for full metadata. Enables similarity-based discovery with ASIN-only payloads for scalable vector storage.

**Unified Vector Endpoints (4 total):**

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/upsert_data` | `UpsertDataRequest` (data_type, data) | `{success: bool, message: str}` | 20/minute | Upsert listing or review. For listings: embeds title+description, stores ASIN-only payload in Qdrant, full metadata in MySQL. For reviews: embeds comment, requires ASIN field for linking. |
| POST | `{API_ROUTE}/search_data` | `SearchDataRequest` (data_type, query_text, top_n, threshold) | `SearchDataResponse` (results, query, total_found) | 20/minute | Semantic search for similar listings or reviews. Embeds query, searches Qdrant with COSINE distance (threshold default 0.3). Returns [{asin, score}, ...] for listings or [{asin, review_id, score}, ...] for reviews. Full metadata fetched from MySQL. |
| GET | `{API_ROUTE}/retrieve_data/{asin}` | Query params: data_type, review_id (if review) | Full listing/review dict or 404 | 20/minute | Retrieve full listing or review by ASIN (and review_id if review). Verifies existence in Qdrant, fetches complete metadata from MySQL. |
| DELETE | `{API_ROUTE}/delete_data/{asin}` | Query params: data_type, review_id (if review) | `{success: bool, message: str}` | 20/minute | Delete listing or review from Qdrant. Idempotent: deleting non-existent items returns success. |

**Architecture: Qdrant + MySQL Hybrid**

The system stores vector embeddings in Qdrant (fast search, minimal storage) and full metadata in MySQL (comprehensive data, relational queries):

- **Qdrant Payloads**: ASIN only (minimal, ~100 bytes per vector)
- **MySQL Storage**: Full listing/review metadata (title, description, brand, reviews, ratings, etc.)
- **Search Flow**: Query → Qdrant vector search (fast) → Extract ASINs → MySQL fetch (comprehensive data)

**Configuration:**

```python
# Qdrant vector database
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333
QDRANT_COLLECTION_NAME = "amazon_listings"
QDRANT_REVIEWS_COLLECTION_NAME = "amazon_reviews"

# OpenAI embeddings
EMBEDDING_MODEL = "text-embedding-3-small"  # 1536-dim vectors
VECTOR_SIMILARITY_THRESHOLD = 0.3            # Default search threshold (permissive)

# MySQL for full metadata
MYSQL_HOST = "localhost"
MYSQL_USER = "uce_tools_user"
MYSQL_DATABASE = "amazon_listings"
```

**Database Scripts:**

- `scripts/utilities/setup_db.sql`: Initialize MySQL database and user
- `scripts/utilities/seed_listings_reviews_db.py`: Populate MySQL with listings and reviews
- `scripts/utilities/seed_vector_db.py`: Seed Qdrant with embeddings (ASIN-enriched)
- `scripts/utilities/reset_mysql_db.py`: Reset MySQL (drop tables or full teardown)

**Example Request (Upsert Listing):**
```json
POST /ai/api/upsert_data
{
  "data_type": "listing",
  "data": {
    "asin": "B0B1X2Y3Z4",
    "title": "Premium Wireless Headphones",
    "description": "High-quality audio with noise cancellation",
    "brand": "TechBrand",
    "price": 79.99,
    "rating": 4.5,
    "review_count": 245
  }
}
```

**Example Request (Search Listings):**
```json
POST /ai/api/search_data
{
  "data_type": "listing",
  "query_text": "best wireless headphones under $100",
  "top_n": 10,
  "threshold": 0.3
}
```

**Example Response (Search Results with MySQL Enrichment):**
```json
{
  "results": [
    {
      "asin": "B0B1X2Y3Z4",
      "score": 0.87,
      "title": "Premium Wireless Headphones",
      "description": "High-quality audio with noise cancellation",
      "brand": "TechBrand",
      "price": 79.99,
      "rating": 4.5,
      "review_count": 245
    }
  ],
  "query": "best wireless headphones under $100",
  "total_found": 1
}
```

### Text Analysis (Templating + OpenAI Function Calling)

**Analysis Endpoints (6 total):**

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/analyze_title` | `ListingInput` | `TitleAnalysisResult` | 20/minute | Title optimization with 3-5 alternative titles using structured AI analysis |
| POST | `{API_ROUTE}/analyze_reviews` | `ListingInput` | `ReviewAnalysisResponse` | 20/minute | Structured review theme extraction with title + detailed description (5 positive, 5 negative max) |
| POST | `{API_ROUTE}/analyze_bullet_points` | `ListingInput` | `AnalysisResult` | 20/minute | Bullet point analysis identifying gaps and actionable suggestions |
| POST | `{API_ROUTE}/analyze_description` | `ListingInput` | `DescriptionAnalysisResult` | 20/minute | Description analysis with complete optimized rewrite |
| POST | `{API_ROUTE}/analyze_seo` | `ListingInput` | `AnalysisResult` | 20/minute | SEO keyword and search ranking optimization analysis |
| POST | `{API_ROUTE}/analyze_competitor` | `ListingInput` | JSON object | 20/minute | Competitive positioning analysis with key differentiators |
| POST | `{API_ROUTE}/analyze_conversion_strategy` | `ListingInput` | JSON object | 20/minute | Conversion strategy recommendations based on listing analysis |

**Comparison Endpoints (4 total):**

| Method | Path | Request Body | Response | Rate Limit | Description |
|--------|------|--------------|----------|------------|-------------|
| POST | `{API_ROUTE}/compare_title` | `ComparisonInput` | `ComparisonResult` | 10/minute | Comparative title analysis: your strengths vs competitor strengths |
| POST | `{API_ROUTE}/compare_description` | `ComparisonInput` | `ComparisonResult` | 10/minute | Comparative description strategy analysis |
| POST | `{API_ROUTE}/compare_seo` | `ComparisonInput` | `ComparisonResult` | 10/minute | Comparative SEO effectiveness and keyword coverage |
| POST | `{API_ROUTE}/compare_bullet_points` | `ComparisonInput` | `BulletPointsComparisonResult` | 10/minute | Comparative bullet point strategy with standouts identified |

#### /validate_rufus Endpoint

The `/validate_rufus` endpoint validates whether Amazon's Rufus AI properly answered customer questions. It performs concurrent batch validation of multiple question-answer pairs in parallel using OpenAI API with the validate_rufus function schema.

**Request Body (`RufusValidationInput`):**
```json
{
  "questions": [
    {
      "question_number": 1,
      "question": "Is setup complicated?",
      "short_answer": "No, setup is very simple."
    },
    {
      "question_number": 2,
      "question": "Does it support 10Gbps?",
      "short_answer": "Unfortunately, this switch only supports Gigabit speeds (1Gbps)."
    }
  ]
}
```

**Important:** The `short_answer` field should contain the Rufus answer (first 100 characters max). The endpoint validates all questions concurrently with temperature 0.2 for deterministic evaluation.

**Response (`RufusValidationResponse`):**
```json
{
  "total_questions": 2,
  "answered_count": 1,
  "unanswered_count": 1,
  "answer_rate": 50.0,
  "validations": [
    {
      "question_number": 1,
      "question": "Is setup complicated?",
      "short_answer": "No, setup is very simple...",
      "is_answered": true,
      "confidence": "high",
      "reasoning": "Direct, helpful answer that clearly addresses the setup complexity question."
    },
    {
      "question_number": 2,
      "question": "Does it support 10Gbps?",
      "short_answer": "Unfortunately, this switch only supports...",
      "is_answered": false,
      "confidence": "high",
      "reasoning": "Answer uses 'unfortunately' and provides negative response, indicating feature is not present."
    }
  ]
}
```

**Validation Criteria:**
- ✅ **Answered**: Question directly addressed with helpful information
- ❌ **Not Answered**: Answer contains "no", "unfortunately", "can't answer", or deflects the question

**Features:**
- Concurrent processing of all questions for speed
- Temperature 0.2 for deterministic validation
- Compatible with GPT-5 (no temperature), GPT-4, and GPT-3.5
- Graceful error handling with fallback responses
- Batch validation of up to 50 questions per request

**Note:** Rate limits are configurable via environment variables `RATE_LIMIT_IMAGES`, `RATE_LIMIT_ANALYZE`, and `RATE_LIMIT_COMPARE`. The `OPENAI_MODEL` variable can be set to `gpt-4` for enhanced analysis quality at higher cost. Model compatibility automatically handled - temperature parameter used for GPT-4/GPT-3.5, omitted for GPT-5. See Setup Instructions for details.

#### /generate_promotion_script Endpoint

The `/generate_promotion_script` endpoint generates video scripts (1-4 detailed scenes) in two distinct styles: **UGC** (User Generated Content) for authentic, raw social media content, or **Showcase** for polished, professional marketing videos. Includes optional lightweight image context analysis and graceful fallback for missing style_guide fields.

**⚠️ IMPORTANT:** You must specify the same `style` parameter for both script generation AND video generation to ensure consistency.

**Styles:**
- **"ugc"**: Authentic user-generated content (handheld, natural lighting, casual voiceover)
- **"showcase"**: Professional product showcase (cinematic, polished, professional voiceover) - **DEFAULT**

**Request Body (`PromotionScriptInput`):**
```json
{
  "title": "Jollems Caramô Caramel Candy – 2 lb Bulk Bag",
  "description": "Classic caramel flavor with smooth, creamy texture. Individually wrapped for convenience.",
  "images": [
    "https://example.com/product-image-1.jpg",
    "https://example.com/product-image-2.jpg"
  ],
  "style": "ugc",
  "ugc_character_name": "CaramelLover_2025"
}
```

**Response (`PromotionScriptResponse`):**
```json
{
  "product_name": "Jollems Caramô Caramel Candy",
  "prompt_overview": "A warm, nostalgic product video highlighting the classic caramel taste, creamy texture, and individually wrapped convenience.",
  "scene_flow": [
    "Opening hero shot of the 2 lb bag spilling rich, golden caramel candies onto rustic wooden table—warm, cozy lighting.",
    "Macro unwrapping shot: a single candy being slowly unwrapped, revealing glossy, buttery caramel piece.",
    "Close-up texture shot showing smooth, creamy caramel shine—soft focus and warm highlights.",
    "Nostalgia moment: quick montage of someone placing candies in dish, handing one to friend, enjoying first bite.",
    "Visual flavor cue: soft caramel swirl animation behind candy, enhancing classic, comforting feel.",
    "Final hero shot of bulk bag with unwrapped candies arranged neatly around it."
  ],
  "text_overlays": [
    "Classic Caramel Flavor",
    "Smooth & Nostalgic",
    "Individually Wrapped • 2 lb Bulk Bag"
  ],
  "style_guide": "Warm and cozy, nostalgic candy-shop feel, soft golden lighting, rich 4K caramel macro shots, inviting and comforting atmosphere.",
  "ugc_character_name": "CaramelLover_2025",
  "style": "showcase"
}
```

**Script Format Details:**
- **product_name**: Product name extracted from title
- **prompt_overview**: 1-2 sentence overview (50-300 chars) describing video concept and emotional appeal
- **scene_flow**: 4-8 scene descriptions (cinematic for showcase, authentic for UGC)
- **text_overlays**: 2-5 short on-screen text phrases (minimal/none for UGC)
- **style_guide**: Visual atmosphere description (polished for showcase, raw for UGC)
- **ugc_character_name**: Persistent narrator/character name for voiceover continuity
- **style**: Script style used ("ugc" or "showcase")

**Style Comparison:**

| Feature | Showcase | UGC |
|---------|----------|-----|
| **Camera** | Cinematic dolly shots, macro | Handheld iPhone, selfie-style |
| **Lighting** | Professional studio lighting | Natural window/room light |
| **Polish** | High production value | Zero polish, authentic |
| **Voiceover** | Professional narrator tone | Casual, conversational |
| **Use Case** | Amazon A+, product pages | Instagram, TikTok, social proof |

**Scene Flow Patterns:**

**Showcase Style:**
- Hero shots with optimal lighting
- Macro/close-ups showing texture and quality
- Product usage moments with emotional beats
- Visual storytelling with cohesive narrative

**UGC Style:**
- Selfie-style intro holding product
- Handheld demonstration with natural reactions
- Direct-to-camera verdict and recommendation
- Raw, unedited footage aesthetic

**Features:**
- Temperature 0.6 for creative, compelling video direction
- Auto-generated character names based on product title if not provided
- Persistent voiceover character for brand consistency across videos
- Duration: 15-60 seconds (flexible based on product complexity)
- Compatible with Sora 2 video generation workflows

#### /generate_video Endpoint

The `/generate_video` endpoint generates **15-60 second** product videos using **Kie.ai's Sora 2 Image-to-Video API** (with context-aware model selection) from scripts and product images. Videos are automatically uploaded to **AWS S3** for permanent, scalable storage.

**Supported Durations:** 15s, 30s, 45s, 60s (automatically split into 15s scenes and merged sequentially).

**Resolution & Context-Aware Model Selection:**
- **720p UGC with persistent character** (`reuse_character_id` provided): Uses Sora 2 Pro for enhanced character consistency
- **720p (other cases)**: Uses standard Sora 2 model (`sora-2-image-to-video`)
- **1080p (all cases)**: Uses Sora 2 Pro model (`sora-2-pro-image-to-video`) for enhanced quality

**⚠️ IMPORTANT:** You must use the same `style` parameter here that you used in `/generate_promotion_script`. The style determines how the character injection works:
- **UGC style**: Auto-generates or uses provided @username and injects into the prompt (e.g., "@premium.wireless filming: [script]")
- **Showcase style**: No character injection, uses script as-is

**API Provider**: Kie.ai (https://kie.ai)
**Model**: Sora 2 Image-to-Video
**Storage**: AWS S3 (automatic upload after generation)
**Requirements**: At least one product image URL

**Request Body (`VideoGenerationInput`):**
```json
{
  "script": "A warm, nostalgic video highlighting classic caramel taste...\n\nSCENE FLOW:\n1. Opening hero shot of bag spilling candies...",
  "title": "Jollems Caramô Caramel Candy – 2 lb Bulk Bag",
  "description": "Classic caramel flavor with smooth, creamy texture.",
  "images": [
    "https://example.com/product-image-1.jpg",
    "https://example.com/product-image-2.jpg"
  ],
  "asin": "B0BHJJ9Y77",
  "duration": 30,
  "resolution": "1080p",
  "style": "ugc",
  "graceful": true,
  "timeout": 600,
  "ugc_character_description": "Female, mid-30s, blonde hair, casual outfit, warm smile"
}
```

**Query Parameters** (append to URL, not in request body):
- `testing=true` - Preserve local video files after S3 upload (for testing)
- `upload_to_s3=true` - Upload final video to S3 (default: true)

**Required Parameters**:
- `script` (str): Full Sora 2 prompt (from `/generate_promotion_script`)
- `title` (str): Product title
- `description` (str): Product description
- `images` (List[str]): Product image URLs (max 5)

**Optional Parameters**:
- `duration` (int): Video duration in seconds - **Supports 15, 30, 45, 60** (automatically split into 15s scenes and merged) (default: 15)
- `resolution` (str): Video resolution - **720p** or **1080p** (default: 1080p)
- `style` (str): Video style - **ugc** or **showcase** (default: showcase) - **MUST match script generation style**
- `graceful` (bool): Enable graceful degradation (default: true). When true, returns **206 Partial Content** on timeout with completed scenes. When false, returns **500 Server Error** on timeout.
- `timeout` (int): Max seconds to wait for completion (0 = no timeout) - **NEW in v1.14.0**
  - **0** (default): No timeout, operation completes even if it takes hours
  - **Positive integer**: Max seconds to wait (e.g., `600` for 10 minutes, `30` for quick test)
  - If exceeded and `graceful=true`: Returns **206 Partial Content** with completed scenes and timing breakdown
  - If exceeded and `graceful=false`: Returns **500 Server Error**
  - Useful for: Testing long-duration videos, diagnosing bottlenecks, handling variable load
- `ugc_character_description` (str, optional): Custom character description for UGC videos (max 500 chars)
  - Example: "Female, mid-30s, blonde hair, casual blue sweater, warm smile, kitchen setting"
  - Only used for `style='ugc'`, ignored for showcase videos
  - Auto-generated if not provided
  - Used for Scene 1 character extraction and multi-scene consistency
- `reuse_character_id` (str, optional): Reuse previously generated Kie.ai character ID
  - Skips character generation and uses existing character ID for consistency
  - Only used for `style='ugc'` multi-scene videos (duration > 15s)
  - Useful for maintaining exact character consistency across multiple video batches
  - Retrieved from response `character_id` field in previous video generation
  - Reduces generation time by ~10-30 seconds
- `use_character_id` (bool, optional): Enable/disable character generation for UGC videos (default: true)
  - When true: Generates character from Scene 1 collage (UGC multi-scene only, ignored for 15s videos)
  - When false: Skips character generation (debugging/precision mode)
  - Only applies to `style='ugc'`
- `asin` (str, optional): Product ASIN for file naming
- `aspect_ratio` (str, optional): Video aspect ratio - **landscape** or **portrait**

**Response (`VideoGenerationResponse`):**
```json
{
  "s3_url": "https://uncommon-edge-bucket.s3.us-east-1.amazonaws.com/generated-videos/video_20251210_143052_abc123.mp4",
  "s3_key": "generated-videos/video_20251210_143052_abc123.mp4",
  "video_path": "generated_videos/B0BHJJ9Y77_20251210_120000_scene1.mp4",
  "metadata_path": "generated_videos/B0BHJJ9Y77_20251210_120000_scene1.json",
  "duration_seconds": 15,
  "resolution": "720p",
  "fps": 24,
  "generation_time_seconds": 254.1,
  "file_size_mb": 8.72,
  "num_scenes": 1,
  "scene_paths": [
    "generated_videos/B0BHJJ9Y77_20251210_120000_scene1.mp4"
  ],
  "scene_prompts": [
    "@caramel.lover filming: A warm, nostalgic video highlighting classic caramel taste..."
  ],
  "style": "ugc",
  "character_names": ["@caramel.lover"],
  "timing": {
    "operation_start": "2026-01-09T14:30:52.123456Z",
    "script_generation_start": "2026-01-09T14:30:52.245789Z",
    "script_generation_end": "2026-01-09T14:30:58.456123Z",
    "scene_generation_start": "2026-01-09T14:30:58.567890Z",
    "scene_generation_end": "2026-01-09T14:34:32.123456Z",
    "merge_attempt_start": "2026-01-09T14:34:32.234567Z",
    "merge_attempt_end": "2026-01-09T14:34:35.345678Z",
    "s3_upload_start": "2026-01-09T14:34:35.456789Z",
    "operation_end": "2026-01-09T14:34:40.567890Z"
  },
  "timing_summary": {
    "script_generation_duration": 6.21,
    "scene_generation_duration": 213.56,
    "merge_duration": 3.11,
    "s3_upload_duration": 5.11,
    "total_duration": 228.18
  }
}
```

**Response Fields**:
- `s3_url` (str): **Primary** - Public S3 URL to access the video (null on 206 Partial Content)
- `s3_key` (str): S3 object key (path within bucket) (null on 206 Partial Content)
- `video_path` (str): Local file path (for testing/debugging)
- `metadata_path` (str): Path to metadata JSON file
- `duration_seconds` (int): Video duration (15, 30, 45, or 60)
- `resolution` (str): Video resolution (720p or 1080p)
- `fps` (int): Frames per second (always 24)
- `generation_time_seconds` (float): Time taken to generate video
- `file_size_mb` (float): Final video file size (0 on timeout)
- `num_scenes` (int): Number of scenes (duration / 15)
- `scene_paths` (List[str]): Individual scene video paths (partial list on 206 Partial Content)
- `scene_prompts` (List[str]): Preprocessed prompts sent to Kie.ai (shows character injection for UGC)
- `style` (str): Video style used (ugc or showcase)
- `character_id` (str, optional): Generated Kie.ai character ID (for reuse via `reuse_character_id` in future videos, UGC multi-scene only)
- `character_clip_path` (str, optional): Path to character clip video (for visual reference)
- `timing` (Dict[str, str]): ISO 8601 timestamps for all pipeline stages (always present)
- `timing_summary` (Dict[str, float]): Duration breakdown in seconds (always present)

**Timing Fields (NEW in v1.14.0)**:
- `timing` (Dict[str, str]): **End-to-end timestamps** in ISO 8601 format capturing 9 key points:
  - `operation_start` - When the request began processing
  - `script_generation_start/end` - Script preparation phase
  - `scene_generation_start/end` - Sora 2 video generation phase (longest)
  - `merge_attempt_start/end` - Video merging phase (if multi-scene)
  - `s3_upload_start` - S3 upload began
  - `operation_end` - When response was finalized

- `timing_summary` (Dict[str, float]): **Duration breakdown** in seconds:
  - `script_generation_duration` - How long script prep took
  - `scene_generation_duration` - How long Sora 2 generation took (biggest variable)
  - `merge_duration` - How long video merge took
  - `s3_upload_duration` - How long S3 upload took
  - `total_duration` - Total end-to-end time

**Using Timing Data for Diagnostics**:
```json
{
  "timing_summary": {
    "script_generation_duration": 6.21,
    "scene_generation_duration": 213.56,  // <- Bottleneck (Sora 2 API)
    "merge_duration": 3.11,
    "s3_upload_duration": 5.11,
    "total_duration": 228.18
  }
}
```

If `scene_generation_duration` dominates (as expected), Sora 2 API is the limiting factor. If `merge_duration` is high, you may need faster disk I/O or better network bandwidth for S3 uploads.

**Note**: Videos are automatically uploaded to S3 and local files cleaned up. Use `?testing=true` to preserve local files during testing.

**Video Generation Workflow (15s Single-Scene)**:
1. **Script Submission**: Provide full Sora 2 prompt (from `/generate_promotion_script`)
2. **Style Processing**:
   - **UGC videos**: Auto-generates character name (e.g., @premium.wireless) and injects into prompt
   - **Showcase videos**: Uses script as-is without character injection
3. **Image Validation**: Ensures at least 1 image URL (up to 5 images supported)
4. **Video Generation**:
   - Submits to Kie.ai API with preprocessed prompt
   - Status polling (5s intervals, 10 min timeout)
   - Downloads completed video to `/generated_videos`
5. **S3 Upload**: Final video uploaded to S3 bucket with permanent URL
6. **Cleanup**: Local files deleted (production) or preserved (testing mode with `?testing=true`)
7. **Metadata**: JSON sidecar with generation parameters, scene prompts, and S3 info saved

**Complete Script-to-Video Pipeline Example**:

```bash
# Step 1: Generate script (must specify style)
POST /ai/api/generate_promotion_script
{
  "title": "Premium Wireless Headphones",
  "description": "...",
  "images": ["url1", "url2"],
  "style": "ugc"  # ← Specify style here
}
# Response includes: script, scene_flow, style, ugc_character_name

# Step 2: Generate video (use SAME style)
POST /ai/api/generate_video
{
  "script": "[full script from step 1]",
  "title": "Premium Wireless Headphones",
  "description": "...",
  "images": ["url1", "url2"],
  "style": "ugc",  # ← MUST match script style
  "duration": 15
}
# Response includes: s3_url, scene_prompts (shows "@premium.wireless filming: ...")
```

**Configuration Options:**
- `KIE_API_KEY`: Kie.ai API key (get from https://kie.ai/api-key)
- `KIE_MODEL`: Legacy model identifier (no longer used - context-aware selection active)
- `KIE_ASPECT_RATIO`: Video aspect ratio (landscape/portrait)
- `KIE_N_FRAMES`: Video duration (10s or 15s)
- `KIE_TIMEOUT`: Max generation time (default: 600s / 10 minutes)

**Features:**
- Task-based async architecture with status polling
- Context-aware model selection (Pro model for UGC with persistent characters)
- Automatic file naming: `{ASIN}_{timestamp}.mp4`
- Image-to-video: Uses first product image as video starting frame
- Automatic watermark removal
- Metadata tracking for debugging and cost analysis
- TEST_MODE mock generation (creates test files without API calls)
- **EXPENSIVE**: Rate limited to 2 requests/minute

**Note:** See `docs/KIE_AI_INTEGRATION.md` for complete integration guide and troubleshooting.

### JSON Response Formatting

**FastAPI Default Behavior**: The API returns compact/minified JSON by default for optimal performance and smaller payload sizes. This is the standard behavior and not a bug.

**What to Expect**:
- **Valid JSON**: All responses are properly formatted JSON
- **Compact**: No indentation or extra whitespace (minified)
- **Performance Optimized**: Smaller payloads for faster transmission
- **Standards Compliant**: Follows RFC 8259 JSON specification

**Example Response**:
```json
{"main_image_compliance":"Analysis text...","image_variety_and_sequence":"Analysis text...","individual_images":[{"image_number":1,"image_url":"https://example.com/image1.jpg","compliance_status":"Compliant","strengths":["Clear product shot"],"weaknesses":["Limited angles"],"specific_recommendations":["Add more views"]}]}
```

**For Pretty-Printed JSON**: Use JSON formatting tools like `jq` or Python's `json.dumps(response, indent=2)` for development and debugging purposes.

## Rate Limiting

Rate limiting is implemented per client IP address to prevent abuse and ensure fair usage across different users. Each unique IP address has its own rate limit bucket.

- **Per-IP Limiting**: Limits apply individually to each client IP, not globally to the API
- **Immediate Rejection**: Requests exceeding the limit are rejected with HTTP 429 status code without processing
- **No Processing Delay**: Individual request processing time is not affected by rate limiting - allowed requests complete normally
- **Configurable Limits**: Adjust limits via environment variables based on your OpenAI API quotas and usage patterns
- **Time Window**: Limits reset every minute

This approach protects the API from overuse while maintaining performance for legitimate users.

#### Request Body Schemas

**ListingInput:**
```json
{
  "asin": "B0EXAMPLE",
  "title": "Product Title",
  "brand": "Brand Name",
  "description": "Bullet points or description text",
  "reviews": [
    {
      "rating": 5,
      "comment": "Great product!"
    }
  ],
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**ComparisonInput:**
```json
{
  "listing": { /* ListingInput */ },
  "competitor": { /* ListingInput */ }
}
```

## Response Models

**IndividualImageAnalysis:**
```json
{
  "image_number": "integer",
  "image_url": "string",
  "compliance_status": "string (enum: Compliant, Non-compliant, Needs improvement)",
  "strengths": ["string array (max 5)"],
  "weaknesses": ["string array (max 5)"],
  "specific_recommendations": ["string array (max 5)"]
}
```

**TitleAnalysisResult** (extends AnalysisResult):
```json
{
  "section": "string",
  "gaps": ["string array"],
  "suggestions": ["string array"],
  "alternative_titles": ["string array (3-5 complete title options)"]
}
```

**DescriptionAnalysisResult** (extends AnalysisResult):
```json
{
  "section": "string",
  "gaps": ["string array"],
  "suggestions": ["string array"],
  "alternative_description": "string (complete rewritten optimized description)"
}
```

#### Response Schemas

**ImageAnalysisResponse:**
```json
{
  "main_image_compliance": "Analysis text...",
  "image_variety_and_sequence": "Analysis text...",
  "lifestyle_images": "Analysis text...",
  "infographics_and_callouts": "Analysis text...",
  "size_and_scale_representation": "Analysis text...",
  "emotional_appeal_and_storytelling": "Analysis text...",
  "competitor_benchmarking": "Analysis text...",
  "actionable_recommendations": "Analysis text...",
  "individual_images": [
    {
      "image_number": 1,
      "image_url": "https://example.com/image1.jpg",
      "compliance_status": "Compliant",
      "strengths": ["Clear product shot", "Good lighting"],
      "weaknesses": ["Could show more angles"],
      "specific_recommendations": ["Add lifestyle image", "Include size comparison"]
    }
  ]
}
```

**AnalysisResult:**
```json
{
  "section": "bullet_points",
  "gaps": ["Gap 1", "Gap 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2"]
}
```

**ComparisonResult:**
```json
{
  "category": "title",
  "our_strengths": ["Strength 1"],
  "competitor_strengths": ["Strength 1"],
  "our_gaps": ["Gap 1"],
  "competitor_gaps": ["Gap 1"],
  "action_items": ["Action 1"]
}
```

**BulletPointsComparisonResult:**
```json
{
  "similarities": ["Similarity 1"],
  "differences": ["Difference 1"],
  "standouts": {
    "our": ["Our standout 1"],
    "competitor": ["Competitor standout 1"]
  }
}
```

**LifestyleImageInput:**
```json
{
  "asin": "B0EXAMPLE1A",
  "title": "Premium Wireless Headphones",
  "brand": "TechBrand",
  "description": "Noise-cancelling over-ear headphones with 30-hour battery",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "reviews": [{"comment": "Great for travel", "rating": 5}],
  "num_images": 3,
  "model": "standard",
  "aspect_ratio": "16:9",
  "output_format": "jpeg",
  "resolution": null,
  "timeout": 300,
  "graceful": true
}
```

**LifestyleImageResponse:**
```json
{
  "status": "success",
  "asin": "B0EXAMPLE1A",
  "num_requested": 3,
  "num_succeeded": 3,
  "num_failed": 0,
  "model_used": "standard",
  "total_generation_time_seconds": 45.2,
  "error": null,
  "results": [
    {
      "index": 0,
      "status": "success",
      "image_url": "https://cdn.kie.ai/image_uuid_1.jpeg",
      "scenario_prompt": "Product being used in office setting with natural lighting",
      "task_id": "task_uuid_1",
      "error": null,
      "generation_time_seconds": 15.1
    }
  ]
}
```

**LifestyleImageResult (per-image):**
- `index`: 0-based image index in request
- `status`: "success" or "failed"
- `image_url`: Kie.ai CDN URL (null if failed)
- `scenario_prompt`: OpenAI-generated usage scenario
- `task_id`: Kie.ai task identifier (for tracking)
- `error`: Error message if failed
- `generation_time_seconds`: Wall-clock time for this image

## Advanced Workflows

### Optional Custom Detailed Scenes (v1.9.0)

The `/generate_video` endpoint supports an optional `detailed_scenes` field for advanced users who want fine-grained control over scene specifications. Most users should use the default auto-generation.

#### Standard Workflow (Recommended)

The simplest and most common approach:

```bash
# Step 1: Generate script
curl -X POST http://localhost:8000/ai/api/generate_promotion_script \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Premium Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones with 30-hour battery life",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "style": "showcase"
  }'

# Step 2: Generate video (scenes auto-generated based on duration)
curl -X POST http://localhost:8000/ai/api/generate_video \
  -H "Content-Type: application/json" \
  -d '{
    "script": "...",
    "title": "Premium Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "duration": 30,
    "resolution": "1080p",
    "style": "showcase"
    # No detailed_scenes → Auto-generates 2 scenes for 30s video
  }'
```

**Response** includes video URL, duration, resolution, and auto-generated scene information.

#### Advanced Workflow (Custom Scenes)

For users with custom scene specifications:

```bash
curl -X POST http://localhost:8000/ai/api/generate_video \
  -H "Content-Type: application/json" \
  -d '{
    "script": "...",
    "title": "Premium Wireless Headphones",
    "description": "Noise-cancelling over-ear headphones",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "duration": 30,
    "resolution": "1080p",
    "style": "showcase",
    "detailed_scenes": [
      {
        "scene_number": 1,
        "voiceover": "Experience premium audio quality with...",
        "scene_description": "Product hero shot with ambient lighting...",
        "camera_directions": "Pan left to right, revealing product...",
        "text_overlays": ["Feature 1", "Premium Quality"],
        "timing": "0-15 seconds",
        "composition_notes": "Warm golden lighting, professional feel..."
      },
      {
        "scene_number": 2,
        "voiceover": "Thirty hours of battery life means...",
        "scene_description": "User wearing headphones in everyday setting...",
        "camera_directions": "Slow dolly in, intimate close-up...",
        "text_overlays": ["30-Hour Battery", "All-Day Comfort"],
        "timing": "15-30 seconds",
        "composition_notes": "Natural daylight, authentic lifestyle..."
      }
    ]
  }'
```

#### Validation Rules

**Scene Count:**
- Must match `duration / 15`:
  - 15s duration → exactly 1 scene
  - 30s duration → exactly 2 scenes
  - 45s duration → exactly 3 scenes
  - 60s duration → exactly 4 scenes

**DetailedScene Fields:**
- `voiceover`: 50-2000 characters
- `scene_description`: 100-2000 characters
- `camera_directions`: 50-1500 characters
- `text_overlays`: Max 3 per scene (showcase), 0 for UGC style
- `timing`: Scene timing string
- `composition_notes`: 50-1000 characters

#### Error Scenarios

**Scene Count Mismatch:**
```json
{
  "status": 400,
  "detail": "detailed_scenes count mismatch: 1 scenes provided, but duration 30s requires 2 scenes"
}
```

**Invalid DetailedScene Structure:**
```json
{
  "status": 400,
  "detail": "voiceover: ensure this value has at least 50 characters"
}
```

#### Use Cases for Custom Scenes

1. **Brand Compliance**: Ensure scenes match brand guidelines and messaging
2. **Voiceover Control**: Provide exact voiceover scripts for voice actors
3. **Visual Direction**: Specify exact camera movements and composition
4. **Localization**: Translate and customize scenes for different markets
5. **A/B Testing**: Create multiple variations with different messaging

## Example Requests and Responses

### /analyze_images

**Request:**
```json
{
  "asin": "B0EXAMPLE",
  "title": "Wireless Bluetooth Headphones with Noise Cancellation",
  "brand": "AudioTech",
  "description": "Premium wireless headphones with active noise cancellation",
  "reviews": [
    {
      "rating": 5,
      "comment": "Great sound quality!"
    }
  ],
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

**Response:**
```json
{
  "main_image_compliance": "Strategic analysis of compliance patterns across all images with specific improvement areas identified.",
  "image_variety_and_sequence": "Comprehensive evaluation of image sequencing strategy and variety effectiveness.",
  "lifestyle_images": "Assessment of lifestyle image quality and their contribution to conversion.",
  "infographics_and_callouts": "Analysis of feature highlighting and callout effectiveness across the image set.",
  "size_and_scale_representation": "Evaluation of size demonstration and scale representation quality.",
  "emotional_appeal_and_storytelling": "Strategic insights on emotional engagement and narrative effectiveness.",
  "competitor_benchmarking": "Comparative analysis against competitor image strategies.",
  "actionable_recommendations": "Prioritized strategic recommendations for overall conversion improvement.",
  "main_image_analysis": "The main product image presents a clean professional appearance with excellent white background compliance. Product details are clearly visible, but could better highlight key benefits through strategic positioning.",
  "image_stack_analysis": "Your listing utilizes 5 out of 9 possible image slots. Current focus is on product shots with minimal branding or narrative storytelling. Consider adding lifestyle imagery, comparison images, and benefit-focused infographics.",
  "individual_images": [
    {
      "image_number": 1,
      "image_url": "https://example.com/image1.jpg",
      "compliance_status": "Compliant",
      "strengths": ["Clear product shot", "Good lighting", "White background"],
      "weaknesses": ["Limited angles shown"],
      "specific_recommendations": ["Add side and back views", "Include size comparison"]
    },
    {
      "image_number": 2,
      "image_url": "https://example.com/image2.jpg",
      "compliance_status": "Needs improvement",
      "strengths": ["Shows product in use"],
      "weaknesses": ["Poor lighting", "Background distractions"],
      "specific_recommendations": ["Improve lighting", "Use plain background"]
    }
  ]
}
```

### /analyze_title

**Request:**
```json
{
  "asin": "B0EXAMPLE",
  "title": "Wireless Bluetooth Headphones",
  "brand": "AudioTech",
  "description": "Premium wireless headphones",
  "reviews": [],
  "images": []
}
```

**Response:**
```json
{
  "section": "title",
  "gaps": ["Missing key features", "No brand positioning"],
  "suggestions": ["Include battery life", "Add noise cancellation mention"],
  "alternative_titles": [
    "AudioTech Premium Wireless Bluetooth Headphones with 30-Hour Battery & Active Noise Cancellation",
    "AudioTech ANC Wireless Headphones - 30H Battery, Premium Sound Quality, Comfortable Fit",
    "Premium AudioTech Wireless Bluetooth Headphones | 30 Hour Battery | Active Noise Cancellation | Hi-Fi Sound",
    "AudioTech Wireless ANC Headphones - Long Battery Life, Superior Comfort, Crystal Clear Audio"
  ]
}
```

## Testing

### Interactive Testing Suite

The testing suite provides a comprehensive interactive workflow to test all system components:

```bash
python scripts/testing/test.py
```

#### How It Works:

The script asks 10 straightforward questions and runs selected tests automatically:

1. **How many listings to analyze?** - Tests all analysis endpoints (`/analyze_*`)
2. **How many comparisons to test?** - Tests all comparison endpoints (`/compare_*`)
3. **How many products to validate through Rufus?** - Tests `/validate_rufus` endpoint
4. **How many promotion scripts to generate?** - Tests `/generate_promotion_script` endpoint
5. **How many product videos to generate?** - Tests `/generate_video` endpoint (script-to-video pipeline)
6. **How many UGC usernames to generate?** - Tests UGC username generation function
7. **How many products to test face detection on?** - Tests face filtering logic for product images
8. **How many products for listing image collage tests?** - Tests collage creation from product images (Scene 1 reference)
9. **How many videos for video frame collage tests (3-second intervals)?** - Tests collage creation from video frames (Scene 2+ continuity)
10. **Include raw output in result? (y/n)** - Optional JSON export alongside text files

**Sample Workflow:**
```bash
🚀 API Testing Suite
============================================================
Ensure the server is running on localhost:8000

How many listings to analyze? 2
How many comparisons to test? 1
How many products to validate through Rufus? 1
How many promotion scripts to generate? 1
How many product videos to generate? 1
How many UGC usernames to generate? 1
How many products for listing image collage tests? 2
How many videos for video frame collage tests (3-second intervals)? 1
Include raw output in result? (y/n): y
DEBUG: Raw output ENABLED

============================================================
STARTING TESTS
============================================================

📊 Testing Analysis Endpoints...
DEBUG: Sampling 2 listings: ['B081JLDJLB.json', 'B0BHJJ9Y77.json']

Testing with listing: B081JLDJLB
Tested /ai/api/validate_input: Status 200
Tested /ai/api/analyze_title: Status 200
Tested /ai/api/analyze_description: Status 200
...
Results saved to results/listing_analysis/test_results_B081JLDJLB_20251114_123456.txt

📊 Testing Comparison Endpoints...
DEBUG: Sampling 1 comparison files: ['comparison_example.json']
...
Results saved to results/comparison_analysis/test_results_comparison_...

📊 Testing Rufus Validation Endpoint...
DEBUG: Sampling 1 Rufus files: ['B00A121WN6_TP_Link_8_Port_Gigab_TP_Link.json']
Testing Rufus validation for: B00A121WN6_TP_Link_8_Port_Gigab_TP_Link
✅ Validation complete! Status: 200
   Total Questions: 25
   Answered: 20
   Unanswered: 5
   Answer Rate: 80.0%
   Response Time: 15.32s
Results saved to results/listing_analysis/test_results_rufus_B00A121WN6...

📊 Testing Collage Generation from Listing Images...
============================================================
Listing Test 1: Premium Wireless Headphones...
============================================================
📸 Product has 4 image(s)
   Using first 4 image(s) for collage

🎬 Creating listing image collage...
✅ Collage created successfully!
   Path: results/collage_generation/listing_collage_B081JLDJLB_20251218_123456.jpg
   Size: 215.3 KB
   Creation time: 1.12s

📁 Test results saved to: results/collage_generation/listing_collage_test_B081JLDJLB_20251218_123456.txt

📊 Testing Collage Generation from Video Frames...
============================================================
Video Test 1: B081JLDJLB_20251218_221545_scene1
============================================================
🎬 Opening video: generated_videos/B081JLDJLB_20251218_221545_scene1.mp4
   Duration: 15.0s
   Extracting 5 frames at 3-second intervals

   ✅ Frame 1/5 extracted at 3.0s: B081JLDJLB_20251218_221545_scene1_frame_3s.jpg
   ✅ Frame 2/5 extracted at 6.0s: B081JLDJLB_20251218_221545_scene1_frame_6s.jpg
   ✅ Frame 3/5 extracted at 9.0s: B081JLDJLB_20251218_221545_scene1_frame_9s.jpg
   ✅ Frame 4/5 extracted at 12.0s: B081JLDJLB_20251218_221545_scene1_frame_12s.jpg

🎨 Creating collage from 4 extracted frames...
✅ Frame collage created successfully!
   Path: results/collage_generation/video_frames_collage_B081JLDJLB_20251218_221545_scene1_20251218_123456.jpg
   Size: 312.1 KB
   Creation time: 0.98s

📁 Test results saved to: results/collage_generation/video_frames_collage_test_B081JLDJLB_20251218_221545_scene1_20251218_123456.txt

============================================================
✅ All tests completed!
============================================================
```

#### Key Features:

✅ **Simple Workflow:** Nine-question prompt covers all testing scenarios
✅ **Comprehensive Testing:** Tests all endpoints automatically
✅ **Smart Sampling:** Randomly selects from available data files
✅ **Detailed Results:** Saves results with timestamps and response times to `results/` subdirectories
✅ **Rufus Validation Testing:** Tests Rufus Q&A answer quality validation
✅ **Promotion Script Testing:** Tests 12-second Sora 2 video script generation
✅ **Video Generation Testing:** Tests script-to-video pipeline with Sora 2
✅ **UGC Username Testing:** Tests username generation function
✅ **Collage from Listing Images:** Tests Scene 1 visual reference (product image grids)
✅ **Collage from Video Frames:** Tests Scene 2+ visual continuity (3-second frame intervals)
✅ **Frame Extraction:** Saves video frames to `results/video_frames/` for inspection
✅ **Raw JSON Output:** Optional JSON export alongside human-readable text files
✅ **Organized Output:** Results saved to `results/listing_analysis/`, `results/comparison_analysis/`, and `results/collage_generation/`

**Raw JSON Output Feature:**
When enabled (answer "y" to the prompt), test results are saved in two formats:
- `.txt` files - Human-readable formatted output
- `.json` files - Raw API response data for programmatic analysis

Example output files:
```
results/listing_analysis/test_results_B081JLDJLB_20251130_123456.txt
results/listing_analysis/test_results_B081JLDJLB_20251130_123456.json
```

This dual-output approach enables both manual review and automated processing of test results.

#### What Gets Tested:

**Analysis Endpoints** (if listings > 0):
- `/validate_input`, `/analyze_title`, `/analyze_description`, `/analyze_reviews`
- `/analyze_bullet_points`, `/analyze_seo`, `/analyze_competitor`
- `/analyze_conversion_strategy`, `/analyze_images`

**Comparison Endpoints** (if comparisons > 0):
- `/compare_title`, `/compare_images`, `/compare_description`
- `/compare_seo`, `/compare_bullet_points`

**Rufus Validation** (if rufus > 0):
- `/validate_rufus` - Validates Rufus Q&A answer quality with batch processing

**Promotion Script Generation** (if scripts > 0):
- `/generate_promotion_script` - Generates 12-second Sora 2 video scripts in Jollems Caramô format

**Video Generation** (if videos > 0):
- Prompts for style (ugc/showcase) FIRST
- Prompts for duration (15s, 30s, 45s, or 60s) if not specified via `--duration` CLI argument
- `/generate_promotion_script` - Generates script in chosen style
- `/generate_video` - Generates video using Sora 2 with same style and duration (stores in `/generated_videos`)
- **Important Notes**:
  - The test script automatically passes `style` parameter to both endpoints to ensure consistency
  - The test script always sets `graceful=true` to enable partial results on timeout
  - Query parameters `testing=true` is automatically appended to preserve local files during testing

#### Data Directories:

- `data/listings_data/` - Individual listing JSON files for analysis testing
- `data/comparison_listings_data/` - Comparison JSON files with listing + competitor data
- `data/rufus_data/` - Rufus Q&A data files for validation testing

### Testing Timeout Behavior (v1.14.0)

The test script supports timeout testing for the `/generate_video` endpoint via the `--timeout` CLI argument. The test script always sets `graceful=true`, so timeouts result in 206 Partial Content responses (not failures).

**Test Timeout with CLI Arguments:**
```bash
# Test with 30-second timeout (quick test for bottleneck detection, forces graceful timeout)
python scripts/testing/test.py --videos 1 --timeout 30 --duration 15

# Test with 10-minute timeout (standard video generation)
python scripts/testing/test.py --videos 1 --timeout 600 --duration 30

# Test with no timeout (wait for completion, production behavior)
python scripts/testing/test.py --videos 1 --timeout 0 --duration 60

# Test multiple durations with same timeout
python scripts/testing/test.py --videos 1 --timeout 300 --duration 45
```

**How test.py Handles Timeout & Graceful Parameters**:
- Always sets `graceful=true` in request body
- If `--timeout` argument provided: Adds `timeout` field to request (Layer 2 endpoint timeout)
- If `--timeout` not provided: Omits `timeout` field, operation continues until completion
- Supports all 4 durations (15, 30, 45, 60) with automatic scene splitting and merging

**Interpreting Timeout Results** (with `graceful=true`):

**Success (200 status)**:
- Video generation completed within timeout
- Full video uploaded to S3, returned in `s3_url`
```
✓ Video generation completed: 228.18s
  Timing breakdown:
   Script Generation:    6.21s
   Scene Generation:     213.56s  ← Sora 2 API (expected to be longest)
   Merge:                3.11s
   S3 Upload:            5.11s
   Total:                228.18s
```

**Partial Success (206 status)**:
- Video generation timed out before completing final merge/upload
- Completed scenes are available individually in `scene_paths`
- S3 URL is null (final upload didn't occur)
- Timing breakdown shows where timeout occurred
```
⚠ Video generation timed out after 60s
  Completed:
   Script Generation:    6.21s (COMPLETED)
   Scene Generation:     53.21s (COMPLETED)
   Merge:                [TIMEOUT]
  Available Results:
   - Scene 1: /generated_videos/B0BHJJ9Y77_scene1.mp4
   - Timing data available for diagnosis
```

**Note on graceful=false**:
If `graceful=false` is used (not recommended), timeout results in:
```
✗ 500 Server Error
  Response: "Video generation timed out after 60 seconds"
  Result: No partial data, must retry with longer timeout
```

**Real-World Timeout Scenarios:**

1. **Testing during development** (quick feedback loop):
   ```bash
   python scripts/testing/test.py --videos 1 --timeout 30
   # Tests script gen + detects if Sora 2 is slow
   ```

2. **Performance baseline** (measure production-like conditions):
   ```bash
   python scripts/testing/test.py --videos 3 --timeout 600
   # Run 3 videos with 10-min timeout, review timing_summary for each
   ```

3. **Stress testing** (extreme duration videos):
   ```bash
   REQUEST_TIMEOUT_SECONDS=1800 python scripts/testing/test.py --videos 1 --timeout 1200
   # 30-min server timeout, 20-min endpoint timeout (2026-01-14 additions if needed)
   ```

**Console Output Example with Timing**:
```
Testing /generate_video with timeout=600s...
  Request sent at: 2026-01-09T14:30:52Z
  Waiting for completion...
  Status: 200 (success)
  Response time: 228.18s

Timing Breakdown:
   Script Generation:    6.21s
   Scene Generation:     213.56s
   Merge:                3.11s
   S3 Upload:            5.11s
   Total:                228.18s
```

**Debugging Bottlenecks**:
- If `scene_generation_duration` > 180s → Sora 2 API is slow (expected for complex videos)
- If `merge_duration` > 10s → Disk I/O or FFmpeg performance issue
- If `s3_upload_duration` > 30s → Network bandwidth or bucket latency issue

### CLI Testing Mode

In addition to interactive prompts, `test.py` supports command-line arguments for automated and scripted testing workflows. This is useful for CI/CD pipelines, batch testing, and precise control over test parameters.

**Running test.py with CLI Arguments:**

```bash
# Basic usage with positional arguments
python scripts/testing/test.py --listings 2 --comparisons 1 --videos 1

# Advanced usage with all options
python scripts/testing/test.py \
  --listings 3 \
  --comparisons 2 \
  --rufus 1 \
  --scripts 2 \
  --style ugc \
  --videos 2 \
  --duration 30 \
  --resolution 1080p \
  --aspect-ratio landscape \
  --face-detection 1 \
  --listing-collages 2 \
  --video-collages 1 \
  --characters 1 \
  --timeout 600 \
  --diagnostic \
  --raw-output \
  --s3-upload
```

**CLI Arguments (22 total):**

| Argument | Type | Description | Default |
|----------|------|-------------|---------|
| `--listings N` | int | Number of listings to analyze | 0 |
| `--comparisons N` | int | Number of comparisons to test | 0 |
| `--rufus N` | int | Number of Rufus validations to test | 0 |
| `--scripts N` | int | Number of promotion scripts to generate | 0 |
| `--style {ugc\|showcase}` | str | Script/video style (applies to all scripts) | showcase |
| `--videos N` | int | Number of product videos to generate | 0 |
| `--duration {15\|30\|45\|60}` | int | Video duration in seconds | 15 |
| `--resolution {720p\|1080p}` | str | Video resolution (1080p auto-selects Pro model) | 1080p |
| `--aspect-ratio {landscape\|portrait}` | str | Video aspect ratio | landscape |
| `--listing ASIN` | str | Specific ASIN to test (overrides random sampling) | None |
| `--description TEXT` | str | Custom product description (for testing) | None |
| `--face-detection N` | int | Number of products to test face detection on | 0 |
| `--listing-collages N` | int | Number of listing image collage tests | 0 |
| `--video-collages N` | int | Number of video frame collage tests (3-sec intervals) | 0 |
| `--characters N` | int | Number of characters to generate (Sora 2 only) | 0 |
| `--character-prompt TEXT` | str | Custom character generation prompt | Auto-generated |
| `--character-clip PATH` | str | Path to character clip for reference | None |
| `--character-id ID` | str | Reuse existing character ID (UGC multi-scene) | None |
| `--use-character-id {true\|false}` | bool | Enable/disable character generation for UGC | true |
| `--timeout SECONDS` | int | Timeout for video generation (Layer 2) | 0 (no timeout) |
| `--diagnostic` | flag | Auto-save detailed error logs on failures | false |
| `--all` | flag | Test all endpoints comprehensively | false |
| `--interactive` | flag | Force interactive mode (ignore CLI args) | false |
| `--raw-output` | flag | Save JSON output alongside text results | false |
| `--s3-upload` | flag | Upload generated files to S3 | false |

**Common CLI Patterns:**

```bash
# Quick smoke test (validate all endpoints work)
python scripts/testing/test.py --listings 1 --comparisons 1 --rufus 1 --scripts 1 --videos 1

# Comprehensive test suite (everything)
python scripts/testing/test.py --all --raw-output --diagnostic

# UGC video testing with character persistence
python scripts/testing/test.py --videos 3 --style ugc --duration 30 --character-id char_abc123

# Long-duration video with timeout detection
python scripts/testing/test.py --videos 1 --duration 60 --timeout 300 --diagnostic

# Collage generation testing
python scripts/testing/test.py --listing-collages 5 --video-collages 3

# Face detection validation
python scripts/testing/test.py --face-detection 10 --diagnostic

# Specific product testing
python scripts/testing/test.py --listing B0BHJJ9Y77 --videos 1 --duration 45

# S3 upload validation
python scripts/testing/test.py --videos 1 --s3-upload --raw-output

# Development iteration (quick feedback)
python scripts/testing/test.py --scripts 1 --videos 1 --timeout 30
```

**When to Use CLI Mode vs Interactive Mode:**

| Scenario | Mode | Reason |
|----------|------|--------|
| First-time testing | Interactive | Guided workflow, no memorization needed |
| CI/CD pipelines | CLI | Automated, scriptable, no user prompts |
| Development/iteration | CLI | Fast repeat, precise control over params |
| Full system validation | CLI (`--all`) | Comprehensive coverage with one command |
| Production testing | CLI | Repeatable, auditable parameter combinations |
| Debugging specific feature | CLI | Target exact test case, skip irrelevant tests |
| Stress testing | CLI | Run multiple iterations with `--timeout` variation |

**Combining CLI and Interactive Modes:**

You can run CLI mode first, then follow up with interactive for additional tests:
```bash
# Run automated smoke test
python scripts/testing/test.py --listings 1 --videos 1

# Then run interactive for exploratory testing
python scripts/testing/test.py --interactive
```

### Lifestyle Image Generation Testing

Standalone test script for the lifestyle image generation endpoint. Generates 1-6 authentic lifestyle product images using Kie.ai nano-banana models.

```bash
python scripts/testing/test_lifestyle_images.py [options]
```

**CLI Flags:**

```bash
# Generate 3 lifestyle images for a sample product
python scripts/testing/test_lifestyle_images.py --images 3

# Custom model selection (standard or pro)
python scripts/testing/test_lifestyle_images.py --images 4 --model pro

# Specify aspect ratio and output format
python scripts/testing/test_lifestyle_images.py --images 2 --aspect-ratio 16:9 --output-format png

# Test with specific resolution (Pro model only)
python scripts/testing/test_lifestyle_images.py --images 3 --model pro --resolution 4K

# Set timeout (default: 300s)
python scripts/testing/test_lifestyle_images.py --images 5 --timeout 600

# Disable graceful degradation (fail hard on errors)
python scripts/testing/test_lifestyle_images.py --images 2 --no-graceful

# Full options example
python scripts/testing/test_lifestyle_images.py \
  --images 4 \
  --model pro \
  --aspect-ratio 9:16 \
  --output-format jpeg \
  --resolution 2K \
  --timeout 300
```

**Available Options:**

| Flag | Type | Default | Description |
|------|------|---------|-------------|
| `--images N` | int | 3 | Number of lifestyle images to generate (1-6) |
| `--model` | str | `standard` | `standard` (text prompts) or `pro` (image-aware) |
| `--aspect-ratio` | str | `16:9` | 1:1, 9:16, 16:9, 3:4, 4:3, 3:2, 2:3, 5:4, 4:5, 21:9, auto |
| `--output-format` | str | `jpeg` | `jpeg`, `jpg`, or `png` |
| `--resolution` | str | (none) | Pro model: 1K, 2K, 4K (ignored for standard model) |
| `--timeout` | int | 300 | Per-image polling timeout in seconds (0 = unlimited) |
| `--no-graceful` | flag | false | Disable graceful degradation (fail on any image failure) |

**Output Structure:**

Results are saved to `results/lifestyle_images/{ASIN}_{timestamp}/` with:

```
results/lifestyle_images/
├── B0EXAMPLE1A_20260116_120000/
│   ├── lifestyle_images_B0EXAMPLE1A_20260116_120000.json    # Full response (all images + metadata)
│   ├── image_0_scenario_prompt.txt                          # Scenario for image 1
│   ├── image_0.jpeg                                         # Downloaded image 1
│   ├── image_1_scenario_prompt.txt                          # Scenario for image 2
│   ├── image_1.jpeg                                         # Downloaded image 2
│   └── ... (per-image files for all generated images)
```

**Example Output:**

```
Lifestyle Image Generation Test
============================================================
Product: Premium Wireless Headphones
Model: standard
Aspect Ratio: 16:9
Images Requested: 3

Generating lifestyle images...
✓ Image 1/3: Generated successfully (12.3s)
  Scenario: "Product being used while traveling on airplane"
  URL: https://cdn.kie.ai/image_uuid_1.jpeg
  Downloaded to: results/lifestyle_images/B0EXAMPLE1A_20260116_120000/image_0.jpeg

✓ Image 2/3: Generated successfully (14.1s)
  Scenario: "Product being used in home office setting"
  URL: https://cdn.kie.ai/image_uuid_2.jpeg
  Downloaded to: results/lifestyle_images/B0EXAMPLE1A_20260116_120000/image_1.jpeg

✓ Image 3/3: Generated successfully (13.8s)
  Scenario: "Product shown outdoors in natural lighting"
  URL: https://cdn.kie.ai/image_uuid_3.jpeg
  Downloaded to: results/lifestyle_images/B0EXAMPLE1A_20260116_120000/image_2.jpeg

============================================================
Summary: 3/3 images generated successfully
Total Generation Time: 40.2s
Results saved to: results/lifestyle_images/B0EXAMPLE1A_20260116_120000/
```

**Status Codes:**

- `200 (Success)`: All images generated successfully
- `206 (Partial Success)`: Some images failed; graceful=true returns best-effort results with per-image status
- `500 (Failure)`: Unrecoverable error (graceful=false or all images failed)
- `400 (Bad Request)`: Validation error (invalid num_images, unsupported aspect_ratio, etc.)

**Common Patterns:**

```bash
# Quick test (3 images, standard model, default params)
python scripts/testing/test_lifestyle_images.py

# Production-like test (6 images, pro model, high resolution)
python scripts/testing/test_lifestyle_images.py --images 6 --model pro --resolution 4K --timeout 600

# Stress test with no timeout (wait for completion)
python scripts/testing/test_lifestyle_images.py --images 4 --timeout 0

# Test timeout handling (fast feedback on bottlenecks)
python scripts/testing/test_lifestyle_images.py --images 2 --timeout 30
```

### Test Output Organization

Test results are organized by test type and include both human-readable and machine-readable formats.

**Output Directory Structure:**

```
results/
├── listing_analysis/
│   ├── test_results_B0BHJJ9Y77_20260116_120000.txt
│   ├── test_results_B0BHJJ9Y77_20260116_120000.json (if --raw-output)
│   ├── test_results_rufus_B00A121WN6_20260116_120000.txt
│   └── ... (one file per listing analyzed)
│
├── comparison_analysis/
│   ├── test_results_comparison_B0BHJJ9Y77_vs_B081JLDJLB_20260116_120000.txt
│   ├── test_results_comparison_B0BHJJ9Y77_vs_B081JLDJLB_20260116_120000.json (if --raw-output)
│   └── ... (one file per comparison)
│
├── promotion_scripts/
│   ├── promotion_script_B0BHJJ9Y77_20260116_120000.txt
│   ├── promotion_script_B0BHJJ9Y77_ugc_20260116_120000.txt (style-specific)
│   └── ... (one file per script generated)
│
├── video_generation/
│   ├── video_test_result_B0BHJJ9Y77_20260116_120000.txt
│   ├── video_test_result_B0BHJJ9Y77_20260116_120000.json (if --raw-output)
│   └── ... (one file per video test)
│
├── characters/
│   ├── test_results_characters_20260116_120000.json
│   └── character_generation_details.log
│
├── face_detection_analysis/
│   ├── face_detection_test_B0BHJJ9Y77_20260116_120000.txt
│   └── ... (one file per face detection test)
│
├── collage_generation/
│   ├── listing_collage_B0BHJJ9Y77_20260116_120000.jpg
│   ├── listing_collage_test_B0BHJJ9Y77_20260116_120000.txt
│   ├── video_frames_collage_B0BHJJ9Y77_scene1_20260116_120000.jpg
│   ├── video_frames_collage_test_B0BHJJ9Y77_scene1_20260116_120000.txt
│   └── ... (image files + metadata)
│
└── lifestyle_images/
    ├── B0BHJJ9Y77_20260116_120000/
    │   ├── lifestyle_images_B0BHJJ9Y77_20260116_120000.json (full response)
    │   ├── image_0_scenario_prompt.txt
    │   ├── image_0.jpeg
    │   ├── image_1_scenario_prompt.txt
    │   ├── image_1.jpeg
    │   └── ... (per-image files)
    │
    └── B081JLDJLB_20260116_120000/
        └── ... (organized by ASIN_timestamp)
```

**Generated Videos Directory:**

```
generated_videos/
├── B0BHJJ9Y77/
│   ├── B0BHJJ9Y77_20260116_120000_15s_landscape_ugc_scene1.mp4
│   ├── B0BHJJ9Y77_20260116_120000_15s_landscape_ugc_scene1.json (metadata)
│   ├── B0BHJJ9Y77_20260116_120000_30s_landscape_showcase_scene1.mp4
│   ├── B0BHJJ9Y77_20260116_120000_30s_landscape_showcase_scene1.json
│   ├── B0BHJJ9Y77_20260116_120000_30s_landscape_showcase_scene2.mp4
│   └── ... (organized by ASIN)
│
└── B081JLDJLB/
    └── ... (separate folder per product ASIN)
```

**Result File Naming Convention:**

```
[type]_[identifier]_[timestamp].[extension]

Examples:
test_results_B0BHJJ9Y77_20260116_120000.txt        ← Analysis result
test_results_comparison_B0B_vs_B08_20260116_120000.txt   ← Comparison
promotion_script_B0BHJJ9Y77_20260116_120000.txt    ← Script generation
video_test_result_B0BHJJ9Y77_20260116_120000.txt   ← Video test
face_detection_test_B0BHJJ9Y77_20260116_120000.txt ← Face detection
listing_collage_B0BHJJ9Y77_20260116_120000.jpg     ← Collage image
```

**What Gets Saved Where:**

| Test Type | Output Directory | Content | Formats |
|-----------|------------------|---------|---------|
| **Listing Analysis** | `results/listing_analysis/` | Endpoint results, timing, response code | `.txt`, `.json` (if --raw-output) |
| **Comparison Analysis** | `results/comparison_analysis/` | Comparative results for 2+ listings | `.txt`, `.json` |
| **Rufus Validation** | `results/listing_analysis/` | Q&A validation scores and feedback | `.txt`, `.json` |
| **Promotion Scripts** | `results/promotion_scripts/` | Generated video scripts (UGC/Showcase) | `.txt` |
| **Video Generation** | `results/video_generation/` | Video test metadata, timing, S3 URLs | `.txt`, `.json` |
| **Character Generation** | `results/characters/` | Character IDs, descriptions, metadata | `.json` |
| **Face Detection** | `results/face_detection_analysis/` | Detection results, face count, policy check | `.txt` |
| **Listing Collages** | `results/collage_generation/` | Product image grid + metadata | `.jpg`, `.txt` |
| **Video Frame Collages** | `results/collage_generation/` | Video frame grid (3s intervals) + metadata | `.jpg`, `.txt` |
| **Lifestyle Images** | `results/lifestyle_images/{ASIN}_{timestamp}/` | Generated lifestyle images + scenario prompts + response JSON | `.jpeg`, `.png`, `.txt`, `.json` |

**Accessing Results:**

```bash
# View latest listing analysis
cat results/listing_analysis/test_results_*.txt | tail -1

# Export all video generation results as JSON
ls results/video_generation/*.json

# Check collage generation quality
open results/collage_generation/*.jpg

# Find all failed tests
grep -r "ERROR\|FAILED" results/ --include="*.txt"

# Get timing breakdown for performance analysis
grep -A 10 "timing_summary" results/video_generation/*.json

# Count test executions per day
ls results/*/ | cut -d_ -f3 | sort | uniq -c
```

**Result File Contents (Examples):**

**Listing Analysis (.txt):**
```
Analysis Results for: B0BHJJ9Y77
Timestamp: 2026-01-16 12:00:00
Status: 200
Response Time: 85.32s

Endpoint Tests:
✓ /validate_input: 200
✓ /analyze_title: 200
✓ /analyze_description: 200
✓ /analyze_images: 200
...

Key Findings:
- Main Image: Compliant ✓
- Image Variety: Good (5/9 slots used)
- Gaps Identified: Missing lifestyle imagery
```

**Video Generation (.json with --raw-output):**
```json
{
  "status": 200,
  "asin": "B0BHJJ9Y77",
  "duration": 30,
  "resolution": "1080p",
  "s3_url": "https://...",
  "timing_summary": {
    "script_generation_duration": 6.21,
    "scene_generation_duration": 213.56,
    "merge_duration": 3.11,
    "s3_upload_duration": 5.11,
    "total_duration": 228.18
  }
}
```

### TEST_MODE

Set `TEST_MODE=true` in your `.env` file to use mock responses instead of calling OpenAI API. This allows testing without an API key and avoids costs.

**Mode Flags (6 total):**

| Flag | Environment Variable | Default | Purpose |
|------|----------------------|---------|---------|
| **Mock Mode** | `TEST_MODE` | `false` | Use mock responses (no API calls, zero cost) |
| **Model Selection** | `OPENAI_MODEL` | `gpt-4o-mini` | Choose text analysis model |
| **Vision Model** | `VISION_MODEL` | `gpt-4o-mini` | Choose vision model for face detection |
| **Raw Output** | Set via `--raw-output` flag in test.py | `false` | Save JSON alongside text results |
| **S3 Upload** | Set via `--s3-upload` flag in test.py | `false` | Upload generated files to S3 |
| **Diagnostic Logging** | Set via `--diagnostic` flag in test.py | `false` | Auto-save error logs on failures |

**How to Use TEST_MODE:**

```bash
# Enable TEST_MODE in .env
TEST_MODE=true

# Run tests without API costs
python scripts/testing/test.py --listings 5 --videos 2

# Verify mode is active by checking console output
# You should see: "Using TEST_MODE mock responses (no API costs)"
```

**When to Use Each Mode:**

- **TEST_MODE=true** (Development/Testing):
  - Fast feedback loops (instant responses)
  - No API costs
  - No API key required
  - Mocks validate schema compatibility
  - CI/CD pipelines without credentials

- **TEST_MODE=false** (Production/Integration):
  - Real API responses
  - Actual AI analysis
  - Real video generation
  - Genuine model outputs
  - Performance/bottleneck testing

**Switching Between Modes:**

```bash
# Test with mocks first (instant validation)
TEST_MODE=true python scripts/testing/test.py --all

# Then test with real API (verify quality)
TEST_MODE=false python scripts/testing/test.py --all --diagnostic
```

**Common Gotcha:** Make sure TEST_MODE is set correctly in `.env` - mocks may be out of sync with actual models if not kept in sync during development.

## Vector Database Utilities & Testing

The system uses Qdrant for semantic search and RAG (Retrieval Augmented Generation) with dual collections for listings and reviews. This section documents setup, data loading, testing, and management of the vector database.

### Overview

The vector database architecture supports:

- **Semantic Search**: Query embeddings against product listings and reviews for intelligent retrieval
- **Dual Collections**: Separate storage for `amazon_listings` and `amazon_reviews` with independent schemas
- **Graceful Degradation**: Failed individual operations don't block batch processing
- **Deterministic Testing**: Full test suite with 10+ test patterns covering upsert, search, retrieval, and deletion

For architectural details and design rationale, see [CLAUDE.md - Vector Database Integration](CLAUDE.md).

### Setup & Initialization

#### Initialize Vector Database

Creates Qdrant container and collections on first run:

```bash
python scripts/utilities/initialize_vector_db.py
```

**What It Does:**

1. Checks if Qdrant Docker container exists; creates if missing
2. Starts container if not running
3. Waits for health check (30 attempts, 1s intervals)
4. Creates two collections:
   - `amazon_listings`: 1536-dim vectors with COSINE distance
   - `amazon_reviews`: 1536-dim vectors with COSINE distance
5. Validates both collections are ready

**Output:**

```
============================================================
Qdrant Vector Database Initialization
============================================================

[1/4] Checking for existing Qdrant container...
      ✓ Qdrant already running
[2/4] Waiting for Qdrant to be ready...
      ✓ Qdrant is healthy
[3/4] Creating collections...
      ✓ Collection 'amazon_listings' already exists
      ✓ Collection 'amazon_reviews' already exists
[4/4] Verifying collections...
      ✓ Collections verified and ready
```

**Exit Codes:**
- `0`: Success, collections ready
- `1`: Failed (Docker error, health check timeout, or collection creation failed)

### Data Loading

#### Seed Vector Database

Load listings and reviews from JSON files into Qdrant:

```bash
python scripts/utilities/seed_vector_db.py \
  --listings data/seed_data/amazon_listings.json \
  --reviews data/seed_data/amazon_listing_reviews.json
```

**Supports Multiple Input Formats:**

- **PHPMyAdmin Exports**: `{"type": "table", "data": [...]}`
- **Flat Arrays**: `[{...}, {...}]`
- **Single Objects**: `{...}` (treated as single-item array)

**Required Fields:**

Listings must have: `id`, `asin`, `title`
Reviews must have: `id`, `listing_id` (foreign key to listing), `review_text`

**Output Example:**

```
Loading listings from data/seed_data/amazon_listings.json...
  → Queued listing: B081JLDJLB (id: 123)
  → Queued listing: B0BHJJ9Y77 (id: 124)
  ... (45 more listings)
✓ Upserted 47 listings to 'amazon_listings' collection

Loading reviews from data/seed_data/amazon_listing_reviews.json...
  → Queued review: id 456 for listing 123
  ... (389 more reviews)
✓ Upserted 390 reviews to 'amazon_reviews' collection
```

**Exit Codes:**
- `0`: Success, all data loaded
- `1`: Failed (file not found, JSON parse error, or Qdrant operation failed)

#### Extract Data from PHPMyAdmin Exports

Extract listings and reviews from database backups:

```bash
python scripts/utilities/extract_seed_data.py \
  --input "data/seed_data/UCE Portal Listings.json"
```

**What It Does:**

1. Parses PHPMyAdmin JSON export structure
2. Extracts `amazon_listing_infos` and `amazon_listing_reviews` tables
3. Validates referential integrity (reviews reference valid listings)
4. Exports two clean JSON files for seeding

**Output:**

```
INFO: Reading PHPMyAdmin export: data/seed_data/UCE Portal Listings.json
INFO: Extracted 'amazon_listing_infos': 47 records
INFO: Extracted 'amazon_listing_reviews': 390 records
✓ Referential integrity validated
✓ Exported to data/seed_data/amazon_listings.json (47 listings)
✓ Exported to data/seed_data/amazon_listing_reviews.json (390 reviews)
```

**Exit Codes:**
- `0`: Success, tables extracted and validated
- `1`: Failed (file not found, JSON parse error, missing tables, or integrity violation)

### Database Management

#### Reset Vector Database

Clear collections or perform complete teardown:

```bash
# Clear collections only (keep Qdrant container running)
python scripts/utilities/reset_vector_dbs.py

# Full teardown (remove container, volume, collections)
python scripts/utilities/reset_vector_dbs.py --full
```

**Modes:**

| Command | Action | Use Case |
|---------|--------|----------|
| `reset_vector_dbs.py` | Delete collections, keep container | Fresh data load, testing |
| `reset_vector_dbs.py --full` | Delete everything, start over | Container issues, complete reset |

**Output (Collection Cleanup):**

```
INFO: Deleting collection: amazon_listings
INFO: ✓ Deleted collection: amazon_listings
INFO: Deleting collection: amazon_reviews
INFO: ✓ Deleted collection: amazon_reviews
```

**Output (Full Teardown):**

```
INFO: Stopping Qdrant container...
INFO: ✓ Qdrant container stopped
INFO: Removing container...
INFO: ✓ Qdrant container removed
INFO: Removing volume...
INFO: ✓ Qdrant volume removed
```

**Exit Codes:**
- `0`: Success
- `1`: Failed (Qdrant not running, collection operation failed, or Docker command failed)

#### Reorganize Generated Videos

Migrate flat video structure to ASIN-organized folders:

```bash
# Preview changes (dry-run)
python scripts/utilities/reorganize_generated_videos.py --dry-run

# Execute migration
python scripts/utilities/reorganize_generated_videos.py
```

**Structure Migration:**

```
# OLD (v1.8 and earlier)
generated_videos/
├── B09LYF2ST7_20251214_221555_merged.mp4
├── B0BHJJ9Y77_20251214_221600_merged.mp4
└── B081JLDJLB_product_collage.jpg

# NEW (v1.9+)
generated_videos/
├── B09LYF2ST7/
│   ├── B09LYF2ST7_30s_landscape_showcase_20251214_221555.mp4
│   └── B09LYF2ST7_scenes.json
├── B0BHJJ9Y77/
│   └── B0BHJJ9Y77_30s_landscape_ugc_20251214_221600.mp4
└── B081JLDJLB/
    └── B081JLDJLB_product_collage.jpg
```

**Exit Codes:**
- `0`: Success, all files reorganized
- `1`: Failed (no ASIN found, permission error, or target exists)

### Testing

#### Comprehensive Vector Database Test Suite

Test all Qdrant operations with deterministic, repeatable patterns:

```bash
python scripts/testing/test_vector_db.py --test <test_name> [--num N]
```

**Available Tests:**

| Test | Purpose | Example |
|------|---------|---------|
| `upsert` | Batch insert listings with embeddings | `--test upsert --num 10` |
| `search` | Semantic search by query | `--test search --num 5` |
| `retrieve` | Direct retrieval by ASIN | `--test retrieve --num 5` |
| `full` | End-to-end workflow | `--test full --num 10` |
| `upsert_review` | Batch insert reviews | `--test upsert_review --num 20` |
| `search_reviews` | Search reviews by query | `--test search_reviews --num 5` |
| `retrieve_review` | Retrieve review by ID | `--test retrieve_review --num 10` |
| `delete_listing` | Delete listing by ID | `--test delete_listing --num 5` |
| `delete_review` | Delete review by ID | `--test delete_review --num 5` |
| `collection_isolation` | Verify dual collections are separate | `--test collection_isolation` |

**Test Examples:**

```bash
# Test upserting 10 listings
python scripts/testing/test_vector_db.py --test upsert --num 10

# Test searching 5 queries against reviews
python scripts/testing/test_vector_db.py --test search_reviews --num 5

# Test full workflow with 10 listings
python scripts/testing/test_vector_db.py --test full --num 10

# Verify collection isolation (no --num needed)
python scripts/testing/test_vector_db.py --test collection_isolation

# Run with custom data folder
python scripts/testing/test_vector_db.py --test upsert --num 5 \
  --folder /path/to/data/folder
```

**Output Example:**

```
TEST_MODE: true - Using mock data

[UPSERT TEST]
Loaded 5 test listings from data/listings_data
Upserting 5 listings to 'amazon_listings'...
  ✓ Listing 1/5: B09LYF2ST7 (embedding: 1536-dim)
  ✓ Listing 2/5: B0BHJJ9Y77 (embedding: 1536-dim)
  ✓ Listing 3/5: B081JLDJLB (embedding: 1536-dim)
  ✓ Listing 4/5: B0C9VDH2YR (embedding: 1536-dim)
  ✓ Listing 5/5: B00A121WN6 (embedding: 1536-dim)

Results:
  Success: 5/5
  Failed: 0/5
  Time: 2.34s
  Throughput: 2.14 listings/sec
```

**Test Parameters:**

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| `--test` | (required) | See table above | Test to execute |
| `--num` | `5` | `1-50` | Operations per test |
| `--folder` | `data/listings_data` | Any path | Source data directory |

**Exit Codes:**
- `0`: All tests passed
- `1`: Any test failed (check console output for details)

**TEST_MODE Behavior:**

```bash
# TEST_MODE=true (Default, mocks)
TEST_MODE=true python scripts/testing/test_vector_db.py --test upsert --num 5
# Uses mock embeddings, no Qdrant connection required, instant results

# TEST_MODE=false (Real Qdrant)
TEST_MODE=false python scripts/testing/test_vector_db.py --test upsert --num 5
# Connects to real Qdrant, generates real embeddings, uses API
```

### Common Workflows

#### Fresh Setup from Scratch

1. Initialize Qdrant:
```bash
python scripts/utilities/initialize_vector_db.py
```

2. Extract data from backup (if applicable):
```bash
python scripts/utilities/extract_seed_data.py \
  --input "data/seed_data/UCE Portal Listings.json"
```

3. Seed the database:
```bash
python scripts/utilities/seed_vector_db.py \
  --listings data/seed_data/amazon_listings.json \
  --reviews data/seed_data/amazon_listing_reviews.json
```

4. Verify with tests:
```bash
python scripts/testing/test_vector_db.py --test full --num 10
```

#### Development Testing Loop

1. Reset collections:
```bash
python scripts/utilities/reset_vector_dbs.py
```

2. Initialize fresh:
```bash
python scripts/utilities/initialize_vector_db.py
```

3. Seed test data:
```bash
python scripts/utilities/seed_vector_db.py \
  --listings data/seed_data/amazon_listings.json \
  --reviews data/seed_data/amazon_listing_reviews.json
```

4. Run specific tests:
```bash
python scripts/testing/test_vector_db.py --test upsert --num 5
python scripts/testing/test_vector_db.py --test search --num 10
python scripts/testing/test_vector_db.py --test collection_isolation
```

#### Production Data Migration

1. Export from old system:
```bash
python scripts/utilities/extract_seed_data.py \
  --input "exported_database.json"
```

2. Full teardown (if needed):
```bash
python scripts/utilities/reset_vector_dbs.py --full
```

3. Initialize fresh:
```bash
python scripts/utilities/initialize_vector_db.py
```

4. Load new data:
```bash
python scripts/utilities/seed_vector_db.py \
  --listings data/seed_data/amazon_listings.json \
  --reviews data/seed_data/amazon_listing_reviews.json
```

5. Validate data integrity:
```bash
python scripts/testing/test_vector_db.py --test full --num 50
```

## Architecture

### Two-Phase Map-Reduce Pattern

The image analysis endpoint uses a map-reduce architecture for concurrent analysis with graceful degradation:

- **Map Phase**: Individual images analyzed in parallel with 30s timeout and 2 retries (temperature 0.3)
- **Reduce Phase**: Strategic synthesis combines results for holistic recommendations (temperature 0.6)
- **Error Handling**: Individual image failures don't block overall results; synthesis failures return individual analyses with fallback defaults
- **Async First**: Concurrent processing via `asyncio.gather()` for 90-120s total analysis vs 240s+ sequential

For detailed architectural philosophy, see [`CLAUDE.md`](CLAUDE.md#architectural-philosophy).

### Smart Image Preprocessing

The first image (thumbnail) uses conditional padding:
- **≤20% aspect ratio difference**: Kept as-is (already near-square)
- **>20% difference**: Padded to square with white background (simulates Amazon thumbnail)

Product-heavy images are analyzed correctly to avoid false-positive background warnings.

### Folder Structure

```
/
├── main.py                      # FastAPI app, all endpoints
├── config.py                    # Environment config, OpenAI client
├── CLAUDE.md                    # Project context and philosophy
├── CHANGELOG.md                 # Version history
├── README.md                    # This file
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (create this)
│
├── src/                         # Core application code
│   ├── CLAUDE.md               # Source code architecture
│   ├── models/
│   │   ├── models.py           # Pydantic request/response models
│   │   └── schemas.py          # OpenAI function calling schemas
│   ├── services/
│   │   ├── image_service.py    # Image fetch, preprocess, encode
│   │   ├── prompt_service.py   # Prompt loading and caching
│   │   └── video_service.py    # Sora 2 video generation integration
│   ├── analyzers/
│   │   └── image_analyzer.py   # Individual image analysis (map)
│   ├── synthesizers/
│   │   └── image_synthesizer.py # Image synthesis (reduce)
│   └── mocks/
│       └── mocks.py            # TEST_MODE mock responses
│
├── prompts/                     # AI prompt templates
│   ├── CLAUDE.md               # Prompt system architecture
│   └── analyze/                # Analysis prompts (15+ files)
│       ├── analyze_title.txt
│       ├── analyze_description.txt
│       ├── analyze_images.txt
│       ├── analyze_reviews.txt
│       └── ... (11+ more)
│
├── scripts/                     # Developer tools
│   ├── CLAUDE.md               # Scripts documentation
│   ├── testing/
│   │   └── test.py             # Endpoint testing suite
│   ├── debugging/              # Debug utilities
│   └── utilities/              # Helper scripts
│
├── data/                        # Test data and examples
│   ├── CLAUDE.md               # Test data documentation
│   ├── listings_data/          # Sample listing JSON files
│   ├── comparison_listings_data/ # Comparison test data
│   ├── rufus_data/             # Rufus Q&A test data
│   └── analysis_data/          # Analysis output archives
│
├── generated_videos/            # Sora 2 generated videos + metadata (not in repo)
│
└── results/                     # Test results (not in repo)
    ├── listing_analysis/        # Analysis test outputs
    └── comparison_analysis/     # Comparison test outputs
```

### Key Components

**Core Application:**
- **main.py** - FastAPI app with all 16 endpoints (analysis, comparison, video generation), rate limiting, error handling
- **config.py** - Environment configuration, OpenAI client setup, Sora 2 config, timeout constants

**Data Models:**
- **src/models/models.py** - Pydantic request/response models for all endpoints
- **src/models/schemas.py** - OpenAI function schemas for structured AI outputs

**Business Logic:**
- **src/services/image_service.py** - Image fetching, smart preprocessing, encoding
- **src/services/prompt_service.py** - Prompt loading and caching via PromptManager
- **src/services/video_service.py** - Sora 2 video generation, job polling, video download/storage
- **src/analyzers/image_analyzer.py** - Individual image analysis (map phase)
- **src/synthesizers/image_synthesizer.py** - Strategic synthesis (reduce phase)

**Testing & Development:**
- **src/mocks/mocks.py** - TEST_MODE mock responses (matches Pydantic schemas)
- **scripts/testing/test.py** - Comprehensive endpoint testing suite
- **prompts/** - Externalized AI prompts (easy to update without code changes)

---

## Troubleshooting

### Timeout Issues

**Problem: Video generation request hangs indefinitely**

**Solution:**
1. Check if you're using the `timeout` parameter in your request:
   ```json
   {
     "script": "...",
     "timeout": 600,  // Add this for 10-minute limit
     "..."
   }
   ```
2. If no timeout is set (`timeout: 0`), the server will wait until completion
3. Set a reasonable timeout for your infrastructure (600s for most cases, 1200s for stress testing)

**Problem: Getting 206 Partial Content status**

**Expected behavior:** Your timeout was exceeded and the system returned partial progress.

**What to do:**
1. Increase the timeout parameter: `{"timeout": 900}` (15 minutes)
2. Review `timing_summary` in the response to find the bottleneck
3. Check individual `scene_paths` in `/generated_videos` for completed scenes
4. Review server logs for detailed error messages

**Problem: Getting 400 Bad Request with timeout error**

**Cause:** Server timeout layer (REQUEST_TIMEOUT_SECONDS) exceeded all timeouts.

**Solution:**
1. Increase server timeout environment variable:
   ```bash
   REQUEST_TIMEOUT_SECONDS=1200 uvicorn main:app --port 8000
   ```
2. Review the request payload - ensure it's valid
3. Check network connectivity to Sora 2 API (Kie.ai)

### Understanding Timing Data

**Q: Why does scene_generation_duration dominate?**

A: Sora 2 API is inherently slow. 150-250s for complex videos is expected. This is not a bug - it's the nature of the service. To improve:
- Simplify prompts (fewer scene transitions, less detail)
- Use shorter durations (15s scenes generate faster than 30s)
- Use showcase style instead of UGC (fewer character detection steps)

**Q: How do I know if my infrastructure is fast enough?**

A: Measure with this baseline test:
```bash
python scripts/testing/test.py --videos 3 --timeout 900

# Collect timing_summary from all 3 responses
# Expected breakdown:
#   script_generation_duration: 5-10s
#   scene_generation_duration: 150-250s (Sora 2 API)
#   merge_duration: 2-5s
#   s3_upload_duration: 5-15s
#   total_duration: 160-280s

# If any stage significantly exceeds these, you have a bottleneck
```

**Q: What's the difference between timeout layers?**

A: Think of it like concentric safety nets:
```
Client Layer 3 (--timeout)
    ↓ (waits up to N seconds)
Endpoint Layer 2 (TIMEOUT_GENERATE_SCRIPT)
    ↓ (internal timeout for operations)
Server Layer 1 (REQUEST_TIMEOUT_SECONDS)
    ↓ (uvicorn hard stop)
Error to client
```

Each layer acts independently. Client timeout matters most for your application logic.

### Performance Tips

1. **Reduce timeout for quick tests:** `--timeout 30` to validate script generation only
2. **Monitor timing data:** Every response includes timing breakdown - use it!
3. **Batch operations:** Test 3-5 videos to get realistic performance metrics
4. **Scale infrastructure:** If merge duration is high, consider faster disk storage or better network bandwidth for S3

---

## Additional Resources

- **CLAUDE.md** - Project philosophy, architecture decisions, and development principles
- **CHANGELOG.md** - Detailed version history and feature changes
- **src/CLAUDE.md** - Source code organization and module architecture
- **prompts/CLAUDE.md** - Prompt system design and management
- **scripts/CLAUDE.md** - Developer tools and utilities documentation
- **data/CLAUDE.md** - Test data structure and usage

---

**Python Version Requirement:** Python 3.12+