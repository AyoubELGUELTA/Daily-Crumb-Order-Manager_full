import React, { useEffect, useState } from 'react';
import UpdateCard from './UpdateCard';

const CardList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch initial

  useEffect(() => {
    console.log('Updated products state:', products);
  }, [products]);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/products`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error fetching products');
      }
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };



  const handleGeneralChange = (productId, updatedFields) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, ...updatedFields }
          : p
      )
    );
  };

  const handleDelete = async (productId) => {

    const previousProducts = products;

    setProducts(prev => prev.filter(p => p.id !== productId));


    try {
      const response = await fetch(`/products/${productId}`,
        {
          method: 'DELETE'
        }
      )

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error occured.");
      }


      alert("Product successfully deleted.");

    }
    catch (error) {
      setProducts(previousProducts);
      alert(`Error while trying to delete the product: ${error.message}`)

    }

  }


  const handleInStockChange = (productId, newInStock) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, inStock: newInStock } : p)
    );



    const inStockData = { inStock: newInStock };

    fetch(`/products/${productId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(inStockData),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(async response => {
        const data = await response.json();

        if (!response.ok) {
          // Si la réponse n'est pas OK, on lance une erreur
          // en incluant le message du backend
          console.log(data, response);
          setIsLoading(false);
          throw new Error(data.message || "Une erreur est survenue.");
        }

        // Si tout est OK, on retourne les données pour le prochain "then"
        return data;
      })
      .then(data => {
        // Handle successful login data, e.g., store the auth token
        console.log('successful patch', data);


      })
      .catch(error => {
        // Handle network errors or errors from the server
        console.error('Error during login:', error);
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === productId ? { ...p, inStock: !newInStock } : p
          )
        );

      })

  }





  return (


    <div className="flex flex-wrap gap-4">

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[90]">
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
          <p className="text-center text-blue-500 mb-4 z-[100]">Adding in progress...</p>
          <span className='loading loading-infinity loading-xl z-[100]'></span>
        </div>
      )}
      {error && <p className="text-center text-red-500 mb-4">Error : {error}</p>}
      {products.length > 0 ? (
        products.map(product => (
          <UpdateCard
            key={product.id}
            productId={product.id}
            productName={product.name}
            productPrice={product.price}
            productInStock={product.inStock}
            productImages={product.images} // tableau complet des images
            onDelete={handleDelete}
            onInStockChange={handleInStockChange}
            onGeneralChange={handleGeneralChange}
          />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default CardList;
