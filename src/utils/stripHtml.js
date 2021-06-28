export default function strip(html) {
    const text = new DOMParser().parseFromString(html, 'text/html');
    return text.body.textContent || '';
}
