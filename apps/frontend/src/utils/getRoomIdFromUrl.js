export function getRoomIdFromUrl() {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('room');
}