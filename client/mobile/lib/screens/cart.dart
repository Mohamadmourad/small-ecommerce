import 'package:flutter/material.dart';
import 'package:mobile/components/loading.dart';
import '../utils/callApi.dart';
import '../components/button.dart';

class CartItem {
  final String id;
  final String productId;
  final String productName;
  final double productPrice;
  final int productStock;
  int quantity;
  final bool outOfStock;

  CartItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productPrice,
    required this.productStock,
    required this.quantity,
    required this.outOfStock,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        id: json['id'] as String,
        productId: json['productId'] as String,
        productName: json['productName'] as String,
        productPrice: (json['productPrice'] as num).toDouble(),
        productStock: (json['productStock'] as num).toInt(),
        quantity: (json['quantity'] as num).toInt(),
        outOfStock: json['outOfStock'] as bool? ?? false,
      );

}

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  State<Cart> createState() => _CartState();
}

class _CartState extends State<Cart> {
  bool isLoading = true;
  List<CartItem> items = [];

  @override
  void initState() {
    super.initState();
    fetchCartItems();
  }

  Future<void> fetchCartItems() async {
    setState(() => isLoading = true);
    try {
      final resp = await callApi('GET', '/cart/items');
      if (resp['status'] == 200 && resp['data'] != null) {
        final List<dynamic> list = resp['data'] as List<dynamic>;
        items = list.map((e) {
          final Map<String, dynamic> json = Map<String, dynamic>.from(e as Map);
          return CartItem.fromJson(json);
        }).toList();
      }
    } catch (e) {
      // ignore
    } finally {
      setState(() => isLoading = false);
    }
  }

  Future<void> incrementItem(CartItem item) async {
    final oldQty = item.quantity;
    setState(() => item.quantity = oldQty + 1);

    try {
      final resp = await callApi('POST', '/cart/increment', body: {
        'productId': item.productId,
      });
      if (resp['status'] != 200) {
        setState(() => item.quantity = oldQty);
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to increment quantity')));
      }
    } catch (e) {
      setState(() => item.quantity = oldQty);
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Network error')));
    }
  }

  Future<void> decrementItem(CartItem item) async {
    final oldQty = item.quantity;
    final newQty = oldQty - 1;
    if (newQty < 0) return;

    // Optimistically update UI
    setState(() {
      if (newQty == 0) {
        // remove locally; backend should remove as well
        items.remove(item);
      } else {
        item.quantity = newQty;
      }
    });

    try {
      final resp = await callApi('POST', '/cart/decrement', body: {
        'productId': item.productId,
      });

      if (resp['status'] != 200) {
        // rollback
        setState(() {
          if (!items.contains(item)) items.insert(0, item);
          item.quantity = oldQty;
        });
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to decrement quantity')));
      }
    } catch (e) {
      setState(() {
        if (!items.contains(item)) items.insert(0, item);
        item.quantity = oldQty;
      });
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Network error')));
    }
  }

  double get total {
    return items.fold(0.0, (sum, it) => sum + it.productPrice * it.quantity);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cart'), backgroundColor: const Color(0xFF212121)),
      body: isLoading
          ? const Center(child: Loading())
          : items.isEmpty
              ? const Center(child: Text('Your cart is empty'))
              : Column(
                  children: [
                    Expanded(
                      child: ListView.separated(
                        padding: const EdgeInsets.all(16),
                        itemCount: items.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final ci = items[index];
                          return Card(
                            elevation: 1,
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(ci.productName, style: const TextStyle(fontWeight: FontWeight.w600)),
                                        const SizedBox(height: 6),
                                        Text('\$${ci.productPrice.toStringAsFixed(2)}'),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Row(
                                    children: [
                                      IconButton(
                                        onPressed: () => decrementItem(ci),
                                        icon: const Icon(Icons.remove_circle_outline),
                                      ),
                                      Text('${ci.quantity}'),
                                      IconButton(
                                        onPressed: () => incrementItem(ci),
                                        icon: const Icon(Icons.add_circle_outline),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text('Total: \$${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 12),
                          SizedBox(
                            height: 48,
                            child: SizedBox(
                              width: double.infinity,
                              child: CustomButton(
                                text: 'Proceed to checkout',
                                onPressed: () {
                                  Navigator.pushNamed(context, '/checkout');
                                },
                                variant: ButtonVariant.primary,
                                size: ButtonSize.large,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
    );
  }
}