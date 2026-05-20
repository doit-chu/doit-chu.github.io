---
title: "Maximum Likelihood Estimation (MLE) - 간단한 예시를 활용해 수식 정리"
date: 2022-03-14T14:45:48+09:00
draft: false
categories: ["블로그이전"]
tags: ['Statistics', 'ML']
---

|  |
| --- |
| ***해당 글은 [Edwith : 인공지능 및 기계학습 개론] 문일철 교수님의 강의를 정리한 내용입니다.*** ***CHAPTER 1. Motivations and Basics - [1.2 MLE](https://www.edwith.org/machinelearning1_17/lecture/10575?isDesc=false)*** |


## ***Thumbtack Question***

압정을 던져서 앞, 뒤 확률을 구할 때 구조적으로 50%, 50% 확률이라고 말하긴 어렵다.

(동전은 앞뒷면이 똑같이 평평해 각 50%의 확률을 갖는다고 말할 수 있지만 압정의 모양을 생각해보면 쉽게 이해가 갈 것이다)

따라서 압정의 앞, 뒷면의 확률을 구하기 위해 여러 번 던져보자.

압정을 5번 던졌고 그중 3번이 앞면, 2번이 뒷면이 나왔다.

이때 우리는 앞면이 나올 확률이 3/5, 뒷면이 나올 확률이 2/5라고 말할 수 있을까?


     <압정 던지기 실험>
     시행 횟수 : 5번
     앞면이 나온 횟수 : 3번
     뒷면이 나온 횟수 : 2번


<br>

## ***Binomial Distribution : 이항 분포***

이항 분포는 **이산 확률 분포(Discrete Probability Distribution)** 이다.

위의 실험을 보면 압정을 던졌을 때 앞면 또는 뒷면이 나오는 **두 가지의 사건만이 존재**한다.

따라서 두 가지의 사건만 존재하는 압정 던지기 실험은 이항 분포라고 할 수 있다.

이때 압정을 한 번만 던진다면 베르누이 분포라고 보지만 우리는 앞서 압정을 다섯 번 던졌기 때문에 이항 분포로 볼 수 있다.

또한 매번 압정을 던질 때마다 이전 실행의 영향을 받지 않기 때문에 **독립적인 시행**이라고 볼 수 있다.

---

이제 편의상 **압정의 앞면을 Head(H), 뒷면을 Tail(T)로 표기**하겠다.

앞선 실험을 확률로 표현해보면 아래처럼 볼 수 있다.


$$ P(H)=\theta $$
$$ P(T)=1 - \theta $$
$$ P(HHTHT) = \theta\theta(1-\theta)\theta(1-\theta) = \theta^3(1-\theta)^3 $$


{{< note2 >}}
- $D = H,H,T,H,T$ : 우리가 구한 데이터
- $n = 5$ : 시행횟수
- $a_H = 3$ : 앞면이 나온 횟수
- $a_T = 2$ : 뒷면이 나온 횟수
- $p(H) = \theta$ : 앞면이 나올 확률
{{< /note2 >}}

그렇다면 $\theta$가 주어졌을때 D라는 데이터가 관측될 확률은

`$P(D|\theta) = \theta^{a_H}(1-\theta)^{a_T}$` 이다.

<br>


## ***Maximum Likelihood Estimation (MLE) : 최대 우도 추정***

우리는 $\theta$라는 확률을 가정했을때 데이터가 관측될 확률을 아래 수식으로 정의했다.

{{< note1 >}}
$$P(D|\theta) = \theta^{a_H}(1-\theta)^{a_T}$$
{{< /note1 >}}

그렇다면 우리의 가설을 만족시키기 위해 가정한 $\theta$를 최적화해야 한다.

**즉, 어떤 $\theta$를 선택해야 데이터를 잘 설명할 수 있을지를 알아내야 하는 것이다.**

최적의 $\theta$를 찾아내기 위해 $\theta$의 Maximum Likelihood를 알아보자

즉, 관측된 데이터의 가능성을 최대화할 수 있는 $\theta$를 찾아내는 것이다.

{{< note1 >}}
$$\hat{\theta} \; = \; argmax_{\theta} \, P(D|\theta) \; = \; argmax_{\theta} \, \theta^{a_H}(1-\theta)^{a_T}$$
{{< /note1 >}}

**$P(D|\theta)$를 최대화(argmax) 할 수 있는 $\theta$를 찾고 찾은 $\theta$를 $\hat{\theta}$이라고 부른다.**



<br>


## ***MLE Calculation***

{{< note1 >}}
$$\hat{\theta}\;=\;argmax_{\theta}\,P(D|\theta)\;=\;argmax_{\theta}\,\theta^{a_H}(1-\theta)^{a_T}$$
{{< /note1 >}}

D(data) 집합 : $\{H,H,T,H,T\}$ 이고

$$P(D|\theta)\;=\;P(H|\theta)P(H|\theta)P(T|\theta)P(H|\theta)P(T|\theta)$$

이렇게 구할 수 있다.

즉, $P(D|\theta)\;=\; \Pi^{N}_{i=1}P(D_i|\theta)$ 이다. (데이터가 독립이고 파라미터가 정규분포를 따른다고 가정)

우리는 $P(D|\theta)$ 최댓값을 구하기 위해 미분을 사용해야 하는데 곱셈식에서는 미분을 적용하기가 어렵다.

따라서 **log function(log likelyhood)**을 사용할 것이다.

log를 사용하더라도 기존의 $P(D|\theta)$가 최대화되는 점과 $logP(D|\theta)$가 최대화되는 점이 같기 때문에 우리의 목적이 일맥상통한다.

{{< note2 >}}
$$\hat{\theta} \;=\;argmax_{\theta}\,lnP(D|\theta)$$
      $$= argmax_{\theta}\,ln\{\theta^{a_H}(1-\theta)^{a_T}\}$$
    **$$= argmax_{\theta}\,\{a_H\,ln\theta\;+\;a_T\,ln(1-\theta)\}$$**
{{< /note2 >}}

log function을 사용하면 간단한 maximaization 문제가 된다.

$\theta$를 최적화하여 이 수식을 최대화시키면 되는 것이다. 그럼 어떻게 해야 할까?

**수식의 최댓값을 구하기 위해 극점을 이용하는 방법을 사용할 것이다.**

앞에서 이미 말하긴 했지만 **수식을 $\theta$에 대해 미분하는 것이다.**

1. $\frac{d}{d\theta}(a_H\,ln\theta\;+\;a_T\,ln(1-\theta))\;=\;0$
2. $\dfrac{a_H}{\theta}\;-\;\dfrac{a_T}{1-\theta}\;=\;0$
3. $a_T\theta\;=\;a_H(1-\theta)$
4. **$\hat{\theta}\;=\;\dfrac{a_H}{a_T+a_H}$**

{{< note1 >}}
$$\hat{\theta}\;=\;\dfrac{a_H}{a_T+a_H}$$
{{< /note1 >}}

최종적으로 $\theta$는 총 시행 횟수 중 앞면이 나온 횟수가 된다.

따라서 우리가 처음에 실험을 진행하고 앞면이 나올 확률을 3/5라고 말할 수 있는 통계적 근거가 바로 이 수식에서 찾을 수 있게 되는 것이다.

**우리는 MLE 관점에서 최적화된 $\hat{\theta}$를 구한 것이다.**

<br>

## ***Simple Error Bound***

우리는 이제껏 $\theta$가 아닌 $\hat{\theta}$을 구한 것이다.

**즉, 파라미터에 대해 추론을 한 것이지 확정을 지은 것은 아니다.**

따라서 우리가 추론한 파라미터에는 항상 $error$가 존재한다. $\varepsilon\;>\;0$, $\varepsilon=error$

{{< note1 >}}
$$P(|\hat{\theta}\,-\,\theta^*|\;\geq\;\varepsilon)\;\leq\;2e^{-2Ne^2}$$
{{< /note1 >}}

우리가 추론한 파라미터 $hat{\theta}$와 실제 파라미터 $\theta$의 차이가 특정 $\varepsilon(error)$ 보다 클 확률은 $2e^{-2Ne^2}$ 보다 작다.

그럼  $error$는 어떻게 줄일 수 있을까?

여기서 $2e^{-2Ne^2}$의 N은 시행 횟수(trial)이다.

앞선 실험에서 N=5였다.

하지만 우리가 압정을 더 많이 뒤집어서 N이 더 커진다고 가정할 때 $2e^{-2Ne^2}$의 값은 더 작아지게 될 것이다.

**따라서 시행 횟수가 많아질수록 우리가 추론한 파라미터와 실제 파라미터의 차이가 특정 $\varepsilon(error)$ 보다 클 확률이 점점 작아지는 것이다.**

---

---

{{< note3 >}}
지금까지 간단한 예시(압정 던지기)로 MLE를 살펴보았다.

하지만 아직 MLE를 완전히 이해하고 넘어갔다고 보긴 어렵다. (내가 느낀 바로는)

다음 포스트는 이다음 chapter인 MAP에 대해서 공부하여 적어보고 또 부족한 부분이나 아쉬운 내용을 추가해보려고 한다.
{{< /note3 >}}