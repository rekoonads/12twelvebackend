import { shopify } from "../index.js";

export const handleOrderWebhook = async (req, res) => {
  try {
    const order = req.body;
    let referralId = null;

    if (order.landing_site) {
      const landingSiteUrl = new URL(
        order.landing_site.startsWith("http")
          ? order.landing_site
          : `https://www.taare.shop${order.landing_site}`
      );

      const utmSource = landingSiteUrl.searchParams.get("utm_source");
      const utmMedium = landingSiteUrl.searchParams.get("utm_medium");
      const utmCampaign = landingSiteUrl.searchParams.get("utm_campaign");

      if (
        utmSource === "my12twelve" &&
        utmMedium === "affiliate" &&
        utmCampaign
      ) {
        referralId = utmCampaign;
      }
    }

    if (referralId) {
      await shopify.rest.Order.update({
        session: {
          accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
          shop: "www.taare.shop",
        },
        id: order.id,
        metafields: [
          {
            key: "referral_id",
            value: referralId,
            type: "single_line_text_field",
            namespace: "custom",
          },
        ],
      });

      console.log(`Updated order ${order.id} with referral ID ${referralId}`);
    } else {
      console.log(`No referral ID found for order ${order.id}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error processing order webhook:", error);
    res.sendStatus(500);
  }
};
