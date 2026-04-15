def generate_valid_case(endpoint):
    schema = endpoint["schema"]
    properties = schema.get("properties", {})

    payload = {}

    for field, meta in properties.items():
        if meta.get("type") == "string":
            payload[field] = "test"
        elif meta.get("type") == "integer":
            payload[field] = 1

    return {
        "method": endpoint["method"],
        "url": endpoint["url"],
        "payload": payload,
        "tags": ["valid"]
    }

def generate_invalid_cases(endpoint):
    schema = endpoint["schema"]
    properties = schema.get("properties", {})

    cases = []

    for field, meta in properties.items():
        if meta.get("type") == "string":
            cases.append({
                "method": endpoint["method"],
                "url": endpoint["url"],
                "payload": {field: 123},  
                "tags": ["invalid", "type"]
            })

        if meta.get("type") == "integer":
            cases.append({
                "method": endpoint["method"],
                "url": endpoint["url"],
                "payload": {field: "wrong"},
                "tags": ["invalid", "type"]
            })
    
    return cases