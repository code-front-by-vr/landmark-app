export function getRequiredEnvs(names: string[]): Record<string, string> {
  const values: Record<string, string> = {};
  const missing = [];

  for (const name of names) {
    const value = import.meta.env[name];
    if (!value) {
      missing.push(name);
    } else {
      values[name] = value;
    }
  }

  if (missing.length > 0) {
    const missingList = missing.map(v => `- ${v}`).join('\n');
    const message = `❌ Missing environment variables:\n${missingList}`;
    alert(message);
    throw new Error(message);
  }

  return values;
}
