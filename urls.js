export const AQUARELAKS_URL = "https://sport.um.warszawa.pl/waw/ucsir/grafik-dostepnosci-torow-aqua-relaks";
export const AQUARELAKS_LINKS_BASE_URL = "https://sport.um.warszawa.pl";
export function getProxiedUrl(destUrl) {
    return CORS_PROXY_URL + encodeURIComponent(destUrl);
}
//# sourceMappingURL=urls.js.map