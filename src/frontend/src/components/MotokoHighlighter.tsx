const KEYWORDS = new Set([
  "actor",
  "public",
  "func",
  "return",
  "var",
  "let",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "type",
  "class",
  "module",
  "import",
  "stable",
  "shared",
  "async",
  "await",
  "ignore",
  "true",
  "false",
  "null",
  "and",
  "or",
  "not",
  "object",
  "query",
  "system",
  "do",
  "label",
  "break",
  "continue",
  "throw",
  "try",
  "catch",
  "finally",
  "debug",
  "assert",
]);

const TYPES = new Set([
  "Nat",
  "Int",
  "Text",
  "Bool",
  "Principal",
  "Float",
  "Blob",
  "Char",
  "Nat8",
  "Nat16",
  "Nat32",
  "Nat64",
  "Int8",
  "Int16",
  "Int32",
  "Int64",
  "Array",
  "List",
  "Option",
  "Result",
  "HashMap",
  "Buffer",
  "Error",
  "Iter",
]);

type TokenType =
  | "keyword"
  | "type"
  | "string"
  | "comment"
  | "number"
  | "default";
type Token = { type: TokenType; value: string };

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === "/" && code[i + 1] === "/") {
      const end = code.indexOf("\n", i);
      const val = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: "comment", value: val });
      i += val.length;
      continue;
    }
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length && code[j] !== '"') {
        if (code[j] === "\\") j++;
        j++;
      }
      tokens.push({ type: "string", value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/[0-9]/.test(code[i] ?? "")) {
      let j = i;
      while (j < code.length && /[0-9._xXa-fA-F]/.test(code[j] ?? "")) j++;
      tokens.push({ type: "number", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_]/.test(code[i] ?? "")) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j] ?? "")) j++;
      const word = code.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", value: word });
      } else if (TYPES.has(word)) {
        tokens.push({ type: "type", value: word });
      } else {
        tokens.push({ type: "default", value: word });
      }
      i = j;
      continue;
    }
    const last = tokens[tokens.length - 1];
    if (last && last.type === "default") {
      last.value += code[i];
    } else {
      tokens.push({ type: "default", value: code[i] ?? "" });
    }
    i++;
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "#F59E0B",
  type: "#2EC4C8",
  string: "#36D38A",
  comment: "#6B7280",
  number: "#A78BFA",
  default: "#E5E7EB",
};

interface MotokoHighlighterProps {
  code: string;
  className?: string;
}

export function MotokoHighlighter({ code, className }: MotokoHighlighterProps) {
  const tokens = tokenize(code);
  return (
    <pre
      className={`font-mono text-sm leading-relaxed overflow-auto ${className ?? ""}`}
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      <code>
        {tokens.map((token, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: token order is stable for static code
          <span key={i} style={{ color: TOKEN_COLORS[token.type] }}>
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
}
