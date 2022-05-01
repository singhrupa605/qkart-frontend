import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  // function timeout(delay) {
  //   return new Promise((res) => setTimeout(res, delay));
  // }

  const performAPICall = async () => {
    setLoading(true);
    // await timeout(5000);
    const URL = `${config.endpoint}/products`;
    try {
      await axios
        .get(URL)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            setProducts(response.data);
          }
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar(error.reponse.statusText);
        });
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(
        "Something went wrong. Check the backend console for more details",
        { variant: "error" }
      );
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const URL = `${
      config.endpoint
    }/products/search?value=${text.toLowerCase()}`;
    try {
      const response = await axios.get(URL);
      if (response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      const errorCode = error.response.status;
      if (errorCode === 404) {
        setProducts([]);
        //  console.log("Problem while fethcing the products");
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    const newTimeout = setTimeout(
      async () => await performSearch(event.target.value),
      500
    );
    setDebounceTimeout(newTimeout);
  };

  useEffect(() => {
    performAPICall();
  }, []);

  const fetchCart = async (token) => {
    const URL = `${config.endpoint}/cart`;
    try {
      const response = await axios({
        method: "GET",
        url: `${URL}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data);
      return response.data;
    } catch (error) {
      //console.log(error);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      const func = async () => {
        const data = await fetchCart(token);
        const cartData = generateCartItemsFrom(data, products);
        setCartItems(cartData);
      };
      func();
    }
  }, [products]);

  const isItemInCart = (items, productId) => {
    return items.findIndex((item) => item.productId === productId) !== -1;
  };

  const addToCart = async (
    token,
    items,
    qty,
    productId,
    productsData,
    flag = { isAdded: false }
  ) => {
    if (token) {
      if (isItemInCart(items, productId) && flag.isAdded) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
      } else {
        try {
          const URL = `${config.endpoint}/cart`;
          const response = await axios({
            method: "POST",
            url: `${URL}`,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            data: { productId: productId, qty: qty },
          });
          const cartData = generateCartItemsFrom(response.data, productsData);
          setCartItems(cartData);
        } catch (error) {
          enqueueSnackbar("Sorry! cannot add product to the cart");
        }
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  return (
    <div>
      <Header children>
        <TextField
          className="search-desktop"
          onChange={(event) => debounceSearch(event, debounceTimeout)}
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
        />
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        onChange={(event) => debounceSearch(event, debounceTimeout)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <div className="container">
        <Grid container rowSpacing={4} columnSpacing={2}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {!products.length && (
            <div className="searching">
              <SentimentDissatisfied />
              <h3>No products found</h3>
            </div>
          )}
          {products.map((product) => (
            <Grid item xs={6} md={3} key={product._id}>
              <ProductCard
                product={product}
                handleAddToCart={() => {
                  addToCart(token, cartItems, 1, product._id, products, {
                    isAdded: true,
                  });
                }}
              />
            </Grid>
          ))}
        </Grid>

        {localStorage.getItem("username") && (
          <Box className="cart-box" sx={{ backgroundColor: "#E9F5E1" }}>
            <Cart
              products={products}
              items={cartItems}
              handleQuantity={addToCart}
            />
          </Box>
        )}
      </div>
      {isLoading && (
        <div className="loading">
          <CircularProgress />
          <h3>Loading Products...</h3>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Products;
