# Not Jev

![Not Jev mascot: a confidently clueless potato in a graduation cap holding a Magic 8 Ball](docs/assets/not-jev-logo.png)

**Not Jev** is a comedy decision API built as a Cloudflare Worker. It mirrors Jev's typed decision response style for the questions that deserve an emphatic answer, plus a Magic 8 Ball for when certainty would be irresponsible.

The API will be available at **[api.not-jev.dev](https://api.not-jev.dev)** and the API documentation site at **[not-jev.dev](https://not-jev.dev)** once deployment and DNS setup are complete.

## API

All endpoints accept `POST` requests and return a JSON envelope with a typed answer, zero token usage, and a readable `response`.

| Endpoint | Answer |
| --- | --- |
| `POST /no` | A `noul` value of `0` and the response `no` |
| `POST /yes` | A `noul` value of `1` and the response `yes` |
| `POST /fuck-no` | A `noul` value of `0` and the response `fuck no` |
| `POST /magic-8-ball` | A random classic Magic 8 Ball response as a `choice` |

For example:

```sh
curl -X POST https://api.not-jev.dev/fuck-no
```

```json
{
  "model": "no-as-a-service",
  "answers": {
    "answer": {
      "type": "noul",
      "noul": 0
    }
  },
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0
  },
  "response": "fuck no"
}
```

## Run locally

Install dependencies and start the local Worker:

```sh
npm install
npm run dev
```

The local API is served at `http://localhost:8787`. For example:

```sh
curl -X POST http://localhost:8787/no
```

## Deploy the API

Authenticate Wrangler with the Cloudflare account that owns `not-jev.dev`, then deploy:

```sh
npx wrangler login
npm run deploy
```

The Wrangler configuration attaches the Worker to `api.not-jev.dev` as a Cloudflare Worker custom domain.

## Deploy the documentation site

The static documentation lives in [`docs/`](docs/). The workflow at [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publishes it to GitHub Pages when changes reach `main`.

In the GitHub repository, select **Settings → Pages → GitHub Actions** as the publishing source and set the custom domain to `not-jev.dev`. In Cloudflare DNS, configure the GitHub Pages apex records as **DNS only**:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

Once GitHub verifies the custom domain and provisions HTTPS, enable **Enforce HTTPS** in Pages settings. The Pages workflow deploys the static site; the Worker is deployed separately with Wrangler.
