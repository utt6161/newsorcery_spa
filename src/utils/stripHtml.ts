export default function strip(html: string) {
    const text = new DOMParser().parseFromString(html, 'text/html');
    return text.body.textContent || '';
}
