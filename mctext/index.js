// Copyright © Lucy Poulton 2020. All rights reserved.

let format = "legacy";

function formatTextLegacy(text) {
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
                output += `<span class="mc-italic">`;
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
    // check for empty
    var testSpan = document.createElement("span");
    testSpan.innerHTML = output;
    if (testSpan.innerText.replaceAll(" ", "") == "") return " "; // this is an ALT+0160 - NOT a space
    return output;
}

function parseTextComponent(component) {
    var span = document.createElement("span");
    span.innerText = component["text"];
    var decoration = "";
    if (component["bold"]) span.classList.add("mc-bold");
    if (component["italic"]) span.classList.add("mc-italic");
    if (component["underlined"]) decoration += "underline ";
    if (component["strikethrough"]) decoration += "line-through";
    if (decoration != "") span.style.textDecoration = decoration;
    if (component["obfuscated"]) span.style.background = "black";
    if (component["color"]) {
        if (component["color"][0] == "#" && component["color"].length == 7) span.style.color = component["color"];
        else span.style.color = `var(--color-${component["color"]})`;
    }
    var output = span.outerHTML;
    if (component["extra"]) {
        for (var obj of component[extra]) {
                output += parseTextComponent(obj);
            }
    }
    return output;
}

function formatTextJson(text) {
    try {
        var jsonObject = JSON.parse(text);
        if (Array.isArray(jsonObject)) {
            let output = "";
            for (var obj of jsonObject) {
                output += parseTextComponent(obj);
            }
            return output;
        } else return parseTextComponent(jsonObject);
    } catch (SyntaxError) {
        return "Invalid JSON";
    }
}

function formatText(text) {
    if (document.getElementById("legacy").selected) return formatTextLegacy(text);
    return formatTextJson(text);
}

function addCode(e, code) {
    if (!document.getElementById("legacy").selected) return;
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

function setFormat(newFormat) {
    updateText(document.getElementById("tagInput").value);
}
