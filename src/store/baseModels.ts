import { types } from 'mobx-state-tree';
// import { ISODate } from './customTypes';

export const Pagination = types.model('Pagination', {
  pageSize: types.number,
  pageNumber: types.number,
  total: types.number,
});

export const Sorting = types.model('Sorting', {
  type: types.enumeration('SortingType', ['ASC', 'DESC']),
  field: types.enumeration('SortingField', ['id', 'createdAt', 'updatedAt', 'name']),
});

// const DateRange = types.model('DateRange', {
//   gte: types.maybeNull(ISODate),
//   lte: types.maybeNull(ISODate),
// });
//
// const Filters = types.model('Filters', {
//   name: types.maybeNull(types.string),
//   ids: types.maybeNull(types.array(types.string)),
//   categoryIds: types.maybeNull(types.array(types.string)),
//   createdAt: types.maybeNull(DateRange),
//   updatedAt: types.maybeNull(DateRange),
//   pagination: types.maybeNull(Pagination),
//   sorting: types.maybeNull(Sorting),
// });
