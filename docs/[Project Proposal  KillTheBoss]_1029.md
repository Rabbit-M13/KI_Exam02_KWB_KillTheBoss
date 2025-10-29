# [Project Proposal : KillTheBoss]


## [구현할 기능]


### <Player>

- **컨트롤**
    - 앞뒤좌우, 달리기, 웅크리기, 웅크리고 움직이기
        - 점프는 구현하지 않을 예정 → 갈 수 있는 곳과 못 가는 곳 명확한 구분을 위해
    - 물건 줍기(동전, 탱탱볼, 소음기 등)
    - (예정) 끌기(Enemy 시체)
    - ~~(예정)(미정) 구르기 기능 고민 필요~~
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
        - Speed - Low : 100
        - Anim - Idle_Stand, Idle_Walk, Idle_LookAround…

         ⇒ 다른 상태로 전환할 때 Enemy 머리위에 UI로 ’ ! ‘ 같은 문자 띄워줘도 좋을 것 같음


            → 플레이어가 본인이 들켰는지 자각용

    - **Aggresive Patrol [(총격, 폭발음 감지 OR 시신 발견) AND 플레이어 발견 못 함]**
        - Speed - Medium : 140
        - Anim - AggresivePatrol_Walk, AggresivePatrol_LookAround

        (+) . Aggresive Patrol 상태에서 Combat 상태로 10초 이내 미변경시 다시 Patrol 상태로 전환


        ⇒ UI : Question Mark

    - **Suspicion [시야 내에 플레이어 존재 && 시야 내에 플레이어 지속 2초 미만]**
        - **Patrol+** (Patrol State과 동일하나 bIsStateSuspicion 변수를 true 값으로 전환하고 시야 내에 플레이어가 존재하는 시간동안 카운트를 함, Suspicion에 해당하는 애니메이션 몽타주를 즉시 한 번 실행함)
        - Anim - Idle_ScratchHead(변경 가능)
        - (에정)사운드로 플레이어에게 알려주면 좋을 것 같음

        ⇒ UI : Question Mark

    - **Combat [시야 내에 플레이어 존재 && 시야 내에 플레이어 지속 2초 이상]**
        - Speed - Fast : 240
        - Enemy_Unarmed(미정)
            - Anim - Combat_Stand, Combat_Walk(플레이어 미발견), Combat_Run(플레이어 발견), Combat_Punch
        - Enemy_Armed
            - Anim - Combat_ArmedStand, Combat_ArmedWalk(플레이어 미발견), Combat_ArmedRun(플레이어 발견), Combat_ArmedShoot

        ⇒ UI : Exclamation Mark


        ⇒ 플레이어를 놓치면 10초간 Aggresive Patrol 상태로 유지 후 다시 Patrol 상태로 변경 

