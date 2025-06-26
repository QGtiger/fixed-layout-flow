export function excuteScriptByValidateRules(script: string, value: any, formValues: any): [boolean, string?] {
  return new Function(
    'value',
    'formValues',
    `
    try {
      ${script}
      main(value, formValues)
      return [true]
    } catch (e) {
      return [false, e.message]
    }
  `,
  )(value, formValues);
}
