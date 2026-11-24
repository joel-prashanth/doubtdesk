const LEVELS = {
  1: "Ask exactly ONE short guiding question. Maximum 20 words. No steps, no methods, no code.",
  2: "Give one clue about the technique or concept to use. Maximum 40 words. No code.",
  3: "Describe the approach as 3 to 4 numbered steps in plain words. Maximum 80 words. Never write the complete solution.",
};

function buildHintMessages({ problem, code, level }) {
  const system =
    "You are a patient coding tutor for beginners learning JavaScript. " +
    "You help students figure things out themselves. " +
    "NEVER give the complete working solution or a full function body. " +
    "Do not tell the student which line or operator to change, and do not say what the fix is. " +
    "Describe what to think about or check instead. " +
    LEVELS[level];

  const user =
    `Problem: ${problem.title}\n${problem.description}\n\n` +
    `Student's current code:\n${code}\n\n` +
    `Give hint level ${level} of 3.`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

module.exports = { buildHintMessages };