import 'package:flutter/material.dart';
import '../models/product.dart';

class ItemCard extends StatelessWidget {
  final Product product;
  final VoidCallback? onAddToCart;

  const ItemCard({
    super.key,
    required this.product,
    this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            Text(
              product.name,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 6),
            Text(
              product.formattedPrice,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
            ),

      const SizedBox(height: 12),

      product.isAvailable
        ? SizedBox(
          width: double.infinity,
          height: 44,
                    child: ElevatedButton.icon(
                      onPressed: onAddToCart,
                      icon: const Icon(Icons.add_shopping_cart, size: 16),
                      label: const Text('Add to cart'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF212121),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        elevation: 0,
            minimumSize: const Size.fromHeight(44),
                      ),
                    ),
                  )
                : Container(
          width: double.infinity,
          height: 44,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.05),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'Out of stock',
                      style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.w600),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}