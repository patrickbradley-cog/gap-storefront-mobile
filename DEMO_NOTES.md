# Demo notes (internal)

## The planted bug (branch `demo-start`)

`src/components/CheckoutForm.tsx` — the checkout content wrapper lost its mobile bottom padding
(`pb-[calc(env(safe-area-inset-bottom)+7rem)]` on `main`, gone on `demo-start`).

Below `md` widths the checkout page shows a **fixed order-summary bar** pinned to the bottom of the screen.
Without that padding the page can no longer scroll the **Place order** button above the bar, so at iPhone
sizes the bar sits on top of the button and taps land on the "View summary" toggle instead. Nothing is
submitted and no error is shown. On desktop the bar is hidden (`md:hidden`) and the sidebar summary is
used, so checkout works.

It looks like an ordinary spacing clean-up: a one-class CSS change, no comments, nothing in the README.

## What the tests do

| Command | Engine / device | On `demo-start` |
| --- | --- | --- |
| `npm run test:mobile` | WebKit, Playwright "iPhone 15" profile | **Fails** at the *Place order* step: `locator.click: Timeout … <div data-testid="checkout-summary-bar"> … subtree intercepts pointer events` |
| `npm run test:desktop` | Chromium, 1440×900 | Passes, order confirmed |
| `npm run test:ios` | Native "Gap Demo" app on an iPhone 15 simulator (Appium/XCUITest) | **Fails**: the tap hits the summary bar, no confirmation screen |

Every run writes a trace, video and step screenshots to `test-results/`. The fix is one class: restore the
bottom padding on the wrapper (see `main`).

## Demo script (CIO framing)

Every release, Devin checks checkout on mobile before your customers do. Here it runs the same Place-order
flow on an iPhone and on desktop, and the iPhone run fails because a routine CSS change left the order
button hidden under the summary bar, exactly the kind of mobile-only regression that quietly costs revenue.
Devin then diagnoses the failing step from the trace and video, restores the spacing, and re-runs both tests green.

## Running the demo

1. `git checkout demo-start && npm run db:setup && npm run dev`
2. `npm run test:all` → mobile red, desktop green. Open `npx playwright show-report` for the video.
3. Optional: `npm run ios:run` to show the native app, `npm run test:ios` for the on-device failure.
4. Fix: `git diff main -- src/components/CheckoutForm.tsx` shows the one-line change; re-run `npm run test:all`.
