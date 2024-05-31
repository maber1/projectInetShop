import React from 'react';
import { Col, ColProps, Form, FormItemProps, Input } from 'antd';
import { get, has } from 'lodash';

export interface Field extends FormItemProps {
  name: string;
  col?: ColProps;
  element?: React.ReactNode;
  requiredMessage?: string;
  typeInput?: 'string' | 'number' | 'email' | 'array';
  placeholder?: string;
  // callBack?: () => void
}

interface Validation {
  [name: string]: string | string[];
}

export const renderFields = (fields: Field[], validation?: Validation) =>
  fields.map((props, index) => {
    const { name, label, element, col, required, requiredMessage, typeInput, placeholder = '' } = props;
    return (
      <Col key={index} span={24} {...col}>
        <Form.Item
          validateStatus={has(validation, name) ? 'error' : undefined}
          help={get(validation, name)}
          name={name}
          label={label}
          key={index}
          rules={[
            {
              required,
              message: requiredMessage || `Поле ${label} обязательно`,
              type: typeInput,
            },
          ]}
        >
          {element ? element : <Input placeholder={placeholder} />}
        </Form.Item>
      </Col>
    );
  });
