# Art shop and portfolio

Astro site (`web/`) plus a Sanity Studio (`studio/`) where the artist manages prints, stock, portfolio projects and orders.

```
studio/   Sanity Studio: schemas, desk layout. Hosted by Sanity (npm run deploy).
web/      Astro site: portfolio, shop, About. Hosted on Netlify.
```

## See the site now (no accounts needed)

```
cd web
cp .env.example .env     # leave SANITY_PROJECT_ID empty
npm install
npm run dev              # http://localhost:4321
```

With no Sanity project set, the site shows sample content (a banner says so). Delete `web/src/lib/demo.ts` and `web/public/demo/` once real content is in.

## Connect Sanity

1. Create a project at https://www.sanity.io/manage and note the project ID. Use a public dataset named `production`.
2. Studio: `cd studio && cp .env.example .env`, fill in `SANITY_STUDIO_PROJECT_ID`, then `npm install && npm run dev`.
3. Site: put the same ID in `web/.env` as `SANITY_PROJECT_ID`.
4. In the Studio, fill in Site settings first, then add a portfolio project and a print.

## Deploy

- Studio: `cd studio && npm run deploy` (pick a name, get `name.sanity.studio`).
- Site: import the repo in Netlify, set **Base directory** to `web`, and add `SANITY_PROJECT_ID` and `SANITY_DATASET` as environment variables.

## How prices and stock stay fresh

Pages render on request, with short edge caching (15 s for anything showing stock, 5 min for portfolio pages). Editing in the Studio shows up without a rebuild.

## Stripe Checkout (US only)

1. Create a Stripe account. Stay in **test mode** for now.
2. Dashboard > Developers > API keys: copy the secret key (`sk_test_...`) into `web/.env` as `STRIPE_SECRET_KEY`. A restricted key with only **Checkout Sessions: write** is safer than the full secret key.
3. Run the site, open a print, press Buy. Pay with card `4242 4242 4242 4242`, any future date, any CVC.
4. **Receipts:** Dashboard > Settings > Customer emails > turn on "Successful payments". Stripe does not send receipts in test mode; they start in live mode.
5. On Netlify add `STRIPE_SECRET_KEY` under Site configuration > Environment variables (mark it secret).

How it behaves:
- The price, stock and shipping charge are always read from Sanity at the moment of purchase, never from the browser.
- Shipping is US addresses only. The charge is **Site settings > Shipping charge** (0 = free).
- Stock is **not reserved** while someone is paying. If two people buy the last print at once, the second order is flagged for a manual refund.
- Sales tax is not collected. Ask an accountant, or look at Stripe Tax.

## Not built yet

- The Stripe webhook that lowers stock in Sanity and records orders, then the shipping email.
