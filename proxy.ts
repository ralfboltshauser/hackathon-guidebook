import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "goodboys_access";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const LOGIN_PATH = "/_auth";
const REQUEST_ACCESS_PATH = "/_request-access";
const REQUEST_ACCESS_TOPIC =
  "https://ntfy.services.ralfbuilds.com/prod-hackathon-guidebook";
const ROBOTS_HEADER = "noindex, nofollow, noarchive, noimageindex, nosnippet";

function unavailable() {
  return new NextResponse("Authentication is not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": ROBOTS_HEADER,
    },
  });
}

function htmlResponse(html: string, status = 401) {
  return new NextResponse(html, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": ROBOTS_HEADER,
    },
  });
}

function lockedPage(
  nextPath: string,
  state: {
    passwordError?: boolean;
    requestSuccess?: boolean;
    requestError?: string;
    email?: string;
  } = {},
) {
  const cleanNext = escapeHtml(nextPath);
  const cleanEmail = escapeHtml(state.email ?? "");
  const requestMessage = state.requestSuccess
    ? '<p class="notice success">Access request sent.</p>'
    : state.requestError
      ? `<p class="notice error">${escapeHtml(state.requestError)}</p>`
      : "";

  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive, noimageindex, nosnippet" />
    <title>Hackathon Guidebook</title>
    <style>
      :root {
        color-scheme: light;
        --paper: #f6f1e7;
        --paper-deep: #efe7d6;
        --ink: #241c12;
        --ink-soft: rgba(36, 28, 18, 0.82);
        --muted: rgba(36, 28, 18, 0.62);
        --line: rgba(36, 28, 18, 0.16);
        --line-strong: rgba(36, 28, 18, 0.24);
        --accent: #b4530a;
        --gold: #d6a94f;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        background: var(--paper);
        color: var(--ink);
        font-family: Atkinson Hyperlegible, Arial, Helvetica, sans-serif;
      }
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(36, 28, 18, 0.04) 1px, transparent 1px),
          linear-gradient(rgba(36, 28, 18, 0.035) 1px, transparent 1px);
        background-size: 44px 44px;
        mask-image: linear-gradient(to bottom, black, transparent 70%);
      }
      .page {
        position: relative;
        width: min(100%, 1240px);
        margin: 0 auto;
        padding: 22px 18px 48px;
      }
      header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 18px;
        border-bottom: 1px solid var(--line);
        padding-bottom: 18px;
      }
      .brand {
        color: #8a6d3b;
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }
      .byline {
        color: rgba(36, 28, 18, 0.48);
        font-size: 12px;
      }
      .byline a {
        color: var(--accent);
        text-decoration: none;
      }
      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1.12fr) minmax(340px, 0.72fr);
        gap: clamp(28px, 5vw, 76px);
        align-items: end;
        border-bottom: 1px solid var(--line);
        padding: clamp(48px, 8vw, 96px) 0 clamp(34px, 6vw, 68px);
      }
      .kicker {
        margin: 0 0 22px;
        color: var(--accent);
        font-size: 12px;
        letter-spacing: 0.34em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 780px;
        margin: 0;
        font-size: clamp(54px, 9vw, 116px);
        font-weight: 400;
        letter-spacing: 0;
        line-height: 0.88;
      }
      .lead {
        max-width: 650px;
        margin: 30px 0 0;
        color: var(--ink-soft);
        font-size: clamp(19px, 2.4vw, 30px);
        line-height: 1.18;
      }
      .proof {
        display: grid;
        gap: 1px;
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 10px;
        background: var(--line);
        box-shadow: 0 18px 56px rgba(36, 28, 18, 0.09);
      }
      .proof-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 18px;
        align-items: baseline;
        background: rgba(255, 255, 255, 0.38);
        padding: 16px 18px;
      }
      .proof-row span:first-child {
        font-size: 16px;
      }
      .proof-row span:last-child {
        color: var(--accent);
        font-size: 11px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        white-space: nowrap;
      }
      .gate {
        display: grid;
        grid-template-columns: minmax(0, 0.84fr) minmax(340px, 0.62fr);
        gap: clamp(22px, 5vw, 64px);
        align-items: start;
        padding-top: clamp(34px, 5vw, 58px);
      }
      .gate-copy {
        border-left: 2px solid var(--accent);
        padding: 4px 0 6px 24px;
      }
      .gate-copy h2 {
        margin: 0;
        font-size: clamp(30px, 5vw, 58px);
        font-weight: 400;
        line-height: 0.98;
      }
      .gate-copy p {
        max-width: 560px;
        margin: 18px 0 0;
        color: var(--muted);
        font-size: 16px;
        line-height: 1.6;
      }
      main {
        display: grid;
        gap: 14px;
      }
      .panel {
        border: 1px solid var(--line);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.34);
        padding: 22px;
        box-shadow: 0 18px 48px rgba(36, 28, 18, 0.08);
      }
      .panel h3 {
        margin: 0;
        font-size: 24px;
        font-weight: 400;
      }
      .panel p {
        margin: 8px 0 18px;
        color: var(--muted);
        font-size: 14px;
        line-height: 1.5;
      }
      label {
        display: block;
        margin-bottom: 8px;
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      input {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.58);
        color: var(--ink);
        font: inherit;
        padding: 13px 14px;
        outline: none;
      }
      input:focus {
        border-color: rgba(180, 83, 10, 0.72);
        box-shadow: 0 0 0 3px rgba(180, 83, 10, 0.12);
      }
      .row {
        display: grid;
        gap: 10px;
      }
      button {
        width: 100%;
        margin-top: 14px;
        border: 0;
        border-radius: 7px;
        background: var(--ink);
        color: var(--paper);
        cursor: pointer;
        font: inherit;
        padding: 13px 16px;
      }
      .secondary {
        border: 1px solid var(--line-strong);
        background: transparent;
        color: var(--ink);
      }
      .notice {
        margin: 12px 0 0;
        font-size: 13px;
      }
      .error { color: var(--accent); }
      .success { color: #517238; }
      @media (max-width: 860px) {
        .hero,
        .gate {
          grid-template-columns: 1fr;
        }
        header {
          align-items: flex-start;
          flex-direction: column;
        }
        .proof {
          max-width: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <header>
        <div class="brand">Hackathon Guidebook</div>
        <div class="byline">by <a href="https://www.linkedin.com/in/ralfboltshauser/">Ralf Boltshauser</a></div>
      </header>

      <section class="hero">
        <div>
          <p class="kicker">The hackathon playbook</p>
          <h1>Everything we learned winning hackathons.</h1>
          <p class="lead">A private guidebook for serious teams: how to prepare, read the room, build the right thing, and pitch under pressure.</p>
        </div>
        <div class="proof" aria-label="Track record">
          <div class="proof-row"><span>Start Hack · Syngenta</span><span>Winner</span></div>
          <div class="proof-row"><span>Moin Hack</span><span>Second Place</span></div>
          <div class="proof-row"><span>ETH AI Hack</span><span>Second Place</span></div>
          <div class="proof-row"><span>BaselHack</span><span>2x Winner</span></div>
          <div class="proof-row"><span>ETH Agentic Systems Hack</span><span>Winner</span></div>
          <div class="proof-row"><span>IBM Bobathon</span><span>Winner</span></div>
        </div>
      </section>

      <section class="gate">
        <div class="gate-copy">
          <h2>Unlock the guidebook.</h2>
          <p>The public overview ends here. The full operating system, phase notes, checklists, and proof assets are password protected.</p>
        </div>

        <main>
          <section class="panel">
            <h3>Enter password</h3>
            <p>If you already have access, unlock the full guidebook.</p>
            <form method="post" action="${LOGIN_PATH}">
              <input type="hidden" name="next" value="${cleanNext}" />
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" autofocus required />
              <button type="submit">Unlock guidebook</button>
              ${state.passwordError ? '<p class="notice error">Wrong password.</p>' : ""}
            </form>
          </section>

          <section class="panel">
            <h3>Request access</h3>
            <p>Leave your email and we will get back to you.</p>
            <form method="post" action="${REQUEST_ACCESS_PATH}">
              <input type="hidden" name="next" value="${cleanNext}" />
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" value="${cleanEmail}" placeholder="you@example.com" required />
              <button class="secondary" type="submit">Request access</button>
              ${requestMessage}
            </form>
          </section>
        </main>
      </section>
    </div>
  </body>
</html>`);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function digest(value: string) {
  return new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  );
}

async function timingSafeEqual(left: string, right: string) {
  const [leftDigest, rightDigest] = await Promise.all([
    digest(left),
    digest(right),
  ]);
  let diff = leftDigest.length ^ rightDigest.length;

  for (let i = 0; i < Math.max(leftDigest.length, rightDigest.length); i += 1) {
    diff |= (leftDigest[i] ?? 0) ^ (rightDigest[i] ?? 0);
  }

  return diff === 0;
}

async function hmac(message: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function createSessionValue(sitePassword: string) {
  const expiresAt = Date.now() + COOKIE_MAX_AGE_SECONDS * 1000;
  const signature = await hmac(String(expiresAt), sitePassword);

  return `${expiresAt}.${signature}`;
}

async function isValidSession(cookieValue: string | undefined, sitePassword: string) {
  if (!cookieValue) {
    return false;
  }

  const [expiresAt, signature] = cookieValue.split(".");
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) {
    return false;
  }

  const expectedSignature = await hmac(expiresAt, sitePassword);
  return timingSafeEqual(signature, expectedSignature);
}

function cleanNextPath(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

async function sendAccessRequest(email: string, request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  const response = await fetch(REQUEST_ACCESS_TOPIC, {
    method: "POST",
    headers: {
      Title: "Hackathon Guidebook access request",
      Tags: "key,email",
      Priority: "default",
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: [
      "New access request for Hackathon Guidebook.",
      `Email: ${email}`,
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
    ].join("\n"),
  });

  if (!response.ok) {
    throw new Error(`ntfy request failed: ${response.status}`);
  }
}

function withRobotsHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", ROBOTS_HEADER);
  return response;
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/robots.txt") {
    return withRobotsHeader(NextResponse.next());
  }

  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return unavailable();
  }

  if (request.nextUrl.pathname === REQUEST_ACCESS_PATH) {
    if (request.method !== "POST") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const form = await request.formData();
    const email = String(form.get("email") || "").trim();
    const nextPath = cleanNextPath(form.get("next"), "/");

    if (!isValidEmail(email)) {
      return lockedPage(nextPath, {
        email,
        requestError: "Enter a valid email address.",
      });
    }

    try {
      await sendAccessRequest(email, request);
      return lockedPage(nextPath, { email, requestSuccess: true });
    } catch {
      return lockedPage(nextPath, {
        email,
        requestError: "Could not send the request. Please try again.",
      });
    }
  }

  if (request.nextUrl.pathname === LOGIN_PATH) {
    if (request.method !== "POST") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const form = await request.formData();
    const password = form.get("password");
    const nextPath = cleanNextPath(form.get("next"), "/");

    if (
      typeof password !== "string" ||
      !(await timingSafeEqual(password, sitePassword))
    ) {
      return lockedPage(nextPath, { passwordError: true });
    }

    const response = NextResponse.redirect(new URL(nextPath, request.url), 303);
    const isSecureRequest =
      request.nextUrl.protocol === "https:" ||
      request.headers.get("x-forwarded-proto") === "https";
    response.cookies.set(AUTH_COOKIE, await createSessionValue(sitePassword), {
      httpOnly: true,
      secure: isSecureRequest,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE_SECONDS,
    });
    return withRobotsHeader(response);
  }

  const isAuthenticated = await isValidSession(
    request.cookies.get(AUTH_COOKIE)?.value,
    sitePassword,
  );

  if (!isAuthenticated) {
    return lockedPage(`${request.nextUrl.pathname}${request.nextUrl.search}`);
  }

  return withRobotsHeader(NextResponse.next());
}
