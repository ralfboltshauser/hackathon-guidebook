import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE = "goodboys_access";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const LOGIN_PATH = "/_auth";
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

function loginPage(nextPath: string, hasError = false) {
  return htmlResponse(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow, noarchive, noimageindex, nosnippet" />
    <title>Good Boys Hackathon Guide</title>
    <style>
      :root {
        color-scheme: light;
        --paper: #f6f1e7;
        --ink: #241c12;
        --muted: rgba(36, 28, 18, 0.62);
        --line: rgba(36, 28, 18, 0.16);
        --accent: #b4530a;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: var(--paper);
        color: var(--ink);
        font-family: Atkinson Hyperlegible, Arial, Helvetica, sans-serif;
      }
      main {
        width: min(100% - 32px, 420px);
        border: 1px solid var(--line);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.34);
        padding: 28px;
        box-shadow: 0 18px 48px rgba(36, 28, 18, 0.08);
      }
      p.kicker {
        margin: 0 0 18px;
        color: var(--accent);
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(32px, 9vw, 54px);
        font-weight: 400;
        line-height: 0.95;
      }
      p.copy {
        margin: 18px 0 24px;
        color: var(--muted);
        font-size: 15px;
        line-height: 1.6;
      }
      label {
        display: block;
        margin-bottom: 8px;
        color: var(--muted);
        font-size: 12px;
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
      .error {
        margin: 12px 0 0;
        color: var(--accent);
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="kicker">Private guide</p>
      <h1>Good Boys Hackathon Guide</h1>
      <p class="copy">Enter the password to open the guidebook.</p>
      <form method="post" action="${LOGIN_PATH}">
        <input type="hidden" name="next" value="${escapeHtml(nextPath)}" />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" autofocus required />
        <button type="submit">Open guide</button>
        ${hasError ? '<p class="error">Wrong password.</p>' : ""}
      </form>
    </main>
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
      return loginPage(nextPath, true);
    }

    const response = NextResponse.redirect(new URL(nextPath, request.url));
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
    return loginPage(`${request.nextUrl.pathname}${request.nextUrl.search}`);
  }

  return withRobotsHeader(NextResponse.next());
}
