export const partial = (fn, ...args) => fn.bind(null, ...args)

// returns a function
const _pipe = (f, g) => (...args) => g(f(...args))

export const pipe = (...fns) => fns.reduce(_pipe)