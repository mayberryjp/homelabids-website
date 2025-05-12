export interface AlertInterval {
  [hour: number]: number; // hour index -> number of alerts
}

export interface AlertSummaryItem {
  ip: string;
  alert_interval: AlertInterval;
}

export type AlertsSummary = AlertSummaryItem[];

export type AlertSeverity =
  | "alert-none"
  | "alert-low"
  | "alert-medium"
  | "alert-high"
  | "alert-critical";

export const ALERT_THRESHOLDS = {
  NONE: 0,
  LOW: 10,
  MEDIUM: 25,
  HIGH: 100,
};

export const getAlertSeverity = (alertCount: number): AlertSeverity => {
  if (alertCount === ALERT_THRESHOLDS.NONE) {
    return "alert-none";
  } else if (alertCount <= ALERT_THRESHOLDS.LOW) {
    return "alert-low";
  } else if (alertCount <= ALERT_THRESHOLDS.MEDIUM) {
    return "alert-medium";
  } else if (alertCount <= ALERT_THRESHOLDS.HIGH) {
    return "alert-high";
  } else {
    return "alert-critical";
  }
};
