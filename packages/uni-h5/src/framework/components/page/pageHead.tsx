import { computed, defineComponent, Ref, ref } from 'vue'
import { isArray } from '@vue/shared'
import { Input } from '@dcloudio/uni-components'
import { ICON_PATH_SEARCH, createSvgIconVNode } from '@dcloudio/uni-core'
import { usePageMeta } from '../../plugin/provide'
import {
  usePageHeadTransparent,
  usePageHeadTransparentBackgroundColor,
} from './transparent'

import { updateStyle } from '../../../helpers/dom'
import { getRealPath } from '../../../helpers/getRealPath'

const ICON_PATH_BACK =
  'M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z'

const ICON_PATHS = {
  none: '',
  forward:
    'M11 7.844q-0.25-0.219-0.25-0.578t0.25-0.578q0.219-0.25 0.563-0.25t0.563 0.25l9.656 9.125q0.125 0.125 0.188 0.297t0.063 0.328q0 0.188-0.063 0.359t-0.188 0.297l-9.656 9.125q-0.219 0.25-0.563 0.25t-0.563-0.25q-0.25-0.219-0.25-0.578t0.25-0.609l9.063-8.594-9.063-8.594z',
  back: ICON_PATH_BACK,
  share:
    'M26.563 24.844q0 0.125-0.109 0.234t-0.234 0.109h-17.938q-0.125 0-0.219-0.109t-0.094-0.234v-13.25q0-0.156 0.094-0.25t0.219-0.094h5.5v-1.531h-6q-0.531 0-0.906 0.391t-0.375 0.922v14.375q0 0.531 0.375 0.922t0.906 0.391h18.969q0.531 0 0.891-0.391t0.359-0.953v-5.156h-1.438v4.625zM29.813 10.969l-5.125-5.375-1.031 1.094 3.438 3.594-3.719 0.031q-2.313 0.188-4.344 1.125t-3.578 2.422-2.5 3.453-1.109 4.188l-0.031 0.25h1.469v-0.219q0.156-1.875 1-3.594t2.25-3.063 3.234-2.125 3.828-0.906l0.188-0.031 3.313-0.031-3.438 3.625 1.031 1.063 5.125-5.375-0.031-0.063 0.031-0.063z',
  favorite:
    'M27.594 13.375q-0.063-0.188-0.219-0.313t-0.344-0.156l-7.094-0.969-3.219-6.406q-0.094-0.188-0.25-0.281t-0.375-0.094q-0.188 0-0.344 0.094t-0.25 0.281l-3.125 6.438-7.094 1.094q-0.188 0.031-0.344 0.156t-0.219 0.313q-0.031 0.188 0.016 0.375t0.172 0.313l5.156 4.969-1.156 7.063q-0.031 0.188 0.047 0.375t0.234 0.313q0.094 0.063 0.188 0.094t0.219 0.031q0.063 0 0.141-0.031t0.172-0.063l6.313-3.375 6.375 3.313q0.063 0.031 0.141 0.047t0.172 0.016q0.188 0 0.344-0.094t0.25-0.281q0.063-0.094 0.078-0.234t-0.016-0.234q0-0.031 0-0.063l-1.25-6.938 5.094-5.031q0.156-0.156 0.203-0.344t-0.016-0.375zM11.469 19.063q0.031-0.188-0.016-0.344t-0.172-0.281l-4.406-4.25 6.063-0.906q0.156-0.031 0.297-0.125t0.203-0.25l2.688-5.531 2.75 5.5q0.063 0.156 0.203 0.25t0.297 0.125l6.094 0.844-4.375 4.281q-0.125 0.125-0.172 0.297t-0.016 0.328l1.063 6.031-5.438-2.813q-0.156-0.094-0.328-0.078t-0.297 0.078l-5.438 2.875 1-6.031z',
  home:
    'M23.719 16.5q-0.313 0-0.531 0.219t-0.219 0.5v7.063q0 0.219-0.172 0.391t-0.391 0.172h-12.344q-0.25 0-0.422-0.172t-0.172-0.391v-7.063q0-0.281-0.219-0.5t-0.531-0.219q-0.281 0-0.516 0.219t-0.234 0.5v7.063q0.031 0.844 0.625 1.453t1.438 0.609h12.375q0.844 0 1.453-0.609t0.609-1.453v-7.063q0-0.125-0.063-0.266t-0.156-0.234q-0.094-0.125-0.234-0.172t-0.297-0.047zM26.5 14.875l-8.813-8.813q-0.313-0.313-0.688-0.453t-0.781-0.141-0.781 0.141-0.656 0.422l-8.813 8.844q-0.188 0.219-0.188 0.516t0.219 0.484q0.094 0.125 0.234 0.172t0.297 0.047q0.125 0 0.25-0.047t0.25-0.141l8.781-8.781q0.156-0.156 0.406-0.156t0.406 0.156l8.813 8.781q0.219 0.188 0.516 0.188t0.516-0.219q0.188-0.188 0.203-0.484t-0.172-0.516z',
  menu:
    'M8.938 18.313q0.875 0 1.484-0.609t0.609-1.453-0.609-1.453-1.484-0.609q-0.844 0-1.453 0.609t-0.609 1.453 0.609 1.453 1.453 0.609zM16.188 18.313q0.875 0 1.484-0.609t0.609-1.453-0.609-1.453-1.484-0.609q-0.844 0-1.453 0.609t-0.609 1.453 0.609 1.453 1.453 0.609zM23.469 18.313q0.844 0 1.453-0.609t0.609-1.453-0.609-1.453-1.453-0.609q-0.875 0-1.484 0.609t-0.609 1.453 0.609 1.453 1.484 0.609z',
  close:
    'M17.25 16.156l7.375-7.313q0.281-0.281 0.281-0.641t-0.281-0.641q-0.25-0.25-0.625-0.25t-0.625 0.25l-7.375 7.344-7.313-7.344q-0.25-0.25-0.625-0.25t-0.625 0.25q-0.281 0.25-0.281 0.625t0.281 0.625l7.313 7.344-7.375 7.344q-0.281 0.25-0.281 0.625t0.281 0.625q0.125 0.125 0.281 0.188t0.344 0.063q0.156 0 0.328-0.063t0.297-0.188l7.375-7.344 7.375 7.406q0.125 0.156 0.297 0.219t0.328 0.063q0.188 0 0.344-0.078t0.281-0.203q0.281-0.25 0.281-0.609t-0.281-0.641l-7.375-7.406z',
}

