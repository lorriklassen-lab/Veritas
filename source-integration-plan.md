# Source Integration Plan — Veritas Biblical Research Assistant

## 1. Integration Philosophy

Not all sources should be integrated in the same way. We distinguish between:

- **Directly Embedded** — Sources whose content is loaded into the Veritas knowledge base or vector index for direct query. These are the most-used, highest-authority sources.
- **Referenced** — Sources whose content is known at the metadata level but not loaded. Cited on demand when the query matches their domain.
- **On-Demand** — Sources accessed via search query only when specific questions demand them.

---

## 2. Integration Priority List

### PHASE 1: Foundation (Build First — Highest Priority)
These sources cover the vast majority of biblical research questions.

| Priority | Source | Type | Rationale |
|---|---|---|---|
| 1 | **NASB / ESV / CSB / NIV** (Bible texts) | Directly Embedded | Every answer needs a translation. At least these four. |
| 2 | **BDAG** (Greek Lexicon) | Directly Embedded | Most consulted lexical resource. Word studies are ~40% of queries. |
| 3 | **HALOT / BDB** (Hebrew Lexicons) | Directly Embedded | OT word studies are a major query category. |
| 4 | **Strong's Concordance** (numbers + basic definitions) | Referenced | Lay-level word study access. |
| 5 | **NICNT / NICOT** commentary series | Directly Embedded | Gold-standard commentary series covering both testaments. |

### PHASE 2: Core Scholarship (Build Next — High Priority)
These sources add depth and breadth for serious users.

| Priority | Source | Type | Rationale |
|---|---|---|---|
| 6 | **IVP Bible Background Commentaries** (OT & NT) | Directly Embedded | Historical context questions are extremely common. |
| 7 | **NIDNTTE / NIDOTTE** | Directly Embedded | Extended word-study beyond lexicon definitions. |
| 8 | **PNTC (Pillar NT Commentary)** | Referenced (with key passages embedded) | Excellent for pastors; sermon-level insight. |
| 9 | **BECNT (Baker Exegetical)** | Referenced (with key passages embedded) | Detailed exegesis for complex passages. |
| 10 | **Wallace, *Greek Grammar Beyond the Basics*** | Referenced | Grammatical analysis for advanced users. |
| 11 | **Waltke & O'Connor, *Hebrew Syntax*** | Referenced | Hebrew syntax analysis. |
| 12 | **Keener, *IVP Background: NT*** | Directly Embedded | (Phase 2 overlap — already priority 6) |

### PHASE 3: Theology & Reference (Build Next — Medium Priority)
These sources cover theological and reference-level questions.

| Priority | Source | Type | Rationale |
|---|---|---|---|
| 13 | **Grudem, *Systematic Theology*** | Referenced | Evangelical systematic theology reference. |
| 14 | **Erickson, *Christian Theology*** | Referenced | Complementary systematic. |
| 15 | **N. T. Wright, selected works** | Referenced (key topics) | Important for NT theology, Paul, resurrection. |
| 16 | **IVP Dictionary Series** (Jesus/Gospels, Paul, OT Pentateuch, etc.) | Directly Embedded (article-level) | Encyclopedia entries on key topics. |
| 17 | **Carson, *Exegetical Fallacies*** | Referenced | Hermeneutical guardrails. |
| 18 | **González, *The Story of Christianity*** | Referenced | Church history. |
| 19 | **Josephus, *Antiquities / Wars*** | Referenced | Historical background for NT/Social World. |

### PHASE 4: Supplementary Depth (Build Last — Lower Priority)
Niche topics, denominational sources, special projects.

| Priority | Source | Type | Rationale |
|---|---|---|---|
| 20 | **TOTC/TNTC commentary series** | Referenced | Concise commentary for quick reference. |
| 21 | **WBC (Word Biblical Commentary)** | Referenced | Technical detail for scholars. |
| 22 | **Anchor Yale Bible Commentary** | Referenced | Academic mainline perspective. |
| 23 | **Catechism of the Catholic Church** | Referenced | Catholic doctrine reference. |
| 24 | **Book of Concord** | Referenced | Lutheran confessional reference. |
| 25 | **Westminster Confession** | Referenced | Reformed confessional reference. |
| 26 | **Early Church Fathers (ANF/NPNF)** | Referenced | Patristic source for historical theology. |
| 27 | **Eusebius, *Ecclesiastical History*** | Referenced | Early church history. |
| 28 | **Dead Sea Scrolls** | Referenced | OT textual background. |

---

## 3. Cross-Reference Strategy

### Automated Cross-References
Veritas should link related content automatically. Guidelines:

| Situation | Cross-Reference Type | Example |
|---|---|---|
| Same term in different testaments | Lexical cross-reference | "The NT use of ἐκκλησία connects to the OT קָהָל" |
| Same event in multiple Gospels | Synoptic cross-reference | "See also Mark 9:2-13; Luke 9:28-36 (Transfiguration)" |
| OT quotation in NT | Fulfillment cross-reference | "Matthew 1:23 cites Isaiah 7:14 — see that passage for context" |
| Related theological teaching | Theological cross-reference | "On this topic, see also Romans 9 (election) and Ephesians 1 (predestination)" |
| Type/antitype patterns | Typological cross-reference | "The bronze serpent (Num 21:4-9) is a type pointing to Christ's crucifixion (John 3:14-15)" |

### Cross-Reference Depth
- **Shallow (default for short answers):** 1-2 cross-references to the most directly relevant passages.
- **Deep (for long-form / sermon prep):** Multiple cross-references organized by category (biblical, theological, historical).

---

## 4. Theological Topics Requiring Extra Care

