import {
  ViolationType,
  SecurityConstants,
  VIOLATION_SEVERITY_MAP,
  SecurityEvent,
  SecurityReport,
} from "./Security.constants";

interface SecurityEventServiceConfig {
  quizId: string;
  sessionId: string;
  userId: string;
}

/**
 * SecurityEventService
 * Handles real-time tracking and reporting of security violations during quiz sessions.
 * Features:
 * - Real-time violation tracking
 * - Batch violation reporting
 * - Admin notification
 * - Audit trail generation
 * - Performance monitoring
 */
export class SecurityEventService {
  private config: SecurityEventServiceConfig;
  private violations: SecurityEvent[] = [];
  private sessionStartTime: Date;
  private lastViolationTime: Map<ViolationType, number> = new Map();
  private heartbeatInterval: NodeJS.Timer | null = null;

  constructor(config: SecurityEventServiceConfig) {
    this.config = config;
    this.sessionStartTime = new Date();
    this.initializeHeartbeat();
  }

  /**
   * Initialize periodic heartbeat to server
   * Keeps session alive and sends batched violations
   */
  private initializeHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, SecurityConstants.HEARTBEAT_INTERVAL);
  }

  /**
   * Track a single violation
   * @param type - Type of violation
   * @param message - Human-readable message
   */
  public trackViolation(type: ViolationType, message: string): void {
    // Implement cooldown to prevent spam
    const lastTime = this.lastViolationTime.get(type) || 0;
    if (Date.now() - lastTime < SecurityConstants.VIOLATION_COOLDOWN) {
      return;
    }

    const event: SecurityEvent = {
      type,
      severity: VIOLATION_SEVERITY_MAP[type],
      timestamp: new Date(),
      message,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };

    this.violations.push(event);
    this.lastViolationTime.set(type, Date.now());

    // Immediately report critical violations
    if (event.severity === "CRITICAL") {
      this.reportCriticalViolation(event);
    }
  }

  /**
   * Track auto-submit action
   * @param violations - Array of violations that triggered auto-submit
   */
  public trackAutoSubmit(violations: any[]): void {
    this.submitViolationReport(violations, "AUTO_SUBMIT");
  }

  /**
   * Report a critical violation immediately to admin
   * @param event - Security event to report
   */
  private reportCriticalViolation(event: SecurityEvent): void {
    this.sendToAdmin({
      sessionId: this.config.sessionId,
      quizId: this.config.quizId,
      userId: this.config.userId,
      event,
      critical: true,
      timestamp: new Date(),
    });
  }

  /**
   * Send heartbeat to server
   * Maintains session, batches violations
   */
  private sendHeartbeat(): void {
    if (this.violations.length === 0) return;

    const batch = this.violations.splice(0, 10); // Send max 10 violations per heartbeat
    this.sendToAdmin({
      sessionId: this.config.sessionId,
      quizId: this.config.quizId,
      userId: this.config.userId,
      violations: batch,
      type: "HEARTBEAT",
      timestamp: new Date(),
    }).catch((err) => {
      console.error("Failed to send heartbeat:", err);
      // Re-queue violations if send failed
      this.violations.unshift(...batch);
    });
  }

  /**
   * Generate and submit final violation report
   * Called when quiz ends or is auto-submitted
   */
  public submitViolationReport(
    violations: any[],
    reason: string = "NORMAL_SUBMIT"
  ): void {
    const report: SecurityReport = {
      sessionId: this.config.sessionId,
      quizId: this.config.quizId,
      userId: this.config.userId,
      startTime: this.sessionStartTime,
      endTime: new Date(),
      totalViolations: this.violations.length + violations.length,
      violations: this.violations,
      autoSubmitted: reason === "AUTO_SUBMIT",
      submissionReason: reason,
    };

    this.sendToAdmin({
      type: "FINAL_REPORT",
      report,
      timestamp: new Date(),
    }).finally(() => {
      this.cleanup();
    });
  }

  /**
   * Get current violation count
   */
  public getViolationCount(): number {
    return this.violations.length;
  }

  /**
   * Get all tracked violations
   */
  public getViolations(): SecurityEvent[] {
    return [...this.violations];
  }

  /**
   * Send data to admin backend
   * Uses fetch with proper error handling
   */
  private async sendToAdmin(payload: any): Promise<Response> {
    try {
      const response = await fetch(SecurityConstants.ADMIN_TRACKING_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        // Don't wait forever if admin endpoint is slow
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.error(
          `Admin tracking failed: ${response.status} ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      // Silently fail - don't disrupt exam
      console.error("Failed to send security event to admin:", error);
      throw error;
    }
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Destroy service
   */
  public destroy(): void {
    this.cleanup();
  }
}