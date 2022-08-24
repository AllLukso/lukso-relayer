export default class NoGasError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NoGasError";
  }
}
