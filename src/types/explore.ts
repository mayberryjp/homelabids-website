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
  dns_query?: string;      // updated field
  dns_response?: string;   // updated field
  src_country: string;
  dst_country: string;
  src_asn?: string | number | null;
  dst_asn?: string | number | null;
  src_isp: string | null;
  dst_isp: string | null;
  concat?: string;
}

export interface ExploreResponseData {
  total: number;
  page: number;
  page_size: number;
  results: ExploreFlow[];
}

export interface ExploreResponse {
  success: boolean;
  data: ExploreResponseData;
}
