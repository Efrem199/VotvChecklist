// Parser messages remain language-neutral at the boundary; translate known
// messages for display without changing validation or the original error.
const messages: Record<string, string> = {
 'Файл больше 64 МБ.': 'The file is larger than 64 MB.',
 'Файл обрезан или содержит неверный размер.': 'The file is truncated or contains an invalid size.',
 'Слишком длинная строка в файле.': 'A string in the file is too long.',
 'Некорректная строка GVAS.': 'Invalid GVAS string.',
 'Заголовок GVAS не распознан.': 'GVAS header not recognized.',
 'Некорректная таблица версий.': 'Invalid version table.',
 'Некорректный тег свойства.': 'Invalid property tag.',
 'Неизвестное представление BoolProperty.': 'Unknown BoolProperty representation.',
 'Неизвестный формат GUID.': 'Unknown GUID format.',
 'Слишком много свойств.': 'Too many properties.',
 'Неизвестная структура флагов достижений.': 'Unknown achievement flag structure.',
 'Списки имён и флагов достижений не совпадают.': 'Achievement name and flag lists do not match.',
 'Пустой идентификатор достижения.': 'Empty achievement ID.',
 'Некорректный флаг достижения.': 'Invalid achievement flag.',
 'Неожиданное содержимое списка достижений.': 'Unexpected achievement list contents.',
 'Файл слишком мал или больше 64 МБ.': 'The file is too small or exceeds 64 MB.',
 'Это не файл GVAS.': 'This is not a GVAS file.',
 'Неподдерживаемая версия формата GVAS.': 'Unsupported GVAS format version.',
 'Неизвестный тип сохранения VotV.': 'Unknown VotV save type.',
 'Неожиданные данные в конце файла.': 'Unexpected data at the end of the file.',
 'Версия игры в файле не найдена.': 'Game version not found in the file.',
 'Поддерживаемых полей не найдено.': 'No supported fields found.',
 'Неизвестное поле изменения.': 'Unknown edited field.',
 'Некорректное логическое значение.': 'Invalid boolean value.',
 'Не удалось прочитать файл.': 'Could not read the file.',
 'Не удалось собрать файл.': 'Could not generate the file.',
};
export function englishSaveError(message: string): string {
 if (messages[message]) return messages[message];
 const patterns: [RegExp, (value: string) => string][] = [
  [/^Неизвестный тип свойства: (.+)$/, v => `Unknown property type: ${v}`],
  [/^Повторяется свойство (.+); редактирование отключено\.$/, v => `Property ${v} is duplicated; editing is disabled.`],
  [/^Некорректное значение (.+)\.$/, v => `Invalid value ${v}.`],
  [/^Неожиданный тип (.+)\.$/, v => `Unexpected type for ${v}.`],
  [/^Неожиданный формат (.+)\.$/, v => `Unexpected format for ${v}.`],
  [/^Некорректная структура (.+)\.$/, v => `Invalid structure ${v}.`],
  [/^Повторяется (.+)\.$/, v => `Duplicate ${v}.`],
  [/^Недопустимое значение (.+)\.$/, v => `Invalid value ${v}.`],
  [/^Версия (.+) не поддерживается: только семейство 0\.9\.0 \(0\.9\.0n не отличима от других патчей по этому полю\)\.$/, v => `Version ${v === 'неизвестна' ? 'unknown' : v} is unsupported: only the 0.9.0 family is supported (this field does not distinguish 0.9.0n from other patches).`],
 ];
 for (const [pattern, format] of patterns) { const match = pattern.exec(message); if (match) return format(match[1]); }
 return `Could not process the file. Details (Russian): ${message}`;
}
