def generate_missing_field_cases(endpoint):
    schema = endpoint["schema"]
    required = schema.get("required", [])

    cases = []

    for field in required:
        payload = {}

        for prop in schema.get("properties", {}):
            if prop != field:
                payload[prop] = "test"
        cases.append({
            "method": endpoint["method"],
            "url": endpoint["url"],
            "payload": {},  
            "tags": ["invalid", "missing_field"]
        })
    
    return cases



def generate_boundary_cases(endpoint):
    schema = endpoint["schema"]
    properties = schema.get("properties", {})

    cases = []

    for field, meta in properties.items():
        if meta.get("type") == "integer":
            for val in [-1, 0, 999999999]:
                cases.append({
                    "method": endpoint["method"],
                    "url": endpoint["url"],
                    "payload": {field: val},
                    "tags": ["boundary", field]
                })

        if meta.get("type") == "string":
            for val in ["", None]:
                cases.append({
                    "method": endpoint["method"],
                    "url": endpoint["url"],
                    "payload": {field: val},
                    "tags": ["boundary", field]
                })

    return cases