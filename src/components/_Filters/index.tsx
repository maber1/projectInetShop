import { Select } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useStore } from '../../store';

export const Filters = observer(() => {
  const { categories } = useStore();

  useEffect(() => {
    categories.fetchCategories();
  }, [categories]);

  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Select
        filterOption={filterOption}
        loading={categories.loading}
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Выбрать категории"
        onChange={handleChange}
      />
    </>
  );
});
