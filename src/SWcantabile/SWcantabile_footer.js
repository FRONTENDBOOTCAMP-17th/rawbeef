document.getElementById('user-footer').innerHTML = `
  <footer class="bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 text-xs mt-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
    <div class="max-w-6xl mx-auto px-5 py-8 xl:py-10">
      <div class="grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-8 xl:gap-10">
        <!-- 1. 로고 + 약관 + 계열사 -->
        <div class="flex flex-col gap-4 items-center xl:items-start">
          <a href="./SWcantabile_song.html" class="no-underline"><span class="text-xl bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" style="font-family: 'Jalnan2', sans-serif;">SW</span><span class="text-lg text-orange-600" style="font-family: 'Jalnan2', sans-serif;">칸타빌레</span></a>
          <ul class="flex flex-wrap gap-x-4 gap-y-1 list-none p-0 m-0 justify-center xl:justify-start">
            <li><span class="text-gray-500 text-xs">이용약관</span></li>
            <li><span class="text-gray-500 text-xs">개인정보처리방침</span></li>
            <li><span class="text-gray-500 text-xs">환불규정</span></li>
          </ul>
        </div>

        <!-- 2. 회사 정보 (lg에서 2행 span) -->
        <div class="xl:row-span-2 text-center xl:text-left">
          <h6 class="text-gray-800 dark:text-gray-300 text-sm font-bold mb-3 mt-0">SW칸타빌레㈜</h6>
          <p class="flex flex-col xl:flex-row xl:flex-wrap gap-y-1 xl:gap-x-6 xl:gap-y-2 mb-1 text-xs leading-relaxed text-gray-600 dark:text-gray-500 items-center xl:items-start">
            <span>대표 : 나성영</span>
            <span>contact@likelion.net</span>
            <span>사업자 번호 : 264-88-01106</span>
          </p>
          <p class="flex flex-col xl:flex-row xl:flex-wrap gap-y-1 xl:gap-x-6 xl:gap-y-2 mb-2 text-xs leading-relaxed text-gray-600 dark:text-gray-500 items-center xl:items-start">
            <span>통신판매업 신고번호 : 2022-서울종로-1534</span>
            <span>주소 : 서울 종로구 종로3길17, 광화문D타워 D1동 16층, 17층</span>
          </p>
        </div>

        <!-- 3. SNS + 카피라이트 (모바일/태블릿 맨 아래, lg에서 섹션1 아래) -->
        <div class="flex flex-col gap-2 items-center xl:items-start">
          <ul class="flex gap-2.5 list-none p-0 m-0">
            <li>
              <a href="https://pf.kakao.com/_iyUBM" target="_blank" title="카카오채널" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M12 3C6.5 3 2 6.7 2 11.2c0 2.8 1.6 5.3 4 6.8l-.8 3.5 3.5-1.8c1 .2 2.1.4 3.3.4 5.5 0 10-3.7 10-8.2S17.5 3 12 3z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/channel/UCYaDkwVaOhuoe_LuFr3lWkA" target="_blank" title="유튜브" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://brunch.co.kr/@likelion" target="_blank" title="브런치" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <text x="12" y="18" text-anchor="middle" font-size="20" font-weight="900" font-family="Arial, sans-serif">b</text>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/likelion.net" target="_blank" title="페이스북" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path d="M14 6h2V3h-2.5c-2 0-3.5 1.5-3.5 3.5V9H8v3h2v9h3v-9h2.5l.5-3H13V7c0-.5.5-1 1-1z"/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/likelion.official/" target="_blank" title="인스타그램" class="inline-flex w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 items-center justify-center text-gray-700 dark:text-gray-400 hover:text-black dark:hover:text-white no-underline transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </li>
          </ul>
          <p class="text-gray-500 dark:text-gray-600 text-[11px] xl:text-xs m-0 mt-4">Copyrightⓒ 2026 SW cantabile All Rights Reserved.</p>
        </div>
      </div>
    </div>
  </footer>
`;
