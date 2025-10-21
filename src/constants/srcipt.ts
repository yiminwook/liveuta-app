/* 프론트에서 미리 적용해두었음. */
const DISABLE_PINCH_ZOOM_SCRIPT = `
  const meta = document.createElement('meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  document.head.appendChild(meta);
`;

const DISABLE_LONG_PRESS_SCRIPT = `
  document.body.style['user-select'] = 'none';
  document.body.style['-webkit-user-select'] = 'none';
  document.body.style['-webkit-touch-callout'] = 'none';
  document.body.style['-webkit-tap-highlight-color'] = 'transparent';
  document.body.style['outline'] = 'none';
`;

const DISABLE_LINK_CONTEXT_MENU_SCRIPT = `
    function disableContextMenuOnLinks() {
      const links = document.querySelectorAll('a');

      links.forEach(link => {
        if (!link.dataset.cmBound) {
          // 롱프레스할때 url 컨텍스트 메뉴 안보이게
          link.addEventListener('dragstart', e => e.preventDefault()); 
          link.dataset.cmBound = 'true';
        }
      });
    }

    // 최초 실행
    disableContextMenuOnLinks();

    // DOM 변화 감지하여 새로 추가된 링크에도 적용
    const observer = new MutationObserver(() => {
      disableContextMenuOnLinks();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
`;

export const INJECTED_JAVASCRIPT = `
  ${DISABLE_LONG_PRESS_SCRIPT}
  ${DISABLE_LINK_CONTEXT_MENU_SCRIPT}

  true;
`;
