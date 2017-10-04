declare module 'poisson-process' {
  export interface PoissonInstance {
    start: () => void,
    stop: () => void,
  }

  export function create(meanMS: number, f: () => any): PoissonInstance

  export function sample(mean: number): number
  
  export const version: string
}
