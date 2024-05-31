import { types } from 'mobx-state-tree';

export const ISODate = types.custom({
  name: 'ISODate',
  fromSnapshot: (value) => new Date(value),
  toSnapshot: (date: Date) => date.toISOString(),
  isTargetType: (value) => value instanceof Date,
  getValidationMessage: (value: any) => {
    if (isNaN(new Date(value) as any)) {
      return `${value} is not in a valid date format`;
    }
    return '';
  },
});
