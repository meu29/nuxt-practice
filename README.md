sudo sysctl fs.inotify.max_user_watches=30000<br>
npm run dev<br><br>
変数(プロパティ)名はアンダースコア メソッド名は大文字<br>
storeディレクトリのファイル名にindex.tsは使えない("index/ミューテーション名"でコミットするとエラーになる)<br>
npx prisma init<br>
npx prisma migrate dev --name init<br>
Property '$data' does not exist on typeはメソッドの型を定義することで解決<br>
asyncData()はvueインスタンス作成前に実行 インスタンスのdataに値を入れるのに用いる thisは使えずcontextを引数に取りdataとなる値を返す<br>
fetch()はvueインスタンス作成後に実行 ストアのステートに値を入れるのに用いる 値は返さない<br>
最新バージョンのnuxtではfetch()でもdataへの入力ができるようになった contextは使わずthis.プロパティに直接値を入れる asyncData()はそのうちなくなるらしい<br>
```
async asyncData(context): Promise<{questions: Question[], index: number, correct_answer_count: number, judge: null | "正解" | "不正解", finish: boolean}> {

    const res = await context.$axios.get("http://localhost:3000/api/quiz");

    return {
        questions: res.data.questions,
        index: 0,
        correct_answer_count: 0,
        judge: null,
        finish: false
    }

}
```
フォームバリデーションの使い方 https://gist.github.com/meu29/2e6ce2d9e7a62285dc19b8cc37f34b09<br>