export function defineSecret(name: string) {
  return {
    value: () => `__SECRET_${name}__`,
  };
}
