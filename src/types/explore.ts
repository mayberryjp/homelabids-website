export interface ExploreFlow {
  flow_id: number;
  src_ip: string;
  dst_ip: string;
  src_ip_int?: number; 
  dst_ip_int?: number;
  src_port: number;
  dst_port: number;
  protocol: string;
  tags: string;
  flow_start: string;
  last_seen: string;
  packets: number;
  bytes: number;
  times_seen: number;
  dns_query: string;
  dns_response: string;
  src_country: string;
  dst_country: string;
  src_asn?: number | null; 
  dst_asn?: number | null; 
  src_isp: string | null;
  dst_isp: string | null;
  concat?: string;
}

export interface ExploreResponse {
  data: ExploreFlow[];
  success: boolean;
}
