#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));

const LANGUAGETOOL_URL = 'http://localhost:8123/v2/check';

const server = new Server(
  {
    name: 'languagetool',
    version: packageJson.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'check_grammar',
        description: 'Check grammar and spelling of text using LanguageTool. Returns detailed grammar, spelling, and style suggestions.',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'The text to check for grammar and spelling errors',
            },
            language: {
              type: 'string',
              description: 'Language code (e.g., en-US, en-GB, en)',
              default: 'en',
            },
          },
          required: ['text'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'check_grammar') {
    const { text, language = 'en' } = request.params.arguments;

    try {
      const params = new URLSearchParams();
      params.append('text', text);
      params.append('language', language);

      const response = await fetch(LANGUAGETOOL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`LanguageTool API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // Format the response for better readability
      const matches = result.matches || [];

      if (matches.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No grammar or spelling issues found.',
            },
          ],
        };
      }

      let formattedOutput = `Found ${matches.length} issue(s):\n\n`;

      matches.forEach((match, index) => {
        formattedOutput += `${index + 1}. ${match.message}\n`;
        formattedOutput += `   Context: "${match.context.text}"\n`;
        formattedOutput += `   Offset: ${match.offset}-${match.offset + match.length}\n`;

        if (match.replacements && match.replacements.length > 0) {
          const suggestions = match.replacements.slice(0, 3).map(r => r.value).join(', ');
          formattedOutput += `   Suggestions: ${suggestions}\n`;
        }

        if (match.rule && match.rule.category) {
          formattedOutput += `   Category: ${match.rule.category.name}\n`;
        }

        formattedOutput += '\n';
      });

      return {
        content: [
          {
            type: 'text',
            text: formattedOutput,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error checking grammar: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LanguageTool MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});