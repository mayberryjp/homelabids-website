export interface AlertInterval {
  [hour: number]: number; // hour index -> number of alerts
}

export interface AlertSummary {
  alert_intervals: number[];
}

export interface AlertsSummaryStore {
  [key: string]: AlertSummary;
}

export interface AlertDetail {
  ip_address: string;
  alert_intervals: number[];
}

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

export interface Alert {
  id: string;
  ip_address: string;
  flow: string;
  category: string;
  enrichment_1: string;
  enrichment_2: string;
  times_seen: number;
  first_seen: string;
  last_seen: string;
  acknowledged: boolean;
  local_description: string;
}

export interface IgnoreListItem {
  id: string;
  src_ip: string;
  dst_ip: string;
  dst_port: number;
  protocol: number;
  times_seen: number;
  first_seen: string;
  last_seen: string;
}
