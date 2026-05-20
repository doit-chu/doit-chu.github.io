# 글쓰기 스니펫 모음

글 쓸 때 자주 쓸 패턴들. 복붙해서 사용.

---

## 기본 마크다운

### 제목
```markdown
## 큰 섹션
### 소제목
#### 더 작은 제목
```

### 강조
```markdown
**굵게**
*기울임*
~~취소선~~
`인라인 코드`
<mark>형광펜</mark>
```

### 줄바꿈
```markdown
한 줄 끝에 공백 2칸  
다음 줄

또는 빈 줄 한 줄 띄우기

또는 <br> 직접
```

### 구분선
```markdown
---
```

### 링크
```markdown
[보이는 텍스트](https://example.com)
```

### 목록
```markdown
- 항목 1
- 항목 2
  - 중첩 항목
- 항목 3

1. 첫 번째
2. 두 번째
```

### 체크리스트
```markdown
- [x] 완료
- [ ] 미완료
```

---

## 코드 블록 (기본)

````markdown
```python
def hello():
    print("hi")
```
````

## 코드 블록 (줄번호·특정 줄 강조)

`highlight` 숏코드를 쓰면 줄번호 표시·특정 줄 강조 가능:

```markdown
{{< highlight python "linenos=table,hl_lines=2 4-6,linenostart=1" >}}
def main():
    print("이 줄이 강조됨")
    x = 1
    if x > 0:
        print("이 줄도")
        print("이 줄도")
    return x
{{< /highlight >}}
```

옵션 (필요한 것만 골라서):
- `linenos=table` — 줄번호 표시
- `linenostart=10` — 시작 줄번호 (10번째부터)
- `hl_lines=2` — 2번째 줄 강조 (배경색)
- `hl_lines=2 4-6` — 2번째, 4~6번째 강조
- `anchorlinenos=true` — 줄번호 클릭 시 링크

````markdown
```sql
SELECT * FROM users WHERE id = 1;
```
````

지원 언어: python, sql, javascript, typescript, go, bash, yaml, json, html, css, java, kotlin, rust, c, cpp, ruby, php, r, scala, swift 등

---

## 인용

```markdown
> 인용문은 이렇게.
> 여러 줄도 가능.
```

---

## 표

```markdown
| 왼쪽 | 가운데 | 오른쪽 |
|:---|:---:|---:|
| a | b | c |
| d | e | f |
```

호버하면 행이 살짝 강조됨.

---

## 이미지

기본:
```markdown
![alt 텍스트](/images/posts/카테고리/파일명.png)
```

캡션 붙이기 (가운데 정렬 + 작은 글씨):
```markdown
{{< figure2 src="이미지.png" alt="설명" caption="이미지 캡션" >}}
```

이미지는 글과 같은 폴더에 두고 파일명만 적으면 됨 (페이지 번들).
캡션 없으면 caption 생략:
```markdown
{{< figure2 src="이미지.png" alt="설명" >}}
```

### 크기 조정

기본 마크다운 `![](...)` 문법은 사이즈 조정 불가. 다음 셋 중 선택:

1) HTML 직접 (간단):
```html
<img src="이미지.png" width="400">
<img src="이미지.png" width="60%">
<img src="이미지.png" style="max-width: 500px;">
```

2) figure2 숏코드에 `width` 옵션:
```markdown
{{< figure2 src="이미지.png" alt="설명" caption="캡션" width="500px" >}}
{{< figure2 src="이미지.png" caption="60%만" width="60%" >}}
```
단위: `px`, `%`, `em` 등 CSS 단위 다 됨.

3) 본문에 한 줄 끼워넣기:
```markdown
다음은 수식입니다.

<img src="이미지.png" width="400">

이런 식으로 본문 흐름에.
```

---

## 접히는 박스

```markdown
{{< fold "여기 누르면 펼쳐짐" >}}

여기 본문. 마크다운 그대로 됨.

- 항목 1
- 항목 2

{{< /fold >}}
```

제목 생략하면 "펼치기"가 기본값:
```markdown
{{< fold >}}
숨겨둘 내용
{{< /fold >}}
```

---

## 콜아웃 박스

기본 사용법:
```markdown
{{< callout "info" >}}
정보 박스 내용.
{{< /callout >}}
```

제목 붙이기 (두 번째 인자):
```markdown
{{< callout "info" "참고" >}}
타이틀이 있는 박스.
{{< /callout >}}
```

타입은 5종:

| 타입 | 색 | 아이콘 | 용도 |
|---|---|---|---|
| `info` | 파랑 | 💡 | 참고·부연설명 |
| `tip` | 초록 | ✅ | 팁·잘 한 것 |
| `warning` | 주황 | ⚠️ | 주의사항 |
| `danger` | 빨강 | 🚫 | 위험·금지 |
| `note` | 회색 | 📝 | 일반 메모 |

예시:
```markdown
{{< callout "warning" "주의" >}}
이 코드는 운영 DB에서 실행하지 말 것.
{{< /callout >}}
```

---

## 인라인 배지 (chip)

