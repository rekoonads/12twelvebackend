import { shopify } from "../index.js";

export const getOrdersData = async (req, res) => {
  try {
    const orders = await shopify.rest.Order.all({
      session: {
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        shop: "www.taare.shop",
      },
      status: "any",
    });

    if (!Array.isArray(orders)) {
      return res.status(500).json({
        error: "Expected an array but got something else",
        data: orders,
      });
    }

    const ordersWithReferrals = await Promise.all(
      orders.map(async (order) => {
        // Fetch metafields for each order
        const metafields = await shopify.rest.Metafield.all({
          session: {
            accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
            shop: "www.taare.shop",
          },
          metafield: { owner_id: order.id, owner_resource: "order" },
        });

        const referralId =
          metafields.find((m) => m.key === "referral_id")?.value || "N/A";

        return {
          order_id: order.id,
          created_at: order.created_at,
          total_price: order.total_price,
          referring_site: order.referring_site || "N/A",
          utm_source: order.source_name || "N/A",
          utm_medium: order.source_medium || "N/A",
          utm_campaign: order.source_identifier || "N/A",
          referral_id: referralId,
        };
      })
    );

    return res.json(ordersWithReferrals);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ error: "Error fetching orders", details: error });
  }
};
