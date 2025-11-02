# mcp-languagetool

MCP server for LanguageTool grammar and spelling checks.

## Requirements

- LanguageTool server running on `http://localhost:8123`

## Installation & Usage

### Install from npm (global)

```bash
pnpm add -g @jigargosar/mcp-languagetool
claude mcp add --scope user --transport stdio languagetool -- mcp-languagetool
```

### Local development

```bash
pnpm install
claude mcp add --transport stdio languagetool -- node /path/to/mcp-languagetool-server.mjs
```

## Tool

- `check_grammar` - Check grammar and spelling of text