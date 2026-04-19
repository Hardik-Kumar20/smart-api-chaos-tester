import json
import os

from parser.openapi_parser import load_schema, extract_endpoints
from strategies.basic_strategy import generate_valid_case, generate_invalid_cases
from attacks.attack_strategy import generate_attack_cases
from strategies.edge_strategy import (
    generate_missing_field_cases,
    generate_boundary_cases
)


def generate_tests(schema_path):
    schema = load_schema(schema_path)
    endpoints = extract_endpoints(schema)

    all_tests = []

    for endpoint in endpoints:
        all_tests.append(generate_valid_case(endpoint))
        all_tests.extend(generate_invalid_cases(endpoint))
        all_tests.extend(generate_attack_cases(endpoint))
        all_tests.extend(generate_missing_field_cases(endpoint))
        all_tests.extend(generate_boundary_cases(endpoint))

    return all_tests


if __name__ == "__main__":
    # 📁 Base directory (generator/src/)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    # 📥 Input schema path
    schema_path = os.path.join(BASE_DIR, "parser", "sample_api.json")

    # 🧠 Generate test cases
    tests = generate_tests(schema_path)

    # 📁 Ensure output directory exists
    output_dir = os.path.join(BASE_DIR, "output")
    os.makedirs(output_dir, exist_ok=True)

    # 📄 Output file path
    output_file = os.path.join(output_dir, "tests.json")

    # 💾 Save test cases
    with open(output_file, "w") as f:
        json.dump(tests, f, indent=2)

    print(f"Generated {len(tests)} test cases ✅")
    print(f"Saved to: {output_file}")