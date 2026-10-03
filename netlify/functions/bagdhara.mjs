import { getStore } from "@netlify/blobs";

const H = { "content-type": "application/json", "cache-control": "no-store" };
const J = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: H });

export default async (req) => {
  const store = getStore("bagdhara");
  if (req.method === "GET") {
    const d = await store.get("list", { type: "json" });
    return J(d || { text: "", updated: 0 });
  }
  if (req.method === "PUT") {
    const key = Netlify.env.get("ADMIN_KEY");
    if (!key || req.headers.get("x-admin-key") !== key) return J({ error: "unauthorized" }, 401);
    const { text } = await req.json();
    await store.setJSON("list", { text: String(text || "").slice(0, 500000), updated: Date.now() });
    return J({ ok: true });
  }
  return J({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/bagdhara" };
