import 'package:flutter/material.dart';
import 'package:mobile/components/loading.dart';
import 'package:mobile/models/product.dart';
import '../utils/callApi.dart';
import '../components/itemCard.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  bool isLoading = true;
  List<Product> products = [];

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    try {
      final response = await callApi('GET', '/products');
      
      if (response['status'] == 200) {
        // Parse the products from the response
        final List<dynamic> productList = response['data'] as List<dynamic>;
        
        setState(() {
          products = productList.map((productJson) => Product.fromJson(productJson)).toList();
          isLoading = false;
        });
      } else {
        // Handle error
        setState(() {
          isLoading = false;
        });
        // You can show an error message here if needed
        print('Failed to fetch products: ${response['data']}');
      }
    } catch (error) {
      setState(() {
        isLoading = false;
      });
      print('Error fetching products: $error');
    }
  }

  Future<void> handleAddToCart(Product product) async {
    try {
      final response = await callApi('POST', '/cart/add', body: {
        'productId': product.id
      });

      if (response['status'] == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${product.name} added to cart!'),
            duration: const Duration(seconds: 2),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to add ${product.name} to cart: ${response['data']}'),
            duration: const Duration(seconds: 3),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error adding to cart: ${error.toString()}'),
          duration: const Duration(seconds: 3),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text("V8"),
            IconButton(
              icon: const Icon(Icons.shopping_cart, color: Colors.white),
              onPressed: () {
                Navigator.pushNamed(context, '/cart');
              },
            )
          ],
        ),
        backgroundColor: const Color(0xFF212121),
        foregroundColor: Colors.white,
        automaticallyImplyLeading: false, 
      ),
      body: isLoading 
        ? const Center(child: Loading())
        : products.isEmpty
          ? const Center(
              child: Text(
                'No products available',
                style: TextStyle(fontSize: 18, color: Colors.grey),
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: ListView.builder(
                itemCount: (products.length / 2).ceil(),
                itemBuilder: (context, rowIndex) {
                  final int firstIndex = rowIndex * 2;
                  final int secondIndex = firstIndex + 1;

                  final Product firstProduct = products[firstIndex];
                  final Product? secondProduct = secondIndex < products.length ? products[secondIndex] : null;

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: ItemCard(
                            product: firstProduct,
                            onAddToCart: () => handleAddToCart(firstProduct),
                          ),
                        ),
                        const SizedBox(width: 12.0),
                        Expanded(
                          child: secondProduct != null
                              ? ItemCard(
                                  product: secondProduct,
                                  onAddToCart: () => handleAddToCart(secondProduct),
                                )
                              : const SizedBox.shrink(),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
    );
  }
}