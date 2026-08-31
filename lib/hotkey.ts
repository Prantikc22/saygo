export type HotkeySetting = {
  accelerator: string;
  label: string;
  code: string;
  primary: boolean;
  control: boolean;
  alt: boolean;
  shift: boolean;
};

export const HOTKEY_STORAGE_KEY = 'saygo-hotkey';

export function isMacPlatform() {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
}

export function defaultHotkey(): HotkeySetting {
  return {
    accelerator: 'CommandOrControl+Shift+Space',
    label: isMacPlatform() ? '⌘ ⇧ Space' : 'Ctrl + Shift + Space',
    code: 'Space',
    primary: true,
    control: false,
    alt: false,
    shift: true,
  };
}

function keyName(event: KeyboardEvent) {
  if (event.code === 'Space') return { accelerator: 'Space', label: 'Space' };
  if (event.code.startsWith('Key')) return { accelerator: event.code.slice(3), label: event.code.slice(3) };
  if (event.code.startsWith('Digit')) return { accelerator: event.code.slice(5), label: event.code.slice(5) };
  if (/^F\d{1,2}$/.test(event.code)) return { accelerator: event.code, label: event.code };
  const known: Record<string, string> = {
    ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
    Enter: 'Enter', Escape: 'Escape', Tab: 'Tab', Backspace: 'Backspace',
    Delete: 'Delete', Home: 'Home', End: 'End', PageUp: 'PageUp', PageDown: 'PageDown',
    Comma: ',', Period: '.', Slash: '/', Semicolon: ';', Quote: "'",
    BracketLeft: '[', BracketRight: ']', Backslash: '\\', Minus: '-', Equal: '=', Backquote: '`',
  };
  const value = known[event.code];
  return value ? { accelerator: value, label: value } : null;
}

export function hotkeyFromEvent(event: KeyboardEvent): HotkeySetting | null {
  const key = keyName(event);
  if (!key) return null;
  const mac = isMacPlatform();
  const primary = mac ? event.metaKey : event.ctrlKey;
  const control = mac && event.ctrlKey;
  if (!primary && !control && !event.altKey) return null;

  const accelerator = [
    primary ? 'CommandOrControl' : '',
    control ? 'Control' : '',
    event.altKey ? 'Alt' : '',
    event.shiftKey ? 'Shift' : '',
    key.accelerator,
  ].filter(Boolean).join('+');
  const label = [
    primary ? (mac ? '⌘' : 'Ctrl') : '',
    control ? '⌃' : '',
    event.altKey ? (mac ? '⌥' : 'Alt') : '',
    event.shiftKey ? (mac ? '⇧' : 'Shift') : '',
    key.label,
  ].filter(Boolean).join(mac ? ' ' : ' + ');

  return { accelerator, label, code: event.code, primary, control, alt: event.altKey, shift: event.shiftKey };
}

export function eventMatchesHotkey(event: KeyboardEvent, hotkey: HotkeySetting) {
  const primaryPressed = isMacPlatform() ? event.metaKey : event.ctrlKey;
  return event.code === hotkey.code
    && primaryPressed === hotkey.primary
    && (!isMacPlatform() || event.ctrlKey === hotkey.control)
    && event.altKey === hotkey.alt
    && event.shiftKey === hotkey.shift;
}
