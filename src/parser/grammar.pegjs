/*
 * Cormorant Agentic Language (CAL) Grammar
 * A domain-specific language for cascade analysis and AI orchestration
 * Based on the Cormorant Foraging Methodology
 * 
 * Sound × Space × Time → 6D Analysis
 */

{
  // Helper to build location info
  function loc() {
    return location();
  }
}

// ============================================
// PROGRAM STRUCTURE
// ============================================

Program
  = _ statements:Statement* _ {
      return {
        type: "Program",
        language: "Cormorant Agentic Language",
        version: "0.1.0",
        statements: statements
      };
    }

Statement
  = ForageStatement
  / DiveStatement
  / DriftStatement
  / FetchStatement
  / PerchStatement
  / ListenStatement
  / WakeStatement
  / ChirpStatement
  / TraceStatement
  / RecallStatement
  / WatchStatement
  / SurfaceStatement

// ============================================
// FORAGE - Primary query/search action
// ============================================

ForageStatement
  = FORAGE _ target:Identifier _ clauses:ForageClauses* _ {
      return {
        type: "Forage",
        target: target,
        ...Object.assign({}, ...clauses)
      };
    }

ForageClauses
  = WhereClause
  / AcrossClause
  / DepthClause
  / SurfaceClause

WhereClause
  = WHERE _ conditions:ConditionList _ {
      return { where: conditions };
    }

AcrossClause
  = ACROSS _ dimensions:DimensionList _ {
      return { across: dimensions };
    }

DepthClause
  = DEPTH _ level:Integer _ {
      return { depth: level };
    }

SurfaceClause
  = SURFACE _ output:Identifier _ {
      return { surface: output };
    }

// ============================================
// DIVE - Deep cascade analysis
// ============================================

DiveStatement
  = DIVE _ INTO _ target:Identifier _ clauses:DiveClauses* _ {
      return {
        type: "Dive",
        target: target,
        ...Object.assign({}, ...clauses)
      };
    }

DiveClauses
  = WhenClause
  / TraceClause
  / EmitClause

WhenClause
  = WHEN _ conditions:ConditionList _ {
      return { when: conditions };
    }

TraceClause
  = TRACE _ what:Identifier _ {
      return { trace: what };
    }

EmitClause
  = EMIT _ output:Identifier _ {
      return { emit: output };
    }

// ============================================
// DRIFT - Measure gap between methodology and performance
// ============================================

DriftStatement
  = DRIFT _ target:Identifier _ clauses:DriftClauses+ _ {
      return {
        type: "Drift",
        target: target,
        ...Object.assign({}, ...clauses)
      };
    }

DriftClauses
  = MethodologyClause
  / PerformanceClause
  / GapClause

MethodologyClause
  = METHODOLOGY _ score:Integer _ {
      return { methodology: score };
    }

PerformanceClause
  = PERFORMANCE _ score:Integer _ {
      return { performance: score };
    }

GapClause
  = GAP _ gapType:Identifier _ {
      return { gap: gapType };
    }

// ============================================
// FETCH - Action decision layer
// ============================================

FetchStatement
  = FETCH _ target:Identifier _ clauses:FetchClauses+ _ {
      return {
        type: "Fetch",
        target: target,
        ...Object.assign({}, ...clauses)
      };
    }

FetchClauses
  = ThresholdClause
  / ConfidenceClause
  / OnExecuteClause
  / OnConfirmClause
  / OnQueueClause
  / OnWaitClause

ThresholdClause
  = THRESHOLD _ value:Integer _ {
      return { threshold: value };
    }

ConfidenceClause
  = CONFIDENCE _ value:Integer _ {
      return { confidence: value };
    }

OnExecuteClause
  = ON _ EXECUTE _ action:Statement _ {
      return { onExecute: action };
    }

OnConfirmClause
  = ON _ CONFIRM _ action:Statement _ {
      return { onConfirm: action };
    }

OnQueueClause
  = ON _ QUEUE _ action:Statement _ {
      return { onQueue: action };
    }

OnWaitClause
  = ON _ WAIT _ action:Statement _ {
      return { onWait: action };
    }

// ============================================
// PERCH - Observe/wait (Space dimension)
// ============================================

PerchStatement
  = PERCH _ ON _ target:TargetSpec _ clauses:PerchClauses* _ {
      return {
        type: "Perch",
        target: target,
        ...Object.assign({}, ...clauses)
      };
    }

PerchClauses
  = ListenClause
  / WakeClause
  / ChirpClause

// ============================================
// LISTEN - Monitor signals (Sound dimension)
// ============================================

ListenStatement
  = LISTEN _ FOR _ signals:SignalList _ {
      return {
        type: "Listen",
        signals: signals
      };
    }

ListenClause
  = LISTEN _ FOR _ signals:SignalList _ {
      return { listen: signals };
    }

