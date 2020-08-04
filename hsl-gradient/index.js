function formatText(text) {
    let output = "";
    let nextCharIsFormat = false;
    let isFormatted = false;
    let spanCount = 0;
    for (var x = 0; x < text.length; x++) {
        if (nextCharIsFormat) { 
            if (text[x] == "r") { // reset
                output += "</span>".repeat(spanCount);
                spanCount = 0;
            } 
            else if (text[x] == "l") { // bold
                output += `<span class="mc-bold">`;
                isFormatted = true;
                spanCount++;
            } 
            else if (text[x] == "o") { // italic
                output += `<span style="font-style:italic">`;
                isFormatted = true;
                spanCount++;
            } 
            else if (text[x] == "n") { // underline
                output += `<span style="text-decoration: underline">`;
                isFormatted = true;
                spanCount++;
            } 
            else if (text[x] == "m") { // strikethrough
                output += `<span style="text-decoration: line-through">`;
                isFormatted = true;
                spanCount++;
            } 
            else if (text[x] == "k") { // obfuscated
                output += `<span style="background:black">`;
                isFormatted = true;
                spanCount++;
            } 
            else { // colour
                if (isFormatted) {
                    output += "</span>".repeat(spanCount);
                spanCount = 0;
                }
                output += `<span style="color:var(--color-${text[x]})">`;
                spanCount++;
            }
            nextCharIsFormat = false;
        }
        else if (text[x] === '&') nextCharIsFormat = true;
        else output += text[x];
    }
    output += "</span>".repeat(spanCount);
    if (output == "") return " "; // this is an ALT+0160 - NOT a space
    return output;
}

function addCode(e, code) {
    let tagInput = document.getElementById("tagInput");
    let curPos = tagInput.selectionStart;
    tagInput.value = tagInput.value.substring(0, curPos) + "&" + code + tagInput.value.substring(curPos);
    tagInput.focus();
    tagInput.selectionStart = curPos + 2;
    tagInput.selectionEnd = tagInput.selectionStart;
    updateText(tagInput.value);
}

function updateText(value) {
    document.getElementById("text").innerHTML = formatText(value);
}

function getPresets() {
    if (localStorage.getItem("presets") === null) localStorage.setItem("presets", "[]");
    return JSON.parse(localStorage.getItem("presets"));
}

function savePresets(presets) {
    localStorage.setItem("presets", JSON.stringify(presets));
    updatePresetsUi();
}

function addPreset(preset) {
    let presets = getPresets();
    if (presets.includes(preset)) return;
    presets.push(preset);
    savePresets(presets);
}

function removePreset(preset) {
    savePresets(getPresets().filter(x => x !== preset));
}

function updatePresetsUi() {
    let presetList = document.getElementById("presetList");
    presetList.innerHTML = "";
    for (let preset of getPresets()) {
        presetList.innerHTML += `<li class="mc"> <span style="font-size:24px">${formatText(preset)}</span>  <br />  ${preset} <button class="delButton" onclick="removePreset('${preset}')">✖</span></li> `;
    }
}