export interface RawScheduleLink {
    url: string;
    text: string;
}
export interface ParsedScheduleLinkText {
    fromDate: Date | null;
    toDate: Date | null;
}
export interface ScheduleLink extends ParsedScheduleLinkText {
    url: string;
}
export declare function getScheduleLinks(dom: Document, after?: Date): Promise<ScheduleLink[]>;
export declare function isRelevantLink(link: ParsedScheduleLinkText, startingFrom: Date): boolean;
export declare function sortScheduleLinks<T extends ParsedScheduleLinkText>(links: T[]): T[];
export declare function parseScheduleLinkText(text: string): ParsedScheduleLinkText;
export declare function extractScheduleLinks(dom: Document): RawScheduleLink[];
export declare function getPageDom(url: string): Promise<Document>;
