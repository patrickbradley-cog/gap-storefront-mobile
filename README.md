# Gap Storefront Mobile (demo)

**Demo app, not affiliated with Gap.** A mobile-first storefront modeled on the Gap mobile shopping experience, built as an internal sales demo. Fake products, fake payments, generated artwork.

- Next.js 15 (App Router) + TypeScript + Tailwind, designed for an iPhone 15 viewport (393×852), responsive on desktop
- API routes backed by Postgres; **all SQL lives in `src/server/`** (`db/` for schema + seed, `repositories/` for data access) so the frontend never touches the database directly
- ~30 seeded products across Women, Men, Boys, Girls and Baby, plus promo codes `GAPDEMO20`, `FREESHIP`, `WELCOME10`
- Optional native iOS shell (Capacitor) so the store runs as a real app on an iPhone simulator

## Run it

Docker (one command, app + database + seed):

```sh
docker compose up --build
# open http://localhost:3000
```

Local dev (Postgres in Docker, Next.js with hot reload):

```sh
npm install
npm run db:setup    # docker compose up -d db && seed 30 products
npm run dev         # http://localhost:3000
```

Have your own Postgres? Set `DATABASE_URL` (see `.env.example`) and run `npm run db:seed`.

## Run the tests

Playwright drives the full checkout (home → product → add to bag → bag → checkout → place order) and saves a trace, video and step screenshots for every run under `test-results/`.

```sh
npx playwright install webkit chromium   # first time only
npm run test:mobile     # WebKit, "iPhone 15" device profile
npm run test:desktop    # desktop Chromium, 1440×900
npm run test:all        # both
npx playwright show-report
```

The tests start `npm run dev` automatically, or target a running server with `BASE_URL=http://localhost:3000`.

## Run it as an iPhone app

The `ios/` folder is a Capacitor shell: a native "Gap Demo" app with its own icon that loads the storefront full screen in a WKWebView (no browser chrome). Requires Xcode.

```sh
npm run dev                 # the app loads http://localhost:3000 from the simulator
npm run ios:build           # xcodebuild for the simulator → ios/build
npm run ios:run             # boot an iPhone 15 simulator, install and launch the app
npm run test:ios            # Appium/XCUITest checkout flow in the app, with a screen recording
```

`test:ios` needs Appium with the XCUITest driver (`npm i -g appium && appium driver install xcuitest`). The recording is written to `test-results/ios/`.

## Project layout

```
src/app/            pages + API routes (App Router)
src/components/     UI
src/lib/            cart state, pricing, formatting (client-safe)
src/server/db/      schema.sql, seed data, pg client   ← SQL lives here
src/server/repositories/  data-access layer used by API routes and pages
tests/e2e/          Playwright checkout flow
tests/ios/          Appium checkout flow for the native shell
ios/                Capacitor Xcode project
```
