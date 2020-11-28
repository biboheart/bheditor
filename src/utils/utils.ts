export const keyCodes = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    DELETE: 46,
    META: 91,
};

export const mouseButtons = {
    LEFT: 0,
    WHEEL: 1,
    RIGHT: 2,
    BACKWARD: 3,
    FORWARD: 4,
};

export function isPrintableKey(keyCode: number): boolean {
    return (keyCode > 47 && keyCode < 58) || // number keys
      keyCode === 32 || keyCode === 13 || // Spacebar & return key(s)
      keyCode === 229 || // processing key input for certain languages — Chinese, Japanese, etc.
      (keyCode > 64 && keyCode < 91) || // letter keys
      (keyCode > 95 && keyCode < 112) || // Numpad keys
      (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
      (keyCode > 218 && keyCode < 223); // [\]' (in order)
}