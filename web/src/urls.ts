export const CORS_PROXY_URL = "https://aquarelaks.cardinalby.workers.dev/"
export const AQUARELAKS_URL = "https://ucsir.pl/plywalnie/aquarelaks/"

export function getProxiedUrl(destUrl: string) {
    return CORS_PROXY_URL + encodeURIComponent(destUrl)
}