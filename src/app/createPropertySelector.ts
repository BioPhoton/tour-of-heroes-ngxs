import {createSelector} from '@ngxs/store';

type StateClass<T = any> = new (...args: any[]) => T;

type Selector<TModel extends Record<string, any>> = StateClass<any> | ((...arg: any) => TModel);

export type PropertySelectors<TModel> = {
  [P in keyof TModel]: (model: TModel) => TModel[P];
};

export function createPropertySelector<TModel>(
  state: Selector<TModel>
): PropertySelectors<TModel> {
  const cache: PropertySelectors<TModel> = {} as PropertySelectors<TModel>;
  return new Proxy(
    {} as PropertySelectors<TModel>,
    {
      get(target: any, prop: string) {
        const _prop: keyof TModel = prop as keyof TModel
        const selector = cache[_prop] || createSelector([state], (s: TModel) => s[_prop]);
        cache[_prop] = selector;
        return selector;
      }
    }
  );
}
