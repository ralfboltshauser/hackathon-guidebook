import { NextResponse, type NextRequest } from "next/server";

const REALM = "GoodBoys Hackathon GuideBook";
const DEFAULT_USERNAME = "ralf";

type Credentials = {
  username: string;
  password: string;
};

function challenge() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

function unavailable() {
  return new NextResponse("Authentication is not configured.", {
    status: 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function parseBasicAuth(header: string | null): Credentials | null {
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice("Basic ".length).trim());
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
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

export async function proxy(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;

  if (!sitePassword) {
    return unavailable();
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));

  if (!credentials) {
    return challenge();
  }

  const siteUsername = process.env.SITE_USERNAME || DEFAULT_USERNAME;
  const [usernameMatches, passwordMatches] = await Promise.all([
    timingSafeEqual(credentials.username, siteUsername),
    timingSafeEqual(credentials.password, sitePassword),
  ]);

  if (!usernameMatches || !passwordMatches) {
    return challenge();
  }

  return NextResponse.next();
}
