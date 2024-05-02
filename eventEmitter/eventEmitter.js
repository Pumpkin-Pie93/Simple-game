export class EventEmitter {
 #subscribers = {
  // eventName: [callback, callback...]
 }
 addEventListener(eventName, callback) {
  this.subscribe(eventName, callback)
 }
 on(eventName, callback) {
  this.subscribe(eventName, callback)
 }
 subscribe(eventName, callback) {
  if (!this.#subscribers[eventName]) {
   this.#subscribers[eventName] = []
  }
  this.#subscribers[eventName].push(callback)
  return () => (this.#subscribers[eventName] = this.#subscribers[eventName].filter((cb) => callback !== cb))
 }
 emit(eventName) {
  this.#subscribers[eventName].forEach((cb) => cb())
 }
 off(eventName, callback) {
  this.#subscribers[eventName] = this.#subscribers[eventName].filter((cb) => callback !== cb)
 }
}
