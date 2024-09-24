import { ApiVersion, BillingInterval, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/web-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { mongo } from "./db/mongoConnection.js";
import apiRouter from "./routes/api.js";
import { handleOrderWebhook } from "./controllers/orderWebhookController.js";
import { getOrdersData } from "./controllers/orderDataController.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET_KEY,
  scopes: ["read_orders", "write_orders"],
  hostName: "https://sweet-ostrich-mostly.ngrok-free.app",
  hostScheme: "https",
  apiVersion: ApiVersion.July24,
  isEmbeddedApp: true,
  isCustomStoreApp: false,
  userAgentPrefix: "Custom prefix",
  adminApiAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,
  customShopDomains: [process.env.SHOP_DOMAIN],
  billing: {
    "My plan": {
      amount: 5.0,
      currencyCode: "USD",
      interval: BillingInterval.OneTime,
    },
  },
  restResources,
});

// Webhook handler for new orders
app.post(
  "/webhooks/orders/create",
  express.raw({ type: "application/json" }),
  handleOrderWebhook
);

// Endpoint to fetch orders with redirect information
app.get("/data", getOrdersData);

const PORT = process.env.PORT || 8080;

app.use("/", apiRouter);

async function startServer() {
  try {
    await mongo();
    app.listen(PORT, () => {
      console.log(`The Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
}

startServer();
