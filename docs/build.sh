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
# QUICK INSTALL (run these commands if tools are not installed):
#   gem install --user-install asciidoctor asciidoctor-diagram
#   npm install -g @mermaid-js/mermaid-cli
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

# Check if asciidoctor-diagram is available
if ! gem list -i asciidoctor-diagram &> /dev/null; then
    echo "WARNING: asciidoctor-diagram gem not found in default location"
    echo "Attempting to build anyway (may be installed in user directory)..."
    echo
fi

# Build the document
echo "Converting README.adocs to HTML with Mermaid diagrams..."
asciidoctor -r asciidoctor-diagram -a imagesoutdir=images README.adocs

# Check if build was successful
if [ -f "README.html" ]; then
    echo
    echo "✓ Build successful!"
    echo "  Output: README.html"
    echo "  Diagrams: images/diag-mermaid-*.svg"
    echo
    echo "Open README.html in your browser to view the document."
else
    echo
    echo "✗ Build failed - README.html was not generated"
    exit 1
fi

