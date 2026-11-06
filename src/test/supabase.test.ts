import { describe, expect, it } from "vitest";
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "../lib/supabase";

describe("Supabase Client Configuration", () => {
  it("initializes supabase client with correct project URL and publishable key", () => {
    expect(SUPABASE_URL).toBe("https://msqwsimmlupusdbfwtxq.supabase.co");
    expect(SUPABASE_ANON_KEY).toContain("sb_publishable_");
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.from).toBe("function");
  });

  it("never contains secret keys in frontend-facing environment variables", () => {
    expect(SUPABASE_ANON_KEY).not.toContain("sb_secret_");
  });
});
