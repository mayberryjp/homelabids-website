export interface ConfigurationDefinition {
  category: string;
  displayName: string;
  type: "INT" | "Text/String" | "Text/Int" | "Text Input" | "Boolean/Toggle";
  key: string;
  details?: string;
  default?: string;
  suggested?: string;
}

export interface ConfigurationSetting extends ConfigurationDefinition {
  value?: any;
  alert?: boolean;
  notify?: boolean;
  reNotify?: boolean;
}

export interface ConfigurationApiItem {
  key: string;
  value: any;
}

export interface ConfigurationResponse {
  [key: string]: any;
}
