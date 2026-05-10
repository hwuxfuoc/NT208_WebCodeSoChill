import time
import requests
import json
import csv
import sys
import os
import ast
import re
import glob

# ── Config ───────────────────────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
CSV_PATH     = os.path.join(SCRIPT_DIR, "problem_data", "problem_data.csv")
JSON_DIR     = os.path.join(SCRIPT_DIR, "..", "problems")
DATA_DIR     = os.path.join(SCRIPT_DIR, "data")
PY_DIR       = os.path.join(DATA_DIR, "python")
JSON_OUT_DIR = os.path.join(DATA_DIR, "json")
os.makedirs(PY_DIR, exist_ok=True)
os.makedirs(JSON_OUT_DIR, exist_ok=True)

# ── Load CSV ─────────────────────────────────────────────────────────────────

def load_problems(csv_path):
    problems = {}
    with open(csv_path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            num   = int(row["Number"])
            title = row["Title"].strip()
            link  = row["Link"].strip().rstrip("/")
            slug  = link.split("/")[-1]
            problems[num] = {"title": title, "slug": slug}
    return problems

# ── Load problem JSON (for expected outputs) ──────────────────────────────────

def find_problem_json(number, json_dir):
    pattern = os.path.join(json_dir, f"{number:04d}-*.json")
    matches = glob.glob(pattern)
    return matches[0] if matches else None


def parse_output(example_text):
    m = re.search(r'Output:\s*(.+)', example_text)
    if not m:
        return None
    raw = m.group(1).strip()
    try:
        return ast.literal_eval(raw)
    except Exception:
        return raw


def load_expected_outputs(json_path):
    with open(json_path, encoding="utf-8") as f:
        data = json.load(f)
    outputs = []
    for ex in sorted(data.get("examples", []), key=lambda e: e["example_num"]):
        outputs.append(parse_output(ex["example_text"]))
    return outputs

# ── LeetCode API ──────────────────────────────────────────────────────────────

def fetch_leetcode(slug):
    url   = "https://leetcode.com/graphql"
    query = """
    query getQuestion($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            title
            exampleTestcases
            metaData
        }
    }
    """
    resp = requests.post(
        url,
        json={"query": query, "variables": {"titleSlug": slug}},
        headers={"Content-Type": "application/json"},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json()["data"]["question"]

# ── Parse testcases ───────────────────────────────────────────────────────────

def parse_testcases(example_testcases_str, metadata_str):
    meta       = json.loads(metadata_str)
    params     = meta["params"]
    num_params = len(params)
    raw_lines  = [l for l in example_testcases_str.strip().splitlines() if l.strip()]

    cases = []
    for i in range(0, len(raw_lines), num_params):
        group = raw_lines[i : i + num_params]
        if len(group) != num_params:
            break
        case = {}
        for p, line in zip(params, group):
            try:
                case[p["name"]] = ast.literal_eval(line.strip())
            except Exception:
                case[p["name"]] = line.strip()
        cases.append(case)
    return cases, meta

# ── Build output files ────────────────────────────────────────────────────────

TYPE_MAP = {
    "integer": "int", "int": "int",
    "long": "int", "double": "float", "float": "float",
    "boolean": "bool", "bool": "bool",
    "string": "str", "str": "str",
    "ListNode": "ListNode", "TreeNode": "TreeNode",
    "List[integer]": "List[int]", "List[int]": "List[int]",
    "List[string]": "List[str]",
    "List[List[integer]]": "List[List[int]]",
    "List[List[int]]": "List[List[int]]",
}

def hint(t):
    return TYPE_MAP.get(t, t)


def build_py_file(number, title, cases, meta, expected_outputs):
    func_name   = meta["name"]
    params      = meta["params"]
    param_names = [p["name"] for p in params]

    sig_params = ", ".join(f"{p['name']}: {hint(p['type'])}" for p in params)
    ret_hint   = hint((meta.get("return") or {}).get("type", "None"))
    signature  = f"    def {func_name}(self, {sig_params}) -> {ret_hint}:"

    if_lines = []
    for i, case in enumerate(cases):
        conditions = " and ".join(
            f"{name} == {repr(case[name])}" for name in param_names
        )
        if i < len(expected_outputs) and expected_outputs[i] is not None:
            ret_val = repr(expected_outputs[i])
            if_lines.append(f"        if {conditions}: return {ret_val}")
        else:
            if_lines.append(f"        if {conditions}: return ...  # TODO: fill output")

    body = "\n".join(if_lines) if if_lines else "        pass"

    return "\n".join([
        "class Solution:",
        signature,
        body,
    ]) + "\n"


def build_json_file(number, title, cases, meta, expected_outputs):
    testcases_with_output = []
    for i, case in enumerate(cases):
        entry = dict(case)
        entry["expected"] = expected_outputs[i] if i < len(expected_outputs) else None
        testcases_with_output.append(entry)

    payload = {
        "problem_number": number,
        "title": title,
        "function": meta["name"],
        "params": meta["params"],
        "return": meta.get("return", {}),
        "testcases": testcases_with_output,
    }
    return json.dumps(payload, indent=2, ensure_ascii=False)


def sanitize(name):
    """Bỏ ký tự không hợp lệ trên Windows: \\ / : * ? \" < > |"""
    return re.sub(r'[\\/:*?"<>|]', '', name)

def save(number, title, py_content, json_content):
    base      = sanitize(f"{number}. {title}")
    py_path   = os.path.join(PY_DIR,       base + ".py")
    json_path = os.path.join(JSON_OUT_DIR, base + ".json")

    with open(py_path,   "w", encoding="utf-8") as f:
        f.write(py_content)
    with open(json_path, "w", encoding="utf-8") as f:
        f.write(json_content)

    print(f"  ✔ data/python/{base}.py")
    print(f"  ✔ data/json/{base}.json")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python get_testcases.py <number> [number2 ...]")
        print("  e.g. python get_testcases.py 1")
        print("       python get_testcases.py 1 2 3")
        sys.exit(1)

    problems = load_problems(CSV_PATH)

    numbers = []
    for arg in sys.argv[1:]:
        if '-' in arg:
            # Range kiểu "21-100"
            parts = arg.split('-')
            if len(parts) == 2:
                try:
                    start, end = int(parts[0]), int(parts[1])
                    numbers.extend(range(start, end + 1))
                except ValueError:
                    print(f"  ⚠  '{arg}' không phải range hợp lệ, bỏ qua.")
            else:
                print(f"  ⚠  '{arg}' không phải range hợp lệ, bỏ qua.")
        else:
            try:
                numbers.append(int(arg))
            except ValueError:
                print(f"  ⚠  '{arg}' không phải số hợp lệ, bỏ qua.")

    for num in numbers:
        print(f"\n{'='*55}")
        if num not in problems:
            print(f"  ✘  Problem #{num} không có trong CSV.")
            continue

        info  = problems[num]
        title = info["title"]
        slug  = info["slug"]
        print(f"  #{num}  {title}  (slug: {slug})")

        # 1. Lấy testcase input từ LeetCode API
        try:
            data = fetch_leetcode(slug)
        except Exception as e:
            print(f"  ✘  LeetCode API lỗi: {e}")
            continue

        if not data or not data.get("exampleTestcases"):
            print("  ✘  Không có dữ liệu testcase.")
            continue

        # Skip design problems (LRU Cache, LFU Cache, v.v.)
        try:
            raw_meta = json.loads(data["metaData"])
        except Exception:
            print(f"  ⚠  Không parse được metaData, bỏ qua.")
            continue
        if raw_meta.get("systemdesign") or "name" not in raw_meta:
            print(f"  ⚠  Design problem (systemdesign), bỏ qua.")
            continue

        cases, meta = parse_testcases(data["exampleTestcases"], data["metaData"])
        print(f"  → {len(cases)} testcase(s) từ LeetCode API")

        # 2. Lấy expected output từ file JSON local
        json_path = find_problem_json(num, JSON_DIR)
        if json_path:
            expected_outputs = load_expected_outputs(json_path)
            print(f"  → {len(expected_outputs)} expected output(s) từ {os.path.basename(json_path)}")
        else:
            expected_outputs = []
            print(f"  ⚠  Không tìm thấy {num:04d}-*.json, output để trống.")

        # 3. Sinh file
        py_content   = build_py_file(num, title, cases, meta, expected_outputs)
        json_content = build_json_file(num, title, cases, meta, expected_outputs)
        save(num, title, py_content, json_content)
        time.sleep(0.5)  # tránh rate limit

    print(f"\n{'='*55}")
    print(f"Done! Files saved to: {DATA_DIR}")


if __name__ == "__main__":
    main()