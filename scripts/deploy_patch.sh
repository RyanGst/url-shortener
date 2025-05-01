#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# Check if jq is installed
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to use this script."
    exit 1
fi

# Read current version from deno.json in the script's directory parent
script_dir=$(dirname "$0")
project_root=$(cd "$script_dir/.." && pwd)
deno_json_path="$project_root/deno.json"

if [ ! -f "$deno_json_path" ]; then
    echo "deno.json not found at $deno_json_path"
    exit 1
fi

current_version=$(jq -r .version "$deno_json_path")

# Calculate new version (patch increment)
major=$(echo $current_version | cut -d. -f1)
minor=$(echo $current_version | cut -d. -f2)
patch=$(echo $current_version | cut -d. -f3)
new_patch=$((patch + 1))
new_version="${major}.${minor}.${new_patch}"

echo "Current version: $current_version"
echo "New version: $new_version"

# Update deno.json
cd "$project_root" # Ensure git commands run from the project root
tmp_file=$(mktemp)
jq ".version = \"$new_version\"" "$deno_json_path" > "$tmp_file" && mv "$tmp_file" "$deno_json_path"

# Git commands
git add deno.json
git commit -m "New version: $new_version [skip ci]"
git tag -a "v$new_version" -m "Version $new_version" 
git push --follow-tags

echo "Version bumped to $new_version and pushed." 