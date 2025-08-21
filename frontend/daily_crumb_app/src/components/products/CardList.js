import React, { useEffect, useState } from 'react';
import UpdateCard from './UpdateCard';
import UpdateProductForm from './UpdateProductForm';

const CardList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [needRefresh, SetNeedRefresh] = useState(true);
  const [prefilledInfoEditProduct, setPrefilledInfoEditProduct] = useState({
    id: "",
    name: "",
    price: "",
    images: []
  })


  useEffect(() => {
    if (needRefresh) {
      fetchProducts();
      SetNeedRefresh(false)
    }
  }, [needRefresh]);

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



  const handleGeneralChange = async (productId) => {
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/products/${productId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error fetching product current infos');
      }
      setPrefilledInfoEditProduct({
        id: data.product.id,
        name: data.product.name,
        price: data.product.price,
        images: data.product.images
      })
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (productId) => {

    const previousProducts = products;

    setProducts(prev => prev.filter(p => p.id !== productId));


    try {
      const response = await fetch(`/products/${productId}`,
        {
          method: 'DELETE'
        }
      )


      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Error occured.");
      }


      alert("Product successfully deleted.");

    }
    catch (error) {
      setProducts(previousProducts);
      setError(`Error: ${error.message}`)

    }

  }


  const handleInStockChange = async (productId, newInStock) => {
    const previousProducts = products;

    // Optimistically update the UI
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, inStock: newInStock } : p)
    );

    const inStockData = { inStock: newInStock };

    // Make the PATCH request
    fetch(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(inStockData),
      headers: {
        'Content-Type': 'application/json'
        // You should also include the authorization header here
        // 'Authorization': `Bearer ${token}`
      }
    })
      .then(async response => {
        const data = await response.json();

        if (!response.ok) {
          // If the request was not successful, revert the state
          console.log(data, response);
          throw new Error(data.message || "An error occurred.");
        }

        console.log('successful patch', data);
        // No state update needed here because it was done optimistically
      })
      .catch(error => {
        // Revert the state to the previous value if the request failed
        console.error('Error during optimistic update:', error);
        setError(`Error: ${error.message}`);
        setProducts(previousProducts); // Revert to the stored previous state
      });

  };


  const handleOverlayClick = () => {
    setError('');
  };

  const handleClosingUpdateForm = () => {
    setPrefilledInfoEditProduct({
      id: "",
      name: "",
      price: "",
      images: []
    })
  }


  const handleSuccessUpdating = () => {
    handleClosingUpdateForm();
    SetNeedRefresh(true);

  }

  const handleDeleteImage = async (imageId) => {
    try {
      const res = await fetch(
        `/api/products/${prefilledInfoEditProduct.id}/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error supressing image (probably from internal server).");
      }

      setPrefilledInfoEditProduct((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== imageId),
      }));
    } catch (err) {
      console.error("Error supressing image:", err);
    }
  };





  return (


    <div className="flex flex-wrap gap-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Products managing</h2>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-[90]">
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm"></div>
          <p className="text-center text-blue-500 mb-4 z-[100]"></p>
          <span className='loading loading-infinity loading-xl z-[100]'></span>
        </div>
      )}
      {error && (

        <div onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">

            <p className="text-xl font-bold mb-4">{error}</p>
          </div>

        </div>

      )}
      {

      }

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

      {prefilledInfoEditProduct.id ? <div><UpdateProductForm
        id={prefilledInfoEditProduct.id}
        name={prefilledInfoEditProduct.name}
        price={prefilledInfoEditProduct.price}
        images={prefilledInfoEditProduct.images}
        onUpdateSuccess={handleSuccessUpdating}
        onCancel={handleClosingUpdateForm}
        handleDeleteImage={handleDeleteImage} /></div>
        : null}
    </div>

  );
}

export default CardList;
