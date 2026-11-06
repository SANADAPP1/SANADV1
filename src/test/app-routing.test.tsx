import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches all core application pages without falling back to root or 404", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const coreRoutes = [
      { path: "/", expectedId: "/" },
      { path: "/about", expectedId: "/about" },
      { path: "/help", expectedId: "/help" },
      { path: "/login", expectedId: "/login" },
      { path: "/admin", expectedId: "/admin" },
    ];

    for (const { path, expectedId } of coreRoutes) {
      const matches = router.matchRoutes(path);
      const matchedRoute = matches.at(-1);
      expect(matchedRoute).toBeDefined();
      expect(matchedRoute?.routeId).not.toBe(rootRouteId);
      expect(matchedRoute?.routeId).toBe(expectedId);
    }
  });
});
