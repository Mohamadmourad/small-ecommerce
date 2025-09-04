class Product {
  final String id;
  final String name;
  final double price;
  final int stock;
  final bool isOutOfStock;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.stock,
    required this.isOutOfStock,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      stock: json['stock'] as int,
      isOutOfStock: json['isOutOfStock'] as bool? ?? json['outOfStock'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'stock': stock,
      'isOutOfStock': isOutOfStock,
    };
  }

  Product copyWith({
    String? id,
    String? name,
    double? price,
    int? stock,
    bool? isOutOfStock,
  }) {
    return Product(
      id: id ?? this.id,
      name: name ?? this.name,
      price: price ?? this.price,
      stock: stock ?? this.stock,
      isOutOfStock: isOutOfStock ?? this.isOutOfStock,
    );
  }

  bool get isAvailable => !isOutOfStock && stock > 0;

  String get formattedPrice => '\$${price.toStringAsFixed(2)}';

}
