export interface Localhost {
  ip_address: string;
  first_seen: string;
  original_flow: string;
  mac_address: string;
  mac_vendor: string;
  dhcp_hostname: string;
  dns_hostname: string;
  os_fingerprint: string;
  local_description: string;
  lease_hostname: string | null;
  lease_hwaddr: string | null;
  lease_clientid: string | null;
  icon: string;
  tags: string | null;
  acknowledged: number;
  alerts_enabled: number;
  threat_score: number;
  management_link?: string;
}
