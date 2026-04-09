document.getElementById('user-footer').innerHTML = `
  <footer class="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-xs mt-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-5 py-8 lg:py-10">
      <div class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-10">
        <!-- 1. 로고 + 약관 + 계열사 -->
        <div class="flex flex-col gap-4 items-center lg:items-start">
          <a href="./user_song.html" class="no-underline"><span class="text-xl bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" style="font-family: 'Jalnan2', sans-serif;">SW</span><span class="text-lg text-orange-600" style="font-family: 'Jalnan2', sans-serif;">칸타빌레</span></a>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 list-none p-0 m-0 justify-center lg:justify-start">
            <li><a href="/terms?cate_cd=T01" class="text-gray-800 dark:text-gray-300 font-semibold no-underline hover:text-black dark:hover:text-white text-xs">개인정보취급방침</a></li>
            <li><a href="/terms?cate_cd=T02" class="text-gray-500 no-underline hover:text-black dark:hover:text-white text-xs">내부정보관리규정</a></li>
            <li><a href="/terms?cate_cd=T03" class="text-gray-500 no-underline hover:text-black dark:hover:text-white text-xs">이메일무단수집거부</a></li>
            <li><a href="/terms?cate_cd=T04" class="text-gray-500 no-underline hover:text-black dark:hover:text-white text-xs">윤리경영방침</a></li>
            <li><a href="/terms?cate_cd=T05" class="text-gray-500 no-underline hover:text-black dark:hover:text-white text-xs">부정행위접수</a></li>
          </ul>
          <ul class="flex flex-wrap gap-3 list-none p-0 m-0 justify-center lg:justify-start">
            <li><a href="http://withusent.com" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">withus</a></li>
            <li><a href="https://www.ziller.co.kr/Main.tjc?mp=main" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">SW커뮤니티</a></li>
            <li><a href="https://dream.fr" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">dream</a></li>
            <li><a href="https://www.realmastermall.com/index.asp" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">real master</a></li>
          </ul>
        </div>

        <!-- 2. 회사 정보 (lg에서 2행 span) -->
        <div class="lg:row-span-2 text-center lg:text-left">
          <h6 class="text-gray-800 dark:text-gray-300 text-sm font-bold mb-3 mt-0">SW칸타빌레㈜</h6>
          <p class="flex flex-wrap gap-x-6 gap-y-2 mb-2 text-xs leading-relaxed text-gray-600 dark:text-gray-500 justify-center lg:justify-start">
            <span>대표이사<br />윤나라</span>
            <span>서울특별시 마포구 월드컵북로 434 상암 IT Tower 8층</span>
            <span>사업자등록번호<br />130-81-44332</span>
          </p>
          <p class="flex flex-wrap gap-x-6 gap-y-2 mb-2 text-xs leading-relaxed text-gray-600 dark:text-gray-500 justify-center lg:justify-start">
            <span class="flex gap-x-6">
              <span>대표전화<br />02-3663-4700</span>
              <span>제품및AS문의 1577-5520</span>
            </span>
            <span>팩스<br />02-3665-3160</span>
          </p>
          <ul class="flex flex-wrap gap-x-3.5 gap-y-1 list-none p-0 pt-2 mt-0 border-t border-gray-200 dark:border-gray-800 justify-center lg:justify-start">
            <li><a href="https://smartcard.tjmedia.com" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">스마트카드</a></li>
            <li><a href="https://membership.tjmedia.com" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">대리점멤버십</a></li>
            <li><a href="https://membership.tjmedia.com" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">취급점멤버십</a></li>
            <li><a href="https://scm.tjmedia.com" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">협력업체</a></li>
            <li><a href="https://newsong.tjmedia.com" target="_blank" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">가정용반주기 신곡업데이트</a></li>
            <li><a href="/sitemap" class="text-gray-500 dark:text-gray-600 no-underline hover:text-gray-700 dark:hover:text-gray-400 text-xs">사이트맵</a></li>
          </ul>
        </div>

        <!-- 3. SNS + 카피라이트 (모바일/태블릿 맨 아래, lg에서 섹션1 아래) -->
        <div class="flex flex-col gap-2 items-center lg:items-start">
          <ul class="flex gap-2.5 list-none p-0 m-0">
            <li>
              <a href="https://smartstore.naver.com/tjmediacorp" target="_blank" title="스마트스토어" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/user/tjmedia00" target="_blank" title="유튜브" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://blog.naver.com/tjmedia00" target="_blank" title="블로그" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <text x="12" y="18" text-anchor="middle" font-size="20" font-weight="900" font-family="Arial, sans-serif">b</text>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/alwaysfunTJ" target="_blank" title="페이스북" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M14 6h2V3h-2.5c-2 0-3.5 1.5-3.5 3.5V9H8v3h2v9h3v-9h2.5l.5-3H13V7c0-.5.5-1 1-1z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/tjmedia" target="_blank" title="인스타그램" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </li>
          </ul>
          <p class="text-gray-500 dark:text-gray-600 text-[11px] lg:text-xs m-0 mt-4">Copyrightⓒ SW cantabile All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </footer>
`;
