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

  // Factory constructor to create Product from JSON
  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] as String,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      stock: json['stock'] as int,
      isOutOfStock: json['isOutOfStock'] as bool? ?? json['outOfStock'] as bool? ?? false,
    );
  }

  // Method to convert Product to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'price': price,
      'stock': stock,
      'isOutOfStock': isOutOfStock,
    };
  }

  // Method to create a copy with updated values
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

  // Helper method to check if product is available
  bool get isAvailable => !isOutOfStock && stock > 0;

  // Helper method to get formatted price
  String get formattedPrice => '\$${price.toStringAsFixed(2)}';

  @override
  String toString() {
    return 'Product{id: $id, name: $name, price: $price, stock: $stock, isOutOfStock: $isOutOfStock}';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Product &&
        other.id == id &&
        other.name == name &&
        other.price == price &&
        other.stock == stock &&
        other.isOutOfStock == isOutOfStock;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        price.hashCode ^
        stock.hashCode ^
        isOutOfStock.hashCode;
  }
}
