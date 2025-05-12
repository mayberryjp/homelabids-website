export interface Action {
  id: string | number;
  text: string;
  acknowledged: number;
  timestamp?: string;
  // Add other relevant fields as needed
}
