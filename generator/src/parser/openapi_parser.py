import json

def load_schema(path):
    with open(path, "r") as f:
        return json.load(f)
    
def extract_endpoints(schema):
    endpoints = []

    for path, methods in schema.get("paths", {}).items():
        for method, details in methods.items():
            request_body = details.get("requestBody", {})
            content = request_body.get("content", {})
            schema_def = content.get("application/json", {}).get("schema", {})

            endpoints.append({
                "url": path,
                "method": method.upper(),
                "schema": schema_def
            })
    return endpoints