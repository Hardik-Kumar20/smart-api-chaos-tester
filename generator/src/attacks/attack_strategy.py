from attacks.payloads import SQLI_PAYLOADS, XSS_PAYLOADS

def generate_attack_cases(endpoint):
    schema = endpoint["schema"]
    properties = schema.get("properties", {})

    cases = []

    for field, meta in properties.items():
        if meta.get("type") == "string":
            for payload in SQLI_PAYLOADS:
                cases.append({
                    "method": endpoint["method"],
                    "url": endpoint["url"],
                    "payload": {field: payload},
                    "tags": ["attack", "sqli"]
                })
            
            for payload in XSS_PAYLOADS:
                cases.append({
                    "method": endpoint["method"],
                    "url": endpoint["url"],
                    "payload": {field: payload},
                    "tags": ["attack", "xss"]
                })
    return cases