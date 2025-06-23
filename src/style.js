import { kebabizeAttributeName } from "./kebabize";

export function createStyle(styleObj) {
    const style = document.createElement('style');

    var indentSize = 0;
    var styleCss = "";

    const getIndent = () => Array(indentSize).fill(" ").join("");
    const runObject = obj => {
        for (const [prop, value] of Object.entries(obj)) {
            
            if (typeof value === 'string') {
                styleCss += getIndent() + kebabizeAttributeName(prop) + ": " + value + ";\n";

            } else if (typeof value === 'object') {
                styleCss += getIndent() + prop + " {\n";
                indentSize++;
                runObject(value);
                indentSize--;
                styleCss += getIndent() + "}\n";
            }
        }
    }

    runObject(styleObj);
    style.textContent = styleCss;
    return style;
}