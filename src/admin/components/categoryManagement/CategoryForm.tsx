import React, { FC, useEffect } from 'react';
import { Form, FormInstance, Row } from 'antd';
import { useStore } from '../../../store';
import { Field, renderFields } from '../../../components/common/Form';

interface IFormProps {
  categoryId?: string | null;
  form: FormInstance;
}

export const CategoryForm: FC<IFormProps> = ({ categoryId, form }) => {
  const { categories } = useStore();
  const categoryData = categories.getCategoryById(categoryId);
  const fields: Field[] = [
    {
      name: 'name',
      label: 'Наименование',
      required: true,
      placeholder: 'Введите наименование',
    },
    {
      name: 'photo',
      label: 'Фото',
      required: false,
      placeholder: 'Загрузите фото',
    },
  ];

  useEffect(() => {
    form.resetFields();
  });

  const handleSendForm = () => {
    if (categoryId) {
      categories.updateCategory(categoryId, form.getFieldsValue());
    } else {
      categories.addCategory(form.getFieldsValue());
    }
  };

  return (
    <Form initialValues={categoryData} onFinish={handleSendForm} form={form} id="formCategory" layout="vertical">
      <Row gutter={12}>{renderFields(fields)}</Row>
    </Form>
  );
};
