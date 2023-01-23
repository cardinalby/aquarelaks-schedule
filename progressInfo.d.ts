export declare class ProgressInfo {
    private container;
    static attach(container: HTMLElement): ProgressInfo;
    private constructor();
    addMessage(msg: string): void;
    addError(msg: string): void;
    detach(): void;
}
