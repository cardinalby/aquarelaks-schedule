declare const CORS_PROXY_URL: string

export const URLS: Record<string, string> = {
    aquarelaks: 'https://sport.um.warszawa.pl/waw/ucsir/grafik-dostepnosci-torow-aqua-relaks',
    hirszfelda: 'https://sport.um.warszawa.pl/waw/ucsir/grafik-dostepnosci-torow-hirszfelda',
    koncertowa: 'https://sport.um.warszawa.pl/waw/ucsir/grafik-dostepnosci-zos-koncertowa',
}

export const SPORT_UM_LINKS_BASE_URL = "https://sport.um.warszawa.pl"

export function getSchedulePageUrl() {
    let hash = location.hash
    if (hash.startsWith('#')) {
       hash = hash.substring(1)
    }
    for (const key in URLS) {
        if (key === hash) {
            return URLS[key]
        }
    }
    return URLS.aquarelaks
}

export function getProxiedUrl(destUrl: string) {
    return CORS_PROXY_URL + encodeURIComponent(destUrl)
}