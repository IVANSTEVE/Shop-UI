import React from 'react';
import './App.css';

function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <h1>Bienvenue dans notre boutique de T-shirts</h1>
    //   </header>
    //
    // </div>
    <body>
    <header>
        <h1>Bienvenue dans notre boutique de T-shirts</h1>

        <nav>
            <ul>
                <li><a href="#women">Women's</a></li>
                <li><a href="#men">Men's</a></li>
                <li><a href="#kids">Kids'</a></li>
                <li><a href="#teenagers">Teenagers'</a></li>
                <li><a href="#short-sleeves">Short Sleeves</a></li>
                <li><a href="#long-sleeves">Long Sleeves</a></li>
                <li><a href="#oversized">Oversized</a></li>
                <li><a href="#hoodies">Hoodies</a></li>
                <li><a href="#tank-tops">Tank Tops</a></li>
                <li><a href="#v-neck">V-Neck</a></li>
                <li><a href="#graphic-tees">Graphic Tees</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="users">
            <h2>Users</h2>
            <div>
                <h3>User Roles</h3>
                <ul>
                    <li>Visitor: Browses the store without an account.</li>
                    <li>Client: Registered user who can make purchases.</li>
                    <li>Admin: Manages the store, products, and orders.</li>
                    <li>Delivery: Handles the shipment of orders.</li>
                </ul>
            </div>
        </section>

        <section id="products">
            <h2>Products</h2>
            <div>
                <h3>Product Categories</h3>
                <ul>
                    <li>
                        <strong>T-Shirts:</strong>
                        <p>Description: Comfortable and stylish T-shirts for everyone.</p>
                        <ul>
                            <li>Subcategories:
                                <ul>
                                    <li>Women's T-Shirts</li>
                                    <li>Men's T-Shirts</li>
                                    <li>Kids' T-Shirts</li>
                                    <li>Teenagers' T-Shirts</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <strong>Hoodies:</strong>
                        <p>Description: Cozy hoodies for a casual look.</p>
                    </li>
                    <li>
                        <strong>Tank Tops:</strong>
                        <p>Description: Perfect for hot weather or workouts.</p>
                    </li>
                    <li>
                        <strong>Graphic Tees:</strong>
                        <p>Description: Unique designs that express your personality.</p>
                    </li>
                </ul>
            </div>
        </section>

        <section id="shopping-cart">
            <h2>Shopping Cart</h2>
            <p>Your selected items will appear here.</p>
            {/*Add dynamic cart items here */}
        </section>

        <section id="orders">
            <h2>Orders</h2>
            <p>Track your order status and history.</p>
            {/*Order tracking functionality can be added here */}
        </section>

        <section id="payment">
            <h2>Payment</h2>
            <p>Select your preferred payment method to complete the purchase.</p>
            {/*Payment options can be added here  */}
        </section>

        <footer>
            <p>&copy; 2024 T-Shirt Store</p>
            <a href="#top">Back to top</a>
        </footer>
    </main>
    </body>

);
}

export default App;
