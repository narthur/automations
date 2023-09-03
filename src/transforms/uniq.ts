export default <T>(arr: T[]): T[] => [...new Set<T>(arr)];
