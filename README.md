# health-screenings

- front: vue, typescript
- back: express, mySQL, sequelize

오프라인 설치

[준비]

     - node-v14.16.0-x64.msi 설치파일
     - 프로젝트 전체 압축 파일

[설치방법]

1. node.js와 npm을 설치한다.

   > node-v14.16.0-x64.msi 설치파일 실행 (node와 npm 한번에 설치되는 파일)
   >
   > CMD에서 설치 확인 및 버전 확인
   >
   > ```bash
   > C:\Users\4cgate>node -v
   > v14.16.0
   > ```
   >
   > ```bash
   > C:\Users\4cgate>npm -v
   > 6.14.11
   > ```

2. 프로젝트를 실행한다.

   2.1. back-end

   > back 폴더 접근
   >
   > .env.production 파일 확인
   >
   > ```
   > // back-end (server) 설정
   > PORT=(server port / 9528)
   >
   > // front-end (client) 설정
   > CLIENT_HOST=(client ip / localhost)
   > CLIENT_PORT=(client port / 9527)
   >
   > // DB 설정
   > DB_USERNAME=(DB username / root)
   > DB_PASSWORD=(DB password / eum5890)
   > DB_DATABASE=(DB name / fc_ems)
   > DB_HOST=(DB ip / localhost)
   > DB_PORT=(DB port / 3307)
   > ```
   >
   > 실행
   >
   > ```bash
   > C:\...\back> npm run start:prod
   > ```

   2.2. front-end

   > front 폴더 접근
   >
   > .env.production 파일 확인
   >
   > ```
   > // front-end (client) 설정
   > VUE_APP_BASE_URL=(client ip / localhost)
   > VUE_APP_PORT=(client port / 9527)
   > PORT=(client port / 9527)
   >
   > // back-end (server) 설정
   > VUE_APP_SERVER_API=(server ip / localhost)
   > VUE_APP_SERVER_PORT=(server port / 9528)
   > ```
   >
   > 실행
   >
   > ```bash
   > C:\...\front> npm run start:prod
   > ```

둘 다 실행(start:prod) 상태여야 동작!
