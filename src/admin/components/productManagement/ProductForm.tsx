import React, { FC, useCallback, useEffect } from 'react';
import { Form, FormInstance, Input, InputNumber, Row, Select } from 'antd';
import { useStore } from '../../../store';
import { Field, renderFields } from '../../../components/common/Form';

interface IFormProps {
  productId?: string | null;
  form: FormInstance;
}

export const ProductForm: FC<IFormProps> = ({ productId, form }) => {
  const { products, categories } = useStore();
  const productData = products.getProductById(productId);
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
    {
      name: 'desc',
      label: 'Описание',
      required: false,
      element: <Input.TextArea placeholder="Введите описание" />,
    },
    {
      name: 'price',
      label: 'Цена',
      required: true,
      placeholder: 'Введите цену',
      typeInput: 'number',
      col: { span: '12' },
      element: <InputNumber min={1} style={{ width: '100%' }} />,
    },
    {
      name: 'oldPrice',
      label: 'Старая цена',
      required: false,
      placeholder: 'Введите старую цену',
      typeInput: 'number',
      col: { span: '12' },
      element: <InputNumber min={1} style={{ width: '100%' }} />,
    },
    {
      name: 'categoryId',
      label: 'Категория',
      required: true,
      element: (
        <Select
          placeholder="Выбрать категорию"
          options={categories.data.map((category) => ({
            value: category.id,
            label: category?.name,
          }))}
        />
      ),
    },
  ];

  useEffect(() => {
    form.resetFields();
  });

  const handleSendForm = useCallback(() => {
    if (productId) {
      products.updateProduct(productId, form.getFieldsValue());
    } else {
      products.addProduct(form.getFieldsValue());
    }
  }, [form, products, productId]);

  return (
    <>
      <Form initialValues={productData} onFinish={handleSendForm} form={form} id="formProduct" layout="vertical">
        <Row gutter={12}>{renderFields(fields)}</Row>
      </Form>
    </>
  );
};
