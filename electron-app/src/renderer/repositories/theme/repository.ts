import { ThemePreferredType, ThemeType } from '../../types/theme/type'

export interface Repository {
  setPreferredTheme(theme: ThemePreferredType): void
  getPreferredTheme(): ThemePreferredType
  getTheme(): ThemeType
}
