const editor = document.getElementById('editor');
const htmlCode = document.getElementById('htmlCode');
const preview = document.getElementById('preview');
const darkModeToggle = document.getElementById('darkModeToggle');
const colorPicker = document.getElementById('colorPicker');

const colors = [
    ['#FFFFFF', '#CCCCCC', '#C0C0C0', '#999999', '#666666', '#333333', '#000000'],
    ['#FFCCCC', '#FF6666', '#FF0000', '#CC0000', '#990000', '#660000', '#330000'],
    ['#FFCC99', '#FF9966', '#FF9900', '#FF6600', '#CC6600', '#993300', '#663300'],
    ['#FFFF99', '#FFFF66', '#FFCC66', '#FFCC33', '#CC9933', '#996633', '#663333'],
    ['#FFFFCC', '#FFFF33', '#FFFF00', '#FFCC00', '#999900', '#666600', '#333300'],
    ['#99FF99', '#66FF99', '#33FF33', '#33CC00', '#009900', '#006600', '#003300'],
    ['#99FFFF', '#33FFFF', '#66CCCC', '#00CCCC', '#339999', '#336666', '#003333'],
    ['#CCFFFF', '#66FFFF', '#33CCFF', '#3366FF', '#3333FF', '#000099', '#000066'],
    ['#CCCCFF', '#9999FF', '#6666CC', '#6633FF', '#6600CC', '#333399', '#330099'],
    ['#FFCCFF', '#FF99FF', '#CC66CC', '#CC33CC', '#993399', '#663366', '#330033']
];

function createColorPicker() {
    colors.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'flex';
        row.forEach(color => {
            const colorButton = document.createElement('button');
            colorButton.className = 'w-6 h-6 m-1 border border-gray-300';
            colorButton.style.backgroundColor = color;
            colorButton.onclick = () => applyColor(color);
            rowDiv.appendChild(colorButton);
        });
        colorPicker.appendChild(rowDiv);
    });
}

function applyStyle(style) {
    let startTag = '';
    let endTag = '';
    switch (style) {
        case 'bold':
            startTag = '[b]'; endTag = '[/b]';
            break;
        case 'italic':
            startTag = '[i]'; endTag = '[/i]';
            break;
        case 'underline':
            startTag = '[u]'; endTag = '[/u]';
            break;
        case 'size':
            startTag = '[size=16px]'; endTag = '[/size]';
            break;
        case 'list':
            // 單獨處理列表
            applyListStyle();
            return;
        case 'alignLeft':
            startTag = '[align=left]'; endTag = '[/align]';
            break;
        case 'alignCenter':
            startTag = '[align=center]'; endTag = '[/align]';
            break;
        case 'alignRight':
            startTag = '[align=right]'; endTag = '[/align]';
            break;
    }
    surroundSelectedText(editor, startTag, endTag);
    updatePreview();
}

function applyListStyle() {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const fullText = editor.value;
    
    // If there's no selection, work with the current line
    if (start === end) {
        const lineStart = fullText.lastIndexOf('\n', start - 1) + 1;
        const lineEnd = fullText.indexOf('\n', start);
        const currentLine = fullText.substring(lineStart, lineEnd !== -1 ? lineEnd : fullText.length);
        
        const newLine = currentLine.startsWith('[*] ') ? currentLine.substring(4) : `[*] ${currentLine}`;
        
        editor.value = fullText.substring(0, lineStart) + newLine + fullText.substring(lineEnd !== -1 ? lineEnd : fullText.length);
        editor.selectionStart = editor.selectionEnd = lineStart + newLine.length;
    } else {
        // If there's a selection, toggle list for all selected lines
        const selectedText = fullText.substring(start, end);
        const lines = selectedText.split('\n');
        
        const isAlreadyList = lines.every(line => line.trim().startsWith('[*] ') || line.trim() === '');
        
        const newText = lines.map(line => {
            if (isAlreadyList) {
                return line.trim().startsWith('[*] ') ? line.substring(4) : line;
            } else {
                return line.trim() ? `[*] ${line.trim()}` : line;
            }
        }).join('\n');
        
        editor.value = fullText.substring(0, start) + newText + fullText.substring(end);
        editor.selectionStart = start;
        editor.selectionEnd = start + newText.length;
    }
    
    updatePreview();
}

function toggleColorPicker() {
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.classList.toggle('hidden');
}

// 點擊其他地方時關閉顏色下拉菜單
document.addEventListener('click', function(event) {
    const colorPicker = document.getElementById('colorPicker');
    const colorButton = document.querySelector('button[title="顏色"]');
    if (!colorButton.contains(event.target) && !colorPicker.contains(event.target)) {
        colorPicker.classList.add('hidden');
    }
});

function toggleListOptions() {
    const listOptions = document.getElementById('listOptions');
    listOptions.classList.toggle('hidden');
}

// 點擊其他地方時關閉列表下拉菜單
document.addEventListener('click', function(event) {
    const listOptions = document.getElementById('listOptions');
    const listButton = document.querySelector('button[title="列表"]');
    if (!listButton.contains(event.target) && !listOptions.contains(event.target)) {
        listOptions.classList.add('hidden');
    }
});

function toggleSizeOptions() {
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.classList.toggle('hidden');
}

// 點擊其他地方時關閉大小下拉菜單
document.addEventListener('click', function(event) {
    const sizeOptions = document.getElementById('sizeOptions');
    const sizeButton = document.querySelector('button[title="字體大小"]');
    if (!sizeButton.contains(event.target) && !sizeOptions.contains(event.target)) {
        sizeOptions.classList.add('hidden');
    }
});

