const editor = document.getElementById('editor');
const htmlCode = document.getElementById('htmlCode');
const preview = document.getElementById('preview');
const toggleHtml = document.getElementById('toggleHtml');
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
            startTag = '\n[*] ';
            break;
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

function toggleColorPicker() {
    colorPicker.classList.toggle('hidden');
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

editor.addEventListener('input', updatePreview);
updatePreview();

toggleHtml.addEventListener('click', () => {
    if (htmlCode.style.display === 'none') {
        htmlCode.style.display = 'block';
        toggleHtml.textContent = '收起';
    } else {
        htmlCode.style.display = 'none';
        toggleHtml.textContent = '展開';
    }
});

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