// ============================================
// WAKE - Time triggers (Time dimension)
// ============================================

WakeStatement
  = WAKE _ AFTER _ duration:Duration _ action:WakeAction? _ {
      return {
        type: "Wake",
        after: duration,
        action: action || null
      };
    }

WakeClause
  = WAKE _ AFTER _ duration:Duration _ {
      return { wake: duration };
    }

WakeAction
  = THEN _ statement:Statement {
      return statement;
    }

// ============================================
// CHIRP - Alert/output (Sound emission)
// ============================================

ChirpStatement
  = CHIRP _ alertType:Identifier _ message:StringLiteral? _ {
      return {
        type: "Chirp",
        alert: alertType,
        message: message || null
      };
    }

ChirpClause
  = CHIRP _ alertType:Identifier _ {
      return { chirp: alertType };
    }

// ============================================
// TRACE - Follow cascade pathways
// ============================================

TraceStatement
  = TRACE _ what:Identifier _ from:FromClause? _ {
      return {
        type: "Trace",
        target: what,
        from: from || null
      };
    }

FromClause
  = FROM _ source:Identifier _ {
      return source;
    }

// ============================================
// SURFACE - Return/output results
// ============================================

// ============================================
// RECALL - Prognostic validation (v1.2)
// ============================================

RecallStatement
  = RECALL _ target:Identifier _ ON _ date:StringLiteral _
    watches:RecallWatchClause+ _
    triggers:TriggersClause _
    confStated:ConfidenceStatedClause _
    confActual:ConfidenceActualClause _
    calibration:CalibrationClause _
    driftAfter:DriftAfterClause? _
    surface:RecallSurfaceClause? _ {
      return {
        type: "Recall",
        target: target,
        date: date,
        watches: watches,
        triggersFired: triggers.triggersFired,
        triggersTotal: triggers.triggersTotal,
        confidenceStated: confStated,
        confidenceActual: confActual,
        calibration: calibration,
        driftAfter: driftAfter || undefined,
        surfaceOutput: surface ? surface.surfaceOutput : undefined,
        surfaceFormat: surface ? surface.surfaceFormat : undefined
      };
    }

RecallWatchClause
  = WATCH _ triggerId:Identifier _ STATUS _ status:RecallStatus _
    firedDate:FiredDateClause? _
    evidence:EvidenceClause? _ {
      return {
        triggerId: triggerId,
        status: status,
        firedDate: firedDate || null,
        evidence: evidence || null
      };
    }

RecallStatus
  = "fired"i { return "fired"; }
  / "not_fired"i { return "not_fired"; }
  / "partial"i { return "partial"; }

FiredDateClause
  = FIRED_DATE _ date:StringLiteral _ { return date; }

EvidenceClause
  = EVIDENCE _ text:StringLiteral _ { return text; }

TriggersClause
  = TRIGGERS _ fired:Integer "/" total:Integer _ {
      return { triggersFired: fired, triggersTotal: total };
    }

ConfidenceStatedClause
  = CONFIDENCE_STATED _ value:Number _ { return value; }

ConfidenceActualClause
  = CONFIDENCE_ACTUAL _ value:Number _ { return value; }

CalibrationClause
  = CALIBRATION _ value:CalibrationValue _ { return value; }

CalibrationValue
  = "aligned"i { return "aligned"; }
  / "over"i { return "over"; }
  / "under"i { return "under"; }

DriftAfterClause
  = DRIFT_AFTER _ score:Number _ { return score; }

RecallSurfaceClause
  = SURFACE _ what:Identifier _ AS _ format:Identifier _ {
      return { surfaceOutput: what, surfaceFormat: format };
    }

// ============================================
// WATCH - Continuous condition monitoring
// ============================================

WatchStatement
  = WATCH _ target:Identifier _ WHEN _ conditions:ConditionList _ {
      return {
        type: "Watch",
        target: target,
        when: conditions
      };
    }

// ============================================
// SURFACE - Return results (with optional scheduled resurface)
// ============================================

SurfaceStatement
  = SURFACE _ what:Identifier _ as:AsClause? _ on:OnDateClause? _ {
      return {
        type: "Surface",
        output: what,
        format: as || "json",
        scheduledDate: on || null
      };
    }

AsClause
  = AS _ format:Identifier _ {
      return format;
    }

OnDateClause
  = ON _ date:StringLiteral _ {
      return date;
    }

// ============================================
// CONDITIONS & EXPRESSIONS
// ============================================

ConditionList
  = first:Condition rest:(LogicalOp Condition)* {
      if (rest.length === 0) return [first];
      return [first, ...rest.map(r => r[1])];
    }

Condition
  = left:PropertyPath _ op:ComparisonOp _ right:ConditionValue {
      return {
        left: left,
        operator: op,
        right: right
      };
    }

