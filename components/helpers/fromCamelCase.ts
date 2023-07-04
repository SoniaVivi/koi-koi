const fromCamelCase = (str: String) =>
  str
    .split(/(?=[A-Z])/)
    .map((s) => s.slice(0, 1).toUpperCase() + s.slice(1))
    .join(" ");

export default fromCamelCase;
