import * as devalue from 'devalue'

class Vector {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

// custom reducers
const reducers = {
  Vector: data => data instanceof Vector && ([data.x, data.y] as const),
} satisfies Record<string, (state: any) => any>

// custom revivers
const revivers = {
  Vector: ([x, y]) => new Vector(x, y),
} satisfies {
  [K in keyof typeof reducers]: (
    /* eslint-disable-next-line no-use-before-define */
    state: Exclude<ReturnType<(typeof reducers)[K]>, false | null | undefined>,
  ) => any
}

export function serializePinia(state: unknown) {
  return devalue.stringify(state, reducers)
}

export function reviveState(state: string) {
  return devalue.parse(state, revivers)
}
