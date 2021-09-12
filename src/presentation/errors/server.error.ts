export class ServerError extends Error {
  constructor() {
    super('Internal server error! Please contact admin.')
    this.name = 'ServerError'
  }
}
