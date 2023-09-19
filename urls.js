export const CORS_PROXY_URL = "https://aquarelaks.cardinalby.workers.dev/";
export const AQUARELAKS_URL = "https://sport.um.warszawa.pl/waw/ucsir/pod-strzecha-3";
export const AQUARELAKS_LINKS_BASE_URL = "https://sport.um.warszawa.pl";
export function getProxiedUrl(destUrl) {
    return CORS_PROXY_URL + encodeURIComponent(destUrl);
}
//# sourceMappingURL=urls.js.map