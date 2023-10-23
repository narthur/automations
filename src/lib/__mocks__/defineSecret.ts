export default function defineSecret(name: string) {
  return {
    name,
    value: () => `__SECRET_${name}__`,
  };
}
