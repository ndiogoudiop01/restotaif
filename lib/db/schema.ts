import { 
  pgTable, 
  varchar, 
  text, 
  integer, 
  decimal, 
  boolean, 
  timestamp, 
  uuid, 
  pgEnum,
  jsonb
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed', 
  'preparing',
  'ready',
  'picked_up',
  'delivered',
  'cancelled'
]);

export const deliveryModeEnum = pgEnum('delivery_mode', [
  'delivery',
  'pickup', 
  'taftaf'
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'orange_money',
  'wave',
  'card',
  'cash'
]);

export const loyaltyTierEnum = pgEnum('loyalty_tier', [
  'bronze',
  'silver',
  'gold', 
  'platinum'
]);

// Tables
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  email: varchar('email', { length: 255 }),
  points: integer('points').default(0).notNull(),
  tier: loyaltyTierEnum('tier').default('bronze').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const menuCategories = pgTable('menu_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const menuItems = pgTable('menu_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  categoryId: uuid('category_id').references(() => menuCategories.id).notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  image: text('image').notNull(),
  inStock: boolean('in_stock').default(true).notNull(),
  rating: decimal('rating', { precision: 3, scale: 2 }).default('0').notNull(),
  preparationTime: integer('preparation_time').default(15).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const menuVariants = pgTable('menu_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const menuCustomizations = pgTable('menu_customizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).default('0').notNull(),
  isFree: boolean('is_free').default(false).notNull(),
  category: varchar('category', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  deliveryMode: deliveryModeEnum('delivery_mode').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }).default('0').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  deliveryAddress: text('delivery_address'),
  customerNotes: text('customer_notes'),
  estimatedDeliveryTime: timestamp('estimated_delivery_time'),
  deliveryPersonName: varchar('delivery_person_name', { length: 100 }),
  deliveryPersonPhone: varchar('delivery_person_phone', { length: 20 }),
  paymentTransactionId: varchar('payment_transaction_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  menuItemId: uuid('menu_item_id').references(() => menuItems.id).notNull(),
  variantId: uuid('variant_id').references(() => menuVariants.id).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  customizations: jsonb('customizations').$type<{
    id: string;
    name: string;
    price: number;
  }[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const loyaltyRewards = pgTable('loyalty_rewards', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  pointsCost: integer('points_cost').notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const pointsTransactions = pgTable('points_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  points: integer('points').notNull(),
  source: varchar('source', { length: 50 }).notNull(),
  description: text('description').notNull(),
  orderId: uuid('order_id').references(() => orders.id),
  rewardId: uuid('reward_id').references(() => loyaltyRewards.id),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  pointsTransactions: many(pointsTransactions)
}));

export const menuCategoriesRelations = relations(menuCategories, ({ many }) => ({
  menuItems: many(menuItems)
}));

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id]
  }),
  variants: many(menuVariants),
  customizations: many(menuCustomizations),
  orderItems: many(orderItems)
}));

export const menuVariantsRelations = relations(menuVariants, ({ one }) => ({
  menuItem: one(menuItems, {
    fields: [menuVariants.menuItemId],
    references: [menuItems.id]
  })
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id]
  }),
  variant: one(menuVariants, {
    fields: [orderItems.variantId],
    references: [menuVariants.id]
  })
}));