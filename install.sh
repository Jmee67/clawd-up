#!/usr/bin/env bash
set -euo pipefail

# Clawd Up Installer
# Handles: OpenClaw check, Node check, setup wizard, cron registration

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

info()  { echo -e "${GREEN}✓${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }

echo ""
echo -e "${BOLD}  🦞 Clawd Up Installer${NC}"
echo "  ─────────────────────"
echo ""

# ── Check Node.js ────────────────────────────────────────

if ! command -v node &>/dev/null; then
  error "Node.js not found. Install Node 18+ first:"
  echo "  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -"
  echo "  sudo apt-get install -y nodejs"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  error "Node.js $NODE_VERSION found, but 18+ is required."
  exit 1
fi
info "Node.js $(node -v)"

# ── Check / Install OpenClaw ─────────────────────────────

if command -v openclaw &>/dev/null; then
  info "OpenClaw found: $(openclaw --version 2>/dev/null || echo 'installed')"
else
  echo ""
  echo "  OpenClaw is not installed. It's the runtime that powers Clawd Up."
  echo ""
  read -p "  Install OpenClaw now? [Y/n] " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    error "OpenClaw is required. Install it manually: curl -fsSL https://get.openclaw.ai | bash"
    exit 1
  fi
  echo ""
  info "Installing OpenClaw..."
  curl -fsSL https://get.openclaw.ai | bash
  
  # Source PATH updates
  export PATH="$HOME/.openclaw/bin:$PATH"
  
  if ! command -v openclaw &>/dev/null; then
    warn "OpenClaw installed but not in PATH. Run: source ~/.bashrc"
    warn "Then re-run this installer."
    exit 1
  fi
  info "OpenClaw installed"
fi

# ── Check if gateway is running ──────────────────────────

GATEWAY_STATUS=$(openclaw gateway status 2>&1 || true)
if echo "$GATEWAY_STATUS" | grep -qi "running"; then
  info "Gateway is running"
else
  warn "Gateway is not running. Starting it after setup."
  START_GATEWAY=true
fi

# ── Parse arguments ──────────────────────────────────────

CONFIG_B64=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --config) CONFIG_B64="$2"; shift 2 ;;
    *) shift ;;
  esac
done

# ── Clone Clawd Up if not already present ────────────────

CLAWDUP_DIR="${HOME}/.openclaw/clawdup"
if [ ! -d "$CLAWDUP_DIR" ]; then
  info "Downloading Clawd Up..."
  git clone --depth 1 https://github.com/Jmee67/clawd-up.git "$CLAWDUP_DIR" 2>/dev/null || {
    error "Failed to clone Clawd Up repo"
    exit 1
  }
  info "Clawd Up downloaded"
else
  info "Clawd Up already installed at $CLAWDUP_DIR"
fi

SCRIPT_DIR="$CLAWDUP_DIR"

# ── Run setup wizard ─────────────────────────────────────

echo ""
echo -e "${BOLD}  Starting setup wizard...${NC}"
echo ""

# Set workspace to OpenClaw's workspace directory
export OPENCLAW_WORKSPACE="${HOME}/.openclaw/workspace"

if [ -n "$CONFIG_B64" ]; then
  # Pre-filled config from web onboarding — skip interactive wizard
  CONFIG_JSON=$(echo "$CONFIG_B64" | base64 -d)
  export CLAWD_CONFIG="$CONFIG_JSON"
  node "${SCRIPT_DIR}/setup.js" --from-config
else
  node "${SCRIPT_DIR}/setup.js"
fi

SETUP_EXIT=$?
if [ $SETUP_EXIT -ne 0 ]; then
  error "Setup failed (exit code $SETUP_EXIT)"
  exit 1
fi

# ── Register cron jobs ───────────────────────────────────

CRON_DIR="${OPENCLAW_WORKSPACE}/crons"
if [ -d "$CRON_DIR" ] && ls "$CRON_DIR"/*.json &>/dev/null 2>&1; then
  echo ""
  info "Registering cron jobs..."
  REGISTERED=0
  FAILED=0
  for cron_file in "$CRON_DIR"/*.json; do
    CRON_NAME=$(basename "$cron_file" .json)
    if openclaw cron create --file "$cron_file" 2>/dev/null; then
      REGISTERED=$((REGISTERED + 1))
    else
      # Try update if create fails (already exists)
      if openclaw cron update --file "$cron_file" 2>/dev/null; then
        REGISTERED=$((REGISTERED + 1))
      else
        warn "Could not register cron: $CRON_NAME"
        FAILED=$((FAILED + 1))
      fi
    fi
  done
  info "Registered $REGISTERED cron job(s)"
  [ $FAILED -gt 0 ] && warn "$FAILED cron(s) failed — register manually with: openclaw cron create --file <path>"
fi

# ── Start gateway if needed ──────────────────────────────

if [ "${START_GATEWAY:-false}" = "true" ]; then
  echo ""
  info "Starting gateway..."
  openclaw gateway start 2>/dev/null || warn "Could not start gateway. Run: openclaw gateway start"
fi

# ── Send test notification ───────────────────────────────

echo ""
echo -e "${BOLD}  Testing notification delivery...${NC}"

# Check if we can send a test message via openclaw
if openclaw notify --message "🦞 Clawd Up installed! Your AI ops team is online." 2>/dev/null; then
  info "Test notification sent"
else
  warn "Could not send test notification. Check your channel config in OpenClaw settings."
fi

# ── Done ─────────────────────────────────────────────────

echo ""
echo -e "${BOLD}  ────────────────────────────────────────${NC}"
echo -e "${BOLD}  Installation complete! 🎉${NC}"
echo ""
echo "  Quick commands:"
echo "    openclaw gateway status    — Check if everything's running"
echo "    openclaw cron list         — See scheduled jobs"
echo "    cat ~/.openclaw/workspace/PIPELINE.md — View your pipeline"
echo ""
echo "  Your first daily brief arrives at 8am your timezone."
echo "  Questions? https://github.com/Jmee67/clawd-up/issues"
echo ""
