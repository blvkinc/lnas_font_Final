/* tslint:disable */
/* eslint-disable */
import { OrderItemDto } from './order-item-dto';
export interface OrderDto {
  discount?: string;
  documentId?: string;
  id?: number;
  items?: Array<OrderItemDto>;
  shipping?: string;
  status?: 'ACTIVE' | 'CLOSED';
  subtotal?: string;
  tax?: string;
  total?: string;
  transaction?: number;
  transactionMethod?: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CREDIT' | 'PAYPAL';
  type?: string;
}
