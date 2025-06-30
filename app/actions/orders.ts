'use server'

import { db } from '@/lib/db';
import { orders, orderItems, users, pointsTransactions } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { ApiResponse, Order, CartItem } from '@/lib/types';

const DELIVERY_FEES = {
  delivery: 500,
  pickup: 0,
  taftaf: 1000
} as const;

export async function createOrder(
  userId: string,
  cartItems: CartItem[],
  deliveryMode: 'delivery' | 'pickup' | 'taftaf',
  paymentMethod: 'orange_money' | 'wave' | 'card' | 'cash',
  deliveryAddress?: string,
  customerNotes?: string
): Promise<ApiResponse<{ orderId: string; pointsEarned: number }>> {
  try {
    if (!cartItems || cartItems.length === 0) {
      return { success: false, error: 'Panier vide' };
    }

    // Calculer les totaux
    const subtotal = cartItems.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    const deliveryFee = DELIVERY_FEES[deliveryMode] || 0;
    const total = subtotal + deliveryFee;

    // Créer la commande
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId,
        status: 'pending',
        deliveryMode,
        paymentMethod,
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
        deliveryAddress,
        customerNotes,
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      })
      .returning();

    // Ajouter les articles de la commande
    const orderItemsToInsert = cartItems.map(item => ({
      orderId: newOrder.id,
      menuItemId: item.menuItem.id,
      variantId: item.variant.id,
      quantity: item.quantity,
      unitPrice: item.totalPrice.toString(),
      totalPrice: (item.totalPrice * item.quantity).toString(),
      customizations: item.customizations
    }));

    await db.insert(orderItems).values(orderItemsToInsert);

    // Ajouter des points de fidélité (1 point par 1000 FCFA)
    const pointsEarned = Math.floor(total / 1000);
    if (pointsEarned > 0) {
      await db.insert(pointsTransactions).values({
        userId,
        type: 'earned',
        points: pointsEarned,
        source: 'order',
        description: `Points gagnés pour la commande #${newOrder.id}`,
        orderId: newOrder.id
      });

      // Mettre à jour les points de l'utilisateur
      await db
        .update(users)
        .set({
          points: sql`points + ${pointsEarned}`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    }

    return { 
      success: true, 
      data: { orderId: newOrder.id, pointsEarned },
      message: 'Commande créée avec succès' 
    };
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    return { success: false, error: "Erreur lors de la création de la commande" };
  }
}

export async function getOrdersByUser(userId: string): Promise<ApiResponse<Order[]>> {
  try {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        items: {
          with: {
            menuItem: {
              with: {
                category: true
              }
            },
            variant: true
          }
        }
      },
      orderBy: (orders, { desc }) => [desc(orders.createdAt)]
    });

    const formattedOrders = userOrders.map(order => ({
      ...order,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total: Number(order.total),
      items: order.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        menuItem: {
          ...item.menuItem,
          basePrice: Number(item.menuItem.basePrice),
          rating: Number(item.menuItem.rating)
        },
        variant: {
          ...item.variant,
          price: Number(item.variant.price)
        }
      }))
    }));

    return { success: true, data: formattedOrders };
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return { success: false, error: "Erreur lors de la récupération des commandes" };
  }
}
