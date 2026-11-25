export function runTests(code, functionName, testCases) {
  let fn;
  try {
    fn = new Function(`${code}\nreturn ${functionName};`)();
  } catch (err) {
    return { error: err.message, results: [] };
  }

  if (typeof fn !== "function") {
    return { error: `Define a function named ${functionName}.`, results: [] };
  }

  const results = testCases.map(({ args, expected }) => {
    try {
      const actual = fn(...structuredClone(args));
      const passed = JSON.stringify(actual) === JSON.stringify(expected);
      return { args, expected, actual, passed };
    } catch (err) {
      return { args, expected, error: err.message, passed: false };
    }
  });

  return { error: null, results };
}