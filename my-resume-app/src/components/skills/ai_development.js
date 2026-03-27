import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '../../css/SkillPage.module.css';

const claudeApiExample = `# Claude API — Streaming a response with the Anthropic SDK
import anthropic

client = anthropic.Anthropic()

with client.messages.stream(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Summarize the top 5 Linux troubleshooting commands."}
    ],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)`;

const ollamaExample = `# Self-hosting models with Ollama — local inference, no API keys
import requests

def query_local_model(prompt, model="llama3"):
    """Send a prompt to a locally hosted Ollama model."""
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": model,
            "prompt": prompt,
            "stream": False,
        },
    )
    return response.json()["response"]

# Example: generate a bash one-liner from natural language
result = query_local_model(
    "Write a bash one-liner that finds all log files modified in the last 24 hours"
)
print(result)`;

const mcpToolExample = `// MCP Tool Server — exposing a custom tool to AI agents
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({
  name: "server-health",
  version: "1.0.0",
});

// Register a tool that checks server uptime
server.tool(
  "check_uptime",
  { hostname: z.string().describe("Server hostname or IP") },
  async ({ hostname }) => {
    const uptime = await getServerUptime(hostname);
    return {
      content: [
        { type: "text", text: \`Server \${hostname} uptime: \${uptime}\` },
      ],
    };
  }
);`;

const AIDevelopment = () => {
  return (
    <div className={styles.skillPage}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>AI Development</h1>
        <p className={styles.heroTagline}>Building with AI APIs, self-hosting models, and developing AI-powered tools</p>
        <div className={styles.heroBadges}>
          {['Claude API', 'Ollama', 'MCP', 'LLM Integration', 'Prompt Engineering', 'Python', 'Node.js'].map(b => (
            <span key={b} className={styles.heroBadge}>{b}</span>
          ))}
        </div>
      </div>

      {/* ── Article 1: AI Development Tools ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Development Tools</h2>
        <p className={styles.sectionText}>
          Working with AI goes beyond just prompting a chatbot. Building real solutions means integrating AI into
          development workflows — from code generation and review to automated documentation and intelligent debugging.
          Tools like Claude Code, GitHub Copilot, and locally hosted models through Ollama have become part of my daily toolkit.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Claude Code</strong> — Using Anthropic's CLI agent for autonomous
          multi-file edits, codebase exploration, test generation, and complex refactors. This resume site itself
          was built and iterated on with Claude Code.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Prompt Engineering</strong> — Crafting structured prompts for consistent,
          reliable outputs. Understanding token limits, system prompts, temperature tuning, and when to use
          few-shot examples vs. zero-shot approaches.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>MCP (Model Context Protocol)</strong> — Building custom tool servers
          that give AI agents access to real-time data, APIs, and system operations — turning LLMs from
          text generators into actionable automation engines.
        </p>
        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>mcp-tool-server.js</div>
          <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ margin: 0, fontSize: '0.82rem' }}>
            {mcpToolExample}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* ── Article 2: AI API Integration ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>AI API Integration</h2>
        <p className={styles.sectionText}>
          Integrating AI APIs into applications and workflows — from simple completions to streaming responses,
          function calling, and multi-turn conversations. Hands-on experience with the Anthropic SDK (Claude),
          OpenAI API, and building middleware that routes requests to different models based on task complexity.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Streaming Responses</strong> — Implementing real-time streaming for
          better UX in chat interfaces and CLI tools, handling partial responses and error recovery gracefully.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Tool Use & Function Calling</strong> — Defining tool schemas that let
          AI models interact with external systems — databases, APIs, file systems — enabling agents that can
          take action, not just generate text.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Cost & Performance</strong> — Understanding model selection trade-offs:
          when to use a fast, lightweight model (Haiku) vs. a more capable one (Opus), managing token budgets,
          and caching strategies to reduce API costs.
        </p>
        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>claude-streaming.py</div>
          <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ margin: 0, fontSize: '0.82rem' }}>
            {claudeApiExample}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* ── Article 3: Self-Hosting AI Models ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Self-Hosting AI Models</h2>
        <p className={styles.sectionText}>
          Running AI models locally for privacy, cost control, and offline access. Using Ollama to host
          open-source models like Llama 3, Mistral, and CodeLlama on personal infrastructure — no API keys,
          no usage fees, full control over the stack.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Ollama</strong> — Setting up and managing locally hosted LLMs with
          a simple pull-and-run workflow. Running multiple models, customizing model parameters, and building
          local API endpoints that mirror cloud provider interfaces.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Hardware Considerations</strong> — Understanding GPU memory requirements,
          quantization trade-offs (Q4 vs Q8), and how to run capable models on consumer hardware. Balancing
          model size against response quality for different use cases.
        </p>
        <p className={styles.sectionText}>
          <strong style={{ color: '#ff9999' }}>Use Cases</strong> — Local code completion, private document analysis,
          internal chatbots for homelab documentation, and automated log summarization — all running without
          sending data to external services.
        </p>
        <div className={styles.codeWrapper}>
          <div className={styles.codeLabel}>ollama-local-inference.py</div>
          <SyntaxHighlighter language="python" style={vscDarkPlus} customStyle={{ margin: 0, fontSize: '0.82rem' }}>
            {ollamaExample}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default AIDevelopment;
