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
export interface ScheduleLinksInfo {
    relevant: ScheduleLink[];
    totalCount: number;
}
export declare function getScheduleLinks(dom: Document, after: Date): Promise<ScheduleLinksInfo>;
export declare function rearrangeScheduleLinks<T extends ParsedScheduleLinkText>(links: T[], after: Date): T[];
export declare function deduceLinkRanges<T extends ParsedScheduleLinkText>(links: T[]): T[];
export declare function isRelevantLink(link: ParsedScheduleLinkText, startingFrom: Date): boolean;
export declare function sortScheduleLinks<T extends ParsedScheduleLinkText>(links: T[]): T[];
export declare function parseScheduleLinkText(text: string): ParsedScheduleLinkText;
export declare function extractScheduleLinks(dom: Document): RawScheduleLink[];
export declare function getPageDom(url: string): Promise<Document>;