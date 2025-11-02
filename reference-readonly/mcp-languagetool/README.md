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

## Limitations

- LanguageTool API returns many suggestions per error (hundreds in some cases)
- Cannot be limited via API parameters
- `maxSpellingSuggestions` requires config file with `--config` flag - no CLI parameter available
- MCP server filters to top 3 suggestions before sending to Claude (Claude not bombarded)
- LanguageTool server still generates all suggestions internally (may impact performance)
- Consider alternative spell checkers if problematic