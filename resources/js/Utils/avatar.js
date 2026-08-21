export function getAvatarUrl(avatar) {
    if (!avatar) return null;
    if (typeof avatar === 'string' && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:'))) {
        return avatar;
    }
    return `/storage/${avatar}`;
}
