export const generateDeviceFingerprint = (): string => {
    const fingerprint = [
        navigator.userAgent.substring(0, 100),
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || '0',
        (navigator as any).deviceMemory || '0',
        window.devicePixelRatio || '1'
    ].join('|');

    let hash = 0;

    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char; hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};