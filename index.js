import express from "express";
import { mongo } from "./db/mongoConnection.js";
import "dotenv/config";
import axios from "axios";
import cors from "cors";
const app = express();
import apiRouter from "./routes/api.js";
import "@shopify/shopify-api/adapters/node";
import "@shopify/shopify-api/adapters/cf-worker";
import "@shopify/shopify-api/adapters/web-api";
import { shopifyApi, ApiVersion, BillingInterval } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-07";

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

const shopify = shopifyApi({
  // The next 4 values are typically read from environment variables for added security
  apiKey: "08446ba009a28878440d8a0fec26dfce",
  apiSecretKey: "1bbedbe9addb9336b9ba517db1ead75a",
  scopes: ["read_orders"],
  hostName: "https://sweet-ostrich-mostly.ngrok-free.app",
  hostScheme: "https",
  apiVersion: ApiVersion.July24,
  isEmbeddedApp: true,
  isCustomStoreApp: false,
  userAgentPrefix: "Custom prefix",
  adminApiAccessToken: "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",
  customShopDomains: ["www.taare.shop"],
  billing: {
    "My plan": {
      amount: 5.0,
      currencyCode: "USD",
      interval: BillingInterval.OneTime,
    },
  },
  // logger: {
  //   log: (severity, message) => {
  //     myAppsLogFunction(severity, message);
  //   },
  // },
  restResources,
  future: {
    // ...
  },
});

console.log("SHOPIFY", shopify);

app.get("/data", async (req, res) => {
  try {
    const orders = await shopify.rest.Order.all({
      session: {
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        shop: "www.taare.shop",
      },
      status: "any",
    });

    console.log("Orders Response:", orders);

    // Ensure that `orders` is an array
    if (!Array.isArray(orders)) {
      return res.status(500).json({
        error: "Expected an array but got something else",
        data: orders,
      });
    }

    // Parse the note_attributes to find the referrer for each order
    const ordersWithReferrers = orders.map((order) => {
      const referrer = order.note_attributes.find(
        (attr) => attr.name === "referrer"
      );
      return {
        order_id: order.id,
        created_at: order.created_at,
        total_price: order.total_price,
        referrer: referrer ? referrer.value : "N/A",
      };
    });

    return res.json(ordersWithReferrers);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ error: "Error fetching orders", details: error });
  }
});

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
