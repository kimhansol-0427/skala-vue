# skala-vue — SKALA Vue.js 실습

## 과제 진행 기록

### Day 1 - Vue 문법 (디렉티브·이벤트·폼)

**과제 1: 날씨 Mockup** (`src/components/exercise/WeatherMockup.vue`)

- v-for + :key, v-if/v-else, :value+@input, @click/@click.stop 요구사항 구현
- 커스터마이징: 도시 4곳(서울/울산/강릉/제주)으로 변경, 즐겨찾기 별표 기능 추가,
  미세먼지 배지(v-else-if 체인) 추가, 날씨 상태별 여행 추천 문구(getActivity 함수) 추가

### Day 2-1 - Composition API (computed·watch·watchEffect)

**과제 2: 날씨 컴포지션** (`src/components/exercise/WeatherComposition.vue`)

**과제 2: 날씨 컴포지션** (`src/components/exercise/WeatherComposition.vue`)

- computed(filteredWeatherList)로 실시간 검색 필터링 구현
- watch(selectedCityInfo)로 카드 선택 시 콘솔 로그, watchEffect로 검색어 변화 자동 추적
- 커스터마이징: 어제 만든 도시 4곳·즐겨찾기·미세먼지·여행 추천 문구 그대로 유지,
  검색 결과 개수를 보여주는 resultCountLabel computed 추가로 신설

---

이 아래는 Vue 기본 템플릿 안내입니다.
...

## skala-vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
