export function createSlug(title: string, ID: number) {
    let titl = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[-\s]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${titl}--${ID}`
}