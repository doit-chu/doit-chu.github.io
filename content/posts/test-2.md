---
title: "테스트2: Claude로 Airflow DAG 자동 생성하기"
date: 2026-05-19T11:00:00+09:00
draft: false
categories: ["AI"]
tags: ["Claude", "Airflow", "LLM"]
summary: "반복적인 DAG 작성을 Claude에 맡겨봤다. 어디까지 자동화할 수 있고, 어디부턴 사람이 봐야 하는지."
---

## 동기

비슷한 패턴의 ETL DAG을 반복해서 작성하는 게 지겨워졌다. 테이블 정의·스케줄·태스크 의존성만 알려주면 Claude가 DAG을 뽑아주게 시도해봤다.

## 입력 포맷

YAML로 메타정보만 넘긴다.

```yaml
dag_id: ga4_daily_summary
schedule: "0 5 * * *"
start_date: 2026-05-01
tasks:
  - name: extract_events
    sql: queries/extract_events.sql
  - name: aggregate
    depends_on: [extract_events]
    sql: queries/aggregate.sql
  - name: notify
    depends_on: [aggregate]
    type: slack
```

## Claude 프롬프트 핵심

- 우리 회사 Airflow 컨벤션을 system prompt에 박아넣기
- output을 항상 python 파일 한 개로 강제
- import 순서·docstring·태스크 이름 규칙 명시

## 한계

| 항목 | 자동화 | 사람이 봐야 함 |
|---|---|---|
| 표준 DAG 골격 | ✅ | |
| 태스크 의존성 | ✅ | |
| 실패 알림 채널 매핑 | | ✅ |
| Retry/SLA 정책 | | ✅ |
| 권한·시크릿 | | ✅ |

요약하면 **뼈대까지는 LLM, 운영 정책은 사람**이 맞다.