export default /*#__PURE__*/ defineComponent({
  name: 'PageHead',
  setup() {
    const headRef = ref(null)
    const pageMeta = usePageMeta()
    const navigationBar = pageMeta.navigationBar
    UniServiceJSBridge.emit('onNavigationBarChange', navigationBar.titleText)
    const { clazz, style } = usePageHead(navigationBar)
    const buttons = (__UNI_FEATURE_NAVIGATIONBAR_BUTTONS__ &&
      usePageHeadButtons(navigationBar)) as PageHeadButtons
    const searchInput = (__UNI_FEATURE_NAVIGATIONBAR_SEARCHINPUT__ &&
      usePageHeadSearchInput(navigationBar)) as PageHeadSearchInput
    __UNI_FEATURE_NAVIGATIONBAR_TRANSPARENT__ &&
      usePageHeadTransparent(headRef, navigationBar)

    return () => {
      // 单页面无需back按钮
      const backButtonTsx = __UNI_FEATURE_PAGES__
        ? createBackButtonTsx(navigationBar)
        : null
      const leftButtonsTsx = __UNI_FEATURE_NAVIGATIONBAR_BUTTONS__
        ? createButtonsTsx(buttons.left)
        : []
      const rightButtonsTsx = __UNI_FEATURE_NAVIGATIONBAR_BUTTONS__
        ? createButtonsTsx(buttons.right)
        : []
      return (
        <uni-page-head uni-page-head-type={navigationBar.type}>
          <div ref={headRef} class={clazz.value} style={style.value}>
            <div class="uni-page-head-hd">
              {backButtonTsx}
              {...leftButtonsTsx}
            </div>
            {createPageHeadBdTsx(navigationBar, searchInput)}
            <div class="uni-page-head-ft">{...rightButtonsTsx}</div>
          </div>
        </uni-page-head>
      )
    }
  },
})

