const ALLOWED_ORIGINS = [
	'.*'
];
const ALLOWED_DESTINATIONS = [
	"https://sport.um.warszawa.pl/.*?"
];

function isListed(uri, listing) {
	for (let item of listing) {
		if (uri.match(item)) {
			return true
		}
	}
	return false
}

export default {
	async fetch(request) {
		let requestUrl = decodeURIComponent((new URL(request.url)).pathname.substring(1))
		const originHeader = request.headers.get("Origin")
		if (!isListed(requestUrl, ALLOWED_DESTINATIONS) ||
			(originHeader && !isListed(originHeader, ALLOWED_ORIGINS))
		) {
			return new Response("Not allowed", {status: 403})
		}

		request = new Request(requestUrl, request)
		if (request.headers.has('origin')) {
			request.headers.delete('origin')
		}
		if (request.headers.has('referer')) {
			request.headers.delete('referer')
		}
		let response = await fetch(request)
		response = new Response(response.body, response)
		response.headers.set('access-control-allow-origin', '*')
		response.headers.set('access-control-allow-headers', '*')
		return response
	},
};
