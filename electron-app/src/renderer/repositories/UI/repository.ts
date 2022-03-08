/**
 * @classdesc Repository is the backend for storing UI related configurations.
 */
export interface Repository {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T): void
}
