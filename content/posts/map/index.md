---
title: "Maximum a Posterior Estimation (MAP)"
date: 2022-03-14T17:38:49+09:00
draft: false
categories: ["블로그이전"]
tags: ['Statistics', 'ML']
---

|  |
| --- |
| ***해당 글은 [Edwith : 인공지능 및 기계학습 개론]의 문일철 교수님 강의를 참고한 내용입니다.*** ***CHAPTER 1. Motivations and Basics - [1.3 MAP](https://www.edwith.org/machinelearning1_17/lecture/10576?isDesc=false)*** |

**이전글 :** **[2022.03.14 - [Machine Learning/Statistics] - Maximum Likelihood Estimation(MLE)를 간단한 예시를 활용해 이해하기 : 수식 정리](https://eatchu.tistory.com/entry/Maximum-Likelihood-EstimationMLE를-간단한-예시를-활용해-이해하기-수식-정리)**

이 글을 이해하기 위해서는 MLE에 대한 이해가 필요하다.
이전 글과 이어지는 내용이기 때문에 이전글을 먼저 읽으면 이해가 더 쉬울것.

<br>


## ***Bayes Theorem***

이전 글에서 설명했던 MLE에서는 아무런 사전 정보 없이 실제로 실험한 관측값을 가지고 확률을 추정하였다.

하지만 여기서 **데이터가 주어지기 전에 어느 정도의 확률 값을 알고 있다면 어떨까?**

동전 뒤집기를 예시로 들어보자.

동전 뒤집기를 실제로 50번을 던져보았더니 앞면이 20번, 뒷면이 30번이 나왔다.

MLE 관점에서 동전이 앞면이 나올 확률은 2/5이다.

하지만 우리는 동전을 던졌을 때 앞면이 1/2, 뒷면이 1/2의 확률로 나올 것이라는 것을 알고 있다.

(완벽하게 평평하게 만들어진 동전이라고 가정할때)

이러한 사전 확률과 실제 우리가 얻은 관측값을 가지고 동전이 앞면이 나올 사후 확률을 계산하는 것이다.

<br>

## ***베이지안 정리 Bayesian rule***

{{< note1 >}}
$$P(\theta|D)\;=\;\dfrac{P(D|\theta)P(\theta)}{P(D)}$$
{{< /note1 >}}

{{< note2 >}}
$P(\theta|D)\;:\;posterior$ <br>
$P(D|\theta)\;:\;Likelyhood$ <br>
$P(\theta)\;:\;Prior\;Knowledge$ <br>
$P(D)\;:\;Normalizing\;Constant$
{{< /note2 >}}

우리는 이미 실험으로 관측된 데이터를 가지고 있다.

따라서 $P(D|\theta)$와 $P(D)$값을 구할 수 있다.

> $P(D|\theta)\;=\;\theta^{a_H}(1-\theta)^{a_T}$

그럼 이제 우리가 알고싶은 값은 $P(\theta)$이다.

<br>

## ***More Formula from Bayes Viewpoint***

이제 우리는 $P(\theta)\;:\;Prior\;Knowledge$ 을 구하기 위해 **Beta distribution을 사용**할 것이다.

Beta distribution은 두 매개변수 $\alpha$와 $\beta$에 따라 [0,1] 구간에서 정의되는 연속 확률 분포(cdf)이다.

Beta distribution을 사용하면 $P(\theta)$를 아래와 같이 표현할 수 있다.

{{< note2 >}}
$P(\theta) \; = \; \dfrac{\theta^{\alpha-1}(1-\theta)^{\beta-1}}{B(\alpha,\beta)}$

$B(\alpha,\beta) \; = \; \dfrac{\gamma(\alpha)\gamma(\beta)}{\gamma(\alpha+\beta)}$

$\gamma(\alpha) \; = \; (\alpha\,-\,1)!$
{{< /note2 >}}

여기서 **$B(\alpha,\beta)$와 $\gamma(\alpha)$항은 $\theta$에 의존하지 않는 식**이며 $\alpha$와 $\beta$가 결정되어 있는 상황에서 **constant항**이 된다.

따라서 $B(\alpha,\beta)$와 $\gamma(\alpha)$항은 비례항(proportional)으로 정의가 가능하다.

그럼 이제 우리는

- $P(D|\theta)\;=\;\theta^{a_H}(1-\theta)^{a_T}$ 
- $P(\theta) \; \propto \; \theta^{\alpha-1}(1-\theta)^{\beta-1}$

이 두 식을 아래 수식에 대입하여 사용할 수 있다.

-  $P(\theta|D)\;\propto\;P(D|\theta)P(\theta)$

두 식을 대입한 아래 수식을 살펴보자.

{{< note1 >}}
 $P(\theta|D)\;\propto\;P(D|\theta)P(\theta)\;\propto\;\theta^{a_H}(1-\theta)^{a_T}\,\theta^{\alpha-1}(1-\theta)^{\beta-1}$ <br>
  $=\;\theta^{a_H+\alpha-1}(1-\theta)^{a_T+\beta-1}$ <br>
{{< /note1 >}}

{{< note1 >}}
 $P(\theta|D)\;\propto\;\theta^{a_H+\alpha-1}(1-\theta)^{a_T+\beta-1}$
{{< /note1 >}}

<br>

## ***Maximum a Posteriori Estimation***

기존의 MLE에서는 Likelyhood를 maximize 하여 최적화를 진행했다.

- $\hat{\theta} \;=\;argmax_{\theta}\,P(D|\theta)$

  - $P(D|\theta) = \theta^{a_H}(1-\theta)^{a_T}$ <br>
  - $\hat{\theta}\;=\;\dfrac{a_H}{a_T+a_H}$

---

MAP에서는 Posterior를 maximize 하여 최적화를 진행한다.

- $\hat{\theta} \;=\;argmax_{\theta}\,P(\theta|D)$

MAP 역시 MLE와 같은 방식으로 미분을 진행한다.

{{< note1 >}}
$$\hat{\theta}\;=\;argmax_\theta\,ln\{\theta^{a_H+\alpha-1}(1-\theta)^{a_T+\beta-1}\}$$
{{< /note1 >}}

1. $\frac{d}{d\theta}\{(a_H+\alpha-1)\,ln\theta\;+\;(a_T+\beta-1)\,ln(1-\theta)\}\;=\;0$
2. $\dfrac{(a_H+\alpha-1)}{\theta}\;-\;\dfrac{(a_T+\beta-1)}{(a-\theta)}\;=\;0$
3. $(a_T+\beta-1)\theta\;=\;(a_H+\alpha-1)(1-\theta)$
4. $\hat{\theta}\;=\;\dfrac{a_H+\alpha-1}{a_H+a_T+\alpha+\beta-2}$

{{< note1 >}}
$$\hat{\theta}\;=\;\dfrac{a_H+\alpha-1}{a_H+a_T+\alpha+\beta-2}$$
{{< /note1 >}}

여기서 $\alpha$와 $\beta$는 우리가 줄 수 있는 정보다.

알맞은 $\alpha$와 $\beta$ (prior information)을 사용해야 좋은 결과를 얻을 수 있게 된다.

<br>

## ***MLE and MAP***

실험에 대한 trial이 충분하지 않을 경우 사전 정보를 중요하게 활용하여 MAP를 사용할 수 있다.

그러나 trial이 충분해 관측값이 많다면 MLE와 MAP의 값은 비슷하게 나올 것이다.


{{< note3 >}}
이전 글인 MLE와 여기 MAP글은 두 가지 사건만을 가지는 이항 분포를 예시로 설명을 적었다.

하지만 우리가 다루는 실제 데이터는 더 복잡하다.

따라서 더 많은 사건을 가지는 데이터로 추정법을 이해한다면 좀 더 잘 이해하고 넘어갈 수 있을 것 같다.

또 Naive Bayes 이론을 공부한다면 오늘 설명한 MAP에 대한 이해가 좀 더 잘 될 것이다.
{{< /note3 >}}

해당 강의의 세 번째 챕터인 [CHAPTER 3. Naive Bayes Classifier](https://www.edwith.org/machinelearning1_17/lecture/10585?isDesc=false)를 듣는다면 MAP를 보다 확실하게 이해할 수 있다.
