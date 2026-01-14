# CAL Examples

This directory contains example CAL scripts demonstrating various features of the Cormorant Agentic Language.

## Quick Start

Run any example with:

```bash
cal run examples/simple-query.cal --data examples/data/entities.json
```

## Examples

### 1. simple-query.cal
Basic entity querying with filters.

**Demonstrates:**
- FORAGE keyword for data querying
- WHERE clause filtering
- SURFACE for output

**Usage:**
```bash
cal run examples/simple-query.cal --data examples/data/entities.json
```

### 2. drift-analysis.cal
Gap analysis using the DRIFT formula (Methodology - Performance).

**Demonstrates:**
- DRIFT keyword for gap measurement
- Methodology vs Performance comparison
- CHIRP for alerting

**Usage:**
```bash
cal run examples/drift-analysis.cal --data examples/data/entities.json
```

### 3. tailwind-cascade.cal
Real-world cascade analysis based on Tailwind CSS case study.

**Demonstrates:**
- Multi-dimensional analysis (ACROSS D1, D2, D3, D5, D6)
- DEPTH for cascade depth control
- DIVE for deep analysis
- PERCH for observation positioning
- LISTEN for signal monitoring
- WAKE for time-based triggers

**Usage:**
```bash
cal run examples/tailwind-cascade.cal --data examples/data/entities.json --verbose
```

### 4. closed-loop-pipeline.cal
Complete 5-layer intelligence pipeline: Sense → Analyze → Measure → Decide → Act.

**Demonstrates:**
- Full DRIFT formula usage
- FETCH decision logic with thresholds
- Conditional actions (ON EXECUTE, ON CONFIRM, etc.)
- Complete cascade workflow

**Usage:**
```bash
cal run examples/closed-loop-pipeline.cal --data examples/data/entities.json
```

## Data Files

### entities.json
Sample dataset containing four entities:
- **Tailwind CSS**: High-impact, significant cascade (80% revenue decline)
- **Stack Overflow**: High-impact, traffic decline (35%)
- **GitHub Copilot**: High-impact, growth enabler
- **Stable Enterprise Co**: Low-impact baseline

Each entity includes:
- Core dimensions (sound, space, time)
- 6D framework data (D1-D6)
- Metadata and business metrics

## Formula Reference

### 3D Lens
```
(Sound × Space × Time) / 10
```
Urgency score from 0-100. Higher values indicate more urgent signals.

### DRIFT
```
Methodology - Performance
```
Gap measurement. Positive values indicate performance below methodology expectations.

### FETCH
```
Chirp × |DRIFT| × Confidence
```
Decision score for action triggering. Compares against threshold for routing.

## 6D Framework

- **D1**: Customer dimension
- **D2**: Employee dimension
- **D3**: Revenue dimension
- **D4**: Regulatory dimension
- **D5**: Quality dimension
- **D6**: Operational dimension

## Command Options

```bash
# Verbose output
cal run script.cal --verbose

# Custom data location
cal run script.cal --data-path ./my-data

# Save output to file
cal run script.cal --output results.json

# Quiet mode
cal run script.cal --quiet

# Analyze without execution
cal analyze script.cal

# Validate syntax
cal validate script.cal
```

## Learn More

- [CAL Documentation](../README.md)
- [Type System](../src/types/index.ts)
- [Formula Implementations](../src/analyzer/index.ts)
