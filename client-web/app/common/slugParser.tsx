export function createSlug(company: string, title: string, ID: number) {
    if (company && title) {
        let com = company
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-')
            .replace(/^-+|-+$/g, '');

        let ttl = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `${com}-${ttl}`
    } else if (title && ID) {
        let ttl = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[-\s]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return `${ttl}--${ID}`
    }
}