
// ════════════════════════════════════════════════════════
// DUY EDITOR - WYSIWYG Editor Full Featured
// Version: 2.0 - Complete Edition
// ════════════════════════════════════════════════════════
function initDuyEditor() {
    // Cấu hình tính năng
    const FEATURES = {
        ENABLE_IMAGE_DRAG_MOVE: true,  // Bật/tắt kéo ảnh đến vị trí mới
        ENABLE_PASTE_CLEANER: true,    // Bật/tắt làm sạch code từ Word
        ENABLE_ATTACHMENTS: true        // Bật/tắt đính kèm file
    };

    // Tìm tất cả các phần tử có class duy_editor
    // const editors = document.querySelectorAll(".duy_editor");
    const editors = document.querySelectorAll(".duy_editor:not([data-initialized])");
    // Lặp qua từng editor để khởi tạo
    editors.forEach((container, index) => {
        const attachedFiles = []; // Mảng lưu trữ các đối tượng File thực tế
        
        const name = container.getAttribute("name") || "editor_" + index;
        const editorId = `editor_${index}`;

        // Tạo các ID duy nhất cho editor này
        const colorInputId = `colorInput_${editorId}`;
        const colorBarId = `colorBar_${editorId}`;
        const imgFileId = `imgFile_${editorId}`;
        const attachFileId = `attachFile_${editorId}`;
        const attachBarId = `attachBar_${editorId}`;
        const wordCountId = `wordCount_${editorId}`;
        const bodyAreaId = `bodyArea_${editorId}`;

        // ════════════════════════════════════════════════════════
        // 1. TẠO TOOLBAR
        // ════════════════════════════════════════════════════════
        const toolbar = document.createElement("div");
        toolbar.className = "duy-toolbar";

        toolbar.innerHTML = `
        <select class="duy-tb-select duy-font-size-select" title="Font size">
            <option value="1">10</option>
            <option value="2">13</option>
            <option value="3" selected>16</option>
            <option value="4">18</option>
            <option value="5">24</option>
            <option value="6">32</option>
        </select>

        <div class="duy-tsep"></div>

            <button class="duy-tbtn" data-cmd="bold" title="Bold" type="button"><b>B</b></button>
            <button class="duy-tbtn" data-cmd="italic" title="Italic" type="button"><i>I</i></button>
            <button class="duy-tbtn" data-cmd="underline" title="Underline" type="button"><u>U</u></button>
            <button class="duy-tbtn" data-cmd="strikeThrough" title="Strike" type="button"><s>S</s></button>

        <div class="duy-tsep"></div>
        
        <div class="duy-color-wrap" title="Text color">
            <div class="duy-color-preview">
                <svg viewBox="0 0 24 24">
                <path d="M11 2L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 10L12 5.67 14.38 12H9.62z" fill="#333"/>
                <rect x="3" y="20" width="18" height="2" rx="1" class="duy-color-bar" id="${colorBarId}" fill="#1a73e8"/>
                </svg>
            </div>
            <input type="color" id="${colorInputId}" value="#1a73e8" class="duy-color-input"/>
        </div>

        <div class="duy-tsep"></div>

            <button class="duy-tbtn" data-cmd="justifyLeft" title="Align left" type="button">
                <svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zm0 4h12v2H3zm0 4h18v2H3zm0 4h12v2H3z"/></svg>
            </button>
            <button class="duy-tbtn" data-cmd="justifyCenter" title="Align center" type="button">
                <svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zm3 4h12v2H6zm-3 4h18v2H3zm3 4h12v2H6z"/></svg>
            </button>
            <button class="duy-tbtn" data-cmd="justifyRight" title="Align right" type="button">
                <svg viewBox="0 0 24 24"><path d="M3 6h18v2H3zm6 4h12v2H9zm-6 4h18v2H3zm6 4h12v2H9z"/></svg>
            </button>

            <div class="duy-tsep"></div>

            <button class="duy-tbtn" data-cmd="insertUnorderedList" title="Bullet list" type="button">
                <svg viewBox="0 0 24 24"><circle cx="4" cy="7" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="17" r="1.5"/><path d="M8 6h13v2H8zm0 5h13v2H8zm0 5h13v2H8z"/></svg>
            </button>
            <button class="duy-tbtn" data-cmd="insertOrderedList" title="Numbered list" type="button">
                <svg viewBox="0 0 24 24"><path d="M3 17h2v.5H4v1h1v.5H3v1h3v-4H3zm1-9h1V4H3v1h1zm-1 3h1.8L3 13.1v.9h3v-1H4.2L6 10.9V10H3zm5-5v2h13V6zm0 5v2h13v-2zm0 5v2h13v-2z"/></svg>
            </button>

            <div class="duy-tsep"></div>

            <button class="duy-tbtn duy-insert-link-btn" title="Insert link" type="button">
                <svg viewBox="0 0 24 24"><path d="M3.9 12a4.1 4.1 0 0 1 4.1-4.1h4V6h-4a6 6 0 0 0 0 12h4v-1.9h-4A4.1 4.1 0 0 1 3.9 12zM8 13h8v-2H8v2zm6-7h4a6 6 0 0 1 0 12h-4v-1.9h4a4.1 4.1 0 0 0 0-8.2h-4V6z"/></svg>
            </button>

            <button class="duy-tbtn duy-insert-image-btn" title="Insert image" type="button">
                <svg viewBox="0 0 24 24"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/></svg>
            </button>
            <input type="file" id="${imgFileId}" accept="image/*" multiple style="display:none" class="duy-image-input"/>

            ${FEATURES.ENABLE_ATTACHMENTS ? `
            <button class="duy-tbtn duy-attach-file-btn" title="Attach file" type="button">
                <svg viewBox="0 0 24 24"><path d="M16.5 6v11.5a4 4 0 0 1-8 0V5a2.5 2.5 0 0 1 5 0v10.5a1 1 0 0 1-2 0V6H10v9.5a3 3 0 0 0 6 0V5a4.5 4.5 0 0 0-9 0v12.5a6 6 0 0 0 12 0V6h-2.5z"/></svg>
            </button>
            <input type="file" id="${attachFileId}" multiple style="display:none" class="duy-attach-input"/>
            ` : ''}

            <div class="duy-tsep"></div>

            <button class="duy-tbtn" data-cmd="removeFormat" title="Clear format" type="button">
            <svg viewBox="0 0 24 24"><path d="M6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6zm.24 14.83L10 16.06l3.76 3.77 1.41-1.41-3.76-3.77 3.01-7.02-2.22-2.22L9.62 12H6.83L3.41 8.58 2 10l4 4-1.17 5.41 1.41.42z"/></svg>
            </button>

            <span class="duy-word-count" id="${wordCountId}">0 words</span>
        `;

        // ════════════════════════════════════════════════════════
        // 2. TẠO EDITOR AREA
        // ════════════════════════════════════════════════════════
        const editor = document.createElement("div");
        editor.className = "duy-body-area";
        editor.id = bodyAreaId;
        editor.contentEditable = true;
        editor.spellcheck = false;
        editor.setAttribute('data-placeholder', 'Nhập nội dung...');
        editor.innerHTML = "<p><br></p>";
        // ════════════════════════════════════════════════════════
        // 3. TẠO ATTACH BAR (nếu bật)
        // ════════════════════════════════════════════════════════
        let attachBar = null;
        if (FEATURES.ENABLE_ATTACHMENTS) {
            attachBar = document.createElement("div");
            attachBar.className = "duy-attach-bar";
            attachBar.id = attachBarId;
        }

        // ════════════════════════════════════════════════════════
        // 4. TẠO FOOTER
        // ════════════════════════════════════════════════════════
        const footer = document.createElement("div");
        footer.className = "duy-footer";
        footer.innerHTML = `
            <div class="duy-footer-left">
                <button class="duy-btn duy-btn-primary duy-btn-save" type="button" title="Save draft">
                    <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor">
                        <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                    </svg>
                    Save
                </button>
                <button class="duy-btn duy-btn-ghost duy-btn-clear" type="button" title="Clear all">
                    <svg viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor">
                        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    Clear
                </button>
            </div>
        `;

        // ════════════════════════════════════════════════════════
        // 5. TẠO TEXTAREA HIDDEN (để submit form)
        // ════════════════════════════════════════════════════════
        const textarea = document.createElement("textarea");
        textarea.name = name;
        textarea.style.display = "none";

        // ════════════════════════════════════════════════════════
        // 6. THÊM VÀO CONTAINER
        // ════════════════════════════════════════════════════════
        container.appendChild(toolbar);
        container.appendChild(editor);
        if (attachBar) container.appendChild(attachBar);
        container.appendChild(footer);
        container.appendChild(textarea);

        // ════════════════════════════════════════════════════════
        // 7. BIẾN QUẢN LÝ STATE
        // ════════════════════════════════════════════════════════
        let activeWrap = null;  // Wrapper ảnh đang được chọn
        let draggedWrap = null; // Wrapper đang được kéo (nếu bật DRAG_MOVE)

        // ════════════════════════════════════════════════════════
        // 8. HÀM THỰC THI LỆNH
        // ════════════════════════════════════════════════════════
        function execCmd(cmd, value = null) {
            // Lưu selection trước khi focus
            const sel = window.getSelection();
            let savedRange = null;
            if (sel.rangeCount > 0) {
                savedRange = sel.getRangeAt(0).cloneRange();
            }

            editor.focus();

            // Khôi phục selection sau khi focus
            if (savedRange) {
                try {
                    sel.removeAllRanges();
                    sel.addRange(savedRange);
                } catch (e) {
                    console.warn('Could not restore selection:', e);
                }
            }

            document.execCommand(cmd, false, value);
        }

        // ════════════════════════════════════════════════════════
        // 9. PASTE CLEANER - Làm sạch HTML từ Word/Excel
        // ════════════════════════════════════════════════════════
        function cleanPastedHTML(html) {
            if (!FEATURES.ENABLE_PASTE_CLEANER) return html;

            // Loại bỏ các thẻ và thuộc tính không cần thiết từ Word/Excel
            let cleaned = html;

            // Loại bỏ tất cả style inline phức tạp
            cleaned = cleaned.replace(/style="[^"]*"/gi, '');

            // Loại bỏ class từ Word (MsoNormal, MsoListParagraph, etc.)
            cleaned = cleaned.replace(/class="Mso[^"]*"/gi, '');
            cleaned = cleaned.replace(/class="[^"]*"/gi, '');

            // Loại bỏ các thẻ XML và Office namespace
            cleaned = cleaned.replace(/<\?xml[^>]*>/gi, '');
            cleaned = cleaned.replace(/<\/?o:[^>]*>/gi, '');
            cleaned = cleaned.replace(/<\/?w:[^>]*>/gi, '');
            cleaned = cleaned.replace(/<\/?m:[^>]*>/gi, '');
            cleaned = cleaned.replace(/<\/?v:[^>]*>/gi, '');

            // Loại bỏ meta tags
            cleaned = cleaned.replace(/<meta[^>]*>/gi, '');
            cleaned = cleaned.replace(/<link[^>]*>/gi, '');

            // Loại bỏ thẻ style
            cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

            // Loại bỏ comments
            cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

            // Loại bỏ các thuộc tính không cần thiết
            cleaned = cleaned.replace(/\s(lang|align|valign|bgcolor|width|height)="[^"]*"/gi, '');

            // Loại bỏ thẻ span rỗng hoặc chỉ chứa &nbsp;
            cleaned = cleaned.replace(/<span[^>]*>\s*(&nbsp;|\s)*<\/span>/gi, '');

            // Chuyển <b> thành <strong>, <i> thành <em>
            cleaned = cleaned.replace(/<b(\s[^>]*)?>/gi, '<strong$1>');
            cleaned = cleaned.replace(/<\/b>/gi, '</strong>');
            cleaned = cleaned.replace(/<i(\s[^>]*)?>/gi, '<em$1>');
            cleaned = cleaned.replace(/<\/i>/gi, '</em>');

            // Loại bỏ nhiều <br> liên tiếp
            cleaned = cleaned.replace(/(<br\s*\/?>[\s\n]*){3,}/gi, '<br><br>');

            // Loại bỏ &nbsp; thừa
            cleaned = cleaned.replace(/(&nbsp;){2,}/g, ' ');

            // Trim khoảng trắng
            cleaned = cleaned.trim();

            return cleaned;
        }

        // ════════════════════════════════════════════════════════
        // 10. BUILD WRAP - Tạo cấu trúc Froala cho ảnh
        // ════════════════════════════════════════════════════════
        function buildWrap(src, initWidth) {
            const wrap = document.createElement('span');
            wrap.className = 'duy-fr-img-wrap duy-fr-dii';
            wrap.contentEditable = 'false';

            const img = document.createElement('img');
            img.src = src;
            img.style.width = initWidth + 'px';
            img.draggable = false;
            wrap.appendChild(img);

            // Tạo 8 resize handles
            ['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].forEach(dir => {
                const h = document.createElement('span');
                h.className = 'duy-fr-handle duy-h-' + dir;
                h.addEventListener('mousedown', e => startResize(e, wrap, img, dir));
                wrap.appendChild(h);
            });

            // Tạo toolbar mini
            const tb = document.createElement('div');
            tb.className = 'duy-fr-img-toolbar';
            tb.innerHTML = `
                <button class="duy-tb-fl" type="button">◧ Left</button>
                <span class="duy-tb-sep"></span>
                <button class="duy-tb-blk" type="button">⬛ Block</button>
                <span class="duy-tb-sep"></span>
                <button class="duy-tb-fr" type="button">◨ Right</button>
                <span class="duy-tb-sep"></span>
                <button type="button" style="color:#d93025" title="Xóa ảnh">✕</button>
            `;
            wrap.appendChild(tb);

            // Event handlers cho toolbar
            tb.querySelector('.duy-tb-fl').addEventListener('click', () => setFloat(wrap, 'duy-fr-fil'));
            tb.querySelector('.duy-tb-blk').addEventListener('click', () => setFloat(wrap, ''));
            tb.querySelector('.duy-tb-fr').addEventListener('click', () => setFloat(wrap, 'duy-fr-fir'));
            tb.querySelector('button[title="Xóa ảnh"]').addEventListener('click', () => {
                wrap.remove();
                updateWordCount();
                deselectAll();
            });

            // Click vào wrapper để select
            wrap.addEventListener('mousedown', e => {
                if (e.target.classList.contains('duy-fr-handle')) return;
                if (e.target.closest('.duy-fr-img-toolbar')) return;
                e.preventDefault();
                selectWrap(wrap);
            });

            // ════════════════════════════════════════════════════
            // DRAG TO MOVE - Kéo ảnh đến vị trí mới (Optional)
            // ════════════════════════════════════════════════════
            if (FEATURES.ENABLE_IMAGE_DRAG_MOVE) {
                img.addEventListener('mousedown', e => {
                    // Chỉ cho phép drag khi giữ Ctrl/Cmd
                    if (!e.ctrlKey && !e.metaKey) return;

                    e.preventDefault();
                    e.stopPropagation();

                    draggedWrap = wrap;
                    wrap.classList.add('duy-fr-dragging');

                    const startX = e.clientX;
                    const startY = e.clientY;
                    const rect = wrap.getBoundingClientRect();
                    const offsetX = startX - rect.left;
                    const offsetY = startY - rect.top;

                    // Tạo clone để hiển thị khi drag
                    const ghost = wrap.cloneNode(true);
                    ghost.style.cssText = `
                        position: fixed;
                        pointer-events: none;
                        opacity: 0.6;
                        z-index: 10000;
                        left: ${startX - offsetX}px;
                        top: ${startY - offsetY}px;
                    `;
                    document.body.appendChild(ghost);

                    function onDragMove(ev) {
                        ghost.style.left = (ev.clientX - offsetX) + 'px';
                        ghost.style.top = (ev.clientY - offsetY) + 'px';
                    }

                    function onDragEnd(ev) {
                        document.removeEventListener('mousemove', onDragMove);
                        document.removeEventListener('mouseup', onDragEnd);
                        ghost.remove();
                        wrap.classList.remove('duy-fr-dragging');

                        // Tìm vị trí drop
                        const range = document.caretRangeFromPoint(ev.clientX, ev.clientY);
                        if (range && editor.contains(range.startContainer)) {
                            // Di chuyển wrap đến vị trí mới
                            const block = getBlockAncestor(range.startContainer);
                            if (block) {
                                block.insertBefore(wrap, block.firstChild);
                            }
                        }

                        draggedWrap = null;
                    }

                    document.addEventListener('mousemove', onDragMove);
                    document.addEventListener('mouseup', onDragEnd);
                });
            }

            return wrap;
        }

        // ════════════════════════════════════════════════════════
        // 11. SELECTION - Quản lý chọn ảnh
        // ════════════════════════════════════════════════════════
        function selectWrap(wrap) {
            if (activeWrap && activeWrap !== wrap) {
                activeWrap.classList.remove('duy-fr-active');
            }
            activeWrap = wrap;
            wrap.classList.add('duy-fr-active');
            updateToolbarButtons(wrap);
        }

        function deselectAll() {
            if (activeWrap) {
                activeWrap.classList.remove('duy-fr-active');
                activeWrap = null;
            }
        }

        function updateToolbarButtons(wrap) {
            wrap.querySelectorAll('.duy-fr-img-toolbar button').forEach(b => b.classList.remove('duy-on'));

            if (wrap.classList.contains('duy-fr-fil'))
                wrap.querySelector('.duy-tb-fl').classList.add('duy-on');
            else if (wrap.classList.contains('duy-fr-fir'))
                wrap.querySelector('.duy-tb-fr').classList.add('duy-on');
            else
                wrap.querySelector('.duy-tb-blk').classList.add('duy-on');
        }

        // Click ngoài ảnh để bỏ chọn
        document.addEventListener('mousedown', e => {
            if (!e.target.closest('.duy-fr-img-wrap') || !editor.contains(e.target)) {
                if (activeWrap && editor.contains(activeWrap)) {
                    deselectAll();
                }
            }
        });

        // ════════════════════════════════════════════════════════
        // 12. FLOAT CONTROL
        // ════════════════════════════════════════════════════════
        function setFloat(wrap, cls) {
            wrap.classList.remove('duy-fr-fil', 'duy-fr-fir', 'duy-fr-dib');

            if (cls) {
                wrap.classList.add(cls);
            } else {
                wrap.classList.add('duy-fr-dib');
            }

            updateToolbarButtons(wrap);
        }

        // ════════════════════════════════════════════════════════
        // 13. RESIZE - Kéo thay đổi kích thước
        // ════════════════════════════════════════════════════════
        function startResize(e, wrap, img, dir) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            selectWrap(wrap);

            const rect = img.getBoundingClientRect();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = rect.width;
            const startH = rect.height;
            const aspect = startW / startH;

            const isCorner = /^(nw|ne|sw|se)$/.test(dir);

            const overlay = document.createElement('div');
            overlay.style.cssText =
                'position:fixed; inset:0; z-index:9999; cursor:' +
                getComputedStyle(e.target).cursor;
            document.body.appendChild(overlay);

            function onMove(ev) {
                ev.preventDefault();

                const dx = ev.clientX - startX;
                const dy = ev.clientY - startY;

                let w = startW;
                let h = startH;

                if (/e|ne|se/.test(dir)) w = Math.max(40, startW + dx);
                if (/w|nw|sw/.test(dir)) w = Math.max(40, startW - dx);
                if (/s|se|sw/.test(dir)) h = Math.max(30, startH + dy);
                if (/n|ne|nw/.test(dir)) h = Math.max(30, startH - dy);

                if (isCorner) {
                    if (Math.abs(dx) >= Math.abs(dy)) h = w / aspect;
                    else w = h * aspect;
                }

                w = Math.round(w);
                h = Math.round(h);

                img.style.width = w + 'px';
                img.style.height = isCorner ? h + 'px' : 'auto';
                wrap.style.width = w + 'px';
            }

            function onUp(ev) {
                ev.preventDefault();
                overlay.remove();
                document.removeEventListener('mousemove', onMove, true);
                document.removeEventListener('mouseup', onUp, true);
            }

            document.addEventListener('mousemove', onMove, true);
            document.addEventListener('mouseup', onUp, true);
        }

        // ════════════════════════════════════════════════════════
        // 14. INSERT IMAGE AT CURSOR
        // ════════════════════════════════════════════════════════
        function getBlockAncestor(node) {
            while (node && node !== editor) {
                if (node.nodeType === 1) {
                    const tag = node.tagName;
                    if (tag === 'P' || tag === 'DIV' || tag === 'LI') return node;
                }
                node = node.parentNode;
            }
            return null;
        }

        function insertImageAtCursor(src, width, targetRange = null) {
            editor.focus();
            const wrap = buildWrap(src, width);
            const sel = window.getSelection();
            let range = targetRange;

            // Nếu không có range được truyền vào, thử lấy range hiện tại
            if (!range && sel.rangeCount > 0) {
                range = sel.getRangeAt(0);
            }

            // Nếu tìm thấy vị trí hợp lệ trong editor
            if (range && editor.contains(range.startContainer)) {
                range.deleteContents();
                range.insertNode(wrap);
                
                // Di chuyển con trỏ xuống sau ảnh vừa chèn
                const newRange = document.createRange();
                newRange.setStartAfter(wrap);
                newRange.collapse(true);
                sel.removeAllRanges();
                sel.addRange(newRange);
            } else {
                // Trường hợp bất khả kháng: Thêm vào cuối
                const p = document.createElement('p');
                p.appendChild(wrap);
                p.appendChild(document.createTextNode('\u00A0'));
                editor.appendChild(p);
            }

            setFloat(wrap, 'duy-fr-fil');
            selectWrap(wrap);
            updateWordCount();
        }

        // ════════════════════════════════════════════════════════
        // 15. PASTE HANDLER
        // ════════════════════════════════════════════════════════
        function handlePaste(e) {
            const items = e.clipboardData && e.clipboardData.items;

            // Xử lý paste ảnh
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.startsWith('image/')) {
                        e.preventDefault();

                        // ✅ LƯU VỊ TRÍ CON TRỎ TRƯỚC KHI ASYNC
                        const sel = window.getSelection();
                        let savedRange = null;
                        if (sel && sel.rangeCount > 0) {
                            savedRange = sel.getRangeAt(0).cloneRange();
                        }

                        const reader = new FileReader();
                        reader.onload = ev => {
                            // ✅ PHỤC HỒI VỊ TRÍ CON TRỎ TRƯỚC KHI INSERT
                            if (savedRange) {
                                const sel = window.getSelection();
                                sel.removeAllRanges();
                                sel.addRange(savedRange);
                            }
                            insertImageAtCursor(ev.target.result, 300);
                        };
                        reader.readAsDataURL(items[i].getAsFile());
                        return;
                    }
                }
            }

            // Xử lý paste HTML (từ Word, web, etc.)
            if (FEATURES.ENABLE_PASTE_CLEANER && e.clipboardData) {
                const html = e.clipboardData.getData('text/html');
                if (html) {
                    e.preventDefault();
                    const cleaned = cleanPastedHTML(html);
                    document.execCommand('insertHTML', false, cleaned);
                    setTimeout(updateWordCount, 10);
                }
            }
        }

        editor.addEventListener('paste', handlePaste);

        // ════════════════════════════════════════════════════════
        // 16. MUTATION OBSERVER - Tự động wrap ảnh
        // ════════════════════════════════════════════════════════
        // function upgradeImg(img) {
        //     if (img.closest('.duy-fr-img-wrap')) return;
        //     if (!editor.contains(img)) return;

        //     const maxW = editor.clientWidth - 40;
        //     const w = Math.min(img.naturalWidth || img.width || 300, maxW, 500);

        //     const src = img.src;
        //     const wrap = buildWrap(src, w);

        //     if (img.align === 'left' || (img.style && img.style.float === 'left'))
        //         wrap.classList.add('duy-fr-fil');
        //     if (img.align === 'right' || (img.style && img.style.float === 'right'))
        //         wrap.classList.add('duy-fr-fir');

        //     img.parentNode.insertBefore(wrap, img);
        //     img.remove();
        // }
        function upgradeImg(img) {
            if (img.closest('.duy-fr-img-wrap')) return;
            if (!editor.contains(img)) return;

            // ✅ FIX 1: Ưu tiên style.width hoặc width attribute trước naturalWidth
            const styleW = parseInt(img.style.width) || 0;
            const attrW  = parseInt(img.getAttribute('width')) || 0;
            const maxW   = editor.clientWidth - 40;
            const w = Math.min(styleW || attrW || img.naturalWidth || img.width || 300, maxW, 500);

            const src = img.src;
            const wrap = buildWrap(src, w);

            // ✅ FIX 2: Đọc align từ ancestor table nếu img không có align attribute
            const parentTable = img.closest('table');
            const tableAlign  = parentTable ? parentTable.getAttribute('align') : null;

            if (img.align === 'left'  || (img.style && img.style.float === 'left')  || tableAlign === 'left')
                wrap.classList.add('duy-fr-fil');
            else if (img.align === 'right' || (img.style && img.style.float === 'right') || tableAlign === 'right')
                wrap.classList.add('duy-fr-fir');

            img.parentNode.insertBefore(wrap, img);
            img.remove();
        }
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    if (node.tagName === 'IMG') {
                        upgradeImg(node);
                        return;
                    }

                    if (node.querySelectorAll) {
                        node.querySelectorAll('img:not(.duy-fr-img-wrap img)').forEach(upgradeImg);
                    }
                });
            });
        }).observe(editor, { childList: true, subtree: true });

        // ════════════════════════════════════════════════════════
        // 17. XỬ LÝ SỰ KIỆN TOOLBAR
        // ════════════════════════════════════════════════════════

        // Font size
        const fontSizeSelect = toolbar.querySelector('.duy-font-size-select');
        fontSizeSelect.addEventListener('change', function () {
            execCmd('fontSize', this.value);
        });

        // Color picker
        const colorInput = toolbar.querySelector(`#${colorInputId}`);
        const colorBar = toolbar.querySelector(`#${colorBarId}`);
        
        // Ngăn focus cướp khỏi editor khi click color picker
        colorInput.addEventListener('mousedown', function(e) {
            e.preventDefault();
        });
        
        colorInput.addEventListener('input', function () {
            execCmd('foreColor', this.value);
            colorBar.style.fill = this.value;
        });

        // Các nút toolbar với data-cmd
        toolbar.querySelectorAll('.duy-tbtn[data-cmd]').forEach(btn => {
            btn.addEventListener('click', function () {
                const cmd = this.getAttribute('data-cmd');
                execCmd(cmd);
            });
        });

        // Insert link
        const linkBtn = toolbar.querySelector('.duy-insert-link-btn');
        linkBtn.addEventListener('click', function () {
            const url = prompt('Nhập URL:', 'https://');
            if (url) {
                execCmd('createLink', url);
            }
        });

        // Insert image
        const imgBtn = toolbar.querySelector('.duy-insert-image-btn');
        const imgInput = toolbar.querySelector(`#${imgFileId}`);
        imgBtn.addEventListener('click', function () {
            imgInput.click();
        });

        imgInput.addEventListener('change', async function () {
            const files = Array.from(this.files);
            const sel = window.getSelection();
            let currentRange = null;
            
            // Lưu lại vị trí dấu nháy ngay khi vừa chọn file xong
            if (sel && sel.rangeCount > 0 && editor.contains(sel.getRangeAt(0).startContainer)) {
                currentRange = sel.getRangeAt(0).cloneRange();
            }

            for (const file of files) {
                if (!file.type.startsWith('image/')) return;

                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });

                // Chèn ảnh tuần tự và cập nhật vị trí con trỏ cho ảnh tiếp theo
                insertImageAtCursor(base64, 260, currentRange);
                
                const newSel = window.getSelection();
                if (newSel.rangeCount > 0) {
                    currentRange = newSel.getRangeAt(0).cloneRange();
                }
            }
            this.value = '';
        });

        // Attach file
        if (FEATURES.ENABLE_ATTACHMENTS) {
            const attachBtn = toolbar.querySelector('.duy-attach-file-btn');
            const attachInput = toolbar.querySelector(`#${attachFileId}`);

            attachBtn.addEventListener('click', function () {
                attachInput.click();
            });

            attachInput.addEventListener('change', function () {
                Array.from(this.files).forEach(file => {
                    attachedFiles.push(file); // Lưu file vào bộ nhớ editor
                    const pill = document.createElement('div');
                    pill.className = 'duy-attach-pill';
                    pill.innerHTML = `📎 ${file.name}
                        <span class="duy-rm" title="Remove">✕</span>`;

                    pill.querySelector('.duy-rm').addEventListener('click', function () {
                        const fileIdx = attachedFiles.indexOf(file);
                        if (fileIdx > -1) attachedFiles.splice(fileIdx, 1); // Xóa file khi click dấu x
                        pill.remove();
                    });

                    attachBar.appendChild(pill);
                });
                this.value = '';
            });
        }

        // ════════════════════════════════════════════════════════
        // 18. ĐẾM TỪ (WORD COUNT)
        // ════════════════════════════════════════════════════════
        const wordCountEl = toolbar.querySelector(`#${wordCountId}`);

        function updateWordCount() {
            const text = editor.innerText || editor.textContent;
            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            wordCountEl.textContent = `${words.length} word${words.length !== 1 ? 's' : ''}`;
        }

        editor.addEventListener('input', updateWordCount);
        editor.addEventListener('paste', () => setTimeout(updateWordCount, 10));

        // ════════════════════════════════════════════════════════
        // 19. XỬ LÝ DRAG & DROP ẢNH
        // ════════════════════════════════════════════════════════
        editor.addEventListener('dragover', function (e) {
            e.preventDefault();
        });

        editor.addEventListener('drop', function (e) {
            e.preventDefault();
            Array.from(e.dataTransfer.files).forEach(file => {
                if (!file.type.startsWith('image/')) return;

                // ✅ LƯU VỊ TRÍ CON TRỎ TRƯỚC KHI ASYNC
                const sel = window.getSelection();
                let savedRange = null;
                if (sel && sel.rangeCount > 0) {
                    savedRange = sel.getRangeAt(0).cloneRange();
                }

                const reader = new FileReader();
                reader.onload = function (ev) {
                    // ✅ PHỤC HỒI VỊ TRÍ CON TRỎ TRƯỚC KHI INSERT
                    if (savedRange) {
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(savedRange);
                    }
                    insertImageAtCursor(ev.target.result, 280);
                };
                reader.readAsDataURL(file);
            });
        });

        // ════════════════════════════════════════════════════════
        // 20. FOOTER ACTIONS
        // ════════════════════════════════════════════════════════
        const saveBtn = footer.querySelector('.duy-btn-save');
        const clearBtn = footer.querySelector('.duy-btn-clear');

        saveBtn.addEventListener('click', function () {
            // Trigger custom event để parent form có thể lắng nghe
            const event = new CustomEvent('duy-editor-save', {
                bubbles: true, // Quan trọng: cho phép event nổi bọt
                detail: {
                    name: name,
                    content: editor.innerHTML, // This will be the processed HTML
                    files: attachedFiles // Truyền danh sách file ra ngoài
                }
            });
            container.dispatchEvent(event);

            // Hiển thị thông báo
            // showToast('✓ Đã lưu nháp', '#34a853');
        });

        clearBtn.addEventListener('click', function () {
            if (!confirm('Xóa toàn bộ nội dung?')) return;

            editor.innerHTML = '<p><br></p>';
            if (attachBar) attachBar.innerHTML = '';
            deselectAll();
            updateWordCount();

            showToast('Đã xóa nội dung', '#d93025');
        });

        // ════════════════════════════════════════════════════════
        // 21. TOAST NOTIFICATION
        // ════════════════════════════════════════════════════════
        function showToast(msg, bg) {
            let toast = document.getElementById('duy-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'duy-toast';
                toast.className = 'duy-toast';
                document.body.appendChild(toast);
            }

            toast.textContent = msg;
            toast.style.background = bg || '#333';
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';

            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(80px)';
            }, 3000);
        }

        // ════════════════════════════════════════════════════════
        // 22. XỬ LÝ SUBMIT FORM
        // ════════════════════════════════════════════════════════
        const form = container.closest("form");

        if (form) {
            form.addEventListener("submit", function () {
                // Gọi hàm deselectAll (nếu bạn đã định nghĩa) hoặc xóa class active thủ công
                editor.querySelectorAll('.duy-fr-active').forEach(el => el.classList.remove('duy-fr-active'));
                textarea.value = editor.innerHTML;
            });
        }

    }); // Kết thúc forEach
}
document.addEventListener("DOMContentLoaded", initDuyEditor); // Kết thúc DOMContentLoaded


