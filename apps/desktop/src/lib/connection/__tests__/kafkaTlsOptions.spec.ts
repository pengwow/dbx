import { describe, expect, it } from "vitest";
import { buildKafkaTlsSection, kafkaTlsFromExternalConfig } from "@/lib/connection/kafkaTlsOptions";

describe("kafkaTlsOptions", () => {
  it("reads snake_case PEM paths from the tls section", () => {
    expect(
      kafkaTlsFromExternalConfig({
        tls: { ca_cert_path: "/certs/ca-chain.pem", client_cert_path: "/certs/client.crt", client_key_path: "/certs/client.key" },
      }),
    ).toEqual({
      ca_cert_path: "/certs/ca-chain.pem",
      client_cert_path: "/certs/client.crt",
      client_key_path: "/certs/client.key",
    });
  });

  it("returns empty fields when the tls section is missing or malformed", () => {
    expect(kafkaTlsFromExternalConfig(undefined)).toEqual({ ca_cert_path: "", client_cert_path: "", client_key_path: "" });
    expect(kafkaTlsFromExternalConfig({})).toEqual({ ca_cert_path: "", client_cert_path: "", client_key_path: "" });
    expect(kafkaTlsFromExternalConfig({ tls: { ca_cert_path: 42 } })).toEqual({
      ca_cert_path: "",
      client_cert_path: "",
      client_key_path: "",
    });
  });

  it("builds a trimmed tls section only when any path is set", () => {
    expect(buildKafkaTlsSection({ ca_cert_path: "", client_cert_path: "  ", client_key_path: "" })).toBeUndefined();
    expect(buildKafkaTlsSection({ ca_cert_path: " /certs/ca-chain.pem ", client_cert_path: "", client_key_path: "" })).toEqual({
      tls: { ca_cert_path: "/certs/ca-chain.pem", client_cert_path: "", client_key_path: "" },
    });
  });
});
