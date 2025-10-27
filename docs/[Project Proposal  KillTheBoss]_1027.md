# [Project Proposal : KillTheBoss]


## [구현할 기능]


### <Player>

- **컨트롤**
    - 앞뒤좌우, 달리기, 웅크리기, 웅크리고 움직이기
        - 점프는 구현하지 않을 예정 → 갈 수 있는 곳과 못 가는 곳 명확한 구분을 위해
    - 물건 줍기(동전, 탱탱볼, 소음기 등)
    - (예정) 끌기(Enemy 시체)
    - (예정)(미정) 구르기 기능 고민 필요
    - (예정) 근접 공격
    - (예정) 암살 공격
    - (예정) 주위 스캔
- **공격**
    - 권총 사격
    - (예정) 근접 공격 (주먹)
        - 마지막에 가능하면 구현 IK 관련 알아야할 것들이 있음
    - (예정) 암살 공격
        - 마지막에 가능하면 구현 IK 관련 알아야할 것들이 있음
    - (예정) 밀기 (높은 층수에서 밀어서 떨어뜨리기)
        - 마지막에 가능하면 구현 IK 관련 알아야할 것들이 있음

    ⇒ Full body IK(Inverse Kinematic)에 대해서 공부 필요

- **기타 행동**
    - 동전이나 공 같은 작은 물건 던지기 → Enemy 주의를 끌어서 들키지 않고 이동 가능하게 만들기
    - 레벨에 배치된 버튼 조작 → 압착기 가동 or 구조물 떨어뜨리기 등
    - (예정) 처치한 적 끌어서 이동하기
        - IK or Enemy mesh 교체 etc.

### <Enemy>

- **컨트롤**
    - AI_Controller 사용
- **상태**
    - **Patrol [Default]**
        - Speed - Low
        - Anim - Idle_Stand, Idle_Walk, Idle_LookAround

         ⇒ 다른 상태로 전환할 때 Enemy 머리위에 ’ ! ‘ 같은 문자 띄워줘도 좋을 것 같음


            → 플레이어가 본인이 들켰는지 자각용

    - **Aggresive Patrol [(총격, 폭발음 감지 OR 시신 발견) AND 플레이어 발견 못 함]**
        - Speed - Medium
        - Anim - AggresivePatrol_Walk, AggresivePatrol_LookAround

        (+) . Aggresive Patrol 상태에서 Combat 상태로 12초 이내 미변경시 다시 Patrol 상태로 전환


        ⇒ Question Mark

    - **Suspicion [시야 내에 플레이어 존재 && 시야 내에 플레이어 지속 2초 이내]**
        - **Patrol+** (Patrol에 몇 가지 b변수 추가로 상태 전환)
        - Anim - Idle_ScratchHead(변경 가능) ⇒

        ⇒ Question Mark

    - **Combat [시야 내에 플레이어 존재 && 시야 내에 플레이어 지속 2초 이상]**
        - Speed - Medium(Walk) → Fast(Run)
        - Enemy_Unarmed(미정)
            - Anim - Combat_Stand, Combat_Walk(플레이어 미발견), Combat_Run(플레이어 발견), Combat_Punch
        - Enemy_Armed
            - Anim - Combat_ArmedStand, Combat_ArmedWalk(플레이어 미발견), Combat_ArmedRun(플레이어 발견), Combat_ArmedShoot

        ⇒ Exclamation Mark


        ⇒ 플레이어를 놓치면 10초간 Aggresive Patrol 상태로 유지 후 다시 Patrol 상태로 변경 

- **공격**
    - 권총 사격
    - (예정) 근접 공격 (주먹)
        - 마지막에 가능하면 구현 IK 관련 알아야할 것들이 있음
