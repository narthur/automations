import cmd from "src/lib/cmd";

export default cmd("alarm", async (message) => {
  const [, seconds = 0] = message.match(/^\/alarm (\d+)$/) || [];

  await new Promise((resolve) => setTimeout(resolve, Number(seconds) * 1000));

  return "🚨 Here is your test alarm!";
});
