import { IPagination, ISorting } from './baseTypes';
import { IProduct } from './products';

export enum IOrderStatus {
  PendingConfirmation = 'pending_confirmation',
  Processing = 'processing',
  Packaging = 'packaging',
  WaitingForDelivery = 'waiting_for_delivery',
  InTransit = 'in_transit',
  Delivered = 'delivered',
  ReturnRequested = 'return_requested',
  OrderCancelled = 'order_cancelled',
}

export interface IOrdersRequest {
  products: Array<{
    id: string;
    quantity: number;
  }>;
  status?: IOrderStatus;
}

export interface IOrderProduct {
  _id: string; // служебный id - это не id продукта
  product: IProduct;
  quantity: number;
}

export interface IOrder {
  id: string;
  products: IOrderProduct[];
  // user: IProfileResponse;
  status: IOrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
export interface IOrdersResponse {
  data: IOrder[];
  pagination: IPagination;
  sorting: ISorting;
}
