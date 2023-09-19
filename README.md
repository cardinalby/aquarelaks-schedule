Small handy pet project to simplify looking for the swimming pool schedule from 
[https://sport.um.warszawa.pl/waw/ucsir/pod-strzecha-3](https://sport.um.warszawa.pl/waw/ucsir/pod-strzecha-3).

`cloudflareWorker` dir contains JS Cloudflare Worker to bypass CORS while fetching the page and schedule pdfs.

`web` dir contains a front-end TS application. You may find it useful as an example of parsing and building 
pdf files (lib-pdf) and rendering pdf on the page (pdfjs, it's needed because mobile Chrome browser 
doesn't show pdf but downloads it instead)