# skala-vue - Vue.js 실습

**배포 주소: <https://kimhansol-0427.github.io/skala-vue/>**

---

## 기술 스택

- Vue 3 (Composition API, `<script setup>`)
- Vite
- Vue Router 4
- Pinia
- Axios
- Element Plus (UI 라이브러리)
- OpenWeatherMap API (Current Weather, Air Pollution, Geocoding)

---

## 과제 진행 기록

### Day 1 - Vue 문법 (디렉티브·이벤트·폼)

**과제 1: 날씨 Mockup** (`src/components/exercise/WeatherMockup.vue`)

- `v-for` + `:key`, `v-if`/`v-else`, `:value`+`@input`, `@click`/`@click.stop` 요구사항 구현
- 커스터마이징: 도시 4곳(서울/울산/강릉/제주)으로 변경, 즐겨찾기 별표 기능, 미세먼지 배지(`v-else-if` 체인), 날씨 상태별 활동 추천 문구(`getActivity` 함수) 추가

### Day 2 - Composition API & 컴포넌트 분리

**과제 2: 날씨 컴포지션** (`src/components/exercise/WeatherComposition.vue`)

- `computed(filteredWeatherList)`로 실시간 검색 필터링 구현
- `watch(selectedCityInfo)`로 카드 선택 시 콘솔 로그, `watchEffect`로 검색어 변화 자동 추적
- 커스터마이징: `resultCountLabel` computed 신규 추가 (검색 결과 개수 표시)

**과제 3: 날씨 컴포넌트 분리** (`src/components/exercise/WeatherParent.vue`)

- `BaseDashboardCard`, `SearchBar`, `WeatherCard`로 컴포넌트 분리
- `props`/`emits`로 부모-자식 데이터 통신 (`select-card`, `toggle-favorite`, `click-detail`)

### Day 3 - Pinia, Vue Router, Axios 실전 적용

**과제 6: Axios 적용** (라우터 블록, `ExerciseApp.vue` 내 `<RouterView />`)

- Pinia `configStore`로 섭씨/화씨 단위 전역 상태 관리 (`UnitToggler.vue`)
- Vue Router 4로 `/`, `/about`, `/today`, `/weather/:cityId` 등 라우팅 구성
- `axios.get` + `Promise.all`로 4개 도시 날씨를 병렬 호출, `async/await` + `try/catch/finally`로 로딩·에러 처리
- OpenWeatherMap Air Pollution API 추가 연동으로 실시간 미세먼지 반영
- `WeatherDetailView.vue`: 도시별 상세 정보(습도·풍속), 섭씨/화씨 자동 변환, 공유 링크 생성
- `WeatherTodayView.vue`: 즐겨찾기/최근 조회 이력 기반 "오늘의 한마디" 대표 도시 추천 로직

### Day 4 - UI 라이브러리, 빌드 & 배포

- Element Plus 적용: `el-card`, `el-tag`, `el-button`, `ElMessage` 등으로 카드 UI/알림 개선
- 도시 이름/영문 매핑표(`cityNameMap`)를 이용해 한글로도 다른 지역 검색 가능하도록 구현
- ESLint(`npm run lint`) 0 errors, Prettier(`npm run format`)로 코드 정렬
- API 키를 `.env.local`(`VITE_WEATHER_API_KEY`)로 분리, `.gitignore`(`*.local`)로 Git 노출 방지
- `vite.config.js`에 `base: '/skala-vue/'` 설정, `npm run build`로 `dist/` 생성
- `gh-pages` 패키지로 GitHub Pages 배포 (`npm run deploy`)

---

## Code Challenge 실습 (PracticeApp.vue)

### 기초 문법 실습 (`components/practices/basic/`)

- v-html, v-text, v-bind, class/style 바인딩, v-if/v-show, v-for, v-pre/v-cloak/v-once/v-memo
- 이벤트 핸들러, 이벤트 객체, 이벤트 수식어
- v-model, 폼 요소 핸들링, v-model 수식어

### Composition API 실습 (`components/practices/composition/`)

- ref, reactive, computed, watch, watchEffect

### 컴포넌트 통신 실습 (`components/practices/component/`)

- 생명주기 훅, props/emits, 기본/이름/스코프 슬롯

### Pinia 실습 (`components/practices/pinia/`, `stores/counter.js`)

- `CounterStoreExample.vue`: state(count)·getters(doubleCount)·actions(increment) 기본 흐름

### 라이브러리 실습 (`components/practices/library/`)

- `StoreCounter.vue`: Pinia 스토어를 다른 컴포넌트에서 재사용 (싱글턴 동작 확인)
- `AxiosJson.vue`: JSONPlaceholder API로 GET·POST·PUT·DELETE CRUD 실습
- `AxiosWeatherExample.vue`: `axios.get` + `try/catch/finally` 기본 통신 패턴 검증
- `RegisterFormExample.vue`: Element Plus(`el-input`, `el-switch`, `ElMessage`)로 회원가입 폼 검증
- `ProductQuantityExample.vue`: Element Plus(`el-input-number`, `el-rate`)로 수량/평점 시스템
- `ProgressExample.vue`: Element Plus(`ElMessageBox.confirm`, `el-progress`)로 확인창·진행률 인터랙션

---

## 로컬 실행 방법

```bash
npm install
npm run dev
```

`.env.local`

VITE_WEATHER_API_KEY=887e88f7fd26b5ac945709a48503c9bd

---

## 빌드 & 배포

```bash
npm run build     # dist/ 생성
npm run deploy    # 빌드 + GitHub Pages(gh-pages 브랜치) 배포
```

---

## 다음은 Vue 기본 템플릿 안내입니다

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
