// adapted from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
export function debounce(func: Function, wait: number, immediate = false) {
    let timeout: number | undefined;
    return function (this: any, ...args: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            if (!immediate) func.apply(this, args);
        }, wait);
        if (immediate && !timeout) func.apply(this, args);
    };
}