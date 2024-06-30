import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createReactiveHandlers(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveHandlers(raw, readonlyHandlers);
}

export function shallowReadonly(raw) {
  return createReactiveHandlers(raw, shallowReadonlyHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createReactiveHandlers(target, baseHandlers) {
  return new Proxy(target, baseHandlers);
}
