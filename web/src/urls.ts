declare const CORS_PROXY_URL: string

export const AQUARELAKS_URL = "https://sport.um.warszawa.pl/waw/ucsir/pod-strzecha-3"

export const AQUARELAKS_LINKS_BASE_URL = "https://sport.um.warszawa.pl"

export function getProxiedUrl(destUrl: string) {
    return CORS_PROXY_URL + encodeURIComponent(destUrl)
}