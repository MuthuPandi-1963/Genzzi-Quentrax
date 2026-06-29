export enum ViolationType {
  RIGHT_CLICK = "RIGHT_CLICK",
  COPY_PASTE = "COPY_PASTE",
  KEYBOARD_SHORTCUT = "KEYBOARD_SHORTCUT",
  DEVTOOLS_SHORTCUT = "DEVTOOLS_SHORTCUT",
  TAB_SWITCH = "TAB_SWITCH",
  DEVTOOLS_OPENED = "DEVTOOLS_OPENED",
  EXIT_FULLSCREEN = "EXIT_FULLSCREEN",
  FULLSCREEN_DENIED = "FULLSCREEN_DENIED",
  PAGE_REFRESH = "PAGE_REFRESH",
  SUSPICIOUS_NETWORK = "SUSPICIOUS_NETWORK",
  UNUSUAL_MEMORY = "UNUSUAL_MEMORY",
}

export enum ViolationSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export const VIOLATION_SEVERITY_MAP: Record<ViolationType, ViolationSeverity> =
  {
    [ViolationType.RIGHT_CLICK]: ViolationSeverity.LOW,
    [ViolationType.COPY_PASTE]: ViolationSeverity.MEDIUM,
    [ViolationType.KEYBOARD_SHORTCUT]: ViolationSeverity.MEDIUM,
    [ViolationType.DEVTOOLS_SHORTCUT]: ViolationSeverity.HIGH,
    [ViolationType.TAB_SWITCH]: ViolationSeverity.HIGH,
    [ViolationType.DEVTOOLS_OPENED]: ViolationSeverity.CRITICAL,
    [ViolationType.EXIT_FULLSCREEN]: ViolationSeverity.MEDIUM,
    [ViolationType.FULLSCREEN_DENIED]: ViolationSeverity.HIGH,
    [ViolationType.PAGE_REFRESH]: ViolationSeverity.HIGH,
    [ViolationType.SUSPICIOUS_NETWORK]: ViolationSeverity.CRITICAL,
    [ViolationType.UNUSUAL_MEMORY]: ViolationSeverity.MEDIUM,
  };

export const SecurityConstants = {
  // Detection thresholds
  DEVTOOLS_THRESHOLD: 160, // pixels
  MEMORY_THRESHOLD: 85, // percentage
  DETECTION_INTERVAL: 2000, // milliseconds
  WARNING_DISPLAY_DURATION: 3000, // milliseconds

  // Violation escalation
  DEFAULT_MAX_VIOLATIONS: 3,
  VIOLATION_COOLDOWN: 1000, // milliseconds between same violations

  // Session security
  SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  INACTIVITY_TIMEOUT: 300000, // 5 minutes

  // API endpoints
  ADMIN_TRACKING_ENDPOINT: "/api/admin/track-violation",
  VIOLATION_REPORT_ENDPOINT: "/api/admin/violation-report",
  SESSION_ENDPOINT: "/api/session",

  // UI messages
  MESSAGES: {
    RIGHT_CLICK_BLOCKED: "Right-click is disabled during the exam",
    COPY_PASTE_BLOCKED: "Copy/Paste is disabled during the exam",
    DEVTOOLS_BLOCKED: "Developer tools access is not permitted",
    TAB_SWITCH_DETECTED: "Tab switching detected during exam",
    FULLSCREEN_REQUIRED: "Fullscreen mode is required for the exam",
    AUTO_SUBMIT_WARNING:
      "Exam will auto-submit due to excessive violations",
  },
};

export interface SecurityEvent {
  type: ViolationType;
  severity: ViolationSeverity;
  timestamp: Date;
  message: string;
  userAgent?: string;
  screenResolution?: string;
  ip?: string;
}

export interface SecurityReport {
  sessionId: string;
  quizId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  totalViolations: number;
  violations: SecurityEvent[];
  autoSubmitted: boolean;
  submissionReason?: string;
}