// WORKAROUND: https://github.com/vitest-dev/vitest/issues/1575#issuecomment-1439286286
export const setup = () => {
  process.env.TZ = "US/Eastern";
};
