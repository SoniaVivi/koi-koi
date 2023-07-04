const toCamelCase = (str: string) =>
  str
    .split(" ")
    .map((word, i) => {
      return (
        (i == 0
          ? word.slice(0, 1).toLowerCase()
          : word.slice(0, 1).toUpperCase()) + word.slice(1).toLowerCase()
      );
    })
    .join("");

export default toCamelCase;
