/* eslint-disable import/prefer-default-export */

import { autorun, IAutorunOptions, IReactionPublic } from 'mobx'
import { useEffect } from 'react'

/**
 * react hook version of mobx autorun. disposes callback when component is disposed.
 * read mobx autorun for more details
 */
export function useAutorun(view: (r: IReactionPublic) => unknown, opts?: IAutorunOptions): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => autorun(view, opts), [])
}
