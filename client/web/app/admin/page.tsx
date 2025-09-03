const AdminPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your store from here
                </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-semibold">Products</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Manage your product inventory
                    </p>
                </div>
                
                <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-semibold">Orders</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        View and manage customer orders
                    </p>
                </div>
                
                <div className="rounded-lg border p-6">
                    <h3 className="text-lg font-semibold">Low Stock</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Monitor products running low
                    </p>
                </div>
            </div>
        </div>
    );
}
 
export default AdminPage;