- **공격**
    - 권총 사격
    - 근접 공격 (주먹)
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
    - **총격 or 폭발 사운드 감지 시** (Patrol State → Aggresive Patrol state)
        - 사운드 범위 내에 있는 모든 Enemy는 사운드가 실행된 위치로 모두 달려감

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


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/8cf3d176-310b-462f-8835-52b81ef977e3/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q2XQMWA%2F20251029%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251029T141524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLXdlc3QtMiJIMEYCIQDpkLOlVY6VShBe1FKxeyZLUhZ2ar48m1yYmlY6mEstUwIhAJGEtR%2BWMNdh2bvB1qWY%2FiOTxCP1%2FRQw9vZP9f3mJhMXKogECNb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyxEwA689gZjtp4IdIq3APaYeVE0pod1Jc15LpEFYLKgBgK9lALSZF7rQeRwedC5KBNrKtCt8Ol1TFySlMxd1zFfsT%2FRAtgY3%2FZb1f1ZMMifg5z0m%2BkFwEZe2F76w0A5FJTLJL6fm0%2B38LBlFDplSXBt7d%2Fr1rjqQx1G4OEmqKp%2FnXS7m88GCAr4E%2FD6ypSGtadDefy3Eyr89bFXA515KCqCTJ%2F9SDJhF1byyDX8JpIJx3a7rLX1Mk%2Bldr7KUDYyUHxbMPKCnlH07szt15tyCdAXQqKmO2wq0Bn5Z93AQUChtOWf6EcsO3%2FbA%2BouSNqAbF0cbZQovEBLakGzc%2FkTYU2k6s2guZxSwNJIgi4THj2ADiHfdugTcCElYGBQ%2FcSKLBesYdjSdJsUAUskDGlXvHPhxupXQjNqOYN7FLrWa6%2FfzsDG7JiBPJbgS1zgTgFrlCnAa9%2FUfaBSw%2BPXls4608iRRlz7EOzG8U%2FtPqGgg5KSyhnLTAEat48H12aGCMXyy9zhtOtgBty573oqsWAsVOWdmNh4EVYhhEPS9wXugogZj9feYyYwPq4O61v8GCb6SlttHb5iiW4Pb4GgD%2B3Lscei8ceIZrkIuGs40H5OIqYryzcO9jgSe00FW35gyX7Rom%2FFgXbrt2LAPfqljCbpYjIBjqkAeBszEhQKDkjiFDAXvOBJoo7T%2Fx02Mxnar8qTkvxooIom%2FahC0eNeHDjlOSvQqtOnAIv2eeE6gsA8RjfZ2d2%2FbH6UwcQYjp2k7mbvjvi9trxzwe%2B%2FJ%2FTyC5Gf5j09fdUDnLHsMMWaXdw%2FFwn7HKpy4DFrGw81Cfeb3GWH8eVSYQYGDOHryyKqg8UMpm8FuqmgZA9TbsZGJagdb6Edo5%2FrEZDwNe1&X-Amz-Signature=af0d3b95daba1c100a5048cef5c787f5fb7782155af36e2d0ad5218b403a991a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**<(예비) Zoomed Camera Location>**


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/42cf42b1-6fa4-4368-934f-28207c567ba6/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q2XQMWA%2F20251029%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251029T141524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLXdlc3QtMiJIMEYCIQDpkLOlVY6VShBe1FKxeyZLUhZ2ar48m1yYmlY6mEstUwIhAJGEtR%2BWMNdh2bvB1qWY%2FiOTxCP1%2FRQw9vZP9f3mJhMXKogECNb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyxEwA689gZjtp4IdIq3APaYeVE0pod1Jc15LpEFYLKgBgK9lALSZF7rQeRwedC5KBNrKtCt8Ol1TFySlMxd1zFfsT%2FRAtgY3%2FZb1f1ZMMifg5z0m%2BkFwEZe2F76w0A5FJTLJL6fm0%2B38LBlFDplSXBt7d%2Fr1rjqQx1G4OEmqKp%2FnXS7m88GCAr4E%2FD6ypSGtadDefy3Eyr89bFXA515KCqCTJ%2F9SDJhF1byyDX8JpIJx3a7rLX1Mk%2Bldr7KUDYyUHxbMPKCnlH07szt15tyCdAXQqKmO2wq0Bn5Z93AQUChtOWf6EcsO3%2FbA%2BouSNqAbF0cbZQovEBLakGzc%2FkTYU2k6s2guZxSwNJIgi4THj2ADiHfdugTcCElYGBQ%2FcSKLBesYdjSdJsUAUskDGlXvHPhxupXQjNqOYN7FLrWa6%2FfzsDG7JiBPJbgS1zgTgFrlCnAa9%2FUfaBSw%2BPXls4608iRRlz7EOzG8U%2FtPqGgg5KSyhnLTAEat48H12aGCMXyy9zhtOtgBty573oqsWAsVOWdmNh4EVYhhEPS9wXugogZj9feYyYwPq4O61v8GCb6SlttHb5iiW4Pb4GgD%2B3Lscei8ceIZrkIuGs40H5OIqYryzcO9jgSe00FW35gyX7Rom%2FFgXbrt2LAPfqljCbpYjIBjqkAeBszEhQKDkjiFDAXvOBJoo7T%2Fx02Mxnar8qTkvxooIom%2FahC0eNeHDjlOSvQqtOnAIv2eeE6gsA8RjfZ2d2%2FbH6UwcQYjp2k7mbvjvi9trxzwe%2B%2FJ%2FTyC5Gf5j09fdUDnLHsMMWaXdw%2FFwn7HKpy4DFrGw81Cfeb3GWH8eVSYQYGDOHryyKqg8UMpm8FuqmgZA9TbsZGJagdb6Edo5%2FrEZDwNe1&X-Amz-Signature=73085316303d846dc3b57c77e0a0fa2f02d0b8d22037db0f1357c0571da130e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/6221a178-2bc4-4e12-a9c0-c6a24f513905/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466526XWDGX%2F20251029%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251029T141545Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLXdlc3QtMiJHMEUCIEVbdjdLmXGESpy0cBbp1gFpdOzk03xH2vfTcAJaAnq1AiEA4YAnjCWVswdMI%2Fo24u1o7ufV7Z9uyOTRr0CUzevCqqAqiAQI1v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2Mzc0MjMxODM4MDUiDAhXfjX3R0B%2BUYnB8yrcAz%2BkjutslTJFtVzErPhZJ3g2G86ThtFxjquLRIoWj5wNtnBYQ7%2FiS9VQvKRlVw%2F%2BUyAM43eh%2FFT5VtI5B7cAIGTLNI7%2BwxtLGxc5JcWXFlqAt1ZheMXYLZQBZAKsscwU6q7tekGB9G56jxEg%2FoIUVFnyN1QqR%2FJ7UQMK6DR408l3j%2F5H1ggt2AhL%2Bjszvi%2BZ8ulu%2B6IHqhmYwoLufWBkKG7%2BtKwzyttc2vwAuMussZv84yp7Glw1RF37ABVkC5J%2BJvkWmObXPN6J%2BUQns4a9XoyjHt02%2F3ozErQD3cm7SrOtUJM%2BPkZZmzd0FehsvgWax9jQVlOkcVSiv4BVSgTBdg5sjrqUlMkW9%2BPINSfy%2Bd5uyKQpG746ZXYOuLhZCXy0NHfuV%2Bv8BdaxtECNwnBMy7YAVug2heFxKKBKZbbGdOPtUVbciuc%2FkQtFg2NPpnnWk7lHxzkIl%2FHXAPHSfQhuKnjx4SxQKjz7cd2XP66JytjaF2YIIGZlaBKKQdbx0CaugkcArU0nb%2BWBhT166BZ0DeIhr5xhlBDXk2woAUQ9JICa7qX16TxLrX1bNd2a%2B7IhBeP%2BcVB8Ue80cBswvJmOTLOur4B5Uu7fcm225mHZLLczlQ8XszHw7I77wTdhMMWliMgGOqUBnrjDBCy2ZZWmFx5%2BRCfIF98jLYqvMRLAeX7Sw8IhlzqCgv1WUNJY6a%2FWeZHt7H4RFXUCClJHOOfc2AuqYJaT2%2BuKFpPIU7gBGQfm4iL0AbMzn27E9vyBrQnbEAE8DUX0Lmwes%2FI6ZT%2FF1SIfTQOOoYxYgftwYauZl6gT22og6HV07B%2F7naVXdQwEWsMrO3H7iJ0%2BUXLRnqlqJ9efNZwFgyYaSayz&X-Amz-Signature=b2f738a1dfb14d33c8b5dfe75e1cb3afa2d4579bb5523f242142996abdab8c90&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