```markdown
{{< chip "blue" "NEW" >}}
{{< chip "green" "완료" >}}
{{< chip "yellow" "WIP" >}}
{{< chip "red" "긴급" >}}
{{< chip "purple" "리뷰" >}}
{{< chip "gray" "보류" >}}
{{< chip "" "기본" >}}
```

색상: `blue`, `green`, `yellow`, `red`, `purple`, `gray`, 비워두면 기본.

문장 안에서 라벨처럼 쓰기 좋음:
```markdown
이 기능 {{< chip "blue" "NEW" >}} 추가했어요.
```

---

## 형광펜

```markdown
이 문장에서 <mark>여기만 형광</mark>으로 표시.
```

다크모드에선 자동으로 어두운 노랑.

---

## 글씨 색상

숏코드 (짧은 문장):
```markdown
이 단어는 {{< c "red" "빨간" >}} 색입니다.
{{< c "#3b82f6" "파란" >}} 글자.
{{< c "green" "초록" >}} 글자.
```

색은 이름(`red`, `blue`, `green`, `gray` 등) 또는 HEX(`#ff5733`) 둘 다 가능.

HTML 직접 (긴 문장):
```html
<span style="color: red">긴 문장을 통째로 빨간색으로</span>
<span style="color: #888">회색 텍스트</span>
```

---

## 들여쓰기 코드블록 (메모 박스)

줄 앞에 **공백 4칸 또는 탭**을 넣으면 자동으로 회색 메모 박스로 렌더됨. 가벼운 부연 설명용.

```
    이렇게 들여쓰면 메모 박스가 됩니다.
    여러 줄도 가능합니다.
```

일반 코드(`'''`)는 검정 배경 + 줄번호 라벨 그대로. 둘이 시각적으로 구분됨.

---

## 메모 박스 (note1 ~ note4)

수식·마크다운 다 자유롭게 들어감.

| 숏코드 | 스타일 | 분위기 |
|---|---|---|
| `note1` | 점선 박스 | 가볍게 메모 |
| `note2` | 카드 + 그림자 | 부각·강조 |
| `note3` | 크림 배경 | 종이 느낌, 부드러움 |
| `note4` | 핑크 배경 | 따뜻한 강조 |

사용 예:
```markdown
{{< note1 >}}
점선 박스 안에 자유롭게 마크다운 작성.

- 항목 1
- 수식 $E = mc^2$

**굵게**도 됨.
{{< /note1 >}}
```

`note2`, `note3`, `note4`도 동일한 방식 (숫자만 바꿔서).

---

## 수식 (LaTeX)

### 인라인
```markdown
이 식은 $E = mc^2$ 입니다.
```

### 블록
```markdown
$$
F = \frac{(1+\beta^2)PR}{\beta^2(P+R)}
$$
```

자주 쓰는 기호:
- `\frac{a}{b}` → 분수
- `\sqrt{x}` → 루트
- `\sum_{i=1}^{n}` → 시그마
- `\alpha`, `\beta`, `\gamma` 등 → 그리스 문자
- `\quad` → 큰 공백
- `\;` → 작은 공백

---

## 각주

본문 흐름을 깨지 않고 **부가 설명·출처를 글 맨 아래에 따로 모아두는** 기능. 책의 각주와 같음.

### 작성 방법

```markdown
딥러닝은 보통 GPU에서 학습합니다[^1]. Vespa는 검색 엔진이지만 추천에도 씁니다[^vespa].

[^1]: CPU로도 가능하지만 10~100배 느립니다.
[^vespa]: https://vespa.ai
```

### 화면에 보이는 모습

- 본문엔 위 첨자 숫자(¹, ²)가 붙음
- 글 맨 아래에 각주 목록이 자동으로 모임
- 위 첨자 클릭 → 각주로 점프
- 각주 옆 ↩ 클릭 → 본문 원래 자리로 복귀

### 식별자 규칙

`[^1]`, `[^vespa]`처럼 식별자는 **본인이 알아보기 좋은 거 아무거나** (숫자/영문/한글 가능). 화면에 표시되는 번호는 Hugo가 자동으로 1, 2, 3... 매김.

### 언제 쓰면 좋나

- 출처·참고 문헌 표기
- 본문 흐름엔 안 어울리지만 짚고 갈 만한 부연설명
- 용어 정의 (본문에 박으면 길어지는 거)

---

## frontmatter 템플릿

새 글 만들 때 맨 위에 복붙:

```yaml
---
title: "제목"
date: 2026-05-20T10:00:00+09:00
draft: false
categories: ["블로그이전"]
tags: ["태그1", "태그2"]
summary: "글 목록에 보이는 요약문 (생략하면 본문 앞부분)"
---
```

`draft: true`로 두면 로컬 미리보기에만 보이고 배포 안 됨.

---

## 자주 묻는 거

**Q. 글에 이미지 어디 넣어요?**
A. `static/images/posts/원하는-폴더/파일명.png`. 본문에선 `/images/posts/원하는-폴더/파일명.png`로 참조.

**Q. 글 미리보기는?**
A. 터미널에서 `hugo server` → `http://localhost:1313`.

**Q. 글 배포는?**
A. `git add . && git commit -m "메모" && git push`. 1~2분 후 https://doit-chu.github.io 에 반영.