### Tier 1: Highest Care Required (Must Represent Multiple Views)

These topics are the most contested and pastorally sensitive.

| Topic | Key Questions | Must Include |
|---|---|---|
| **Trinity** | One God, three persons? Biblical basis? | Nicene/Chalcedonian orthodoxy; scriptural foundations; Arian/modern unitarian as minority view |
| **Salvation / Election** | Calvinism vs. Arminianism | Both views fairly; key texts (Rom 9, Eph 1, 2 Pet 3:9, 1 Tim 2:4) |
| **Eschatology** | Pre/Post/Amillennial; rapture timing | All major positions; hermeneutical basis of each |
| **Baptism** | Believer vs. infant; mode | Credo and paedo views; key texts (Acts 2:38-39, Rom 6:3-4, Col 2:11-12) |
| **Lord's Supper / Eucharist** | Real presence vs. memorial vs. spiritual presence | Catholic, Lutheran, Reformed, Baptist views |
| **Spiritual Gifts** | Cessationism vs. Continuationism | Both views; key texts (1 Cor 12-14, Eph 2:20) |

### Tier 2: Moderate Care Required

| Topic | Key Questions | Must Include |
|---|---|---|
| **Creation** | Age of earth, interpretation of Gen 1-2 | YEC, OEC (day-age/framework), evolutionary creation |
| **Gender Roles** | Complementarian vs. Egalitarian | Both views; key texts (Eph 5, 1 Tim 2, Gal 3:28) |
| **Divorce & Remarriage** | Permitted grounds, remarriage | Key texts (Matt 5:31-32, Matt 19, 1 Cor 7) |
| **OT Violence** | Canaanite conquest, divine warfare | ANE context, theological interpretations |
| **Divine Sovereignty vs. Human Free Will** | Compatibilism vs. libertarian free will | Both positions; key texts |
| **Hell & Judgment** | Eternal conscious torment vs. annihilationism vs. universalism | Majority view; minority views if relevant |
| **Atonement Theories** | Penal substitution, Christus Victor, moral influence, ransom | Each theory; scriptural basis for each |

### Tier 3: Standard Care Required

| Topic | Key Questions | Must Include |
|---|---|---|
| Prayer, worship, discipleship, church polity, marriage, suffering, angels/demons, miracles, inspiration/inerrancy of Scripture, canon formation, textual criticism | Standard doctrinal treatment | Mainstream evangelical/orthodox consensus |

---

## 5. Handling Cross-Testament Connections

### OT → NT (Promise → Fulfillment)
- Identify which OT passages are directly quoted in the NT.
- Distinguish between: direct prophecy + fulfillment, typological fulfillment, and NT use of OT for illustrative purposes.
- When the NT reinterprets an OT text (e.g., Hosea 11:1 cited in Matthew 2:15), explain the hermeneutic.

### NT → OT (Retrospective interpretation)
- When a NT author uses an OT text differently than its original context would suggest, acknowledge this.
- Representative approaches to this tension: sensus plenior (fuller meaning), typological, canonical approach, apostolic hermeneutic.

---

## 6. Knowledge Base Architecture Notes

For the engineering team building the retrieval system:

### Embedding Priorities
1. **Verse-level embeddings** — Every verse indexed with its text in multiple translations + metadata (book, chapter, genre, key words).
2. **Lexicon entry embeddings** — Every BDAG/HALOT entry embedded for semantic search.
3. **Commentary passage embeddings** — Commentary sections aligned to their biblical passages.
4. **Theological article embeddings** — Key articles from IVP Dictionaries, systematic theologies.

### Retrieval-Augmented Generation (RAG) Strategy
- **Query → Expand** — Expand user query with related terms (e.g., "sanctification" → also search "holiness," "set apart," "ἁγιασμός").
- **Passage identification** — First identify which biblical passage(s) the query relates to.
- **Source tier ranking** — Prioritize returning Primary tier sources in retrieval.
- **Cross-reference chaining** — When a passage is returned, auto-include the 2 most commonly cross-referenced passages.

### Source Metadata
Every source in the knowledge base should be tagged with:
- `tier`: primary, standard, supplemental
- `tradition`: evangelical, catholic, orthodox, mainline, etc.
- `type`: translation, lexicon, commentary, theology, history, background
- `coverage`: OT, NT, both, specific books
- `controversial_topics`: [list of topics from Section 4 if relevant]

### Source De-duplication
- If multiple sources say the same thing, prefer the highest-tier source and note the others as "cf."
- If sources disagree, surface both with tier markers.

---

## 7. Denominational Neutrality in Retrieval

The retrieval system should:
1. By default, return **broadly evangelical / orthodox** sources.
2. When a user asks a question tied to a specific tradition (e.g., "What does the Catholic Church teach about..."), prioritize that tradition's sources.
3. For controversial intra-Protestant topics, return sources from BOTH sides.
4. Never return only one side of a debated topic unless the user explicitly asks for it.

---

## 8. Implementation Timeline Suggestion

| Phase | Estimated Effort | Deliverable |
|---|---|---|
| 1: Foundation | 2-3 weeks | 4 Bible translations + BDAG + HALOT + Strong's + NICNT/NICOT embedded |
| 2: Core | 3-4 weeks | IVP Background, NIDNTTE/NIDOTTE, PNTC, BECNT, Wallace, Waltke embedded |
| 3: Theology | 2-3 weeks | Systematic theologies, IVP Dictionaries, Josephus |
| 4: Supplementary | 2-3 weeks | Remaining commentary series, confessions, patristics |
| Ongoing | Continuous | User feedback-driven expansion; new commentaries as published |