function togglePositionOptions() {
    const positionOptions = document.getElementById('positionOptions');
    positionOptions.classList.toggle('hidden');
}

// 點擊其他地方時關閉位置下拉菜單
document.addEventListener('click', function(event) {
    const positionOptions = document.getElementById('positionOptions');
    const positionButton = document.querySelector('button[title="位置"]');
    if (!positionButton.contains(event.target) && !positionOptions.contains(event.target)) {
        positionOptions.classList.add('hidden');
    }
});

function applySize(size) {
    surroundSelectedText(editor, `[size=${size}]`, '[/size]');
    updatePreview();
    document.getElementById('sizeOptions').classList.add('hidden');
}

function applyColor(color) {
    surroundSelectedText(editor, `[color=${color}]`, '[/color]');
    updatePreview();
    colorPicker.classList.add('hidden');
}

function surroundSelectedText(input, startTag, endTag) {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selectedText = input.value.substring(start, end);
    const beforeText = input.value.substring(0, start);
    const afterText = input.value.substring(end);

    if (beforeText.endsWith(startTag) && afterText.startsWith(endTag)) {
        input.value = beforeText.slice(0, -startTag.length) + selectedText + afterText.slice(endTag.length);
        input.selectionStart = start - startTag.length;
        input.selectionEnd = end - startTag.length;
    } else {
        input.value = beforeText + startTag + selectedText + endTag + afterText;
        input.selectionStart = start + startTag.length;
        input.selectionEnd = end + startTag.length;
    }

    input.focus();
}

function applyListStyle(listType) {
    const fullText = editor.value;
    let start = editor.selectionStart;
    let end = editor.selectionEnd;
    
    // 如果沒有選擇文本，擴展到整個列表
    if (start === end) {
        start = findListStart(fullText, start);
        end = findListEnd(fullText, end);
    }
    
    const selectedText = fullText.substring(start, end);
    const lines = selectedText.split('\n');
    
    const listPrefix = listType === 'number' ? /^\d+\.\s/ : /^\[[\*•]\]\s/;
    const isAlreadyList = lines.some(line => listPrefix.test(line.trim()));
    
    let counter = 1;
    const newText = lines.map(line => {
        const trimmedLine = line.trim();
        if (isAlreadyList) {
            // 移除列表格式
            return trimmedLine.replace(listPrefix, '');
        } else {
            // 添加列表格式
            if (trimmedLine) {
                if (listType === 'number') {
                    return `${counter++}. ${trimmedLine}`;
                } else {
                    return `[*] ${trimmedLine}`;
                }
            }
            return trimmedLine;
        }
    }).join('\n');
    
    editor.value = fullText.substring(0, start) + newText + fullText.substring(end);
    editor.selectionStart = start;
    editor.selectionEnd = start + newText.length;
    
    updatePreview();
    toggleListOptions(); // 隱藏列表選項
}

function findListStart(text, position) {
    let start = position;
    while (start > 0) {
        start = text.lastIndexOf('\n', start - 1);
        if (start === -1) {
            start = 0;
            break;
        }
        const line = text.substring(start + 1, text.indexOf('\n', start + 1)).trim();
        if (!(/^\d+\.\s/.test(line) || /^\[[\*•]\]\s/.test(line)) && line !== '') {
            start = text.indexOf('\n', start + 1) + 1;
            break;
        }
    }
    return start;
}

function findListEnd(text, position) {
    let end = position;
    while (end < text.length) {
        end = text.indexOf('\n', end);
        if (end === -1) {
            end = text.length;
            break;
        }
        const line = text.substring(end + 1, text.indexOf('\n', end + 1) !== -1 ? text.indexOf('\n', end + 1) : text.length).trim();
        if (!(/^\d+\.\s/.test(line) || /^\[[\*•]\]\s/.test(line)) && line !== '') {
            break;
        }
        end++;
    }
    return end;
}

function updatePreview() {
    let content = editor.value;
    let htmlContent = content
        .replace(/\[b\]([\s\S]*?)\[\/b\]/g, '<strong>$1</strong>')
        .replace(/\[i\]([\s\S]*?)\[\/i\]/g, '<em>$1</em>')
        .replace(/\[u\]([\s\S]*?)\[\/u\]/g, '<u>$1</u>')
        .replace(/\[color=(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3})\]([\s\S]*?)\[\/color\]/g, '<span style="color: $1;">$2</span>')
        .replace(/\[size=(\d+)px\]([\s\S]*?)\[\/size\]/g, '<span style="font-size: $1px;">$2</span>')
        .replace(/\[align=(left|center|right)\]([\s\S]*?)\[\/align\]/g, '<div style="text-align: $1;">$2</div>')
        .replace(/\[\*\]/g, '• ')
        .replace(/\n/g, '<br>');
    
    // 處理表情符號
    const emojiMap = {
        '👍': '&#128077;', '👎': '&#128078;', '😊': '&#128522;', '😢': '&#128546;', 
        '😍': '&#128525;', '🎉': '&#127881;', '📢': '&#128226;', '✅': '&#9989;', 
        '❌': '&#10060;', '⭐️': '&#11088;'
    };
    htmlContent = htmlContent.replace(/👍|👎|😊|😢|😍|🎉|📢|✅|❌|⭐️/g, match => emojiMap[match] || match);

    htmlCode.textContent = htmlContent;
    preview.innerHTML = htmlContent;
}

function confirmSwitch() {
    return confirm("切換不會保留內容，確定要切換嗎？");
}

editor.addEventListener('input', updatePreview);
updatePreview();

darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// 檢查用戶的深色模式偏好設置
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}

// 監聽系統深色模式變化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// 初始化顏色選擇器
createColorPicker();
