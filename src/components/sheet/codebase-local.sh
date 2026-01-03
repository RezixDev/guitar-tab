#!/bin/bash

# Configuration
OUTPUT_FILE="codebase_for_claude.txt"
EXTENSIONS=("*.m" "*.mm" "*.metal" "*.hpp" "*.cpp" "*.h" "*.js" "*.ts" "*.jsx" "*.tsx" "*.py" "*.java" "*.css" "*.html" "*.md" "*.json" "*.yml" "*.yaml")
EXCLUDE_DIRS=("pnpm-lock.yaml" "node_modules" ".git" "dist" "build" "__pycache__" ".next" "coverage")

# Function to check if directory should be excluded
should_exclude_dir() {
    local dir="$1"
    for exclude in "${EXCLUDE_DIRS[@]}"; do
        if [[ "$dir" == *"$exclude"* ]]; then
            return 0
        fi
    done
    return 1
}

# Clear the output file
> "$OUTPUT_FILE"

echo "Collecting codebase files..."
echo "# Codebase Export for Claude" >> "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Generate tree structure starting from one directory above
echo "## Project Structure" >> "$OUTPUT_FILE"

# Function to generate tree structure
generate_tree() {
    local dir="$1"
    local prefix="$2"
    local show_files="$3"  # whether to show files or just directories
    
    # Get all items in directory, sorted (directories first, then files)
    local dirs=()
    local files=()
    
    while IFS= read -r -d '' item; do
        if [ -d "$item" ]; then
            dirs+=("$item")
        else
            files+=("$item")
        fi
    done < <(find "$dir" -maxdepth 1 -mindepth 1 -print0 | sort -z)
    
    local all_items=("${dirs[@]}" "${files[@]}")
    local count=${#all_items[@]}
    local i=0
    
    for item in "${all_items[@]}"; do
        local basename=$(basename "$item")
        local is_last=$((i == count - 1))
        
        # Skip if item should be excluded
        if should_exclude_dir "$item"; then
            ((i++))
            continue
        fi
        
        # For parent directory, show files but don't recurse into them
        if [ "$show_files" = "parent" ] && [ -f "$item" ]; then
            # Show file if it matches our extensions
            local show_file=false
            for ext in "${EXTENSIONS[@]}"; do
                if [[ "$basename" == ${ext} ]]; then
                    show_file=true
                    break
                fi
            done
            
            if [ "$show_file" = true ]; then
                if [ $is_last -eq 1 ]; then
                    echo "${prefix}└── $basename" >> "$OUTPUT_FILE"
                else
                    echo "${prefix}├── $basename" >> "$OUTPUT_FILE"
                fi
            fi
            ((i++))
            continue
        fi
        
        # Choose the appropriate tree characters
        if [ $is_last -eq 1 ]; then
            echo "${prefix}└── $basename" >> "$OUTPUT_FILE"
            local new_prefix="${prefix}    "
        else
            echo "${prefix}├── $basename" >> "$OUTPUT_FILE"
            local new_prefix="${prefix}│   "
        fi
        
        # Recurse into directories (but limit depth to avoid huge trees)
        if [ -d "$item" ] && [ ${#prefix} -lt 20 ]; then
            generate_tree "$item" "$new_prefix" "$show_files"
        fi
        
        ((i++))
    done
}

# Start tree generation from parent directory
PARENT_DIR="../"
if [ -d "$PARENT_DIR" ]; then
    CURRENT_FOLDER=$(basename "$PWD")
    PARENT_FOLDER=$(basename "$(dirname "$PWD")")
    
    echo "$PARENT_FOLDER/" >> "$OUTPUT_FILE"
    
    # Show files directly in parent directory
    generate_tree "$PARENT_DIR" "" "parent"
    

else
    # Fallback: just show current directory tree
    CURRENT_FOLDER=$(basename "$PWD")
    echo "$CURRENT_FOLDER/" >> "$OUTPUT_FILE"
    generate_tree "." "" "detailed"
fi

echo "" >> "$OUTPUT_FILE"


# Process files from current directory only
echo "## Project Files" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Find and process files from current directory only
for ext in "${EXTENSIONS[@]}"; do
    while IFS= read -r -d '' file; do
        # Skip if file is in excluded directory
        if should_exclude_dir "$file"; then
            continue
        fi
        
        echo "Processing: $file"
        echo "" >> "$OUTPUT_FILE"
        echo "## File: $file" >> "$OUTPUT_FILE"
        cat "$file" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    done < <(find . -name "$ext" -type f -print0)
done

echo "Codebase exported to $OUTPUT_FILE"
echo "File size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo "You can now copy the contents of $OUTPUT_FILE and paste it to Claude!"
