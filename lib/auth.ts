import type { Href } from "expo-router";

export function finalizeAndNavigate(router: { push: (href: Href) => void }, path = "/") {
  return ({ decorateUrl }: { decorateUrl: (url: string) => string }) => {
    const url = decorateUrl(path);
    router.push(url as Href);
  };
}
