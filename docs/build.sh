#!/bin/bash
#
# Build script for Agentic Programming Cooperation Model documentation
# Converts README.adocs to HTML with rendered Mermaid diagrams
#

set -e  # Exit on error

# ============================================================================
# TOOL INSTALLATION INSTRUCTIONS
# =========================./===================================================
#
# This script requires the following tools to be installed:
#
# 1. ASCIIDOCTOR (Ruby gem)
#    Install using Ruby gems:
#      gem install asciidoctor
#
# 2. ASCIIDOCTOR-DIAGRAM (Ruby gem with diagram rendering support)
#    Install to user directory to avoid permission issues:
#      gem install --user-install asciidoctor-diagram
#
# 3. MERMAID-CLI (Node.js package for rendering Mermaid diagrams)
#    Install globally using npm:
#      npm install -g @mermaid-js/mermaid-cli
#
# 4. PANDOC (Universal document converter for Markdown output)
#    Install using Homebrew:
#      brew install pandoc
#
# QUICK INSTALL (run these commands if tools are not installed):
#   gem install --user-install asciidoctor asciidoctor-diagram
#   npm install -g @mermaid-js/mermaid-cli
#   brew install pandoc
#
# ============================================================================

echo "Building Agentic Programming Cooperation Model documentation..."
echo

# Check if asciidoctor is installed
if ! command -v asciidoctor &> /dev/null; then
    echo "ERROR: asciidoctor is not installed"
    echo "Install with: gem install --user-install asciidoctor"
    exit 1
fi

# Check if mermaid-cli (mmdc) is installed
if ! command -v mmdc &> /dev/null; then
    echo "ERROR: mermaid-cli (mmdc) is not installed"
    echo "Install with: npm install -g @mermaid-js/mermaid-cli"
    exit 1
fi

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "ERROR: pandoc is not installed"
    echo "Install with: brew install pandoc"
    exit 1
fi

# Check if asciidoctor-diagram is available
if ! gem list -i asciidoctor-diagram &> /dev/null; then
    echo "WARNING: asciidoctor-diagram gem not found in default location"
    echo "Attempting to build anyway (may be installed in user directory)..."
    echo
fi

# Build the document
echo "Converting README.adoc to HTML with Mermaid diagrams..."
asciidoctor -r asciidoctor-diagram -a imagesoutdir=images README.adoc

# Check if HTML build was successful
if [ -f "README.html" ]; then
    echo "✓ HTML build successful: README.html"
else
    echo
    echo "✗ Build failed - README.html was not generated"
    exit 1
fi

# Convert to Markdown using pandoc
echo "Converting README.adoc to Markdown..."
pandoc -f asciidoc -t gfm -o README.md README.adoc

# Check if MD build was successful
if [ -f "README.md" ]; then
    echo "✓ Markdown build successful: README.md"
else
    echo
    echo "✗ Build failed - README.md was not generated"
    exit 1
fi

# Fix image paths in Markdown (pandoc doesn't handle asciidoc imagesdir)
echo "Fixing image paths in README.md..."
# Fix HTML img tags: src="image.png" -> src="images/image.png"
sed -i '' 's|src="\([^"/]*\.png\)"|src="images/\1"|g' README.md
sed -i '' 's|src="\([^"/]*\.svg\)"|src="images/\1"|g' README.md
# Fix markdown image syntax: ![alt](image.png) -> ![alt](images/image.png)
sed -i '' 's|](\([^/)]*\.png\))|](images/\1)|g' README.md
sed -i '' 's|](\([^/)]*\.svg\))|](images/\1)|g' README.md
echo "✓ Image paths fixed"

# Fix mermaid code blocks for GitHub rendering
echo "Fixing mermaid diagrams for GitHub..."
# Replace code blocks containing flowchart with mermaid language tag
perl -i -0pe 's/```\nflowchart/```mermaid\nflowchart/g' README.md
perl -i -0pe 's/```text\nflowchart/```mermaid\nflowchart/g' README.md
echo "✓ Mermaid diagrams fixed"

# Fix image widths and centering (pandoc doesn't preserve asciidoc attributes)
# Extract width from asciidoc and apply to markdown
echo "Fixing image widths and centering..."
grep -o 'image::[^[]*\[[^]]*width=[0-9]*' README.adoc | while read line; do
    # Extract filename and width from asciidoc image directive
    filename=$(echo "$line" | sed 's/image::\([^[]*\)\[.*/\1/')
    width=$(echo "$line" | grep -o 'width=[0-9]*' | cut -d= -f2)
    if [ -n "$filename" ] && [ -n "$width" ]; then
        # Apply width to img tag in markdown
        sed -i '' "s|src=\"images/${filename}\"|src=\"images/${filename}\" width=\"${width}\"|g" README.md
    fi
done
# Center images using GitHub-compatible alignment
sed -i '' 's|<div class="text-center"[^>]*>|<div align="center">|g' README.md
echo "✓ Image widths and centering fixed"

echo
echo "✓ Build complete!"
echo "  HTML output: README.html"
echo "  Markdown output: README.md"
echo "  Diagrams: images/diag-mermaid-*.svg"
echo
echo "Open README.html in your browser to view the document."
echo "README.md is used by GitHub for repository display."

