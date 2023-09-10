export class ProgressInfo {
    static attach(container: HTMLElement) {
        const div = document.createElement('div')
        container.appendChild(div)
        return new ProgressInfo(div)
    }

    private constructor(private container: HTMLElement) {
    }

    public addMessage(msg: string) {
        const el = document.createElement('h3')
        el.innerText = msg
        this.container.appendChild(el)
    }

    public addError(msg: string) {
        const el = document.createElement('h3')
        el.style.color = 'red'
        el.innerText = msg
        this.container.appendChild(el)
    }

    public addLink(text: string, url: string) {
        const anchorElement = document.createElement('a')
        anchorElement.innerText = text
        anchorElement.setAttribute('href', url)
        const p = document.createElement('p')
        p.appendChild(anchorElement)
        this.container.appendChild(p)
    }

    public detach() {
        this.container.remove()
    }
}