sudo sysctl fs.inotify.max_user_watches=30000<br>
npm run dev<br><br>
storeディレクトリのファイル名にindex.tsは使えない("index/ミューテーション名"でコミットするとエラーになる)<br>
npx prisma init<br>
npx prisma migrate dev --name init<br>