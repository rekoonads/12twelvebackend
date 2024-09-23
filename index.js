import { ApiVersion, BillingInterval, shopifyApi } from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/web-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { mongo } from "./db/mongoConnection.js";
import apiRouter from "./routes/api.js";
import { handleOrderWebhook } from "./controllers/orderWebhookController.js";
import { getOrdersData } from "./controllers/orderDataController.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
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
  customShopDomains: ["www.taare.shop"],
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
app.post("/webhooks/orders/create", handleOrderWebhook);

// Endpoint to fetch orders with redirect information
app.get("/data", getOrdersData);

const PORT = process.env.PORT || 8080;
app.use("/", apiRouter);

let server;
Promise.all([mongo()])
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`The Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
    if (server) {
      server.close();
    }
    console.log("Restarting the server...");
    server = app.listen(PORT, () => {
      console.log(`The Server has been restarted on ${PORT}`);
    });
  });
