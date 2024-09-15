import { PartialType } from '@nestjs/swagger';
import { OrderItemDto } from './order_item.dto';

export class UpdateOrderItemDto extends PartialType(OrderItemDto) {}