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

### 파라미터 명명 컨벤션 (필수)

| 학술 표기 | 사용자 표기 | 의미 |
|---|---|---|
| `d_model` | **`hidden_dim`** | 모델 hidden 차원 (각 토큰 representation 크기) |
| `d_k`, `d_q`, `d_v` | **`head_dim`** | head별 key/query/value 차원 (= hidden_dim / num_heads) |
| `N` | `N` | 시퀀스 길이 (그대로) |
| `h`, `H` | `n_head` 또는 `num_heads` | head 개수 |

새 다이어그램 작성 시 `d_model`, `d_k` 등 학술 표기 쓰지 말 것. 위 사용자 표기 통일.

### 우측 하단 워터마크 (모든 이미지 필수)

모든 excalidraw에 우측 하단(시각화 영역 가장 우하단)에 `doit-chu.github.io` 텍스트 추가:
- `fontSize`: 10~11
- `strokeColor`: `#555`
- 위치: 콘텐츠 max_x + max_y 모서리 근방

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

## 출력 전 self-review (3패스 필수)

`create_view` 호출 또는 파일 저장 **직전**에 아래 체크리스트를 3패스 돈다. LLM은 실제 렌더 결과를 볼 수 없으므로 **좌표·코드 기반 검증**만 가능. 각 패스에서 문제 발견 시 코드 수정 후 다시 검증.

**Pass 1 — 정렬·좌표**
- 각 박스의 `cx = x + w/2`, `cy = y + h/2`를 계산해 둔다
- 부모 박스 아래에 붙는 자식 요소(행렬·텍스트 그룹)의 중심이 부모 `cx`와 일치하는가
- 같은 row의 박스들은 동일한 `y`, 동일한 `height` 인가
- 화살표의 시작점·끝점이 박스 가장자리(`x`, `x+w`, `y`, `y+h`)에 정확히 닿는가, 떠 있지는 않은가
- 박스 간 간격(`gap`)이 일정한가

**Pass 2 — 폰트·기호·라벨**
- 모든 text 요소가 `fontFamily: 8`
- 특수문자(`⊕`, `⊗`, `∂`, `ℓ`, `→`) 는 Excalidraw 폰트에서 빈 글리프로 렌더될 수 있음 → 의심되면 텍스트 라벨(`Add`, `grad`, `loss` 등)로 교체
- 라벨 길이가 박스 폭을 넘는가: `len(text) * fontSize * 0.55 > box_width` 면 잘림
- `label` 필드 누락된 박스 없는가 ("값이 비어 보이는" 원인)
- 최소 폰트 크기: body 16, title 20 (camera XL이면 body 21)

**Pass 3 — 시각적 연속성**
- 떠 있는(아무 박스에도 연결되지 않은) 화살표 없는가
- 화살표가 다른 박스/텍스트 위를 가로지르지 않는가
- skip/backward 같은 점선이 본 흐름선과 같은 색이라 혼동되지는 않는가 (skip은 회색 `#a0a0a0`, backward는 mint `#22c55e` 권장)
- 색을 2개 이상 썼는데 범례가 빠지지 않았는가
- 같은 의미(예: cache·새로 계산·정답)는 같은 색·stroke 조합인가

3패스 완료 후 사용자에게 한 줄 보고:
> "self-review 3패스 완료, n개 수정함 (요약: ...)"

## 사용자 스타일 — 내부 구조 nested 그리기 (중요)

ML 컴포넌트(Transformer block, Attention 등)를 그릴 때 **박스 하나로 추상화하지 말고 내부를 nested rectangle로 풀어서** 그릴 것. 사용자는 "박스에 라벨" 보려는 게 아니라 **모든 텐서의 shape와 흐름을 시각적으로** 보려고 excalidraw를 쓴다.

### 원칙

1. **Decoder Block 같은 복합 컴포넌트는 nested 박스로 풀어서**
   - 바깥: `Decoder Blocks × 32` (큰 컨테이너)
   - 안: `Multi Head Attention × 32` (중간 컨테이너)
   - 그 안: `Self Attention` (안쪽 컨테이너)
   - 그 안: Q, K, V 행렬들의 **실제 cell grid**

