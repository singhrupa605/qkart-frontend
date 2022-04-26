import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card" id={product._id} category={product.category}>
      <CardMedia alt={product.name} component="img" image={product.image} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h4">
          {product.name}
        </Typography>
        <Typography gutterBottom variant="h6" component="h4" fontWeight="600">
          ${product.cost}
        </Typography>
        <Rating
          readOnly
          size="large"
          name="half-rating-read"
          defaultValue={4.5}
          precision={0.5}
        >
          {product.rating}
        </Rating>
      </CardContent>

      <CardActions className="card-actions">
        <Button
          className="card-button"
          variant="contained"
          onClick={handleAddToCart}
          fullWidth
        >
          <AddShoppingCartOutlined /> ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
