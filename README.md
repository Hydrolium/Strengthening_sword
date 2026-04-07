# 검 강화하기
사용자가 검을 강화하여 새로운 검을 발견하고 웹 게임입니다.
> 본 프로젝트의 검 이미지 및 아이템 명칭 등은 **리그 오브 레전드(League of Legends)** 게임의 내용을 사용하였습니다.

## 게임 하기
아래 링크를 통해 웹에서 바로 게임을 플레이할 수 있습니다  
[https://hydrolium.github.io/Strengthening_sword/](https://hydrolium.github.io/Strengthening_sword/)

## 게임 기능
1. 검 강화
- 강화하기: 비용을 지불하여 검을 강화합니다.
- 성공/실패: 고단계의 검일수록 강화 확률이 감소하며, 실패 시 0강으로 초기화됩니다.
- 보관: 현재 검을 보관함에 저장하여 나중에 다시 강화하거나 제작을 위해 사용할 수 있습니다.
- 판매: 현재 검을 판매하여 자금을 확보할 수 있습니다
2. 검 도감
- 발견한 검들의 목록과 상세 정보를 확인할 수 있습니다.
3. 보관함
- 보관 중인 검, 획득한 아이템 조각, 보유중인 복구권 등을 확인/관리합니다.
4. 제작소
- 복구권 제작: 실패 시 검을 복구할 수 있는 아이템을 제작합니다.
- 검 제작: 보관 중인 검과 아이템 조각을 사용하여 새로운 검을 제작합니다.
5. 강화소
- 새로운 검을 발견할 때마다 획득하는 스탯 포인트로 영구적인 유용한 능력치를 올릴 수 있습니다.

## 환경
- **Language**: TypeScript
- **Bundler**: Vite
- **UI**: HTML5, CSS3

## 프로젝트 구조
- `docs/`: GitHub Pages 배포를 위한 빌드 결과물
- `public/data/`: 검 정보, 레시피, 조각 정보 등의 데이터
- `public/images/`: 검 이미지, 아이템 이미지 등 게임에서 사용하는 이미지 파일
- `scripts/`: 게임 로직과 UI를 구현하는 TypeScript 파일

## 계층 구조 및 흐름
1. `EventController` 계층(`scripts/event_controller/`)
- **역할**: 사용자 입력과 이벤트 처리 핸들러를 정의합니다.
- **동작**: 이벤트 발생 시 `Manager` 클래스의 `update` 메서드를 `UpdatingContext`와 함께 호출하여 이벤트에 따른 게임 데이터 변경을 요청합니다.

2. `Manager` 계층(`scripts/manager/`)
- **역할**: 보유 자산, 현재 검 등의 게임의 데이터를 관리합니다.
- **동작**: 옵저버 패턴으로 구현되어있습니다. 데이터 변경 시 자신의 `notify` 메서드를 `ScreenContext`데이터와 함께 호출하며, 연결된 `Refreshable` 클래스의 `refresh`(화면 새로고침) 또는 `show`(화면 변경) 메서드를 호출하여 화면 갱신을 요청합니다.

3. `Refreshable` 계층(`scripts/screen/`)
- **역할**: 게임 화면과 UI 요소 랜더링을 담당합니다.
            강화, 제작 화면 등의 메인 화면을 담당하는 `Screen` 클래스와 자산, 팝업 등의 세부 UI 요소를 담당하는 `Display` 클래스가 있습니다.
- **동작**: 전달받은 `ScreenContext` 데이터를 DOM에 반영하여 화면을 갱신합니다.

4. `Context` 클래스(`scripts/context/`)
- **역할**: 게임의 현재 상태와 데이터를 담는 클래스입니다.
- **구성**
    - `ScreenContext`: 화면에 무엇을 그려야 할지에 대한 데이터를 담습니다.
        - `ScreenDrawingContext`: 화면을 갱신하거나(Rendering), 애니메이션을 재생하거나(Animating), 팝업을 띄울 때(Popup) 사용됩니다.
        - `ScreenShowingContext`: 메인 화면을 변경할 때 사용됩니다.
    - `UpdatingContext`: 게임 데이터가 어떻게 변해야 하는지에 대한 정보를 담습니다.
        - `SwordUpdateContext`,  `InventoryUpdateContext`, `MakingUpdateContext`, `StatUpdateContext`로 각 Manager에게 데이터 변경을 요청할 때 사용됩니다.