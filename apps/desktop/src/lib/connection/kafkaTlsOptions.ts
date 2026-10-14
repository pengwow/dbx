export interface KafkaTlsConfig {
  ca_cert_path: string;
  client_cert_path: string;
  client_key_path: string;
}

function stringField(value: unknown, key: string): string {
  if (!value || typeof value !== "object") return "";
  const field = (value as Record<string, unknown>)[key];
  return typeof field === "string" ? field : "";
}

export function kafkaTlsFromExternalConfig(value: unknown): KafkaTlsConfig {
  const tls = value && typeof value === "object" ? (value as Record<string, unknown>).tls : undefined;
  return {
    ca_cert_path: stringField(tls, "ca_cert_path"),
    client_cert_path: stringField(tls, "client_cert_path"),
    client_key_path: stringField(tls, "client_key_path"),
  };
}

export function buildKafkaTlsSection(tls: KafkaTlsConfig): { tls: KafkaTlsConfig } | undefined {
  const caCertPath = tls.ca_cert_path.trim();
  const clientCertPath = tls.client_cert_path.trim();
  const clientKeyPath = tls.client_key_path.trim();
  // 三个路径全空时不落 tls section，保持旧连接的 external_config 形状不变。
  if (!caCertPath && !clientCertPath && !clientKeyPath) return undefined;
  return { tls: { ca_cert_path: caCertPath, client_cert_path: clientCertPath, client_key_path: clientKeyPath } };
}
