import * as tsyringe from 'tsyringe'
import * as UIConfig from '../repositories/UIConfig'

@tsyringe.injectable()
export class UIConfigStore {
  constructor(@tsyringe.inject(UIConfig.Registry.token) private readonly UIConfigRepository: UIConfig.Repository) {}

  get fullScreenOnStartup(): boolean {
    return this.UIConfigRepository.get<boolean>('fullScreenOnStartup') ?? true
  }

  set fullScreenOnStartup(value: boolean) {
    this.UIConfigRepository.set('fullScreenOnStartup', value)
  }
}
