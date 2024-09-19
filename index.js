import express from "express";
import { mongo } from "./db/mongoConnection.js";
import "dotenv/config";
import axios from "axios";
import cors from "cors";
const app = express();
import apiRouter from "./routes/api.js";

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/data", (req, res) => {
  //     console.log("called");
  //     const accessToken = 'acess token'; // Use your Admin API access token
  //   const shopName = 'Taare'; // E.g., 'yourshopname'
  //   const url = `https://${shopName}.myshopify.com/admin/api/2024-07/orders.json`;
  //   const response = axios.get(url, {
  //     headers: {
  //       'X-Shopify-Access-Token': accessToken,
  //     },
  //     params: {
  //       status: 'any',
  //       fields: 'id,created_at,total_price,note_attributes',
  //     },
  //   });
  // console.log("orders", response.data.orders);
  // Parse the note_attributes to find the referrer for each order
  //   const ordersWithReferrers = response.data.orders.map(order => {
  //     const referrer = order.note_attributes.find(attr => attr.name === 'referrer');
  //     return {
  //       order_id: order.id,
  //       created_at: order.created_at,
  //       total_price: order.total_price,
  //       referrer: referrer ? referrer.value : 'N/A',
  //     };
  //   });
  // Return the JSON result
  //   return res.json(ordersWithReferrers);
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