- **행동**
    - **Default** (Patrol State : 스폰한 층만 이동)
        - 각 개체별 지정된 타깃 포인트 순회하며 이동
        - 각 타깃 포인트에서 잠시 멈추며 주위 둘러보는 애니메이션 재생
    - **플레이어 발견 시** (Patrol State → Sus State → Combat State)
        - Enemy 시야 범위 내에(Suspicion State On) 2초 이상 머무를 시 쫒아와서 공격 시작
        - Unarmed Enemy는 주먹 공격 / Armed Enemy는 사격 공격
    - **Enemy 시신 발견 시** (Patrol State →  Aggresive Patrol state)
        - Enemy 시야 범위 내에 Enemy 시신 발견 시 Combat 상태가 되며 주변 수색
    - **총격 사운드 감지 시** (Patrol State → Aggresive Patrol state)
        - 총격 사운드 범위 내에 있는 모든 Enemy는 총격 사운드가 플레이된 위치로 모두 달려감

### <Boss>

- **Enenmy+**
- Anim - + Idle_Sitting
- Patrol - + 여러 층 번갈아가며 움직임(Idle_Wait 좀 더 길게 가져감)
- **상태**
    - **Patrol [Default]**
        - Speed - Low
        - Anim - Idle_Stand, Idle_Walk, Idle_LookAround(**좀 더 길게**)
    - **Aggresive Patrol [(총격, 폭발음 감지 OR 시신 발견) AND 플레이어 발견 못 함]**
        - Speed - Medium
        - Anim - AggresivePatrol_Walk, AggresivePatrol_LookAround

        (+) . Aggresive Patrol 상태에서 Combat 상태로 12초 이내 미변경시 다시 Patrol 상태로 전환

    - **Combat [시야 내에 플레이어 존재]**
        - Speed - Medium
        - Enemy_Armed
            - Anim - Combat_ArmedStand, Combat_ArmedRun, Combat_ArmedShoot
- **행동**
    - **Default** (Patrol State : 여러 층과 장소에 타깃 포인트 설정)
        - 각 개체별 지정된 타깃 포인트 순회하며 이동
        - 각 타깃 포인트에서 잠시 멈추며 주위 둘러보는 애니메이션 재생
    - **플레이어 발견 시** (Patrol State → Combat State)
        - Boss 시야 범위 내에 Player 존재시 즉시 쫒아와서 공격 시작
        - 사격 공격
    - **Enemy 시신 발견 시** (Patrol State →  Aggresive Patrol state)
        - Combat 시야 범위 내에 Enemy 시신 발견 시 Aggresive Patrol 상태가 되며 주변 수색
    - **총격 사운드 감지 시** (Patrol State → Aggresive Patrol state)
        - 총격 사운드 범위 내에 있는 모든 Enemy는 총격 사운드가 플레이된 위치로 모두 달려감

## [레벨 구성]

- **Start Point(주차장) ⇒ 플레이 연습 장소**
    - 건물의 입구 부근 주차장에서 시작
        - 입구를 지키는 Enemy 존재 → 처치하기 쉬운 상태로 배치 ⇒ Patrol 제거한 연습용 Enemy
        - Enemy 시신 숨길 수 있는 수풀 존재 → 연습
- **1층 ⇒ 쉬운 난이도**
    - 탁 트인 공간
        - Enemy들의 움직임을 들키지 않고 관찰할 수 있는 상황 조성 필요
    - Silencer 입구 근처에 배치
        - 1층에서 모든 Enemy 처치 케이스 경험 가능하게 만들기
    - Enemy 적은 수 배치 (2~4)
        - (예정) 암살 기능 연습
        - Silencer 장착된 권총으로 킬 해도 거의 들키지 않게끔
        - 시체 방치시 Aggresive Patrol 적용되게 만듬(거의 적은 공간)
            - 테이블 같은 곳 뒤에 숨기게끔 유도
            - 밖으로 나가서 숨겨도 안들키게끔 설정
- **2층 ⇒ 중간 난이도**
    - 총기 사용시 들킬 위험 아주 높아지게 설정
    - 시체 숨기기 위한 장소 따로 마련(작은 창고) ⇒ 약간 티나게
        - Enemy Patrol 불가능한 장소
    - 가스통 배치
        - 다른 프롭들과 다르게 약간의 이펙트 적용
            - 상호 작용할 수 있을 것 같은 느낌을 주는게 목적
