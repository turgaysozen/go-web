export function createSlug(desc: string, title: string) {
    let description = desc
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

    if (title.trim() === '') {
        return description
    }

    let titl = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[-\s]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${description}--${titl}`
}