function createBackButtonTsx(navigationBar: UniApp.PageNavigationBar) {
  if (navigationBar.backButton) {
    return (
      <div class="uni-page-head-btn">
        {createSvgIconVNode(
          ICON_PATH_BACK,
          navigationBar.type === 'transparent'
            ? '#fff'
            : navigationBar.titleColor!,
          27
        )}
      </div>
    )
  }
}

function createButtonsTsx(btns: PageHeadButton[]) {
  return btns.map(
    (
      { btnClass, btnStyle, btnText, btnIconPath, badgeText, iconStyle },
      index
    ) => {
      return (
        <div
          key={index}
          class={btnClass}
          style={btnStyle}
          badge-text={badgeText}
        >
          {btnIconPath ? (
            createSvgIconVNode(btnIconPath, iconStyle.color, iconStyle.fontSize)
          ) : (
            <i class="uni-btn-icon" style={iconStyle} v-html={btnText} />
          )}
        </div>
      )
    }
  )
}

function createPageHeadBdTsx(
  navigationBar: UniApp.PageNavigationBar,
  searchInput: PageHeadSearchInput
) {
  if (
    !__UNI_FEATURE_NAVIGATIONBAR_SEARCHINPUT__ ||
    !navigationBar.searchInput
  ) {
    return createPageHeadTitleTextTsx(navigationBar)
  }
  return createPageHeadSearchInputTsx(navigationBar, searchInput)
}

function createPageHeadTitleTextTsx({
  loading,
  titleText,
  titleImage,
}: UniApp.PageNavigationBar) {
  return (
    <div class="uni-page-head-bd">
      <div
        style="{fontSize:titleSize,opacity:type==='transparent'?0:1}"
        class="uni-page-head__title"
      >
        {loading ? (
          <i class="uni-loading" />
        ) : titleImage ? (
          <img src={titleImage} class="uni-page-head__title_image" />
        ) : (
          titleText
        )}
      </div>
    </div>
  )
}

function createPageHeadSearchInputTsx(
  navigationBar: UniApp.PageNavigationBar,
  { text, focus, composing, onBlur, onFocus, onInput }: PageHeadSearchInput
) {
  const {
    color,
    align,
    autoFocus,
    disabled,
    borderRadius,
    backgroundColor,
    placeholder,
    placeholderColor,
  } = navigationBar.searchInput!
  const searchStyle = {
    borderRadius,
    backgroundColor,
  }
  const placeholderClass = [
    'uni-page-head-search-placeholder',
    `uni-page-head-search-placeholder-${
      focus.value || text.value ? 'left' : align
    }`,
  ]
  return (
    <div class="uni-page-head-search" style={searchStyle}>
      <div style={{ color: placeholderColor }} class={placeholderClass}>
        <div class="uni-page-head-search-icon">
          {createSvgIconVNode(ICON_PATH_SEARCH, placeholderColor, 20)}
        </div>
        {text.value || composing.value ? '' : placeholder}
      </div>
      <Input
        focus={autoFocus}
        disabled={disabled}
        style={{ color }}
        placeholder-style={{ color: placeholderColor }}
        class="uni-page-head-search-input"
        confirm-type="search"
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={onInput}
      />
    </div>
  )
}