- **3층 ⇒ 보스방 포함된 공간**
    - 구조 약간 더 복잡하게 설정
    - 보스는 본인방에서부터 3층 내부만 돌아다님
    - 가능한 보스 킬 상황
        - 가스통 (1개)
            - 배치는 여러 개를 하되 1개의 특정 위치의 가스통 근처로만 이동하게 설정
        - 권총
            - 보스에게 총을 쏘기 약간 어렵게 맵 구성
                - 다가가기까지 여러 Enemy 배치
- **End Point(= Start Point)**
    - 처음 시작된 장소에 주차된 차 옆에 Exit Point 표시해둠
    - Exit Point에 Player가 도달하면

## [오브젝트]


**<플레이어가 소지 및 사용>**

- **Coin (Max 3)**
    - 적을 유인하는 용도
        - Enemy의 좁은 반경 내(같은 층에만 적용)에 떨어지면 Enemy가 그 쪽으로 이동함
    - 다시 주워서 사용 가능
- **Bouncy Ball (Max 1)**
    - 적을 유인하는 용도
        - Enemy의 좁은 반경 내(같은 층에만 적용)에 떨어지면 Enemy가 그 쪽으로 이동함
    - 다시 주워서 사용 가능
- **Gun**
    - 적을 공격하는 용도
        - 소유하는 범위
            - 총격 사운드 → 소음기 장착시 범위 줄이기
            - 유효 사격 거리
- **Silencer**
    - Gun에 장착하여 총격 사운드 범위를 줄여주는 용도
    - 획득시 자동으로 총기에 장착됨

**<플레이어와 상호 작용>**

- **Explosive Barrel**
    - 총을 쏴서 맞추면 일정 반경에 폭파
        - 소유하는 범위
            - 중간 반경 : Enemy, Player, Boss 사망처리
            - 넓은 반경 : Enemy, Boss Aggresive Patrol 상태로 전환

## [필요한 에셋 목록]


### <Object>

- **Environment**
    - Building
        - 금주 Fab 무료 공사장 프롭 활용 예정
    - Box → 적 시신 숨기는 용도
    - 기타 건물 내부 조경 프롭들
- **Gun**
- **Explosive Barrel**

### <Animation>

- **Common**
    - Idle_Stand, LookAround, Walk, Run, Idle_ArmedStand, ArmedWalk, ArmedRun, Shoot, Die(or To Ragdoll),
        - (예정) Punch, Door_Open, Door_Close(Or Make Door To Screen Door)
- **Player**
    - Player_Idle_Crounch, Player_CrounchWalk, Player_Throw(Coin, Bouncy Ball)
        - (예정) Player_AssainateBack
- **Enemy**
    - Enemy_ScratchHead (When Enter Suspicion State / Can be replaced)
- **Boss**
    - Sitting

### <Sound>

- **Environment**
    - BGM
    - Game End(Success)
    - Game End(Failed)
    - (예정) Door Open/Close Sound
- **Characters**
    - Player Walking
    - Player Damaged
    - Player Dying
    - Enemy Dying
    - Enemy Start Aggresive Patrol
    - Enemy Start Combat
    - Boss Start Aggresive Patrol
    - Boss Start Combat
- **Objects**
    - Gun Fire(No Silencer)
    - Gun Fire(With Silencer)
    - Coin Falled
    - Bouncy Ball Falled
    - Explosive Barrel Exploded

## [각종 세팅 값 저장]


