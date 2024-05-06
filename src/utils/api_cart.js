export function addToCart(product) {
  const products = JSON.parse(localStorage.getItem("carts")) || [];
  const selectedProducts = products.find((p) => p._id === product._id);
  if (selectedProducts) {
    selectedProducts.quantity++;
  } else {
    products.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("carts", JSON.stringify(products));
}

export function displayCart() {
  const products = JSON.parse(localStorage.getItem("carts")) || [];
  return products;
}

export function removeItemFromCart(id) {
  const carts = JSON.parse(localStorage.getItem("carts")) || [];
  let newCarts = carts.filter((item) => item._id !== id);
  localStorage.setItem("carts", JSON.stringify(newCarts));
}
