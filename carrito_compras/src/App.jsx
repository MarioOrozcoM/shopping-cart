import { useState } from 'react';
import { useEffect } from 'react';


function App(){
  //Variables
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() =>{
    const savedCart = localStorage.getItem('shopping_cart_data');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [loading, setLoading] = useState(true);

  //useEffect
  useEffect( ()=>{
    const fetchProducts = async () =>{
      try{
        setLoading(true);
        const url = 'https://fakestoreapi.com/products';
        const response = await fetch(url);
        const data = await response.json();
        setProducts(data);
        console.log(data)
      }catch (error){

      } finally{
        setLoading(false);
      } //Try catch finally end
    }
    fetchProducts();
  }, []);

  // To local storage
  useEffect( () =>{
    localStorage.setItem('shopping_cart_data', JSON.stringify(cart));
  }, [cart]);

  //function addToCart
  const addToCart = (product) =>{
    const itemExists = cart.find(item => item.id === product.id)
    if(itemExists){
      setCart(cart.map(item =>
        item.id === product.id ? {...item, quantity: item.quantity + 1} : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };
  // To calculate the total of the items in the cart
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // To remove (clean) all the poducts from the cart
  const clearCart = () => {
    setCart([]);
  };

  //Show on the page
  return(
    <div className='max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6'>

      {/* Left side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:col-span-3">
      {/* Loading */}
      {loading ? (
        <p className="text-slate-600 font-medium mt-4 animate-pulse">Loading...</p>
      ) : (
        products.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-xl shadow border border-slate-100 flex flex-col justify-between">
            <img src={product.image} alt={product.title} className="h-40 object-contain mx-auto mb-4" />
            <h3 className="font-bold text-sm text-slate-800 line-clamp-2">{product.title}</h3>
            <p className="text-blue-600 font-extrabold mt-2">${product.price}</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg cursor-pointer"
                    onClick={() => addToCart(product)}>
              Add To Cart
            </button>
          </div>
        ))
      )}
      </div> {/* Left side end */}

      {/* Right side - Shopping Cart */}
      <div className='md:col-span-1 bg-white p-4 rounded-xl shadow border border-slate-100 sticky top-6'>
        <h3 className='text-center font-medium'>Your Shopping Cart</h3>
        {cart.length === 0 ? <p className="text-slate-400 text-sm mt-4">Shopping Cart is Empty</p> : (
          cart.map(item =>(
              <div key={item.id} className="flex justify-between items-center border-b border-slate-100 py-3 text-sm">
                <div className="flex-1 pr-2">
                  <p className="font-bold text-slate-800 line-clamp-1">{item.title}</p>
                  <p className="text-slate-500 text-xs">${item.price} x {item.quantity}</p>
                </div>
                <p className="font-extrabold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
          ))
        )}
        {/* Show the total on the cart */}
        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-700">Total:</span>
            <span className="text-xl font-extrabold text-blue-600">${total.toFixed(2)}</span>
          </div>
        )}
        {cart.length > 0 &&(
            <button className='bg-red-500 hover:bg-red-600 text-white w-full py-2 mt-4 rounded-lg font-semibold cursor-pointer text-center'
                    onClick={clearCart}>
              Clean Cart
            </button>
        )}

      </div> {/* Right side - Shopping Cart END */}


    </div>
  ) //Return END
} //Function App END


//Obligatory export
export default App