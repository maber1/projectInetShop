import { getParent, types } from 'mobx-state-tree';
import { ICartProduct } from '../types/cart';
import { RootInstance } from '.';

const CartItemModel = types
  .model({
    id: types.identifier,
    name: types.string,
    price: types.number,
    photo: types.maybeNull(types.string),
    quantity: types.optional(types.number, 1),
  })
  .actions((self) => ({
    incrementQuantity() {
      self.quantity++;
    },
    decrementQuantity() {
      if (self.quantity > 0) {
        self.quantity--;
      }
    },
  }));

export const CartModel = types
  .model('CartModel', {
    data: types.optional(types.array(CartItemModel), []),
    loading: types.optional(types.boolean, false),
  })
  .actions((self) => {
    const rootStore = getParent<RootInstance>(self);
    const addToCart = (product: ICartProduct) => {
      self.loading = true;

      const existingItem = self.data.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.incrementQuantity();
      } else {
        const cartProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          photo: product.photo,
          quantity: product.quantity,
        };
        self.data.push(cartProduct);
      }

      rootStore.setNotificationSuccess(`Товар ${product.name} успешно добавлен в корзину`);
      self.loading = false;
    };

    const removeFromCart = (id: string) => {
      self.loading = true;

      const index = self.data.findIndex((searchProduct) => searchProduct.id === id);

      if (index !== -1) {
        self.data.splice(index, 1);
      }

      rootStore.setNotificationSuccess('Товар успешно удален из корзины');
      self.loading = false;
    };

    const clearCart = () => {
      localStorage.removeItem('cartData');
      self.data.clear();
    };

    return { addToCart, removeFromCart, clearCart };
  })
  .views((self) => ({
    totalCart: () => {
      return self.data.reduce(
        (acc, product) => {
          const quantity = Number(product.quantity);
          return {
            totalPrice: acc.totalPrice + product.price * quantity,
            totalQuantity: acc.totalQuantity + quantity,
          };
        },
        { totalPrice: 0, totalQuantity: 0 }
      );

      // return { totalPrice, totalQuantity };
    },
  }));