7. 

## [에셋 수정 필요한 부분]


<Gun_Untitled>


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/a458cfb6-d2d3-464f-8e5c-b9cc7aa108ae/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q2XQMWA%2F20251029%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251029T141524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLXdlc3QtMiJIMEYCIQDpkLOlVY6VShBe1FKxeyZLUhZ2ar48m1yYmlY6mEstUwIhAJGEtR%2BWMNdh2bvB1qWY%2FiOTxCP1%2FRQw9vZP9f3mJhMXKogECNb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyxEwA689gZjtp4IdIq3APaYeVE0pod1Jc15LpEFYLKgBgK9lALSZF7rQeRwedC5KBNrKtCt8Ol1TFySlMxd1zFfsT%2FRAtgY3%2FZb1f1ZMMifg5z0m%2BkFwEZe2F76w0A5FJTLJL6fm0%2B38LBlFDplSXBt7d%2Fr1rjqQx1G4OEmqKp%2FnXS7m88GCAr4E%2FD6ypSGtadDefy3Eyr89bFXA515KCqCTJ%2F9SDJhF1byyDX8JpIJx3a7rLX1Mk%2Bldr7KUDYyUHxbMPKCnlH07szt15tyCdAXQqKmO2wq0Bn5Z93AQUChtOWf6EcsO3%2FbA%2BouSNqAbF0cbZQovEBLakGzc%2FkTYU2k6s2guZxSwNJIgi4THj2ADiHfdugTcCElYGBQ%2FcSKLBesYdjSdJsUAUskDGlXvHPhxupXQjNqOYN7FLrWa6%2FfzsDG7JiBPJbgS1zgTgFrlCnAa9%2FUfaBSw%2BPXls4608iRRlz7EOzG8U%2FtPqGgg5KSyhnLTAEat48H12aGCMXyy9zhtOtgBty573oqsWAsVOWdmNh4EVYhhEPS9wXugogZj9feYyYwPq4O61v8GCb6SlttHb5iiW4Pb4GgD%2B3Lscei8ceIZrkIuGs40H5OIqYryzcO9jgSe00FW35gyX7Rom%2FFgXbrt2LAPfqljCbpYjIBjqkAeBszEhQKDkjiFDAXvOBJoo7T%2Fx02Mxnar8qTkvxooIom%2FahC0eNeHDjlOSvQqtOnAIv2eeE6gsA8RjfZ2d2%2FbH6UwcQYjp2k7mbvjvi9trxzwe%2B%2FJ%2FTyC5Gf5j09fdUDnLHsMMWaXdw%2FFwn7HKpy4DFrGw81Cfeb3GWH8eVSYQYGDOHryyKqg8UMpm8FuqmgZA9TbsZGJagdb6Edo5%2FrEZDwNe1&X-Amz-Signature=f912c10a522e9c2018e04b5c3cf53a05057cc9412c3f635a9a38178155b84800&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/ea399bd5-26ab-4ea6-87a6-adb5fdba54fb/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q2XQMWA%2F20251029%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251029T141524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLXdlc3QtMiJIMEYCIQDpkLOlVY6VShBe1FKxeyZLUhZ2ar48m1yYmlY6mEstUwIhAJGEtR%2BWMNdh2bvB1qWY%2FiOTxCP1%2FRQw9vZP9f3mJhMXKogECNb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyxEwA689gZjtp4IdIq3APaYeVE0pod1Jc15LpEFYLKgBgK9lALSZF7rQeRwedC5KBNrKtCt8Ol1TFySlMxd1zFfsT%2FRAtgY3%2FZb1f1ZMMifg5z0m%2BkFwEZe2F76w0A5FJTLJL6fm0%2B38LBlFDplSXBt7d%2Fr1rjqQx1G4OEmqKp%2FnXS7m88GCAr4E%2FD6ypSGtadDefy3Eyr89bFXA515KCqCTJ%2F9SDJhF1byyDX8JpIJx3a7rLX1Mk%2Bldr7KUDYyUHxbMPKCnlH07szt15tyCdAXQqKmO2wq0Bn5Z93AQUChtOWf6EcsO3%2FbA%2BouSNqAbF0cbZQovEBLakGzc%2FkTYU2k6s2guZxSwNJIgi4THj2ADiHfdugTcCElYGBQ%2FcSKLBesYdjSdJsUAUskDGlXvHPhxupXQjNqOYN7FLrWa6%2FfzsDG7JiBPJbgS1zgTgFrlCnAa9%2FUfaBSw%2BPXls4608iRRlz7EOzG8U%2FtPqGgg5KSyhnLTAEat48H12aGCMXyy9zhtOtgBty573oqsWAsVOWdmNh4EVYhhEPS9wXugogZj9feYyYwPq4O61v8GCb6SlttHb5iiW4Pb4GgD%2B3Lscei8ceIZrkIuGs40H5OIqYryzcO9jgSe00FW35gyX7Rom%2FFgXbrt2LAPfqljCbpYjIBjqkAeBszEhQKDkjiFDAXvOBJoo7T%2Fx02Mxnar8qTkvxooIom%2FahC0eNeHDjlOSvQqtOnAIv2eeE6gsA8RjfZ2d2%2FbH6UwcQYjp2k7mbvjvi9trxzwe%2B%2FJ%2FTyC5Gf5j09fdUDnLHsMMWaXdw%2FFwn7HKpy4DFrGw81Cfeb3GWH8eVSYQYGDOHryyKqg8UMpm8FuqmgZA9TbsZGJagdb6Edo5%2FrEZDwNe1&X-Amz-Signature=2df62061a7c1f1166127ad48336f7c059a6d452943c7ea67e90b5169bd0c1f7a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/3fd1f95b-0c2a-814d-a4f4-00034e29ede8/2a7ab0d3-5ca4-4a36-b015-4d1a14bcf502/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB4664Q2XQMWA%2F20251029%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20251029T141524Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEB0aCXVzLXdlc3QtMiJIMEYCIQDpkLOlVY6VShBe1FKxeyZLUhZ2ar48m1yYmlY6mEstUwIhAJGEtR%2BWMNdh2bvB1qWY%2FiOTxCP1%2FRQw9vZP9f3mJhMXKogECNb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNjM3NDIzMTgzODA1IgyxEwA689gZjtp4IdIq3APaYeVE0pod1Jc15LpEFYLKgBgK9lALSZF7rQeRwedC5KBNrKtCt8Ol1TFySlMxd1zFfsT%2FRAtgY3%2FZb1f1ZMMifg5z0m%2BkFwEZe2F76w0A5FJTLJL6fm0%2B38LBlFDplSXBt7d%2Fr1rjqQx1G4OEmqKp%2FnXS7m88GCAr4E%2FD6ypSGtadDefy3Eyr89bFXA515KCqCTJ%2F9SDJhF1byyDX8JpIJx3a7rLX1Mk%2Bldr7KUDYyUHxbMPKCnlH07szt15tyCdAXQqKmO2wq0Bn5Z93AQUChtOWf6EcsO3%2FbA%2BouSNqAbF0cbZQovEBLakGzc%2FkTYU2k6s2guZxSwNJIgi4THj2ADiHfdugTcCElYGBQ%2FcSKLBesYdjSdJsUAUskDGlXvHPhxupXQjNqOYN7FLrWa6%2FfzsDG7JiBPJbgS1zgTgFrlCnAa9%2FUfaBSw%2BPXls4608iRRlz7EOzG8U%2FtPqGgg5KSyhnLTAEat48H12aGCMXyy9zhtOtgBty573oqsWAsVOWdmNh4EVYhhEPS9wXugogZj9feYyYwPq4O61v8GCb6SlttHb5iiW4Pb4GgD%2B3Lscei8ceIZrkIuGs40H5OIqYryzcO9jgSe00FW35gyX7Rom%2FFgXbrt2LAPfqljCbpYjIBjqkAeBszEhQKDkjiFDAXvOBJoo7T%2Fx02Mxnar8qTkvxooIom%2FahC0eNeHDjlOSvQqtOnAIv2eeE6gsA8RjfZ2d2%2FbH6UwcQYjp2k7mbvjvi9trxzwe%2B%2FJ%2FTyC5Gf5j09fdUDnLHsMMWaXdw%2FFwn7HKpy4DFrGw81Cfeb3GWH8eVSYQYGDOHryyKqg8UMpm8FuqmgZA9TbsZGJagdb6Edo5%2FrEZDwNe1&X-Amz-Signature=a71dfb7d3fe01deee37332a38c2715680c7c7ee804b29d34701a820a96358c17&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## [참조 사이트]

- **itch.io** - [https://itch.io/game-assets/tag-3d](https://itch.io/game-assets/tag-3d)
    - Animation Library - [https://quaternius.itch.io/universal-animation-library](https://quaternius.itch.io/universal-animation-library)
- **Sketchfab** - [https://sketchfab.com/features/free-3d-models](https://sketchfab.com/features/free-3d-models)
- **Mixamo** - [https://www.mixamo.com/](https://www.mixamo.com/)
- **모션 워핑(캐릭터 애니메이션 플레이 장소로 이동)** - [https://dev.epicgames.com/documentation/ko-kr/unreal-engine/motion-warping-in-unreal-engine?utm_source=chatgpt.com](https://dev.epicgames.com/documentation/ko-kr/unreal-engine/motion-warping-in-unreal-engine?utm_source=chatgpt.com)
