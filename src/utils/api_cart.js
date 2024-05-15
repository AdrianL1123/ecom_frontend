export function addToCart(product) {
  const products = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedProducts = products.find((p) => p._id === product._id);
  if (selectedProducts) {
    selectedProducts.quantity++;
  } else {
    products.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(products));
}

export function displayCart() {
  const products = JSON.parse(localStorage.getItem("cart")) || [];
  return products;
}

export function removeItemFromCart(_id) {
  const carts = JSON.parse(localStorage.getItem("cart")) || [];
  let newCarts = carts.filter((item) => item._id !== _id);
  localStorage.setItem("cart", JSON.stringify(newCarts));
}

export function emptyCart() {
  localStorage.removeItem("cart");
}
