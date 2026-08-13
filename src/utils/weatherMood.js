// 날씨 조건에 따라 어울리는 "오늘의 한마디"를 골라주는 함수입니다.
// 우선순위가 있습니다: 미세먼지 나쁨 > 비 > 무더위 > 맑음 > 흐림 > 그 외
export function getMoodMessage(item) {
  if (item.dust === '나쁨') {
    return { emoji: '😷', text: '오늘은 창문보다 공기청정기랑 친해지는 날이에요.' }
  }
  if (item.status === '비') {
    return { emoji: '☔', text: '우산 없이 나가서 젖어봐야 그게 진짜 여름이죠.' }
  }
  if (item.status === '맑음' && item.temp >= 28) {
    return { emoji: '🔥', text: '이런 날 방구석에 있는 건 거의 죄악입니다.' }
  }
  if (item.status === '맑음') {
    return { emoji: '☀️', text: '산책하기 딱 좋은 날, 핑계 대지 말고 나가보세요.' }
  }
  if (item.status === '구름') {
    return { emoji: '⛅', text: '흐린 하늘 아래서도 할 건 다 하는 하루 되세요.' }
  }
  return { emoji: '🌈', text: '오늘 하루도 무탈하게 보내시길 바라요.' }
}