ConditionValue
  = Duration
  / StringLiteral
  / Number
  / Identifier

PropertyPath
  = first:Identifier rest:("." Identifier)* {
      if (rest.length === 0) return first;
      return [first, ...rest.map(r => r[1])].join(".");
    }

ComparisonOp
  = ">=" { return ">="; }
  / "<=" { return "<="; }
  / "!=" { return "!="; }
  / "=" { return "="; }
  / ">" { return ">"; }
  / "<" { return "<"; }
  / IS _ NOT { return "!="; }
  / IS { return "="; }

LogicalOp
  = _ AND _ { return "AND"; }
  / _ OR _ { return "OR"; }

// ============================================
// DIMENSIONS (6D)
// ============================================

DimensionList
  = first:Dimension rest:(_ "," _ Dimension)* {
      return [first, ...rest.map(r => r[3])];
    }

Dimension
  = "D1" { return { id: "D1", name: "Customer" }; }
  / "D2" { return { id: "D2", name: "Employee" }; }
  / "D3" { return { id: "D3", name: "Revenue" }; }
  / "D4" { return { id: "D4", name: "Regulatory" }; }
  / "D5" { return { id: "D5", name: "Quality" }; }
  / "D6" { return { id: "D6", name: "Operational" }; }
  / "ALL" { return { id: "ALL", name: "All Dimensions" }; }

// ============================================
// SIGNALS
// ============================================

SignalList
  = first:Signal rest:(_ "," _ Signal)* {
      return [first, ...rest.map(r => r[3])];
    }

Signal
  = name:Identifier _ "signals" { return { type: "signal", name: name }; }
  / name:Identifier { return { type: "signal", name: name }; }

// ============================================
// TARGET SPECIFICATIONS
// ============================================

TargetSpec
  = key:Identifier ":" value:StringLiteral {
      return { type: "keyed", key: key, value: value };
    }
  / name:Identifier {
      return { type: "simple", name: name };
    }

// ============================================
// DURATION / TIME
// ============================================

Duration
  = value:Integer unit:TimeUnit {
      return { value: value, unit: unit };
    }

TimeUnit
  = "d" { return "days"; }
  / "h" { return "hours"; }
  / "m" { return "minutes"; }
  / "w" { return "weeks"; }
  / "mo" { return "months"; }

// ============================================
// VALUES & LITERALS
// ============================================

Value
  = StringLiteral
  / Number
  / Duration
  / Identifier

StringLiteral
  = '"' chars:[^"]* '"' { return chars.join(""); }

Number
  = Integer ("." Integer)? {
      return parseFloat(text());
    }

Integer
  = [0-9]+ { return parseInt(text(), 10); }

Identifier
  = first:[a-zA-Z_] rest:[a-zA-Z0-9_-]* {
      return first + rest.join("");
    }

// ============================================
// KEYWORDS (case-insensitive)
// ============================================

FORAGE = "FORAGE"i
DIVE = "DIVE"i
INTO = "INTO"i
DRIFT = "DRIFT"i
FETCH = "FETCH"i
PERCH = "PERCH"i
ON = "ON"i
LISTEN = "LISTEN"i
FOR = "FOR"i
WAKE = "WAKE"i
AFTER = "AFTER"i
CHIRP = "CHIRP"i
TRACE = "TRACE"i
SURFACE = "SURFACE"i
WHERE = "WHERE"i
ACROSS = "ACROSS"i
DEPTH = "DEPTH"i
WHEN = "WHEN"i
EMIT = "EMIT"i
FROM = "FROM"i
AS = "AS"i
THEN = "THEN"i
AND = "AND"i
OR = "OR"i
IS = "IS"i
NOT = "NOT"i
METHODOLOGY = "METHODOLOGY"i
PERFORMANCE = "PERFORMANCE"i
GAP = "GAP"i
THRESHOLD = "THRESHOLD"i
CONFIDENCE = "CONFIDENCE"i
EXECUTE = "EXECUTE"i
CONFIRM = "CONFIRM"i
QUEUE = "QUEUE"i
WAIT = "WAIT"i
WATCH = "WATCH"i
RECALL = "RECALL"i
STATUS = "STATUS"i
FIRED_DATE = "FIRED_DATE"i
EVIDENCE = "EVIDENCE"i
TRIGGERS = "TRIGGERS"i
CONFIDENCE_STATED = "CONFIDENCE_STATED"i
CONFIDENCE_ACTUAL = "CONFIDENCE_ACTUAL"i
CALIBRATION = "CALIBRATION"i
DRIFT_AFTER = "DRIFT_AFTER"i

// ============================================
// WHITESPACE & COMMENTS
// ============================================

_ "whitespace"
  = ([ \t\n\r] / Comment)*

Comment
  = "--" [^\n]* { return null; }
  / "//" [^\n]* { return null; }
