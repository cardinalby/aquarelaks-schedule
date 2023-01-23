Small handy pet project for simplify looking for the swimming pool schedule from 
[https://ucsir.pl/plywalnie/aquarelaks/](https://ucsir.pl/plywalnie/aquarelaks/).
The project results in a web page that parses HTML page of the swimming pool, extracting links to PDFs
with schedule and joins them if needed.

`cloudflareWorker` dir contains JS Cloudflare Worker to bypass CORS while fetching the page and schedule pdfs.

`web` dir contains a front-end TS application