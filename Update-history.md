# kubeconfig-updater-gui Roadmap

This file only provide Korean version.

# v0.0.1
DueDate: 2021-12-21

### Frontend
1. 클러스터 등록하는 화면 개발

### Backend
1. Cluster Metadata Resolver 인터페이스 개발 
   - Fox, Aws, Azure, Tencent 구현체 개발
2. Cluster Register RPC 개발
3. Cred Resolver 인터페이스 개발
   - Aws, Azure, Tencent 구현체 개발

### Application 전체
1. 로컬 빌드 스크립트 추가
2. Frontend에서 Backend 프로세스 생명주기 관리하는 기능 개발 

# v0.0.2

### Application 전체
1. CI 환경설정

# v0.1.0
DueDate: 2021-12-23

### Frontend
1. 뷰 설정/저장 기능 개발
2. 메인페이지 리팩토링
   - 멀티 셀렉트 기능 추가
   - Progress 바 추가
3. About 페이지 추가
4. OS 테마 기준으로 테마 불러오는 기능 추가

### Backend
1. Cluster Metadata Resolver 추가 구현체 개발, Local Kubeconfig
2. Application Config 기능 추가
   - 불러오고 사용하는 기능만 개발 (Default Config 없음)
3. Application 전반적인 기능 개발
   - Process Signal 수신시 안전하게 종료
   - 서버 버전과 핑 확인하는 RPC 개발
   - Controller / Service / Persist 레이어간 의존성 문제 해결
4. SyncAvailableClusters RPC ThreadSafe하게 만들기

### Application 전체
1. Frontend에서 Backend 프로세스를 죽일 때 자식의 자식이 죽지 않는 문제 해결

# v0.1.1

### Application 전체
1. MacOS빌드가 실행되지 않는 문제 해결

# v0.2.0
DueDate: 2021-12-31

### Frontend
1. Cred Resolver 화면 개발
2. Frontend Config 화면 개발
   - 테마 바꾸는 기능 및 옵션 추가

### Backend
1. Application Default Config Resolve 방안 설정 (개발 아님)
2. Cred Resolver 제안 기능 개발
3. Cred Resolver 상태 확인 기능 개발

### Application 전체
1. MacOS용 빌드 유니버셜로 배포
2. MacOS용 빌드 애플 공인된 인증서로 사인
3. 공통 Static Variable들 Protobuf로 이동

# v0.x.0

### Backend
1. Lens 자동 등록 기능 개발
   - hotbar 자동 등록
   - 벤더별 클러스터 자동 커스터마이징 설정 주입
