/**
 * A lightweight client-side Python-to-JavaScript transpiler.
 * Converts basic Python algorithm templates (indentation-based blocks,
 * loop formats, boolean types, list append, and length functions)
 * into standard executable JavaScript syntax.
 */
export function transpilePythonToJS(pythonCode: string): string {
  const lines = pythonCode.split("\n");
  const jsLines: string[] = [];
  const indentStack: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Preserve empty lines and comment lines without affecting block stack
    if (!trimmed || trimmed.startsWith("#")) {
      // Convert python comment '#' to JS '//'
      const jsComment = line.replace(/^\s*#/, (match) => match.replace("#", "//"));
      jsLines.push(jsComment);
      continue;
    }

    // Count leading space indentations
    const indentMatch = line.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;

    // Close any open blocks that are at an equal or deeper indentation level
    while (indentStack.length > 0 && indent <= indentStack[indentStack.length - 1]) {
      const closedIndent = indentStack.pop()!;
      const spaces = " ".repeat(closedIndent);
      jsLines.push(`${spaces}}`);
    }

    let jsLine = line;

    // Transpile functions: def name(args): -> function name(args) {
    jsLine = jsLine.replace(/\bdef\s+(\w+)\s*\((.*?)\)\s*:/g, "function $1($2) {");

    // Transpile loops: for i in range(n): -> for (let i = 0; i < n; i++) {
    jsLine = jsLine.replace(/\bfor\s+(\w+)\s+in\s+range\((.*?)\)\s*:/g, "for (let $1 = 0; $1 < $2; $1++) {");

    // Transpile control structures
    jsLine = jsLine.replace(/\bif\s+(.*?)\s*:/g, "if ($1) {");
    jsLine = jsLine.replace(/\belif\s+(.*?)\s*:/g, "else if ($1) {");
    jsLine = jsLine.replace(/\belse\s*:/g, "else {");
    jsLine = jsLine.replace(/\bwhile\s+(.*?)\s*:/g, "while ($1) {");

    // Transpile primitives
    jsLine = jsLine.replace(/\bTrue\b/g, "true");
    jsLine = jsLine.replace(/\bFalse\b/g, "false");
    jsLine = jsLine.replace(/\bNone\b/g, "null");

    // Transpile logical operators
    jsLine = jsLine.replace(/\band\b/g, "&&");
    jsLine = jsLine.replace(/\bor\b/g, "||");
    jsLine = jsLine.replace(/\bnot\b/g, "!");

    // Transpile integer division (a // b -> Math.floor(a / b))
    jsLine = jsLine.replace(/(\S+)\s*\/\/\s*(\S+)/g, "Math.floor($1 / $2)");

    // Transpile arrays / lists methods
    jsLine = jsLine.replace(/\blen\((.*?)\)/g, "$1.length");
    jsLine = jsLine.replace(/\.append\((.*?)\)/g, ".push($1)");

    // Fallback: if line still ends with a colon, convert it to a brace
    const postTrimmed = jsLine.trim();
    if (postTrimmed.endsWith(":") && !jsLine.includes("{")) {
      jsLine = jsLine.replace(/:$/, " {");
    }

    // If a new brace was opened, track this indentation level
    if (jsLine.includes("{")) {
      indentStack.push(indent);
    }

    jsLines.push(jsLine);
  }

  // Close any remaining unclosed blocks at the end of code
  while (indentStack.length > 0) {
    const closedIndent = indentStack.pop()!;
    const spaces = " ".repeat(closedIndent);
    jsLines.push(`${spaces}}`);
  }

  return jsLines.join("\n");
}

export default transpilePythonToJS;
