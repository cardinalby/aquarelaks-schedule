export class ProgressInfo {
    static attach(container) {
        const div = document.createElement('div');
        container.appendChild(div);
        return new ProgressInfo(div);
    }
    constructor(container) {
        this.container = container;
    }
    addMessage(msg) {
        const el = document.createElement('h3');
        el.innerText = msg;
        this.container.appendChild(el);
    }
    addError(msg) {
        const el = document.createElement('h3');
        el.style.color = 'red';
        el.innerText = msg;
        this.container.appendChild(el);
    }
    detach() {
        this.container.remove();
    }
}
//# sourceMappingURL=progressInfo.js.map