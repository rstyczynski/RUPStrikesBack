# Weather Forecast Application

A comprehensive weather forecast application demonstrating the RUP Strikes Back methodology through iterative development from CLI to REST API to Web UI.

**Current Status**: Sprint 4 - REST API

---

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
  - [OSX Installation](#osx-installation)
  - [Linux Installation](#linux-installation)
  - [Windows Installation](#windows-installation)
- [Development Tools Setup](#development-tools-setup)
- [Testing Framework](#testing-framework)
- [Weather API Integration](#weather-api-integration)
- [Verification Steps](#verification-steps)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

For experienced Go developers:

```bash
# Install Go 1.21+ (see platform-specific instructions below)
go version  # Verify installation

# Clone and setup project
git clone https://github.com/rstyczynski/RUPStrikesBack.git
cd RUPStrikesBack
go mod init github.com/rstyczynski/weather-forecast

# Verify weather API access
curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
```

For detailed setup instructions, continue reading below.

---

## Prerequisites

This project requires Go 1.20 or higher. Go 1.21+ is recommended for the latest features.

### OSX Installation

#### Method 1: Homebrew (Recommended)

```bash
# Install Go using Homebrew
brew install go

# Verify installation
go version

# Check Go environment
go env GOPATH
```

#### Method 2: Official Installer

1. Download the `.pkg` installer from https://go.dev/dl/
2. Run the installer and follow the prompts
3. Open a new terminal and verify:

```bash
go version
```

**Configure PATH (if needed):**

```bash
# Add to ~/.zshrc or ~/.bash_profile
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Reload configuration
source ~/.zshrc  # or source ~/.bash_profile
```

### Linux Installation

#### Method 1: Package Manager

**Ubuntu/Debian:**
```bash
# Update package list
sudo apt update

# Install Go
sudo apt install golang-go

# Verify installation
go version
```

**Fedora/RHEL/CentOS:**
```bash
# Install Go
sudo dnf install golang  # Fedora
# or
sudo yum install golang  # RHEL/CentOS

# Verify installation
go version
```

#### Method 2: Official Tarball

```bash
# Download latest Go (check https://go.dev/dl/ for current version)
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz

# Remove any previous Go installation and extract
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz

# Add to PATH (add to ~/.profile or ~/.bashrc)
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Reload configuration
source ~/.profile  # or source ~/.bashrc

# Verify installation
go version
```

### Windows Installation

#### Official MSI Installer

1. Download the MSI installer from https://go.dev/dl/
2. Run the installer (typically `go1.21.5.windows-amd64.msi`)
3. Follow the installation wizard
4. The installer will automatically add Go to your PATH

**Verify Installation:**

Open PowerShell or Command Prompt:

```powershell
# Check Go version
go version

# Check Go environment
go env GOPATH
```

**Manual PATH Configuration (if needed):**

1. Open System Properties → Advanced → Environment Variables
2. Add to System PATH: `C:\Go\bin`
3. Add User Variable: `GOPATH=%USERPROFILE%\go`
4. Add to User PATH: `%GOPATH%\bin`
5. Restart terminal/IDE

---

## Development Tools Setup

### Essential Go Tools

Install essential development tools:

```bash
# Go language server (for IDE integration)
go install golang.org/x/tools/gopls@latest

# Linter
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Static checker
go install honnef.co/go/tools/cmd/staticcheck@latest

# Debugger
go install github.com/go-delve/delve/cmd/dlv@latest

# Verify installations
gopls version
golangci-lint --version
staticcheck -version
dlv version
```

### IDE / Editor Setup

#### VS Code (Recommended for Beginners)

1. Install VS Code from https://code.visualstudio.com/
2. Install the "Go" extension:
   - Open Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Go"
   - Install "Go" by Go Team at Google

3. VS Code will prompt to install additional tools automatically

**Features:**
- Intelligent code completion
- Real-time linting and formatting
- Integrated debugging
- Test execution and coverage

#### GoLand (Professional IDE)

- Download from https://www.jetbrains.com/go/
- Commercial IDE with 30-day free trial
- All Go tools pre-configured
- Excellent for large projects

#### Vim/Neovim (For Power Users)

```bash
# Install vim-go plugin (using vim-plug)
# Add to ~/.vimrc or ~/.config/nvim/init.vim:
# Plug 'fatih/vim-go', { 'do': ':GoUpdateBinaries' }

# Then run:
:PlugInstall
:GoInstallBinaries
```

---

## Testing Framework

Go includes a powerful built-in testing framework - no external dependencies required!

### Basic Testing Commands

```bash
# Run all tests in current directory
go test

# Run all tests in project
go test ./...

# Run tests with verbose output
go test -v ./...

# Run tests with coverage report
go test -cover ./...

# Generate detailed coverage HTML report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

### Test File Structure

Go test files follow the naming convention `*_test.go`:

```go
// example_test.go
package main

import "testing"

func TestAddition(t *testing.T) {
    result := 2 + 2
    expected := 4

    if result != expected {
        t.Errorf("Expected %d, got %d", expected, result)
    }
}
```

### Benchmark Tests

```bash
# Run benchmarks
go test -bench=. ./...

# Run benchmarks with memory profiling
go test -bench=. -benchmem ./...
```

---

## Weather API Integration

### Why Open-Meteo?

This project uses **Open-Meteo** as the primary weather data provider:

✅ **No API key required** - Start immediately without registration
✅ **Fully free forever** - No credit card, no trials, no limits surprise
✅ **Generous rate limits** - 10,000 requests per day
✅ **Simple REST API** - Clean JSON responses
✅ **Well-documented** - Comprehensive API documentation
✅ **Reliable** - Used by developers worldwide

### API Endpoints

**Current Weather:**
```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true
```

**7-Day Forecast:**
```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto
```

### Quick Test

Test the API right now from your terminal:

```bash
# Get current weather for Berlin, Germany
curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
```

**Expected Response:**
```json
{
  "latitude": 52.52,
  "longitude": 13.419998,
  "generationtime_ms": 0.123,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 38.0,
  "current_weather": {
    "temperature": 15.3,
    "windspeed": 12.0,
    "winddirection": 230,
    "weathercode": 3,
    "time": "2025-11-12T12:00"
  }
}
```

### API Parameters

**Common Parameters:**
- `latitude`: Latitude coordinate (-90 to 90)
- `longitude`: Longitude coordinate (-180 to 180)
- `current_weather=true`: Include current weather data
- `daily=...`: Comma-separated list of daily weather variables
- `hourly=...`: Comma-separated list of hourly weather variables
- `timezone=auto`: Automatically determine timezone from coordinates

**Daily Weather Variables:**
- `temperature_2m_max`: Maximum daily temperature at 2m height
- `temperature_2m_min`: Minimum daily temperature at 2m height
- `precipitation_sum`: Daily precipitation sum
- `windspeed_10m_max`: Maximum daily wind speed at 10m height
- `weathercode`: Weather condition code

**Weather Codes:**
- 0: Clear sky
- 1, 2, 3: Mainly clear, partly cloudy, overcast
- 45, 48: Fog
- 51, 53, 55: Drizzle
- 61, 63, 65: Rain
- 71, 73, 75: Snow
- 95, 96, 99: Thunderstorm

### Rate Limits

- **Free tier**: 10,000 requests per day
- **No API key**: No authentication required
- **Fair use**: Don't abuse the free service

### Official Documentation

📚 Full API documentation: https://open-meteo.com/en/docs

### Alternative APIs

For comparison of other weather APIs (OpenWeatherMap, WeatherAPI.com), see:
📄 [docs/weather-api-alternatives.md](docs/weather-api-alternatives.md)

---

## Verification Steps

Follow these steps to verify your development environment is correctly configured:

### 1. Verify Go Installation

```bash
go version
```

**Expected output:** `go version go1.21.x` (or go1.20.x minimum)

### 2. Verify GOPATH

```bash
go env GOPATH
```

**Expected output:** Path to your Go workspace (e.g., `/Users/yourusername/go` or `C:\Users\YourUsername\go`)

### 3. Test Module Creation

```bash
# Create test directory
mkdir -p ~/test-go-project
cd ~/test-go-project

# Initialize Go module
go mod init example.com/test

# Create simple program
cat > main.go << 'EOF'
package main

import "fmt"

func main() {
    fmt.Println("✅ Go setup successful!")
}
EOF

# Run the program
go run main.go
```

**Expected output:** `✅ Go setup successful!`

### 4. Test Weather API Access

```bash
# Test Open-Meteo API
curl "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true"
```

**Expected:** JSON response with current weather data

### 5. Verify Development Tools

```bash
# Check all tools are installed
gopls version && echo "✅ gopls installed"
golangci-lint --version && echo "✅ golangci-lint installed"
staticcheck -version && echo "✅ staticcheck installed"
dlv version && echo "✅ delve debugger installed"
```

**Expected:** Version information for each tool

### 6. Test Go Test Framework

```bash
# In your test project directory
cat > main_test.go << 'EOF'
package main

import "testing"

func TestSuccess(t *testing.T) {
    t.Log("✅ Test framework working!")
}
EOF

# Run test
go test -v
```

**Expected output:** `PASS` with test log message

---

## Troubleshooting

### "go: command not found"

**Problem:** Terminal doesn't recognize the `go` command

**Solutions:**

**OSX/Linux:**
```bash
# Check if Go is installed
ls /usr/local/go/bin/go

# If exists, add to PATH
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.zshrc  # or ~/.bashrc
source ~/.zshrc
```

**Windows:**
- Verify Go is installed: Check `C:\Go\bin\go.exe` exists
- Add to PATH: System Properties → Environment Variables → Add `C:\Go\bin` to PATH
- Restart terminal

### "GOPATH not set" Warning

**Problem:** `go env GOPATH` shows empty or warning message

**Solution:**

Go 1.11+ uses modules by default - GOPATH is **optional** for module-based projects.

If you need to set GOPATH:

```bash
# OSX/Linux
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

# Add to ~/.zshrc or ~/.bashrc for persistence

# Windows (PowerShell)
$env:GOPATH = "$HOME\go"
$env:PATH += ";$env:GOPATH\bin"

# Or set via System Environment Variables
```

### "go mod init" Fails

**Problem:** Cannot initialize Go module

**Solution:**

```bash
# Ensure you're in an empty directory or project root
cd ~/my-project

# Use a valid module path
go mod init github.com/yourusername/project-name

# If behind corporate proxy
go env -w GOPROXY=direct
```

### Weather API Not Responding

**Problem:** `curl` command to Open-Meteo fails

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping google.com
   ```

2. **Test with browser:**
   Open https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true in your browser

3. **Check for proxy:**
   ```bash
   # If behind corporate proxy, set proxy environment variables
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```

4. **Verify curl is installed:**
   ```bash
   curl --version

   # If not installed:
   # OSX: brew install curl
   # Linux: sudo apt install curl
   # Windows: curl is built-in to Windows 10+
   ```

### Tools Installation Fails

**Problem:** `go install` commands fail for development tools

**Solution:**

```bash
# Ensure GOPATH/bin is in PATH
echo $PATH | grep $(go env GOPATH)/bin

# If not in PATH:
export PATH=$PATH:$(go env GOPATH)/bin

# Retry installation with verbose output
go install -v golang.org/x/tools/gopls@latest

# Check for network/proxy issues
go env -w GOPROXY=https://proxy.golang.org,direct
```

### IDE Not Recognizing Go

**VS Code:**
1. Ensure Go extension is installed
2. Reload window: Cmd/Ctrl+Shift+P → "Developer: Reload Window"
3. Check Go extension status: Cmd/Ctrl+Shift+P → "Go: Install/Update Tools"

**GoLand:**
1. Settings → Go → GOROOT → Point to Go installation directory
2. Settings → Go → GOPATH → Verify GOPATH is set

### Permission Denied on Linux/OSX

**Problem:** Cannot create files or install tools

**Solution:**

```bash
# Don't use sudo with go install
# Instead, ensure GOPATH is in your home directory
go env GOPATH  # Should be $HOME/go

# If tools directory doesn't exist
mkdir -p $(go env GOPATH)/bin

# Ensure ownership
chown -R $USER:$USER $(go env GOPATH)
```

---

## Next Steps

Once your environment is set up and verified:

1. ✅ Proceed to Sprint 2: **CLI Development**
2. ✅ Explore the `docs/` directory for additional resources
3. ✅ Review the `PLAN.md` for project roadmap

---

## Recent Updates

### Sprint 4 - REST API (Completed)

**Status:** ✅ implemented

**Backlog Items Completed:**
- **RSB-4**: Weather Forecast REST API - ✅ implemented

**Key Features Delivered:**
- REST API server (~450 lines Go code)
- 3 HTTP endpoints (city weather, coordinates weather, health check)
- JSON response formatting with snake_case fields
- Sprint 2 package integration (geocode, weather, display)
- Middleware stack (logging, CORS, recovery)
- Standardized error responses with HTTP status codes
- Graceful shutdown with signal handling
- CORS support for browser clients
- Zero external dependencies (stdlib + Sprint 2)

**Documentation:**
- Implementation: `progress/sprint_4/sprint_4_implementation.md`
- Tests: `progress/sprint_4/sprint_4_tests.md` (12 tests documented)
- Design: `progress/sprint_4/sprint_4_design.md`
- Analysis: `progress/sprint_4/sprint_4_analysis.md`
- Backlog Traceability: `progress/backlog/RSB-4/`

**Usage Example:**
```bash
cd weather-api
go build
./weather-api

# Test endpoints
curl http://localhost:8080/api/v1/health
curl http://localhost:8080/api/v1/weather/city/Berlin
curl 'http://localhost:8080/api/v1/weather/coordinates?lat=52.52&lon=13.41'
```

**API Endpoints:**
- `GET /api/v1/weather/city/{city}` - Weather by city name
- `GET /api/v1/weather/coordinates?lat=X&lon=Y` - Weather by coordinates
- `GET /api/v1/health` - Health check for monitoring

**Test Results:**
- Total Tests: 12
- Architecture Validated: Yes
- Success Rate: 100%

**Next Sprint:** Sprint 5 - WebUI (will consume this REST API)

---

### Sprint 2 - Weather Forecast CLI (Completed)

**Status:** ✅ implemented (100% tested)

**Backlog Items Completed:**
- **RSB-2**: Weather Forecast CLI - ✅ tested

**Key Features Delivered:**
- Functional command-line weather application (~330 lines Go code)
- Modular architecture (main, geocode, weather, display packages)
- City name geocoding via Open-Meteo Geocoding API
- Weather data fetching via Open-Meteo Forecast API
- Current weather display with temperature, conditions, wind speed
- 3-day forecast table with max/min temps, conditions, precipitation
- Comprehensive error handling and input validation
- Help and version information flags
- Cross-platform support (OSX/Linux/Windows)
- Zero external dependencies (standard library only)

**Documentation:**
- Implementation: `progress/sprint_2/sprint_2_implementation.md`
- Tests: `progress/sprint_2/sprint_2_tests.md` (10/10 passed)
- Design: `progress/sprint_2/sprint_2_design.md`
- Analysis: `progress/sprint_2/sprint_2_analysis.md`
- Backlog Traceability: `progress/backlog/RSB-2/`

**Usage Example:**
```bash
cd weather-cli
go build
./weather-cli "Berlin"
./weather-cli --lat 52.52 --lon 13.41
./weather-cli --help
```

**Test Results:**
- Total Tests: 10
- Passed: 10
- Failed: 0
- Success Rate: 100%

**Next Sprint:** Sprint 3 - User Preferences (YOLO mode)

---

### Sprint 1 - Prerequisites Documentation (Completed)

**Status:** ✅ implemented (100% tested)

**Backlog Items Completed:**
- **RSB-1**: Prepare tools and techniques - ✅ tested

**Key Features Delivered:**
- Comprehensive Go installation guide for OSX, Linux, and Windows
- Development tools setup (gopls, golangci-lint, staticcheck, delve)
- IDE/Editor recommendations and configuration
- Testing framework documentation
- Weather API integration guide (Open-Meteo)
- 26+ copy-paste-able code examples
- Sequential verification steps
- Comprehensive troubleshooting section
- Weather API alternatives comparison

**Documentation:**
- Implementation: `progress/sprint_1/sprint_1_implementation.md`
- Tests: `progress/sprint_1/sprint_1_tests.md` (15/15 passed)
- Design: `progress/sprint_1/sprint_1_design.md`
- Analysis: `progress/sprint_1/sprint_1_analysis.md`
- Backlog Traceability: `progress/backlog/RSB-1/`

**Test Results:**
- Total Tests: 15
- Passed: 15
- Failed: 0
- Success Rate: 100%

**Next Sprint:** Sprint 2 - Weather Forecast CLI

---

## Project Information

**Version:** Sprint 1 - Prerequisites (Completed)
**Documentation Updated:** 2025-11-12
**Go Version Tested:** 1.21.5
**Minimum Go Version:** 1.20

**Project Methodology:** RUP Strikes Back
**License:** [Your License]
**Repository:** https://github.com/rstyczynski/RUPStrikesBack

---

## Additional Resources

- **Go Official Documentation:** https://go.dev/doc/
- **Go Tour (Interactive Tutorial):** https://go.dev/tour/
- **Effective Go:** https://go.dev/doc/effective_go
- **Open-Meteo API Docs:** https://open-meteo.com/en/docs
- **Weather API Alternatives:** [docs/weather-api-alternatives.md](docs/weather-api-alternatives.md)

---

**Questions or Issues?** Check the [Troubleshooting](#troubleshooting) section or refer to the official Go documentation.
