/* eslint-disable @typescript-eslint/no-explicit-any */
import ClusterRegisterStore from '../../../store/clusterRegisterStore'

type GeneratorReturnType<T extends Iterator<any>> = T extends Iterator<infer V> ? V : never
// export type ItemData = GeneratorReturnType<ClusterRegisterStore['items']>
export type ItemData = ClusterRegisterStore['items'][number]
