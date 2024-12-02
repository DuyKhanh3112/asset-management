export type ActionType<T extends string> = {
  SUCCESS: `${T}_SUCCESS`;
  FAILURE: `${T}_FAILURE`;
  REQUEST: `${T}_REQUEST`;
};

export type ActionHandler<T extends string> = {
  [K in keyof ActionType<T>]: K;
};