// ════════════════════════════════════════════════════════
// CSS STYLES
// ════════════════════════════════════════════════════════
const style = document.createElement("style");
// Kiểm tra xem style đã được inject chưa
if (!document.getElementById('duy-editor-style')) {
    const style = document.createElement("style");
    style.id = 'duy-editor-style';  // đặt id để nhận dạng
    style.innerHTML = `
    /* CSS Variables */
    :root {
        --duy-bg: #f0f2f5;
        --duy-white: #ffffff;
        --duy-border: #dde1e7;
        --duy-border2: #c8cdd5;
        --duy-text: #1a1d23;
        --duy-muted: #6b7280;
        --duy-accent: #1a73e8;
        --duy-accent-light: #e8f0fe;
        --duy-danger: #d93025;
    }

    /* Reset */
    .duy_editor *, 
    .duy_editor *::before, 
    .duy_editor *::after {
        box-sizing: border-box;
    }

    /* Container */
    .duy_editor {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        background: var(--duy-white);
        border: 1px solid var(--duy-border);
        border-radius: 8px;
        overflow: hidden;
        margin: 16px 0;
    }

    /* Toolbar */
    .duy-toolbar {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        background: #f8f9fa;
        border-bottom: 1px solid var(--duy-border);
        flex-wrap: wrap;
    }

    /* Separator */
    .duy-tsep {
        width: 1px;
        height: 24px;
        background: var(--duy-border);
        margin: 0 4px;
    }

    /* Toolbar buttons */
    .duy-tbtn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        border-radius: 4px;
        cursor: pointer;
        color: var(--duy-text);
        font-size: 14px;
        font-weight: 600;
        transition: background 0.15s;
    }

    .duy-tbtn:hover {
        background: #e8eaed;
    }

    .duy-tbtn:active {
        background: #dadce0;
    }

    .duy-tbtn svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
    }

    /* Select */
    .duy-tb-select {
        height: 32px;
        padding: 0 8px;
        border: 1px solid var(--duy-border);
        border-radius: 4px;
        background: white;
        font-size: 13px;
        cursor: pointer;
    }

    .duy-tb-select:focus {
        outline: none;
        border-color: var(--duy-accent);
    }

    /* Color picker wrapper */
    .duy-color-wrap {
        position: relative;
        display: flex;
        align-items: center;
        width: 32px;
        height: 32px;
    }

    .duy-color-preview {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        transition: background 0.15s;
        pointer-events: none;
        position: absolute;
        inset: 0;
    }

    .duy-color-preview:hover {
        background: #e8eaed;
    }

    .duy-color-preview svg {
        width: 20px;
        height: 20px;
    }

    .duy-color-input {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        cursor: pointer;
        opacity: 0;
        position: absolute;
        pointer-events: all;
    }

    /* Word count */
    .duy-word-count {
        margin-left: auto;
        font-size: 11px;
        color: var(--duy-muted);
        padding: 0 8px;
    }

    /* ════════════════════════════════════════════════════════
       BODY AREA - Editor
    ════════════════════════════════════════════════════════ */
    .duy-body-area {
        min-height: 320px;
        padding: 16px 20px 24px;
        outline: none;
        line-height: 1.7;
        font-size: 14px;
        color: var(--duy-text);
        word-break: break-word;
    }

    .duy-body-area:empty::before {
        content: attr(data-placeholder);
        color: #b0b7c3;
        pointer-events: none;
    }

    .duy-body-area::after {
        content: '';
        display: table;
        clear: both;
    }

    .duy-body-area p,
    .duy-body-area div {
        clear: none !important;
        margin: 0 0 2px;
        min-height: 1.4em;
    }

    /* ════════════════════════════════════════════════════════
       FROALA IMAGE WRAPPER
    ════════════════════════════════════════════════════════ */
    .duy-body-area .duy-fr-img-wrap {
        display: inline-block;
        position: relative;
        line-height: 0;
        max-width: 100%;
        vertical-align: bottom;
        transition: opacity 0.2s;
    }

    .duy-body-area .duy-fr-img-wrap.duy-fr-dragging {
        opacity: 0.3;
        cursor: move !important;
    }

    .duy-body-area .duy-fr-fil {
        float: left !important;
        margin: 2px 14px 6px 0 !important;
    }

    .duy-body-area .duy-fr-fir {
        float: right !important;
        margin: 2px 0 6px 14px !important;
    }

    .duy-body-area .duy-fr-dib {
        float: none !important;
        display: block !important;
        margin: 6px auto !important;
    }

    .duy-body-area .duy-fr-img-wrap img {
        display: block;
        height: auto;
        cursor: pointer;
        border-radius: 2px;
        -webkit-user-drag: none;
        user-select: none;
    }

    .duy-body-area .duy-fr-img-wrap.duy-fr-active img {
        outline: 2px solid var(--duy-accent);
        outline-offset: 1px;
    }

    /* Resize Handles */
    .duy-body-area .duy-fr-img-wrap .duy-fr-handle {
        display: none;
        position: absolute;
        width: 12px;
        height: 12px;
        background: var(--duy-accent);
        border: 2px solid #fff;
        border-radius: 2px;
        z-index: 10000;
        pointer-events: all !important;
        padding: 2px;
        margin: -2px;
    }

    .duy-body-area .duy-fr-img-wrap.duy-fr-active .duy-fr-handle { 
        display: block; 
    }

    .duy-fr-handle.duy-h-nw { top: -5px;    left: -5px;  cursor: nw-resize; }
    .duy-fr-handle.duy-h-ne { top: -5px;    right: -5px; cursor: ne-resize; }
    .duy-fr-handle.duy-h-sw { bottom: -5px; left: -5px;  cursor: sw-resize; }
    .duy-fr-handle.duy-h-se { bottom: -5px; right: -5px; cursor: se-resize; }
    .duy-fr-handle.duy-h-n  { top: -5px;    left: 50%; transform: translateX(-50%); cursor: n-resize; }
    .duy-fr-handle.duy-h-s  { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
    .duy-fr-handle.duy-h-w  { top: 50%;     left: -5px; transform: translateY(-50%); cursor: w-resize; }
    .duy-fr-handle.duy-h-e  { top: 50%;     right: -5px; transform: translateY(-50%); cursor: e-resize; }

    /* Image Toolbar */
    .duy-body-area .duy-fr-img-wrap .duy-fr-img-toolbar {
        display: none !important;
        position: absolute;
        bottom: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%);
        background: #fff;
        border: 1px solid var(--duy-border);
        border-radius: 6px;
        box-shadow: 0 2px 12px rgba(0,0,0,.15);
        padding: 3px 5px;
        align-items: center;
        gap: 2px;
        white-space: nowrap;
        z-index: 100;
    }

    .duy-body-area .duy-fr-img-wrap.duy-fr-active .duy-fr-img-toolbar { 
        display: flex !important;
    .duy-fr-img-toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 11px;
        font-weight: 500;
        padding: 3px 7px;
        border-radius: 4px;
        color: var(--duy-muted);
        transition: background .12s, color .12s;
    }

    .duy-fr-img-toolbar button:hover,
    .duy-fr-img-toolbar button.duy-on {
        background: var(--duy-accent-light);
        color: var(--duy-accent);
    }

    .duy-fr-img-toolbar .duy-tb-sep {
        width: 1px;
        height: 14px;
        background: var(--duy-border2);
        margin: 0 2px;
        display: inline-block;
        vertical-align: middle;
    }

    /* ════════════════════════════════════════════════════════
       ATTACH BAR
    ════════════════════════════════════════════════════════ */
    .duy-attach-bar {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
        padding: 8px 20px;
        border-top: 1px solid var(--duy-border);
    }

    .duy-attach-bar:empty {
        display: none;
    }

    .duy-attach-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: #f3f4f6;
        border: 1px solid var(--duy-border);
        font-size: 12px;
        padding: 3px 8px 3px 10px;
        border-radius: 100px;
    }

    .duy-attach-pill .duy-rm {
        cursor: pointer;
        opacity: 0.5;
        font-size: 14px;
        margin-left: 4px;
    }

    .duy-attach-pill .duy-rm:hover {
        opacity: 1;
    }

    /* ════════════════════════════════════════════════════════
       FOOTER
    ════════════════════════════════════════════════════════ */
    .duy-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-top: 1px solid var(--duy-border);
        background: #fafbfc;
        flex-wrap: wrap;
        gap: 8px;
    }

    .duy-footer-left { 
        display: flex; 
        align-items: center; 
        gap: 6px; 
    }

    .duy-btn {
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        padding: 7px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        transition: all .15s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .duy-btn-primary {
        background: var(--duy-accent);
        color: #fff;
    }

    .duy-btn-primary:hover {
        background: #1557b0;
    }

    .duy-btn-ghost {
        background: none;
        color: var(--duy-muted);
        border: 1px solid var(--duy-border);
    }

    .duy-btn-ghost:hover {
        background: #f3f4f6;
        color: var(--duy-text);
    }

    /* ════════════════════════════════════════════════════════
       TOAST NOTIFICATION
    ════════════════════════════════════════════════════════ */
    .duy-toast {
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(80px);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        z-index: 100000;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
`;
    document.head.appendChild(style);
}
