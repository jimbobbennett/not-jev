# Not Jev

![Not Jev mascot: a confidently clueless potato in a graduation cap holding a Magic 8 Ball](docs/assets/not-jev-logo.png)

[![Documentation](https://img.shields.io/badge/docs-not--jev.dev-EE5948?style=for-the-badge)](https://not-jev.dev)
[![API](https://img.shields.io/badge/API-api.not--jev.dev-262832?style=for-the-badge)](https://api.not-jev.dev)

The API and documentation site are served by one Cloudflare Worker deployment.

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
