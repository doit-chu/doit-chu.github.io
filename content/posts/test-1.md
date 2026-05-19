---
title: "테스트1: BigQuery에서 GA4 이벤트 파싱하기"
date: 2026-05-19T10:00:00+09:00
draft: false
categories: ["Data"]
tags: ["BigQuery", "GA4"]
summary: "GA4 이벤트 파라미터를 BigQuery에서 UNNEST로 꺼내쓰는 패턴 정리."
---

GA4 이벤트는 `event_params`에 key-value 형태로 쌓이기 때문에, 분석할 때마다 UNNEST가 필요하다.

## 기본 패턴

```sql
SELECT
  event_date,
  event_name,
  (SELECT value.string_value
   FROM UNNEST(event_params)
   WHERE key = 'page_location') AS page_location
FROM `project.analytics_xxx.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20260501' AND '20260519'
```

## 여러 파라미터 한 번에

같은 이벤트에서 여러 키를 뽑을 땐 서브쿼리를 키마다 쓰지 말고 LEFT JOIN UNNEST로:

```sql
SELECT
  event_name,
  MAX(IF(p.key = 'page_location', p.value.string_value, NULL)) AS page_location,
  MAX(IF(p.key = 'page_title',    p.value.string_value, NULL)) AS page_title
FROM `project.analytics_xxx.events_*`,
UNNEST(event_params) AS p
GROUP BY event_date, event_timestamp, event_name
```

> 비용 절감 팁: `_TABLE_SUFFIX`로 파티션을 반드시 좁힐 것. 안 그러면 전체 스캔.

## 정리

- UNNEST는 비용·가독성 트레이드오프가 큼
- 자주 쓰는 파라미터는 뷰로 묶어두면 편함
