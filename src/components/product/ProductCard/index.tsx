import { Badge, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { IProduct } from '../../../types/products';
import styles from './Card.module.scss';
import { priceFormat, truncateText } from '../../../helpers';
import NoImage from '../../../icons/no_image.svg';
import { useStore } from '../../../store';

interface ICard {
  product?: IProduct;
}

export const Card: FC<ICard> = ({ product }) => {
  const { cart } = useStore();

  const handleProductToCart = (product: IProduct) => {
    cart.addToCart(product);
  };

  return (
    <Badge.Ribbon text={product.category?.name}>
      <div className={styles.card}>
        {product.photo ? (
          <div className={styles.card__photo}>
            <img src={product.photo} alt={product.name} />
          </div>
        ) : (
          <span style={{ padding: 20 }}>
            <NoImage />
          </span>
        )}
        <div className={styles.card__info}>
          <h3>{product.name}</h3>
          <p>{truncateText(product.desc)}</p>
        </div>
        <div className={styles.card__footer}>
          <span className={styles.price}>{priceFormat(product.price)} ₽</span>
          {product.oldPrice && <span className={styles.oldPrice}>{priceFormat(product.oldPrice)} ₽</span>}
          <Button onClick={() => handleProductToCart(product)} type="primary" icon={<ShoppingCartOutlined />} block>
            В корзину
          </Button>
        </div>
      </div>
    </Badge.Ribbon>
  );
};