**<Default Camer Location>**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/8cf3d176-310b-462f-8835-52b81ef977e3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SY6QZXWH%2F20251027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251027T090304Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLZ%2FWDlFKwwqF10rRqKMmhDWW33IOq5TRSBMmuMTAI7AIhAKCpA6J4n%2B4k144ro6VP6EcLt8bAw%2FbUeE2owYobir1JKogECKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzK56Fa6u8hBs7WYuYq3AMxse46uI7ZevssD%2BH5uRa35NuyJJRyQC4wiBN3kw%2Bvm%2Fdqg16T%2Bp%2BrKIDoyosCnVkMSM4Q%2Fdp9K7Z0jujgzIPiyEqijXwPYY4CXSXpCkTtDJOpHydIsRj%2F1VNXZvG16EB%2BPPrFxHmkFkOoUogU2U%2BhskbIFLOsPyTlQAUbrfjKp21dgX4ybLOcLsFC8K8zolisPOpWv60AirOTau7p68EoUx05n7VV9%2FclyxnBiCjyoy%2FrCVAoTpFvy1uuNKji1FougbQrfrBJuiIJfOM%2FcFILxXCdy7Up2010MMfAwOGARQoCZ%2F%2BVY2YbRKuDAihKWC7rGSqMDhkALXhjA95ttMimCmQ0mor9tOfPmlmOD%2BOWlr5PnMNO8fD%2BjggifYivbiS1qsm1E2ffLd1yKbqOVg%2Fjn1AOIasqldBKNOcFSIyA79JaCPI4exhx4k3eIMVcLcXoMINHcskF6KM4OZXBLcxZP5iO7pGAw1uFJUxUghOyuuQe0X5Frgv9%2FXUmKOfrDa3vjq5Tf6F0cVyVhm59NtP7Xw9YhemA%2FQ8ybkiCaeKfgIeDg4rOBMf98Xtr%2F3w5vNC%2B9ayJUQOpKzAFHt4ljkr71wR%2FITJftgHVl8jdxEHycMskanUKBLToBWsz2zC2yvzHBjqkAcysq5xQBomtqDc%2F%2FMJZHQTon5c6n5hXaCqNRkfZ5YEnlj0CDsEtZAIVAfPxuZwLdwwuMo0vuFUYp1M%2BnXtp1GoivKyJ7veC%2BHK%2FY18iOkIPRdLOuAZB4JCOX3FFB9mD5BeXiYOchqOAQyd8QTGO1uOZygtyXnSwE5BRNDUJGCcXjcFtY%2Bx%2Bsbz9jTjTvS7KbNRqE1qJ3reTu57wplbn4e%2FCOpOL&X-Amz-Signature=ff2038fb0dd12343bd68c72b38e43e3bddb6d4bed9eb60a193d7200af764af6b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**<(예비) Zoomed Camera Location>**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/42cf42b1-6fa4-4368-934f-28207c567ba6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SY6QZXWH%2F20251027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251027T090304Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLZ%2FWDlFKwwqF10rRqKMmhDWW33IOq5TRSBMmuMTAI7AIhAKCpA6J4n%2B4k144ro6VP6EcLt8bAw%2FbUeE2owYobir1JKogECKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzK56Fa6u8hBs7WYuYq3AMxse46uI7ZevssD%2BH5uRa35NuyJJRyQC4wiBN3kw%2Bvm%2Fdqg16T%2Bp%2BrKIDoyosCnVkMSM4Q%2Fdp9K7Z0jujgzIPiyEqijXwPYY4CXSXpCkTtDJOpHydIsRj%2F1VNXZvG16EB%2BPPrFxHmkFkOoUogU2U%2BhskbIFLOsPyTlQAUbrfjKp21dgX4ybLOcLsFC8K8zolisPOpWv60AirOTau7p68EoUx05n7VV9%2FclyxnBiCjyoy%2FrCVAoTpFvy1uuNKji1FougbQrfrBJuiIJfOM%2FcFILxXCdy7Up2010MMfAwOGARQoCZ%2F%2BVY2YbRKuDAihKWC7rGSqMDhkALXhjA95ttMimCmQ0mor9tOfPmlmOD%2BOWlr5PnMNO8fD%2BjggifYivbiS1qsm1E2ffLd1yKbqOVg%2Fjn1AOIasqldBKNOcFSIyA79JaCPI4exhx4k3eIMVcLcXoMINHcskF6KM4OZXBLcxZP5iO7pGAw1uFJUxUghOyuuQe0X5Frgv9%2FXUmKOfrDa3vjq5Tf6F0cVyVhm59NtP7Xw9YhemA%2FQ8ybkiCaeKfgIeDg4rOBMf98Xtr%2F3w5vNC%2B9ayJUQOpKzAFHt4ljkr71wR%2FITJftgHVl8jdxEHycMskanUKBLToBWsz2zC2yvzHBjqkAcysq5xQBomtqDc%2F%2FMJZHQTon5c6n5hXaCqNRkfZ5YEnlj0CDsEtZAIVAfPxuZwLdwwuMo0vuFUYp1M%2BnXtp1GoivKyJ7veC%2BHK%2FY18iOkIPRdLOuAZB4JCOX3FFB9mD5BeXiYOchqOAQyd8QTGO1uOZygtyXnSwE5BRNDUJGCcXjcFtY%2Bx%2Bsbz9jTjTvS7KbNRqE1qJ3reTu57wplbn4e%2FCOpOL&X-Amz-Signature=4d36ddd819c88597d1225a7ab855cc37b5cada6b4f87a88c64b1d1af64f8847f&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## [사용할 에셋 목록]


