import { shopify } from "../index.js";

export const getOrdersData = async (req, res) => {
  try {
    const response = await shopify.rest.Order.all({
      session: {
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        shop: process.env.SHOP_DOMAIN,
      },
      status: "any",
    });

    let orders = Array.isArray(response) ? response : response.data;

    if (!Array.isArray(orders)) {
      throw new Error("Orders data is not an array");
    }

    const ordersWithReferrals = await Promise.all(
      orders.map(async (order) => {
        console.log("Processing order:", JSON.stringify(order, null, 2));

        let metafields;
        try {
          metafields = await shopify.rest.Metafield.all({
            session: {
              accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
              shop: process.env.SHOP_DOMAIN,
            },
            metafield: { owner_id: order.id, owner_resource: "order" },
          });
          console.log(
            "Metafields for order",
            order.id,
            ":",
            JSON.stringify(metafields, null, 2)
          );
        } catch (metafieldError) {
          console.error(
            "Error fetching metafields for order",
            order.id,
            ":",
            metafieldError
          );
          metafields = [];
        }

        let referralId = null;
        if (Array.isArray(metafields)) {
          const referralMetafield = metafields.find(
            (m) => m.key === "referral_id"
          );
          referralId = referralMetafield ? referralMetafield.value : null;
        } else if (metafields && metafields.metafields) {
          const referralMetafield = metafields.metafields.find(
            (m) => m.key === "referral_id"
          );
          referralId = referralMetafield ? referralMetafield.value : null;
        }

        // Check various possible locations for referring_site
        let referringSite =
          order.referring_site ||
          order.landing_site ||
          order.source_name ||
          (order.note_attributes &&
            order.note_attributes.find((attr) => attr.name === "referring_site")
              ?.value) ||
          null;

        // If referringSite is a relative path, prepend the shop domain
        if (referringSite && referringSite.startsWith("/")) {
          referringSite = `https://${process.env.SHOP_DOMAIN}${referringSite}`;
        }

        // Extract UTM parameters
        let utmSource = order.source_name || null;
        let utmMedium = order.source || null;
        let utmCampaign = order.source_identifier || null;

        // If referringSite is a URL, try to extract UTM parameters
        if (referringSite) {
          try {
            const url = new URL(referringSite);
            utmSource = url.searchParams.get("utm_source") || utmSource;
            utmMedium = url.searchParams.get("utm_medium") || utmMedium;
            utmCampaign = url.searchParams.get("utm_campaign") || utmCampaign;
          } catch (e) {
            console.log("referringSite is not a valid URL:", referringSite);
          }
        }

        // Check for UTM parameters in note attributes
        if (order.note_attributes) {
          order.note_attributes.forEach((attr) => {
            if (attr.name === "utm_source") utmSource = attr.value || utmSource;
            if (attr.name === "utm_medium") utmMedium = attr.value || utmMedium;
            if (attr.name === "utm_campaign")
              utmCampaign = attr.value || utmCampaign;
          });
        }

        return {
          order_id: order.id,
          created_at: order.created_at,
          total_price: order.total_price,
          note_attributes: order.note_attributes || [],
          referring_site: referringSite,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          referral_id: referralId,
        };
      })
    );

    return res.json(ordersWithReferrals);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      error: "Error fetching orders",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};
