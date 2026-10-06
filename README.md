# Not Jev

![Not Jev mascot: a confidently clueless potato in a graduation cap holding a Magic 8 Ball](docs/assets/not-jev-logo.png)

**Not Jev** is a comedy decision API built as a Cloudflare Worker, with a static documentation site for the questions that deserve an emphatic answer, plus a Magic 8 Ball for when certainty would be irresponsible. Source code: [jimbobbennett/not-jev](https://github.com/jimbobbennett/not-jev).

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
  "model": "not-jev",
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

## Host the documentation site on Cloudflare Pages

The static documentation lives in [`docs/`](docs/). Create a Cloudflare Pages project connected to this GitHub repository and configure it to publish the `docs/` directory. This is a static site, so no build command is needed. Add `not-jev.dev` as the Pages custom domain and follow the Cloudflare dashboard prompts to activate DNS and HTTPS.

The Worker remains a separate deployment, attached to `api.not-jev.dev` by Wrangler. Keep the Pages custom domain on `not-jev.dev` and the API custom domain on `api.not-jev.dev`.