### <캐릭터>


[https://www.mixamo.com/#/?page=1&type=Character](https://www.mixamo.com/#/?page=1&type=Character)

- 주인공 : Brian
- 적 :  Adam
- 보스 : Crypto

⇒ Mixamo 캐릭터들 옷 텍스처 변경해서 새로 제작 가능한지 확인해보기


### <오브젝트>


### <애니메이션>

- **암살 모션** : [https://www.mixamo.com/#/?page=1&query=assasin](https://www.mixamo.com/#/?page=1&query=assasin)
- **Actorcore(유료 애니메이션 모음)** - [https://actorcore.reallusion.com/3d-motion?orderBy=Relevance&keyword=push](https://actorcore.reallusion.com/3d-motion?orderBy=Relevance&keyword=push)
    - R05 Cradle Drop Drag M (+ Group Motsion)
- ~~**app.anything.world(AI 기본 애니메이션 붙여주기)**~~ ~~-~~ [~~https://app.anything.world/u/my-world/my-models~~](https://app.anything.world/u/my-world/my-models) ⇒ 쓸게 못 됨

## [해결해야 할 것들]

1. ~~Static Mesh와 Skeleton Mesh의 차이점~~

    → Static Mesh는 절대 안움직은 애(동상이나 못 움직이는 건물 등) / Skeleton Mesh : 뼈대(Skeleton)와 Mesh 정점이  합쳐져 있는 것(무겁다 → 게임 내에서 반드시 움직임이 구현되어야 하는 애들만 사용)

2. ~~Skeleton Mesh와 Skeleton의 차이점~~

    → 뼈대에 Mesh가 붙어있는냐 아니냐

3. ~~Skeleton Mesh와 Skeleton 중 어떤 걸 Static Mesh로 만들어야 하는가?~~

    → Skeleton에는 Mesh가 없어요. Skeleton Mesh는 있어요.

4. ~~소캣 만드는 방법~~

    → Skeleton Mesh 파일에 오른쪽 ‘스켈레톤 트리’ 창에서 붙이고 싶은 뼈대에 붙이고 세부 조절 필요

5. ~~Unreal 내부에서 텍스처 수정하는 방법 or 필터 적용법~~

    → 구분되어 있지 않으면 방법이 없음. 포토샵 같은 파일로 열어서 수정 후 다시 적용해야함

6. Player에게 InventoryMap 변수 부여하고 아이텝 픽업 기능 구현

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/6221a178-2bc4-4e12-a9c0-c6a24f513905/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XOOB4HXQ%2F20251027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251027T090323Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQCsoSPzy%2B9qdReG08pc59MmwTaXRuG4aPcZnyo2i7bDVQIhANaG8dCJQD7AsuskfwuxxYD7EC7P%2Blp6WEU450vW4PgpKogECKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgxLweiuxYFaVsltURcq3APPBPRhSHwAfMud4J7qdS4%2FD9c%2FtEhgLTmzHPnINHUNoWchKFCOD9RrX%2FhdNidT07X1wz8n%2FWEjQDSdkotuKnJMNjBaRHgYj7jNajyTyMgwhsipXMPth%2BUHOHX7qbbunwHC%2BXXtyZ4QBohs3GQ0xIF1q19of7RP1NWvpa1YQz%2FwXHUqXeP1lCmV5H1B2PrRk31Pktr5%2BDK99QaWeHkeVaJMycEVoGVHtMz%2BgqHHbijbeeID8lD%2F9UF3kA2bz3hIfLmhy%2FbYgV35vIMvHe%2BBgRpsa334DF7hPlIFJddWnz0iRCQtjwknAdT3DJ97txc3krcdXlFbbQOobRjOcNHuD%2FrDK%2FBt6HJ2UEgk%2BanpL9CeYpp2QfHu7%2FspO3uOean3V2h7qa9v8uiInsm4EpKRU2DXOmgCsT5m4Fr4VIsCiVbYFefdDsNwM8sS4GJoSuwmpaodOzoRCjAD4l7aWigNPok7Bp2CLxPX5CMjtIm%2FcRMKL60aF5tXHCEU7pcrmUY%2FuH0mETtfcTEznq99Wy8qMIW8afQxSh%2FELnJjMNNN86LQntAeRtuVHtQJDNgqMFUAd0IeNtFbM4nmH6TE5TQoAq6hxaOFpJDLWS8u%2BFJAs8mSvb0WrlPGfAuGiFbaOjC0yvzHBjqkARZZT0EzAMHVjZxghqtrbR4%2B0WpSvU4m%2F73Yn%2FMAfpQb69H%2BY8kEktVkSbdn8a9K%2FyBkCG2aBkQKQAyUTSoNpvQSAdO7wACfdLhvLQ3qxggKSG%2FLwxwMD0FmSnjw%2BFhg4HNc5JAxw%2FdtWK4nFY9p8ACIsKzKVErHLPt0fN6gWLT2XV9%2Bv4%2BgYVF9u22CZMCfYgvajMokeXRSi13FvtWkC6VoRY6s&X-Amz-Signature=4692a70e5dea9dde75dacc0b4d35bfaaa6b2c1317d74675ce769abc86b9f6844&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

7. 

## [에셋 수정 필요한 부분]


<Gun_Untitled>


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/a458cfb6-d2d3-464f-8e5c-b9cc7aa108ae/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SY6QZXWH%2F20251027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251027T090304Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLZ%2FWDlFKwwqF10rRqKMmhDWW33IOq5TRSBMmuMTAI7AIhAKCpA6J4n%2B4k144ro6VP6EcLt8bAw%2FbUeE2owYobir1JKogECKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzK56Fa6u8hBs7WYuYq3AMxse46uI7ZevssD%2BH5uRa35NuyJJRyQC4wiBN3kw%2Bvm%2Fdqg16T%2Bp%2BrKIDoyosCnVkMSM4Q%2Fdp9K7Z0jujgzIPiyEqijXwPYY4CXSXpCkTtDJOpHydIsRj%2F1VNXZvG16EB%2BPPrFxHmkFkOoUogU2U%2BhskbIFLOsPyTlQAUbrfjKp21dgX4ybLOcLsFC8K8zolisPOpWv60AirOTau7p68EoUx05n7VV9%2FclyxnBiCjyoy%2FrCVAoTpFvy1uuNKji1FougbQrfrBJuiIJfOM%2FcFILxXCdy7Up2010MMfAwOGARQoCZ%2F%2BVY2YbRKuDAihKWC7rGSqMDhkALXhjA95ttMimCmQ0mor9tOfPmlmOD%2BOWlr5PnMNO8fD%2BjggifYivbiS1qsm1E2ffLd1yKbqOVg%2Fjn1AOIasqldBKNOcFSIyA79JaCPI4exhx4k3eIMVcLcXoMINHcskF6KM4OZXBLcxZP5iO7pGAw1uFJUxUghOyuuQe0X5Frgv9%2FXUmKOfrDa3vjq5Tf6F0cVyVhm59NtP7Xw9YhemA%2FQ8ybkiCaeKfgIeDg4rOBMf98Xtr%2F3w5vNC%2B9ayJUQOpKzAFHt4ljkr71wR%2FITJftgHVl8jdxEHycMskanUKBLToBWsz2zC2yvzHBjqkAcysq5xQBomtqDc%2F%2FMJZHQTon5c6n5hXaCqNRkfZ5YEnlj0CDsEtZAIVAfPxuZwLdwwuMo0vuFUYp1M%2BnXtp1GoivKyJ7veC%2BHK%2FY18iOkIPRdLOuAZB4JCOX3FFB9mD5BeXiYOchqOAQyd8QTGO1uOZygtyXnSwE5BRNDUJGCcXjcFtY%2Bx%2Bsbz9jTjTvS7KbNRqE1qJ3reTu57wplbn4e%2FCOpOL&X-Amz-Signature=a5c8d69dc0bc39cf4e72d8e4a81ba4ee2899b752203f9522c3944c47cd0d9c12&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/ea399bd5-26ab-4ea6-87a6-adb5fdba54fb/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SY6QZXWH%2F20251027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251027T090304Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLZ%2FWDlFKwwqF10rRqKMmhDWW33IOq5TRSBMmuMTAI7AIhAKCpA6J4n%2B4k144ro6VP6EcLt8bAw%2FbUeE2owYobir1JKogECKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzK56Fa6u8hBs7WYuYq3AMxse46uI7ZevssD%2BH5uRa35NuyJJRyQC4wiBN3kw%2Bvm%2Fdqg16T%2Bp%2BrKIDoyosCnVkMSM4Q%2Fdp9K7Z0jujgzIPiyEqijXwPYY4CXSXpCkTtDJOpHydIsRj%2F1VNXZvG16EB%2BPPrFxHmkFkOoUogU2U%2BhskbIFLOsPyTlQAUbrfjKp21dgX4ybLOcLsFC8K8zolisPOpWv60AirOTau7p68EoUx05n7VV9%2FclyxnBiCjyoy%2FrCVAoTpFvy1uuNKji1FougbQrfrBJuiIJfOM%2FcFILxXCdy7Up2010MMfAwOGARQoCZ%2F%2BVY2YbRKuDAihKWC7rGSqMDhkALXhjA95ttMimCmQ0mor9tOfPmlmOD%2BOWlr5PnMNO8fD%2BjggifYivbiS1qsm1E2ffLd1yKbqOVg%2Fjn1AOIasqldBKNOcFSIyA79JaCPI4exhx4k3eIMVcLcXoMINHcskF6KM4OZXBLcxZP5iO7pGAw1uFJUxUghOyuuQe0X5Frgv9%2FXUmKOfrDa3vjq5Tf6F0cVyVhm59NtP7Xw9YhemA%2FQ8ybkiCaeKfgIeDg4rOBMf98Xtr%2F3w5vNC%2B9ayJUQOpKzAFHt4ljkr71wR%2FITJftgHVl8jdxEHycMskanUKBLToBWsz2zC2yvzHBjqkAcysq5xQBomtqDc%2F%2FMJZHQTon5c6n5hXaCqNRkfZ5YEnlj0CDsEtZAIVAfPxuZwLdwwuMo0vuFUYp1M%2BnXtp1GoivKyJ7veC%2BHK%2FY18iOkIPRdLOuAZB4JCOX3FFB9mD5BeXiYOchqOAQyd8QTGO1uOZygtyXnSwE5BRNDUJGCcXjcFtY%2Bx%2Bsbz9jTjTvS7KbNRqE1qJ3reTu57wplbn4e%2FCOpOL&X-Amz-Signature=6c806a6f4c3e75d0a0bb6956634be6ab3331c98006e4b59f446e921b251910a5&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/2a7ab0d3-5ca4-4a36-b015-4d1a14bcf502/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466SY6QZXWH%2F20251027%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251027T090304Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDLZ%2FWDlFKwwqF10rRqKMmhDWW33IOq5TRSBMmuMTAI7AIhAKCpA6J4n%2B4k144ro6VP6EcLt8bAw%2FbUeE2owYobir1JKogECKH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgzK56Fa6u8hBs7WYuYq3AMxse46uI7ZevssD%2BH5uRa35NuyJJRyQC4wiBN3kw%2Bvm%2Fdqg16T%2Bp%2BrKIDoyosCnVkMSM4Q%2Fdp9K7Z0jujgzIPiyEqijXwPYY4CXSXpCkTtDJOpHydIsRj%2F1VNXZvG16EB%2BPPrFxHmkFkOoUogU2U%2BhskbIFLOsPyTlQAUbrfjKp21dgX4ybLOcLsFC8K8zolisPOpWv60AirOTau7p68EoUx05n7VV9%2FclyxnBiCjyoy%2FrCVAoTpFvy1uuNKji1FougbQrfrBJuiIJfOM%2FcFILxXCdy7Up2010MMfAwOGARQoCZ%2F%2BVY2YbRKuDAihKWC7rGSqMDhkALXhjA95ttMimCmQ0mor9tOfPmlmOD%2BOWlr5PnMNO8fD%2BjggifYivbiS1qsm1E2ffLd1yKbqOVg%2Fjn1AOIasqldBKNOcFSIyA79JaCPI4exhx4k3eIMVcLcXoMINHcskF6KM4OZXBLcxZP5iO7pGAw1uFJUxUghOyuuQe0X5Frgv9%2FXUmKOfrDa3vjq5Tf6F0cVyVhm59NtP7Xw9YhemA%2FQ8ybkiCaeKfgIeDg4rOBMf98Xtr%2F3w5vNC%2B9ayJUQOpKzAFHt4ljkr71wR%2FITJftgHVl8jdxEHycMskanUKBLToBWsz2zC2yvzHBjqkAcysq5xQBomtqDc%2F%2FMJZHQTon5c6n5hXaCqNRkfZ5YEnlj0CDsEtZAIVAfPxuZwLdwwuMo0vuFUYp1M%2BnXtp1GoivKyJ7veC%2BHK%2FY18iOkIPRdLOuAZB4JCOX3FFB9mD5BeXiYOchqOAQyd8QTGO1uOZygtyXnSwE5BRNDUJGCcXjcFtY%2Bx%2Bsbz9jTjTvS7KbNRqE1qJ3reTu57wplbn4e%2FCOpOL&X-Amz-Signature=31f410ef341429924850467a5968f05f5f953d07917eb70a5c48d52f49227af7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## [참조 사이트]

- **itch.io** - [https://itch.io/game-assets/tag-3d](https://itch.io/game-assets/tag-3d)
    - Animation Library - [https://quaternius.itch.io/universal-animation-library](https://quaternius.itch.io/universal-animation-library)
- **Sketchfab** - [https://sketchfab.com/features/free-3d-models](https://sketchfab.com/features/free-3d-models)
- **Mixamo** - [https://www.mixamo.com/](https://www.mixamo.com/)
- **모션 워핑(캐릭터 애니메이션 플레이 장소로 이동)** - [https://dev.epicgames.com/documentation/ko-kr/unreal-engine/motion-warping-in-unreal-engine?utm_source=chatgpt.com](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/motion-warping-in-unreal-engine?utm_source=chatgpt.com)