function usePageHead(navigationBar: UniApp.PageNavigationBar) {
  const clazz = computed(() => {
    const { type, titlePenetrate, shadowColorType } = navigationBar
    const clazz: Record<string, boolean> = {
      'uni-page-head': true,
      'uni-page-head-transparent': type === 'transparent',
      'uni-page-head-titlePenetrate': titlePenetrate === 'YES',
      'uni-page-head-shadow': !!shadowColorType,
    }
    if (shadowColorType) {
      clazz[`uni-page-head-shadow-${shadowColorType}`] = true
    }
    return clazz
  })
  const style = computed(() => {
    const backgroundColor =
      __UNI_FEATURE_NAVIGATIONBAR_TRANSPARENT__ &&
      navigationBar.type === 'transparent'
        ? usePageHeadTransparentBackgroundColor(navigationBar.backgroundColor!)
        : navigationBar.backgroundColor
    return {
      backgroundColor,
      color: navigationBar.titleColor,
      transitionDuration: navigationBar.duration,
      transitionTimingFunction: navigationBar.timingFunc,
    }
  })
  return {
    clazz,
    style,
  }
}

interface PageHeadButton {
  btnClass: UniApp.ClassObj
  btnStyle: UniApp.StyleObj
  btnText: string
  btnIconPath?: string
  badgeText?: string
  iconStyle: UniApp.StyleObj
}

interface PageHeadButtons {
  left: PageHeadButton[]
  right: PageHeadButton[]
}

function usePageHeadButtons(navigationBar: UniApp.PageNavigationBar) {
  const left: PageHeadButton[] = []
  const right: PageHeadButton[] = []
  const { buttons } = navigationBar
  if (isArray(buttons)) {
    const { type } = navigationBar
    const isTransparent = type === 'transparent'
    const fonts = Object.create(null)
    buttons.forEach((btn) => {
      if (btn.fontSrc && !btn.fontFamily) {
        const fontSrc = getRealPath(btn.fontSrc)
        let fontFamily = fonts[fontSrc]
        if (!fontFamily) {
          fontFamily = `font${Date.now()}`
          fonts[fontSrc] = fontFamily
          updateStyle(
            'uni-btn-' + fontFamily,
            `@font-face{font-family: "${fontFamily}";src: url("${fontSrc}") format("truetype")}`
          )
        }
        btn.fontFamily = fontFamily
      }
      const pageHeadBtn = usePageHeadButton(btn, isTransparent)
      if (btn.float === 'left') {
        left.push(pageHeadBtn)
      } else {
        right.push(pageHeadBtn)
      }
    })
  }
  return { left, right }
}

function usePageHeadButton(
  btn: UniApp.PageNavigationBarButton,
  isTransparent: boolean
) {
  const iconStyle: UniApp.StyleObj = {
    color: btn.color,
    fontSize: btn.fontSize,
    fontWeight: btn.fontWeight,
  }
  if (btn.fontFamily) {
    iconStyle.fontFamily = btn.fontFamily
  }
  return {
    btnClass: {
      // 类似这样的大量重复的字符串，会在gzip时压缩大小，无需在代码层考虑优化相同字符串
      'uni-page-head-btn': true,
      'uni-page-head-btn-red-dot': !!(btn.redDot || btn.badgeText),
      'uni-page-head-btn-select': !!btn.select,
    },
    btnStyle: {
      backgroundColor: isTransparent ? btn.background : 'transparent',
      width: btn.width,
    },
    btnText:
      btn.fontSrc && btn.fontFamily ? btn.text.replace('\\u', '&#x') : btn.text,
    btnIconPath: ICON_PATHS[btn.type],
    badgeText: btn.badgeText,
    iconStyle,
  }
}

interface PageHeadSearchInput {
  focus: Ref<boolean>
  text: Ref<string>
  composing: Ref<boolean>
  onFocus: () => void
  onBlur: () => void
  onInput: (evt: { detail: { value: string } }) => void
}

function usePageHeadSearchInput(navigationBar: UniApp.PageNavigationBar) {
  const focus = ref(false)
  const text = ref('')
  const composing = ref(false)
  function onFocus() {
    focus.value = true
  }
  function onBlur() {
    focus.value = false
  }
  function onInput(evt: { detail: { value: string } }) {
    text.value = evt.detail.value
  }
  return {
    focus,
    text,
    composing,
    onFocus,
    onBlur,
    onInput,
  }
}