import express from "express";
import products from "../resources/products.js";
import verifyRole from "../middleware/verifyRole.js";

let idCounter = products.length;

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json(products);
});

router.get("/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ msg: "Product not found" });
  }
});

router.delete("/:id", verifyRole("admin"), async (req, res) => {
  const product = products.find((product) => product.id == req.params.id);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }
  const index = products.indexOf(product);
  products.splice(index, 1);
  res.status(200).json({ msg: "Product deleted" });
});

router.post("/", verifyRole("admin"), (req, res) => {
  const id = idCounter++;
  const bids = [];
  const winner = null;
  const {
    name,
    category_name,
    image,
    location,
    description,
    current_bid,
    end_time,
  } = req.body;

  const newProduct = {
    id,
    name,
    category_name,
    image,
    location,
    description,
    current_bid,
    bids,
    end_time,
    winner,
  };
  products.push(newProduct);

  if (products.some((product) => product.id === id)) {
    res.status(200).json({ msg: "Product created" });
  } else {
    res.status(500).json({ msg: "Product not created, ID might be duplicate" });
  }
});

router.put("/:id", verifyRole("admin"), (req, res) => {
  const product = products.find((product) => product.id == req.params.id);

  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }

  Object.assign(product, req.body);
  res.status(200).json({ msg: "Product updated" });
});

export default router;
