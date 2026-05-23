---
name: excalidraw-generator
description: 사용자의 기존 스타일을 따라 ML/DL/아키텍처 개념을 시각화하는 excalidraw 파일을 생성한다. 사용자가 "excalidraw 만들어줘", "다이어그램 그려줘", "그림으로 보여줘", "도식화" 같은 요청을 하면 자동 발동.
---

# Excalidraw 생성 스킬

사용자가 ML/DL/아키텍처 개념을 시각화해달라고 요청할 때 사용한다. 사용자의 기존 작업물 스타일을 엄격히 따라야 한다.

## 절대 규칙 (Hard rules)

1. **글자 최소화** — 줄글로 설명하지 마라. 사용자는 *시각화*를 원해서 excalidraw를 쓰는 거다. 글자가 많아지면 의미 없음. 그림으로 표현 가능한 건 무조건 그림으로.
2. **겹침 금지** — 텍스트끼리, 도형끼리, 텍스트와 도형 모두 절대 겹치지 않게. 좌표 계산 시 검증.
3. **폰트 통일** — 모든 텍스트에 `fontFamily: 8` (Comic Shanns) 사용. 예외 없음.
4. **행렬은 그리드로** — (n, m) 행렬은 사각형 셀 그리드로 표현. 큰 박스 하나로 뭉뚱그리지 말 것. (`self_attention_train.excalidraw`, `kv_cache_matmul.excalidraw` 참조)
5. **읽는 사람 관점** — 처음 보는 사람도 한눈에 이해할 수 있는 구조로. 라벨·범례·색 구분이 명확해야 함.

## 사용자 스타일 규칙 (기존 작업물에서 추출)

### 제목·서브타이틀
- 제목: `✱ <이름>` 형식, 큰 폰트 사이즈 (28~32)
- 서브타이틀: 핵심 수식이나 한 줄 설명 (예: `Attention = softmax(Q·K^T/√d_k) · V`)

### 색상 팔레트 (배경 + 매칭 stroke)

| 의미 | 배경색 | stroke 색 |
|---|---|---|
| 새로 계산/추가 | `#c6f6d5` (mint) | `#2f855a` |
| cache/저장됨 | `#bee3f8` (light blue) | `#2c5282` |
| 불필요/redundant | `#e2e8f0` (light gray) | `#718096` |
| masked/경고 | `#fef5e7` (light yellow, dashed stroke) | `#b7791f` |
| 강조/highlight | `#fff3bf` (yellow) | `#e67700` |
| 대안/alternative | `#ffd8a8` (orange) | `#e67700` |
| 기본 텍스트 | transparent | `#1e1e1e` |

### 행렬 표현 컨벤션

- 셀 크기: feature 차원 셀은 ~26px, score/labeled 셀은 ~56px (사용자 기존 값)
- 행 라벨(토큰명·인덱스)은 그리드 **왼쪽**에 배치
- 열 라벨은 그리드 **위쪽**에 배치
- 큰 차원은 `⋯` (U+22EF)로 생략 표현
- 셀 내부 라벨: `s₁₁`, `s₂₁` 같은 첨자 인덱스 또는 토큰명("나는", "오늘")
- 수식 기호(×, =, +)는 행렬 사이에 **대형 폰트**로 배치

### 레이아웃
- 다단계(Step 1/Step 2/...) 다이어그램은 세로로 적층
- 패널 사이 구분선: `strokeStyle: dashed`, 색상 `#cbd5e0`
- 범례(legend)는 상단 또는 좌상단
- 주석·설명 텍스트는 그래프 오른쪽에 배치 (그래프 내부 X)

## 생성 절차

1. **레이아웃 먼저 계획**
   - 어떤 패널이 필요한가 (Step 수)
   - 각 패널에 어떤 행렬이 있는가
   - 행렬 차원 (n, m)
   - 색 구분이 필요한 영역

2. **좌표·치수 계산**
   - 셀 크기 결정 (26 or 56)
   - 행렬 간 간격 (수식 기호 자리)
   - 패널 간 세로 간격
   - 모든 요소가 겹치지 않게 grid 단위로 배치

3. **JSON 생성** (Python 스크립트 활용 권장)
   - Excalidraw 파일 포맷: `{"type":"excalidraw","version":2,"source":"...","elements":[...],"appState":{...},"files":{}}`
   - 각 element는 고유 `id`, `x`, `y`, `width`, `height` 등 필수 필드 포함
   - 텍스트는 `type:"text"`, `fontFamily:8`
   - 도형은 `type:"rectangle"|"line"|"arrow"|"ellipse"`

4. **검증**
   - 텍스트 영역이 도형과 겹치지 않는지
   - 패널끼리 겹치지 않는지
   - 같은 의미의 셀이 동일 색상인지

5. **저장 경로**
   - 학습 자료용: `/Users/nhncommerce/nhn/dueui/study/assets/raw_excalidraw/<name>.excalidraw`
   - 블로그 포스트용: `/Users/nhncommerce/nhn/dueui/techlog/content/posts/<slug>/<name>.excalidraw`
   - 같은 위치에 `.png` 또는 `.svg` 익스포트도 함께 생성 가능 (qlmanage 등 활용)

## 참조 파일 (사용자 기존 작업물)

`/Users/nhncommerce/nhn/dueui/study/assets/raw_excalidraw/` 에 있는 파일들이 정답 스타일이다. 새 다이어그램 만들기 전에 가장 유사한 기존 파일을 한 번 읽어서 패턴 확인 권장:

| 파일 | 어떤 패턴 |
|---|---|
| `self_attention_train.excalidraw` | 학습 시 self-attention, (n, d_k) 그리드 |
| `kv_cache_matmul.excalidraw` | 단계별(Step 1/2) cache 진화. 색 구분이 핵심 |
| `multi_head_attention.excalidraw` | 병렬 head 레이아웃, head별 색 구분 |
| `train_prefill_decode.excalidraw` | train vs prefill vs decode 비교 |

## 안티패턴 (하면 안 되는 것)

- ❌ 행렬을 큰 박스 하나로만 그리기 (반드시 셀 그리드)
- ❌ 설명을 그래프 안에 긴 문장으로 적기 (라벨·기호로 표현)
- ❌ fontFamily가 8이 아닌 다른 값
- ❌ 색상 일관성 없이 마구잡이 색 (위 팔레트 안에서 사용)
- ❌ 텍스트가 셀과 겹치게 배치
- ❌ 범례 누락 (색을 여러 개 쓸 때)