2. **모든 행렬을 실제 cell grid로** (라벨 박스 X)
   - Q, K, V, K^T, score matrix, output matrix 전부 cell-by-cell
   - cell 크기 ~22px, color는 의미별 구분
   - 행/열 라벨 (토큰명·`hidden_dim`·`vocab_size`) 항상 붙이기
   - shape 어노테이션 옆에 `[2, head_dim]`, `[1, 3]` 등 명시

3. **연산자를 시각화** (텍스트 라벨 X)
   - 잔차 합: `⊕` 또는 `+` 큰 폰트로 박스 사이에
   - Emb + PE 같은 덧셈: `+` 기호 보이게
   - 행렬 곱: `×` 큰 폰트
   - 전치: `K^T` 라벨 + 실제 회전된 grid로

4. **KV cache는 별도 컨테이너로 라벨**
   - `GPU Cache` 같은 명시적 박스 컨테이너 (Decoder block 안에 위치)
   - 안에 K matrix와 V matrix grid 그리기
   - 새로 append되는 row는 별도 색 (mint #38d9a9 / green #40c057)
   - 기존 row는 dim color (gray #dee2e6) 또는 본래 색

5. **입출력 행렬을 main flow 별도 위치에 그리기**
   - LM Head 옆/아래에 logits matrix `[N, vocab_size]` 실제 cell grid
   - Embedding 옆/아래에 input hidden state matrix `[N, hidden_dim]` 실제 cell grid
   - 행 라벨 = 토큰명, 열 라벨 = 차원 이름 + `⋯` 생략

### 색 의미 (사용자 작업에서 추출)

| 색 (배경) | 의미 |
|---|---|
| `#a5d8ff` (light blue) | K (key) 행렬 / cache의 K |
| `#ffa94d` (orange) | V (value) 행렬 / cache의 V |
| `#ffe066` (yellow) | attention score / 정답 highlight |
| `#9775fa` (purple) | output / context 행렬 |
| `#38d9a9` `#40c057` (mint/green) | NEW (이번 step append) |
| `#dee2e6` (gray) | 기존 / dim 처리 |
| `#fd7e14` (orange) | 강조 / highlight |
| `#ffc9c9` (light red) | loss / 경고 |

### 안티패턴 (이 스킬에서 가장 흔한 실수)

- ❌ `Decoder Blocks × 32` 박스 하나로 끝내기 → ✅ 내부 MHA → SA → Q/K/V까지 풀어 그리기
- ❌ KV cache를 "cache 저장됨" 텍스트로 → ✅ 실제 K, V cell grid를 `GPU Cache` 컨테이너 안에
- ❌ "Emb + PE → [N, hidden_dim]" 라벨만 → ✅ Emb box + `+` 기호 + PE box, 옆에 결과 matrix grid
- ❌ 토큰 박스만 → ✅ 토큰 박스 → 화살표 → 실제 hidden state matrix grid
- ❌ 색을 3-4개로 단순화 → ✅ 의미별로 7-8개 색 적극 사용 (위 팔레트)

### 참조

사용자가 직접 수정한 `train_prefill_decode_tmp.excalidraw` (293 elements)가 이 스타일의 정답 사례. 새 ML 다이어그램 만들기 전에 한 번 열어볼 것.

### PNG 자동 출력 (techlog 전용)

excalidraw 파일을 저장한 직후 **반드시** PNG도 같은 폴더·같은 이름으로 떨어뜨릴 것.

```bash
node /Users/nhncommerce/nhn/dueui/techlog/.claude/tools/excalidraw-to-png.js <input.excalidraw>
```

- 출력: 같은 경로의 `<input>.png` (기본 scale=2). `<output.png> [scale]` 인자로 변경 가능.
- 도구는 `techlog/.claude/tools/` 로컬 설치된 puppeteer + `@excalidraw/utils` 사용 (네트워크 불필요).
- 한글 폰트·셀 그리드·화살표·바인딩 모두 정상 렌더링됨 (검증 완료).
- 변환 실패 시 사용자에게 보고하고 excalidraw 파일은 그대로 유지.
