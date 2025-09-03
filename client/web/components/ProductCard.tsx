import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Edit } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    outOfStock: boolean;
}

interface ProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
    showEdit?: boolean;
}

const ProductCard = ({ product, onEdit, showEdit = false }: ProductCardProps) => {
    console.log(product)
    return (
        <Card className="w-full border border-gray-200">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <div className="flex items-center gap-2">
                        {product.outOfStock && ( 
                            <Badge variant="destructive">Out of Stock</Badge>
                        )}
                        {showEdit && onEdit && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(product)}
                                className="h-8 w-8 p-0"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                        Stock: {product.stock}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default ProductCard;