import { shopify } from "../index.js";

export const handleOrderWebhook = async (req, res) => {
  const order = req.body;
  let referralId = null;

  // Check for UTM parameters in order's landing_site
  if (order.landing_site) {
    const landingSiteUrl = new URL(order.landing_site);
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
    try {
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
    } catch (error) {
      console.error("Error updating order:", error);
    }
  }

  res.sendStatus(200);
};
