
// https://stackoverflow.com/a/67243723/4698166
const kebabizeCore = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase());

export function kebabizeAttributeName(s) {
    if (/[A-Z]/.test(s) && !s.includes('-')) {
        return kebabizeCore(s);
    }
    return s;
}
