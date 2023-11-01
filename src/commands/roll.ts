import cmd from "./cmd.js";

export default cmd("roll", (message) => {
  const [, sides] = message.match(/^\/roll (\d+)$/) || [];
  const roll = Math.floor(Math.random() * Number(sides)) + 1;
  return `You rolled a ${roll}`;
});
